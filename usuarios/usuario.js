var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

$(document).ready(async function () {
    cargarTablaUsuarios();

    $("#guardarUsuario").on("click", function () {
        const cedula = $("#newCedula").val().trim();
        const nombre = $("#newNombre").val().trim();
        const direccion = $("#newDireccion").val().trim();
        const telefono = $("#newTelefono").val().trim();
        const correo = $("#newCorreo").val().trim();
        const contrasena = $("#newContrasena").val().trim();
        const comision = $("#newComision").val().trim();

        if (!cedula || !nombre || !direccion || !telefono || !correo || !contrasena || !comision) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (usuarios.some(usuario => usuario.cedula === cedula)) {
            alert("Ya existe un usuario con esta cédula.");
            return;
        }

        const nuevoUsuario = {
            cedula,
            nombre,
            direccion,
            telefono,
            correo,
            contrasena,
            comision: parseFloat(comision)
        };
        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        cargarTablaUsuarios();
        $("#modalAgregarUsuario").modal("hide");
        $("#formAgregarUsuario")[0].reset();
    });

    $("#guardarCambiosUsuario").on("click", function () {
        const index = $(this).data("index");

        const cedula = $("#editCedula").val().trim();
        const nombre = $("#editNombre").val().trim();
        const direccion = $("#editDireccion").val().trim();
        const telefono = $("#editTelefono").val().trim();
        const correo = $("#editCorreo").val().trim();
        const contrasena = $("#editContrasena").val().trim();
        const comision = $("#editComision").val().trim();

        if (!cedula || !nombre || !direccion || !telefono || !correo || !contrasena || !comision) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const usuarioModificado = {
            cedula,
            nombre,
            direccion,
            telefono,
            correo,
            contrasena,
            comision: parseFloat(comision)
        };
        usuarios[index] = usuarioModificado;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        cargarTablaUsuarios();
        $("#modalModificarUsuario").modal("hide");
    });

    $(document).on("click", "#usuario-mod", function () {
        const index = $(this).data("index");
        const usuario = usuarios[index];

        $("#editCedula").val(usuario.cedula);
        $("#editNombre").val(usuario.nombre);
        $("#editDireccion").val(usuario.direccion);
        $("#editTelefono").val(usuario.telefono);
        $("#editCorreo").val(usuario.correo);
        $("#editComision").val(usuario.comision);
        $("#editContrasena").val(usuario.contrasena);
        $("#guardarCambiosUsuario").data("index", index);
    });

    $(document).on("click", "#usuario-del", function () {
        const index = $(this).data("index");
        const usuario = usuarios[index];

        if (confirm(`¿Seguro que deseas eliminar al usuario con cédula ${usuario.cedula}?`)) {
            usuarios.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            cargarTablaUsuarios();
        }
    });
});

function cargarTablaUsuarios() {
    let filas = "";
    usuarios.forEach((usuario, index) => {
        filas += `
            <tr>
                <td>${usuario.cedula}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.direccion}</td>
                <td>${usuario.telefono}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.comision}</td>
        `;
        if (usuario.cedula !== "123456789") {
            filas += `      
                <td>
                    <button id="usuario-mod" class="btn btn-info btn-sm" data-index="${index}" data-bs-toggle="modal" data-bs-target="#modalModificarUsuario">✏️</button>
                    <button id="usuario-del" class="btn btn-danger btn-sm" data-index="${index}">🗑️</button>
                </td>
            `;
        } else {
            filas += `
                <td></td>
            `;
        }
        filas += `
            </tr>
        `;
    });

    $("#tabla-usuarios").html(filas);
}