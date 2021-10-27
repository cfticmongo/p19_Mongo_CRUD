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

### Actualizaciones con la opción upsert (update insert) ¡Ojo certificación!
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

### Actualización parcial del/los documento/s (utilizar operadores)
$set
$set: {<campo>: <nuevo-valor>, <campo>: <nuevo-valor>,... }
Este operador si no de los campos que se le pasa en la expresión no existe, lo crea
con el valor proporcionado

{ _id: ObjectId("61795fde4267241ee0aed7a1"),
  title: 'Cien Años de Soledad',
  autor: 'Gabriel García Márquez',
  stock: 14 }

```
db.libros.updateOne( // porque vamos a actualizar un solo documento
    {_id: ObjectId("61795fde4267241ee0aed7a1")},
    {$set: {stock: 20, prestados: 5}}
)
```

En campos de subdocumentos

Insertamos

```
db.libros.insert({
    title: 'El Quijote',
    autor: {
        nombre: 'Miguel',
        apellidos: 'Cervantes Saavedra',
        pais: 'España'
    }
})
```

Podemos usar $set con la notación del punto

```
db.libros.updateOne(
    {title: 'El Quijote'},
    {$set: {'autor.apellidos': 'De Cervantes Saavedra'}}
)
```

Podemos usar $set en campos de tipo array

```
db.libros.insert(
    {title: 'El Otoño del Patriarca', categorias: ['novela','españa','best-seller']}
)
```

La manera más sencilla de actualizar elementos en arrays es por posición y se
usa $set con la notación del punto

```
db.libros.updateOne(
    {title: 'El Otoño del Patriarca'},
    {$set: {'categorias.1': 'colombia'}}
)
```

## Actualizacion de un campo solo en el caso de inserción ¡Ojo Certificación!
$setOnInsert
Establece el valor de uno o varios campos si la operación
resulta ser de inserción (lo utilizaremos en operaciones con upsert)

```
db.libros.updateOne(
    {title: 'La Historia Interminable'},
    {$set: {precio: 20}, $setOnInsert: {autor: 'Michael Ende'}}, // En este primer caso como no existe crea el campo
    {upsert: true} 
)
```

```
db.libros.updateOne(
    {title: 'La Historia Interminable'},
    {$set: {precio: 18}, $setOnInsert: {autor: 'M. Ende'}}, // Ahora ya no actualiza este campo de autor
    {upsert: true} 
)
```

{ _id: ObjectId("617972798648ca8f924f81da"),
  title: 'La Historia Interminable',
  autor: 'Michael Ende', // Autor no fue modificado
  precio: 18 } // Si que se modifica

Posibles respuestas a pregunta de certificaciones

a) {_id: ..., title: 'La Historia Interminable', autor: 'M. Ende', precio: 18}

b) {_id: ..., title: 'La Historia Interminable', autor: 'Michael Ende', precio: 20}

c) {_id: ..., title: 'La Historia Interminable', autor: 'Michael Ende', precio: 18} // Correcta

d) {_id: ..., title: 'La Historia Interminable', precio: 18}

e) {_id: ..., autor: 'Michael Ende', precio: 18}

### Eliminación de uno o varios campos de uno o varios documentos
$unset
{$unset: {<campo>: '', <campo>: ''}}

```
db.libros.updateOne(
    {title: 'La Historia Interminable'},
    {$unset: {precio: ''}} // Eliminará el campo precio
)
```

{ _id: ObjectId("617972798648ca8f924f81da"),
  title: 'La Historia Interminable',
  autor: 'Michael Ende' }

### Actualización de un campo de fecha a la fecha actual
$currentDate
{$currentDate: {<campo-de-fecha>: true}}
Como ocurre con $set si el campo no existe lo crea

```
db.libros.updateOne(
    {title: 'El Quijote'},
    {$set: {stock: 10}, $currentDate: {actualizadoEl: true}}
)
```
{ _id: ObjectId("617966df4267241ee0aed7a4"),
  title: 'El Quijote',
  autor: 
   { nombre: 'Miguel',
     apellidos: 'De Cervantes Saavedra',
     pais: 'España' },
  actualizadoEl: 2021-10-27T15:55:14.504Z,
  stock: 10 }

### Actualización de un campo numérico con operador incremental
$inc
{$inc: {<campo-numerico>: <entero-cantidad-a-incrementar>}}

```
db.libros.updateOne(
    {title: 'El Quijote'},
    {$inc: {stock: 5}} // Incrementa en 5 unidades el valor de stock
)
```

### Actualización de un campo numérico con multiplicación por factor
$mul
{$mul: {<campo-numerico>: <entero-cantidad-a-multiplicar>}}

### Actualización de un campo númerico si el valor a actualizar es menor que el existente
$min
{$min: {<campo-numérico>: <valor-mínimo>}}

```
db.libros.updateOne(
    {title: 'El Quijote'},
    {$min: {stock: 10}} // Para llevar el valor de un campo a un mínimo
)
```

### Actualización de un campo númerico si el valor a actualizar es mayor que el existente
$max
{$max: {<campo-numérico>: <valor-máximo>}}

```
db.libros.updateOne(
    {title: 'El Quijote'},
    {$max: {stock: 30}} // Para llevar el valor de un campo a un máximo
)
```

### Actualización del nombre de un campo en uno o varios documentos
$rename
{$rename: {<campo>: 'nuevo-nombre'}}

```
db.libros.updateMany( // Si ejecutaramos con update() se le pasa la opción multi: true
    {},
    {$rename: {title: 'titulo'}}
)
```

Si el campo tuviera índice habría que eliminarlo ya que estará construido con el antiguo nombre
y crear uno nuevo con el nuevo nombre. (All credits to Carlos)

### Actualización de elementos de array mediante operador posicional (basado en una expresión) ¡Ojo certificación!
$ (operador posicional para actualización)
{"<campo-array>.$": <valor-actualizado>}  // La posición esta basada en la consulta

```
db.libros.insert(
    {titulo: 'Mas ruido que nueces', categorias: ['inglés','medieval','novela']}
)
```

```
db.libros.updateMany(
    {categorias: 'novela'},
    {$set: {'categorias.$': 'clásico'}} // Cambiará el elemento novela por clásico
)
```

```
db.libros.find({categorias: 'clásico'})
{ _id: ObjectId("617968314267241ee0aed7a7"),
  categorias: [ 'clásico', 'colombia', 'best-seller' ],
  titulo: 'El Otoño del Patriarca' }
{ _id: ObjectId("61797e674267241ee0aed7a8"),
  titulo: 'Mas ruido que nueces',
  categorias: [ 'inglés', 'medieval', 'clásico' ] }
```


Solo actualiza la primera coincidencia

```
db.libros.insert([
    {titulo: "Otelo", autor: "William Shakespeare", valoraciones: ["bien","regular","bien","mal","muy bien"]},
    {titulo: "Momo", autor: "Michael Ende", valoraciones: ["muy bien","regular","bien","bien","muy bien"]},
])
```

```
db.libros.updateMany(
    {valoraciones: 'bien'},
    {$set: {'valoraciones.$': 'correcto'}}
)
```

```
db.libros.find({valoraciones: 'correcto'})
{ _id: ObjectId("61797fd74267241ee0aed7a9"),
  titulo: 'Otelo',
  autor: 'William Shakespeare',
  valoraciones: [ 'correcto', 'regular', 'bien', 'mal', 'muy bien' ] } // solo cambia la primera coincidencia
{ _id: ObjectId("61797fd74267241ee0aed7aa"),
  titulo: 'Momo',
  autor: 'Michael Ende',
  valoraciones: [ 'muy bien', 'regular', 'correcto', 'bien', 'muy bien' ] }
```

### Actualización de todos los elementos de un array ¡Ojo certificación!
$[]
{"<campo-array>.$[]": <nuevo-valor>}

```
db.libros.insert({
    titulo: 'The Firm', autor: 'John Grisham', opiniones: [3,2,8,9,10,4]
})
```

```
db.libros.updateOne(
    {titulo: 'The Firm'},
    {$set: {'opiniones.$[]': 5}}
)
```

{ _id: ObjectId("617981c84267241ee0aed7ab"),
  titulo: 'The Firm',
  autor: 'John Grisham',
  opiniones: [ 5, 5, 5, 5, 5, 5 ] } // Setea todos los valores a 5


### Actualización de varios elementos de un array mediante una expresión ¡Ojo certificación!
$[<identificador>]
{arrayFilters: [{<identificador>: <expresión>}]} // En el documento de opciones

```
db.libros.insert(
    {titulo: "Crimen Imperfectio", autor: 'John Grisham', precios: [22, 21, 13, 18, 21, 14]}
)
```

```
db.libros.updateOne(
    {titulo: "Crimen Imperfectio"},
    {$set: {"precios.$[elem]": 15}},
    {arrayFilters: [{"elem": {$lt: 15}}]}  // Actualizaremos los elementos con valor menor a 15 a un nuevo valor de 15
)
```

{ _id: ObjectId("617983824267241ee0aed7ac"),
  titulo: 'Crimen Imperfectio',
  autor: 'John Grisham',
  precios: [ 22, 21, 15, 18, 21, 15 ] }


```
db.libros.updateOne(
    {titulo: "Crimen Imperfectio"},
    {$set: {"precios.$[elem]": 22}},
    {arrayFilters: [{"elem": 21}]}  // Actualizaremos los elementos con igul a 21 a nuevo valor de 22
)
```

{ _id: ObjectId("617983824267241ee0aed7ac"),
  titulo: 'Crimen Imperfectio',
  autor: 'John Grisham',
  precios: [ 22, 22, 15, 18, 22, 15 ] }

### Actualización de arrays añadiendo un nuevo valor salvo que exista
$addToSet
{$addToSet: {<campo-array>: <valor>}}

```
db.libros.updateMany(
    {categorias: {$exists: true}}, // todos los docs que tengan el campo categorias
    {$addToSet: {categorias: 'best-seller'}} // Todos los valores de campo categorías tendrán que ser array
)
```
Solo añadirá el valor como nuevo elemento al final array siempre que no existe, si existiera no hace nada

### Actualización de arrays eliminando el primer o último elemento
$pop
{$pop: {<campo-array>: <1 | -1>}} // Con -1 elimina el primero y con 1 elimina el último

```
db.libros.updateOne(
    {titulo: 'The Firm'},
    {$pop: {opiones: -1}}
)
```

### Actualización de arrays eliminando elementos que cumplan una condición
$pull
{$pull: {<campo-array>: <expresión>}}

```
db.libros.update(
    {titulo: "The Firm"},
    {$set: {categorias: ["USA", "castellano", "drama", "clásico", "suspense"]}}
)
```

```
db.libros.update(
    {titulo: "The Firm"},
    {$pull: {categorias: "drama"}} // Elimina el elemento con el valor drama
)
```

{ _id: ObjectId("617981c84267241ee0aed7ab"),
  titulo: 'The Firm',
  autor: 'John Grisham',
  opiniones: [ 5, 5, 5, 5, 5 ],
  categorias: [ 'USA', 'castellano', 'clásico', 'suspense' ] }

### Actualización de arrays añadiendo elementos
$push
{$push: {<campo-array>: <valor | $each: [array de valores]>}}

```
db.libros.insert({titulo: "El Caso Fitgerald", autor: "John Grisham", categorias: ["novela","drama"]})
```

```
db.libros.updateOne(
    {titulo: "El Caso Fitgerald"},
    {$push: {categorias: {$each: ['best-seller','2017']}}}
)
```

{ _id: ObjectId("617992b74267241ee0aed7ad"),
  titulo: 'El Caso Fitgerald',
  autor: 'John Grisham',
  categorias: [ 'novela', 'drama', 'best-seller', '2017' ] }