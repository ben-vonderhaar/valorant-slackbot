var BATTLE_PASS_TABLE_MAPPING_CONFIG = {
  "C10" : 4, 
  "C11" : 5, 
  "C12" : 6,
  "C18" : 7,
  "J10" : 8,
  "J11" : 9,
  "J12" : 10,
  "J13" : 11,
  "J14" : 12,
  "J15" : 13,
  "J16" : 14,
  "C26" : 15,
  "C25" : 16,
  "C24" : 17,
  "C23" : 18,
  "C22" : 19,
  "C21" : 20,
  "C20" : 21,
  "C19" : 22
}; 

function cpbfiosdf() {
  copyBattlePassProgressToDb(10);
}

function copyBattlePassProgressToDb(battlePassProgressRowIndex) {
  
  loadBattlePassProgressTable();
  loadCurrentBattlePassTable();
  
  for (var i in BATTLE_PASS_TABLE_MAPPING_CONFIG) {
    BATTLE_PASS_TRACKER_TABLE.getRange(battlePassProgressRowIndex, BATTLE_PASS_TABLE_MAPPING_CONFIG[i])
        .setValue(CURRENT_BATTLE_PASS_TABLE.getRange(i).getValue())
  }
}

function makeGraphForUserPassProgress(userId, battlePassId) {
  
  loadBattlePassProgressTable();
  loadCurrentBattlePassTable();
  
  var xpData = [];
  var tierData = [];
  var labels = [];
  var battlePassStartDate = CURRENT_BATTLE_PASS_TABLE.getRange("C13").getValue();
  var battlePassEndDate = CURRENT_BATTLE_PASS_TABLE.getRange("C14").getValue();
  var highestTotalXP = 0;
  var projectedEndXP = 0;
  var projectedEndTier = 0;
  
  xpData.push({"x": 0, "y":0});
  tierData.push({"x": 0, "y":0});
  labels.push(0);
  
  var i = 2;
  
  while (true) {
    
    if (BATTLE_PASS_TRACKER_TABLE.getRange(i, 1).isBlank()) {
      break;
    } else if (BATTLE_PASS_TRACKER_TABLE.getRange(i, 2).getValue() == userId &&
               BATTLE_PASS_TRACKER_TABLE.getRange(i, 3).getValue() == battlePassId) {
      
      var totalXP = BATTLE_PASS_TRACKER_TABLE.getRange("G" + i).getValue();
 
      if (totalXP > highestTotalXP) {
        highestTotalXP = totalXP;
        projectedEndXP = BATTLE_PASS_TRACKER_TABLE.getRange("M" + i).getValue();
        projectedEndTier = BATTLE_PASS_TRACKER_TABLE.getRange("N" + i).getValue();
      }
      
      var daysSinceStart = getDifferenceBetweenDates(battlePassStartDate, 
                                                     getDateFromDateString(BATTLE_PASS_TRACKER_TABLE.getRange(i, 1).getValue()));
      
      labels.push(daysSinceStart);
      xpData.push({"x": daysSinceStart, "y": totalXP});
      tierData.push({"x": daysSinceStart, "y": BATTLE_PASS_TRACKER_TABLE.getRange("D" + i).getValue()});
    }
    
   
    i++;
    
  }
  
  var daysInBattlePass = Math.floor((battlePassEndDate.getTime() - battlePassStartDate.getTime()) / (1000 * 3600 * 24)); 
  
  labels.push(daysInBattlePass);
  xpData.push({"x":daysInBattlePass, "y": projectedEndXP});
  tierData.push({"x":daysInBattlePass, "y": projectedEndTier});
  
  var fullData = {
                  "datasets":[
                    {
                      "label": "Projected Final XP",
                      "data": xpData,
                      "yAxisID": "left-y-axis"
                    },{
                      "label": "Projected Final Tier",
                      "data": tierData,
                      "yAxisID": "right-y-axis"
                    }
                  ]};
  
  var options = {"scales": {
      "xAxes": [{
        "type":"linear",
        "ticks": {
          "max": daysInBattlePass
        }
      }],
      "yAxes": [{
        "id": "left-y-axis",
        "type": "linear",
        "position": "left",
        "ticks": {
          "max": 1375000
        }
      }, {
        "id": "right-y-axis",
        "type": "linear",
        "position": "right",
        "ticks": {
          "max": 50
        }
      }]
    }
  };
  
  var url = "https://quickchart.io/chart?c={type:'line',data:" + JSON.stringify(fullData) + ",options:" + JSON.stringify(options) + "}";
  
  Logger.log(url);
  
}
