/* jshint ignore:start */


    // <div  isteven-multi-select
    //       input-model='searchAttributes'
    //       output-model='outputPictures'
    //       button-label='icon name day activityNumber'
    //       item-label='day activityNumber name maker'
    //       orientation='vertical'
    //       tick-property='ticked' 
    //       group-property='msGroup'
    //       >
    // </div>


'use strict';

/**
 * @ngdoc function
 * @name sofDataViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sofDataViewerApp
 */
angular.module('sofDataViewerApp')
  .controller('photoController', function ($scope, Lightbox) {
    var pictures = Parse.Object.extend('Picture');
    var query = new Parse.Query(pictures);

    query.include( ['school_id',
                    'activity_id',
                    'student_id'
                   ] )
         .ascending('date');
    query.find({
      success: function(results) {
        $scope.searchAttributes = [];
        $scope.days = [];
        $scope.activities = [];

        $scope.pictures = [];
        $scope.images = [];
        for (var i = 0; i < results.length; i++) {
          var picture = results[i];
          picture.imageIndex = i;
          picture.ticked = true;
          picture.name = picture.get('name');
          picture.activity = picture.get('activity_id');
          picture.activityNumber = picture.get('activity_id').get('activityNumber');
          picture.activityDay = picture.get('activity_id').get('activityDay');
          // Add the day if it doesn't exist
          var dayFound = false;
          for(var i = 0; i < $scope.days.length; i++) {
            if ($scope.days[i].day == picture.activityDay) {
              dayFound = true;
              break;
            }
          }
          if(!dayFound) {
            $scope.days.push({ 'day': picture.activityDay, 'ticked':true })   
          }

          // Add the activityNumber if it doesn't exist
          var activityFound = false;
          for(var i = 0; i < $scope.activities.length; i++) {
            if ($scope.activities[i].activityNumber == picture.activityNumber) {
              activityFound = true;
              break;
            }
          }
          if(!activityFound) {
            $scope.activities.push({ 'activityNumber': picture.activityNumber, 'ticked':true }) 
          }
          
          $scope.pictures.push(picture);

          // This is for Lightbox
          $scope.images.push({  'url': results[i].get('file')._url,
                                'label': results[i].get('name')
                            });
        }
        // $scope.data = [
        //     {   name: 'People', msGroup: true       },  // Start a group labled 'People'
        //     {   name: 'Person A', selected: false   },      // Person A. 
        //     {   name: 'Person B', selected: false   },      // Person B
        //     {   msGroup: false }                        // Close 'People' group
        // ];

        // Make the groups for the multi-selector
        $scope.days.unshift({name: 'Days', msGroup: true});
        $scope.days.push({msGroup: false});
        $scope.activities.unshift({name: 'Activity Numbers', msGroup: true});
        $scope.activities.push({msGroup: false});

        for (var i = 0 ; i < $scope.days.length; i++) {
          $scope.searchAttributes.push($scope.days[i]);
        };
        for (var i = 0 ; i <$scope.activities.length; i++) {
          $scope.searchAttributes.push($scope.activities[i]);
        };

        $scope.$watch('outputPictures', function(newValue, oldValue) {
          console.log(newValue);
          console.log(oldValue);
        });
        window.csf = $scope.outputPictures;
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        console.error('Warning, did\'t make it: ', object, error);
      }
    });
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };
  });

/* jshint ignore:end */
