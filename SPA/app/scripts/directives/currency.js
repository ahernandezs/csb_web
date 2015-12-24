'use strict';

angular.module('spaApp')
	.directive('currency', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attr, ctrl) {

				ctrl.$formatters.push(format);

				ctrl.$parsers.push(function(viewValue) {
					if ( !ctrl.$isEmpty(viewValue) ) {
						// it is valid
						var value = parseFloat(viewValue.replace(/,|\$/g, ''));

						if ( ctrl.$isEmpty(value) || value === 0 ) {
							ctrl.$setValidity('currency', false);
							return undefined;
						}

						ctrl.$setValidity('currency', true);
						return value;
					} else {
						// it is invalid, return undefined (no model update)
						ctrl.$setValidity('currency', false);
						return undefined;
					}
				});

				element.bind('change', function() {
					if ( ctrl.$error.currency ) return undefined;

					var formattedModel = format(ctrl.$modelValue);

					if ( !ctrl.$isEmpty(ctrl.$modelValue) && (formattedModel !== ctrl.$viewValue) ) {
						element.val(formattedModel);
						element.parent().addClass('selected');
					} else {
						element.val(undefined);
						element.parent().removeClass('selected');
					}
				});

				element.bind('focus', function() {
					var value = ctrl.$modelValue;

					if ( value && ctrl.$isEmpty(value) ) {
						element.val(value);
					}
				});

				element.bind('blur', function() {
					var formattedModel = format(ctrl.$modelValue);

					if ( !ctrl.$isEmpty(formattedModel) ) {
						element.val(formattedModel);
						element.parent().addClass('selected');
			        } else {
						element.val(undefined);
						ctrl.$setValidity('currency', false);
			            element.parent().removeClass('selected');
			        }
				});

				function format(modelValue) {
					var value = modelValue ? modelValue.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') : undefined;

					if ( !ctrl.$isEmpty(value) ) {
						if ( value.indexOf(".") !== -1 ) {
							return '$' + value;
						} else {
							return '$' + value + '.00';
						}
						ctrl.$setValidity('currency', true);
					} else {
						return undefined;
					}
				};
			}
		};
});
