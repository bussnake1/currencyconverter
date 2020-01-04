// 1. send request to get all type of available currencies
//      https://api.ratesapi.io/api/latest
// 2. List these currencies in a dropdown select for base, and target as well, so user can select what to convert to what
// 3. need a convert button too
// 4. on button press, send request with selected data
// 5. req handler --> show results
var conversionRate = null;
var conversionUrl = '';

// elements
var selectBase = null;
var selectTo = null;
var inputBase = null;
var inputTo = null;

document.addEventListener(
    "DOMContentLoaded",
    function() {
        selectBase = document.getElementById('base');
        selectTo = document.getElementById('to');
        inputBase = document.getElementById('input-base');
        inputTo = document.getElementById('input-to');

        inputBase.oninput = conversionHandler;
        inputTo.oninput = conversionHandler;
            
        // 1. send request to get all type of available currencies
        //      https://api.ratesapi.io/api/latest
        // 2. List these currencies in a dropdown select for base, and target as well, so user can select what to convert to what
        ajax('GET', 'https://api.ratesapi.io/api/latest', function (response) {
            var res = JSON.parse(response);
            // console.log(res);
            currencies = Object.keys(res.rates);
            currencies.push(res.base);

            // create options from currencies
            var dropdowns = [selectBase, selectTo];
            dropdowns.forEach(function (dropdown) {
                fillOptions(dropdown, currencies);
                dropdown.onchange = conversionHandler;
            });
          
            // setting conversionrate
            conversionHandler({target: inputBase});
        }, function () { console.log('Error!!!')});
      
  },
  false
);

function conversionHandler(event) {
    // create api url for current conversion
    conversionUrl = createConversionUrl();
    // call ajax with valid input value and 2 currencies
    ajax('GET', conversionUrl, function (response) {
        conversionRate = JSON.parse(response).rates[selectTo.value];
        // console.log(conversionRate)
        if (canConvert()) {
            if (event.target.id === inputBase.id) {
                convertBase();
            }
            if (event.target.id === inputTo.id) {
                convertTo();
            }
            else {
                convertBase();
                convertTo();
            }
            
        }
    }, function () { console.log('Error!!!!') });
}

function createConversionUrl(){
    return `https://api.ratesapi.io/api/latest?base=${selectBase.value}&symbols=${selectTo.value}`;
}

function convertBase() {
    if (validateInput(inputBase.value)) {
        inputTo.value = (parseFloat(inputBase.value) * conversionRate).toFixed(2);
    }
}
function convertTo() {
    if (validateInput(inputTo.value)) {
        inputBase.value = (parseFloat(inputTo.value) / conversionRate).toFixed(2);
    }
}

function canConvert() {
    // console.log(event.target.value);
    return validateInput(inputBase.value) || validateInput(inputTo.value);
}

function validateInput(value) {
    return /^\d+$/.test(value);
}

function createDropdownOption(parent, content) {
    var option = document.createElement("option");
    option.innerHTML = content;
    parent.add(option);
}

function fillOptions(parent, currencies) {
    currencies.forEach(function (currency) {
        createDropdownOption(parent, currency);
    });
}

function ajax(type, url, success, error) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      // Process the server response here.
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // Everything is good, the response was received.
    } else {
        // Not ready yet.
    }
    if (httpRequest.status === 200) {
        // Perfect!
        success(httpRequest.responseText);
        
      } else {
        // There was a problem with the request.
        // For example, the response may have a 404 (Not Found)
        // or 500 (Internal Server Error) response code.
          error();
      }
    };

    httpRequest.open(type, url, true);
    httpRequest.send();
}