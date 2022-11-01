'use strict';
/*
             \|/     |  /--\  |\ /|        |\  |
            --O--    |  |     | | |  o  o  | | |
      \|/    /|\     |  |     | | |        | | |
     --O--  /        |  \--\  | | |  |  |  | | |
      /|\  /         |     |  | | |  |  |  | | |
         \/          |     |  |   |  |  |  | | |
         /\       ---/  ---/  |   |  |  |  |  \|

  Copyright (c) 2020 CenturyLink Communications, LLC.
  SEE LICENSE-MIT FOR LICENSE TERMS
  SEE CREDITS FOR CONTRIBUTIONS AND CREDITS FOR THIS PROJECT
*/

const RESOLUTION = 60; // 1 minute
const names = {};
const block = {}; // Time Block
const data  = {}; // Cache Data

names[''] = []; // Prime cache with root nameservers
for (var thisRoot in $jii.conf.root) {
  thisRoot = thisRoot.substr(0, thisRoot.length -1);
  names[''].push (
    {
      NAME: ''
     ,TYPE: 2
     ,TYPENAME: 'ns'
     ,RDATA: thisRoot
    }
  );
  names[thisRoot] = [
    {
      NAME: thisRoot
     ,TYPE: 1
     ,TYPENAME: 'a'
     ,RDATA: $jii.conf.root[thisRoot + '.'][0]
    }
   ,{
      NAME: thisRoot
     ,TYPE: 28
     ,TYPENAME: 'aaaa'
     ,RDATA: $jii.conf.root[thisRoot + '.'][1]
    }
  ];
}

$jii.cache = {
  "resolve" : function(msg, rinfo, callback) {
    const opayload = msg;
    const info = {};
    $jii.debug(rinfo, 1);
    var packet, queries;
    if (msg instanceof Buffer) { // Process msg??
      packet = new $jii.packet(msg);
      queries = packet.queries();
      $jii.util.dupe(info, rinfo, { queries: queries, id: packet.id() });
      packet.dump();
    } else { // Just queries
      packet = new $jii.packet(msg);
      queries = msg;
      $jii.util.dupe(info, rinfo);
      //packet.create(queries);
      //packet.addname('test.util.com');
      //packet.addname('test3.util.com');
      //packet.addname('www.test3.util.com');
      //packet.addname('ww2.test3.util.com');
      
      //$jii.recurse['udp4'].send(packet.towire(), 53, "198.6.1.1", (err) => {});
      //packet.dump();
    }
    if (queries.length) { // Good query
      // Add support for multiple queries ?? (FindMe!!)
      if (queries[0].NAME in names) { // QNAME in cache
        //var resp = packet.response();
        //callback(resp, addr, port);
        if ($jii.util.has('TYPE', queries[0].TYPE, names[queries[0].NAME])) {
          $jii.log("TYFOUND!!" + queries[0].NAME, 1);
          $jii.debug(queries, 1);
          //callback toresp
          //query, ans, ns, add, flag, rcode, fopts
          $jii.debug(msg, 9);
          $jii.log(info, 9);
          var ANS = $jii.util.find('TYPE', queries[0].TYPE, names[queries[0].NAME] /*, { length: 1 } */);
          packet.create(info.queries, ANS, [], [], {}, $jii.rcode.NOERROR, { ID: info.id, QR : 1 });
          callback(packet.towire(), info.address, info.port);
        } else if ($jii.util.has('TYPE', 2, names[queries[0].NAME])) { // NS TYPE
          $jii.log("NSFOUND!!" + queries[0].NAME, 1);
          var NSs = $jii.util.find('TYPE', 2, names[queries[0].NAME] /*, { length: 2 } */);
          var ADDs = [];
          $jii.debug(NSs, 1);
          for (var cntNS = 0; cntNS < NSs.length; cntNS ++) {
            var RRs = $jii.util.find('TYPE', queries[0].TYPE, names[NSs[cntNS].RDATA] /*, { length: 1 } */);
            if (RRs !== undefined) {
              for (var cntRR = 0; cntRR < RRs.length; cntRR ++) {
                ADDs.push(RRs[cntRR]);
              }
            }
          }
          $jii.debug(queries, 1);
          $jii.debug(callback);
          callback(queries, [], NSs, ADDs, {}, $jii.rcode.NOERROR, {});
        } else {
          $jii.debug("NOTFOUND!!" + queries[0].NAME, 9);
          $jii.debug(names, 9);
          $jii.debug(names[queries[0].NAME], 9);
          $jii.debug(queries, 9);
          $jii.debug(info, 9);
        }
      } else { // Hunt for answer
        $jii.debug(info, 9);
        var thisName = queries[0].NAME.split('.').splice(1).join('.');
        $jii.log('RESNAME: ' + thisName, 9);
          $jii.cache.resolve( [{
            NAME: thisName, 
            TYPE: queries[0].TYPE,
            TYPENAME: queries[0].TYPENAME,
            CLASS: queries[0].CLASS }], info,
            function qtname(query, ans, ns, add, flag, rcode, fopts) {
              $jii.log('RES_CB', 9);
              $jii.debug(queries, 9);
              $jii.debug(info.queries, 9);
              $jii.debug(query, 9);
              //$jii.debug(ns, 9);
              //$jii.debug(add, 9);
              ///callback({test: 'query'});
              packet.create(info.queries, [], [], [], {}, 0, fopts);
              // Round-robin these! (FindMe!!)
              if ((add.length) && (add[0].TYPE == 1)) { // IPv4 Only -- Connect to IPv6 Elsewhere! (FindMe!!)
                $jii.log('QUERYY:', 9);
                $jii.recurse['udp4'].send(packet.towire(), 53, add[0].RDATA, function qout(err, msg, cb) {
                  $jii.log('INNER', 9);
                  ///$jii.debug(callback, 9);
                  if (opayload instanceof Buffer) {
                    $jii.debug($jii.cache.show(), 9);
                  } else {
                    callback(query, ans, ns, add, flag, rcode, fopts);
                  }
                });
              }
            }
          );
        ///$jii.recurse['udp4'].send(msg, 53, $jii.conf.root["a.root-servers.net."][0], (err) => {});
      }
    } else {
      callback(queries, [], [], [], {}, $jii.rcode.FORMERR, fopts);
    }
  }
 ,"insert" : function(item) {
   if (!(item.NAME in names)) { names[item.NAME] = []; };
   names[item.NAME].push(item);
   //$jii.debug(names, 9);
  }
 ,"delete" : function(name) {
  }
 ,"show" : function() {
    $jii.log('SHOWCACHE', 9);
    $jii.debug(names, 9);
  }
};

$jii.log('"cache" Loaded', 1);

