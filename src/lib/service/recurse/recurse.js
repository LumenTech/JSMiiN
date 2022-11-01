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

$jii.recurse = {
};

const queue = {};

// UDP4 Service
const dgram = require('dgram');
$jii.recurse['udp4'] = {
  // Set up pool to efficiently randomize (FindMe!!)
  "_" : dgram.createSocket('udp4')
 ,"send" : (msg, port, addr, cb) => {
    $jii.log('RCRSENDING', 9);
    queue[msg.readUInt16BE() + '|' + addr + '|' + port] = cb;
    $jii.log('RECURSEOUT: ' + msg.readUInt16BE(), 9);
    $jii.recurse['udp4']._.send(msg, port, addr);
  }
};

$jii.recurse['udp4']._.on('error', (err) => {
  $jii.log(`server error:\n${err.stack}`, 1);
  $jii.recurse['udp4']._.close();
});

$jii.recurse['udp4']._.on('message', (msg, rinfo) => {
  $jii.debug(rinfo, 9);
  var packet = new $jii.packet(msg);
  $jii.log('RECURSEIN: ' + packet.id(), 9);
  $jii.log(queue, 9);
  const cbsig = packet.id() + '|' + rinfo.address + '|' + rinfo.port;
  if (cbsig in queue) {
    const cb = queue[cbsig];
    $jii.log(delete(queue[cbsig]), 9);
    cb.apply(this, packet.toresp()); // Test (FindMe!!)
  }
  ///packet.dump();
  ///$jii.cache.show();
  $jii.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`, 1);
});

$jii.log('"recurse" Loaded', 1);

