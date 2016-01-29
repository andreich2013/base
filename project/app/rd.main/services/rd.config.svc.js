(function () {
    'use strict';

    angular
        .module('layout')
        .provider('portalConfigLayout', PortalConfigLayout);

    /** @ngInject */
    function PortalConfigLayout(TipPortalContextEvents) {

        var filterBarTpls = {},
            currentFilterBarTpl;

        this.$get = function (eventEmitter) {
            eventEmitter.inject(this);
            return this;
        };

        /**
         * @function setFilterBarStateState
         * @param {String} - module name template set for
         * @param {Object} template - filter template for certain module
         * setter for filterBarTpl private property
         */
        this.setFilterBarTpl = function(moduleName, tpl) {
            if(!moduleName) {
                return;
            }

            filterBarTpls[moduleName] =  !!tpl ? tpl : '';
        };

        /**
         * @function getFilterBarTpl
         * @param {String} - module name template was setted for
         * @returns {String} template - filter template for current module
         * getter for filterBarTpl private property
         */
        this.getFilterBarTpl = function(moduleName) {
            if(!moduleName) {
                return;
            }

            return filterBarTpls[moduleName];
        };

        /**
         * @function getFilterBarTpl
         * @param {String} - module name template was setted for
         * @returns {String} template - filter template for current module
         * getter for filterBarTpl private property
         */
        this.getCurrentFilterBarTpl = function() {
            return currentFilterBarTpl;
        };

        /**
         * @function setFilterBarStateState
         * @param {String} - module template state was setted for
         * setter for currentFilterBarTpl private property
         */
        this.chooseCurrentFilterBarTpl = function(moduleName) {
            var tpl = this.getFilterBarTpl(moduleName);

            currentFilterBarTpl = !!tpl ? tpl : '';

            this.emit(TipPortalContextEvents.FILTER_TPL_CHANGED, angular.copy(currentFilterBarTpl));
        };

    }
})();
