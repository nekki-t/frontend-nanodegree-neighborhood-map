(function() {
  'use strict';

  /* === < Handlebar setting > =================================================================== */
  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  /* === < Utilities from TodoMVC> =================================================================== */
  /*---  I simply follow TodoMVC's way for the followings. ---*/
  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  function keyhandlerBindingFactory(keyCode) {
    return {
      init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
        var wrappedHandler, newValueAccessor;

        // wrap the handler with a check for the enter key
        wrappedHandler = function (data, event) {
          if (event.keyCode === keyCode) {
            valueAccessor().call(this, data, event);
          }
        };

        // create a valueAccessor with the options that we would want to pass to the event binding
        newValueAccessor = function () {
          return {
            keyup: wrappedHandler
          };
        };

        // call the real event binding's init function
        ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
      }
    };
  }

  // a custom binding to handle the enter key
  ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

  // another custom binding, this time to handle the escape key
  ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

  // wrapper to hasFocus that also selects text and applies focus async
  ko.bindingHandlers.selectAndFocus = {
    init: function (element, valueAccessor, allBindingsAccessor, bindingContext) {
      ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
      ko.utils.registerEventHandler(element, 'focus', function () {
        element.focus();
      });
    },
    update: function (element, valueAccessor) {
      ko.utils.unwrapObservable(valueAccessor()); // for dependency
      // ensure that element is visible before trying to focus
      setTimeout(function () {
        ko.bindingHandlers.hasFocus.update(element, valueAccessor);
      }, 0);
    }
  };


  /* === < ViewModel > =================================================================== */
  var ViewModel = function(noodleHouses) {
    var self = this;
    self.noodleHouseMap = noodleHouseMapFactory();

    self.noodleHouses = ko.observableArray();
    self.filterText = ko.observable();
    self.loading = ko.observable(false);
    self.showError = ko.observable(false);
    self.nearTarget = ko.observable();

    /*--- filtering list ---*/
    self.filteredNoodleHouses = ko.computed(function () {
      if(!self.filterText()) {
        self.noodleHouseMap.showAllMarkers();
        return self.noodleHouses();
      } else {
        self.noodleHouseMap.hideMarkers();
        return self.noodleHouses().filter(function(nh) {
          if (nh.name && nh.name.toUpperCase().indexOf(self.filterText().toUpperCase()) > -1) {
            // add marker
            self.noodleHouseMap.showFilteredMarkers(nh);
            return nh;
          }
        });
      }
    }.bind(self));

    // initialize map as singleton
    var noodleHouseMap = noodleHouseMapFactory();

    /* === < Default Load > =================================================================== */
    self.loading(true);
    noodleHouseMap.loadDefaultNoodleHouses(noodleHouseLoadSuccess, noodleHouseLoadError);

    function noodleHouseLoadSuccess(noodleHouses) {
      self.loading(false);

      self.noodleHouses(noodleHouses);
      /*--- set markers on the map ---*/
      noodleHouseMap.setMarkers(self.filteredNoodleHouses());
    }

    function noodleHouseLoadError(errorTitle, errorMessage) {
      console.log(errorThrown);
      self.loading(false);
      showErrorDialog(errorTitle, errorMessage);
    }

    /*--- show the noodle house selected on the list ---*/
    self.showNoodleHouse = function (noodleHouse) {
      self.noodleHouseMap.showSelectedNoodleHouse(noodleHouse);
    }.bind(self);

    /* === < Change Near > =================================================================== */
    /*--- Change Location by searching input near ---*/
    self.searchNear = function() {
      if(!self.nearTarget() || self.nearTarget() === '') {
        showErrorDialog('No text input', 'Please input text you would like to search for.');
        return;
      }
      self.loading(true);
      self.noodleHouseMap.changeNear(self.nearTarget(), noodleHouseChangeNearSuccess, noodleHouseChangeNearError);
    }.bind(self);

    function noodleHouseChangeNearSuccess(noodleHouses) {
      afterChangeNearProcess();
      self.noodleHouses(noodleHouses);
      self.noodleHouseMap.setMarkers(self.filteredNoodleHouses());
    }

    function noodleHouseChangeNearError(errorTitle, errorMessage) {
      afterChangeNearProcess();
      showErrorDialog(errorTitle, errorMessage);
    }

    function afterChangeNearProcess() {
      self.nearTarget(''); // make this empty for next search
      self.loading(false);
      self.noodleHouses.removeAll();
      self.noodleHouseMap.removeMarkers();
    }

    /* === < Shared Error Message function > =================================================================== */
    function showErrorDialog(title, errorMessage) {
      showDialog({
        title: title,
        text: errorMessage,
        negative: {
          title: 'Close'
        }
      });
    }
  };

  var viewModel = new ViewModel();
  ko.applyBindings(viewModel);

}());