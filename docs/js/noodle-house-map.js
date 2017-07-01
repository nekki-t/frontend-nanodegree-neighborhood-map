/* === < Global variables > =================================================================== */
var map; // global map
/*--- make these variables global, to avoid unexpected memory consumption ---*/
var noodleHouseMap;
var largeInfowindow;
var markers = [];

/*--- for infowindow ---*/
var infowindowPhotoLink = '';
var infowindowAddressInfo = '';
var infowindowCheckinCount = 0;
var infowindowUsersCount = 0;
var infowindowRepeatRate = 0;
var infowindowPhone = '';
var infowindowFormattedPhone = '';
var infowindowUrl = '';
var infowindowHourStatus = '';
var infowindowIsOpen = false;
var infowindowRating = 0;

/* === < Global function > =================================================================== */
/**
 * @description
 - Initial loading
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: MOUNTAIN_VIEW_LAT,
      lng: MOUNTAIN_VIEW_LON
    },
    zoom: DEFAULT_ZOOM_SIZE,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_RIGHT
    }
  });
  document.getElementById('map').style.bottom = 0;
  var timeAutoComplete = new google.maps.places.Autocomplete(
    document.getElementById('near')
  );
  largeInfowindow = largeInfowindow || new google.maps.InfoWindow();
  noodleHouseMapFactory();
}

/**
 * @description
 - Map must be singleton. This generates only one map instance.
 */
function noodleHouseMapFactory() {
  if (!noodleHouseMap) {
    noodleHouseMap = new NoodleHouseMap();
  }
  return noodleHouseMap;
}

/* === < NoodleHouseMap Class > =================================================================== */
/**
 * @description
    - Init NoodleHouseMap
 * @constructor
    - Init Location info and foursquare object
*/
var NoodleHouseMap = function () {
  this.loading = true;
  this.lat = MOUNTAIN_VIEW_LAT; // default Yeah! I love Udacity!
  this.lng = MOUNTAIN_VIEW_LON; // default
  this.foursquare = foursquareFactory(this.lat, this.lng);
};

/**
 * @description
    - Get geolocation for the current user
 * @param {callback} successFunc - success handling
 * @param {callback} errorFunc - error handling
*/
NoodleHouseMap.prototype.getLocation = function (successFunc, errorFunc) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition
    (successFunc, errorFunc);
  } else {
    console.log('Geolocation is not available...');
    errorFunc();
  }
};

NoodleHouseMap.prototype.changeNear = function(searchTarget, successFunc, errorFunc) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      address: searchTarget,
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var location = results[0].geometry.location;
        noodleHouseMap.lat = location.lat();
        noodleHouseMap.lng = location.lng();
        map.setCenter(location);
        noodleHouseMap.foursquare.updateLocation(noodleHouseMap.lat, noodleHouseMap.lng);
        noodleHouseMap.foursquare.search(successFunc, errorFunc);
      } else {
        errorFunc('Search location error', 'Input location was not founded.');
      }
    }
  );
};

/**
 * @description
    - move the center position of the map
 * @param {number} lat - latitude
 * @param {number} lng - longitude
*/
NoodleHouseMap.prototype.moveToLocation = function (lat, lng) {
  var latlng = {lat: lat, lng: lng};

  if(map && !noodleHouseMap.map) {
    noodleHouseMap.map = map;
    map.setCenter(new google.maps.LatLng(latlng));
  } else {
    noodleHouseMap.map = new google.maps.Map(document.getElementById('map'), {
      center: latlng,
      zoom: DEFAULT_ZOOM_SIZE,
      styles: MAP_STYLES,
      mapTypeControl: false
    });
  }

  largeInfowindow = largeInfowindow || new google.maps.InfoWindow();

};

/**
 * @description
    - set map to the default position
 * @param {function} successFunc - success handling
 * @param {function} errorFunc - error handling
*/
NoodleHouseMap.prototype.loadDefaultNoodleHouses = function (successFunc, errorFunc) {
  var self = this;
  this.getLocation(
    function (pos) {
      self.lat = pos.coords.latitude;
      self.lng = pos.coords.longitude;
      self.foursquare.updateLocation(self.lat, self.lng);
      noodleHouseMap.moveToLocation(self.lat, self.lng);
      noodleHouseMap.foursquare.search(successFunc, errorFunc);
    },
    function () {
      noodleHouseMap.foursquare.search(successFunc, errorFunc);
    }
  );
};

/**
 * @description
    - show markers for the given venues
 * @param {venue[]} noodleHouses - array of noodlehouse info
*/
NoodleHouseMap.prototype.setMarkers = function (noodleHouses) {

  var self = this;
  noodleHouses.forEach(function(nh){
    markers.push(createMarker(nh));
  });

  this.showListings();
};

/**
 * @description
    - show all markers on the map
*/
NoodleHouseMap.prototype.showAllMarkers = function () {
  markers.forEach(function(marker) {
    marker.setVisible(true);
  });
};

/**
 * @description
    - show markers which mathes filtering text
 * @param {venue} noodleHouse - for a marker information
*/
NoodleHouseMap.prototype.showFilteredMarkers = function (noodleHouse) {

  if(largeInfowindow) {
    largeInfowindow.close();
  }
  var filteredMarkers = markers.filter(function(marker) {
    return marker.id === noodleHouse.id;
  });

   if(filteredMarkers.length > 0) {
     filteredMarkers.forEach(function(marker) {
       marker.setVisible(true);
     });
     this.showListings();
  }
};

/**
 * @description
    - Remove all the markers: setMap(null) first then remove
*/
NoodleHouseMap.prototype.removeMarkers = function() {
  markers.forEach(function(marker){
    marker.setMap(null);
  });
  markers = [];
};

/**
 * @description
    - hide all the markers -> for filtering view
*/
NoodleHouseMap.prototype.hideMarkers = function () {
  markers.forEach(function(marker) {
    marker.setVisible(false);
  });
};

/**
 * @description
    - list markers on the map
*/
NoodleHouseMap.prototype.showListings = function () {
  var bounds = new google.maps.LatLngBounds();

  var self = this;
  if(!self.map) {
    self.map = map;
  }
  markers.forEach(function(marker) {
    marker.setMap(self.map);
    bounds.extend(marker.position);
  });
  noodleHouseMap.map.fitBounds(bounds);

};

NoodleHouseMap.prototype.showSelectedNoodleHouse = function (noodleHouse) {
  var target = markers.filter(function(marker) {
    return marker.id === noodleHouse.id;
  });

  if(target[0]) {
    selectMarkerAction(target[0], noodleHouse);
  }
};

/* === < Utilities > =================================================================== */
/**
 * @description
 - Create Marker from each noodle house
 * @param {NoodleHouse} noodleHouse - data from api
 */
function createMarker(noodleHouse) {
  var defaultIcon = makeMarkerIcon(false);
  var highlightedIcon = makeMarkerIcon(true);

  var marker = new google.maps.Marker({
    map: map,
    position: {lat: noodleHouse.location.lat, lng: noodleHouse.location.lng},
    title: noodleHouse.name,
    icon: defaultIcon,
    animation: google.maps.Animation.DROP,
    id: noodleHouse.id
  });
  marker.addListener('click', function () {
    selectMarkerAction(marker, noodleHouse);
  });
  marker.addListener('mouseover', function () {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function () {
    if(marker.getAnimation() == null) {
      this.setIcon(defaultIcon);
    }
  });
  return marker;
}

/**
 * @description
    - behavior when a marker is selected or clicked
 * @param {marker} marker - target marker
*/
function selectMarkerAction(marker, noodleHouse) {
  var defaultIcon = makeMarkerIcon(false);
  var highlightedIcon = makeMarkerIcon(true);

  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    markers.forEach(function(m){
      m.setAnimation(null);
      if(m != marker) {
        m.setIcon(defaultIcon);
      }
    });
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.setIcon(highlightedIcon);

    /*--- set values for Handlebars template ---*/
    setValuesForInfowindowTemplate(noodleHouse);
    populateInfoWindow(marker, largeInfowindow);
  }
}

/**
 * @description
    - return marker icon
 * @param {bool} isHighLighted - get icon default/highlighted
*/
function makeMarkerIcon (isHighLighted){

  var iconImage = DEFALT_ICON;
  if(isHighLighted) {
    iconImage = HIGH_LIGHTED_ICON;
  }
  var markerImage = new google.maps.MarkerImage(
    iconImage,
    new google.maps.Size(30, 30),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 30),
    new google.maps.Size(30, 30)
  );
  return markerImage;
}

/**
 * @description
    - show up infowindow
 * @param {marker} marker - clicked marker
 * @param {infowindow} infowindow - window instance
*/
function populateInfoWindow (marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;

    // to keep listeners only one
    google.maps.event.clearListeners(infowindow, 'closeclick');

    infowindow.addListener('closeclick', function () {
      if (infowindow.marker && infowindow.marker.getAnimation() !== null) {
        infowindow.marker.setAnimation(null);
      }
      infowindow.marker = null;
    });

    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    function getStreetView(data, status) {
      var infoTag;
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);

        /*--- set infowindow tag by handlebars ---*/
        infowindow.setContent(getInfowindowTag(getParamsForTemplate(marker)));

        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30,
            zoom: 1
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);

      } else {
        infowindow.setContent(getInfowindowTag(getParamsForTemplate(marker)));
      }
    }

    streetViewService.getPanoramaByLocation(infowindow.marker.position, radius, getStreetView);
    infowindow.open(map, infowindow.marker);
  } else {
    // after closing infowindow, if the instance is still alive, open!
    if(infowindow) {
      infowindow.open(map, infowindow.marker);
    }
  }
}

/**
 * @description
    - for infowindows, make values parameter object
 * @param {marker} marker - target marker
 * @param {bool} hasStreetView - if street view?
*/
function getParamsForTemplate(marker) {

  var params = {
    name: marker.title,
    markerId: marker.id,
    photoLink: infowindowPhotoLink,
    addressInfo: infowindowAddressInfo,
    checkinsCount: infowindowCheckinCount,
    usersCount: infowindowUsersCount,
    repeatRate: infowindowRepeatRate,
    phone: infowindowPhone,
    formattedPhone: infowindowFormattedPhone,
    url: infowindowUrl,
    hourStatus: infowindowHourStatus,
    rating: infowindowRating,
    isOpen: infowindowIsOpen
  };
  return params;
}

/**
 * @description
 - set values of noodle house for handlebars template
 * @param {vanue} noodlehouse - target venue
 */
function setValuesForInfowindowTemplate(noodleHouse) {
  infowindowName = noodleHouse.name;
  infowindowPhotoLink = noodleHouse.photoLink;
  infowindowAddressInfo = (noodleHouse.location.city || '')+
    ' ' + (noodleHouse.location.address || '');
  infowindowCheckinCount = noodleHouse.stats.checkinsCount || 0;
  infowindowUsersCount = noodleHouse.stats.usersCount || 0;
  infowindowRepeatRate = noodleHouse.repeatRate || 0;
  infowindowPhone = noodleHouse.contact.phone || '';
  infowindowFormattedPhone = noodleHouse.contact.formattedPhone || '';
  infowindowUrl = noodleHouse.url || '';
  if(noodleHouse.hours && noodleHouse.hours.status) {
    infowindowHourStatus =  noodleHouse.hours.status;
    infowindowIsOpen = noodleHouse.hours.isOpen;
  } else if (noodleHouse.hours && noodleHouse.isOpen != null){
    infowindowHourStatus = '';
    infowindowIsOpen = noodleHouse.hours.isOpen;
  } else {
    infowindowHourStatus = '';
    infowindowIsOpen = false;
  }
  infowindowRating = noodleHouse.rating;
}

