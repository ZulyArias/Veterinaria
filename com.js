// Definir un array para almacenar las citas
let citas = [];

function agendar() {
    // Obtener valores del formulario
    const nombreMascota = document.getElementById('Nmascota').value.trim();
    const nombreDueño = document.getElementById('Ndueño').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const tipoMascota = document.getElementById('tipo_mascota').value;
    const fechaConsulta = document.getElementById('Fecha_Consulta').value;
    const horaConsulta = document.getElementById('hora').value;
    const sintomas = document.getElementById('Nro_Doc').value.trim();

    // Validar campos obligatorios
    if (!nombreMascota || !nombreDueño || !telefono || !sintomas) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios'
        });
        return;
    }

    // Validar longitud del teléfono
    if (telefono.length !== 10) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El teléfono debe tener 10 dígitos'
        });
        return;
    }

    const estado = document.getElementById('estado');

    // Validar si la fecha es anterior a hoy
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(fechaConsulta);
    fechaActual.setHours(0, 0, 0, 0); 
    fechaSeleccionada.setHours(0, 0, 0, 0); 
    if (fechaSeleccionada < fechaActual) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pueden agendar citas para fechas anteriores a hoy'
        });
        return;
    }

    // Validar si la hora está dentro del rango permitido
    const horaInicio = new Date();
    horaInicio.setHours(8, 0, 0, 0); // 8:00 AM
    const horaFin = new Date();
    horaFin.setHours(20, 0, 0, 0); // 8:00 PM
    const horaSeleccionada = new Date();
    const horaConsultaParts = horaConsulta.split(':');
    horaSeleccionada.setHours(horaConsultaParts[0], horaConsultaParts[1], 0, 0);

    if (horaSeleccionada < horaInicio || horaSeleccionada > horaFin) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las citas solo pueden ser agendadas entre las 8:00 AM y las 8:00 PM'
        });
        return;
    }


    // Crear un objeto cita con la información ingresada
    const cita = {
        nombreMascota: nombreMascota,
        nombreDueño: nombreDueño,
        telefono: telefono,
        tipoMascota: tipoMascota,
        fechaConsulta: fechaConsulta,
        horaConsulta: horaConsulta,
        sintomas: sintomas,
        estado: estado.value
    };

    // Agregar la cita al array
    citas.push(cita);

    // Actualizar las tarjetas de citas
    actualizarCards();

    // Limpiar el formulario después de agregar la cita
    limpiar();

    // Cerrar el modal y mostrar mensaje de éxito
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.hide();
    
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La cita ha sido agregada exitosamente'
    });
    

    // Ocultar el mensaje de éxito después de 2 segundos
    setTimeout(function() {
        Swal.close();
    }, 2000);
    return;
}

// funcion para limpiar el formulario
function limpiar() {
    document.getElementById('Nmascota').value = '';
    document.getElementById('Ndueño').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('tipo_mascota').value = '';
    document.getElementById('Fecha_Consulta').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('Nro_Doc').value = '';
    document.getElementById('estado').value = '';
}


// Función para actualizar las tarjetas de citas
function actualizarCards() {
    const seccionCarrito = document.getElementById('cards');
    seccionCarrito.innerHTML = '';

    citas.forEach((cita) => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-body">
                <img src="${obtenerImagen(cita.tipoMascota)}" class="card-img-top" alt="...">
                <h5 class="card-title">${cita.nombreMascota}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${cita.tipoMascota}</h6>
                <p class="card-text">${cita.fechaConsulta} - ${cita.horaConsulta}</p>
                <p class="card-text">${cita.sintomas}</p>
                <p class="card-text">${cita.nombreDueño} - ${cita.telefono}</p>
                <p class="card-text">${cita.estado}</p>
                <button class="btn btn-danger" onclick="eliminarCita('${cita.nombreMascota}')">Eliminar</button>
                <button class="btn btn-warning" onclick="editarCita('${cita.nombreMascota}')">Editar</button>
            </div>
        `;
        seccionCarrito.appendChild(card);
    });
}


function obtenerImagen(tipoMascota) {
    switch (tipoMascota) {
        case 'Perro':
            return './imgs/perro.jpg';
        case 'Gato':
            return './imgs/gato.jpg';
        case 'Loro':
            return './imgs/loro.jpg';
        case 'Reptil':
            return './imgs/reptil.jpeg';
        case 'Pez':
            return './imgs/pez.jpg';
        default:
            return './img/otro.gif';
    }
}

// Función para eliminar una cita
function eliminarCita(nombreMascota) {
    // Filtrar el array de citas para obtener todas las citas menos la que se quiere eliminar
    citas = citas.filter(cita => cita.nombreMascota !== nombreMascota);

    // Actualizar las tarjetas de citas
    actualizarCards();
}

// Función para editar una cita
function editarCita(nombreMascota) {
    // Buscar la cita que se quiere editar
    const cita = citas.find(cita => cita.nombreMascota === nombreMascota);

    // Llenar el formulario con la información de la cita
    document.getElementById('Nmascota').value = cita.nombreMascota;
    document.getElementById('Ndueño').value = cita.nombreDueño;
    document.getElementById('telefono').value = cita.telefono;
    document.getElementById('tipo_mascota').value = cita.tipoMascota;
    document.getElementById('Fecha_Consulta').value = cita.fechaConsulta;
    document.getElementById('hora').value = cita.horaConsulta;
    document.getElementById('Nro_Doc').value = cita.sintomas;
    document.getElementById('estado').value = cita.estado;

    // Abrir el modal de edición
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();

    // Eliminar la cita del array
    citas = citas.filter(cita => cita.nombreMascota !== nombreMascota);

    // Actualizar las tarjetas de citas
    actualizarCards();
}

// Función para filtrar citas por estado
function filtrarCitas() {
    const filtroSeleccionado = document.getElementById('filtroEstado').value;

    // Filtrar citas según el estado seleccionado
    const citasFiltradas = citas.filter(cita => cita.estado === filtroSeleccionado || filtroSeleccionado === 'Todos');

    // Actualizar las tarjetas de citas con las citas filtradas
    const seccionCarrito = document.getElementById('cards');
    seccionCarrito.innerHTML = '';

    citasFiltradas.forEach((cita) => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-body">
                <img src="${obtenerImagen(cita.tipoMascota)}" class="card-img-top" alt="...">
                <h5 class="card-title">${cita.nombreMascota}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${cita.tipoMascota}</h6>
                <p class="card-text">${cita.fechaConsulta} - ${cita.horaConsulta}</p>
                <p class="card-text">${cita.sintomas}</p>
                <p class="card-text">${cita.nombreDueño} - ${cita.telefono}</p>
                <p class="card-text">${cita.estado}</p>
                <button class="btn btn-danger" onclick="eliminarCita('${cita.nombreMascota}')">Eliminar</button>
                <button class="btn btn-warning" onclick="editarCita('${cita.nombreMascota}')">Editar</button>
            </div>
        `;
        seccionCarrito.appendChild(card);
    });
}
