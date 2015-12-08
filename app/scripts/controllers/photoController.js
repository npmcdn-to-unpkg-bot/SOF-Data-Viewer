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
          // Lightbox array
          $scope.lightboxImageArray = [];
          $scope.pictures = [];

          // Making the array of photos
          results.forEach(function(picture, index){
            var indPicture = picture;
            // adding attributes to make them easier to access
            indPicture.imageIndex = index;
            indPicture.ticked = true;
            indPicture.name = picture.get('name');
            indPicture.activity = picture.get('activity_id');
            indPicture.groupStudyName = picture.get('student_id').get('school_id').get('studyName');
            indPicture.groupNumber = picture.get('student_id').get('school_id').get('groupNumber');
            indPicture.student = picture.get('student_id');
            indPicture.studentStudyName = picture.get('student_id').get('studyFirstName');
            indPicture.studentStudyID = picture.get('student_id').get('studyId');
            indPicture.uniqueActivityNumber = picture.get('activity_id').get('activityNumber');
            indPicture.activityDay = picture.get('activity_id').get('activityDay');
            indPicture.activityNumberThatDay = picture.get('activity_id').get('activityNumberDescription');
            // Add it to the array of pictures
            $scope.pictures.push(indPicture);
            // This array is for Lightbox
            $scope.lightboxImageArray.push({  'url': picture.get('file')._url,
                                              'label': picture.get('name') });
          }, this);

          $scope.XFilterPhotos = new Crossfilter(results, 'id', 'persistent', ['name','date', 'id', 'href', 'activity'] );

          // GROUPS
          var dimensionByGroupName = $scope.XFilterPhotos.addDimension( 'groupName', function byDay(p) { return p.get('student_id').get('school_id').get('studyName'); }); // jshint ignore:line
          $scope.groupNames = $scope.XFilterPhotos.groupBy('groupName');
          var dimensionByGroupNumber = $scope.XFilterPhotos.addDimension( 'groupNumber', function byDay(p) { return p.get('student_id').get('school_id').get('groupNumber'); }); // jshint ignore:line
          $scope.groupNumbers = $scope.XFilterPhotos.groupBy('groupNumber');

          // DAYS
          $scope.daysToKeepTrackOf = {};
          var dimensionByDay = $scope.XFilterPhotos.addDimension( 'dayNumber', function byDay(p) { 
            $scope.daysToKeepTrackOf[p.get('activity_id').get('activityDay')] = false;
            return p.get('activity_id').get('activityDay');
          }); // jshint ignore:line
          $scope.dayNumbers = $scope.XFilterPhotos.groupBy('dayNumber');
          window.csd = dimensionByDay;
          window.csf = $scope.dayNumbers;
          // ACTIVITIES
          var dimensionByDayAndActivityNumber = $scope.XFilterPhotos.addDimension( 'dayAndActivityNumber', function byName(p) { return p.get('activity_id').get('activityDay') + ' - '+ p.get('activity_id').get('activityNumberDescription'); }); // jshint ignore:line
          $scope.dayAndActivityNumbers = $scope.XFilterPhotos.groupBy('dayAndActivityNumber'); // jshint ignore:line
          var dimensionByActivityName = $scope.XFilterPhotos.addDimension( 'activityName', function byName(p) { return p.get('activity_id').get('activityName'); }); // jshint ignore:line
          $scope.activityNames = $scope.XFilterPhotos.groupBy('activityName'); // jshint ignore:line
          var dimensionByUniqueActivityNumber = $scope.XFilterPhotos.addDimension( 'uniqueActivityNumber', function byDay(p) { return p.get('activity_id').get('activityNumber'); }); // jshint ignore:line
          $scope.uniqueActivityNumbers = $scope.XFilterPhotos.groupBy('uniqueActivityNumber'); // jshint ignore:line

          // STUDENTS
          var dimensionByStudentStudyID = $scope.XFilterPhotos.addDimension( 'studentStudyID', function byDay(p) { return p.get('student_id').get('studyId'); }); // jshint ignore:line
          $scope.studentIDs = $scope.XFilterPhotos.groupBy('studentStudyID'); // jshint ignore:line
          
          var dimensionByStudentStudyNames = $scope.XFilterPhotos.addDimension( 'studentStudyNames', function byDay(p) { return p.get('student_id').get('studyFirstName'); }); // jshint ignore:line
          $scope.studentStudyNames = $scope.XFilterPhotos.groupBy('studentStudyNames'); // jshint ignore:line

          $scope.$on('crossfilter/updated', function(event, collection, identifier) {
            // console.warn('the crossfilter was updated');
          });


          // Voila!
          // $scope.words = new Crossfilter(response.data, '$id', 'persistent');
          // $scope.words.addDimension('wordCount', function wordCount(model) {
              // return model.word.length;
          // });

          // $scope.countGrouped = $scope.words.groupBy('wordCount');
          // $scope.$ngc = new Crossfilter(results);
          $scope.loading = false;
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
    });
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.lightboxImageArray, index);
    };
    var groupNumberFilter = function(expected, actual){
      return expected.some(function (group) {
        return group.ticked===true && group.groupNumber === actual;
      });
    };
    var studentFilter = function(expected, actual){
      return expected.some(function (student) {
        console.log(student);
        console.log(expected);
        console.log(actual);      
        return student.ticked===true && student.studentStudyID === actual;
      });
    };
    var individualActivityFilter = function(expected, actual){
      return expected.some(function (activity) {
        return activity.ticked===true && activity.uniqueActivityNumber === actual;
      });
    };
    var activityFilter = function(expected, actual){
      return expected.some(function (day) {
        return day.ticked===true && day.day === actual;
      });
    };

    var dayFilter = function(expected, actual){
      console.log(expected)
      console.log(actual)
      // This function is called for each day,
      // Expected is the day the user clicked
      // Actual is 
      return $scope.daysToKeepTrackOf[actual];
    };
    $scope.toggleDay = function(day){
      $scope.daysToKeepTrackOf[day.key] = !$scope.daysToKeepTrackOf[day.key];
console.log($scope.daysToKeepTrackOf);
      $scope.XFilterPhotos.filterBy('dayNumber', day, dayFilter);
            // if ($scope.currentCountFilter == count) {
            //     $scope.currentCountFilter = null;
            //     $scope.words.unfilterBy('wordCount');
            //     return;
            // }
            // $scope.currentCountFilter = count;
            // $scope.words.filterBy('wordCount', count);

      // Set the ticked value of the day clicked to its opposite value
      // var x = $scope.days.filter(function(elem, arg, arr){ return elem.day === dayObject.day;})[0];
      // x.ticked = !x.ticked;
      // Filter by all days that ticked values are true
      // $scope.XFilterPhotos.filterBy('day', $scope.days, dayFilter);
      // $scope.XFilterActivities.filterBy('activityDay', $scope.days, activityFilter);
      // $scope.XFilterStudents.filterBy('studentStudyName', $scope.days, studentFilter);
    };
    $scope.toggleIndividualActivity = function(activityNumberObject){
      var x = $scope.activities.filter(function(elem, arg, arr){ return elem.uniqueActivityNumber === activityNumberObject.uniqueActivityNumber;})[0];
      x.ticked = !x.ticked;
      $scope.XFilterPhotos.filterBy('uniqueActivityNumber', $scope.activities, individualActivityFilter);
      // $scope.XFilterStudents.filterBy('studentStudyName', $scope.activities, studentFilter);
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
