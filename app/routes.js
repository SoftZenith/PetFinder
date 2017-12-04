// Dependencias
var mongoose        = require('mongoose');
var User            = require('./model.js');


module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Ejecuta un busqueda para traer todos los registro
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // retorna un JSON con todos los registros
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        var newuser = new User(req.body);

        //Guarda un nuevo registro
        newuser.save(function(err){
            if(err)
                res.send(err);

            //retorna el JSON insertado
            res.json(req.body);
        });
    });
};
