(function () {
    'use strict';

    angular
        .module('layout')
        .controller('layout.controller', MainController);

    /** @ngInject */
    function MainController($log) {
        $log.debug('layout.controller');
    }
})();
