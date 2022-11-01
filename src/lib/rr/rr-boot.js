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

$jii.rr = {
    "_" : {} // Numeric Translation
};
require('./a');
require('./ns');
require('./cname');
require('./soa');
require('./ptr');
require('./aaaa');

// RCODE Translation
$jii.rcode = {
   0 : 'NOERROR'
 , 1 : 'FORMERR'
 , 2 : 'SERVFAIL'
 , 3 : 'NXDOMAIN'
 , 4 : 'NOTIMP'
 , 5 : 'REFUSED'
 , 6 : 'YXDOMAIN'
 , 7 : 'YXRRSET'
 , 8 : 'NXRRSET'
 , 9 : 'NOTAUTH'
 ,10 : 'NOTZONE'
 ,11 : 'DSOTYPENI'
 ,'NOERROR'   :  0 
 ,'FORMERR'   :  1 
 ,'SERVFAIL'  :  2 
 ,'NXDOMAIN'  :  3 
 ,'NOTIMP'    :  4 
 ,'REFUSED'   :  5 
 ,'YXDOMAIN'  :  6 
 ,'YXRRSET'   :  7 
 ,'NXRRSET'   :  8 
 ,'NOTAUTH'   :  9 
 ,'NOTZONE'   : 10
 ,'DSOTYPENI' : 11
};

$jii.log('"rr" Loaded', 1);
