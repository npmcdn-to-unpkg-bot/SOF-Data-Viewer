'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:HomeController
 * @description
 * # HomeController
 * Controller of the Home sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('homeController', function ($scope, $state, $stateParams, Lightbox) {
    $scope.lightboxImageArray = [
      { 
        'url': '',
        'label': 'PDF'
      },{
        'url': 'images/irb/VT IRB-14-831 Approval Letter page 1.jpg',
        'label': 'Page 1 JPG'
      },{
        'url': 'images/irb/VT IRB-14-831 Approval Letter page 2.jpg',
        'label': 'Page 2 JPG'
      },{
        'url': 'images/sof-screenshot.jpg',
        'label': 'SoF Screenshot'
      }
    ];
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.lightboxImageArray, index);
    };

  });
