var foursquare = null; //foursquare instance

/*--- map is singleton, so this class is also singleton ---*/
function foursquareFactory(lat, lng) {
  if (!foursquare) {
    return new FourSquare(lat, lng);
  } else {
    return foursquare;
  }
}

var FourSquare = function (lat, lng) {
  this.clientId = FOURSQUARE_CLIENT_ID;
  this.clientSecret = FOURSQUARE_CLIENT_SECRET;
  this.categoryId = FOURSQUARE_CATEGORY_ID;
  this.limit = FOURSQUARE_SEARCH_LIMIT;
  this.searchTimeout = FOURSQUARE_SEARCH_TIMEOUT;
  this.lat = lat;
  this.lng = lng;
  this.apiVersion = FOURSQUARE_API_V;
};

/**
 * @description
 - update location
 * @param {number}lat  - latitude
 * @param {number}lng  - longitude
 */
FourSquare.prototype.updateLocation = function (lat, lng) {
  this.lat = lat;
  this.lng = lng;
};


FourSquare.prototype.defaultSearch = function (successFunc, errorFunc) {
  this.search(this.near, successFunc, errorFunc);
};

FourSquare.prototype.search = function (successFunc, errorFunc) {
  var params = {
    client_id: this.clientId,
    client_secret: this.clientSecret,
    ll: this.lat + ',' + this.lng,
    categoryId: this.categoryId,
    limit: this.limit,
    venuePhotos: 1,
    timeout: this.searchTimeout,
    v: this.apiVersion,
  };

  $.ajax(
    {
      url: FOURSQUARE_API_URL,
      type: 'GET',
      dataType: 'json',
      data: params,
      timeout: this.timeout
    }
  ).done(function (data) {
      var venues = [];
      var items = data.response.groups[0].items;
      if (items) {
        items.forEach(function (item) {
          var venue = new Venue(item.venue);
          venues.push(venue);
        });
      }
      successFunc(venues);
    }
  ).fail(function (jqXHR, textStatus, errorThrown) {
      errorFunc('API Error', 'Our external API service is temporary unavailable.');
      console.log('API Error ->', 'Our external API service is temporary unavailable.');
    }
  );
};