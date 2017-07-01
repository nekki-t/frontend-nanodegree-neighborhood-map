/* === < MAP > =================================================================== */
var MOUNTAIN_VIEW_LAT = 37.400111;
var MOUNTAIN_VIEW_LON = -122.108410;
var DEFAULT_ZOOM_SIZE = 15;

var DEFALT_ICON = 'images/noodle.png';
var HIGH_LIGHTED_ICON = 'images/noodle-selected.png';

var MAP_STYLES = [
  {
    featureType: 'water',
    stylers: [
      {color: '#19a0d8'}
    ]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      {color: '#ffffff'},
      {weight: 6}
    ]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      {color: '#e85113'}
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {color: '#efe9e4'},
      {lightness: -40}
    ]
  }, {
    featureType: 'transit.station',
    stylers: [
      {weight: 9},
      {hue: '#e85113'}
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      {visibility: 'off'}
    ]
  }, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {lightness: 100}
    ]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {lightness: -100}
    ]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {visibility: 'on'},
      {color: '#f0e4d3'}
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {color: '#efe9e4'},
      {lightness: -25}
    ]
  }
];



/* === < API  FOURSQUARE > =================================================================== */
var FOURSQUARE_API_URL = 'https://api.foursquare.com/v2/venues/explore';
var FOURSQUARE_CLIENT_ID = '2TBBYTDSQ3SITOPT05VM5LFI4F1OQHF5ULSPKJZ0DZHF0VZI';
var FOURSQUARE_CLIENT_SECRET = 'N1SJWS0LIVS5VFEL30UTOPJ5I3XZ5PK3QSVWDNHXDGUS0F1N';
var FOURSQUARE_CATEGORY_ID = '4bf58dd8d48988d1d1941735'; // Noodle House!!
var FOURSQUARE_SEARCH_LIMIT = 50;
var FOURSQUARE_SEARCH_TIMEOUT = 5000;
var FOURSQUARE_API_V = '20170601';
