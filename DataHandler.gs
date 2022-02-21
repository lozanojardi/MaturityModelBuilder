function startprocessing() {
  checkMiroAccess();
  getConfiguration();
  if(!hasAccessSheets()){
    var output = buildHTML("<p>You don't have access to the Spreadsheet we are trying to import.</p> Please click on Authorize Google Sheets");
    showAlert(output);
    return false;
  }
  showLoderSidebar(true);
  alertOnMiro();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(traposedResultsSheet);
  var dataset = sheet.getRange(1,1,sheet.getLastRow()-1,sheet.getLastColumn()-1).getValues();
  var values2 = copyArray(values);
  values2.unshift("");
  //Logger.log(dataset);
  var newDataset = [];
  var averageQ = [];
  for (var i in dataset) {
    newDataset[i] = [];
    averageQ[i] = [];
    if(i == 0){
      
      newDataset[i] = values2;
      
    } else {
      newDataset[i][0] = dataset[i][0];
      averageQ[i-1][0] = dataset[i][0];
      averageQ[i-1][1] = parseFloat(calculateAverage(dataset[i]));
      for (var ii in values){  
          newDataset[i].push(dataset[i].count(values[ii]));  
      }
    }
  

  }
  buildCharts(newDataset,values2,averageQ);
  //var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoriesSheet);
  //sheet2.getRange(1,1,sheet.getLastRow()-1,values.length+1).setValues(newDataset);
}

function buildCharts(dataset,annotationsArray,averageQ){
  //Logger.log(averageQ);
  var x=0;
  var y=0;
  var annotations = [];
  for (var a in annotationsArray){
    var indexer = parseInt(a);
    annotations.push(indexer);
    if (a>0){
      annotations.push({calc: "stringify", sourceColumn: indexer, type: "string", role: "annotation"});
    }
    
  }
  var dataViewDefinition = Charts.newDataViewDefinition().setColumns(annotations).build();  // Added
  var preCategory = "";
  for (var i in dataset) {
    if(i>0){
      var data = Charts.newDataTable();
      for (var ii in dataset[0]){
        if(ii==0){
          data.addColumn(Charts.ColumnType.STRING,dataset[0][ii]);
        }else{
          data.addColumn(Charts.ColumnType.NUMBER,dataset[0][ii]);
        }
        
      }
      data.addRow(dataset[i]);
      
      data.build();

      var category = searchCategory(dataset[i][0]);
      //Logger.log(category);
      
      updateCategory(category,averageQ[i-1][1])
      
      if(category != preCategory) {
        categoriesJSON[category];
        preCategory = category;
      }

      var chart = Charts.newBarChart()
        .setDataTable(data)
        .setOption('isStacked','percent')
        //.setOption('colors', ['#34a853', '#6aa84f', '#fbbc04', '#ff9900', '#ea4335']) good to bad
        .setOption('colors', ['#ea4335', '#ff9900', '#fbbc04', '#6aa84f','#34a853']) // bad to good
        .setDimensions(800,200)
        .setTitle(dataset[i][0])
        //.setLegendPosition(Charts.Position.NONE) // in case we want to hide the legend
        .setDataViewDefinition(dataViewDefinition)
        .build();
      var chartOrigin = chart.getAs('image/png');
      var itemID = uploadplaceImage(chartOrigin, x, y);
      addIDtoCategory(category,itemID);
      //Logger.log(categoryItemIDs);
    }
  }
  //Logger.log(categoryItemIDs);
  calculateAverageCategory();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoriesSheet);
  var rangeText = "A1:D"+categoriesArray.length;
  var range = sheet.getRange(rangeText)
  range.setValues(categoriesArray);
  range.sort(2);
  var chartRange = sheet.getRange("A1:B"+categoriesArray.length);
  var roundChart = sheet.newChart()
    .setChartType(Charts.ChartType.RADAR)
    .setOption('vAxis.viewWindow.min', values[values.length-1])
    .setOption('vAxis.viewWindow.max', values[0])
    .setOption('lineWidth',10)
    .setOption('height',2000)
    .setOption('width',2000)
    .addRange(chartRange);
  sheet.insertChart(roundChart.setPosition(7, 1, 1, 1).build());
  var roundChartOrigin = sheet.getCharts()[0].getBlob().getAs('image/png');
  uploadplaceImage(roundChartOrigin, 0, 0);
  sheet.removeChart(sheet.getCharts()[0]);
  reshapeQuestions();
  
  finishScript();  
}


function reshapeQuestions(){
  // Reposition questions and create labels and links
  var sheetCategories = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoriesSheet);
  var dataset = sheetCategories.getRange(1,1,sheetCategories.getLastRow(),2).getValues();
  categoriesAmount = dataset.length;
  for (var i in dataset) {
    Logger.log(dataset.length);
    var index = searchCategoryArray(categoryItemIDs,dataset[i][0]);
    var coords = getCoordinates();
    var x = coords.x;
    var y = coords.y;
    
    //build frame
    var height = (categoryItemIDs[index][1].length * 300);
    var width = 900;
    var framey = y - 150;
    var framex = x;
    //Logger.log("frame for "+dataset[i][0]);
    //Logger.log("x: "+ framex + "  y: "+framey);
    //Logger.log("w: "+ width + "  h: "+height);
    var frame = buildFrame(dataset[i][0],framex,framey,height,width);
    var idframe = performFrameRequest(frame);

    //adapt Y
    y = y - height/2;

    //Build Bubble
    var bubblex = framex;
    var bubbley = framey;
    if (framex > 0){
      bubblex = framex-(width/2);
    }else if(framex < 0){
      bubblex = framex+(width/2);
    } else {
      if (framey > 0){
        bubbley = framey - (height/2);
      }else {
        bubbley = framey + (height/2);
      }
    }

    var bubble = buildShape("",bubblex,bubbley,"circle",50,50);
    var idb = performShapeRequest(bubble);


    // First Label
    var coords2 = getCoordinates2();
    var x2 = coords2.x;
    var y2 = coords2.y;
    var shape2 = buildShape(dataset[i][0],x2,y2,"rectangle",200,50);
    var id2 = performShapeRequest(shape2);

    for (var ii in categoryItemIDs[index][1]){
      updateLocation(categoryItemIDs[index][1][ii],x,y)
      y = y + 300;
    }

    // Connect Label with Bubble
    var widget = buildConnectionLine(idb,id2);
    performWidgetRequest(widget);


    
  }


}

function finishScript(){
  //showLoderSidebar(false);
  alertOnMiro();
  var url = "https://miro.com/app/board/"+boardID+"/";
  var content = buildHTML("<p>Maturity Model Overview Successfully created in Miro</p><br><a class='button' target='_blank' href='"+url+"'>Open Miro Board</a>");
  showAlert(content);
}





