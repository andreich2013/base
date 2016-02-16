(function () {
    'use strict';

    angular
        .module('reeldeal')
        .controller('rd.header.ctrl', Controller);

    /** @ngInject */
    function Controller($scope, $log, rdEvents, $mdSidenav, $mdBottomSheet, rdTopNav) {

        $scope.links = rdTopNav.getData();

        $scope.search = '';

        $scope.searchBlock = {
            isVisible: false,
            toggle: function() {
                this.isVisible = !this.isVisible;
            }
        };

        $scope.toggleSideRight = function() {
            $mdSidenav('right').toggle();
        };

        $scope.showBottomSheet = function($event) {
            $mdBottomSheet.show({
                controller: 'rd.bottomSheet.ctrl',
                templateUrl: 'rd.layout/templates/bottom-sheet.html',
                targetEvent: $event
            });
        };

        $scope.$on(rdEvents.TOP_NAV_DATA_CHANGED, function(data) {
            $scope.links = data;
        });

    }

})();
