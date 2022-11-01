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

$jii.util = {
  "has" : function (key, value, arr) {
    var retVal = 0;
    for (var cntEl = 0; cntEl < arr.length; cntEl ++) {
      if ((key in arr[cntEl]) && (arr[cntEl][key] === value)) {
        retVal = 1;
        break;
      }
    }
    return retVal;
  }
 ,"find" : function (key, value, arr, fopts) {
    var retVal = [];
    if (arr !== undefined) {
      for (var cntEl = 0; cntEl < arr.length; cntEl ++) {
        if ((key in arr[cntEl]) && (arr[cntEl][key] === value)) {
          retVal[retVal.length] = arr[cntEl];
          if ((fopts) && ('length' in fopts) && (retVal.length >= fopts.length)) { break; };
        }
      }
    }
    return (retVal.length) ? retVal : undefined;
  }
 ,"dupe" : function (obIn, source, add, fopts) {
    const retVal = (obIn === undefined) ? {} : obIn;
    for (var thisAttr in source) {
      retVal[thisAttr] = source[thisAttr];
    }
    if (add instanceof Object) {
      for (var thisAttr in add) {
        retVal[thisAttr] = add[thisAttr];
      }
    }
    return retVal;
  }
};

if ($jii.conf.feedback.log <= 1) {
  $jii.log('"util" Loaded', 1);
}

