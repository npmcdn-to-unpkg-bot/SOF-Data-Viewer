'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('dataTableController', function ($scope) {

    $scope.groups = [];
    var schools = Parse.Object.extend('School');
    var query = new Parse.Query(schools);
    query.ascending('studyName');
    // query.include('Student');
    query.find({
      success: function(results) {
        $scope.$apply(function () {
          for (var i = 0; i < results.length; i++) {
            $scope.groups.push(results[i]);
          }
          for (i = 0; i < results.length; i++) {
            $scope.groups[i].students=[];
          }
        });
      },
      error: function(object, error) {
        $scope.$apply(function () {
          // The object was not retrieved successfully.
          console.error('Warning, did\'t make it: ', object, error);
        });
      }
    });

    var students = Parse.Object.extend('Student');
    var qry = new Parse.Query(students);
    qry.include('School');
    qry.find({
      success: function(students) {
        for (var i = 0; i < students.length; i++) {
          for (var j = 0; j < $scope.groups.length; j++) {
            if($scope.groups[j].attributes.studyName === students[i].get('school_id').get('studyName')){            
              $scope.groups[j].students.push(students[i]);
            }
          }
        }
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        console.error('Warning, did\'t make it: ', object, error);
      }
    });

    // var groupsRef = new Firebase('https://sof-data.firebaseio.com/studyGroups');
    // $scope.groups = $firebaseArray(groupsRef);

  });
