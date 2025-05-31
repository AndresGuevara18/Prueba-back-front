import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/ConfigURL";

const CargoPage = () => {
  const [cargos, setCargos] = useState([]); // Estado para almacenar la lista de cargos
  const [idCargoBuscar, setIdCargoBuscar] = useState(""); // Estado para almacenar el ID del cargo a buscar
  const [cargoEncontrado, setCargoEncontrado] = useState(null); // Estado para almacenar el cargo encontrado
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para controlar la visibilidad del modal
  const navigate = useNavigate();

  // URL del backend
  const API_URL = `${API_BASE_URL}/api/cargos`;

  useEffect(() => {
    document.title = "COLPRYST | Cargos"; // Cambiar el título de la página
  }, []);

  // Cargar todos los cargos al iniciar
  const cargarTodosLosCargos = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los cargos");
      const data = await response.json();
      setCargos(data);
    } catch (error) {
      console.error("Error cargando cargos:", error);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    cargarTodosLosCargos();
  }, []);

  // Función para buscar un cargo por ID
  const buscarCargo = async () => {
    if (!idCargoBuscar.trim()) {
      alert("⚠️ Ingrese un ID.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${idCargoBuscar}`);
      if (!response.ok) throw new Error("Cargo no encontrado");
      const cargo = await response.json();
      setCargoEncontrado(cargo);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error buscando cargo:", error);
      alert("❌ " + error.message);
    }
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setIdCargoBuscar("");
  };

  // Función para eliminar un cargo
  const eliminarCargo = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cargo?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json(); // Parsear la respuesta JSON

      if (!response.ok) {
        // Si hay un error, mostrar el mensaje de error del backend
        throw new Error(data.error || "Error al eliminar el cargo");
      }

      // Si la eliminación es exitosa, mostrar el mensaje de éxito
      alert(data.message || "✅ Cargo eliminado correctamente.");

      // Recargar la lista de cargos
      await cargarTodosLosCargos(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error eliminando cargo:", error);
      alert(error.message); // Mostrar el mensaje de error
    }
  };

  // Función para editar un cargo
  const editarCargo = async (id) => {
    try {
      const cargo = cargos.find((cargo) => cargo.id_cargo === id);
      if (!cargo) throw new Error("Cargo no encontrado");

      const nuevoNombre = prompt("Nuevo nombre del cargo:", cargo.nombre_cargo);
      const nuevaDescripcion = prompt("Nueva descripción del cargo:", cargo.descripcion || "");

      if (!nuevoNombre || !nuevaDescripcion) {
        alert("⚠️ Debes ingresar todos los datos.");
        return;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_cargo: nuevoNombre,
          descripcion: nuevaDescripcion,
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar el cargo");

      alert("✅ Cargo actualizado correctamente.");
      cargarTodosLosCargos(); // Recargar la lista actualizada
    } catch (error) {
      console.error("Error editando cargo:", error);
      alert("❌ " + error.message);
    }
  };

  return (
    <div className="ml-46 m-5 text-center font-sans">
      <h1 className="mb-4 text-3xl font-bold">Lista de Cargos</h1>

      {/* 🔹 Contenedor para los botones */}
      <div className="mb-4 flex justify-center space-x-4">
        {/* Botón para agregar cargo */}
        <button
          onClick={() => navigate("/dashboard/agregar-cargo")} // Redirige a la página de agregar cargo
          className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Agregar Cargo
        </button>

        {/* Buscar cargo */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar cargo por ID"
            value={idCargoBuscar}
            onChange={(e) => setIdCargoBuscar(e.target.value)}
            className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={buscarCargo}
            className="ml-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            🔍 Buscar Cargo
          </button>
        </div>
      </div>

      {/* Tabla de cargos */}
      <div className="table-container overflow-x-auto">
        <table className="w-full bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-2">ID</th>
              <th className="border border-black p-2">Nombre</th>
              <th className="border border-black p-2">Descripción</th>
              <th className="border border-black p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo, index) => (
              <tr
                key={cargo.id_cargo}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } border-b`}
              >
                <td className="border border-black p-2">{cargo.id_cargo}</td>
                <td className="border border-black p-2">{cargo.nombre_cargo}</td>
                <td className="border border-black p-2">{cargo.descripcion || "N/A"}</td>
                <td className="border border-black p-2">
                  <button
                    onClick={() => editarCargo(cargo.id_cargo)}
                    className="mr-2 rounded bg-yellow-500 p-1 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarCargo(cargo.id_cargo)}
                    className="rounded bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles del cargo */}
      {modalAbierto && cargoEncontrado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Detalles del Cargo</h2>
            <p>
              <strong>ID:</strong> {cargoEncontrado.id_cargo}
            </p>
            <p>
              <strong>Nombre:</strong> {cargoEncontrado.nombre_cargo}
            </p>
            <p>
              <strong>Descripción:</strong>{" "}
              {cargoEncontrado.descripcion || "Sin descripción"}
            </p>
            <p>
              <strong>Total empleados:</strong> {cargoEncontrado.total_usuarios}
            </p>
            <button
              onClick={cerrarModal}
              className="mt-4 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoPage;
