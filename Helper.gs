String.prototype.addQuery = function(obj) {
  return this + Object.keys(obj).reduce(function(p, e, i) {
    return p + (i == 0 ? "?" : "&") +
      (Array.isArray(obj[e]) ? obj[e].reduce(function(str, f, j) {
        return str + e + "=" + encodeURIComponent(f) + (j != obj[e].length - 1 ? "&" : "")
      },"") : e + "=" + encodeURIComponent(obj[e]));
  },"");
}

function getTimeInSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

Object.defineProperties(Array.prototype, {
    count: {
        value: function(query) {
            /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
            var count = 0;
            for(let i=0; i<this.length; i++)
                if (this[i]==query)
                    count++;
            return count;
        }
    }
});

function copyArray(originArray){
  var destinationArray = [];
  for (i = 0; i < originArray.length; i++) {
    destinationArray[i] = originArray[i];
  }
  return destinationArray;
}

// NOT USED: just in case we want to insert a chart inside a sheet
function pasteImage(image) {
var imageData = Utilities.base64Encode(image);
var imageUrl = 'data:image/png;name='+imageName+';base64,' + encodeURI(imageData);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(categoriesSheet);
  sheet.insertImage(imageUrl, 5, 5);

}