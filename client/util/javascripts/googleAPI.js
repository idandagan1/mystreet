
var infowindow = new google.maps.InfoWindow(),
    mapOptions = {
        center: {lat: 40.9418601, lng: 13.5616095},
        zoom: 10,
        scrollwheel: false},
    mapID = 'mapOfFriends',//TODO: Change
    map = new google.maps.Map(document.getElementById(mapID),mapOptions);

function setFriendsOnMap(listOfStreets) {

    if (listOfStreets == null) {
        return;
    }
    var service = new google.maps.places.PlacesService(map);

    listOfStreets.list.forEach(function(street) {

        service.getDetails({
            placeId: street.details.place_id
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                })

                marker.setVisible(true);

                var streetName = '<div><strong>' + 'Street Name:</strong> ' + place.name + '<br>';
                var memberTitle =  '<strong>Members:</strong><br>';
                var friendsList = "";
                street.members.forEach(function(member){
                    friendsList = friendsList.concat(member+'<br>');
                })
                friendsList = friendsList.concat('</div>');

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(streetName + memberTitle + friendsList);
                    infowindow.open(map, marker);
                });
            }
        })
    })
}

function centerMapBasedOnCurrentUser(user) {

    if(user && user.myLocation) {

        var service = new google.maps.places.PlacesService(map),
            myLocation = user.myLocation;

        service.getDetails({
            placeId: myLocation
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                }
                else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
            }
        })
    }
}

function initialize() {

    var browserSupportFlag =  new Boolean(),
        autocomplete = new google.maps.places.Autocomplete(input),
        newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);

    var autocomplete_options = {
        types: ['geocode']
    };

    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(17);
        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    }

    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            initialLocation = newyork;
        } else {
            initialLocation = newyork;
        }
        map.setCenter(initialLocation);
    }

    var autocomplete = new google.maps.places.Autocomplete(input, autocomplete_options);

    autocomplete.bindTo('lblresult', map);
    var marker = new google.maps.Marker({
        map: map
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);

    });

    // Get the full place details when the user selects a place from the
    // list of suggestions.
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        infowindow.close();
        place = autocomplete.getPlace();
        placeID = place.place_id;
        short_name = place.address_components[0].short_name;
        markers.push(place);
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport)
        {
            map.fitBounds(place.geometry.viewport);
        }
        else
        {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace(({
            placeId: place.place_id,
            location: place.geometry.location
        }));

        marker.setVisible(true);
        //markers.push(marker);
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div>');
        infowindow.open(map, marker);
    });
}

// Run the initialize function when the window has finished loading.
google.maps.event.addDomListener(window, 'load', initialize);
window.onload = function() {
    initialize();
}
