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
// clases contengan al menos esgrima y (AND lógico) padel


// Consultas simples de comparación en arrays

// Set de datos

use gimnasio

db.clientes3.insert([
    { nombre: 'Carlos', apellidos: 'Pérez', puntuaciones: [100, 120, 44] }, 
    { nombre: 'Sara', apellidos: 'López', puntuaciones: [60, 90, 70] },
])

db.clientes3.find({puntuaciones: {$gte: 50}}) // Devolver todos los doc en los que el campo puntuaciones
// tiene al menos un elemento que cumpla la expresión

// Consultas múltiples de comparación en arrays ¡Ojo certificación!

db.clientes3.find({puntuaciones: {$gte: 50, $lt: 75}}) // Devuelve todos los doc que en el campo puntuaciones
// tienen al menos un elemento que cumpla la expresión o la combinación de varios elementos que cumplan
// cada una de las condiciones

// Si lo que buscamos (que será una consulta más común) es que al menos un elemento cumpla
// todas las condiciones => operador $elemMatch: <expresion>

db.clientes3.find({puntuaciones: {$elemMatch: {$gte: 50, $lt: 75}}}) // Devuelve todos los doc en los que el
// campo puntuaciones tiene al menos un elemento que cumple todas las condiciones

// Consultas en posiciones exactas del array
// Usa también la notación del punto

db.monitoresGetafe.find({"clases.0": "padel"}) // Devuelve todos los doc que en el array clases su primer elemento
// sea padel

// Consultas en arrays de documentos

// Set de datos

db.clientes4.insert([
    {
        nombre: "Juan",
        apellidos: "García",
        direcciones: [
            {calle: "Alcalá 40", cp: "28001", localidad: "Vigo"},
            {calle: "Zamora, 13", cp: "34005", localidad: "Madrid"}
        ]
    },
    {
        nombre: "Lucía",
        apellidos: "Gómez",
        direcciones: [
            {calle: "Alcalá 60", cp: "28001", localidad: "Madrid"},
            {calle: "Fuencarral, 13", cp: "28002", localidad: "Madrid"}
        ]
    }
])

// Consulta de igualdad exacta en array de documentos

db.clientes4.find({
    direcciones: [
        {calle: "Alcalá 40", cp: "28001", localidad: "Vigo"},
        {calle: "Zamora, 13", cp: "34005", localidad: "Madrid"}
    ]
})

// Si cambiamos el orden ya no lo devolverá

db.clientes4.find({
    direcciones: [
        {calle: "Zamora, 13", cp: "34005", localidad: "Madrid"},
        {calle: "Alcalá 40", cp: "28001", localidad: "Vigo"}
    ]
})

// Consultas de igualdad en campos contenidos en subdocumentos de un array
// La notación del punto

db.clientes4.find({"direcciones.localidad": "Madrid"}) // Todos los documentos que en alguno (con independencia
// de su posición) de los documentos del campo direcciones tiene el campo localidad igual a Madrid

// Consultas de igualdad en campos contenidos en una posición concreta de un subdocumento
// La notación del punto con su índice

db.clientes4.find({"direcciones.0.localidad": "Madrid"}) // Todos los documentos en los que en el primer subdocumento (posición 0)
// del array de direcciones el campo localidad es igual a Madrid

// Consulta de múltiples condiciones en arrays de documentos ¡Ojo certificación!

// Set de datos


db.monitores.insert([
    {
        nombre: "Luis",
        apellidos: "López",
        actividades: [
            {clase: "aerobic", turno: "mañana", homologado: false},
            {clase: "aerobic", turno: "tarde", homologado: false},
            {clase: "zumba", turno: "mañana", homologado: true},
        ]
    },
    {
        nombre: "María",
        apellidos: "Pérez",
        actividades: [
            {clase: "aerobic", turno: "tarde", homologado: true},
            {clase: "zumba", turno: "tarde", homologado: false},
        ]
    },
    {
        nombre: "Carlos",
        apellidos: "Gónzalez",
        actividades: [
            {clase: "acquagym", turno: "tarde", homologado: true},
            {clase: "zumba", turno: "tarde", homologado: true},
        ]
    },
])


// De nuevo si no utilizamos $elemMatch las consultas múltiples se pueden satisfacer por una combinación
// de elemento del array


db.monitores.find({"actividades.clase":"aerobic", "actividades.homologado": true}) // Devuelve todos los docs que
// tengan al menos un subdoc en el campo actividades que cumpla que clase es aerobic y homologado es true o una
// combinación de subdoc que clase sea aerobic y en otro subdoc homologado sea true

// Para usar la consulta en el caso de uso de que al menos un elemento cumpla las dos condiciones como
// en el caso de arrays de elemento primitivos usaremos $elemMatch

db.monitores.find({actividades: {$elemMatch: {"clase":"aerobic", "homologado": true}}})

