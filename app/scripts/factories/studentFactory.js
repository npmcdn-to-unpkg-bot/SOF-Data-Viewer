'use strict';

angular.module('sofDataViewerApp')
  .factory("StudentFactory", ["$firebaseObject",
    function($firebaseObject) {
      return function(studentStudyName, schoolName) {
        // create a reference to the database node where we will store our data
        var schoolsRef = new Firebase("https://sof-data.firebaseio.com/schools");
        // var studentRef = schoolsRef.child(schoolName).child('students').child(studentStudyName)
        var schoolRef = schoolsRef.on("child_added", function(snapshot, prevChildKey) {
          var newSchool = snapshot.val();
          // var studentRef = newSchool.students.on("child_added", function(snapshot, prevChildKey) {
            // var student = snapshot.val();
            // console.log(student);
          // });
          console.log(newSchool);
          console.log(newSchool.students);
        });

        // return it as a synchronized object
        return $firebaseObject(studentRef);
      };
    }
  ]);