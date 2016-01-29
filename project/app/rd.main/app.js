(function() {
    'use strict';

    angular
        .module('layout', [
            'ngCookies',
            'ngSanitize',
            'ngTouch',
            'ui.bootstrap',
            'nsPopover',
            'rt.eventemitter',

            'tip.aa.oidc',
            'tip.aa.oidc.loader',

            'layout.router',
            'layout.navigation',
            'layout.context'
        ])
        .constant('MODULE_NAMES', {
            ELW: 'ELW',
            NOL: 'NOL'
        });
})();
