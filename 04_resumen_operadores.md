# Resumen operadores para operaciones Read

## Operadores de comparación

$gte $gt $lte $lt ver ejemplos anteriores

### Type bracketing ¡Ojo certificación!

Cuando una consulta emplea operadores de comparación, solo devuelve los valores que coincidan con el
tipo de dato especificado.

Set de datos

```
db.foo.insert([
    {a: 'a'},
    {a: 'A'},
    {a: 'C'},
    {a: 2},
    {a: 1},
    {a: 0.45},
    {a: -1},
    {a: 11},
    {a: '2'},
    {a: '1'},
    {a: '-1'},
    {a: '11'},
])
```

```
db.foo.find({a: {$gte: 2}}) // Solo devolverá los que cumplan la condición y sean de tipo numérico
```

{ _id: ObjectId("61782a0b69cb92384b2e4463"), a: 2 }
{ _id: ObjectId("61782a0b69cb92384b2e4467"), a: 11 }

```
db.foo.find({a: {$gte: 'A'}}) // Solo devolverá los que cumplan la condición y sean de tipo string
```

$eq
$eq: <valor>


```
db.clientes.find({dni: {$eq: '6583476584T'}}) // Idem asignación JSON/JS se suele emplear en aggregation
```

$in ¡Ojo certificación!
$in: [<valor>, <valor>, ...]

Busca en los campos los valores incluidos en su array como un OR inclusivo. Es decir devolverá cualquier documento
que en el campo tenga alguno de los valores.

```
db.clientes.find({nombre: {$in: ["Juan","Raquel"]}})  // Devolver los docs en los que nombre sea Juan o Raquel
```

También se puede usar sobre campos que contengan arrays

```
db.monitoresGetafe.find({clases: {$in: ["pesas","esgrima"]}}) // Devuelve los docs que contengan en su array clases el valor
// esgrima o el valor pesas o ambos
``` 

$ne
$ne: valor

```
db.clientes.find({apellidos: {$ne: 'López'}}) // Devuelve los docs en los que apellidos es distinto de López
```

Expresiones regulares (aunque no son operadores propiamente dichos nos permiten implementar patrones de búsqueda)

```
db.clientes.find({nombre: /^S/}) // Devuelve los docs en los que nombre comienza por S mayúscula
```

## Operadores lógicos

$and y $or (ver anterior)

$not
$not: [<expresión>,<expresión>]

```
db.clientes.find({
    $nor: [
        {edad: {$lt: 18}},
        {nombre: 'Raquel'}
    ]
})
```
Devuelve los que no son menores de 18 y los que no se llaman Raquel

Se pueden utilizar para encontrar un set de datos que no tienen un conjunto de valores

```
db.clientes.find({
    $nor: [
        {nombre: "Pilar"},
        {nombre: "Juan"},
        {nombre: "Raquel"}
    ]
})
```

Devuelve los que no se llamen ni Pilar ni Juan ni Raquel

## Operadores de evaluación

$type (ver anterior)

$exists
$exists: <true | false>

```
db.clientes.find({edad: {$exists: false}}) // Devolverá los docs que no tengan el campo edad
```

$regex ¡Ojo certificación!
{$regex: <expresión-regular>, $options: <opciones>}

Set datos
```
db.clientes6.insert([
    {nombre: 'Luis', apellidos: 'García Pérez'},
    {nombre: 'Pedro', apellidos: 'Gutiérrez López'},
    {nombre: 'Sara', apellidos: 'López Gómez'},
    {nombre: 'María', apellidos: 'Pérez Góngora'},
    {nombre: 'Juan', apellidos: 'Pérez \nGóngora'},
])
```

```
db.clientes6.find({apellidos: {$regex: /G/}}) // Expresión regular que contenga una G mayúscula

db.clientes6.find({apellidos: {$regex: 'G'}}) // La expresión regular se puede pasar como string

db.clientes6.find({apellidos: {$regex: '^G'}}) // Todos los doc que apellidos comience por G mayúscula

db.clientes6.find({apellidos: {$regex: 'ez$'}}) // Todos los doc que apellidos finalice en ez 

db.clientes6.find({apellidos: {$regex: 'Gón'}}) // Todos los que contienen el fragmento Gón (acentuado)

db.clientes6.find({apellidos: {$regex: '^gu', $options: 'i'}}) // Case insensitives

db.clientes6.find({apellidos: {$regex: '^G', $options: 'm'}}) // reconocer los saltos de líneas

db.clientes6.find({apellidos: {$regex: 'Gó m', $options: 'x'}}) // omite los espacios en blanco

db.clientes6.find({apellidos: {$regex: 'gó m', $options: 'ix'}}) // Se pueden unir opciones
```

$regex no dispone de opción para diacritic insensitive.

$comment
$comment: <string>

Permite incorporar comentarios en las operaciones

```
db.clientes6.find({apellidos: {$regex: 'gó m', $options: 'ix'}, $comment: 'Lorem ipsum...'})
```

## Operadores de array

$all, $elemMatch, $size (buscar por número de elementos de un array)


## Operadores de proyección

$ (en proyección)
db.<colección>.find({<array>: <valor>},{"<array>.$": 1})
Definir en el documento de proyección los elementos a devolver de un array
en función de una expresión del documento de consulta
(Solo devuelve el primer elemento que cumpla la condición)

Set datos

```
use videogames

db.results.insert([
    {player: 'Pepe', game: 'Tetris', points: [79,102,89,101]},
    {player: 'Laura', game: 'Tetris', points: [120,99,100,120]}
])
```

```
db.results.find(
    {game: 'Tetris', points: {$gte: 100}},
    {_id: 0, game: 1, "points.$": 1} // hace referencia a la expresión de la consulta
)
```

{ game: 'Tetris', points: [ 102 ] } // Devuelve en el campo points el primer elemento que cumple la condición de la consulta
{ game: 'Tetris', points: [ 120 ] }

Posible pregunta

a) {points: [102,101], game: 'Tetris'} 
   {points: [120,100,120], game: 'Tetris'} 

b) {points: [102,101]} 
   {points: [120,100,120]} 

c) {points: [102]} 
   {points: [120]} 

d) {points: [102], game: 'Tetris'} // correcta
   {points: [120], game: 'Tetris'} 

e) {game: 'Tetris'}
   {game: 'Tetris'}

$elemMatch en proyección
Ídem al anterior pero permite utilizar este tipo de proyecciones en campos de array de documentos

Set de datos

```
db.games.insert([
    {
        game: 'Tetris',
        players: [
            {name: 'pepe', maxScore: 98},
            {name: 'luisa', maxScore: 110},
            {name: 'John', maxScore: 105},
        ]
    },
    {
        game: 'Mario Bros',
        players: [
            {name: 'pepe', maxScore: 70},
            {name: 'luisa', maxScore: 98},
            {name: 'John', maxScore: 110},
        ]
    }
])
```

```
db.games.find(
    {game: 'Tetris'},
    {_id: 0, players: {$elemMatch:{maxScore: {$gte: 100}}}} // Devuelve los docs en los que game es Tetris y de ellos
)                                                       // el campo players con el primer subdocumento que cumpla la
                                                        // expresión pasada a $elemMatch
```
{ players: [ { name: 'luisa', maxScore: 110 } ] }


Posible pregunta

a) { players: [             
        {name: 'luisa', maxScore: 110},
        {name: 'John', maxScore: 105} 
    ] }

b) { players: [             
        {name: 'luisa', maxScore: 110},
        {name: 'John', maxScore: 105} 
    ] }
    {   players: [
            {name: 'John', maxScore: 110},
        ]
    }

c) { players: [             
        {name: 'luisa', maxScore: 110},
    ] }
    {   players: [
            {name: 'John', maxScore: 110},
        ]
    }

d) { players: [             
        {name: 'luisa', maxScore: 110}, //  Correcta
    ] }

$slice en proyeccion
db.<coleccion>.find({<consulta>},{<array>: {$slice: <valor>}})

```
db.results.find({},{_id: 0, points: {$slice: 3}}) // devuelve los 3 primeros elementos
db.results.find({},{_id: 0, points: {$slice: -2}}) devuelve los 2 ultimos
db.results.find({},{_id: 0, points: {$slice: [1, 2]}}) devuelve desde la posicion 1 los 2 siguientes elementos
```


