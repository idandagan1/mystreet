
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
