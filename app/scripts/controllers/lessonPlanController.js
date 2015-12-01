'use strict';

angular.module('sofDataViewerApp')
  .controller('lessonPlanController', function ($scope, Lightbox) {
    $scope.isLoading = true;

    // The Parse query
    var lessonPlans = Parse.Object.extend('LessonPlan');
    var query = new Parse.Query(lessonPlans);
    // We need to include the pointers
    query.include( ['school_id',
                    'activity_id'
                   ] )
        // Starting with the activity days in order
         .ascending('activityDay');
    query.find({
      success: function(results) {
        $scope.$apply(function () {
          $scope.days = [];
          $scope.lessonPlans = [];
          $scope.images = [];
          for (var i = 0; i < results.length; i++) {
            var lessonPlanDay = results[i].get('activity_id').get('activityDay');
            var lessonPlan = results[i];
            lessonPlan.imageIndex = i;
            var lessonPlanURL = results[i].get('file')._url;
          
            // This array is for the lightbox
            $scope.images.push({  'url':lessonPlanURL,
                                  'label': lessonPlan.get('activity_id').get('activityName') });

            // Create a 2d array of the days and the lesson plans in those days
            if(!$scope.lessonPlans[lessonPlanDay-1]){
              $scope.lessonPlans.push([lessonPlan]);
            } else {
              $scope.lessonPlans[lessonPlanDay-1].push(lessonPlan);
            }
          }
          // this is to try and figure out the 
          setTimeout(function(){
            $scope.isLoading = false;
            $scope.spinnerActive = false;
          }, 3000);
        });
      },
      error: function(object, error) {
        $scope.$apply(function () {
          // The object was not retrieved successfully.
          console.error('Warning, did\'t make it: ', object, error);
        });
      }
    });
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };
  });
