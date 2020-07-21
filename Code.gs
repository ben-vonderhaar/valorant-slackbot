// Read properties.
var OAUTH_BEARER_TOKEN                = PropertiesService.getScriptProperties().getProperty('OAUTH_BEARER_TOKEN');
var SANDBOX_CHANNEL_ID                = PropertiesService.getScriptProperties().getProperty('SANDBOX_CHANNEL_ID');
var VALORANT_CHANNEL_ID               = PropertiesService.getScriptProperties().getProperty('VALORANT_CHANNEL_ID');
var AVAILABILITY_PACIFIC_CHANNEL_ID   = PropertiesService.getScriptProperties().getProperty('AVAILABILITY_PACIFIC_CHANNEL_ID');
var AVAILABILITY_MOUNTAIN_CHANNEL_ID  = PropertiesService.getScriptProperties().getProperty('AVAILABILITY_MOUNTAIN_CHANNEL_ID');
var AVAILABILITY_CENTRAL_CHANNEL_ID   = PropertiesService.getScriptProperties().getProperty('AVAILABILITY_CENTRAL_CHANNEL_ID');
var AVAILABILITY_EASTERN_CHANNEL_ID   = PropertiesService.getScriptProperties().getProperty('AVAILABILITY_EASTERN_CHANNEL_ID');

var ADMIN_DM_CHANNEL_ID = PropertiesService.getScriptProperties().getProperty('ADMIN_DM_CHANNEL_ID');
var CHANNEL_ID = VALORANT_CHANNEL_ID;

var AVAILABILITY_CHANNELS             = [ AVAILABILITY_PACIFIC_CHANNEL_ID, AVAILABILITY_MOUNTAIN_CHANNEL_ID, 
                                             AVAILABILITY_CENTRAL_CHANNEL_ID, AVAILABILITY_EASTERN_CHANNEL_ID ];
var AVAILABILITY_GRAPH_TABLE_OFFSETS  = [ 0, 1, 2, 3 ];
var AVAILABILITY_GRAPH_TABLE_ZONES    = [ "Pacific", "Mountain", "Central", "Eastern" ];

var NOT_AVAILABLE_RESPONSE_MESSAGE    = " _is not available today_";
var MAYBE_AVAILABLE_RESPONSE_MESSAGE  = " _might be available, but doesn't know any specifics_";
var AVAILABILITY_ICON_OFFSET          = 2;
var AVAILABILITY_YES_INDICATOR_ICON   = "■";
var AVAILABILITY_MAYBE_INDICATOR_ICON = "□";
var AVAILABILITY_NO_INDICATOR_ICON    = "~";
var PARTIAL_AVAILABILITY_START_ICON   = "  [";
var PARTIAL_AVAILABILITY_END_ICON     = "]";

var PICK_YOUR_RESPONSE_SKIN_QUESTION_TITLE = "Pick your response skin";
var MAX_ROW_GUN_PROPERTIES = 82;

// Shortcuts for column names to avoid hardcoding column indices.
var availabilityColumns = {date : 1, formId : 2, triggerId : 3, availabilityThreadId : 4};
var slackAvailabilityColumns = {date : 1, userId : 2, responseSkin : 3, numberGamesAvailable : 4,
                                startTime : 5, endTime : 6, timezone : 7, additionalComments : 8, status : 9, statusDetail : 10, dirtyMarker : 11};

/**
 * Entry point - called by a clock-based trigger.
 */
function setupDailySurvey() {
  
  loadAvailabilityTable();
  resetAvailablityGraphState();
  
  var directMessages = JSON.parse(_doExecuteSlackApiCall("https://slack.com/api/conversations.list?types=im,mpim", "get", null, null, null, null));
  
  for (var i in directMessages.channels) {
    
    if ("USLACKBOT" != directMessages.channels[i].user) {
      
      var userId = directMessages.channels[i].user;
      var availabilityRowIndex = getTodaysSlackAvailabilityRowIndex(userId);

      if (_getStatus(availabilityRowIndex) != SURVEY_STATES.SENT_FIRST_QUESTION) {
        _setStatus(availabilityRowIndex, SURVEY_STATES.SENT_FIRST_QUESTION);
        _showFirstSurveyQuestion(userId);
      }
  
    }
    
  }
  
  var rowIndex = getTodaysSpreadsheetRowIndex(true);
  
  for (var i in AVAILABILITY_CHANNELS) {
      
    var fetchResponse = postToSlack(AVAILABILITY_CHANNELS[i], null, 'Availability for ' + getHumanReadableDateString(new Date()));
    
    AVAILABILITY_TABLE.getRange(rowIndex, availabilityColumns.availabilityThreadId + parseInt(i)).setNumberFormat("@");
    AVAILABILITY_TABLE.getRange(rowIndex, availabilityColumns.availabilityThreadId + parseInt(i)).setValue(JSON.parse(fetchResponse.getContentText()).ts);
    
  }
}


function updateDbWithUserAvailabilityFromSlack(userId, responseSkin, numberGamesAvailable, startTime, endTime, timezone, additionalComments) {
  
  loadSlackAvailabilityTable();
  
  var dateString = getDateString(new Date());
  var i = getTodaysSlackAvailabilityRowIndex(userId);
  
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.numberGamesAvailable).setNumberFormat("@");
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.startTime).setNumberFormat("@");
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.endTime).setNumberFormat("@");
  
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.date).setValue(dateString);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.userId).setValue(userId);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.responseSkin).setValue(responseSkin);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.numberGamesAvailable).setValue(numberGamesAvailable);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.startTime).setValue(startTime);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.endTime).setValue(endTime);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.timezone).setValue(timezone);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.additionalComments).setValue(additionalComments);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.dirtyMarker).setNumberFormat("@");
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.dirtyMarker).setValue(".");
}

function updateDbWithUserAvailabilityFromSlackOnlyUpdateNonNull(userId, responseSkin, numberGamesAvailable, startTime, endTime, timezone, additionalComments) {
  
  loadSlackAvailabilityTable();
  
  var dateString = getDateString(new Date());
  var i = getTodaysSlackAvailabilityRowIndex(userId);
  
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.numberGamesAvailable).setNumberFormat("@")
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.startTime).setNumberFormat("@")
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.endTime).setNumberFormat("@")
  
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.date).setValue(dateString);
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.userId).setValue(userId);
  
  if (null != responseSkin) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.responseSkin).setValue(responseSkin);
  }
  
  if (null != numberGamesAvailable) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.numberGamesAvailable).setValue(numberGamesAvailable);
  }
  
  if (null != startTime) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.startTime).setValue(startTime);
  }
  
  if (null != endTime) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.endTime).setValue(endTime);
  }
  
  if (null != timezone) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.timezone).setValue(timezone);
  }
  
  if (null != additionalComments) {
    SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.additionalComments).setValue(additionalComments);
  }
  
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.dirtyMarker).setNumberFormat("@");
  SLACK_AVAILABILITY_TABLE.getRange(i, slackAvailabilityColumns.dirtyMarker).setValue(".");
}

function _doHandleFormResponse(userId, responseSkin, numberGamesAvailable, startTime, endTime, timezone, additionalComments, availabilityGraphIndex) {
  
  try {
    
    loadAvailabilityTable();
    
    log("----------");
    log("_doHandleFormResponse");
    log("----------");
    log("userId: " + userId);
    log("responseSkin: " + responseSkin);
    log("numberGamesAvailable: " + numberGamesAvailable);
    log("startTime: " + startTime);
    log("endTime: " + endTime);
    log("timezone: " + timezone);
    log("additionalComments: " + additionalComments);
    log("availabilityGraphIndex: " + availabilityGraphIndex);
    
    var responseMessage = "";
    var startAvailableColumn = -1;
    var startAvailablePart = 0;
    var endAvailableColumn = -1;
    var endAvailablePart = 0;
    var timezoneOffset = 0;
    
    var rowIndex = getTodaysSpreadsheetRowIndex();
    var conversationId = AVAILABILITY_TABLE.getRange(rowIndex, availabilityColumns.availabilityThreadId + availabilityGraphIndex).getValue();
    var channelId = AVAILABILITY_CHANNELS[availabilityGraphIndex];
    
    if (null != responseSkin && "" != responseSkin) {
      responseMessage = replaceGunEmojiPlaceholders(":weapon-" + responseSkin + "-1:");
    }
    
    if (null == numberGamesAvailable || "Not available today" == numberGamesAvailable) {
      
      Logger.log(userId + " not available today");
      
      responseMessage += NOT_AVAILABLE_RESPONSE_MESSAGE;
      
    } else if ("Maybe available" == numberGamesAvailable) {
      
      Logger.log(userId + " may be available today");
      
      responseMessage += MAYBE_AVAILABLE_RESPONSE_MESSAGE;
      
    } else {
      
      Logger.log("Processing today's availability for " + userId);
      
      // Find timezone offset for timezone being processed
      if (null != timezone && "" != timezone) {
        
        // Calculate base offset
        if (timezone == "Eastern") {
          timezoneOffset = 3;
        } else if (timezone == "Central") {
          timezoneOffset = 2;
        } else if (timezone == "Mountain") {
          timezoneOffset = 1;
        }
        
        // Compensate for timezone being processed
        timezoneOffset -= AVAILABILITY_GRAPH_TABLE_OFFSETS[availabilityGraphIndex];
      }
      
      if ("1" === numberGamesAvailable) {
        responseMessage += " available for `" + numberGamesAvailable + "` game from `"
      } else {
        responseMessage += " available for `" + numberGamesAvailable + "` games from `"
      }
      
      if (null == startTime || "" == startTime || "any" == startTime) {
        responseMessage += "??"
      } else {
        responseMessage += getStandardTimeFromMilitaryTime(startTime, timezoneOffset);
        
        // Get raw start time
        startAvailableColumn = parseInt(startTime.split(":")[0]);
        startAvailablePart = parseInt(startTime.split(":")[1]);
        
      }
      
      responseMessage += " - ";
      
      if (null == endTime || "" == endTime || "any" == endTime) {
        responseMessage += "??"
      } else {
        responseMessage += getStandardTimeFromMilitaryTime(endTime, timezoneOffset);
        
        // Get raw end time
        endAvailableColumn = parseInt(endTime.split(":")[0]);
        endAvailablePart = parseInt(endTime.split(":")[1]);
        
        // endTime = 0 indicates midnight, but due to 24:00 never being a real time and therefore never a parse result, massage the data here.
        if (0 == endAvailableColumn) {
          endAvailableColumn = 24;
        }
      }
      
      responseMessage += "` ";
      
    }
    
    if (null != additionalComments && "" != additionalComments) {
      responseMessage += "\nAdditional Comments: " + additionalComments;
    }
    
    var userInfo = JSON.parse(getUserInfo(userId));
    var existingReplyTs = null;
    
    var replies = JSON.parse(
      _doExecuteSlackApiCall("https://slack.com/api/conversations.replies?channel=" + channelId + "&ts=" + conversationId, "get", null, null, null, null, null));
    
    for (var i in replies.messages) {
      if (replies.messages[i].ts != conversationId && replies.messages[i].username == userInfo.user.profile.display_name_normalized) {
        existingReplyTs = replies.messages[i].ts;
      }
    }
    
    if (null == existingReplyTs) {
      postToSlackAs(channelId, conversationId, userId, responseMessage);
    } else {
      _doExecuteSlackApiCall("https://slack.com/api/chat.update", "post", channelId, existingReplyTs, userId, responseMessage, null);
    }
    
    // Update availability graph for timezone being processed
    
    var AVAILABILITY_GRAPH_TABLES = getAllAvailabilityGraphTables();
    var userRowIndex = 2;
    
    while (true) {
      
      var cell = AVAILABILITY_GRAPH_TABLES[availabilityGraphIndex].getRange(userRowIndex, 1);
      
      if (cell.isBlank()) {
        AVAILABILITY_GRAPH_TABLES[availabilityGraphIndex].getRange(userRowIndex, 1).setValue(userId);
        break;
      }
      if (cell.getValue() == userId) {
        break;
      }
      
      userRowIndex++;
    }
    
    AVAILABILITY_GRAPH_TABLES[availabilityGraphIndex].getRange(userRowIndex, 2).setValue(userInfo.user.profile.real_name_normalized);
    
    // Adjust availability for time zone
    if (-1 != startAvailableColumn) {
      startAvailableColumn = Math.max(startAvailableColumn - timezoneOffset, 0);
    }
    
    if (24 != endAvailableColumn && -1 != endAvailableColumn) { // Adjust for timezone only if user did not select midnight as end time.
      endAvailableColumn = Math.min(endAvailableColumn - timezoneOffset, 24);
    }
    
    updateDbWithUserAvailability(startAvailableColumn, startAvailablePart, endAvailableColumn, endAvailablePart, responseMessage, userRowIndex, availabilityGraphIndex);
    
  } catch (err) {
    
    Logger.log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error in internal survey submission handling: " + err);
    
  }
  
}

function updateDbWithUserAvailability(startAvailableColumn, startAvailablePart, endAvailableColumn, endAvailablePart, responseMessage, userRowIndex, availabilityGraphIndex) {

  try {
    
    var AVAILABILITY_GRAPH_TABLES = getAllAvailabilityGraphTables();
    
    for (var i = 1; i <= 24; i++) {
      
      var columnIcon = AVAILABILITY_NO_INDICATOR_ICON;
      
      if (-1 == startAvailableColumn && -1 == endAvailableColumn) {
        columnIcon = (responseMessage.indexOf(NOT_AVAILABLE_RESPONSE_MESSAGE) >= 0 ? AVAILABILITY_NO_INDICATOR_ICON : AVAILABILITY_MAYBE_INDICATOR_ICON);
      } else if (-1 == startAvailableColumn && i < endAvailableColumn) {
        columnIcon = AVAILABILITY_MAYBE_INDICATOR_ICON;
      } else if (-1 == endAvailableColumn && i > startAvailableColumn) {
        columnIcon = AVAILABILITY_MAYBE_INDICATOR_ICON;
      } else if (i == endAvailableColumn && 0 != endAvailablePart) {
        columnIcon = PARTIAL_AVAILABILITY_END_ICON;
      } else if (i == startAvailableColumn && 0 != startAvailablePart) {
        columnIcon = PARTIAL_AVAILABILITY_START_ICON;
      } else if (-1 == startAvailableColumn && i < endAvailableColumn) {
        columnIcon = (i == endAvailablePart && 0 != endAvailablePart ? PARTIAL_AVAILABILITY_END_ICON : AVAILABILITY_YES_INDICATOR_ICON);
      } else if (-1 == endAvailableColumn && i > startAvailableColumn) {
        columnIcon = (i == startAvailableColumn && 0 != startAvailablePart ? PARTIAL_AVAILABILITY_START_ICON : AVAILABILITY_YES_INDICATOR_ICON);
      } else if (i < startAvailableColumn) {
        columnIcon = AVAILABILITY_NO_INDICATOR_ICON;
      } else if (i >= endAvailableColumn) {
        columnIcon = AVAILABILITY_NO_INDICATOR_ICON;
      } else {
        columnIcon = AVAILABILITY_YES_INDICATOR_ICON;
      }
      
      AVAILABILITY_GRAPH_TABLES[availabilityGraphIndex].getRange(userRowIndex, i + AVAILABILITY_ICON_OFFSET).setValue(columnIcon);
    }
    
  } catch (err) {
    
    Logger.log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error updating availability db: " + err);
    
  }
  
}

function publishChartToSlack(availabilityGraphIndex) {
  
  try {
    
    loadAvailabilityTable();
    var AVAILABILITY_GRAPH_TABLES = getAllAvailabilityGraphTables();
    var chartFileName = getDateString(new Date()) + "_" + availabilityGraphIndex;
    
    // Create a proxy slide
    var proxySlide = SlidesApp.create("proxySlide");
    var proxySaveSlide = proxySlide.getSlides()[0];
    var chartImage = proxySaveSlide.insertSheetsChartAsImage(AVAILABILITY_GRAPH_TABLES[availabilityGraphIndex].getCharts()[0]);
    
    var options = {
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      }
    };
    
    // Must actually fetch the image to get contents - EmbeddedChart.asType returns nothing :/
    var response = UrlFetchApp.fetch(chartImage.getContentUrl(), options);
    var image = response.getAs(MimeType.PNG).setName(chartFileName);
    
    var file = DriveApp.createFile(image);
    
    // Delete the proxy slide
    DriveApp.getFileById(proxySlide.getId()).setTrashed(true);
    
    var folder = DriveApp.getFoldersByName('Valorant Availability Graphs').next();
    
    // Delete any matching files already in the Valorant Availability Graphs folder
    var duplicateFilesIterator = folder.getFilesByName(chartFileName);
    
    while (duplicateFilesIterator.hasNext()) {
      Logger.info("remove dupe chart file");
      duplicateFilesIterator.next().setTrashed(true);
    }
    
    // "Move" file to folder and set perms
    folder.addFile(file).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    DriveApp.removeFile(file);
    
    // Wait 2.5s to give download time to resolve
    sleep(2500)
    
    _doExecuteSlackApiCall("https://slack.com/api/chat.update", 
                           "post",
                           AVAILABILITY_CHANNELS[availabilityGraphIndex], 
                           AVAILABILITY_TABLE.getRange(getTodaysSpreadsheetRowIndex(), availabilityColumns.availabilityThreadId + availabilityGraphIndex).getValue(),
                           null, 
                           "Availability for " + getHumanReadableDateString(new Date()), folder.getFilesByName(chartFileName).next().getDownloadUrl(),
                           AVAILABILITY_GRAPH_TABLE_ZONES[availabilityGraphIndex])
  } catch (err) {
    
    Logger.log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error when publishing chart to slack: " + err);
    
  }
}

function doPost(e) {
  
  try {
    
    log("doPost");
  
    if (e.parameter.command == "/renderguns") {
      
      log("slash command");
      
      if (e.parameter.text == "help") {
        return ContentService.createTextOutput("To more easily draw multi-tile weapons, use this slash command.  To use it, just specify any weapon emoji and the slash command will render all emoji tiles pertaining to that weapon in its place.  You do not have to choose the `-1` emoji either - both `/renderguns :weapon-ghost-dot-exe-1:` and `/renderguns :weapon-ghost-dot-exe-2:` will result in :weapon-ghost-dot-exe-1::weapon-ghost-dot-exe-2:");
      }
      
      if (e.parameter.text == "list") {
        var renderGunsListDoc = DocumentApp.openById(PropertiesService.getScriptProperties().getProperty('RENDERGUNS_LIST_RESPONSE_DOC_ID'))
        
        return ContentService.createTextOutput(renderGunsListDoc.getBody().getText()).setMimeType(ContentService.MimeType.JSON);
      }
      
      postToSlackAs(e.parameter.channel_id, null, e.parameter.user_id, replaceGunEmojiPlaceholders(e.parameter.text));
      return;
    }
    
    var rawParameterPayload = e.parameter.payload;
    var rawPostDataPayload = e.postData;
    
    var postDataPayloadIsJSON = true;
    
    try {
      JSON.parse(rawPostDataPayload.contents);
    } catch (jsonParseError) {
      postDataPayloadIsJSON = false;
    }
    
    if (null != rawParameterPayload && (JSON.parse(rawParameterPayload).type == "block_actions")) {
      
      newSectionInLog();
      log("Block Actions");
      log(rawPostDataPayload.contents);
      _handleBlockAction(JSON.parse(rawParameterPayload));
      return ContentService.createTextOutput();
      
    }
    
    if (null != rawPostDataPayload && null != rawPostDataPayload.contents && true == postDataPayloadIsJSON && null != JSON.parse(rawPostDataPayload.contents).challenge) {

      newSectionInLog();
      log("URL Verification");
      log(rawPostDataPayload.contents);
      
      return ContentService.createTextOutput(JSON.stringify({"challenge":JSON.parse(rawPostDataPayload.contents).challenge}))
          .setMimeType(ContentService.MimeType.JSON);
      
    }
    
    if (null != rawPostDataPayload && undefined != rawPostDataPayload && true == postDataPayloadIsJSON && (JSON.parse(rawPostDataPayload.contents).event.type == "message")) {

      if ("message_deleted" == JSON.parse(rawPostDataPayload.contents).event.subtype) {
        //log("not handling message deleted actions");
        return ContentService.createTextOutput();
      }
      if (null != JSON.parse(rawPostDataPayload.contents).event.bot_id) {
        //log("not handling bot messages");
        return ContentService.createTextOutput();
      }
      
      _handleDirectMessage(JSON.parse(rawPostDataPayload.contents));
      return ContentService.createTextOutput();
      
    }
    
  } catch (err) {
    log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error in doPost: " + err);
  }
  
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

function replaceGunEmojiPlaceholders(text) {
 
  loadEmojiGunPropertiesTable();
  
  var properties = EMOJI_GUN_PROPERTIES_TABLE.getRange(1, 1, getPropValueAsInt(PROPS.MAX_ROW_GUN_PROPERTIES), 3).getValues();
  
  var regex = /:weapon[a-z1-3-]+:/g;
  var matches = text.match(regex);
  
  for (var i in matches) {
    
    var rawMatch = matches[i];
    
    var matchParts = rawMatch.replace(":weapon-", "").replace(":", "").replace("-1", "").replace("-2", "").replace("-3", "").split("-");
    var weapon = matchParts[0], skin = matchParts.slice(1).join("-");
    
    for(var i = 0; i < properties.length; i++) {
      
      var property = properties[i];
      
      if (property[0] == weapon && property[1] == skin) {
        text = _doTextReplacement(text, rawMatch, i + 1);
        break;
      }
    }
    
  }
  
  return text;
}

function _doTextReplacement(text, textToReplace, row) {
  
  loadEmojiGunPropertiesTable();
  
  var replacementText = "";
  
  var numTiles = parseInt(EMOJI_GUN_PROPERTIES_TABLE.getRange(row, 3).getValue());
  
  for (var i = 0; i < numTiles; i++) {
    replacementText += ":weapon-" + EMOJI_GUN_PROPERTIES_TABLE.getRange(row, 1).getValue();
    replacementText += "-" + EMOJI_GUN_PROPERTIES_TABLE.getRange(row, 2).getValue();
    
    if (numTiles > 1) {
      replacementText += "-" + (i + 1);
    }
    
    replacementText += ":";
  }
  
  return text.replace(textToReplace, replacementText);
  
}
