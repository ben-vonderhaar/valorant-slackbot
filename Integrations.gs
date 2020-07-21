var SLACKBOT_DB;
var AVAILABILITY_TABLE;
var AVAILABILITY_GRAPH_TABLE;
var AVAILABILITY_PACIFIC_GRAPH_TABLE;
var AVAILABILITY_MOUNTAIN_GRAPH_TABLE;
var AVAILABILITY_CENTRAL_GRAPH_TABLE;
var AVAILABILITY_EASTERN_GRAPH_TABLE;
var EMOJI_GUN_PROPERTIES_TABLE;
var SLACK_AVAILABILITY_TABLE;
var CURRENT_BATTLE_PASS_TABLE;
var BATTLE_PASS_TRACKER_TABLE;
var PROPS_TABLE;
var LOG_DOCUMENT;
var LOG_DOCUMENT_BODY;

function _loadSlackbotDB() {
  
  if (null == SLACKBOT_DB) {
    log("loaded SLACKBOT_DB");
    SLACKBOT_DB = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('DATABASE_SPREADSHEET_ID'));
  
  }
}

function loadAvailabilityTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_TABLE) {
    log("loaded AVAILABILITY_TABLE");
    AVAILABILITY_TABLE = SLACKBOT_DB.getSheetByName("Availability");
  }
  
}

function loadAvailabilityGraphTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_GRAPH_TABLE) {
    log("loaded AVAILABILITY_GRAPH_TABLE");
    AVAILABILITY_GRAPH_TABLE = SLACKBOT_DB.getSheetByName("Availability Timeline");
  }
  
}

function loadAvailabilityPacificGraphTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_PACIFIC_GRAPH_TABLE) {
    log("loaded AVAILABILITY_PACIFIC_GRAPH_TABLE");
    AVAILABILITY_PACIFIC_GRAPH_TABLE = SLACKBOT_DB.getSheetByName("Availability Timeline Pacific");
  }
  
}

function loadAvailabilityMountainGraphTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_MOUNTAIN_GRAPH_TABLE) {
    log("loaded AVAILABILITY_MOUNTAIN_GRAPH_TABLE");
    AVAILABILITY_MOUNTAIN_GRAPH_TABLE = SLACKBOT_DB.getSheetByName("Availability Timeline Mountain");
  }
  
}

function loadAvailabilityCentralGraphTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_CENTRAL_GRAPH_TABLE) {
    log("loaded AVAILABILITY_CENTRAL_GRAPH_TABLE");
    AVAILABILITY_CENTRAL_GRAPH_TABLE = SLACKBOT_DB.getSheetByName("Availability Timeline Central");
  }
  
}

function loadAvailabilityEasternGraphTable() {
  
  _loadSlackbotDB();
  
  if (null == AVAILABILITY_EASTERN_GRAPH_TABLE) {
    log("loaded AVAILABILITY_EASTERN_GRAPH_TABLE");
    AVAILABILITY_EASTERN_GRAPH_TABLE = SLACKBOT_DB.getSheetByName("Availability Timeline Eastern");
  }
  
}

function loadEmojiGunPropertiesTable() {
  
  _loadSlackbotDB();
  
  if (null == EMOJI_GUN_PROPERTIES_TABLE) {
    log("loaded EMOJI_GUN_PROPERTIES_TABLE");
    EMOJI_GUN_PROPERTIES_TABLE = SLACKBOT_DB.getSheetByName("Emoji Gun Properties");
  }
  
}

function loadSlackAvailabilityTable() {
  
  _loadSlackbotDB();
  
  if (null == SLACK_AVAILABILITY_TABLE) {
    log("loaded SLACK_AVAILABILITY_TABLE");
    SLACK_AVAILABILITY_TABLE = SLACKBOT_DB.getSheetByName("Slack Survey Availability");
  }
  
}

function loadBattlePassProgressTable() {
  
  _loadSlackbotDB();
  
  if (null == BATTLE_PASS_TRACKER_TABLE) {
    log("loaded BATTLE_PASS_TRACKER_TABLE");
    BATTLE_PASS_TRACKER_TABLE = SLACKBOT_DB.getSheetByName("Battle Pass Progress");
  }
  
}

function loadPropsTable() {
  
  _loadSlackbotDB();
  
  if (null == PROPS_TABLE) {
    log("loaded PROPS_TABLE");
    PROPS_TABLE = SLACKBOT_DB.getSheetByName("Props");
  }
  
}

function loadCurrentBattlePassTable() {
  
  if (null == CURRENT_BATTLE_PASS_TABLE) {
    log("loaded CURRENT_BATTLE_PASS_TABLE");
    CURRENT_BATTLE_PASS_TABLE = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('BATTLEPASS_DATABASE_SPREADSHEET_ID'))
                                             .getSheetByName("Ignition Act 1");
  }
  
}

function loadLogDocument() {
  
  if (null == LOG_DOCUMENT) {
    LOG_DOCUMENT = DocumentApp.openById(PropertiesService.getScriptProperties().getProperty('LOGS_DOC_ID'));
    LOG_DOCUMENT_BODY = LOG_DOCUMENT.getBody();
  }
  
}

function getAllAvailabilityGraphTables() {
  
  loadAvailabilityPacificGraphTable();
  loadAvailabilityMountainGraphTable();
  loadAvailabilityCentralGraphTable();
  loadAvailabilityEasternGraphTable();
  
  return [ AVAILABILITY_PACIFIC_GRAPH_TABLE, AVAILABILITY_MOUNTAIN_GRAPH_TABLE,
                                             AVAILABILITY_CENTRAL_GRAPH_TABLE, AVAILABILITY_EASTERN_GRAPH_TABLE ]; 
}
