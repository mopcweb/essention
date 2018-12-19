import './index.sass';

const list = angular.module('essention', []);
list.controller('Render', ['$scope', '$http', function ($scope, $http) {
  // Initial variables for data
  $scope.csv = {};
  $scope.xml = [];

  // Call fetch
  getData('/api/get', $scope.csv, $scope.xml)

  // Upload on server + refetch data from serve after it
  $scope.upload = function() {
    var config = {
      headers: {'Content-Type': undefined},
      transformRequest: angular.identity
    }

    return $http.post('/api/post', $scope.file[0], config)
      .then(res => {
        $scope.csv = {};
        $scope.xml = [];

        getData('/api/get', $scope.csv, $scope.xml)
      })
      .catch(err => console.log(err));
  };

  // Event listener onChange textarea value -> transpile into csv & xml
  $scope.change = function(e) {
    let value = e.target.value;

    $scope.csvText = {};
    $scope.xmlText = [];

    convertIntoCSV(value, $scope.csvText);
    convertIntoXML(value, $scope.xmlText);
  };

  // Fetching data from server
  function getData(url, csvObject, xmlArray) {
    $http.get(url)
      .then(res => res.data)
      .then(data => {
        convertIntoCSV(data, csvObject)
        convertIntoXML(data, xmlArray)
      })
      .catch(err => console.log(err));
  };

}]);

// Add ng-model for input[type='file']
list.directive('selectNgFiles', function() {
  return {
    require: "ngModel",
    link: function postLink(scope, elem, attrs, ngModel) {
      elem.on("change", function(e) {
        var files = elem[0].files;
        ngModel.$setViewValue(files);
      })
    }
  }
});

// Template for transpile
list.directive('output', function() {
  return {
    restrict: 'E',
    scope: {
      csv: '=csv',
      xml: '=xml',
    },
    template:
      '<div>' +
        '<div class="Csv">' +
          '<span>CSV</span>' +
          '<div ng-repeat="(key ,value) in csv">' +
            '<b>{{key}}:</b> <i>{{value.toString()}}</i>'+
          '</div>' +
        '</div>' +
        '<code class="Xml">' +
          '<span>XML</span>' +
          '<span ng-if="xml.length">' +
          '&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; standalone=&quot;yes&quot;?&gt;' +
          '<br />' +
          '&lt;text&gt;' +
          '</span>' +
          '<div ng-repeat="item in xml" class="Sentences">' +
            '&lt;sentence&gt;' +
            '<div ng-repeat="i in item track by $index" class="Words">' +
            '{{i}}' +
            '</div>' +
            '&lt;/sentence&gt;' +
          '</div>' +
          '<span ng-if="xml.length">' +
          '&lt;/text&gt;' +
          '</span>' +
        '</code>' +
      '</div>'
  };
});

// Special for CSV
function convertIntoCSV(data, obj) {
  let text = convertIntoJs(data)

  // Merge sentences & words into obj
  text.sentences.forEach((item, i) => obj[item] = text.words[i])
};

// Special for XML
function convertIntoXML(data, arr) {
  let words = convertIntoJs(data)

  let xmlWords = words.words.map(item => item.map(item => `<word>${item}</word>`))

  // Merge sentences & words into arr
  xmlWords.forEach((item, i) => arr.push(item))
};

// Create arrays of sentences & words
function convertIntoJs(data) {
  const reg = /\s{2,}/gi;
  const comma = /,{2,}/gi;

  let arr = data.split('.');

  let sentences = arr.map(item => item.trim().replace(reg, ' ').replace(comma, ' ,'));

  // Delete last empty item after last dot
  if (sentences[sentences.length - 1] === '') sentences = sentences.slice(0,-1);

  // Words array
  let words = sentences.map(item => item.replace(/,/gi, '').split(' ').sort((a, b) => a.localeCompare(b)));

  return {
    sentences: sentences,
    words: words
  };
};
