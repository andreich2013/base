(function () {
    'use strict';

    angular
        .module('layout')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $locationProvider) {

        $stateProvider
            .state({
                abstract: true,
                name: 'rd',
                views: {
                    '@': {
                        templateUrl: 'layout/tmpl/layout.html',
                        controller: 'rd.layout.ctrl'
                    },
                    'top@rd': {
                        templateUrl: 'layout/tmpl/header.tmpl.html',
                        controller: 'layout.header.controller'
                    },
                    'left@rd': {
                        templateUrl: 'layout/tmpl/left-side.tmpl.html',
                        controller: 'layout.header.controller'
                    },
                    'right@rd': {
                        templateUrl: 'layout/tmpl/right-side.tmpl.html',
                        controller: 'layout.header.controller'
                    }
                }
            });

        $locationProvider.html5Mode(true);
    }

})();
