(function () {
  'use strict';
  angular
      .module('starterApp')
      .controller('DemoCtrl', DemoCtrl);
  function DemoCtrl($mdDialog,$mdToast) {
    var self = this;
    self.openDialog = function($event) {
      $mdDialog.show({
        controller: DialogCtrl,
        controllerAs: 'ctrl',
        templateUrl: '/app/src/users/view/dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true
      })
    }
  }
  function DialogCtrl ($timeout, $q, $scope, $mdDialog, $mdToast, $document) {
    var self = this;
    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************
    self.cancel = function($event) {
      $mdDialog.cancel();
    };
    self.finish = function($event) {
      console.log(self.searchText,"attempt to shut");
      var shouldOpen = checkAutocompleteEntry();
      if(shouldOpen){
        $mdDialog.hide();
      }
      else{
        var el = angular.element(document.getElementById('toastBounds'));
        console.log("fdfd");
        showCustomToast(el);
      }
      // console.log(array);

      // $mdDialog.hide();
    };

    function showCustomToast(el) {
      var toast = $mdToast.simple()
        .content("bla")
        .action('OK')
        .highlightAction(true)
        .hideDelay(0)
        .position('top right')
        .parent($document[0].querySelector('#toastBounds'));

      $mdToast.show(toast);      
    };    

    function checkAutocompleteEntry(){

      var array = (self.states);
      var bool = false;
      for (var i = array.length - 1; i >= 0; i--) {
        if( (self.searchText == array[i].value) || (self.searchText == array[i].display) ){
          console.log("you have entered something from the list");
          bool = true;
        }
      };
      if( bool == false ){
          console.log("you have NOT entered something from the list");
      }
      return bool;      

    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      return query ? self.states.filter( createFilterFor(query) ) : self.states;
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        var x  = {
          value: state.toLowerCase(),
          display: state
        };
        // console.log(x);
        return x;
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }

})();