# Collation en MongoDB

Establecer los criterios de orden y selección en las consultas de tipo string.

En mongoDB la colación se puede establecer a tres niveles:

- a nivel de la colección
- a nivel de índice
- a nivel de consulta

## A nivel de colección

Se define con la creación de la colección, es decir como opción del método createCollection. (No podremos
en este caso crear la colección de manera implícita).

```
use tienda

db.createCollection('articulosConColacion', {collation: {locale: 'es'}}) // locale determina el idioma de los valores string
db.createCollection('articulosSinColacion')

```

La propiedad (obligatoria) locale en función del idioma que se le pase ordenará de una determinada manera las
consultas ordenadas de acuerdo a mayúsculas minúsculas y diacríticos


Set de datos

```
db.articulosSinColacion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'},
])

db.articulosConColacion.insert([
    {_id: 1, nombre: 'cafe'},
    {_id: 2, nombre: 'café'},
    {_id: 3, nombre: 'cafE'},
    {_id: 4, nombre: 'cafÉ'},
])

```

```
db.articulosConColacion.find().sort({nombre: 1})
```

{ _id: 1, nombre: 'cafe' }
{ _id: 3, nombre: 'cafE' }
{ _id: 2, nombre: 'café' }
{ _id: 4, nombre: 'cafÉ' }

```
db.articulosSinColacion.find().sort({nombre: 1})
```

{ _id: 3, nombre: 'cafE' }
{ _id: 1, nombre: 'cafe' }
{ _id: 4, nombre: 'cafÉ' }
{ _id: 2, nombre: 'café' }

Podemos comprobarlo con la ñ (All credits to Enrique)

```
db.articulosSinColacion.insert([
    {_id: 10, nombre: 'munoz'},
    {_id: 11, nombre: 'muñoz'},
    {_id: 12, nombre: 'mutis'}
])

db.articulosConColacion.insert([
    {_id: 10, nombre: 'munoz'},
    {_id: 11, nombre: 'muñoz'},
    {_id: 12, nombre: 'mutis'}
])
```

```
db.articulosSinColacion.find().sort({nombre: 1})

```
...
{ ..., nombre: 'munoz' }
{ ..., nombre: 'mutis' } 
{ ..., nombre: 'muñoz' } // la ñ se va al final por ordenación ASCII

```
db.articulosConColacion.find().sort({nombre: 1})
```
{ ..., nombre: 'munoz' }
{ ..., nombre: 'muñoz' } // Ordena correctamente por lexicográfico en castellano
{ ..., nombre: 'mutis' }

El resto de propiedades de colación también se pueden implementar en este nivel.

## A nivel de índice

Veremos en apartado de índices

## A nivel de consulta u operación

Para implementar en una consulta a una colección que no tenga colación o con una colación diferente a la de la colección
se emplea el método collation(<opciones-de-colacción>)

```
db.articulosSinColacion.find().sort({nombre: 1}).collation({locale: 'es'})
```

{ _id: 1, nombre: 'cafe' }
{ _id: 3, nombre: 'cafE' }
{ _id: 2, nombre: 'café' }
{ _id: 4, nombre: 'cafÉ' }
{ _id: ObjectId("617ab3784267241ee0aed7b1"), nombre: 'munoz' }
{ _id: ObjectId("617ab3814267241ee0aed7b2"), nombre: 'muñoz' }
{ _id: ObjectId("617ab3ee4267241ee0aed7b3"), nombre: 'mup' }

¿Qué mas funcionalidades nos aporta collation?

### Propiedad strength
La posibilidad de implementar case-insensitive y diacritic-insensitive (sin usar expr reg) 

strength 3 es el valor por defecto (case-sensitive y diacritic-sensitive)

```
db.articulosSinColacion.find({nombre: 'cafe'}).collation({locale: 'es', strength: 3}) // Equivale a no poner strength
```

{ _id: 1, nombre: 'cafe' }

strength 2 será case-insensitive

```
db.articulosSinColacion.find({nombre: 'cafe'}).collation({locale: 'es', strength: 2}) // No distingue mayus/minus
```

{ _id: 1, nombre: 'cafe' }
{ _id: 3, nombre: 'cafE' }

strength 1 será case-insensitive y diacritic-insensitive

```
db.articulosSinColacion.find({nombre: 'cafe'}).collation({locale: 'es', strength: 1}) // No distingue mayus/minus ni diacríticos
```

{ _id: 1, nombre: 'cafe' }
{ _id: 2, nombre: 'café' }
{ _id: 3, nombre: 'cafE' }
{ _id: 4, nombre: 'cafÉ' }


### Propiedad caseLevel
caseLevel <boolean> establece case-sensitive (será para usar con strength 1)

```
db.articulosSinColacion.find({nombre: 'cafe'}).collation({locale: 'es', strength: 1, caseLevel: true}) // Distingue mayus/minus
                                                                                    // pero no distingue diacríticos
```

{ _id: 1, nombre: 'cafe' }
{ _id: 2, nombre: 'café' }

### Propiedad caseFirst
caseFirst <upper | lower> en consultas ordenadas hace que tengan precedencia las mayus sobre minus o viceversa

```
db.articulosSinColacion.find().collation({locale: 'es', caseFirst: 'upper' }).sort({nombre: 1}) // Preceden mayus sobre minus
                                                                                    // en la ordenación
```

{ _id: 3, nombre: 'cafE' }
{ _id: 1, nombre: 'cafe' }
{ _id: 4, nombre: 'cafÉ' }
{ _id: 2, nombre: 'café' }

### Propiedad numericOrdering
numericOrdering <boolean> permite ordenar numéricamente valores numéricos que estén contenidos en un string

Set datos

```
db.articulosSinColacion.insert([
    {_id: 20, nombre: 'A1'},
    {_id: 21, nombre: 'A11'},
    {_id: 22, nombre: 'A2'},
    {_id: 23, nombre: 'A21'},
    {_id: 24, nombre: 'A3'},
])
```

Si no usamos numericOrdering

```
db.articulosSinColacion.find({_id: {$gte: 20}}).collation({locale: 'es'}).sort({nombre: 1})
```

{ _id: 20, nombre: 'A1' }
{ _id: 21, nombre: 'A11' }
{ _id: 22, nombre: 'A2' }
{ _id: 23, nombre: 'A21' }
{ _id: 24, nombre: 'A3' }

```
db.articulosSinColacion.find({_id: {$gte: 20}}).collation({locale: 'es', numericOrdering: true}).sort({nombre: 1})
```
{ _id: 20, nombre: 'A1' }
{ _id: 22, nombre: 'A2' }
{ _id: 24, nombre: 'A3' }
{ _id: 21, nombre: 'A11' }
{ _id: 23, nombre: 'A21' }