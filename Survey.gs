var SURVEY_STATES = {SENT_FIRST_QUESTION: "SENT_FIRST_QUESTION", 
                     GUN_SKIN_CHOICE_PENDING: "GUN_SKIN_CHOICE_PENDING",
                     COMMENT_PENDING: "COMMENT_PENDING",
                     CHOOSE_SKIN_STEP_1: "CHOOSE_SKIN_STEP_1",
                     CHOOSE_SKIN_STEP_2: "CHOOSE_SKIN_STEP_2",
                     CHOOSE_SKIN_STEP_3: "CHOOSE_SKIN_STEP_3",
                     START_TIME_CHOICE_PENDING: "START_TIME_CHOICE_PENDING",
                     END_TIME_CHOICE_PENDING: "END_TIME_CHOICE_PENDING",
                     BP_LEVEL_PENDING: "BP_LEVEL_PENDING",
                     BP_XP_REMAINING_PENDING: "BP_XP_REMAINING_PENDING",
                     BP_WEEKLIES_COMPLETED_PENDING: "BP_WEEKLIES_COMPLETED_PENDING",
                     DONE: "DONE"};


function _showFirstSurveyQuestion(userId) {
  
  return _doShowRespondByButtonClickQuestion(userId, "Are you available to play today?",  buildButtonLayout([
          ["No", "not_available"],
          ["No, but I have a comment", "not_available_comment"],
          ["Maybe (timing unsure)", "maybe"],
          ["Yes, for 1-2 games", "available_for_some_games"],
          ["Yes, for 3+ games", "available_for_many_games"],
        ]));
    
}

function _askForGunSkinSelectionStart(userId) {
    
  return _doShowRespondByButtonClickQuestion(userId, "Select by...",  buildButtonLayout([
    ["Skin", "select_by_skin"],
    ["Gun", "select_by_gun"]
  ]));
  
}

function _askForSpecificGun(userId) {
  
  return _doShowRespondByButtonClickQuestion(
    userId, "Choose gun", 
    buildButtonLayout(getAllGunTypes().map(gun => [gun, gun])));
  
}


function _askForSpecificSkin(userId) {
  
  return _doShowRespondByButtonClickQuestion(
    userId, "Choose skin", 
    buildButtonLayout(getAllSkinTypes().map(skin => [skin, skin])));
  
}

function _askForSkinnedGun(userId, options) {
  
  return _doShowRespondByButtonClickQuestion(
    userId, "Choose response skin", 
    buildButtonLayout(options.map(option => [option, option])));
  
}

function _askForComment(userId, questionText, cancelButtonText) {
    
  cancelButtonText = (null != cancelButtonText ? cancelButtonText : "No Comment");
  questionText = (null != questionText ? questionText : "Any comments about your availability?");
  questionText += " You can send me a message with details or click the \"" + cancelButtonText + "\" button below if there's nothing to say.";
  
  return _doShowRespondByButtonClickQuestion(userId, questionText,  buildButtonLayout([
    [cancelButtonText, "no_comment"]
  ]));
  
}

function _askForGunSkinSetting(userId, responseSkin) {
  
  var options = [
    ["Yes", "choose_gun_skin"],
    ["No, pick one for me", "random_gun_skin"]
  ];
  
  if (null != responseSkin && "" != responseSkin) {
    options.push(["Keep existing", "keep_existing_gun_skin"]);
  }
    
  return _doShowRespondByButtonClickQuestion(userId, "Would you like to set a specific gun skin on your availability responses?",  buildButtonLayout(options));
  
}

function _askForStartTime(userId) {
  return _askForTime(userId, "What time do you anticipate being able to get online?");
}

function _askForEndTime(userId) {
  return _askForTime(userId, "What time do you anticipate needing to sign off?");
}

function _askForTime(userId, questionText) {
  return _doShowRespondByButtonClickQuestion(userId, questionText,  buildButtonLayout([
    ["Any time", "time_any"],
    ["1:00 PM",  "time_13:00"],
    ["1:30 PM",  "time_13:30"],
    ["2:00 PM",  "time_14:00"],
    ["2:30 PM",  "time_14:30"],
    ["3:00 PM",  "time_15:00"],
    ["3:30 PM",  "time_15:30"],
    ["4:00 PM",  "time_16:00"],
    ["4:30 PM",  "time_16:30"],
    ["5:00 PM",  "time_17:00"],
    ["5:30 PM",  "time_17:30"],
    ["6:00 PM",  "time_18:00"],
    ["6:30 PM",  "time_18:30"],
    ["7:00 PM",  "time_19:00"],
    ["7:30 PM",  "time_19:30"],
    ["8:00 PM",  "time_20:00"],
    ["8:30 PM",  "time_20:30"],
    ["9:00 PM",  "time_21:00"],
    ["9:30 PM",  "time_21:30"],
    ["10:00 PM", "time_22:00"],
    ["10:30 PM", "time_22:30"],
    ["11:00 PM", "time_23:00"],
    ["11:30 PM", "time_23:30"],
    ["12:00 AM", "time_00:00"]
  ]));
}

function _askForBattlePassLevel(userId) {
  return _doShowRespondByButtonClickQuestion(userId, "What tier of the Battle Pass are you currently on?  Please be sure to specify the most recently" + 
                                             " reached level, and not the one you're part-way through!", buildButtonLayout([
    ["Nevermind", "nevermind_bp_update"]
  ]));
}

function _askForBattlePassRemainingXP(userId) {
  return _doShowRespondByButtonClickQuestion(userId, "How much XP remains before reaching the next Battle Pass tier?", buildButtonLayout([
    ["Nevermind", "nevermind_bp_update"]
  ]));
}

function _askForCompletedWeeklyMissions(userId) {
  return _doShowRespondByButtonClickQuestion(userId, "How many weekly missions have you completed?  Reference the weekly mission tracker document if unsure: " +
                                             "https://docs.google.com/document/d/1QI9JYDTiI2tRKdAdVhJJ9a7WQhpWSiibmhxzGLM2D20",  buildButtonLayout([
    ["None", "weeklies_completed_0"],
    ["1",    "weeklies_completed_1"],
    ["2",    "weeklies_completed_2"],
    ["3",    "weeklies_completed_3"],
    ["4",    "weeklies_completed_4"],
    ["5",    "weeklies_completed_5"],
    ["6",    "weeklies_completed_6"],
    ["7",    "weeklies_completed_7"],
    ["8",    "weeklies_completed_8"],
    ["9",    "weeklies_completed_9"]
  ]));
}

function _doShowRespondByButtonClickQuestion(channel, question, buttons) {
    
  var apiEndpoint = "https://slack.com/api/chat.postMessage";
  
  var headers = {
    "Authorization" : "Bearer " + OAUTH_BEARER_TOKEN
  };
  
  var options = {
    "method" : "post",
    "headers" : headers,
    "contentType" : "application/json",
    "payload": JSON.stringify({"channel": channel, "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": question
        }
      },
      {
        "type": "actions",
        "elements": buttons
      }
    ]})
  };
  
  log("Outgoing request:");
  log(apiEndpoint + ": ")
  log(JSON.stringify(options));
  
  var response = UrlFetchApp.fetch(apiEndpoint, options);
  
  log("Response:");
  log(response.getResponseCode());
  log(response.getContentText());
  
  return response;
  
}

function buildButtonLayout(buttonOptions) {
    
  var buttonLayout = [];
  
  for (var i in buttonOptions) {
    
    
    var text = buttonOptions[i][0];
    
    if (text.length > 75) {
      buttonOptions[i][0].substring(0, 74)
    }
    
    buttonLayout.push(
      {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": buttonOptions[i][0],
          "emoji": true
        },
        "value": buttonOptions[i][1]
      }
    )
  };
    
  return buttonLayout;
}


function _handleBlockAction(payload) {

  try {
    
    loadSlackAvailabilityTable();
    loadBattlePassProgressTable();
    
    // Delete messages before they are processed to indicate that user input was received.
    _doExecuteSlackApiCall("https://slack.com/api/chat.delete", "post", payload.container.channel_id, payload.container.message_ts);
    
    var userId = payload.user.id;
    var availableActions = {};
    
    var blocks = (null == payload.view ? payload.message.blocks : payload.view.blocks);
    
    for (var i in blocks) {
      if (blocks[i].type == "actions") {
        availableActions = blocks[i];
        break;
      }
    }
    
    var availabilityRowIndex = getTodaysSlackAvailabilityRowIndex(userId);
    var action = payload.actions[0];
    
    switch(action.value) {
      case "check_timezone":
        
        postToSlack("D013PUU5CP9", null, "Your timezone is currently set to \"" + JSON.parse(getUserInfo(userId)).user.tz_label + "\"");
        
        break;
        
      case "start_survey":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.SENT_FIRST_QUESTION) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.SENT_FIRST_QUESTION);
          _showFirstSurveyQuestion(userId);
        }
        
        break;
        
      case "not_available":
        
        updateDbWithUserAvailabilityFromSlackOnlyUpdateNonNull(userId, null, "Not available today", null, null, null, null);
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.GUN_SKIN_CHOICE_PENDING) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.GUN_SKIN_CHOICE_PENDING);
          _updateAvailabilityCommentsInSlack(availabilityRowIndex)
          _askForGunSkinSetting(userId, SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.responseSkin).getValue());
        }
        
        break;
        
      case "not_available_comment":
        
        updateDbWithUserAvailabilityFromSlackOnlyUpdateNonNull(userId, null, "Not available today", null, null, null, null);
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.COMMENT_PENDING) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.COMMENT_PENDING);
          var commentResponse = _askForComment(userId, "Ok, let me know what to tell everyone about your availability.", "Nevermind");
          
          _setStatusDetail(availabilityRowIndex, JSON.parse(commentResponse).ts);
        }
        
        break;
        
      case "maybe":
        
        updateDbWithUserAvailabilityFromSlackOnlyUpdateNonNull(userId, null, "Maybe available", null, null, null, null);
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.COMMENT_PENDING) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.COMMENT_PENDING);
          _updateAvailabilityCommentsInSlack(availabilityRowIndex)
          var commentResponse = _askForComment(userId, "Ok, let me know what to tell everyone about your availability.");
          
          _setStatusDetail(availabilityRowIndex, JSON.parse(commentResponse).ts);
        }
        
        break;
        
      case "available_for_some_games":
      case "available_for_many_games":
        
        var numGamesAvailable = (action.text.text == "Yes, for 1-2 games" ? "1-2" : "3+");
          
        updateDbWithUserAvailabilityFromSlackOnlyUpdateNonNull(userId, null, numGamesAvailable, null, null, null, null);
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.START_TIME_CHOICE_PENDING) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.START_TIME_CHOICE_PENDING);
          _setTimezone(availabilityRowIndex, JSON.parse(getUserInfo(userId)).user.tz_label.split(" ")[0]);
          _askForStartTime(userId);
        }
        
        break;
        
      case "no_comment":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.GUN_SKIN_CHOICE_PENDING) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.GUN_SKIN_CHOICE_PENDING);
          _setAdditionalComments(availabilityRowIndex, "");
          _askForGunSkinSetting(userId, SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.responseSkin).getValue());
        }
        
        break;
        
      case "random_gun_skin":
        
        if (SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, 1).getValue() != "") {
          
          loadEmojiGunPropertiesTable();
          
          _setStatus(availabilityRowIndex, SURVEY_STATES.DONE);
          var gunSkinRowIndex = 1 + getRandomInt(getPropValueAsInt(PROPS.MAX_ROW_GUN_PROPERTIES) - 1);
          var gunSkin = EMOJI_GUN_PROPERTIES_TABLE.getRange(gunSkinRowIndex, 1).getValue() + "-" + EMOJI_GUN_PROPERTIES_TABLE.getRange(gunSkinRowIndex, 2).getValue();
          _setResponseSkin(availabilityRowIndex, gunSkin);
          _updateAvailabilityCommentsInSlack(availabilityRowIndex);
        }
        
        break;
        
      case "choose_gun_skin":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.CHOOSE_SKIN_STEP_1) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.CHOOSE_SKIN_STEP_1);
          _askForGunSkinSelectionStart(userId);
        }
        
        break;
        
      case "keep_existing_gun_skin":
        
        _setStatus(availabilityRowIndex, SURVEY_STATES.DONE);
        _updateAvailabilityCommentsInSlack(availabilityRowIndex);
        
        break;
        
      case "select_by_skin":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.CHOOSE_SKIN_STEP_2) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.CHOOSE_SKIN_STEP_2);
          _askForSpecificSkin(userId);
        }
        
        break;
        
      case "select_by_gun":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.CHOOSE_SKIN_STEP_2) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.CHOOSE_SKIN_STEP_2);
          _askForSpecificGun(userId);
        }
        
        break;
        
      case "update_battle_pass":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.BP_LEVEL_PENDING) {
          var battlePassRowIndex = getNextBattlePassRowIndex();
          
          BATTLE_PASS_TRACKER_TABLE.getRange("A" + battlePassRowIndex).setValue(getDateString(new Date()));
          BATTLE_PASS_TRACKER_TABLE.getRange("B" + battlePassRowIndex).setValue(userId);
          BATTLE_PASS_TRACKER_TABLE.getRange("C" + battlePassRowIndex).setValue("Ignition Act 1");
          _setStatus(availabilityRowIndex, SURVEY_STATES.BP_LEVEL_PENDING);
          
          var commentResponse = _askForBattlePassLevel(userId);
          BATTLE_PASS_TRACKER_TABLE.getRange("W" + battlePassRowIndex).setNumberFormat("@");
          BATTLE_PASS_TRACKER_TABLE.getRange("W" + battlePassRowIndex).setValue(JSON.parse(commentResponse).ts);
        }
        
        break;
        
      case "nevermind_bp_update":
        
        if (_getStatus(availabilityRowIndex) != SURVEY_STATES.DONE) {
          _setStatus(availabilityRowIndex, SURVEY_STATES.DONE);
        }
        
        break;
        
      default:
        
        if (_getStatus(availabilityRowIndex) == SURVEY_STATES.CHOOSE_SKIN_STEP_2) {
        
          var skins = getAllSkinTypes();
          var guns = getAllGunTypes();
          
          log("filtered skins:");
          
          if (guns.indexOf(action.value) >= 0) {
            
            _setStatus(availabilityRowIndex, SURVEY_STATES.CHOOSE_SKIN_STEP_3)
            var filteredSkins = getAllGunsMatchingExpression((a, b) => (a == action.value));
            _askForSkinnedGun(userId, filteredSkins);
            
          } else if (skins.indexOf(("" + action.value).trim()) >= 0) {
            
            _setStatus(availabilityRowIndex, SURVEY_STATES.CHOOSE_SKIN_STEP_3)
            var filteredSkins = getAllGunsMatchingExpression((a, b) => (b == action.value));
            _askForSkinnedGun(userId, filteredSkins);
            
          }
          
          newSectionInLog();
        
        } else if (_getStatus(availabilityRowIndex) == SURVEY_STATES.CHOOSE_SKIN_STEP_3) {
          
          _setStatus(availabilityRowIndex, SURVEY_STATES.DONE);
          _setResponseSkin(availabilityRowIndex, action.value);
          _updateAvailabilityCommentsInSlack(availabilityRowIndex)
          
        } else if (_getStatus(availabilityRowIndex) == SURVEY_STATES.START_TIME_CHOICE_PENDING) {
          
          _setStatus(availabilityRowIndex, SURVEY_STATES.END_TIME_CHOICE_PENDING)
          _setStartTime(availabilityRowIndex, action.value.split("_")[1]);
          _askForEndTime(userId);
          
        } else if (_getStatus(availabilityRowIndex) == SURVEY_STATES.END_TIME_CHOICE_PENDING) {
          
          _setStatus(availabilityRowIndex, SURVEY_STATES.COMMENT_PENDING);
          _setEndTime(availabilityRowIndex, action.value.split("_")[1]);
          _updateAvailabilityCommentsInSlack(availabilityRowIndex)
          _askForComment(userId, "Any comments about your availability?", "No");
          
        } else if (_getStatus(availabilityRowIndex) == SURVEY_STATES.BP_WEEKLIES_COMPLETED_PENDING) {
          
          _setStatus(availabilityRowIndex, SURVEY_STATES.DONE);
          BATTLE_PASS_TRACKER_TABLE.getRange("F" + battlePassRowIndex).setValue(parseInt(action.value.split("_")[2]));
        } 
        
        break;
        
    }
  
  } catch (err) {
    
    Logger.log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error when handling survey interaction: " + err);
    
  }
}

function _handleDirectMessage(payload) {
  
  try {
    
    loadSlackAvailabilityTable();
    loadBattlePassProgressTable();
    
    var userId = payload.event.user;
    var channelId = payload.event.channel;
    var eventTs = payload.event.event_ts;
    var messageText = payload.event.text;
    var availabilityRowIndex = getTodaysSlackAvailabilityRowIndex(userId);
    var status = _getStatus(availabilityRowIndex)
    var statusDetail = _getStatusDetail(availabilityRowIndex);
    var battlePassRowIndex = getMostRecentBattlePassRowIndex(userId);
    
    // Don't handle duplicate messages from Slack.
    if (eventTs == BATTLE_PASS_TRACKER_TABLE.getRange("Y" + battlePassRowIndex).getValue()) {
      return;
    }
    
    if (null != statusDetail && "" != statusDetail) {
      _doExecuteSlackApiCall("https://slack.com/api/chat.delete", "post", channelId, statusDetail);
    }
      
    
    if (SURVEY_STATES.COMMENT_PENDING == status) {
      
      SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.additionalComments).setValue(payload.event.text);
      _setStatus(availabilityRowIndex, SURVEY_STATES.GUN_SKIN_CHOICE_PENDING);
      _askForGunSkinSetting(payload.event.user, SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.responseSkin).getValue());
      
    } else if (SURVEY_STATES.BP_LEVEL_PENDING == status) {
        
      var commentResponse = _askForBattlePassRemainingXP(userId);
      
      _setStatus(availabilityRowIndex, SURVEY_STATES.BP_XP_REMAINING_PENDING);
      _setStatusDetail(availabilityRowIndex, JSON.parse(commentResponse).ts);
      
      BATTLE_PASS_TRACKER_TABLE.getRange("X" + battlePassRowIndex).setNumberFormat("@");
      BATTLE_PASS_TRACKER_TABLE.getRange("X" + battlePassRowIndex).setValue(JSON.parse(commentResponse).ts);
      BATTLE_PASS_TRACKER_TABLE.getRange("Y" + battlePassRowIndex).setNumberFormat("@");
      BATTLE_PASS_TRACKER_TABLE.getRange("Y" + battlePassRowIndex).setValue(eventTs);
      
      if (parseInt(messageText) != NaN) {
        BATTLE_PASS_TRACKER_TABLE.getRange("D" + battlePassRowIndex).setValue(messageText);
      }
      
    } else if (SURVEY_STATES.BP_XP_REMAINING_PENDING == status) {
          
      _setStatus(availabilityRowIndex, SURVEY_STATES.BP_WEEKLIES_COMPLETED_PENDING);
      _setStatusDetail(availabilityRowIndex, "");
      
      BATTLE_PASS_TRACKER_TABLE.getRange("Y" + battlePassRowIndex).setNumberFormat("@");
      BATTLE_PASS_TRACKER_TABLE.getRange("Y" + battlePassRowIndex).setValue(eventTs);
      
      if (parseInt(messageText) != NaN) {
        BATTLE_PASS_TRACKER_TABLE.getRange("E" + battlePassRowIndex).setValue(messageText);
      }
       _askForCompletedWeeklyMissions(userId);
      //copyBattlePassProgressToDb(battlePassRowIndex);
    }
    
  } catch (err) {
    
    Logger.log(err);
    
    postToSlack(ADMIN_DM_CHANNEL_ID, null, "Error when handling survey interaction: " + err);
    
  }
  
}

function _updateAvailabilityCommentsInSlack(availabilityRowIndex) {
  
  var userId = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.userId).getValue();
  var responseSkin = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.responseSkin).getValue();
  var numberGamesAvailable = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.numberGamesAvailable).getValue();
  var startTime = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.startTime).getValue();
  var endTime = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.endTime).getValue();
  var timezone = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.timezone).getValue();
  var additionalComments = SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.additionalComments).getValue();
  
  for (var i in AVAILABILITY_CHANNELS) {
     _doHandleFormResponse(userId, responseSkin, numberGamesAvailable, startTime, endTime, timezone, additionalComments, parseInt(i));
     
     //var membersInChannel = 
     //    JSON.parse(_doExecuteSlackApiCall("https://slack.com/api/conversations.members?channel=" + AVAILABILITY_CHANNELS[i], "get")).members;
     
     //inAtLeastOneAvailabilityChannel = inAtLeastOneAvailabilityChannel || membersInChannel.includes(userId);
   }
}

function _setResponseSkin(availabilityRowIndex, responseSkin) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.responseSkin, responseSkin);
}

function _getResponseSkin(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.responseSkin);
}

function _setNumberGamesAvailable(availabilityRowIndex, numberGamesAvailable) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.numberGamesAvailable, numberGamesAvailable);
}

function _getNumberGamesAvailable(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.numberGamesAvailable);
}

function _setStartTime(availabilityRowIndex, startTime) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.startTime, startTime);
}

function _getStartTime(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.startTime);
}

function _setEndTime(availabilityRowIndex, endTime) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.endTime, endTime);
}

function _getEndTime(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.endTime);
}

function _setTimezone(availabilityRowIndex, timezone) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.timezone, timezone);
}

function _getTimezone(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.timezone);
}

function _setAdditionalComments(availabilityRowIndex, additionalComments) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.additionalComments, additionalComments);
}

function _getAdditionalComments(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.additionalComments);
}

function _setStatus(availabilityRowIndex, status) {
  _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.status, status);
}

function _getStatus(availabilityRowIndex) {
  return _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, slackAvailabilityColumns.status);
}

function _doSetValueFromSlackAvailabilityDb(availabilityRowIndex, column, value) {
  SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, column).setValue(value);
}

function _doGetValueFromSlackAvailabilityDb(availabilityRowIndex, column) {
  return SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, column).getValue();
}

// Kept separate since number format needs to be specifically set for this column
function _setStatusDetail(availabilityRowIndex, statusDetail) {
  SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.statusDetail).setNumberFormat("@");
  SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.statusDetail).setValue(statusDetail);
}

function _getStatusDetail(availabilityRowIndex) {
  return SLACK_AVAILABILITY_TABLE.getRange(availabilityRowIndex, slackAvailabilityColumns.statusDetail).getValue();
}
