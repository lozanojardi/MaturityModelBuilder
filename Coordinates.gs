var counterCoordinates = 0;
var counterCoordinates2 = 0;
var counterCoordinates3 = 0;

function getCoordinates() {
  var total = 360;
  var minimumDistance = 3000;
    var theta = (total/categoriesAmount*counterCoordinates)-90;
    var x = round(minimumDistance * Math.cos(toRadians(theta)));
    var y = round(minimumDistance * Math.sin(toRadians(theta)));
    counterCoordinates++;
    return {
      x: x,
      y: y
    }
}

function getCoordinates2() {
  var total = 360;
  var minimumDistance = 1000;
    var theta = (total/categoriesAmount*counterCoordinates2)-90;
    var x = round(minimumDistance * Math.cos(toRadians(theta)));
    var y = round(minimumDistance * Math.sin(toRadians(theta)));
    counterCoordinates2++;
    return {
      x: x,
      y: y
    }
}


function testGetCoordinates(){
  for(var i=0; i<12; i++){
    getCoordinates();
  }
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}