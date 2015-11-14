'use strict';

/**
 * @ngdoc overview
 * @name sofDataViewerApp
 * @description
 * # sofDataViewerApp
 *
 * Main module of the application.
 */
angular
  .module('sofDataViewerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'smart-table',
    'firebase',
    'ui.router'
  ])
            // Used by  ng-ui-router    ng-ui-router        normal ng
  // .config(function ($stateProvider, $urlRouterProvider, $routeProvider) {
  .config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    // Now set up the states
    $stateProvider
      // a state 'string' is how you pass the state in an <a ui-sref="string"> tag
      .state('home', {
        url: "/",
        templateUrl: "views/partials/home.html"
      })
      .state('data-table', {
        url: '/data-table',
        templateUrl: 'views/partials/dataPage.html',
        controller: 'dataTableController'
      })
      .state('data-table.info', {
        url: '/info/?studentStudyName?day?activity?schoolName',
        templateUrl: 'views/partials/dataPage.rightInfo.html',
        controller: 'dataTableInfoController'
      })
      .state('data-table.info.list', {
        url: '/list',
        templateUrl: 'views/partials/dataPage.rightInfo.list.html',
        controller: function($scope) {
          $scope.things = ["A", "List", "Of", "Items"];
        }
      })
      .state('curriculum', {
        url: '/curriculum',
        templateUrl: 'views/partials/curriculum.html'
      })
      .state('lesson-plans', {
        url: '/lesson-plans',
        templateUrl: 'views/partials/lesson-plans.html'
      })
      .state('photos', {
        url: '/photos',
        templateUrl: 'views/partials/photos.html',
        controller: 'photoController'
      });

    // This is used for normal angular.   We are using Angular-UI-Router, so we need to do it their way
    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'mainController',
    //     // controllerAs – {string=} – An identifier name for a reference to the controller. If present, the controller will be published to scope under the controllerAs name.
    //     controllerAs: 'main'
    //   })
    //   .when('/allPhotos', {
    //     templateUrl: 'views/allPhotos.html',
    //     controller: 'photoController',
    //     // controllerAs – {string=} – An identifier name for a reference to the controller. If present, the controller will be published to scope under the controllerAs name.
    //     controllerAs: 'photo'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });
  });
