'use strict';

angular.module('sofDataViewerApp')
  .directive('jsonCell', function () {
    return {
      // require: '^?stTable',
      restrict: 'A',
      require: '^ngModel',
      scope: {
        student: '=',
        studentLog: '=',
        day: '='
      },
      templateUrl: 'views/directives/json-cell.html',
      link: function(scope, element, attrs) {
        scope.studentLog = scope.studentLog;
      }
    };
  });