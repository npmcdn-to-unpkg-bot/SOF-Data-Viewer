'use strict';

angular.module('sofDataViewerApp')
  .directive('usSpinner', function () {
    return {
      // restrict: 'A',
      scope: true,
      // require: '^parent',
      link: function (scope, element, atrributes) {
        window.csd = scope;
        // $rootScope.spinnerActive = false;
        // var loading = function () {
        //   return scope.isLoading;
        // };
        // // scope.isLoading = function () {
        // //   return $http.pendingRequests.length > 0;
        // // };

        // scope.$watch(scope.isLoading, function () {
        //   console.log('scope.isLoading changed, now: ', scope.isLoading);
        //   console.log('loading: ', loading());
        //   scope.spinnerActive = loading();
        // //   scope.spinnerActive = loading;
        // //   if(loading){
        // //     element.removeClass('ng-hide');
        // //   }else{
        // //     element.addClass('ng-hide');
        // //   }
        // });
      }
    };
  });