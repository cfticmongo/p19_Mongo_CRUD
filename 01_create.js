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