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

    Object.size = function(obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          size++;
        }
      }
      return size;
    };

    query.include( ['school_id',
                    'actual_activity_id',
                    'day_number',
                    'student_id'
                   ] )
         .limit(500)
         .ascending('date');
    query.find({
      success: function (results) {
        $scope.$apply(function () {
          // Lightbox array
          $scope.lightboxImageArray = [];
          $scope.pictures = [];
          console.log(results.length);
          // Making the array of photos
          results.forEach(function(picture, index){
            picture.imageIndex = index;
            // Add it to the array of pictures
            $scope.pictures.push(picture);
            // This array is for Lightbox so you can click on it and the picture will enlarge
            $scope.lightboxImageArray.push({  'url': picture.get('file')._url,
                                              'label': picture.get('name') });
            // some attributes available
              // name = picture.get('name');
              // activity = picture.get('activity_id');
              // groupStudyName = picture.get('student_id').get('school_id').get('studyName');
              // groupNumber = picture.get('student_id').get('school_id').get('groupNumber');
              // student = picture.get('student_id');
              // studentStudyName = picture.get('student_id').get('studyFirstName');
              // studentStudyID = picture.get('student_id').get('studyId');
              // uniqueActivityNumber = picture.get('activity_id').get('activityNumber');
              // activityDay = picture.get('activity_id').get('activityDay');
              // activityNumberThatDay = picture.get('activity_id').get('activityNumberDescription');
          });

          $scope.XFilterPhotos = new Crossfilter(results, 'id', 'persistent', ['name','date', 'id', 'href', 'activity'] );

          //****** GROUPS ******//
          $scope.groupsToKeepTrackOf = {};
          // add a dimension by GroupName
          $scope.XFilterPhotos.addDimension( 'groupName', function byGroupName(p) {
            $scope.groupsToKeepTrackOf[p.get('student_id').get('school_id').get('studyName')] = false;
            return p.get('student_id').get('school_id').get('studyName');
          });
          $scope.groupsToKeepTrackOfSize = Object.size($scope.groupsToKeepTrackOf);
          $scope.groupNames = $scope.XFilterPhotos.groupBy('groupName');
          // UNUSED
          // var dimensionByGroupNumber = $scope.XFilterPhotos.addDimension( 'groupNumber', function byGroupNumber(p) { return p.get('student_id').get('school_id').get('groupNumber'); }); // jshint ignore:line
          // $scope.groupNumbers = $scope.XFilterPhotos.groupBy('groupNumber');

          //****** DAYS ******//
          $scope.daysToKeepTrackOf = {};
          // add a dimension by day
          $scope.XFilterPhotos.addDimension( 'dayNumber', function byDay(p) { 
            $scope.daysToKeepTrackOf[p.get('actual_activity_id').get('day_number')] = false;
            return p.get('actual_activity_id').get('day_number');
          });
          $scope.dayNumbers = $scope.XFilterPhotos.groupBy('dayNumber');

          //****** ACTIVITIES ******//
          $scope.dayAndActivitiesToKeepTrackOf = {};
          // add a dimension by day and activityNumber
          $scope.XFilterPhotos.addDimension( 'dayAndActivityNumber', function byActivityNumber(p) {
            // $scope.dayAndActivitiesToKeepTrackOf[p.get('actual_activity_id').get('day_number') + ' - '+ p.get('actual_activity_id').get('activity_number')] = false;
            // return p.get('actual_activity_id').get('day_number') + ' - '+ p.get('actual_activity_id').get('activity_number');
            $scope.dayAndActivitiesToKeepTrackOf[p.get('actual_activity_id').get('activity_shortcut')] = false;
            return p.get('actual_activity_id').get('activity_shortcut');
          }); // jshint ignore:line
          $scope.dayAndActivityNumbers = $scope.XFilterPhotos.groupBy('dayAndActivityNumber'); // jshint ignore:line
          // UNUSED
          // var dimensionByActivityName = $scope.XFilterPhotos.addDimension( 'activityName', function byName(p) { return p.get('activity_id').get('activityName'); }); // jshint ignore:line
          // $scope.activityNames = $scope.XFilterPhotos.groupBy('activityName'); // jshint ignore:line
          // var dimensionByUniqueActivityNumber = $scope.XFilterPhotos.addDimension( 'uniqueActivityNumber', function byUniqueActivityNumber(p) { return p.get('activity_id').get('activityNumber'); }); // jshint ignore:line
          // $scope.uniqueActivityNumbers = $scope.XFilterPhotos.groupBy('uniqueActivityNumber'); // jshint ignore:line

          //****** STUDENTS ******//
          $scope.studentsToKeepTrackOf = {};
          // add a dimension by student studyNames
          $scope.XFilterPhotos.addDimension( 'studentStudyNames', function byStudentName(p) {
            $scope.studentsToKeepTrackOf[p.get('student_id').get('studyFirstName')] = false;
            return p.get('student_id').get('studyFirstName');
          });
          $scope.studentStudyNames = $scope.XFilterPhotos.groupBy('studentStudyNames'); // jshint ignore:line
          // UNUSED
          // var dimensionByStudentStudyID = $scope.XFilterPhotos.addDimension( 'studentStudyID', function byStudentID(p) { return p.get('student_id').get('studyId'); }); // jshint ignore:line
          // $scope.studentIDs = $scope.XFilterPhotos.groupBy('studentStudyID'); // jshint ignore:line

          //****** LABELS ******//
          $scope.labelsToKeepTrackOf = {};
          // Add a dimension by label
          $scope.XFilterPhotos.addDimension( 'labels', function byLabel(p) {
            // $scope.labelsToKeepTrackOf[p.get('labels')] = false;
            // return p.get('labels');
            return 'labels';
          }); // jshint ignore:line
          $scope.labels = $scope.XFilterPhotos.groupBy('labels'); // jshint ignore:line

          // For when the crossfilter is updated....
          $scope.$on('crossfilter/updated', function(event, collection, identifier) {
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
    });
    
    $scope.removeSpinnerAndAddLoadedClass = function(){
      console.log('gh');
      //****** SPINNER ******//
      $scope.loading = false;      
    };

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.lightboxImageArray, index);
    };

    // FILTERS
    var groupFilter = function(expected, actual){
      return $scope.groupsToKeepTrackOf[actual];
    };
    var dayFilter = function(expected, actual){
      // This function is called for each photo,
      // Expected is the day the user clicked
      // Actual is the current photo's day
      return $scope.daysToKeepTrackOf[actual];
    };
    var studentFilter = function(expected, actual){
      return $scope.studentsToKeepTrackOf[actual];
    };
    var dayAndActivityNumberFilter = function(expected, actual){
      return $scope.dayAndActivitiesToKeepTrackOf[actual];
    };
    var labelFilter = function(expected, actual){
      return $scope.labelsToKeepTrackOf[actual];
    };

    // FILTER FUNCTIONS
    // var filterCounter = function(categoryName){
    //   var scopeCounter = '$scope' + categoryName + 'Counter';
    //   $scope.+categoryName+'Counter' = 
    // };
    $scope.groupsCounter = function(){
      var counter = 0;
      for (var key in $scope.groupsToKeepTrackOf) {
        if ($scope.groupsToKeepTrackOf[key] === true){
          counter += 1;
        }
      }
      return counter;
    };
    $scope.toggleGroup = function(group){
      $scope.groupsToKeepTrackOf[group.key] = !$scope.groupsToKeepTrackOf[group.key];
      $scope.groupsCounter();
      $scope.XFilterPhotos.filterBy('groupName', group, groupFilter);
    };
    $scope.toggleDay = function(day){
      $scope.daysToKeepTrackOf[day.key] = !$scope.daysToKeepTrackOf[day.key];
      $scope.XFilterPhotos.filterBy('dayNumber', day, dayFilter);
    };
    $scope.toggleDayAndActivity = function(dayAndActivity){
      $scope.dayAndActivitiesToKeepTrackOf[dayAndActivity.key] = !$scope.dayAndActivitiesToKeepTrackOf[dayAndActivity.key];
      $scope.XFilterPhotos.filterBy('dayAndActivityNumber', dayAndActivity, dayAndActivityNumberFilter);
    };
    $scope.toggleStudent = function(student){
      $scope.studentsToKeepTrackOf[student.key] = !$scope.studentsToKeepTrackOf[student.key];
      $scope.XFilterPhotos.filterBy('studentStudyNames', student, studentFilter);
    };
    $scope.toggleLabel = function(label){
      $scope.labelsToKeepTrackOf[label.key] = !$scope.labelsToKeepTrackOf[label.key];
      $scope.XFilterPhotos.filterBy('labels', label, labelFilter);
    };
    // FILTER RESETS
    $scope.resetAndUnfilterBy = function(thisDimension){
      console.log('reseting this dimension: '+thisDimension);
      $scope.XFilterPhotos.unfilterBy(thisDimension);
    };
  });
