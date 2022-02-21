function addImportrangePermission(donorId) {
  // id of the spreadsheet to add permission to import
  var ssId = SpreadsheetApp.getActiveSpreadsheet().getId();

  // adding permission by fetching this url
  var url = "https://docs.google.com/spreadsheets/d/"+ssId+"/externaldata/addimportrangepermissions?donorDocId="+donorId;

  var token = ScriptApp.getOAuthToken();

  var params = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true
  };
  
  var response = UrlFetchApp.fetch(url, params);
  //Logger.log(response);
}

function getDonorId(url){
 var parts = url.split("/");
 return parts[5];
}

function testDonorId(){
  getDonorId("<<input spreadsheet url to test>>");
}

function checkAccessSheets(){
  getConfiguration();
  checkAccessSingleSheet(importResultsSheet,resultsUrl);
  checkAccessSingleSheet(importQuestionsSheet,questionsUrl);
  var output = buildHTML("<img style='width:20%' src='https://drive.google.com/uc?export=view&id=1wtSpJ8sGqKx0zdXLiPNWbL-SM_S20m7U'> <p>Authorization Granted</p>");
    showAlert(output);
}

function checkAccessSingleSheet(sheetName,sheetUrl){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); 
  var dataset = sheet.getRange(1,1,sheet.getLastRow(),3).getValues();
  if (dataset.length < 2){
    var donor = getDonorId(sheetUrl);
    addImportrangePermission(donor) 
  }else{
    //Logger.log('permissions already granted');
  }
}

function hasAccessSheets(){
  var accessOne = hasAccessSingleSheets(importResultsSheet);
  var accessTwo = hasAccessSingleSheets(importQuestionsSheet);
  return accessOne && accessTwo;
}

function hasAccessSingleSheets(sheetName){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName); 
  var dataset = sheet.getRange(1,1,sheet.getLastRow(),3).getValues();
  return !(dataset.length < 2);
}