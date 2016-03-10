(function(){
	'use strict';

	angular.module('app')
		.service('trashcarLocatorSvc', trashcarLocatorSvc);

	trashcarLocatorSvc.$inject = ['$http', '$q'];

	function trashcarLocatorSvc($http, $q){
		this.getTrashcarLocations = getTrashcarLocations;

		function getTrashcarLocations(){
			var defer = $q.defer();
			$http.get('/api/trashcar/getloc')
				.then(function(response){
					defer.resolve(response.data);
				}, function(error){
					defer.reject(error.data);
				});

			return defer.promise;
		}
	}
})();