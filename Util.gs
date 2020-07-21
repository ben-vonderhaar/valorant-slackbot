/**
 * Resets availability graph to show not available for all users.
 */
function resetAvailablityGraphState() {
  
  var AVAILABILITY_GRAPH_TABLES = getAllAvailabilityGraphTables();
  
  for (var i in AVAILABILITY_GRAPH_TABLES) {
  
    var j = 2;
    
    while (true) {
      
      var cell = AVAILABILITY_GRAPH_TABLES[i].getRange(j, 1);
      
      if (cell.isBlank()) {
        break;
      }
      
      for (var k = 1; k <= 24; k++) {
        
        AVAILABILITY_GRAPH_TABLES[i].getRange(j, k + AVAILABILITY_ICON_OFFSET).setValue(AVAILABILITY_NO_INDICATOR_ICON);
      }
      
      j++;
    }
    
  }
  
}


/**
 * Deletes all installed triggers to avoid the Google Scripts limit.
 */
function cleanUpTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  
  for (var i in triggers) {
    if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

/**
 * Takes a string of the format HH:MM and converts it to HH:MM XM
 */
function getStandardTimeFromMilitaryTime(militaryTime, timezoneOffset) {
  
  var timeParts = militaryTime.split(":");
  
  var rawHour = parseInt(timeParts[0]);
  var offsetHour = rawHour - (null == timezoneOffset ? 0 : timezoneOffset);
  var hour = (offsetHour % 12);
  
  return (rawHour == 0 ? "12" : hour) + ":" + timeParts[1] + " " + (offsetHour >= 12 && offsetHour < 24 ? "PM" : "AM");
  
}

/**
 * Takes a date and produces a string with the format DayOfWeek, Month Date
 */
function getHumanReadableDateString(date) {
  return date.toLocaleString('default', { weekday: 'long' }) + ", " + date.toLocaleString('default', { month: 'long' }) + " " + date.getDate();
}

/**
 * Takes a date and produces a string with the format mm_dd_yyyy (unique ID for surveys)
 */
function getDateString(date) {
  return date.getMonth() + "_" + date.getDate() + "_" + date.getFullYear();
}

function getDateFromDateString(dateString) {
  var dateStringParts = dateString.split("_");
  return new Date(parseInt(dateStringParts[2]), parseInt(dateStringParts[0]), parseInt(dateStringParts[1]));
}
  
function getDifferenceBetweenDates(earlierDate, laterDate) {
  return Math.floor((laterDate.getTime() - earlierDate.getTime()) / (1000 * 3600 * 24)); 
}

/**
 * Traverses the Date column to find the row index for today's date.  Useful for dupe checking and responding to triggers.
 */
function getTodaysSpreadsheetRowIndex(stubRowIfNew) {
  
  loadAvailabilityTable();
  
  stubRowIfNew = (null == stubRowIfNew ? true : stubRowIfNew);
  
  var dateString = getDateString(new Date());
  
  var i = 1;
  
  while (true) {
    
    var cell = AVAILABILITY_TABLE.getRange(i, availabilityColumns.date);
    
    if (cell.isBlank() || cell.getValue() == dateString) {
      
      if (cell.isBlank() && stubRowIfNew) {
        cell.setValue(dateString);
      }
      
      return i;
    }
    
    i++;
  }
  
}

function getTodaysSlackAvailabilityRowIndex(userId, stubRowIfNew) {
  
  loadSlackAvailabilityTable();
  
  stubRowIfNew = (null == stubRowIfNew ? true : stubRowIfNew);
  
  var dateString = getDateString(new Date());
  
  var i = 1;
  
  while (true) {
    
    var dateCell = SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.date);
    var userIdCell = SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.userId);
    
    log(dateCell.getValue() + " == " + (dateString) + "?");
    log(userIdCell.getValue() + " == " + (userId) + "?");
    
    if (dateCell.isBlank() || (dateCell.getValue() == dateString && userIdCell.getValue() == userId)) {
      
      if (dateCell.isBlank() && stubRowIfNew) {
        dateCell.setValue(dateString);
        userIdCell.setValue(userId);
        log("new user/response date row: " + dateString + ", " + userId);
      }
          
      break;
    }
    
    i++;
  }
  
  return i;
}

function getNextBattlePassRowIndex() {
  
  loadBattlePassProgressTable();
  
  var i = 1;
  
  while (true) {
    
    var cell = BATTLE_PASS_TRACKER_TABLE.getRange(i, 1);
    
    if (cell.isBlank()) {
      break;
    }
    
    i++;
  }
  
  return i;
}

function getMostRecentBattlePassRowIndex(userId) {
  
  loadBattlePassProgressTable();
  
  var max = 1;
  var i = 1;
  
  while (true) {
    
    var userIdCell = BATTLE_PASS_TRACKER_TABLE.getRange(i, 2);
    
    if (userIdCell.getValue() == userId) {
      max = i;
    }
    
    if (userIdCell.isBlank()) {
      break;
    }
    
    i++;
  }
  
  return max;
}

function getAllGuns() {
  
  loadEmojiGunPropertiesTable();
  
  var r = 1;
  
  var listOutput = [];
  
  while (true) {
    
    var aCellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 1).getValue();
    var bCellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 2).getValue();
    
    if (aCellValue == "" && bCellValue == "") {
      break; 
    }
    
    listOutput.push(aCellValue + "-" + bCellValue);
    
    r++;
    
  }
  
  return listOutput;
}

function getAllSkinTypes() {
  
  loadEmojiGunPropertiesTable();
  
  var r = 1;
  
  var listOutput = [];
  
  while (true) {
    
    var cellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 2).getValue();
    
    if (cellValue == "") {
      break;
    }
    
    if (listOutput.indexOf(cellValue) < 0) {
      listOutput.push(cellValue);
    }
    
    r++;
    
  }
  
  return listOutput;
}

function getAllGunTypes() {
  
  loadEmojiGunPropertiesTable();
  
  var r = 1;
  
  var listOutput = [];
  
  while (true) {
    
    var cellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 1).getValue();
    
    if (cellValue == "") {
      break;
    }
    
    if (listOutput.indexOf(cellValue) < 0) {
      listOutput.push(cellValue);
    }
    
    r++;
    
  }
  
  return listOutput;
}

function getAllGunsMatchingExpression(exp) {
  
  loadEmojiGunPropertiesTable();
  
  var r = 1;
  
  var listOutput = [];
  
  while (true) {
    
    var aCellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 1).getValue();
    var bCellValue = EMOJI_GUN_PROPERTIES_TABLE.getRange(r, 2).getValue();
    
    if (aCellValue == "" && bCellValue == "") {
      break; 
    }
    
    var cellValue = aCellValue + "-" + bCellValue;
    
    if (listOutput.indexOf(cellValue) < 0 && true == exp.apply(null, [aCellValue, bCellValue])) {
      listOutput.push(cellValue);
    }
    
    r++;
    
  }
  
  return listOutput;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function getRandomInt(max) {
  return Math.floor(new Date().getMilliseconds() % max);
}

