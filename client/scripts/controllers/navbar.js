'use strict';

angular.module('angularPassportApp')
  .controller('NavbarController', function ($scope, Auth, $location) {
    $scope.menu = [{
      "title": "Title",
      "link": "link"
    }];

    $scope.authMenu = [{
      "title": "Title2",
      "link": "link2"
    }];

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
