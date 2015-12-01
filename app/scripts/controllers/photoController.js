'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('photoController', function ($scope, $routeParams, Lightbox, Crossfilter, $location) {
    var pictures = Parse.Object.extend('Picture');
    var query = new Parse.Query(pictures);

    query.include( ['school_id',
                    'activity_id',
                    'student_id'
                   ] )
         .ascending('date');
    query.find({
      success: function (results) {
        $scope.$apply(function () {
          // Categories to search by
          $scope.days = [];
          $scope.activities = [];
          $scope.students = [];
          $scope.groups = [];
          $scope.labels = [];

          // Lightbox array
          $scope.lightboxImageArray = [];

          $scope.$on('crossfilter/updated', function(event, collection, identifier) {
            // console.warn('the crossfilter was updated');
          });

          $scope.XFilterPhotos = new Crossfilter(results, 'id', 'persistent', ['name','date', 'id', 'href', 'activity'] );
          var dimensionByActivityName = $scope.XFilterPhotos.addDimension( 'activityName', function byName(p) { return p.get('activity_id').get('activityName'); }); // jshint ignore:line
          var dimensionByDay = $scope.XFilterPhotos.addDimension( 'day', function byDay(p) { return p.get('activity_id').get('activityDay'); }); // jshint ignore:line
          var dimensionByUniqueActivityNumber = $scope.XFilterPhotos.addDimension( 'uniqueActivityNumber', function byDay(p) { return p.get('activity_id').get('activityNumber'); }); // jshint ignore:line
          var dimensionByGroupNumber = $scope.XFilterPhotos.addDimension( 'groupNumber', function byDay(p) { return p.get('student_id').get('school_id').get('groupNumber'); }); // jshint ignore:line
          var dimensionByStudentStudyID = $scope.XFilterPhotos.addDimension( 'studentStudyID', function byDay(p) { return p.get('student_id').get('studyId'); }); // jshint ignore:line
          // $scope.dimensionByDate = $scope.XFilterPhotos.dimension(function(p) { return p.get('date'); });
          var photosGroupedByDay = $scope.XFilterPhotos.groupBy('day'); // jshint ignore:line
          var photosGroupedByActivityName = $scope.XFilterPhotos.groupBy('activityName'); // jshint ignore:line

          // Voila!
          // $scope.words = new Crossfilter(response.data, '$id', 'persistent');
          // $scope.words.addDimension('wordCount', function wordCount(model) {
              // return model.word.length;
          // });

          // $scope.countGrouped = $scope.words.groupBy('wordCount');
          // $scope.$ngc = new Crossfilter(results);

          for (var i = 0; i < results.length; i++) {
            var picture = results[i];
            picture.imageIndex = i;
            picture.ticked = true;
            picture.name = picture.get('name');
            picture.activity = picture.get('activity_id');
            picture.groupStudyName = picture.get('student_id').get('school_id').get('studyName');
            picture.groupNumber = picture.get('student_id').get('school_id').get('groupNumber');
            picture.student = picture.get('student_id');
            picture.studentStudyName = picture.get('student_id').get('studyFirstName');
            picture.studentStudyID = picture.get('student_id').get('studyId');
            picture.uniqueActivityNumber = picture.get('activity_id').get('activityNumber');
            picture.activityDay = picture.get('activity_id').get('activityDay');
            picture.activityNumberThatDay = picture.get('activity_id').get('activityNumberDescription');
            
            // Add the day if it doesn't exist
            var dayFound = false;
            for(var j = 0; j < $scope.days.length; j++) {
              if ($scope.days[j].day === picture.activityDay) {
                dayFound = true;
                break;
              }
            }
            if(!dayFound) {
              $scope.days.push({ 'day': picture.activityDay, 'ticked':true });
            }

            // Add the activityNumber if it doesn't exist
            var activityFound = false;
            for(var k = 0; k < $scope.activities.length; k++) {
              if ($scope.activities[k].activityNumber === picture.uniqueActivityNumber) {
                activityFound = true;
                break;
              }
            }
            if(!activityFound) {
              $scope.activities.push({ 'uniqueActivityNumber': picture.uniqueActivityNumber, 
                                       'activityNumberThatDay' : picture.activityNumberThatDay,
                                       'activityDay': picture.activityDay,
                                       'ticked':true });
            }

            // Add the student if it doesn't exist
            var studentFound = false;
            for(var l = 0; l < $scope.students.length; l++) {
              if ($scope.students[l].studentStudyName === picture.studentStudyName) {
                studentFound = true;
                break;
              }
            }
            if(!studentFound) {
              $scope.students.push({ 'studentStudyName': picture.studentStudyName, 
                                     'studentStudyID' : picture.studentStudyID,
                                     'ticked':true });
            }

           // Add the group if it doesn't exist
            var groupFound = false;
            for(var m = 0; m < $scope.groups.length; m++) {
              if ($scope.groups[m].groupStudyName === picture.groupStudyName) {
                groupFound = true;
                break;
              }
            }
            if(!groupFound) {
              $scope.groups.push({ 'groupStudyName': picture.groupStudyName, 
                                   'groupID' : picture.studentStudyID,
                                   'groupNumber' : picture.groupNumber,
                                   'ticked':true });
            }

            // This array is for Lightbox
            $scope.lightboxImageArray.push({  'url': results[i].get('file')._url,
                                              'label': results[i].get('name') });
          }
          var compareDays = function(a, b) {
            if (a.day < b.day) {
              return -1;
            } else if (a.day > b.day) {
              return 1;
            } else {
              return 0;
            }
          };

          $scope.days.sort(compareDays);
          // $scope.activities.sort(compareActivityNumbers);
          // $scope.groups.sort(compareGroups);

          $scope.XFilterActivities = new Crossfilter($scope.activities, 'uniqueActivityNumber', 'persistent', ['activityDay','activityNumberThatDay', 'ticked', 'uniqueActivityNumber'] );
          var activitiesGroupedByDay = $scope.XFilterActivities.groupBy('activityDay'); // jshint ignore:line

          $scope.XFilterStudents = new Crossfilter($scope.students, 'studentStudyID', 'persistent', ['studentStudyID', 'studentStudyName', 'ticked'] );

          $scope.XFilterGroups = new Crossfilter($scope.groups, 'groupNumber', 'persistent', ['groupID', 'groupNumber', 'groupStudyName', 'ticked'] );
          var groupsGroupedByNumber = $scope.XFilterGroups.groupBy('groupNumber'); // jshint ignore:line

          $scope.loading = false;
        });
      },
      error: function(object, error) {
        $scope.$apply(function () {
          // The object was not retrieved successfully.
          console.error('Warning, did\'t make it: ', object, error);
          $scope.error = object.message;
          $scope.path = $location.path();
        });
      }
    });
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.lightboxImageArray, index);
    };
    var dayFilter = function(expected, actual){
      // This function is called for each photo, and compares the photo's day against the day.ticked value
      // Expected is $scope.days
      // Actual is the photo's day
      return expected.some(function (day) {
        console.log(day);
        console.log(expected);
        console.log(actual);
        // This loops over each of $scope.day's day objects
        return day.ticked===true && day.day === actual;
      });
    };
    var groupNumberFilter = function(expected, actual){
      return expected.some(function (group) {
        return group.ticked===true && group.groupNumber === actual;
      });
    };
    var studentFilter = function(expected, actual){
      return expected.some(function (student) {
        return student.ticked===true && student.studentStudyID === actual;
      });
    };
    var uniqueActivityFilter = function(expected, actual){
      return expected.some(function (activity) {
        return activity.ticked===true && activity.uniqueActivityNumber === actual;
      });
    };
    var activityFilter = function(expected, actual){
      return expected.some(function (day) {
        return day.ticked===true && day.day === actual;
      });
    };
    $scope.toggleDay = function(dayObject){
      // Set the ticked value of the day clicked to its opposite value
      var x = $scope.days.filter(function(elem, arg, arr){ return elem.day === dayObject.day;})[0];
      x.ticked = !x.ticked;
      // Filter by all days that ticked values are true
      $scope.XFilterPhotos.filterBy('day', $scope.days, dayFilter);
      $scope.XFilterActivities.filterBy('activityDay', $scope.days, activityFilter);
    };
    $scope.toggleActivityNumber = function(activityNumberObject){
      var x = $scope.activities.filter(function(elem, arg, arr){ return elem.uniqueActivityNumber === activityNumberObject.uniqueActivityNumber;})[0];
      x.ticked = !x.ticked;
      $scope.XFilterPhotos.filterBy('uniqueActivityNumber', $scope.activities, uniqueActivityFilter);
    };
    $scope.toggleGroup = function(groupObject){
      var x = $scope.groups.filter(function(elem, arg, arr){ return elem.groupNumber === groupObject.groupNumber;})[0];
      x.ticked = !x.ticked;
      $scope.XFilterPhotos.filterBy('groupNumber', $scope.groups, groupNumberFilter);
    };
    $scope.toggleStudent = function(studentObject){
      var x = $scope.students.filter(function(elem, arg, arr){ return elem.studentStudyID === studentObject.studentStudyID;})[0];
      x.ticked = !x.ticked;
      $scope.XFilterPhotos.filterBy('studentStudyID', $scope.students, studentFilter);
    };
  });
