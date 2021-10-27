# Operaciones de actualización de documentos

## método update()

sintaxis

db.<coleccion>.update(
    {<documento-consulta>}, // Misma sintaxis y operadores que en find() y findOne()
    {<documento-actualización>},
    {<documento-opciones>}
)

## método updateOne() Actualiza un solo documento

sintaxis

db.<coleccion>.updateOne(
    {<documento-consulta>}, // Misma sintaxis y operadores que en find() y findOne()
    {<documento-actualización>}
)

## método updateMany() Actualiza todos los documentos seleccionados

sintaxis

db.<coleccion>.updateMany(
    {<documento-consulta>}, // Misma sintaxis y operadores que en find() y findOne()
    {<documento-actualización>}
)

## Casos de Uso de actualización

Set de datos

```
use biblioteca

db.libros.insert([
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 10},
    {title: 'La Ciudad y Los Perros', autor: 'Mario Vargas LLosa', stock: 10, prestados: 2},
    {title: 'El Otoño del Patriarca', autor: 'Gabriel García Márquez', stock: 10, prestados: 0},
])
```

### Actualización del documento completo
Solo se puede realizar usando update()
Se pueden cambiar todo el documento excepto el campo _id que es inmutable

```
db.libros.update(
    {title: 'Cien Años de Soledad'},
    {title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 12 } // Actualiza la primera coincidencia
    // de la consulta con el documento completo que se le pasa como segundo argumento
)
``` 

WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

Si intentáramos cambiar el _id

```
db.libros.update(
    {title: 'Cien Años de Soledad'},
    {_id: 'a234',title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 12 } // Error
)
```

WriteResult({
        "nMatched" : 0,
        "nUpserted" : 0,
        "nModified" : 0,
        "writeError" : {
                "code" : 66,
                "errmsg" : "After applying the update, the (immutable) field '_id' was found to have been altered to _id: \"a234\""
        }
})

Si el valor de _id que se le pasa en el documento de consulta coincide con 
el del documento seleccionado por la consulta, en ese caso no devuelve error

```
db.libros.update(
    {title: 'Cien Años de Soledad'},
    {_id: ObjectId('61795fde4267241ee0aed7a1'),title: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', stock: 14 } 
)
```

### Actualizaciones con la opción upsert (update insert)
Si encuentra el documento de la consulta lo actualiza pero si no lo encuentra crea
un nuevo documento con los datos de la actualización.

```
db.libros.update(
    {title: 'El Coronel no tiene quien le escriba'},
    {title: 'El Coronel no tiene quien le escriba', autor: 'Gabriel García Márquez', stock: 20},
    {upsert: true}
)
```
WriteResult({
        "nMatched" : 0,
        "nUpserted" : 1, // Ha upserteado el doc con los datos de la actualización
        "nModified" : 0,
        "_id" : ObjectId("6179640d8648ca8f924719ed")
})

