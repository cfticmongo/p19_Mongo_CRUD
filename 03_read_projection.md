# Proyección en los métodos de búsqueda

Sintaxis

```
db.<colección>.find(
    <doc-consulta>,
    {<campo>: 1 | 0, <campo>: 1 | 0, ...}
)
```

En el documento de proyección, que se pasa de manera opcional como 2º argumento, se especifica es campo retornado
con valor 1 y campo excluido con valor 0, con las siguientes particularidades:

- Solo se pueden especificar los que se devuelven (1) o lo que se excluyen (0)
- Solo en el caso del campo _id se puede incluir con signo contrario al resto
- Por defecto, el valor para _id será 1, con lo cual siempre se devolverá salvo que lo excluyamos específicamente con 0.
- Existen operadores para proyección que sustituyen a 1 | 0 para devolver campos en función de expresiones

## Devolución de los campos específicados y el campo _id

```
db.clientes3.find({},{nombre: 1})  // Devuelve todos los doc solamente con el campo nombre y el campo _id
```

## Devolución de los campos específicados y excluyendo el campo _id

```
db.clientes3.find({},{nombre: 1, apellidos: 1, _id: 0})  // Devuelve todos los doc con el campo nombre y el campo apellidos
```

## Exclusión de los campos específicados e incluyendo el campo _id

```
db.clientes3.find({},{nombre: 0})  // Devuelve todos los doc con todos los campos excepto el campo nombre
```

## Combinación de exclusión e inclusión de campos que no sean _id (error)

```
db.clientes3.find({},{nombre: 0, apellidos: 1}) // error
```

## Proyección de documentos embebidos
Notación del punto también en proyección

```
db.clientes4.find({},{nombre: 1, "direcciones.localidad": 1, _id: 0})
```

Devuelve
{ nombre: 'Juan',
  direcciones: [ { localidad: 'Vigo' }, { localidad: 'Madrid' } ] } // La estructura se mantiene
{ nombre: 'Lucía',
  direcciones: [ { localidad: 'Madrid' }, { localidad: 'Madrid' } ] }

## Proyecciones con operadores

Ver en resumen de operadores