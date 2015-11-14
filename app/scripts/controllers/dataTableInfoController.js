'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('dataTableInfoController', function ($scope, $firebaseObject, $firebaseArray, $state, $stateParams, StudentFactory) {
    $scope.state = $state.current;
    $scope.params = $stateParams; 

    $scope.studyName = $stateParams.studentStudyName;
    $scope.day = $stateParams.day;
    $scope.activity = $stateParams.activity;
    $scope.schoolName = $stateParams.schoolName;
    
    // StudentFactory($scope.studyName, $scope.schoolName).$bindTo($scope, "student");

    // $scope.status = {
    //   isopen: false
    // };
    // $scope.toggleDropdown = function($event) {
    //   debugger;
    // // $scope.toggleDropdown = function() {
    //   // $event.preventDefault();
    //   // $event.stopPropagation();
    //   $scope.status.isopen = !$scope.status.isopen;
    // };
  });
