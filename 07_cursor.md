# Operaciones o métodos de cursor

## Método count() 
Devuelve un entero con el número de documentos del cursor

```
use gimnasio

db.clientes.find({nombre: 'Juan'}).count()
```

## Método skip()
Recibe como argumento un entero para saltar los n primeros documentos
del cursor


```
use gimnasio

db.clientes.find().skip(3)
```


## Método limit()
Recibe como argumento un entero para limitar los n primeros documentos
del cursor


```
use gimnasio

db.clientes.find().limit(4)
```

## Método sort()
Recibe un documento de ordenación con campos y opción 1 para
ascendente y opción -1 para descendente

```
use gimnasio

db.clientes.find().sort({apellidos: 1})
db.clientes.find().sort({apellidos: -1, nombre: 1})
```

Un uso comun podría ser:

```
db.clientes.find().sort({apellidos: -1, nombre: 1}).skip(0).limit(10)
...
db.clientes.find().sort({apellidos: -1, nombre: 1}).skip(10).limit(10)
...
db.clientes.find().sort({apellidos: -1, nombre: 1}).skip(20).limit(10)
...
```

## Método distinct

Sintaxis
db.<coleccion>.distinct(<campo>) // Distintos valores de un campo


```
db.clientes.distinct("apellidos")
```
[ 'González', 'López' ]