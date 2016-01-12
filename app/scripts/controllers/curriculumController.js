'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:CurriculumController
 * @description
 * # CurriculumController
 * Controller of the Curriculum page for sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('curriculumController', function ($scope, $state, $stateParams) {
    $scope.guidanceViewed = false;
    $scope.toggleGuidance = function(){
      $scope.guidanceViewed = !$scope.guidanceViewed;
    };
  });
