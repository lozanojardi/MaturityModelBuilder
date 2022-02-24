var editors = []; //add here email addresses to automatically add editors to the generated Google Forms

function createNewForm() {
  getConfiguration();
  showLoderSidebar(true);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(importQuestionsSheet);
  var rangeData = sheet.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();   
  var searchRange = sheet.getRange(2,1, lastRow-1, 1);

  var form = FormApp.create(form_title)
    .setDescription(form_description)
    .setConfirmationMessage(form_thank_you);

 var rangeValues = searchRange.getValues();
  for ( i = 0; i < lastRow - 1; i++){
    if(rangeValues[i][0] !== undefined){
      createQuestion(form, rangeValues[i][0]);
    }
  }
  //showLoderSidebar(false);
  addEditors(form,editors);
  var output = buildHTML("<p>Google Form Successfully created</p><br><a class='button' target='_blank' href='"+form.getPublishedUrl()+"' onclick='google.script.host.close()' >Open Google Form</a>");
  showAlert(output);
  //openNewTab(form.getEditUrl());
  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Editor URL: ' + form.getEditUrl());
  
}

function createQuestion(form, question){
  form.addScaleItem()
    .setTitle(question)
     .setBounds(values[0], values[values.length-1])
     .setLabels(scale_label_lower, scale_label_upper);
}

function openNewTab(url){  
  var html = "<script>window.open('" + url + "');google.script.host.close();</script>";
  var userInterface = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Open Tab');

}

function addEditors(form, emails){
  for (var i in emails) {
    form.addEditor(emails[i]);
  }
}
