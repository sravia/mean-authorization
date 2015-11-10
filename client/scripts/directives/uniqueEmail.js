'use strict';

angular.module('angularPassportApp')
    .directive('uniqueEmail', function ($http) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                function validate(value) {
                    if(!value) {
                        ngModel.$setValidity('unique', true);
                        return;
                    }
                    $http.get('/auth/check_email/' + value).success(function(user) {
                        console.log(user);
                        if(!user.exists) {
                            ngModel.$setValidity('unique', true);
                        } else {
                            ngModel.$setValidity('unique', false);
                        }
                    });
                }

                scope.$watch( function() {
                    console.log(ngModel.$viewValue);
                    return ngModel.$viewValue;
                }, validate);
            }
        };
    });