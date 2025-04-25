export const usuario = [
    {
        "cedula": "123456789",
        "nombre": "Admin",
        "direccion": "Costa Rica",
        "telefono": "8888-4444",
        "correo": "admin@ligabarbershop.cr",
        "contrasena": "root",
        "comision": 0.0
    }
];

export const clientesNuevos = [
    {
        "cedula": "123456789",
        "nombre": "Carlos Rodríguez",
        "direccion": "Avenida Central, San José",
        "telefono": "8888-8888",
        "correo": "c.rodriguez85@gmail.com",
        "sexo": "Masculino",
        "fecha_nacimiento": "1985-07-20"
    },
    {
        "cedula": "987654321",
        "nombre": "Ana Méndez",
        "direccion": "Calle Secundaria, Cartago",
        "telefono": "7777-7777",
        "correo": "ana.men1982@hotmail.com",
        "sexo": "Femenino",
        "fecha_nacimiento": "1982-03-10"
    },
    {
        "cedula": "456789123",
        "nombre": "Roberto Sánchez",
        "direccion": "Urbanización Bella Vista, Heredia",
        "telefono": "6666-6666",
        "correo": "rsanchez45@outlook.com",
        "sexo": "Masculino",
        "fecha_nacimiento": "1945-11-25"
    },
    {
        "cedula": "321654987",
        "nombre": "María Fernández",
        "direccion": "Barrio Los Ángeles, Alajuela",
        "telefono": "5555-5555",
        "correo": "mariaf1948@gmail.com",
        "sexo": "Femenino",
        "fecha_nacimiento": "1948-09-15"
    },
    {
        "cedula": "741852963",
        "nombre": "Lucas Gutiérrez",
        "direccion": "Barrio del Sol, Puntarenas",
        "telefono": "4444-4444",
        "correo": "lucas.gut15@hotmail.com",
        "sexo": "Masculino",
        "fecha_nacimiento": "2015-06-22"
    },
    {
        "cedula": "369258147",
        "nombre": "Sofía Ramírez",
        "direccion": "Zona Norte, Limón",
        "telefono": "3333-3333",
        "correo": "sofia_ramirez16@outlook.com",
        "sexo": "Femenino",
        "fecha_nacimiento": "2016-08-30"
    },
    {
        "cedula": "258147369",
        "nombre": "Fernando Castillo",
        "direccion": "Centro Histórico, Cartago",
        "telefono": "2222-2222",
        "correo": "fer.castillo78@gmail.com",
        "sexo": "Masculino",
        "fecha_nacimiento": "1978-05-12"
    },
    {
        "cedula": "147258369",
        "nombre": "Isabel Morales",
        "direccion": "Residencial Vista Hermosa, Heredia",
        "telefono": "1111-1111",
        "correo": "isa.mora75@hotmail.com",
        "sexo": "Femenino",
        "fecha_nacimiento": "1975-12-05"
    }
];

export var usuarioLogueado = null;
export function setUsuarioLogueado(usuario) {
    usuarioLogueado = usuario;
}