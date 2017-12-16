'use strict';
var map, infoWindow;

function initMap() {
    var location = {lat: -33.866, lng: 151.196};

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 16
    });
    var infoWindow = new google.maps.InfoWindow;
    var geocoder = new google.maps.Geocoder;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                center: pos,
                zoom: 16,
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP
            });
            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;
            var latlng = {lat: parseFloat(pos.lat), lng: parseFloat(pos.lng)};
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status.toUpperCase() === 'OK') {
                    if (results[0]) {
                        map.setZoom(16);
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map
                        });
                        // infowindow.setContent(results[0].formatted_address);
                        var adress = results[0].address_components[1].short_name + ', ' +
                            results[0].address_components[0].short_name + ', ' +
                            results[0].address_components[3].long_name;
                        console.log(results);
                        var details = document.getElementById('details');
                        details.innerHTML += '    <div class="col s12 m4 l4">\n' +
                            '        <p class="header" id="f-s-10">Ти тут:</p>\n' +
                            '<p class="blue-text"><i class="icon icon-marker" aria-hidden="true"></i>' + adress +
                            '</p>' +
                            '        <div class="card horizontal"  id="m-0">\n' +
                            '            <div class="card-stacked">\n' +
                            '                <div class="card-content">\n' +
                            '                    <b>Когнітивна психологія</b> — це вчення у психології,' +
                            ' що досліджує внутрішні розумові процеси, як-от процес вирішення проблеми, ' +
                            'пам\'ять та мовні процеси. Когнітивна психологія бере початок з пізньої моделі' +
                            ' біхевіоризму.' +
                            '                </div>\n' +
                            '            </div>\n' +
                            '        </div>\n' +
                            '<button class="direction mobile" onclick="openNav()">\n' +
                            '        <i class="icon icon-direction mobile"></i>\n' +
                            '        Прокласти маршрут\n' +
                            '    </button>'+
                            '    </div>';
                        // infowindow.open(map, marker);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
            map.setCenter(pos);
            new AutocompleteDirectionsHandler(map);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');
    //
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
    var radioButton = document.getElementById(id);
    var that = this;
    radioButton.addEventListener('click', function () {
        that.travelMode = mode;
        that.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
    var that = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            that.originPlaceId = place.place_id;
        } else {
            that.destinationPlaceId = place.place_id;
        }
        that.route();
    });

};

AutocompleteDirectionsHandler.prototype.route = function () {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var that = this;

    this.directionsService.route({
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
    }, function (response, status) {
        if (status.toUpperCase() === 'OK') {
            that.directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}