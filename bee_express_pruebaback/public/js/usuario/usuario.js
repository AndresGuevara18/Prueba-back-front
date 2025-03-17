document.addEventListener("DOMContentLoaded", () => {
    getAllUsuarios(); // Cargar usuarios automáticamente al cargar la página
});

// 🔹 Función para obtener y mostrar la lista de usuarios
function getAllUsuarios() {
    const tableBody = document.getElementById("userTable"); // Ubicación donde se mostrará la lista de usuarios

    if (!tableBody) {
        console.warn("⚠️ No se encontró la tabla de usuarios en la página.");
        return;
    }

    fetch('/api/usuarios')
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }
        return response.json();
    })
    .then(data => {
        tableBody.innerHTML = ""; // Limpiar contenido anterior antes de agregar nuevos datos
        
        data.forEach(user => {
            let row = `<tr>
                <td>${user.id_usuario}</td>
                <td>${user.tipo_documento}</td>
                <td>${user.numero_documento}</td>
                <td>${user.nombre_empleado}</td>
                <td>${user.email_empleado}</td>
                <td>${user.id_cargo}</td>
                <td>
                    <button class="boton boton-editar">Editar</button>
                    <button class="boton boton-eliminar" onclick="eliminarUsuario(${user.id_usuario})">Eliminar</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error("❌ Error al cargar usuarios:", error);
        tableBody.innerHTML = `<tr><td colspan="7">⚠️ Error al cargar los datos</td></tr>`;
    });
}

async function eliminarUsuario(id_usuario) {
    try {
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (!confirmacion) return; // Si el usuario cancela, no se ejecuta nada

        const response = await fetch(`/api/usuarios/${id_usuario}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Error al eliminar usuario");
        }

        const data = await response.json();
        alert(data.message); // Muestra el mensaje del backend
        getAllUsuarios(); // Recargar la lista después de eliminar

    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        alert("Error al eliminar usuario");
    }
}
