// Operaciones de creación de documentos en MongoDB

// Métodos insert(), insertOne(), insertMany()

// Método insert()
// Sintaxis

// db.<colección>.insert(
//     <documento | array-documentos>,
//     {
//         writeConcern: <valores>, // relacionado con replica set
//         ordered: <boolean>
//     }
// ) 

// Casos de uso

// Inserción de un documento en una colección sin el campo obligatorio _id

use clinica

db.inventario.insert({articulo: 'zuecos', cantidad: 100}) // Si la colección no existe la crea implícitamente

// Podemos ir utilizando find() para ver si se ha persistido

db.inventario.find()
{ _id: ObjectId("616996b07d1fb92202bb2387"), // Si no pasamos _id Mongo crea el campo con el tipo ObjectId()
  articulo: 'zuecos',
  cantidad: 100 }

// El campo _id es obligatorio en todas las colecciones y será el identificador único de ese documento
// en la colección (es decir mongo crea un índice único por defecto en la colección _id)

// Inserción de un documento en una colección con el campo obligatorio _id

// - El valor de _id debe ser único
// - El valor de _id será inmutable 
// - Se puede utilizar cualquier tipo de dato, incluso un documento embebido, excepto array ¡Ojo certificación!

db.inventario.insert({articulo: 'gasas', cantidad: 1000, _id: 45})

// Si intentamos introducir otro documento con el mismo _id devuelve error
db.inventario.insert({articulo: 'bisturí', cantidad: 1000, _id: 45})
// E11000 duplicate key error collection...

// Se puede utilizar documento embebido
db.inventario.insert({articulo: 'mascarillas', cantidad: 10000, _id: {old: 45124, new: 'AR5675'}})

// No permitirá array
db.inventario.insert({articulo: 'delantal', cantidad: 1000, _id: [451222, 23234]})
// MongoBulkWriteError: The '_id' value cannot be of type array

// Naturaleza o estructura de datos de los documentos en MongoDB
// Por defecto y si no se implementa validación MongoDB tiene un esquema totalmente flexible (dinámico o schemaless)
// - Los campos pueden tener cualquier tipo y este además puede ser distinto en distintos documentos
// - Los diferentes documentos pueden tener o no diferentes campos

db.inventario.insert({articulo: 'gasas F4', cantidad: 60, observaciones: 'Lorem ipusm...'})

// Inserción de varios documentos

db.inventario.insert([ // Se introduce array de documentos en vez de documento único
  {articulo: 'gasas 20', cantidad: 300},
  {articulo: 'gasas 40', cantidad: 50},
  {articulo: 'gasas 100', cantidad: 900},
])

// Inserción de varios documentos con opción ordered: true (valor por defecto)
// Con este valor si se produce un error durante la operación de escritura, los documentos
// restantes ya no se escriben aunque estos no contengan errores

db.empleados.insert([
  {_id: 1, nombre: 'Carlos', apellidos: 'Pérez'},
  {_id: 2, nombre: 'Sara', apellidos: 'Gómez'},
  {_id: 2, nombre: 'Juan', apellidos: 'Pérez'}, // A partir del error se paraliza la operación
  {_id: 4, nombre: 'Luisa', apellidos: 'García'},
])

db.empleados.find()
{ _id: 1, nombre: 'Carlos', apellidos: 'Pérez' }
{ _id: 2, nombre: 'Sara', apellidos: 'Gómez' }

// En cambio con la opción ordered: false a partir del error si los documentos son correctos
// se realizará la operación de su escritura


db.empleados.insert([
  {_id: 10, nombre: 'Carlos', apellidos: 'Pérez'},
  {_id: 11, nombre: 'Sara', apellidos: 'Gómez'},
  {_id: 11, nombre: 'Juan', apellidos: 'Pérez'}, // A partir del error continua la operación
  {_id: 13, nombre: 'Luisa', apellidos: 'García'},
  {_id: 14, nombre: 'Pedro', apellidos: 'García'},
], {ordered: false})

db.empleados.find() // Ojo certificación
...
{ _id: 10, nombre: 'Carlos', apellidos: 'Pérez' }
{ _id: 11, nombre: 'Sara', apellidos: 'Gómez' }
{ _id: 13, nombre: 'Luisa', apellidos: 'García' }
{ _id: 14, nombre: 'Pedro', apellidos: 'García' }

// Inserción de documentos con subdocumentos o documentos embebidos
// Pueden tener hasta 100 niveles de anidado

db.empleados.insert({
  nombre: 'Carlos',
  apellidos: 'López Pérez',
  turnos: ['mañana','noche'],
  direccion: {
    calle: 'Príncipe de Vergara, 100',
    cp: '28010',
    localidad: 'Madrid'
  }
})

// En cuanto a tamaño es que BSON tienen y por tanto nuestro documento mongoDB tiene
// un tamaño máximo de 16MB

// Si usáramos tamaños superiores o quisieramos guardar binarios o recursos MongoDB
// dispone de GridFS

// Metodo insertOne()
// Idem a todo lo que hemos visto pero solo para un documento
// Sintaxis

// db.<colección>.insertOne(
//     <documento>,
//     {
//         writeConcern: <valores>, // relacionado con replica set
//     }
// ) 

// Metodo insertMany()
// Idem a todo lo que hemos visto pero para varios documentos
// Sintaxis

// db.<colección>.insertMany(
//     <array-documentos>,
//     {
//         writeConcern: <valores>, // relacionado con replica set
//         ordered: <boolean>
//     }
// ) 

// insert() frente a insertOne() e insertMany() permite el método explain()


// Método save() (Deprecado en la nueva shell mongosh)
// Realiza operaciones de inserción o actualización (si ya existe el campo _id)

// db.<colección>.save(
//     <documento>,
//     {
//         writeConcern: <valores>, // relacionado con replica set
//     }
// ) 

db.empleados.save({_id: 200, nombre: 'Pilar', apellidos: 'Gómez'}) // si el valor de _id no existe funciona como insert
db.empleados.save({_id: 201, nombre: 'Juan', apellidos: 'Pérez'})

db.empleados.save({_id: 200, nombre: 'Pilar', apellidos: 'Pérez Fernández'}) // En este caso como _id ya existe funciona
// como una actualización (de todo el documento)
// WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })


// Resto de métodos que pueden bajo determinados casos de uso generar inserciones

// db.<colección>.update()
// db.<colección>.updateOne()
// db.<colección>.updateMany()
// db.<colección>.findAndModify()
// db.<colección>.findOneAndUpdate()
// db.<colección>.findOneAndReplace()

// db.<colección>.bulkWrite() // Agrupador
