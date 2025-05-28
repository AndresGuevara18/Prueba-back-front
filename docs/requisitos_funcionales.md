# Descripción general

## Perspectiva del producto

Este proyecto se realizará a solicitud de la compañía Colpryst Asesores Ltda ya que no 
cuentan con una aplicación que le permita realizar el control de registro de los 
colaboradores de la compañía tanto del ingreso como de la salida.

# Requisitos Funcionales - Proyecto Visual Scan

Versión: 3.0   
Código: PT-ERS-01  

---

## Lista de Requisitos Funcionales

| Código  | Funcionalidad                              | Tipo       |
|---------|--------------------------------------------|------------|
| RF01    | Registro de usuarios                       | Esencial   |
| RF02    | Asignar rol de usuario                     | Esencial   |
| RF03    | Inicio de sesión                           | Esencial   |
| RF04    | Recuperar contraseña                       | Esencial   |
| RF05    | Búsqueda de usuarios                       | Esencial   |
| RF06    | Actualización de datos de usuarios         | Esencial   |
| RF07    | Eliminar datos de usuarios                 | Ideal      |
| RT08    | Reconocimiento facial                      | Esencial   |
| RT09    | Registro en tiempo real                    | Ideal      |
| RT10    | Registro de novedades                      | Esencial   |
| RT11    | Registro de ingreso                        | Opcional   |
| RT12    | Registro único de salida                   | Ideal      |
| RT13    | Envío de novedades de retardo              | Ideal      |
| RT14    | Cierre de sesión                           | Ideal      |


---

## Clasificación de Requisitos Funcionales

### RF01 - Registro de usuarios

- **Actor:** Administrador General  
- **Descripción:** Registrar nuevos usuarios para poder acceder, buscar, actualizar o eliminar su información.  
- **Criterio de aceptación:** Cuando el formulario esté completo y se haga clic en registrar, se creará la cuenta y se enviará un correo de confirmación.  
- **Detalles:**
  - Formulario con campos como ID, documento, nombre, dirección, etc.
  - Validación de correo y documento únicos.
  - Contraseña segura.
  - Confirmación por correo.

---

### RF02 - Asignar rol de usuario

- **Actor:** Sistema  
- **Descripción:** Asignar automáticamente roles según el formulario registrado.  
- **Criterio de aceptación:** El sistema detecta el tipo de formulario y asigna el rol correspondiente.  
- **Detalles:**
  - Roles específicos por tipo de usuario.
  - Solo el administrador general puede cambiar roles.

---

### RF03 - Inicio de sesión

- **Actor:** Usuario  
- **Descripción:** Iniciar sesión con sus credenciales.  
- **Criterio de aceptación:** Si las credenciales son válidas, se accede al panel correspondiente.  
- **Detalles:**
  - Ingreso por usuario o correo con contraseña.
  - Validación y mensajes de error claros.

---

### RF04 - Recuperar contraseña

- **Actor:** Usuario  
- **Descripción:** Solicitar la recuperación de su contraseña.  
- **Criterio de aceptación:** El sistema solicita autorización del administrador y envía enlace de restablecimiento.  
- **Detalles:**
  - Se pide correo e ID.
  - Validación y requisitos mínimos de contraseña.

---

### RF05 - Búsqueda de usuarios

- **Actor:** Administrador General  
- **Descripción:** Buscar usuarios por ID o correo para su gestión.  
- **Criterio de aceptación:** El sistema muestra la información correspondiente.  
- **Detalles:**
  - Resultados en una tabla editable con opciones de eliminar o modificar.

---

### RF06 - Actualización de datos de usuarios

- **Actor:** Usuario o Administrador  
- **Descripción:** Modificar sus datos personales.  
- **Criterio de aceptación:** El sistema valida y actualiza la información.  
- **Detalles:**
  - Campos como nombre, dirección, EPS, etc.
  - Cambios reflejados al instante.

---

### RF07 - Eliminar datos de usuarios

- **Actor:** Administrador General  
- **Descripción:** Eliminar usuarios del sistema.  
- **Criterio de aceptación:** Confirmar la acción y eliminar datos permanentemente.  
- **Detalles:**
  - Búsqueda y selección de usuario.
  - Confirmación previa obligatoria.

---

### RT08 - Reconocimiento facial

- **Actor:** Usuario  
- **Descripción:** Registrar entrada/salida mediante cámara.  
- **Criterio de aceptación:** Validación al posicionarse frente a la cámara.  
- **Detalles:**
  - Confirmación visual y almacenamiento en base de datos.

---

### RT09 - Registro en tiempo real

- **Actor:** Usuario  
- **Descripción:** Registrar horarios en el sistema.  
- **Criterio de aceptación:** Registrar fecha y hora exacta en base de datos.  
- **Detalles:**
  - Registro sincronizado con reconocimiento facial.

---

### RT10 - Registro de novedades

- **Actor:** Administrador  
- **Descripción:** Crear historial de novedades por retardos.  
- **Criterio de aceptación:** Se registra y visualiza la novedad.  
- **Detalles:**
  - Descripción y tipo de novedad.

---

### RT11 - Registro de ingreso

- **Actor:** Usuario  
- **Descripción:** Registrar la hora de ingreso.  
- **Criterio de aceptación:** Registro único diario con validación facial.  
- **Detalles:**
  - Mensaje de bienvenida si es exitoso.

---

### RT12 - Registro único de salida

- **Actor:** Usuario  
- **Descripción:** Registrar la hora de salida.  
- **Criterio de aceptación:** Registro único diario con mensaje de despedida.  
- **Detalles:**
  - Error si ya registró salida.

---

### RT13 - Envío de novedades de retardo

- **Actor:** Sistema / Administrador  
- **Descripción:** Notificar al administrador si un usuario tiene 3 retardos.  
- **Criterio de aceptación:** Enviar detalle de la novedad automáticamente.  
- **Detalles:**
  - Contar y verificar retardos acumulados.

---

### RT14 - Cierre de sesión

- **Actor:** Usuario o Administrador  
- **Descripción:** Finalizar sesión activamente.  
- **Criterio de aceptación:** Redirigir a pantalla de login y eliminar sesión activa.  
- **Detalles:**
  - Invalida credenciales anteriores hasta nuevo inicio.

---
