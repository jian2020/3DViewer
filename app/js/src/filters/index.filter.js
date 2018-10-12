(() => {
  /* Currenty convertor */
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

  /* Round number */

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

  /* Fetch thumbnail */

  angular.module("app").filter("fetchThumbnail", fetchThumbnail);

  function fetchThumbnail() {
    return function(input) {
      if (!input) return;
      return /cloudinary/.test(input.secure_url)
        ? input.secure_url.replace(/\.pdf/, ".png")
        : input.thumbnail;
    };
  }
})();
