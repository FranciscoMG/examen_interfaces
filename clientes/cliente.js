var clientes = JSON.parse(localStorage.getItem("clientes")) || [];

$(document).ready(async function () {
    cargarTablaClientes();

    $("#guardarCliente").on("click", function () {
        const cedula = $("#newCedula").val().trim();
        const nombre = $("#newNombre").val().trim();
        const direccion = $("#newDireccion").val().trim();
        const telefono = $("#newTelefono").val().trim();
        const correo = $("#newCorreo").val().trim();

        if (!cedula || !nombre || !direccion || !telefono || !correo) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (clientes.some(cliente => cliente.cedula === cedula)) {
            alert("Ya existe un cliente con esta cédula.");
            return;
        }

        const nuevoCliente = {
            cedula,
            nombre,
            direccion,
            telefono,
            correo
        };
        clientes.push(nuevoCliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));

        cargarTablaClientes(clientes);
        $("#modalAgregarCliente").modal("hide");
        $("#formAgregarCliente")[0].reset();
    });

    $("#guardarCambiosCliente").on("click", function () {
        const index = $(this).data("index");

        const cedula = $("#editCedula").val().trim();
        const nombre = $("#editNombre").val().trim();
        const direccion = $("#editDireccion").val().trim();
        const telefono = $("#editTelefono").val().trim();
        const correo = $("#editCorreo").val().trim();

        if (!cedula || !nombre || !direccion || !telefono || !correo) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const clienteModificado = {
            cedula,
            nombre,
            direccion,
            telefono,
            correo
        };
        clientes[index] = clienteModificado;
        localStorage.setItem("clientes", JSON.stringify(clientes));

        cargarTablaClientes(clientes);
        $("#modalModificarCliente").modal("hide");
    });

    $(document).on("click", "#cliente-mod", function () {
        const index = $(this).data("index");
        const cliente = clientes[index];

        $("#editCedula").val(cliente.cedula);
        $("#editNombre").val(cliente.nombre);
        $("#editDireccion").val(cliente.direccion);
        $("#editTelefono").val(cliente.telefono);
        $("#editCorreo").val(cliente.correo);
        $("#guardarCambiosCliente").data("index", index);
    });

    $(document).on("click", "#cliente-del", function () {
        const index = $(this).data("index");
        const cliente = clientes[index];

        if (confirm(`¿Seguro que deseas eliminar al cliente con cédula ${cliente.cedula}?`)) {
            clientes.splice(index, 1);
            localStorage.setItem("clientes", JSON.stringify(clientes));

            cargarTablaClientes();
        }
    });
});

function cargarTablaClientes() {
    let filas = "";
    clientes.forEach((cliente, index) => {
        filas += `
            <tr>
                <td>${cliente.cedula}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.direccion}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.correo}</td>
                <td>
                    <button id="cliente-mod" class="btn btn-info btn-sm" data-index="${index}" data-bs-toggle="modal" data-bs-target="#modalModificarCliente">✏️</button>
                    <button id="cliente-del" class="btn btn-danger btn-sm" data-index="${index}">🗑️</button>
                </td>
        `;
    });

    $("#tabla-clientes").html(filas);
}