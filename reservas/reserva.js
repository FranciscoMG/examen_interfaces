var reservas = JSON.parse(localStorage.getItem("reservas")) || [];
var clientes = JSON.parse(localStorage.getItem("clientes")) || [];
var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
var horarioDisponible = (() => {
    let horarios = [];
    for (let hour = 8; hour < 18; hour++) {
        let hStr = hour.toString().padStart(2, "0");
        horarios.push(`${hStr}:00`);
        horarios.push(`${hStr}:30`);
    }
    return horarios;
})();

$(document).ready(function () {
    cargarClientes();
    cargarUsuarios();
    actualizarHorariosDisponibles();
    cargarTablaReservas();

    $("#cantidadPersonas").on("input", function () {
        const cantidad = parseInt($(this).val());
        const contenedor = $("#personasContainer");
        contenedor.empty();

        for (let i = 1; i <= cantidad; i++) {
            contenedor.append(`
                <div class="mb-3">
                    <label class="form-label">Persona ${i}</label>
                    <select class="form-control condicionPersona" data-index="${i}" required>
                        <option value="Niños">Niños</option>
                        <option value="Adultos">Adultos</option>
                        <option value="Adultos Mayores">Adultos Mayores</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Tipo de Corte para Persona ${i}</label>
                    <select class="form-control tipoCorte" data-index="${i}" required>
                        <option value="Caballero">Caballero (30 min)</option>
                        <option value="Dama">Dama (1 hora)</option>
                    </select>
                </div>
            `);
        }
    });

    $("#guardarReserva").on("click", function () {
        const cedulaSeleccionada = $("#listaClientes").val();
        const cliente = clientes.find(c => c.cedula === cedulaSeleccionada);
        const usuarioAtiende = $("#listaUsuarios").val();
    
        if (!cliente) {
          alert("Cliente no encontrado.");
          return;
        }
        if (!usuarioAtiende) {
          alert("Debe seleccionar un usuario que atenderá la reserva.");
          return;
        }
    
        let listaPersonas = [];
        $(".condicionPersona").each(function (index) {
          const condicion = $(this).val();
          const tipoCorte = $(".tipoCorte").eq(index).val();
          listaPersonas.push({ condicion, tipoCorte });
        });
        if (listaPersonas.length === 0) {
          alert("Debe haber al menos una persona en la reserva.");
          return;
        }
    
        let nuevasDamas = listaPersonas.filter(p => p.tipoCorte === "Dama").length;
        let nuevosCaballeros = listaPersonas.filter(p => p.tipoCorte === "Caballero").length;
        let totalNuevos = nuevosCaballeros + nuevasDamas;
    
        const startInterval = $("#horarioReserva").val();
        const nextInterval = getNextInterval(startInterval);
        if (nuevasDamas > 0 && !nextInterval) {
          alert("No hay un siguiente intervalo disponible para cortes de Dama.");
          return;
        }
        const blockedInterval = (nuevasDamas > 0) ? nextInterval : startInterval;
        const visualFinish = (nuevasDamas > 0) ? getNextInterval(getNextInterval(startInterval)) : getNextInterval(startInterval);
        if (nuevasDamas > 0 && !visualFinish) {
          alert("No hay disponibilidad para mostrar la hora de fin de la reserva.");
          return;
        }
    
        let occupancyStart = 0;
        reservas.forEach(reserva => {
          if (reserva.horario_inicio === startInterval) {
            occupancyStart += reserva.cantidad_personas;
          }
          if (reserva.blockedInterval === startInterval) {
            occupancyStart += reserva.damasCount;
          }
        });
        if (occupancyStart + totalNuevos > 3) {
          alert("No hay espacio disponible en el intervalo de " + startInterval);
          return;
        }
    
        if (nuevasDamas > 0) {
          let occupancyBlocked = 0;
          reservas.forEach(reserva => {
            if (reserva.blockedInterval === blockedInterval) {
              occupancyBlocked += reserva.damasCount;
            }
          });
          if (occupancyBlocked + nuevasDamas > 3) {
            alert("No hay espacio disponible en el intervalo de " + blockedInterval);
            return;
          }
        }
    
        const nuevaReserva = {
          numero_reserva: `R${String(reservas.length + 1).padStart(3, "0")}`,
          nombre_cliente: cliente.nombre,
          cantidad_personas: totalNuevos,
          detalles_personas: listaPersonas,
          horario_inicio: startInterval,
          visualFinish: visualFinish,
          blockedInterval: blockedInterval,
          damasCount: nuevasDamas,
          atendido_por: usuarioAtiende
        };
    
        reservas.push(nuevaReserva);
        localStorage.setItem("reservas", JSON.stringify(reservas));
    
        alert(`Reserva confirmada para ${cliente.nombre}! Será atendido por ${usuarioAtiende} de ${startInterval} a ${nuevaReserva.visualFinish}`);
    
        $("#formReserva")[0].reset();
        $("#personasContainer").empty();
        $("#modalReserva").modal("hide");
    
        cargarTablaReservas();
        actualizarHorariosDisponibles();
      });

    $(document).on("click", "#reserva-del", function () {
        let index = $(this).data("index");
    
        if (confirm(`¿Seguro que deseas eliminar la reserva número ${reservas[index].numero_reserva}?`)) {
            reservas.splice(index, 1);
            localStorage.setItem("reservas", JSON.stringify(reservas));
            cargarTablaReservas();
            actualizarHorariosDisponibles();
        }
    });
});

function cargarTablaReservas() {
    $("#tabla-reservas").empty();

    let filas = "";
    reservas.forEach((reserva, index) => {
        let horaInicio = reserva.horario;
        let duracionTotal = reserva.detalles_personas.reduce((total, persona) => {
            return total + (persona.tipoCorte === "Caballero" ? 30 : 60);
        }, 0);

        let horaFin = calcularHoraFin(horaInicio, duracionTotal);
        filas += `
            <tr>
                <td>${reserva.numero_reserva}</td>
                <td>${reserva.nombre_cliente}</td>
                <td>${reserva.cantidad_personas}</td>
                <td>${reserva.detalles_personas.map(persona => persona.condicion).join(", ")}</td>
                <td>${reserva.horario_inicio} - ${reserva.visualFinish}</td>
                <td>${reserva.atendido_por}</td>
                <td>${reserva.detalles_personas.map(persona => persona.tipoCorte).join(", ")}</td>
                <td>
                    <button id="reserva-del" class="btn btn-danger btn-sm" data-index="${index}">🗑️</button>
                </td>
            </tr>
        `;
    });

    if (reservas.length !== 0) {
        $("#tabla-reservas").html(filas);
    } else {
        $("#tabla-reservas").html("<tr><td colspan='8' class='text-center'>No hay datos disponibles</td></tr>");
    }
}

function actualizarHorariosDisponibles() {
    let disponibles = horarioDisponible.filter(intervalo => {
        let occupancy = 0;
        reservas.forEach(reserva => {
            if (reserva.horario_inicio === intervalo) {
                occupancy += reserva.cantidad_personas;
            }
            if (reserva.blockedInterval === intervalo) {
                occupancy += reserva.damasCount;
            }
        });
        return occupancy < 3;
    });

    const listaHorarios = $("#horarioReserva");
    listaHorarios.empty();
    disponibles.forEach(hora => {
        listaHorarios.append(`<option value="${hora}">${hora}</option>`);
    });
}

function cargarClientes() {
    const listaClientes = $("#listaClientes");
    listaClientes.empty();

    clientes.forEach(cliente => {
        listaClientes.append(`<option value="${cliente.cedula}">${cliente.nombre}</option>`);
    });
}

function cargarUsuarios() {
    const listaUsuarios = $("#listaUsuarios");
    listaUsuarios.empty();

    usuarios.forEach(usuario => {
        listaUsuarios.append(`<option value="${usuario.nombre}">${usuario.nombre}</option>`);
    });
}

function calcularHoraFin(horaInicio, minutoInicio, periodo, hayCorteDama) {
    let horaFin = horaInicio;
    let minutoFin = minutoInicio;

    if (hayCorteDama) {
        horaFin += 1;
        minutoFin = 0;

        if (horaFin === 12 && periodo === "AM") {
            periodo = "PM";
        } else if (horaFin > 12) {
            horaFin -= 12;
            periodo = "PM";
        }
    } else {
        minutoFin += 30;
        if (minutoFin >= 60) {
            minutoFin = 0;
            horaFin += 1;

            if (horaFin === 12 && periodo === "AM") {
                periodo = "PM";
            } else if (horaFin > 12) {
                horaFin -= 12;
                periodo = "PM";
            }
        }
    }

    return `${horaFin}:${minutoFin.toString().padStart(2, "0")} ${periodo}`;
}

function reformatInterval(timeStr) {
    let [time, period] = timeStr.split(" ");
    let [hour, minute] = time.split(":");
    hour = parseInt(hour, 10);

    if (hour >= 12) {
        if (hour > 12) {
            hour = hour - 12;
        }
        period = "PM";
    } else {
        period = "AM";
    }
    return `${hour}:${minute} ${period}`;
}
  

function getNextInterval(intervalo) {
    let index = horarioDisponible.indexOf(intervalo.trim());
    if (index !== -1 && index < horarioDisponible.length - 1) {
        return horarioDisponible[index + 1];
    }
    return null;
}