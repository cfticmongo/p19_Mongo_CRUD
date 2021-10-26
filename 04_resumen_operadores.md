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

