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

const service = {};

require('./packet');
require('./cache');
require('./recurse');

var packets = {};

// UDP4 Service
const dgram = require('dgram');
service['udp4'] = dgram.createSocket('udp4');

/////////////////////////////////////////////////////////////


service['udp4'].on('error', (err) => {
  $jii.log(`server error:\n${err.stack}`, 1);
  service['udp4'].close();
});

service['udp4'].on('message', (msg, rinfo) => {
  const info = {};
  $jii.util.dupe(info, rinfo, { proto: 'udp4' });
  $jii.cache.resolve(msg, info, function(msg, addr, port) {
    ////query, ans, ns, add, flag, rcode, fopts
    $jii.debug(msg, 9);
    $jii.log('RESOLVED: ' + info);
    service['udp4'].send(msg, port, addr, (err) => {});
  });
  //var pack = new $jii.packet(msg);
  //pack.dump();
  $jii.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`, 1);
  //$jii.recurse['udp4'].send(msg, 53, '205.171.3.65', (err) => {});
  //$jii.recurse['udp4'].send(msg, 53, '198.41.0.4', (err) => {});
  //$jii.recurse['udp4'].send(msg, 53, '192.12.94.30', (err) => {});
  //$jii.recurse['udp4'].send(msg, 53, '207.204.40.105', (err) => {});
  ////$jii.recurse['udp4'].send(msg, 53, $jii.conf.root["a.root-servers.net."][0], (err) => {});
});
service['udp4'].on('listening', () => {
  const address = service['udp4'].address();
  $jii.log(`server listening UDP ${address.address}:${address.port}`, 1);
});

service['udp4'].bind($jii.conf.udp.port);


// HTTP Service (DoH) // Nonfunctional!! (FindMe!!)
const http = require("http");

http.createServer(function (request, response) {
  // Send the HTTP header 
  // HTTP Status: 200 : OK
  // Content Type: text/plain
  response.writeHead(200, {'Content-Type': 'text/plain'});

  // Send the response body as "Hello World"
  response.end('Hello World\n');
}).listen(8081);

// Console will print the message
$jii.log('Server running at http://127.0.0.1:8081/', 1);

$jii.service = service;

$jii.log('"service" Loaded', 1);

