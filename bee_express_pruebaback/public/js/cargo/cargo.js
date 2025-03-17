//todos los cargos al iniciar
document.addEventListener("DOMContentLoaded", function () {
    cargarTodosLosCargos();
});

//datos desde la api
async function obtenerCargo(idCargo) {
    try {
        //petición GET al servidor
        const response = await fetch(`/api/cargos/${idCargo}`);

        //respuesta no es exitosa error
        if (!response.ok) throw new Error("Cargo no encontrado");

        return await response.json(); //Convierte la respuesta en JSON y la retorna
    } catch (error) {
        console.error("❌ Error en obtenerCargo:", error); //Muestra el error en la consola
        throw error; // error con la funcion
    }
}

//buscar un cargo y mostrarlo en una ventana modal
async function buscarCargo() {
    try {
        // Obtiene el ID ingresado en el input
        const idCargo = document.getElementById("buscarCargo").value.trim();

        //Si  está vacío, 
        if (!idCargo) {
            alert("⚠️ Ingrese un ID.");
            return;
        }

        // Llama a la función 
        const cargo = await obtenerCargo(idCargo);

        //Si encuentra el cargo, asigna los valores obtenidos a los elementos del modal
        document.getElementById("cargoId").innerText = cargo.id_cargo;
        document.getElementById("cargoNombre").innerText = cargo.nombre_cargo;
        document.getElementById("cargoDescripcion").innerText = cargo.descripcion || "Sin descripción";
        document.getElementById("cargoTotal").innerText = cargo.total_usuarios;

        // Muestra el modal
        const modal = document.getElementById("modalCargo");
        modal.classList.remove("hidden");
        modal.style.display = "flex";

    } catch (error) {
        document.getElementById("buscarCargo").value = "";//error
        alert("❌ " + error.message);
    }
}


// Cerrar modal
function cerrarModal() {
    document.getElementById("modalCargo").classList.add("hidden");
    document.getElementById("modalCargo").style.display = "none";
    // Limpiar el campo de búsqueda al cerrar el modal
    document.getElementById("buscarCargo").value = "";
}
 

//Cargar todos los cargos en la tabla
async function cargarTodosLosCargos() {
    try {
        // Realiza la petición a la API 
        const response = await fetch('/api/cargos');

        // Verifica si la respuesta 
        if (!response.ok) {
            throw new Error("Error al obtener los cargos");
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Selecciona la tabla 
        const tableBody = document.getElementById("cargoTable");
        tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

        // Recorre los cargos obtenidos y los agrega a la tabla
        data.forEach(cargo => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td class="border border-black p-2">${cargo.id_cargo}</td>
                <td class="border border-black p-2">${cargo.nombre_cargo}</td>
                <td class="border border-black p-2">${cargo.descripcion || "N/A"}</td>
                <td class="border border-black p-2">
                    <button class="boton boton-editar" data-id="${cargo.id_cargo}">✏️ Editar</button>
                    <button class="boton boton-eliminar" data-id="${cargo.id_cargo}">🗑 Eliminar</button>
                </td>
            `;

            // Agregar eventos a los botones de edición y eliminación
            row.querySelector(".boton-eliminar").addEventListener("click", function () {
                eliminarCargo(this.dataset.id);// this.dataset.id captura el valor de data-id
            });

            row.querySelector(".boton-editar").addEventListener("click", function () {
                editarCargo(this.dataset.id);// this.dataset.id captura el valor de data-id
            });

            // Añadir la fila a la tabla
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("❌ Error en cargarTodosLosCargos:", error);

        // Mostrar un mensaje de error en la tabla
        document.getElementById("cargoTable").innerHTML =
            `<tr><td colspan="4" class="border border-black p-2 text-red-500">❌ Error al cargar los datos</td></tr>`;
    }
}


//Eliminar un cargo
async function eliminarCargo(id) {
    // 1️⃣ Cuadro de confirmación antes de eliminar
    if (!confirm("¿Seguro que deseas eliminar este cargo?")) return;

    try {
        //Petición  servidor c
        const response = await fetch(`/api/cargos/${id}`, { method: "DELETE" });

        // Leer la respuesta JSON del backend
        const data = await response.json();

        // error con el mensaje del backend
        if (!response.ok) throw new Error(data.error || "Error al eliminar el cargo");

        
        alert(data.message || "✅ Cargo eliminado correctamente."); // Muestra mensaje de éxito
        cargarTodosLosCargos(); // Recarga la tabla de cargos
    } catch (error) {
        console.error(error); // Mostrar el error en la consola
        alert(`❌ ${error.message}`); // Mostrar alerta con el mensaje del backend
    }
}


//EDITAR CARGO
async function editarCargo(id) {
    try {
        //Obtener  datos del cargo
        const cargo = await obtenerCargo(id);

        //prompt con los valores actuales 
        const nuevoNombre = prompt("Nuevo nombre del cargo:", cargo.nombre_cargo);
        const nuevaDescripcion = prompt("Nueva descripción del cargo:", cargo.descripcion || "");

        //Si cancela 
        if (nuevoNombre === null || nuevaDescripcion === null) return;

        // campos no estén vacíos
        if (!nuevoNombre.trim() || !nuevaDescripcion.trim()) {//.trim() elimina los espacios en blanco al inicio y al final 
            alert("⚠️ Debes ingresar todos los datos.");
            return;
        }

        // peticion actualización a la API
        const response = await fetch(`/api/cargos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_cargo: nuevoNombre, descripcion: nuevaDescripcion }),// convertircadena de texto JSON
        });

        //si hay errores
        if (!response.ok) throw new Error("Error al actualizar el cargo");

        alert("✅ Cargo actualizado correctamente.");
        cargarTodosLosCargos(); // Recargar la lista 
    } catch (error) {
        console.error("❌ Error en editarCargo:", error);
        alert("❌ Error al actualizar el cargo.");
    }
}