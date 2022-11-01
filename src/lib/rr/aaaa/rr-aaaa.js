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

$jii.rr._[28] = "aaaa"; 
$jii.rr.aaaa = {
  "rdata" : {
    "from" : function(cx, state, len) {
      var thisPoint = state.rdatapoint;
      return cx.toString('hex', thisPoint, thisPoint +len);
    }
  }
};

$jii.log('"aaaa" loaded', 1);
