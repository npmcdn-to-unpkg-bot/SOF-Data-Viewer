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
    switch($stateParams.gender){
      case 'M':
        $scope.gender = 'Male';
        break;
      case 'F':
        $scope.gender = 'Female';
        break;
      default:
        $scope.gender = '?';
    }
    switch($stateParams.grade){
      case '1':
        $scope.super = 'st';
        break;
      case '2':
        $scope.super = 'nd';
        break;
      case '3':
        $scope.super = 'rd';
        break;
      default:
        $scope.super = 'th';
    }
    $scope.grade = $stateParams.grade;
    $scope.studentActivityPictures = [];
  });
