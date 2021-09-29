(()=> {
    'use strict';
    angular.module('NarrowItDownApp', [])
    .controller('narrowItDownController', NarrowItDownController)
    .service('menuSearchService', MenuSearchService)
    .directive('foundItems', foundItemsDirective)

    //                          The directive
    function foundItemsDirective(){
        let ddo = {
            templateUrl: 'template/foundItems.html',
            scope: {menuItems: '<', onRemove: '&'}
        }
        return ddo;
    }

    //                          The Controller
    NarrowItDownController.$inject = ['menuSearchService']
    function NarrowItDownController(menuSearchService){
        let ctrl = this;
        let searchService = menuSearchService;

        ctrl.searchInput = '';
        ctrl.showMessage = false;
        ctrl.found = [];
        
        
        ctrl.narrowIt = function(){
            if(ctrl.searchInput){
                searchService.getMatchedMenuItems(ctrl.searchInput).then(respFunc)
                ctrl.searchInput = '';
            }
            else{
                ctrl.found = [];
                ctrl.showMessage = true;
                ctrl.searchInput = '';
            }
        }
        ctrl.removeItem = function(itemIndex){
            ctrl.found.splice(itemIndex, 1);
        }
        function respFunc(response){
            ctrl.showMessage = false;
            ctrl.found = response;
            if(! ctrl.found.length > 0){
                ctrl.showMessage = false;
            }
        }

    }

    //                              The main service
    MenuSearchService.$inject = ['$http', '$filter']
    function MenuSearchService($http, $filter){
        let service = this;
        let foundItems ;

        service.getMatchedMenuItems = function(searchTerm){

            return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
                .then(response => {
                    foundItems = $filter('filter')(response.data.menu_items, {description: searchTerm});
                    foundItems = $filter('orderBy')(foundItems, 'name')
                    return foundItems;
                })
        }
    }

})();
