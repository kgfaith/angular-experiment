'use strict';

angular.module("ab.directives").directive('hideOnHover', [function () {

  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {

      var classNameToHide = attrs.hideOnHover;
      var $element = $(element);
      $element.on("mouseenter", function () {
        $element.find('.' + classNameToHide).hide();
      });

      $element.on("mouseleave", function () {
        $element.find('.' + classNameToHide).show();
      });
    }
  }
}]);
