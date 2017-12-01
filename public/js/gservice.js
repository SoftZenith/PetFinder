

// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------

        // Service our factory will return
        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;


        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 23.773;
        var selectedLong = -102.491;



        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;




            // Perform an AJAX call to get all of the records in the db.
            $http.get('/users').success(function(response){

                // Convertir al formato de Google Map
                locations = convertToMapPoints(response);

                // Inicializar el mapa
                initialize(latitude, longitude);
            }).error(function(){});
        };


        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Crea un menu emergente por cada registro
                var  contentString =
                    '<p><b>Nombre </b>: ' + user.nombre +
                    '<br><b>Edad </b>: ' + user.edad +
                    '<br><b>Sexo </b>: ' + user.sexo +
                    '<br><b>Raza </b>: ' + user.raza +
                    '<br><b>Descripción </b>: ' + user.descripcion +
                    '</p>';

                // Convierte cada elemento del JSON en formato Google Maps Location.
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    nombre: user.nombre,
                    sexo: user.sexo,
                    edad: user.edad,
                    raza: user.raza,
                    descripcion: user.descripcion
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        //Crear mapa y ponerlo en index.html
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    //Iniciliazamos nuestro marcador en una posicion por default
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;


  // Function for moving to a selected location
  map.panTo(new google.maps.LatLng(latitude, longitude));

  // Clicking on the Map moves the bouncing red marker
  google.maps.event.addListener(map, 'click', function(e){
      var marker = new google.maps.Marker({
          position: e.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });

      // When a new spot is selected, delete the old red bouncing marker
      if(lastMarker){
          lastMarker.setMap(null);
      }

      // Create a new red bouncing marker and move to it
      lastMarker = marker;
      map.panTo(marker.position);
      
      // Update Broadcasted Variable (lets the panels know to change their lat, long values)
      googleMapService.clickLat = marker.getPosition().lat();
      googleMapService.clickLong = marker.getPosition().lng();
      $rootScope.$broadcast("clicked");

  });

};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
