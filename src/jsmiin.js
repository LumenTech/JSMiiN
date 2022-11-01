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

global.$jii = {};
require("./lib/conf");
require("./lib/util");
// Simple boolean helper function
$jii.ub = function(a, b) { return (a === undefined) ? ((b === undefined) ? 1 : b) : a; };

// Define feedback functions
$jii.log   = function(a,b){ if ($jii.ub(b) >= $jii.conf.feedback.log)   {console.log  (a)} };
$jii.debug = function(a,b){ if ($jii.ub(b) >= $jii.conf.feedback.debug) {console.debug(a)} };
$jii.error = function(a,b){ if ($jii.ub(b) >= $jii.conf.feedback.error) {console.error(a)} };

// Load RR Libraries
require("./lib/rr");

// Start JSMiiN Service
require("./lib/service");

