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
    var schools = Parse.Object.extend('School');
    var query = new Parse.Query(schools);
    query.ascending('studyName');
    // query.include('Student');
    query.find({
      success: function(results) {
      },
      error: function(object, error) {
        $scope.$apply(function () {
          // The object was not retrieved successfully.
          console.error('Warning, we did\'t make it: ', object, error);
          $scope.error = object.message;
          $scope.path = $location.path();
        });
      }
    }).then(function(results) {
      var parseStudents = Parse.Object.extend('Student');
      var qry = new Parse.Query(parseStudents);
      qry.include('School');
      qry.find({
        success: function(students) {
          // debugger;
          $scope.$apply(function () {
            results.forEach(function(result, index){
              $scope.groups.push(result);
              $scope.groups[index].students=[];
            });
            students.forEach(function(student, sIndex){
              $scope.groups.forEach(function(group, gIndex){
                if($scope.groups[gIndex].attributes.studyName === students[sIndex].get('school_id').get('studyName')){
                  $scope.groups[gIndex].students.push(students[sIndex]);
                }
              });
            });
          });
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          console.error('Warning, did\'t make it: ', object, error);
        }
      });
     // console.log("Updated " + result.id);
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

  });
