function getChannelIdForUserConversation(userId) {
  
  var directMessages = JSON.parse(_doExecuteSlackApiCall("https://slack.com/api/conversations.list?types=im,mpim", "get", null, null, null, null));
  
  for (var i in directMessages.channels) {
    
    if (userId == directMessages.channels[i].user) {
      return directMessages.channels[i].id;
    }
  }
  
  return null;
}


/**
 * Executes a GET request to retrieve full user information for the given Slack User ID
 */
function getUserInfo(userId) {
  return _doExecuteSlackApiCall("https://slack.com/api/users.info?user=" + userId, "get", null, null, null, null);
}

/**
 * Executes a POST request to post to Slack as the slackbot
 */
function postToSlack(channel, conversation, text) {
  return _doExecuteSlackApiCall("https://slack.com/api/chat.postMessage", "post", channel, conversation, null, text);
}

/**
 * Executes a POST request to post to slack as the user specified by the given Slack User ID
 */
function postToSlackAs(channel, conversation, userId, text) {
  return _doExecuteSlackApiCall("https://slack.com/api/chat.postMessage", "post", channel, conversation, userId, text);
}

function postEphemeralToSlack(channel, userId, text) {
  
  var payload = {
    "attachments" : [],
    "channel" : channel,
    "user" : userId,
    "text" : text
  };
  
  return _doExecuteSlackApiCallForPayload("https://slack.com/api/chat.postEphemeral", "post", payload);
}

/**
 * Internal function that handles formatting provided data points into a valid HTTP request, and returns the response.
 */
function _doExecuteSlackApiCall(apiEndpoint, method, channel, conversation, userId, text, imageUrl, timezoneName) {
  
  var headers = {
    "Authorization" : "Bearer " + OAUTH_BEARER_TOKEN
  };
  
  var payload = {
    "channel" : channel,
    "text" : text
  }
  
  if (null != conversation) {
    payload.thread_ts = conversation
    payload.ts = conversation
  }
 
  if (null != userId) {
    
    var userInfo = JSON.parse(getUserInfo(userId));
    
    payload.username = userInfo.user.profile.display_name_normalized,
    payload.icon_url = userInfo.user.profile.image_original
    
  }
  
  if (null != imageUrl) {
    payload.blocks = [
      {
        "type": "image",
        "title": {
          "type": "plain_text",
          "text": (null == timezoneName ? "[Unknown Time Zone!]" : "Times shown in " + timezoneName + " time ")
        },
        "image_url": imageUrl,
        "alt_text": "Availability Chart"
      }
    ]
  }
  
  var options = {
    "method" : method,
    "headers" : headers,
    "contentType" : "application/json"
  };
  
  if ("get" != method) {
    options.payload = JSON.stringify(payload);
  }
 
  log("Outgoing request:");
  log(apiEndpoint + ": ")
  log(JSON.stringify(options));
  
  var response = UrlFetchApp.fetch(apiEndpoint, options);
  
  log("Response:");
  log(response);
  
  return response;
}

function _doExecuteSlackApiCallForPayload(apiEndpoint, method, payload) {
  
  var headers = {
    "Authorization" : "Bearer " + OAUTH_BEARER_TOKEN
  };
  
  
  var options = {
    "method" : method,
    "headers" : headers,
    "contentType" : "application/json"
  };
  
  if ("get" != method) {
    options.payload = JSON.stringify(payload);
  }
 
  log("Outgoing request:");
  log(apiEndpoint + ": ");
  log(JSON.stringify(options));
  
  var response = UrlFetchApp.fetch(apiEndpoint, options);
  
  log("Response:");
  log(response);
  
  return response;
}

function pushView(logger, viewPayload, triggerId, responseUrl) {
  
  var apiEndpoint = "https://slack.com/api/views.push";
  
  var headers = {
    "Authorization" : "Bearer " + OAUTH_BEARER_TOKEN
  };
  
  var payload = {
    "view": viewPayload,
    "trigger_id": triggerId
  };
  
  var options = {
    "method" : "post",
    "headers" : headers,
    "contentType" : "application/json; charset=utf-8",
    "payload" : JSON.stringify(payload)
  };
 
  log("Outgoing request:");
  log(apiEndpoint + ": ")
  log(JSON.stringify(payload));
  
  var response = UrlFetchApp.fetch(apiEndpoint, options);
  
  log("Response:");
  log(response.getResponseCode());
  log(response.getContentText());
  
  return response;
}

function t2() {
  
  var apiEndpoint = "https://slack.com/api/chat.postMessage";
  
  var headers = {
    "Authorization" : "Bearer " + OAUTH_BEARER_TOKEN
  };
  
  var payload = {};
  
  payload.channel = "D013PUU5CP9";
  
  payload.blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Testereeno"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Take Survey",
            "emoji": false
          },
          "value": "start_survey"
        }
      ]
    }
  ]
  
  
  var options = {
    "method" : "post",
    "headers" : headers,
    "contentType" : "application/json"
  };
  
  options.payload = JSON.stringify(payload);
  
 
  log("Outgoing request:");
  log(apiEndpoint + ": ")
  log(JSON.stringify(options));
  
  var response = UrlFetchApp.fetch(apiEndpoint, options);
  
  log("Response:");
  log(response);
  
  return response;
}