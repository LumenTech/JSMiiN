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
// (FindMe!!)
$jii.rr._[12] = "ptr"; 
$jii.rr.ptr = {
  "rdata" : {
    "from" : function(cx, state, len) {
      return this.getname(cx, 'rdatapoint');
    }
  }
};

$jii.log('"ptr" loaded', 1);
