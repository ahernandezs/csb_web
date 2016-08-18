angular.module('spaApp').
filter('byAccountType', function () {
    // First parameter is sent by angularJS, the second one is set by us in the ng-options element:
    // byAccountType:['DEP', 'DEB_T']
    return function (accounts, types) {
        var items = {
            out: []
        };
        accounts.forEach(
            function (value) {
                types.forEach(
                    function(val) {
                        if (value.account_type === val)
                            items.out.push( value );
                    }
                );
            }
        );
        return items.out;
    };
});
