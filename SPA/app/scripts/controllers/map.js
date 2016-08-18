angular.module('spaApp').controller('MapCtrl', ['$scope', '$rootScope', 'mapProvider', 'uiGmapGoogleMapApi', 'codeStatusErrors', 'userProvider', 'timerService', '$location', 'logoutService', function ($scope,  $rootScope, mapProvider, uiGmapGoogleMapApi, codeStatusErrors, userProvider, timerService, $location, logoutService) {

	$scope.conSesion = $rootScope.session_token === null || $rootScope.session_token === undefined || $rootScope.session_token === '' ? false : true;
	$scope.details = {};
	$scope.estados = [	{'id':'df','name':'Distrito Federal','lat':19.3200988,'lon':-99.1521845,'zoom':10},
						{'id':'ags','name':'Aguascalientes','lat':21.8890872,'lon':-102.2919885,'zoom':12},
						{'id':'bc','name':'Baja California','lat':30.359001,'lon':-115.0309215,'zoom':7},
						{'id':'bcs','name':'Baja California sur','lat':25.4362468,'lon':-112.3135794,'zoom':7},
						{'id':'camp','name':'Campeche','lat':19.3299855,'lon':-90.7905291,'zoom':8},
						{'id':'coah','name':'Coahuila','lat':27.2107094,'lon':-101.8919144,'zoom':7},
						{'id':'col','name':'Colima','lat':19.2465509,'lon':-103.7286584,'zoom':13},
						{'id':'chis','name':'Chiapas','lat':16.2568741,'lon':-92.3009364,'zoom':7},
						{'id':'chih','name':'Chihuahua','lat':28.6722468,'lon':-106.186553,'zoom':6},
						{'id':'gto','name':'Guanajuato','lat':20.8757536,'lon':-100.8839802,'zoom':8},
						{'id':'gro','name':'Guerrero','lat':17.6009455,'lon':-100.0949411,'zoom':8},
						{'id':'hgo','name':'Hidalgo','lat':20.4972412,'lon':-98.9243422,'zoom':8},
						{'id':'jal','name':'Jalisco','lat':20.8375717,'lon':-103.6022721,'zoom':7},
						{'id':'mex','name':'México','lat':19.3253628,'lon':-99.6045803,'zoom':9},
						{'id':'mich','name':'Michoacán','lat':19.1535204,'lon':-101.9006079,'zoom':8},
						{'id':'mor','name':'Morelos','lat':18.7318964,'lon':-99.0633631,'zoom':10},
						{'id':'nay','name':'Nayarit','lat':21.8432765,'lon':-104.7403113,'zoom':8},
						{'id':'nl','name':'Nuevo León','lat':25.4817893,'lon':-99.8141511,'zoom':7},
						{'id':'oax','name':'Oaxaca','lat':17.0777802,'lon':-96.7284766,'zoom':12},
						{'id':'pue','name':'Puebla','lat':19.0412893,'lon':-98.192966,'zoom':12},
						{'id':'qro','name':'Querétaro','lat':20.6144226,'lon':-100.4057373,'zoom':12},
						{'id':'qr','name':'Quintana Roo','lat':19.7401578,'lon':-88.0125033,'zoom':7},
						{'id':'slp','name':'San Luis Potosí','lat':22.1356658,'lon':-100.9607303,'zoom':12},
						{'id':'sin','name':'Sinaloa','lat':24.7541857,'lon':-107.4199704,'zoom':7},
						{'id':'son','name':'Sonora','lat':29.4067974,'lon':-111.7381017,'zoom':6},
						{'id':'tab','name':'Tabasco','lat':17.94917,'lon':-92.5533447,'zoom':9},
						{'id':'tamp','name':'Tamaulipas','lat':24.9427291,'lon':-98.6440788,'zoom':7},
						{'id':'tlax','name':'Tlaxcala','lat':19.4161981,'lon':-98.1689873,'zoom':10},
						{'id':'ver','name':'Veracruz','lat':19.1788058,'lon':-96.1624092,'zoom':13},
						{'id':'yuc','name':'Yucatán','lat':20.5805196,'lon':-88.9702046,'zoom':8},
						{'id':'zac','name':'Zacatecas','lat':23.0831271,'lon':-102.5352127,'zoom':7}
					];
	$scope.showBranches = false;
	$scope.selectedItem;

	//search branches
	$scope.search = function(){
		if(Object.keys($scope.details).length === 0){
			if($scope.selectedItem !== undefined){
				$scope.showBranches = true;
				mapProvider.getBranches({'lat':$scope.estado.lat,'lng':$scope.estado.lon}).then(
					function() {
						$scope.map.branches = $rootScope.branches;
					},
					function(errorObject) {
						var status = errorObject.status;
						var msg = codeStatusErrors.errorMessage(status);
						if (status === 500){
							$scope.setServiceError(msg + errorObject.response.message);
						} else {
							$scope.setServiceError(msg);
						}
					}
				);
			}
		}else{
			$scope.showBranches = true;
			mapProvider.getBranches({'lat':$scope.details.geometry.location.k,'lng':$scope.details.geometry.location.D}).then(
				function() {
					$scope.map.branches = $rootScope.branches;
				},
				function(errorObject) {
					var status = errorObject.status;
					var msg = codeStatusErrors.errorMessage(status);
					if (status === 500){
						$scope.setServiceError(msg + errorObject.response.message);
					} else {
						$scope.setServiceError(msg);
					}
				}
			);
		}
	};

	$scope.searchNearMe = function(){
		$scope.showBranches = true;
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				mapProvider.getBranches({'lat':position.coords.latitude,'lng':position.coords.longitude}).then(
					function() {
						$scope.map.branches = $rootScope.branches;
						$scope.showBranches = true;
					},
					function(errorObject) {
						var status = errorObject.status;
						var msg = codeStatusErrors.errorMessage(status);
						if (status === 500){
							$scope.setServiceError(msg + errorObject.response.message);
						} else {
							$scope.setServiceError(msg);
						}
					}
				);
			}, function() {
				handleNoGeolocation(true);
			});
		} else {
			handleNoGeolocation(false);
		}
	};

	//Center defined by default
	$scope.map = { center: { latitude: 19.432602, longitude: -99.13320499999998 }, zoom: 15, bounds: {}};
	$scope.marker = {
		id: 0,
		coords: {
			latitude: 19.432602,
			longitude: -99.13320499999998
		},
		options: { draggable: false }
	};
	$scope.map.branches = {};

	//Calculates the actual user location by geolocalization
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			$scope.map.center = {
									latitude: position.coords.latitude,
									longitude: position.coords.longitude
								};
			$scope.marker = {
				id: 1,
				coords: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				},
				options: { draggable: false }
			};

		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		handleNoGeolocation(false);
	}

	function handleNoGeolocation(errorFlag) {
		var content = errorFlag ? 'Error: The Geolocation service failed.' : 'Error: Your browser does not support geolocation.';
		return content;
	}

	//this function fetch all the bank's branches at the beginning
	mapProvider.getBranches({}).then(
		function() {
			$scope.map.branches = $rootScope.branches;
		},
		function(errorObject) {
			var status = errorObject.status;
			var msg = codeStatusErrors.errorMessage(status);
			if (status === 500){
				$scope.setServiceError(msg + errorObject.response.message);
			} else {
				$scope.setServiceError(msg);
			}
		}
	);

	$scope.selectedBranch = function(branch){
		$scope.map.center.latitude = branch.coordinates.lat;
		$scope.map.center.longitude = branch.coordinates.lng;
		$scope.marker = {
		id: branch.id,
		coords: {
			latitude: branch.coordinates.lat,
			longitude: branch.coordinates.lng
		},
		options: { draggable: false }
		};

	};

	$scope.comoLlegar = function(branch){
		window.open('https://www.google.com.mx/maps/dir//'+branch.description.address.street.replace('#','No.')+'%20'+branch.description.address.street2+'%20'+branch.description.address.city);
	};

	/**
	 * call service to close session
	 */
	$scope.logout = function() {
		logoutService.closeSession( true );
	};

	$scope.$on('IdleTimeout', function() {
		$scope.showIdleAlert = true;
	});

	$scope.$on('WarningTimeout', function() {
		$scope.logout();
	});

	$scope.$on('IdleReset', function() {
		$scope.showIdleAlert = false;
	});

	$scope.selectedState=function(item){
		$scope.selectedItem=item;
	}
}]);
