function showLoderSidebar(switcher) {
  if (switcher){
    var output = HtmlService.createHtmlOutput('<img width="100%" src=https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif>');
    SpreadsheetApp.getUi().showModalDialog(output, 'Processing...');
  }else{
    var output = HtmlService.createHtmlOutput('<script>google.script.host.close();</script>');
    SpreadsheetApp.getUi().showModalDialog(output, 'Finishing...');
  }
}

function showAlert(message){
  var output = HtmlService.createHtmlOutput(message);
  SpreadsheetApp.getUi().showModalDialog(output, 'Alert');
}

function showAlertHtml(message){
  SpreadsheetApp.getUi().showModalDialog(message, 'Alert');
}

function testshowLoderSidebar(){
  showLoderSidebar(true);
  Utilities.sleep(10000);
  //showLoderSidebar(false);

}
function testShowAlert(){
  var url = "http://google.com";
  var content = buildHTML("<p>Google Form Successfully created</p><br><a class='button' target='_blank' href='"+url+"'>Open Google Form</a>");
  Logger.log(content);
  showAlert(content);
}

function buildHTML(message){
  var output = '<style>.button {background-color: #4885ed;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;} .button:hover {background-color: #619bff;} body {font-family: "Google Sans",Roboto,RobotoDraft,Helvetica,Arial,sans-serif; text-align:center; font-size: 20px}</style>';
   output += message;
   return output;
}