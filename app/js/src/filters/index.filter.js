(() => {
  angular.module("app").filter("convertCurrency", convertCurrency);

  function convertCurrency() {
    return function(input, conversionRate) {
      if (!input) {
        return 0;
      } else {
        return input * conversionRate;
      }
    };
  }

  angular.module("app").filter("roundNum", roundNum);

  function roundNum() {
    return function(input, place) {
      if (!input) {
        return 0;
      } else {
        return Number(input).toFixed(place);
      }
    };
  }

  
  

})();
