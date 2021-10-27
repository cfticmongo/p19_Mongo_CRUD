# Operaciones de eliminación de documentos

## Método remove()

Sintaxis
db.<coleccion>.remove(
    {<doc-consulta>}, misma sintaxis que en find(), update(), etc 
    {justOne: <boolean>} // true valor por defecto solo elimina la primera coincidencia 
)

## Método deleteOne()

Sintaxis
db.<coleccion>.deleteOne(
    {<doc-consulta>}, misma sintaxis que en find(), update(), etc 
)

## Método deleteMany()

Sintaxis
db.<coleccion>.deleteMany(
    {<doc-consulta>}, misma sintaxis que en find(), update(), etc 
)

```
db.libros.deleteMany({autor: /^John/})  // Elimina todos los docs en los que el campo autor comienza por John
```

{ acknowledged: true, deletedCount: 3 }