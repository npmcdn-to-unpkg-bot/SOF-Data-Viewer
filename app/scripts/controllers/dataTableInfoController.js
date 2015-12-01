'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('dataTableInfoController', function ($scope, $state, $stateParams) {
    $scope.state = $state.current;
    $scope.params = $stateParams; 

    $scope.studyName = $stateParams.studentStudyName;
    $scope.day = $stateParams.day;
    $scope.activity = $stateParams.activity;
    $scope.schoolName = $stateParams.schoolName;
  });
