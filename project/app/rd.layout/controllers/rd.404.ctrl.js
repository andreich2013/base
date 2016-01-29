(function () {
    'use strict';

    angular
        .module('layout')
        .controller('layout.layout.controller', layoutController);

    /** @ngInject */
    function layoutController($scope, $log, TipPortalContextEvents) {
        $log.debug('layout.layout.controller');

        /**
         * {Boolean} value which determine filterBar visibility (true - show, false - hide)
         */
        $scope.filterBarOpen = false;

        /**
         * {Boolean} value which determine left panel state (true - open, false - close)
         * will be add in future
         */
        //$scope.sidebarLeftOpen = true;

        /**
         * {Boolean} value which determine right panel state (true - open, false - close)
         * will be add in future
         */
        //$scope.sidebarRightOpen = true;

        $scope.$on(TipPortalContextEvents.FILTER_TOGGLED, function(e, value) {
            $scope.filterBarOpen = !!value;
        });
    }
})();
