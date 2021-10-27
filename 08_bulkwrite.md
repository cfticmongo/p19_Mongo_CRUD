# Operaciones bulkwrite en lote

Sintaxis

db.<coleccion>.bulkWrite(
    [
        {propiedad: {valores}}, // Cada una de las operaciones
        {propiedad: {valores}},
        {propiedad: {valores}},
        ...
    ],
    {
        ordered: <boolean>, // ídem que para insert 
        writeConcern: <valor> // replicaSet
    }
)

La sintaxis de operaciones se describe en https://docs.mongodb.com/manual/core/bulk-write-operations/

```
use biblioteca

db.libros.bulkWrite(
    [
        {
            insertOne: {
                document: {titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien'}
            }
        },
        {
            updateOne: {
                filter: {titulo: 'La Historia Interminable'},
                update: {$set: {precio: 30}}
            }
        },
        {
            deleteOne: {
                filter: {autor: 'William Shakespeare'}
            }
        }
    ]
) // Cada operación es atómica a nivel de documento

```

{ acknowledged: true,
  insertedCount: 1,
  insertedIds: { '0': ObjectId("61799dd44267241ee0aed7ae") },
  matchedCount: 1,
  modifiedCount: 1,
  deletedCount: 1,
  upsertedCount: 0,
  upsertedIds: {} }
