(function(){
	'use strict';

	angular
		.module('app')
		.controller('trashcarLocatorCtrl', trashcarLocatorCtrl);

	trashcarLocatorCtrl.$inject = ['$scope', 'trashcarLocatorSvc'];

	function trashcarLocatorCtrl($scope, trashcarLocatorSvc){
		var vm = this;
		vm.map = null;
		vm.trashcarMarkers = null;
		vm.setMarkers = setMarkers;
		vm.getTrashcarLocations = getTrashcarLocations;		
		vm.trashCanImage = {
			    url: 'images/trashcan_marker.png',
			    // This marker is 20 pixels wide by 32 pixels high.
			    size: new google.maps.Size(512, 512),
			    scaledSize: new google.maps.Size(50, 60),
			    // The origin for this image is (0, 0).
			    origin: new google.maps.Point(0, 0),
			    // The anchor for this image is the base of the flagpole at (0, 32).
			    anchor: new google.maps.Point(0, 60)
			};

		vm.recycleImage = {
			    url: 'images/recycle_marker.png',
			    // This marker is 20 pixels wide by 32 pixels high.
			    size: new google.maps.Size(42, 47),
			    scaledSize: new google.maps.Size(42, 47),
			    // The origin for this image is (0, 0).
			    origin: new google.maps.Point(0, 0),
			    // The anchor for this image is the base of the flagpole at (0, 32).
			    anchor: new google.maps.Point(0, 47)
			};
	
		vm.getTrashcarLocations();
		
		function getTrashcarLocations(){
			vm.trashcarMarkers = [];
			trashcarLocatorSvc.getTrashcarLocations()
				.then(function(data){
					vm.setMarkers(data);
				}, function(error){
					alert(error);
				});
		}

		function setMarkers(data){				
			for(var i in data){
				var geolocation = data[i].geolocation.split(',');
				var marker = new google.maps.Marker({
				    position: {'lat': Number(geolocation[0]), 'lng': Number(geolocation[1])},
				    map: map,
				    title: data[i].vehicalNumbrPlate,
				    animation: google.maps.Animation.DROP
				  });
				
				if(data[i].type === '垃圾車'){
					marker.setIcon(vm.trashCanImage);
				}else if(data[i].type === '資源回收車'){
					marker.setIcon(vm.recycleImage);
				}

				vm.trashcarMarkers.push(marker);
			}
			
		}

		
	}
})();