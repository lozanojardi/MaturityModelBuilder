var categoriesArray = [];
var values = [];
var categoriesJSON = [];
var categoriesAmount = 0;
var boardID = '';
var form_title;
var form_description;
var form_thank_you;
var scale_label_lower;
var scale_label_upper;
var resultsUrl;
var questionsUrl;

//sheet names
var configSheet = "Config"; //to create
var importResultsSheet = "Results"; //sheet2
var importQuestionsSheet = "Questions"; //sheet5
var traposedResultsSheet = "Trasposed Results"; //sheet3
var categoriesSheet = "Categories"; // sheet4

function getConfiguration() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheet); 
  var dataset = sheet.getRange(1,1,sheet.getLastRow(),3).getValues();
  
  // Configs for Miro
  boardID = searchConfiguration("BoardID",dataset);
  values = searchConfiguration("Values",dataset).split(',');
  resultsUrl = searchConfiguration("ResultsUrl",dataset);
  questionsUrl = searchConfiguration("QuestionsUrl",dataset);

  // Configs for Form Creation
  form_title = searchConfiguration("form_title",dataset);
  form_description = searchConfiguration("form_description",dataset);
  form_thank_you = searchConfiguration("form_thank_you",dataset);
  scale_label_lower = searchConfiguration("scale_label_lower",dataset);
  scale_label_upper = searchConfiguration("scale_label_upper",dataset);

 
}

function searchConfiguration(field,array){
  for (var i in array){
    if (array[i][0] == field){
      return array[i][2];
    } 
  }
}