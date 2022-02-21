function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Maturity Model Builder')
      .addItem('Connect to Miro', 'showSidebar')
      .addItem('Authorize Google Sheets', 'checkAccessSheets')
      .addItem('Build Miro', 'startprocessing')
      .addSeparator()
      .addItem('Create Google Form', 'createNewForm')
      .addToUi();
}
