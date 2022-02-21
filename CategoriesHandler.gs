// Search Category of a question
function searchCategory(question){
  var sheetCategories = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(importQuestionsSheet);
  var dataset = sheetCategories.getRange(1,1,sheetCategories.getLastRow()-1,2).getValues();
  for (var i in dataset) {
    if(dataset[i][0] == question) {
      return dataset [i][1];
    }
  }

}

// Calculate the average of a Question
function calculateAverage(values) {
  var rowtemp = copyArray(values) 
  //rowtemp.filter(Number);
  rowtemp.shift(); // eliminate the first value that is a string
  rowtemp = rowtemp.join('').split(''); 
  
  var sum = 0;
  for( var i = 0; i < rowtemp.length; i++ ){
      sum += parseInt( rowtemp[i], 10 ); //don't forget to add the base
  }

  var avg = sum/rowtemp.length;

  return avg;

}

// Update the average of a Category on CategoriesArray
function updateCategory(category, average) {
  var index = searchCategoryArray(categoriesArray,category);
  if(index >= 0){
    categoriesArray[index][2] += average;
    categoriesArray[index][3] += 1;
  }else{
    categoriesArray.push([category,0,average,1])
  }
}

//Add IDs of image questions to an array with categories
var categoryItemIDs = [];
function addIDtoCategory(category,idItem){
  var index = searchCategoryArray(categoryItemIDs,category);
  if(index >= 0){
    categoryItemIDs[index][1].push(idItem);
  }else{
    categoryItemIDs.push([category,[idItem]]);
  }
}

// Find an index of a category inside an array
function searchCategoryArray(array,category) {
  for (var i in array){
    if (array[i][0] == category){
      return i;
    }
  }
  return -1;
}

// Calculate the average of the categories inside CategoriesArray
function calculateAverageCategory(){
  for(var i in categoriesArray) {
    categoriesArray[i][1] = categoriesArray[i][2] / categoriesArray[i][3];
  }
}

