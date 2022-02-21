function uploadplaceImage(chartImage2,posx,posy){
  var boardUrl = 'https://api.miro.com/v2/boards/'+boardID+'/images';
  var miroService = getMiroService();
  var metadata = {};
  var metadatatest = {
    data: JSON.stringify(metadata),
    resource:  chartImage2,
  };
  var options = {
    method: 'POST',
    muteHttpExceptions: true, 
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + miroService.getAccessToken(),
    },
    payload: metadatatest
  };
  var response = UrlFetchApp.fetch(boardUrl, options);
  //Logger.log(response);
  var item = JSON.parse(response.getContentText());
  return item.id;
  //return updateLocation(item.id,posx,posy);

}

function updateLocation(id,posx,posy){
  var miroService = getMiroService();
  var boardUrl = "https://api.miro.com/v2/boards/"+boardID+"/images/"+id+"/position";
  var options = {
    method: 'PATCH',
    muteHttpExceptions: true, 
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + miroService.getAccessToken(),
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({x: posx,y: posy})
    };
  var responseCall = UrlFetchApp.fetch(boardUrl, options);
  //Logger.log(responseCall);
  return id;
}

function performWidgetRequest(widget){
  var boardUrl = 'https://api.miro.com/v1/boards/'+boardID+'/widgets';
  var miroService = getMiroService();
    var options = {
      method: 'POST',
      muteHttpExceptions: true,
      payload: JSON.stringify(widget),
      headers: {
        Authorization: 'Bearer ' + miroService.getAccessToken(),
        Accept: OAuth2.TOKEN_FORMAT.JSON,
        'Content-type' : 'application/json'
      }
    };
    var response = UrlFetchApp.fetch(boardUrl, options);
}

function performFrameRequest(frame){
  var boardUrl = 'https://api.miro.com/v2/boards/'+boardID+'/frames';
  //https://api.miro.com/v2/boards/{board_id}/frames
  var miroService = getMiroService();
  var options = {
    method: 'POST',
    muteHttpExceptions: true,
    payload: JSON.stringify(frame),
    headers: {
      Authorization: 'Bearer ' + miroService.getAccessToken(),
      Accept: OAuth2.TOKEN_FORMAT.JSON,
      'Content-type' : 'application/json'
    }
  };
  var response = UrlFetchApp.fetch(boardUrl, options);
  //Logger.log(response);
  var item = JSON.parse(response.getContentText());
  return item.id;
}

function performShapeRequest(shape){
  var boardUrl = 'https://api.miro.com/v2/boards/'+boardID+'/shapes';
  //https://api.miro.com/v2/boards/{board_id}/shapes
  var miroService = getMiroService();
  var options = {
    method: 'POST',
    muteHttpExceptions: true,
    payload: JSON.stringify(shape),
    headers: {
      Authorization: 'Bearer ' + miroService.getAccessToken(),
      Accept: OAuth2.TOKEN_FORMAT.JSON,
      'Content-type' : 'application/json'
    }
  };
  var response = UrlFetchApp.fetch(boardUrl, options);
  var item = JSON.parse(response.getContentText());
  Logger.log(item);
  return item.id;
}

function performDeleteShapeRequest(id){
    var boardUrl = 'https://api.miro.com/v2/boards/'+boardID+'/shapes/'+id;
  var miroService = getMiroService();
  var options = {
    method: 'DELETE',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + miroService.getAccessToken(),
      Accept: OAuth2.TOKEN_FORMAT.JSON,
      'Content-type' : 'application/json'
    }
  };
  var response = UrlFetchApp.fetch(boardUrl, options);
  return response.getContentText();
}

function buildFrame(title,x,y,h,w){
  return {
     "data": {
          "title": title
     },
     "geometry": {
          "width": w,
          "height": h
     },
     "position": {
          "x": x,
          "y": y,
          "origin": "center"
     }
  };
}

function buildShape(title,x,y,shape,w,h,fontsize, color){
  if (!fontsize) fontsize = 14;
  if (!color) color = "#F4B400";
  return {
     "data": {
          "content": title,
          "shapeType": shape
     },
     "style": {
          "fillColor": color,
          "backgroundOpacity": "1.0",
          "fontFamily": "arial",
          "fontSize": fontsize,
          "borderColor": color,
          "borderWidth": "2.0",
          "borderOpacity": "1.0",
          "borderStyle": "normal",
          "textAlign": "center",
     },
     "geometry": {
          "width": w,
          "height": h,
          "rotation": 0
     },
     "position": {
          "x": x,
          "y": y,
          "origin": "center"
     }
  }
}

function buildConnectionLine(id1, id2){
  return {
    "type": "line",
    // required for creation
    "startWidget": {
      "id": id1
    },
    // required for creation
    "endWidget": {
      "id": id2
    },
    "style": {
      // supports short hex code color format
      "borderColor": "#000", // default: "#000000"
      // allowed values: "normal", "dashed", "dotted"
      "borderStyle": "normal", // default: "normal"
      // allowed values: 1.0, 2.0, 3.0, 4.0, 5.0, 8.0, 12.0, 16.0, 20.0, 24.0
      "borderWidth": 1.0, // default: 1.0
      // allowed values:
      // "none", "opaque_block", "rhombus", "opaque_rhombus", "circle", 
      // "opaque_circle", "block", "open_arrow", "opaque_arrow"
      "lineEndType": "opaque_block",
      "lineStartType": "opaque_block",
      // allowed values: "straight", "orthogonal", "bezier", "sketch"
      "lineType": "bezier" // default: "straight"
    }
  }
}

var warnID = ""
function alertOnMiro(){
  if (warnID == ""){
    var warn = buildShape("<p>WARNING! Do not touch this board. It is being edited by a script and you could interfere with the process.</p>",0,0,"rectangle",6000,4000,500,"#DB4437");
    warnID = performShapeRequest(warn);
    Logger.log(warnID);
  }else{
    performDeleteShapeRequest(warnID);
  }
}

function checkMiroAccess(){
   var miroService = getMiroService();
  if (!miroService.hasAccess()) {
    throw new Error('Before building the Miro, you should give access by clicking on "Connect to Miro"');
  }
}