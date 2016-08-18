angular.module('spaApp').directive('alphanumeric', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           if (inputValue === undefined){
            return '';
           }
           var transformedInput = inputValue.replace(/[^a-zA-Z0-9 @._-]/g, '');
           if (transformedInput !== inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }

           return transformedInput;
       });
     }
   };
});
