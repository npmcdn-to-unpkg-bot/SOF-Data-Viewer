'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('dataTableController', function ($scope, $q, $rootScope) {
    // This is the number of rows we will show if the user is not logged in
    $scope.quantity = 1;

    $scope.groups = [];
    $scope.students = [];
    $scope.allLogs = [];
    var schools = Parse.Object.extend('School');
    var query = new Parse.Query(schools);
    query.ascending('studyName');
    // query.include('Student');
    query.find({
      success: function(schoolResults) {
        $scope.$apply(function () {
          schoolResults.forEach(function(school, index){
            // add each group to the groups array
            $scope.groups.push(school);
            // and give it an array for its students
            $scope.groups[index].students=[];
          });
        });
      },
      error: function(object, error) {
        $scope.$apply(function () {
          // The object was not retrieved successfully.
          console.error('Warning, we did\'t make it: ', object, error);
          $scope.error = object.message;
          $scope.path = $location.path();
        });
      }
    }).then(function(schoolResults) {
      var parseStudents = Parse.Object.extend('Student');
      var qry = new Parse.Query(parseStudents);
      qry.include('School');
      qry.find({
        success: function(students) {
          $scope.$apply(function () {
            students.forEach(function(student, sIndex){
              $scope.students.push(student);
              $scope.groups.forEach(function(group, gIndex){
                // When the student belongs to one of the groups already known
                if($scope.groups[gIndex].attributes.studyName === students[sIndex].get('school_id').get('studyName')){
                  // Add the student to the group
                  $scope.groups[gIndex].students.push(students[sIndex]);
                  // and give each student a studentLogs array
                  $scope.groups[gIndex].students[$scope.groups[gIndex].students.length-1].studentLogs=[0,0,0,0,0,0,0];
                }
              });
            });
          });
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          console.error('Warning, did\'t make it: ', object, error);
        }
      }).then(function(studentResults) {
          var parseLogs = Parse.Object.extend('Logs');
          var qry = new Parse.Query(parseLogs);
          qry.include('Student');
          qry.find({
            success: function(logs) {
              $scope.$apply(function () {
                $scope.groups.forEach(function(group, gIndex){
                  group.students.forEach(function(student, sIndex){
                    logs.forEach(function(log, lIndex){
                      $scope.allLogs.push(log);
                      // When a log matches a student, in a particular group
                      if(
                        // match by name
                        $scope.groups[gIndex].students[sIndex].get('studyFirstName') === log.get('student_id').get('studyFirstName')
                        )
                      {
                        // Add the logs to the log array of that student, in that group
                        $scope.groups[gIndex].students[sIndex].studentLogs.splice(log.get('day_number')-1, 1, log);
                      } else {
                        // do nothing, cause array already has a 0 in its place
                      }
                    });
                  });
                });
              });
            },
            error: function(object, error) {
              // The object was not retrieved successfully.
              console.error('Warning, did\'t make it: ', object, error);
            }
          })
         // console.log("Updated " + result.id);
        })
    })
  });


    // function asyncGreet(name) {
    //   // perform some asynchronous operation, resolve or reject the promise when appropriate.
    //   return $q(function(resolve, reject) {
    //     // setTimeout(function() {
    //       if (okToGreet(name)) {
    //         resolve('Hello, ' + name + '!');
    //       } else {
    //         reject('Greeting ' + name + ' is not allowed.');
    //       }
    //     // }, 1000);
    //   });
    // }

    // var promise = asyncGreet('Robin Hood');
    // promise.then(function(greeting) {
    //   alert('Success: ' + greeting);
    // }, function(reason) {
    //   alert('Failed: ' + reason);
    // });

    // var groupsRef = new Firebase('https://sof-data.firebaseio.com/studyGroups');
    // $scope.groups = $firebaseArray(groupsRef);

