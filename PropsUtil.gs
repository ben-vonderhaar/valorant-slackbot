var PROPS = { MAX_ROW_GUN_PROPERTIES : 1, LOG_OUTPUT_TO_DOC : 2 };

function getPropValue(propKey) {
  
  loadPropsTable();
  return PROPS_TABLE.getRange("B" + propKey).getValue();
  
}

function getPropValueAsInt(propKey) {
  
  loadPropsTable();
  return parseInt(PROPS_TABLE.getRange("B" + propKey).getValue());
  
}

function getPropValueAsBoolean(propKey) {
  
  loadPropsTable();
  return (PROPS_TABLE.getRange("B" + propKey).getValue() == "TRUE");
  
}
