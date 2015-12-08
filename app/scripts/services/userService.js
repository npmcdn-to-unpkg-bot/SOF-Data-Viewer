'use strict';

angular.module('sofDataViewerApp')
  .run(['$rootScope', function($scope) {
    $scope.currentUser = Parse.User.current();
   
    $scope.logIn = function(options) {
      // Call Parse Login function with those variables
      Parse.User.logIn(options.username, options.password, {
          // If the username and password matches
          success: function(user) {
            $scope.currentUser = user;
          },
          // If there is an error
          error: function(user, error) {
            console.log(error);
          }
      });
    };
       
    $scope.logOut = function(form) {
      Parse.User.logOut();
      $scope.currentUser = null;
    };
  }]);