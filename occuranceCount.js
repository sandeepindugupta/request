var request = require('request');
var array=[];

async function textDataFxn() {
  return await new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': 'http://norvig.com/big.txt',

      'headers': {
        'Accept': 'application/json'
      }
    };

    request(options, function (error, response, body) {

      if (!error) {
        resolve(response.body);
      } else {
        reject(error);
      }

    });

  });
}
async function createWordMap(wordsArray) {

  // create map for word and its frequency
  var wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}
async function occur() {

  var data = await textDataFxn();
  var apiResponse;
  var syn;
  var pos;
  var wordsArray = await splitByWords(data);
  var wordsMap = await createWordMap(wordsArray);
  var finalWordsArray = await sortByCount(wordsMap);
  for (var i = 0; i <= 9; i++) {
    apiResponse = await apiFunction(finalWordsArray[i].name);
    //Parshing into json object as api response is string value
    var res = JSON.parse(apiResponse).def
    // there is no data for some of the words
    if (res != "") {
      pos = res[0].tr[0].pos;
      //Some of the words there is no synonyms
      if (res[0].tr[0].syn) {
        syn = res[0].tr[0].syn[0].text;
      } else {
        syn = "Synonyms is not defined";
      }
    }
    var jsonVal = {
      "Text": finalWordsArray[i].name,
      "Word occurance count": finalWordsArray[i].total,
      "Synonyms": syn,
      "Part Of Speech/Pos": pos
    };
    array.push(jsonVal);


  }
  console.log("Final json array",array);
  console.log("array text",array[0].Text);

}


 async function splitByWords (text) {
  // split string by spaces (including spaces, tabs, and newlines)
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}





async function sortByCount(wordsMap) {

  // sort by count in descending order
  var finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map(function (key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });
  finalWordsArray.sort(function (a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;

}



async function apiFunction(textData) {
  return await new Promise(function (resolve, reject) {
    var options = {
      'method': 'GET',
      'url': 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-ru&text=' + textData,
      'headers': {
        'Accept': 'application/json'
      }
    };

    request(options, function (error, response, body) {

      if (!error) {
        resolve(response.body);
      } else {
        reject(error);
      }

    });

  });
}
occur();