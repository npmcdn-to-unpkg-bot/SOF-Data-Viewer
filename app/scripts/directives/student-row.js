'use strict';

angular.module('sofDataViewerApp')
  .directive('studentRow', function () {
    return {
      // require: '^?stTable',
      restrict: 'A',
      require: '^ngModel',
      scope: {
        ngModel: '='
      },
      templateUrl: 'views/directives/student-row.html',
      link: function(scope, element, attrs) {
        // var studentRef = new Firebase("https://sof-data.firebaseio.com/students/"+scope.ngModel);
        // The student object/class from FB
        // scope.student = $firebaseObject(studentRef);
        scope.name = scope.ngModel;
        // TODO get school name from parent scope
      }
    };
  });