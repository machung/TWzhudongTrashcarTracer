(function(){
	'use strict';

	angular
		.module('app')
		.controller('trashcarLocatorCtrl', trashcarLocatorCtrl);

	trashcarLocatorCtrl.$inject = ['$scope', 'trashcarLocatorSvc'];

	function trashcarLocatorCtrl($scope, trashcarLocatorSvc){
		var vm = this;		
		vm.trashcarMarkers = null;
		vm.setMarkers = setMarkers;
		vm.address = null;
		vm.addressMarker = null;
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
		vm.setCenter = setCenter;

		vm.getTrashcarLocations();
		
		if (navigator.geolocation) {
          navigator.geolocation.watchPosition(currentPositionCallback, currentPositionError);
        }
        else {
          alert('Your browser does not support GPS.');
        }

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

		function setCenter(){
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': vm.address}
				, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
					  	map.setCenter(results[0].geometry.location);
						var image = {
						  url: 'images/home_marker.png',
						  // This marker is 20 pixels wide by 32 pixels high.
						  size: new google.maps.Size(200, 200),
						  scaledSize: new google.maps.Size(50, 60),
						  // The origin for this image is (0, 0).
						  origin: new google.maps.Point(0, 0),
						  // The anchor for this image is the base of the flagpole at (0, 32).
						  anchor: new google.maps.Point(0, 60)
						};
					  
					  	if(vm.addressMarker != null){
							vm.addressMarker.setMap(null);
						}

						vm.addressMarker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location,
						title: 'My home',
						icon: image
						});
					} else {
					    alert('Geocode was not successful for the following reason: ' + status);
					}
          });
		}

		function currentPositionCallback(position){
	        var currentPosition = {'lat': position.coords.latitude, 'lng': position.coords.longitude};
	        map.setCenter(currentPosition);
	        var image = {
	          url: 'images/home_marker.png',
	          // This marker is 20 pixels wide by 32 pixels high.
	          size: new google.maps.Size(200, 200),
	          scaledSize: new google.maps.Size(50, 60),
	          // The origin for this image is (0, 0).
	          origin: new google.maps.Point(0, 0),
	          // The anchor for this image is the base of the flagpole at (0, 32).
	          anchor: new google.maps.Point(0, 60)
	        };
	        
	        if(vm.addressMarker != null){
	        	vm.addressMarker.setMap(null);
	    	}

	        vm.addressMarker = new google.maps.Marker({
	          map: map,
	          position: currentPosition,
	          title: 'You are here',
	          icon: image
	        });
	      }

	      function currentPositionError(error) {
	        switch(error.code) {
	            case error.PERMISSION_DENIED:
	                alert("User denied the request for Geolocation.");
	                break;
	            case error.POSITION_UNAVAILABLE:
	                alert("Location information is unavailable.");
	                break;
	            case error.TIMEOUT:
	                alert("The request to get user location timed out.");
	                break;
	            case error.UNKNOWN_ERROR:
	                alert("An unknown error occurred.");
	                break;
	        }
	      }
	}
})();