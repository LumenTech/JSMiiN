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

var nextId = 0;

const procRR = function(buf, flag, state) {
  var thisRR = {};
  thisRR['NAME'] = getname.call(this, buf, 'rxpoint', state);
  $jii.log('NAME: ' + thisRR['NAME'], 1);
  $jii.log('PNT1:  ' + state.rxpoint, 1);
  thisRR['TYPE'] = (buf[state.rxpoint++] << 8) + buf[state.rxpoint++];
  $jii.log('TYPE:  ' + thisRR['TYPE'], 9);
  $jii.log('PNT2:  ' + state.rxpoint, 1);
  thisRR['CLASS'] = (buf[state.rxpoint++] << 8) + buf[state.rxpoint++];
  $jii.log('CLASS:  ' + thisRR['CLASS'], 9);
  $jii.log('PNT3:  ' + state.rxpoint, 1);
  thisRR['TTL'] = (buf[state.rxpoint++] << 24) + (buf[state.rxpoint++] << 16) + //->
            (buf[state.rxpoint++] << 8)  + (buf[state.rxpoint++] << 0);
  $jii.log('TTL:  ' + thisRR['TTL'], 1);
  $jii.log('PNT4:  ' + state.rxpoint, 1);
  thisRR['RDLENGTH'] = (buf[state.rxpoint++] << 8) + buf[state.rxpoint++];
  $jii.log('RDLENGTH:  ' + thisRR['RDLENGTH'], 1);
  $jii.log('PNT5:  ' + state.rxpoint, 1);
  if ($jii.rr._[thisRR['TYPE']] !== undefined) {
    thisRR['TYPENAME'] = $jii.rr._[thisRR['TYPE']];
    $jii.log('TYPENAME: ' + thisRR['TYPENAME'], 1);
    state.rdatapoint = state.rxpoint;
    thisRR['RDATA'] = $jii.rr[thisRR['TYPENAME']].rdata.from.call(this, buf, state, thisRR['RDLENGTH']);
  } else {
    thisRR['TYPENAME'] = 'TYPE' + thisRR['TYPE'];
    thisRR['RDATA'] = buf.toString('ascii', buf[state.rxpoint], buf[state.rxpoint] + thisRR['RDLENGTH']);
  }
  state.rxpoint += thisRR['RDLENGTH'];
  $jii.cache.insert(thisRR);
  $jii.log('RDATA:  ' + thisRR['RDATA'], 9);
  $jii.log('PNT6:  ' + state.rxpoint, 1);
  return thisRR;
}

const getname = function (buf, flag, state) {
  var retVal = '', thisIndex = state[flag], wasPointed = 0, wasIncr = 0;
  while (buf[thisIndex]) {
    wasIncr ++;
    if (buf[thisIndex] & 0xc0) { // Pointer
      if (!(wasPointed)) { state[flag] += 2; };
      wasPointed += 1;
      thisIndex = ((buf[thisIndex] & 0x3f) << 8) + buf[thisIndex +1];
    } else { // Length
      state[flag] += (wasPointed) ? 0 : buf[thisIndex] + 1;
      retVal += (retVal.length) ? '.' : '';
      retVal += buf.toString('ascii', thisIndex +1, thisIndex + buf[thisIndex] +1);
      thisIndex += buf[thisIndex] +1;
    }
  }
  if ((wasIncr) && (!(wasPointed))) { state[flag] += 1; }; // Zero-length terminator
  $jii.log('NAME: ' + retVal, 9);
  return retVal;
}

const addname = function (name, buf, flag, state) {
  if (flag === undefined) { flag = 'txpoint'; };
  var retVal = '', thisIndex = state[flag], wasPointed = 0, wasIncr = 0;
  const names = name.split('.');
  while (names.length) {
    const thisName = names.join('.');
    $jii.log('ADDNAME0: ' + thisName, 1);
    if (thisName in state._names.full) {
      $jii.log('ADDNAME!', 1);
      buf.writeUInt16BE((0xc000 | state._names.full[thisName]), state[flag]);
      state[flag] += 2; 
      wasPointed += 1;
      names.splice(0, names.length);
    } else {
      state._names.full[thisName] = state[flag];
      const label = names.shift();
      buf[state[flag]++] = label.length;
      buf.write(label, state[flag], label.length, 'ascii');
      state[flag] += label.length;
      $jii.log('ADDNAME1: ' + label, 1)
    }
  }
  if (!(wasPointed)) { buf[state[flag]++] = 0; } // Zero-length terminator
  $jii.log('ADDNAME2: ' + name, 1);
  $jii.log(state._names.full, 1);
  $jii.log('ADDNAME3: ' + name, 1);
  $jii.debug(buf, 1);
  return retVal;
}

$jii.packet = function packet(rx, proto, port) {
  //$jii.log('id: ' + rx.charCodeAt(0), 1);
  var tx, state = { _names: { full: {}, part: {} }} //->
   ,ID = 0, QR = 0, OPCODE = 0, AA = 0, TC = 0, RD = 0 //->
   ,RA = 0, Z = 0, RCODE = 0 //->
   ,QDCOUNT = 0, ANCOUNT = 0, NSCOUNT = 0, ARCOUNT = 0;
  const QUERY = [], ANS = [], NS = [], ADD = [];
  this.dump = function () {
    $jii.log(`ID: ${ID}`, 2);
    $jii.log(`QR: ${QR}`, 2);
    $jii.log(`OPCODE: ${OPCODE}`, 2);
    $jii.log(`TC: ${TC}`, 2);
    $jii.log(`RD: ${RD}`, 2);
    $jii.log(`RA: ${RA}`, 2);
    $jii.log(`Z: ${Z}`, 2);
    $jii.log(`RCODE: ${RCODE}`, 2);
    $jii.log(`QDCOUNT: ${QDCOUNT}`, 2);
    $jii.log(`ANCOUNT: ${ANCOUNT}`, 2);
    $jii.log(`NSCOUNT: ${NSCOUNT}`, 2);
    $jii.log(`ARCOUNT: ${ARCOUNT}`, 2);
  }
  this.create = function (query, ans, ns, add, flag, rcode, fopts) {
    tx = Buffer.alloc(4096); // Define Max ?? (FindMe!!)
    if (fopts === undefined) { fopts = {}; };
//    ID = (rx[0] << 8) + rx[1];
    nextId += Math.floor((Math.random() * 30));
    if (nextId > 65535) { nextId -= 65536; };
    ID = $jii.ub(fopts.ID, nextId);
    tx.writeUInt16BE(ID, 0);
    $jii.log ('CRQUERY: ', 1);
    $jii.debug(query, 1);
//    QR = (rx[2] & 0x80) >> 7;
    QR = $jii.ub(fopts.QR, 0);
//    OPCODE = (rx[2] & 0x78) >> 3;
    OPCODE = $jii.ub(fopts.OPCODE, 0);
//    AA = (rx[2] & 0x04) >> 2;
    AA = $jii.ub(fopts.AA, 0);
//    TC = (rx[2] & 0x02) >> 1;
    TC = $jii.ub(fopts.TC, 0);
//    RD = (rx[2] & 0x01) >> 0;
    RD = $jii.ub(fopts.RD, 0);
    RD = 1; // Testing, just recursion requested
    
    tx[2] = ((QR & 0x01) << 7) + ((OPCODE & 0x0f) << 3) + //->
      ((AA & 0x01) << 2) + ((TC & 0x01) << 1) + (RD & 0x01);
//    RA = (rx[3] & 0x80) >> 7;
    RA = $jii.ub(fopts.RA, 0);
//    Z = (rx[3] & 0x70) >> 4;
    Z = $jii.ub(fopts.Z, 0);
//    RCODE = (rx[3] & 0x0f) >> 0;
    RCODE = $jii.ub(rcode, $jii.ub(fopts.RCODE, 0));
    tx[3] = ((RA & 0x01) << 7) + ((Z & 0x07) << 4) + //->
      (RCODE & 0x0f);

//    QDCOUNT = (rx[4] << 8) + rx[5];
    tx.writeUInt16BE(query.length, 4);
//    ANCOUNT = (rx[6] << 8) + rx[7];
    tx.writeUInt16BE(((ans !== undefined) ? ans.length : 0), 6);
//    NSCOUNT = (rx[8] << 8) + rx[9];
    tx.writeUInt16BE(((ns !== undefined) ? ns.length : 0), 8);
//    ARCOUNT = (rx[10] << 8) + rx[11];
    tx.writeUInt16BE(((add !== undefined) ? add.length : 0), 10);
//    state.rxpoint = 12;
    state.txpoint = 12;
    // Process Queries
    for (var cntRR = 0; cntRR < query.length; cntRR ++) {
      this.addname(query[cntRR].NAME, 'txpoint');
      tx.writeUInt16BE(query[cntRR].TYPE, state['txpoint']);
      state['txpoint'] += 2;
      tx.writeUInt16BE(query[cntRR].CLASS, state['txpoint']);
      state['txpoint'] += 2;
    }
    
    var RRbs = [ans, ns, add];
    for (var cntRRb = 0; cntRRb < RRbs.length; cntRRb ++) {
      const thisRRb = RRbs[cntRRb];
      for (var cntRR = 0; cntRR < thisRRb.length; cntRR ++) {
        this.addname(thisRRb[cntRR].NAME, 'txpoint');
        tx.writeUInt16BE(thisRRb[cntRR].TYPE, state['txpoint']);
        state['txpoint'] += 2;
        tx.writeUInt16BE(thisRRb[cntRR].CLASS, state['txpoint']);
        state['txpoint'] += 2;
        tx.writeUInt32BE(thisRRb[cntRR].TTL, state['txpoint']);
        state['txpoint'] += 4;
        tx.writeUInt16BE(thisRRb[cntRR].RDLENGTH, state['txpoint']);
        state['txpoint'] += 2;
        
        if ($jii.rr._[thisRRb[cntRR].TYPE] !== undefined) {
          thisRRb[cntRR].TYPENAME = $jii.rr._[thisRRb[cntRR].TYPE];
          $jii.log('TYPENAME: ' + thisRRb[cntRR].TYPENAME, 1);
          state.rdatapoint = state.txpoint;
          thisRRb[cntRR].RDATA = $jii.rr[thisRRb[cntRR].TYPENAME].rdata.to.call(this, tx, state, thisRRb[cntRR].RDATA);
        } else if (thisRRb[cntRR].TYPENAME === 'TYPE' + thisRRb[cntRR].TYPE) {
          thisRRb[cntRR].RDATA = tx.write(thisRRb[cntRR].RDATA, state.txpoint, state.txpoint + thisRRb[cntRR].RDLENGTH, 'ascii');
        } // Check here for other?? (FindMe!!)
        state['txpoint'] += thisRRb[cntRR].RDLENGTH;
      }
    }
  }
  this.id      = function ()     { return ID; };
  this.queries = function ()     { return QUERY; };
  this.getname = function (a, b) { return getname.call(this, a, b, state) };
  this.addname = function (a, b) { return addname.call(this, a, tx, b, state) };
  this.towire  = function ()     { return tx.subarray(0, state.txpoint); };
//  this.toresp  = function ()     { return (QUERY, ANS, NS, ADD); };
  this.toresp  = function ()     { return [QUERY, ANS, NS, ADD, ]; };
  
  if (rx instanceof Buffer) { // Parse from WIRE
    ID = (rx[0] << 8) + rx[1];
    QR = (rx[2] & 0x80) >> 7;
    OPCODE = (rx[2] & 0x78) >> 3;
    AA = (rx[2] & 0x04) >> 2;
    TC = (rx[2] & 0x02) >> 1;
    RD = (rx[2] & 0x01) >> 0;
    RA = (rx[3] & 0x80) >> 7;
    Z = (rx[3] & 0x70) >> 4;
    RCODE = (rx[3] & 0x0f) >> 0;
    QDCOUNT = (rx[4] << 8) + rx[5];
    ANCOUNT = (rx[6] << 8) + rx[7];
    NSCOUNT = (rx[8] << 8) + rx[9];
    ARCOUNT = (rx[10] << 8) + rx[11];
    state.rxpoint = 12;

    // Queries
    for (var cntRec = 0; cntRec < QDCOUNT; cntRec++) {
      var thisQuery = {};
      thisQuery.NAME = getname.call(this, rx, 'rxpoint', state);
      $jii.log('NAME: ' + thisQuery.NAME, 1);
      $jii.log('PNT1:  ' + state.rxpoint, 1);
      thisQuery.TYPE = (rx[state.rxpoint++] << 8) + rx[state.rxpoint++];
      $jii.log('QTYPE:  ' + thisQuery.TYPE, 1);
      if ($jii.rr._[thisQuery['TYPE']] !== undefined) {
        thisQuery['TYPENAME'] = $jii.rr._[thisQuery['TYPE']];
      } else {
        thisQuery['TYPENAME'] = 'TYPE' + thisQuery.TYPE;
      }
      thisQuery.CLASS = (rx[state.rxpoint++] << 8) + rx[state.rxpoint++];
      $jii.log('QCLASS:  ' + thisQuery.CLASS, 1);
      $jii.log('PNT2:  ' + state.rxpoint, 1);
      QUERY[QUERY.length] = thisQuery;
    }

    if (QR) { // Is Response
      for (var cntRec = 0; cntRec < ANCOUNT; cntRec++) {
        ANS.push(procRR.call(this, rx, 'rxpoint', state));
      }

      for (var cntRec = 0; cntRec < NSCOUNT; cntRec++) {
        NS.push(procRR.call(this, rx, 'rxpoint', state));
      }

      for (var cntRec = 0; cntRec < ARCOUNT; cntRec++) {
        ADD.push(procRR.call(this, rx, 'rxpoint', state));
      }
    }
    $jii.debug(rx, 1);
  }
};

$jii.log('"packet" Loaded', 1);

