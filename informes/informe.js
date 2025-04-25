var reservas = JSON.parse(localStorage.getItem("reservas")) || [];
var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

$(document).ready(function () {
    $("#generarInforme").on("click", function () {
        let informeSeleccionado = $("#informeSelect").val();
        if (informeSeleccionado === "") {
            alert("Por favor, seleccione un informe.");
            return;
        }

        let html = "";
        if (informeSeleccionado === "personas") {
            html = generarInformePersonas();
        } else if (informeSeleccionado === "dinero") {
            html = generarInformeDinero();
        } else if (informeSeleccionado === "horarios") {
            html = generarInformeHorarios();
        }

        $("#informeContent").html(html);

        new bootstrap.Modal(document.getElementById("modalInforme")).show();
    });
});

function generarInformePersonas() {
    if (reservas.length === 0) {
        return "<p>No hay reservas registradas para generar informes.</p>";
    }

    let employees = {};
    reservas.forEach(function (reserva) {
        let emp = reserva.atendido_por;
        if (!employees[emp]) {
            employees[emp] = {
                hombres: { "Niños": 0, "Adultos": 0, "Adultos Mayores": 0, total: 0 },
                mujeres: { "Niños": 0, "Adultos": 0, "Adultos Mayores": 0, total: 0 },
                totalPersonas: 0
            };
        }
        reserva.detalles_personas.forEach(function (persona) {
            let gender = (persona.tipoCorte === "Caballero") ? "hombres" : "mujeres";
            employees[emp][gender][persona.condicion] += 1;
            employees[emp][gender].total += 1;
            employees[emp].totalPersonas += 1;
        });
    });

    let html = "<h4 class='text-center'>Informe de Personas Atendidas</h4>";
    for (let emp in employees) {
        html += "<br/>";
        html += "<h5>Empleado: " + emp + "</h5>";
        html += "<table class='table table-striped'>";
        html += "<thead><tr><th>Género</th><th>Niños</th><th>Adultos</th><th>Adultos Mayores</th><th>Total</th></tr></thead>";
        html += "<tbody>";
        html += "<tr><td>Hombres</td><td>" + employees[emp].hombres["Niños"] + "</td><td>" + employees[emp].hombres["Adultos"] + "</td><td>" + employees[emp].hombres["Adultos Mayores"] + "</td><td>" + employees[emp].hombres.total + "</td></tr>";
        html += "<tr><td>Mujeres</td><td>" + employees[emp].mujeres["Niños"] + "</td><td>" + employees[emp].mujeres["Adultos"] + "</td><td>" + employees[emp].mujeres["Adultos Mayores"] + "</td><td>" + employees[emp].mujeres.total + "</td></tr>";
        html += "</tbody></table>";
        html += "<p><strong>Total personas atendidas:</strong> " + employees[emp].totalPersonas + "</p>";
    }
    return html;
}

function generarInformeDinero() {
    if (reservas.length === 0) {
        return "<p>No hay reservas registradas para generar informes.</p>";
    }

    function calcularPrecio(persona) {
        let precio = (persona.tipoCorte === "Caballero") ? 3500 : 5000;
        if (persona.condicion === "Niños" || persona.condicion === "Adultos Mayores") {
            precio = precio / 2;
        }

        return precio;
    }

    let globalRevenue = { "Niños": 0, "Adultos": 0, "Adultos Mayores": 0, total: 0 };
    let employees = {};

    reservas.forEach(function (reserva) {
        let emp = reserva.atendido_por;
        if (!employees[emp]) {
            employees[emp] = { revenue: { "Niños": 0, "Adultos": 0, "Adultos Mayores": 0, total: 0 } };
        }
        reserva.detalles_personas.forEach(function (persona) {
            let precio = calcularPrecio(persona);
            employees[emp].revenue[persona.condicion] += precio;
            employees[emp].revenue.total += precio;
            globalRevenue[persona.condicion] += precio;
            globalRevenue.total += precio;
        });
    });

    let html = "<h4 class='text-center'>Informe de Dinero Generado</h4>";
    html += "<h5>Global:</h5>";
    html += "<ul>";
    html += "<li>Niños: ₡ " + globalRevenue["Niños"].toFixed(2) + "</li>";
    html += "<li>Adultos: ₡ " + globalRevenue["Adultos"].toFixed(2) + "</li>";
    html += "<li>Adultos Mayores: ₡ " + globalRevenue["Adultos Mayores"].toFixed(2) + "</li>";
    html += "<li>Total: ₡ " + globalRevenue.total.toFixed(2) + "</li>";
    html += "</ul>";
    html += "<hr />";

    html += "<h5>Por Empleado:</h5>";
    for (let emp in employees) {
        html += "<h6><strong>" + emp + "</strong></h6>";
        html += "<ul>";
        html += "<li>Niños: ₡ " + employees[emp].revenue["Niños"].toFixed(2) + "</li>";
        html += "<li>Adultos: ₡ " + employees[emp].revenue["Adultos"].toFixed(2) + "</li>";
        html += "<li>Adultos Mayores: ₡ " + employees[emp].revenue["Adultos Mayores"].toFixed(2) + "</li>";
        html += "<li>Total: ₡ " + employees[emp].revenue.total.toFixed(2) + "</li>";

        let usuario = usuarios.find(function (u) {
            return u.id == emp || u.nombre == emp || u.cedula == emp;
        });

        let commissionPercent = usuario && usuario.comision ? usuario.comision : 0;
        let commissionValue = employees[emp].revenue.total * (commissionPercent / 100);
        html += "<li>Comisión (" + commissionPercent + "%): ₡ " + commissionValue.toFixed(2) + "</li>";
        html += "</ul>";
    }

    return html;
}

function generarInformeHorarios() {
    if (reservas.length === 0) {
        return "<p>No hay reservas registradas para generar informes.</p>";
    }

    let horarioDisponible = [];
    for (let hour = 8; hour < 18; hour++) {
        let hStr = hour.toString().padStart(2, "0");
        horarioDisponible.push(hStr + ":00");
        horarioDisponible.push(hStr + ":30");
    }

    let occupancy = {};
    horarioDisponible.forEach(function (intervalo) {
        occupancy[intervalo] = 0;
    });

    reservas.forEach(function (reserva) {
        if (occupancy.hasOwnProperty(reserva.horario_inicio)) {
            occupancy[reserva.horario_inicio] += reserva.cantidad_personas;
        }
        if (reserva.blockedInterval) {
            if (occupancy.hasOwnProperty(reserva.blockedInterval)) {
                occupancy[reserva.blockedInterval] += reserva.damasCount;
            }
        }
    });

    let maxInterval = null, maxCount = -1;
    let minInterval = null, minCount = Infinity;
    for (let key in occupancy) {
        let count = occupancy[key];
        if (count > maxCount) { maxCount = count; maxInterval = key; }
        if (count < minCount) { minCount = count; minInterval = key; }
    }

    let html = "<h4 class='text-center'>Informe de Horarios de Afluencia</h4>";
    html += "<br/ >";
    html += "<p><strong>Horario con mayor afluencia:</strong> " + maxInterval + " (" + maxCount + " personas)</p>";
    html += "<p><strong>Horario con menor afluencia:</strong> " + minInterval + " (" + minCount + " personas)</p>";
    return html;
}