function testPerformShapeRequest(){
  var shape = {
     "data": {
          "content": "sample shape content",
          "shapeType": "rectangle"
     },
     "style": {
          "fillColor": "#fff9b1",
          "backgroundOpacity": "1.0",
          "fontFamily": "arial",
          "fontSize": "14",
          "borderColor": "#1a1a1a",
          "borderWidth": "2.0",
          "borderOpacity": "1.0",
          "borderStyle": "normal",
          "textAlign": "center"
     },
     "geometry": {
          "width": 100,
          "height": 50,
          "rotation": 0
     },
     "position": {
          "x": 0,
          "y": 0,
          "origin": "center"
     }
  };
  performShapeRequest(shape);
}

function testalertonMiro(){
  getConfiguration();
  alertOnMiro();
  Utilities.sleep(5000);
  alertOnMiro();
}