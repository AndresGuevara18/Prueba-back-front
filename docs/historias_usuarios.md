# Historias de Usuario



## HU1 - Registro De Usuario

**Como** Administrador General  
**Quiero** registrar nuevos usuarios  
**Para** acceder, buscar, actualizar y eliminar su información  

**Criterio de Aceptación:**  
Dado un formulario de registro, cuando se completen todos los campos y se haga clic en registrar, entonces se creará la cuenta y se enviará un correo de confirmación.

**Prioridad:** Alta  

**Detalles:**
- Campos requeridos: ID, tipo y número de documento, nombre, dirección, teléfono, email, tipo cuenta bancaria, número cuenta, EPS, horario, usuario, contraseña.
- Validaciones de duplicados y seguridad de contraseña.
- Confirmación vía correo electrónico.

---

## HU2 - Asignar Rol De Usuario

**Como** sistema  
**Quiero** asignar roles según el formulario  
**Para** dar permisos dependiendo del tipo de usuario  

**Criterio de Aceptación:**  
Dado el formulario, cuando se valide el tipo, entonces se asignará el rol.

**Prioridad:** Alta  

**Detalles:**
- Cambios de rol solo por el administrador general.

---

## HU3 - Iniciar Sesión

**Como** usuario registrado  
**Quiero** iniciar sesión  
**Para** acceder a mis funcionalidades  

**Criterio de Aceptación:**  
Dado el formulario de inicio, cuando se ingresen credenciales válidas, entonces el sistema permitirá el acceso.

**Prioridad:** Alta  

---

## HU4 - Buscar Usuario

**Como** administrador general  
**Quiero** buscar usuarios  
**Para** gestionar su información  

**Criterio de Aceptación:**  
Dado un campo de búsqueda, cuando se ingrese ID o correo, entonces se mostrará la información correspondiente.

**Prioridad:** Media  

---

## HU5 - Actualizar Datos De Usuario

**Como** administrador o usuario  
**Quiero** actualizar mis datos  
**Para** mantener la información actualizada  

**Criterio de Aceptación:**  
Dado un formulario, cuando se editen los datos, entonces se validarán y guardarán.

**Prioridad:** Media  

---

## HU6 - Eliminar Datos De Usuario

**Como** administrador general  
**Quiero** eliminar usuarios  
**Para** mantener la base de datos limpia  

**Criterio de Aceptación:**  
Dado un listado, cuando se seleccione y confirme la eliminación, entonces el sistema eliminará los datos.

**Prioridad:** Baja  

---

## HU7 - Reconocimiento Facial

**Como** usuario  
**Quiero** usar reconocimiento facial  
**Para** registrar entrada y salida  

**Criterio de Aceptación:**  
Dado un sistema de cámara, cuando el usuario se ubique frente a ella, entonces se validará el evento.

**Prioridad:** Media  

---

## HU8 - Registro En Tiempo Real

**Como** usuario  
**Quiero** registrar mis horarios  
**Para** mantener control de entrada/salida  

**Criterio de Aceptación:**  
Dado el sistema de eventos, cuando se registre el ingreso o salida, entonces se almacenará la fecha y hora.

**Prioridad:** Alta  

---

## HU9 - Registrar Novedad

**Como** administrador  
**Quiero** registrar novedades  
**Para** mantener historial  

**Criterio de Aceptación:**  
Dado el sistema de novedades, cuando un usuario tenga repetidos retardos, entonces se notificará y almacenará la novedad.

**Prioridad:** Media  

---

## HU10 - Registrar Ingreso

**Como** usuario  
**Quiero** registrar mi ingreso  
**Para** tener control de asistencia  

**Criterio de Aceptación:**  
Dado el sistema de ingreso, cuando el usuario se registre, entonces se almacenará la hora y fecha.

**Prioridad:** Alta  

---

## HU11 - Registrar Salida

**Como** usuario  
**Quiero** registrar mi salida  
**Para** cerrar mi jornada correctamente  

**Criterio de Aceptación:**  
Dado el sistema, cuando se realice el reconocimiento facial, entonces se almacenará la salida.

**Prioridad:** Alta  

---

## HU12 - Notificar 3 Retardos

**Como** administrador  
**Quiero** que el sistema notifique acumulación de 3 retardos  
**Para** tomar acciones correctivas  

**Criterio de Aceptación:**  
Dado el sistema de control, cuando un usuario acumule 3 retardos, entonces se enviará una notificación.

**Prioridad:** Media  

---

## HU13 - Cerrar Sesión

**Como** usuario o administrador  
**Quiero** cerrar sesión  
**Para** proteger mis datos  

**Criterio de Aceptación:**  
Dado el sistema, cuando el usuario seleccione cerrar sesión, entonces se cerrará la sesión y se redirigirá a la página de inicio.

**Prioridad:** Alta  

---

