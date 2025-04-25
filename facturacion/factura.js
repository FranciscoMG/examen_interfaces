var clientes = JSON.parse(localStorage.getItem("clientes")) || [];
var reservas = JSON.parse(localStorage.getItem("reservas")) || [];
var PRECIO_CABALLERO = 3045;
var PRECIO_DAMA = 4350;

$(document).ready(function () {
    cargarClientes();

    $("#facturaClienteSelect").on("change", function () {
        let cedulaSeleccionada = $(this).val();
        $("#facturaCedula").val(cedulaSeleccionada);
        cargarReservasCliente();
    });

    $("#generarFactura").on("click", function () {
        let clienteNombre = $("#facturaClienteSelect option:selected").text();
        let cedulaFactura = $("#facturaCedula").val();
        let reservaNumero = $("#facturaReservaSelect").val();

        if (clienteNombre === "" || cedulaFactura === "" || reservaNumero === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }

        let reserva = reservas.find(function (r) {
            return r.numero_reserva === reservaNumero;
        });

        if (!reserva) {
            alert("No se encontró la reserva con ese número.");
            return;
        }

        let totalFactura = 0;
        let totalIVA = 0;
        let detalleItems = "";

        $.each(reserva.detalles_personas, function (index, persona) {
            let precio = calcularPrecio(persona);
            totalFactura += precio;
            totalIVA += precio * 0.13;
            detalleItems += "<tr>" +
                "<td>" + (index + 1) + "</td>" +
                "<td>" + persona.condicion + "</td>" +
                "<td>" + persona.tipoCorte + "</td>" +
                "<td style='text-align: right;'>₡ " + precio.toFixed(2) + "</td>" +
                "</tr>";
        });

        let empresaHTML =
            "<h4 style='text-align: center;'><strong>La Liga Barber Shop</strong></h4><br/>" +
            "<p>Céd. Jurídica: 3101234567</p>" +
            "<p>Dirección: Frente al estadio Alejandro Morera Sotro, Alajuela, Alajuela, Costa Rica</p>" +
            "<p>Teléfono: 8888-4444</p>" +
            "<p>Email: contacto@ligabarbershop.cr</p><br/>" +
            "<p>Fecha: " + formatDate(new Date()) + "</p>" +
            "<p>Condición Venta: Contado</p>" +
            "<p>Empleado que atendió: " + reserva.atendido_por + "</p>";

        var datosClienteHTML =
            "<p>Cédula: " + cedulaFactura + "</p>" +
            "<p>Cliente: " + clienteNombre + "</p>";

        var datosReservaHTML =
            "<p>Número de Reserva: " + reserva.numero_reserva + "</p>" +
            "<p>Cantidad de Personas: " + reserva.cantidad_personas + "</p>" +
            "<p>Horario: " + reserva.horario_inicio + " - " + reserva.visualFinish + "</p>";

        var tablaDetalle =
            "<table class='table table-bordered'>" +
            "<thead>" +
            "<tr>" +
            "<th>#</th>" +
            "<th>Condición</th>" +
            "<th>Tipo de Corte</th>" +
            "<th>Monto</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" + detalleItems + "</tbody>" +
            "</table>";

        var facturaHTML =
            empresaHTML +
            "<br/>" +
            "<hr><h5 style='text-align: center;'>FACTURA VENTA</h5><hr>" +
            datosClienteHTML +
            datosReservaHTML +
            "<br/>" +
            tablaDetalle +
            "<br/>" +
            "<h5 style='text-align: right;'>Subtotal: ₡ " + totalFactura.toFixed(2) + "</h5>" +
            "<h5 style='text-align: right;'>IVA (13%): ₡ " + totalIVA.toFixed(2) + "</h5>" +
            "<h5 style='text-align: right;'>Total a Pagar: ₡ " + ((totalFactura + totalIVA).toFixed(0)) + "</h5>";
        $("#facturaContent").html(facturaHTML);

        new bootstrap.Modal(document.getElementById("modalFactura")).show();
    });

    $("#imprimirFactura").on("click", function () {
        var contenido = $("#facturaContent").html();
        var ventanaImprimir = window.open('', '', 'width=800,height=600');

        ventanaImprimir.document.write('<html><head><title>Factura</title>');
        ventanaImprimir.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
        ventanaImprimir.document.write('</head><body>');
        ventanaImprimir.document.write(contenido);
        ventanaImprimir.document.write('</body></html>');

        ventanaImprimir.document.close();
        ventanaImprimir.focus();
        ventanaImprimir.print();
        ventanaImprimir.close();
    });
});

function cargarClientes() {
    const listaClientes = $("#facturaClienteSelect");
    listaClientes.empty();
    listaClientes.append("<option value=''>Seleccione un cliente</option>");

    clientes.forEach(cliente => {
        listaClientes.append(`<option value="${cliente.cedula}">${cliente.nombre}</option>`);
    });
}

function cargarReservasCliente() {
    const listaReserva = $("#facturaReservaSelect");
    listaReserva.empty();
    listaReserva.append("<option value=''>Seleccione una reserva</option>");

    let clientName = $("#facturaClienteSelect option:selected").text();
    let reservasCliente = reservas.filter(function (r) {
        return r.nombre_cliente === clientName;
    });

    reservasCliente.forEach(reserva => {
        listaReserva.append(`<option value="${reserva.numero_reserva}">${reserva.numero_reserva} (${reserva.horario_inicio} - ${reserva.visualFinish})</option>`);
    });
}

function calcularPrecio(persona) {
    let precio = (persona.tipoCorte === "Caballero") ? PRECIO_CABALLERO : PRECIO_DAMA;
    if (persona.condicion === "Niños" || persona.condicion === "Adultos Mayores") {
        precio = precio / 2;
    }
    return precio;
}

function formatDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    var yyyy = date.getFullYear();
    var hh = String(date.getHours()).padStart(2, '0');
    var min = String(date.getMinutes()).padStart(2, '0');
    var ss = String(date.getSeconds()).padStart(2, '0');
    return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min + ':' + ss;
}