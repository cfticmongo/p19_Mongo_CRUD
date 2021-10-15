// Operaciones de lectura de documentos

// Método find()

// Sintaxis
// db.<colección>.find(
//      <documento-de-consulta>,
//      <documento-de-proyección> //opcional    
// )

// Consulta de todos los documentos de una colección

db.empleados.find() // Nos devuelve todos los documentos en un cursor iterable (por defecto 20 docs en cada iteración)
db.empleados.find({}) // Con documento vacío es similar y se usará cuando añadamos proyección

// Set de datos en una base de datos gimnasio

use gimnasio
db.clientes.insert([
    {nombre: 'Pilar', apellidos: 'Pérez', edad: 33, dni: '07456322S'},
    {nombre: 'José', apellidos: 'Gómez', edad: 17, dni: '887654321S'},
    {nombre: 'José', apellidos: 'López', edad: 22, dni: '44321567S'},
])

// Casos de uso

// Consulta de condición de igualdad simple

db.clientes.find({nombre: 'José'}) // Devolverá todos los documentos que en el campo nombre tengan el valor 'José'
db.clientes.find({nombre: 'josé'}) // vacío porque es case-sensitive
db.clientes.find({nombre: 'Jose'}) // vacío porque es diacritic-sensitive

// En el caso del campo _id si utiliza el tipo ObjectId() en la consulta
// se ha de tipar el valor como tal

db.clientes.find({_id: ObjectId("6169be90c8e3006c7bfd5ac4")}) // Devuelve el doc
db.clientes.find({_id: "6169be90c8e3006c7bfd5ac4"}) // No devuelve el doc

// *En el caso de los drivers la mayoría de operaciones de búsqueda si permiten pasar solamente el hash

// Consulta de condición de igualdad múltiple
// Se incluyen todos los campos-valor en el documento de consulta y la coma, o comas, funcionará
// como un operador AND

db.clientes.find({nombre: 'José', apellidos: 'Gómez'})
db.clientes.find({apellidos: 'Gómez', nombre: 'José'}) // idem anterior, el orden de los campos no influye

// Las consultas disponen de un conjunto de operadores
// Sintaxis básica de operadores ($)
// { <campo>: {<$operador>: <valor>, ...}}

db.clientes.find({edad: {$gte: 18}}) // todos los docs en los que edad es mayor o igual a 18

// Consulta de condición múltiple con operador lógico $or
// {$or: [{consulta}, {consulta}, ...]}

db.clientes.find({$or: [
    {edad: {$gte: 18}},
    {apellidos: 'Gómez'}
]}) // Devolverá todos los doc que o edad es mayor o igual a 18 o apellidos es igual a Gómez

// Consulta de condición múltiple con operador lógico $or combinado con AND (,)    ¡Ojo certificación!

db.clientes.find({
    apellidos: 'Gómez',
    $or: [
        {edad: {$gte: 18}},
        {nombre: 'José'}
    ]
}) // Devolverá los docs que apellidos sea igual a Gómez y o edad es mayor o igual a 18 o nombre es igual a José

// Alternativa al AND implícito con coma (,) con el operador $and

db.clientes.find({
    $and: [
        {edad: {$gte: 18}},
        {apellidos: 'López'}
    ]
}) // Idem a usar coma implícita pero mas semántico

// Nuevo set de datos

db.monitores.insert([
    {
        nombre: 'Celia',
        apellidos: 'Sánchez',
        domicilio: {
            calle: 'Gran Vía, 90',
            cp: '28003',
            localidad: 'Madrid'
        }
    },
    {
        nombre: 'Carlos',
        apellidos: 'Pérez',
        domicilio: {
            calle: 'Alcalá, 200',
            cp: '28010',
            localidad: 'Madrid'
        }
    },
    {
        nombre: 'Inés',
        apellidos: 'Pérez',
        domicilio: {
            calle: 'Burgos, 10',
            cp: '28900',
            localidad: 'Alcorcón'
        }
    },
])

// Consulta de igualdad exacta en campo de documento embebido

db.monitores.find({domicilio: {calle: 'Burgos, 10', cp: '28900', localidad: 'Alcorcón'}})
// si pasamos valor y es un subdocumento debe ser exactamente igual
db.monitores.find({domicilio: {calle: 'Burgos, 10', localidad: 'Alcorcón', cp: '28900'}}) // NOOOO
// permite cambiar el orden de los campos

// Consulta de igualdad en campos de documento embebido
// Emplea la notación del punto

db.monitores.find({"domicilio.localidad": "Madrid"}) // Importante entrecomillar la notación del punto
db.monitores.find({"domicilio.localidad": "Madrid", "domicilio.cp": "28010"})

// Nuevo set de datos

db.monitoresGetafe.insert([
    {nombre: 'Juan', apellidos: 'Pérez', clases: ['padel','esgrima','pesas']},
    {nombre: 'Sara', apellidos: 'Fernández', clases: ['padel','esgrima']},
    {nombre: 'Carlos', apellidos: 'Pérez', clases: ['esgrima','padel']},
    {nombre: 'Juan', apellidos: 'González', clases: ['aerobic','pesas']},
])

// Consulta de igualdad exacta en campo con array

db.monitoresGetafe.find({clases: ['padel','esgrima']}) // En este caso el valor tiene que ser exacto

// Consulta de un elemento en campo con array

db.monitoresGetafe.find({clases: 'esgrima'}) // Devolver todos los doc que contengan el elemento esgrima en el array clases

// Consulta de varios elementos en campo con array

db.monitoresGetafe.find({
    $and: [
        {clases: 'esgrima'},
        {clases: 'pesas'}
    ]
})
db.monitoresGetafe.find({
    $or: [
        {clases: 'esgrima'},
        {clases: 'pesas'}
    ]
})

// Consulta de varios elementos en campo con array (Recomendado por Mongo)
// Con operador $all

db.monitoresGetafe.find({clases: {$all: ['esgrima','padel']}}) // Devolverá todos los docs que en su campo
// clases contengan al menos esgrima y padel
