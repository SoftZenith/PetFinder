//Importamos los modulos mongoose y Schema necesarios para conectar a MongoDB y crear nuestro esquema
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

//Definimos un esquema, con los campos que utilizaremos y almacenaremos en nuestra base de datos MongoDB
var MascotaEsquema = new Schema({
    nombre: {type: String, required: true},
    sexo: {type: String, required: true},
    edad: {type: Number, required: true},
    raza: {type: String, required: true},
    descripcion: {type: String, required: true},
    location: {type: [Number], required: true},
    //htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

MascotaEsquema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indices en formato 2dsphere, importante para ejecutar busquedas de proximidad
MascotaEsquema.index({location: '2dsphere'});

//Exportamos MascotaEsquema para usarlo en cualquier otra parte del proyecto
//Asignamos el esquema a la collection mascotas de nuestra base de datos en MongoDB
module.exports = mongoose.model('mascotas', MascotaEsquema);
