// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){


    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    // Functions
    // ----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            //$scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    // Obtener coordenadas actuales del usuario
    geolocation.getLocation().then(function(data){

        // asigna las coordenadas obtenidas
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Mostrar las coordenadas en la vista con redondeo de tres decimales
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    });

    //Agregar un nuevo registro
    $scope.createUser = function() {

        //Guardar los de datos que estan en la vista
        var userData = {
            nombre: $scope.formData.username,
            sexo: $scope.formData.gender,
            edad: $scope.formData.age,
            raza: $scope.formData.raza,
            descripcion: $scope.formData.descripcion,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            //htmlverified: $scope.formData.htmlverified
        };

        //Guardar los datos del usuario en la BD
        $http.post('/users', userData)
            .success(function (data) {

                // Una vez enviados, limpiamos los campos, excepto la localización
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.raza = "";
                $scope.formData.descripcion = "";

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});
