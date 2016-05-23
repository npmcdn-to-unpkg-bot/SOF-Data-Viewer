'use strict';

angular.module('sofDataViewerApp')
  .directive('studentRow', function () {
    return {
      restrict: 'A',
      require: '^ngModel',
      scope: {
        ngModel: '='
      },
      templateUrl: 'views/directives/student-row.html',
      link: function(scope, element, attrs) {
        scope.student = scope.ngModel;
      }
    };
  });