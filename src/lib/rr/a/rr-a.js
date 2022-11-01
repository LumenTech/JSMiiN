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

$jii.rr._[1] = "a"; 
$jii.rr.a = {
  "type" : 1
 ,"rdata" : {
    "to" : function(cx, state, rdata) {
      var thisPoint = state.rdatapoint;
      const octet = rdata.split('.');
      for (var cntOct = 0; cntOct < 4; cntOct ++) {
        cx[thisPoint +cntOct] = octet[cntOct];
      }
    }
   ,"from" : function(cx, state, len) {
      var thisPoint = state.rdatapoint;
      return cx[thisPoint++].toString(10) + '.' + //->
             cx[thisPoint++].toString(10) + '.' + //->
             cx[thisPoint++].toString(10) + '.' + //->
             cx[thisPoint++].toString(10);
    }
  }
};

$jii.log('"a" loaded', 1);
