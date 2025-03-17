// 📌 Cargar todos los cargos al iniciar
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnAgregarCargo").addEventListener("click", agregarCargo);
});

//funcion agregar cargo y redireccionar al cargo
async function agregarCargo() {
    try {
        // obtener valores del formulario y limpiar con trim
        const nombre_cargo = document.getElementById("nombre_cargo").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const mensaje = document.getElementById("mensaje");

        // Limpia el mensaje antes de cualquier validación
        mensaje.innerText = "";

        // campo está vacío, mensaje de error y detiene la ejecución
        if (!nombre_cargo || !descripcion) {
            mensaje.innerText = "⚠️ Todos los campos son obligatorios.";
            mensaje.style.color = "red";
            return;
        }

        // petición POST 
        const response = await fetch("/api/cargos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_cargo, descripcion }), //Convertir objeto a formato JSON
        });

        // Si no es exitosa, lanza un error
        if (!response.ok) throw new Error("Error al agregar el cargo");

        const data = await response.json(); // convertir la respuesta en JSON

        mensaje.innerText = data.message;//mensaje del back
        mensaje.style.color = "green";

        //Redirige a "cargo.html" después de 1 segundo
        setTimeout(() => {
            window.location.href = "cargo.html";
        }, 100);
    } catch (error) {
        console.error("❌ Error en agregarCargo:", error);
        mensaje.innerText = "❌ Error al agregar el cargo.";
        mensaje.style.color = "red";
    }
}
