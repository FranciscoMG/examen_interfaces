import { usuario, clientesNuevos, setUsuarioLogueado } from "../variables_app.js";

class Autenticacion {
    constructor() {
        this.usuarios = [];
    }

    async cargarInicial() {
        try {
            this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            if (this.usuarios.length === 0) {
                localStorage.setItem("usuarios", JSON.stringify(usuario));
            }

            if (JSON.parse(localStorage.getItem("clientes")) || [].length === 0) {
                try {
                    localStorage.setItem("clientes", JSON.stringify(clientesNuevos));
                } catch (error) {
                    alert("Ocurrió un error al cargar los clientes. Por favor, inténtelo de nuevo más tarde.");
                }
            }
        } catch (error) {
            alert("Ocurrió un error al cargar los datos de inicio. Por favor, inténtelo de nuevo más tarde.");
        }
    }

    validarLogin(cedula, contrasena) {
        const usuarioEncontrado = this.usuarios.find(u => u.cedula === cedula);

        if (!usuarioEncontrado || usuarioEncontrado.contrasena !== contrasena) {
            return { exito: false, mensaje: "Cédula o contraseña incorrecta" };
        }

        return { exito: true, usuario: usuarioEncontrado };
    }
}

$(document).ready(async function () {
    const auth = new Autenticacion();
    await auth.cargarInicial();

    $("form").on("submit", function (event) {
        event.preventDefault();

        const cedula = $("#usuario").val();
        const contrasena = $("#contrasena").val();
        const resultado = auth.validarLogin(cedula, contrasena);

        if (resultado.exito) {
            setUsuarioLogueado(resultado.usuario);
            $("#menuUsuario, #menuCliente, #menuReserva, #menuFactura, #menuInforme, #usuarioActual").show();
            $("#usuarioActual button").text("👤 " + resultado.usuario.nombre + " • Salir");
            $("#page-content").load("reservas/reserva.html");
        } else {
            alert(resultado.mensaje);
        }
    });

    $("#usuarioActual button").on("click", function () {
        setUsuarioLogueado(null);
        $("#menuUsuario, #menuCliente, #menuReserva, #menuFactura, #menuInforme, #usuarioActual").hide();
        $("#page-content").load("usuarios/login.html");
    });
});