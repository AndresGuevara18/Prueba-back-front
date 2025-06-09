//src/modules/dashboard/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../../config/ConfigURL';

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-blue-500 text-blue-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function TimeInput({ label, value, onChange, readOnly = false }) {
  const handleTimeClick = async () => {
    const result = await Swal.fire({
      title: 'Seleccionar hora',
      html: `<div class="text-sm text-gray-600 mb-4">${label}</div>`,
      input: 'text',
      inputValue: value,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
      customClass: {
        input: 'text-center'
      },
      didOpen: () => {
        const input = Swal.getInput();
        window.flatpickr(input, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i", // 24 horas
          time_24hr: true,    // 24 horas
          defaultDate: value,
          minuteIncrement: 1
        });
        // Forzar el atributo inputmode para que muestre teclado numérico en móviles
        if (input) input.setAttribute('inputmode', 'numeric');
      }
    });

    if (result.isConfirmed && result.value) {
      onChange(result.value);
    }
  };

  if (readOnly) {
    return (
      <div className="relative">
        <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
        <input
          type="text"
          value={value}
          readOnly
          className="w-full cursor-default rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-center text-sm text-gray-700 focus:outline-none"
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      <div className="relative" onClick={handleTimeClick}>
        <input
          type="text"
          value={value}
          readOnly
          className="w-full cursor-pointer rounded-md border border-gray-200 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function DaySchedule({ day, schedule, onUpdate, onApplyToAll, onEdit, onDelete, readOnlyInputs }) {
  // Función para formatear la hora a 24 horas si es necesario
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    
    // Si ya está en formato 24h (contiene solo números y :)
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      return timeStr;
    }
    
    // Convertir de AM/PM a 24h
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{schedule.descripcion ? schedule.descripcion : day}</span>
      </div>
      {schedule.isWorkDay && (
        <>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <TimeInput
              label="Entrada"
              value={formatTime(schedule.entryTime)}
              onChange={(value) => onUpdate(day, 'entryTime', value)}
              readOnly={readOnlyInputs}
            />
            <TimeInput
              label="Salida"
              value={formatTime(schedule.exitTime)}
              onChange={(value) => onUpdate(day, 'exitTime', value)}
              readOnly={readOnlyInputs}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="rounded border border-blue-500 bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="rounded border border-red-500 bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
              >
                Eliminar
              </button>
              <button
                onClick={() => onApplyToAll(day)}
                className="rounded border border-green-500 bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600"
              >
                Aplicar a todos
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState('schedules');
  const [settings, setSettings] = useState({
    toleranceMinutes: '15',
    notifications: {
      lateArrivals: true,
      absences: true
    },
    schedules: {
      Lunes: {
        isWorkDay: true,
        entryTime: '',
        exitTime: '',
        hasLunch: false,
        lunchStart: '',
        lunchEnd: ''
      },
      Martes: {
        isWorkDay: true,
        entryTime: '08:00',
        exitTime: '17:00',
        hasLunch: true,
        lunchStart: '13:00',
        lunchEnd: '14:00'
      },
      Miércoles: {
        isWorkDay: true,
        entryTime: '08:00',
        exitTime: '17:00',
        hasLunch: true,
        lunchStart: '13:00',
        lunchEnd: '14:00'
      },
      Jueves: {
        isWorkDay: true,
        entryTime: '08:00',
        exitTime: '17:00',
        hasLunch: true,
        lunchStart: '13:00',
        lunchEnd: '14:00'
      },
      Viernes: {
        isWorkDay: true,
        entryTime: '08:00',
        exitTime: '16:00',
        hasLunch: true,
        lunchStart: '13:00',
        lunchEnd: '14:00'
      },
      Sábado: {
        isWorkDay: true,
        entryTime: '08:00',
        exitTime: '13:00',
        hasLunch: false,
        lunchStart: '',
        lunchEnd: ''
      },
      Domingo: {
        isWorkDay: false,
        entryTime: '',
        exitTime: '',
        hasLunch: false,
        lunchStart: '',
        lunchEnd: ''
      }
    }
  });
  const [horarios, setHorarios] = useState([]);
  const [inasistenciaFecha, setInasistenciaFecha] = useState(new Date().toISOString().slice(0, 10));
  const [inasistentes, setInasistentes] = useState([]);

  // Cargar horarios reales desde el backend y mapearlos a los días
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/horarios`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Mapear los horarios a los días de la semana
          const dias = Object.keys(settings.schedules);
          const newSchedules = { ...settings.schedules };
          data.forEach((horario, idx) => {
            if (dias[idx]) {
              newSchedules[dias[idx]] = {
                ...newSchedules[dias[idx]],
                entryTime: horario.hora_entrada ? horario.hora_entrada.substring(0,5) : '',
                exitTime: horario.hora_salida ? horario.hora_salida.substring(0,5) : '',
                descripcion: horario.descripcion || ''
              };
            }
          });
          setSettings(prev => ({
            ...prev,
            schedules: newSchedules
          }));
        }
        setHorarios(data);
      });
  }, []);

  const handleUpdateSchedule = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [day]: {
          ...prev.schedules[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Cambios guardados!',
      text: 'Los horarios han sido actualizados exitosamente',
      confirmButtonColor: '#3B82F6',
      timer: 3000,
      timerProgressBar: true
    });
  };

  // Aplica el horario seleccionado a todos los cargos en la base de datos
  const handleApplyToAll = async (dayOrDesc) => {
    // Buscar el horario por descripción (o por el campo que corresponda)
    const horario = horarios.find(
      h => h.descripcion === dayOrDesc
    );
    if (!horario) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se encontró el horario.' });
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Aplicar este horario a todos los cargos?',
      text: 'Esta acción actualizará el horario de todos los cargos en la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aplicar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6B7280',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/horarios/aplicar-a-todos`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_horario_nuevo: horario.id_horario })
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Horario aplicado a todos los cargos', timer: 1800, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo aplicar el horario.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
      }
    }
  };

  const handleAddHorario = async () => {
    if (!newHorario.descripcion || !newHorario.hora_entrada || !newHorario.hora_salida) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Completa todos los campos.' });
      return;
    }

    // Asegurarse de que las horas están en formato 24h
    const horarioToSend = {
      ...newHorario,
      hora_entrada: newHorario.hora_entrada,
      hora_salida: newHorario.hora_salida
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horarioToSend)
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Horario agregado', timer: 1500, showConfirmButton: false });
        setShowAddModal(false);
        setNewHorario({ descripcion: '', hora_entrada: '', hora_salida: '' });
        // Refrescar horarios
        fetch(`${API_BASE_URL}/api/horarios`).then(res => res.json()).then(setHorarios);
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar el horario.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
    }
  };

  const handleDeleteHorario = async (id_horario) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/horarios/${id_horario}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Horario eliminado', timer: 1200, showConfirmButton: false });
          // Refrescar horarios
          fetch(`${API_BASE_URL}/api/horarios`).then(res => res.json()).then(setHorarios);
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el horario.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
      }
    }
  };

  const handleEditHorario = async (horario) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar horario',
      html:
        `<input id="swal-desc" class="swal2-input" placeholder="Descripción" value="${horario.descripcion || ''}">
         <input id="swal-entrada" class="swal2-input" type="time" value="${horario.hora_entrada || ''}">
         <input id="swal-salida" class="swal2-input" type="time" value="${horario.hora_salida || ''}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          descripcion: document.getElementById('swal-desc').value,
          hora_entrada: document.getElementById('swal-entrada').value,
          hora_salida: document.getElementById('swal-salida').value
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
    });
    if (formValues) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/horarios/${horario.id_horario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Horario actualizado', timer: 1200, showConfirmButton: false });
          fetch(`${API_BASE_URL}/api/horarios`).then(res => res.json()).then(setHorarios);
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el horario.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
      }
    }
  };

  const handleShowAddHorarioModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar horario',
      html:
        `<input id="swal-desc" class="swal2-input" placeholder="Descripción">
         <input id="swal-entrada" class="swal2-input" type="time" placeholder="Hora entrada">
         <input id="swal-salida" class="swal2-input" type="time" placeholder="Hora salida">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          descripcion: document.getElementById('swal-desc').value,
          hora_entrada: document.getElementById('swal-entrada').value,
          hora_salida: document.getElementById('swal-salida').value
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#6B7280',
    });
    if (formValues) {
      if (!formValues.descripcion || !formValues.hora_entrada || !formValues.hora_salida) {
        Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Completa todos los campos.' });
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/horarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Horario agregado', timer: 1500, showConfirmButton: false });
          // Refrescar horarios
          fetch(`${API_BASE_URL}/api/horarios`).then(res => res.json()).then(setHorarios);
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar el horario.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
      }
    }
  };

  const handleRevisarInasistencias = async () => {
    if (!inasistenciaFecha) {
      Swal.fire({ icon: 'warning', title: 'Fecha requerida', text: 'Selecciona una fecha para revisar inasistencias.' });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/horarios/revisar-inasistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha: inasistenciaFecha })
      });
      const data = await res.json();
      if (res.ok) {
        setInasistentes(data.inasistentes || []); // <-- Guardar la lista
        Swal.fire({ icon: 'info', title: 'Resultado', text: data.mensaje || 'Revisión completada.' });
      } else {
        setInasistentes([]);
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'No se pudo revisar inasistencias.' });
      }
    } catch (e) {
      setInasistentes([]);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo conectar al backend.' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <TabButton
            active={activeTab === 'schedules'}
            onClick={() => setActiveTab('schedules')}
          >
            Horarios
          </TabButton>
          <TabButton
            active={activeTab === 'inasistencias'}
            onClick={() => setActiveTab('inasistencias')}
          >
            Inasistencias
          </TabButton>
          <TabButton
            active={activeTab === 'lateArrivals'}
            onClick={() => setActiveTab('lateArrivals')}
          >
            Llegada Tarde
          </TabButton>
          <TabButton
            active={activeTab === 'earlyDepartures'}
            onClick={() => setActiveTab('earlyDepartures')}
          >
            Salidas Temprano
          </TabButton>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {horarios.map((horario, idx) => (
                <div key={horario.id_horario || idx}>
                  <DaySchedule
                    day={horario.descripcion || `Horario ${idx+1}`}
                    schedule={{
                      isWorkDay: true,
                      entryTime: horario.hora_entrada ? horario.hora_entrada.substring(0,5) : '',
                      exitTime: horario.hora_salida ? horario.hora_salida.substring(0,5) : '',
                      descripcion: horario.descripcion || ''
                    }}
                    onUpdate={handleUpdateSchedule}
                    onApplyToAll={handleApplyToAll}
                    onEdit={() => handleEditHorario(horario)}
                    onDelete={() => handleDeleteHorario(horario.id_horario)}
                    readOnlyInputs={true}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleShowAddHorarioModal}
                className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Agregar horario
              </button>
            </div>
          </div>
        )}

        {activeTab === 'inasistencias' && (
          <div className="py-8 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Revisar Inasistencias</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  id="fecha-inasistencia"
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inasistenciaFecha}
                  onChange={e => setInasistenciaFecha(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                <button
                  onClick={handleRevisarInasistencias}
                  className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                  Revisar inasistencias
                </button>
              </div>
              {/* Tabla temporal de inasistentes */}
              {inasistentes.length > 0 && (
                <div className="mt-6 w-full max-w-2xl">
                  <h3 className="mb-2 text-base font-semibold text-gray-700">Usuarios que no asistieron</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border bg-white text-sm shadow">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border px-2 py-1">Documento</th>
                          <th className="border px-2 py-1">Nombre</th>
                          <th className="border px-2 py-1">Cargo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inasistentes.map((u, idx) => (
                          <tr key={u.id_usuario || idx}>
                            <td className="border px-2 py-1">{u.numero_documento}</td>
                            <td className="border px-2 py-1">{u.nombre_empleado}</td>
                            <td className="border px-2 py-1">{u.cargo || u.nombre_cargo || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lateArrivals' && (
          <div className="py-8 text-center text-gray-500">
            Configuración de llegadas tarde (En desarrollo)
          </div>
        )}

        {activeTab === 'earlyDepartures' && (
          <div className="py-8 text-center text-gray-500">
            Configuración de salidas temprano (En desarrollo)
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;