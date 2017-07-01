

function getRatingSection(rating) {
  var tag = '';
  tag += getRatingMark(rating >= 2);
  tag += getRatingMark(rating >= 4);
  tag += getRatingMark(rating >= 6);
  tag += getRatingMark(rating >= 8);
  tag += getRatingMark(rating == 10);

  return '<div class="rating">' + tag + '</div>';
}

function getRatingMark (lightOn) {
  if (lightOn) {
    return '<i class="material-icons on" >star</i>'
  } else {
    return '<i class="material-icons off" >star</i>'
  }
}

function getInfoSection(checkinsCount, usersCount, repeatRate) {
  var tag =
    '' +
    '<div class="info">' +
    '  <span>$checkinsCount$</span> people have checked in.' +
    '</div>' +
    '<div class="info">' +
    '  <span>$usersCount$</span> users.' +
    '</div>' +
    '<div class="info">' +
    '  Repeat Rate: <span>$repeatRate$</span>' +
    '</div>';
  tag = tag.replace("$checkinsCount$", checkinsCount);
  tag = tag.replace("$usersCount$", usersCount);
  tag = tag.replace("$repeatRate$", repeatRate);
  return tag;
}

function getContactSection(phone, formattedPhone, url) {
  tag =
    '' +
    '<div class="contact">' +
    '  <a href="$phone$"}>$formattedPhone$</a>' +
    '</div>' +
    '<div class="contact">' +
    '  <a href="$url$">$url$</a>' +
    '</div>';
  tag = tag.replace("$phone$", phone);
  tag = tag.replace("$formattedPhone$", formattedPhone);
  tag = tag.replace(/\$url\$/g, url);
  return tag;
}

function getOpenInfoSection(isOpen) {
  if(isOpen) {
    var tag =
      '<div class="isOpen">' +
      '  Now Open!!' +
      '</div>';
    return tag;
  } else {
    return '';
  }
}

function getHoursInfoSection(hoursStatus) {
  if(hoursStatus) {
    var tag =
      '' +
      '<div class="mdl-list__item status">' +
      '  <i class="material-icons">access_time</i><span>$hoursStatus$</span>' +
      '</div>';
    tag = tag.replace("$hoursStatus$", hoursStatus);
    return tag;
  } else {
    return '';
  }
}

function getPoweredBySection() {
  var tag =
    '<div class="poweredBy">' +
    '  Powered by Foursquare API' +
    '</div>';
  return tag;
}

function getPanoSection() {
  var tag =
    '<div class="mdl-cell mdl-cell--6-col">' +
    '  <div id="pano"></div>' +
    '</div>';
  return tag;
}

function getHeaderSection(name, photoLink) {
  var tag =
    '<div' +
    '    class="mdl-card__title"' +
    '    style="background: url(\'$photoLink$\') center / cover;"' +
    '>' +
    '  <h2 class="mdl-card__title-text house-name">$name$</h2>' +
    '</div>';
  tag = tag.replace("$photoLink$", photoLink);
  tag = tag.replace("$name$", name);
  return tag;
}

function getAddressSection(addressInfo) {
  var tag =
    '<div class="mdl-card__supporting-text address-info">' +
    '  $addressInfo$' +
    '</div>';
  tag = tag.replace("$addressInfo$", addressInfo);
  return tag;
}

function getDetailsSeaction(options) {
  var tag =
    '<div class="mdl-card__supporting-text card-content">' +
      getRatingSection(options.rating) +
      getInfoSection(options.checkinsCount, options.usersCount, options.repeatRate) +
      getContactSection(options.phone, options.formattedPhone, options.url) +
      getOpenInfoSection(options.isOpen) +
      getHoursInfoSection(options.hourStatus) +
    '</div>';
  return tag;
}

function getBodySection(options) {
  var tag =
    '<div class="mdl-grid body-grid">' +
    ' <div class="mdl-cell mdl-cell--6-col">' +
      getAddressSection(options.addressInfo) +
      getDetailsSeaction(options) +
    ' </div>' +
      getPanoSection() +
    '</div>' +
    getPoweredBySection();
  return tag;
}

function getInfowindowTag(options) {
  var tag =
    '<div class="infowindow-card mdl-card mdl-shadow--2dp">' +
      getHeaderSection(options.name, options.photoLink) +
      getBodySection(options) +
    '</div>';
  return tag;
}

