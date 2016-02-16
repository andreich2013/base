(function () {
    'use strict';

    angular
        .module('reeldeal')
        .controller('rd.bottomSheet.ctrl', Controller);

    /** @ngInject */
    function Controller($scope, rdEvents, rdTopNav, $mdBottomSheet) {

        $scope.links = rdTopNav.getData();

        $scope.onItemClick = function() {
            $mdBottomSheet.hide();
        };

        $scope.$on(rdEvents.TOP_NAV_DATA_CHANGED, function(data) {
            $scope.links = data;
        });
    }

})();
