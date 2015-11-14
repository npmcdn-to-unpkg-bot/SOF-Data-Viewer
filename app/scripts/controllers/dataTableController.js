'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('dataTableController', function ($scope, $firebaseObject, $firebaseArray) {

    var schoolsRef = new Firebase("https://sof-data.firebaseio.com/schools");
    $scope.allSchools = $firebaseArray(schoolsRef);

    var groupsRef = new Firebase("https://sof-data.firebaseio.com/studyGroups");
    $scope.groups = $firebaseArray(groupsRef);

    var studentsRef = new Firebase("https://sof-data.firebaseio.com/students");
    $scope.allStudents = $firebaseArray(studentsRef);

    // var groupsStudents = studentsRef.child(LINK_ID).child('groups')

    // var commentsRef = new Firebase("https://awesome.firebaseio-demo.com/comments");
    // var linkRef = new Firebase("https://awesome.firebaseio-demo.com/links");
    // var linkCommentsRef = linkRef.child(LINK_ID).child("comments");
    // linkCommentsRef.on("child_added", function(snap) {
    //   commentsRef.child(snap.key()).once("value", function() {
    //     // Render the comment on the link page.
    //   });
    // });

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
