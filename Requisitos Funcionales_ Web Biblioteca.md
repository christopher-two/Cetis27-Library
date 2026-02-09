# **Documento de Requisitos Funcionales (FRD)**

## **Sistema Web de Gestión Bibliotecaria**

**Fecha:** 9 de febrero de 2026

**Versión:** 1.0

**Objetivo:** Definir las funcionalidades clave para el desarrollo del panel web administrativo que gestionará los préstamos físicos y la activación de licencias digitales (Parse).

### **1\. Actores del Sistema**

* **Administrador/Bibliotecario:** Único usuario con acceso al sistema. Se encarga de registrar préstamos y activar cuentas digitales.

### **2\. Módulos y Requisitos Funcionales**

#### **Módulo 1: Autenticación (Login)**

El punto de entrada seguro para el personal de la institución.

* **RF-001 | Inicio de Sesión:** El sistema debe permitir el ingreso mediante **Correo Electrónico** y **Contraseña**.  
* **RF-002 | Validación:** Si las credenciales son incorrectas, mostrar un mensaje de error sin dar detalles específicos (seguridad básica).  
* **RF-003 | Redirección:** Al loguearse exitosamente, el usuario debe ser redirigido inmediatamente al **Dashboard Principal**.

#### **Módulo 2: Dashboard Principal (Listado y Gestión)**

La pantalla central donde ocurre toda la operación.

* **RF-004 | Listado de Préstamos:** Mostrar una tabla central con los registros de préstamos. Columnas sugeridas:  
  * Nombre del Alumno / Matrícula.  
  * Libro Prestado (Título).  
  * Fecha de Préstamo.  
  * Fecha de Vencimiento.  
  * Estado (Activo, Vencido, Devuelto).  
  * Estatus Digital (Activo/Inactivo).  
* **RF-005 | Filtrado Rápido:** El sistema debe permitir filtrar la tabla por:  
  * **Estado:** Ver solo "Vencidos" o "Activos".  
  * **Tiempo:** Préstamos de "Última semana", "Último mes".  
  * **Búsqueda:** Barra para buscar por Matrícula o Nombre.  
* **RF-006 | Indicadores Visuales:** Los registros con fecha de vencimiento pasada deben resaltarse visualmente (ej. texto rojo o alerta).

#### **Módulo 3: Nuevo Registro (Físico)**

Funcionalidad para prestar un libro físico.

* **RF-007 | Formulario de Préstamo:** Botón "Nuevo Registro" que abre un modal o formulario simple solicitando:  
  * Matrícula del Alumno.  
  * Código/Nombre del Libro Físico.  
  * Fecha de Devolución (puede ser automática, ej. \+7 días).  
* **RF-008 | Guardado:** Al guardar, el registro se añade al listado principal y actualiza el stock (lógico).

#### **Módulo 4: Integración Digital (Botón Parse)**

La conexión con la app de lectura, activando el acceso semestral.

* **RF-009 | Botón "Activar Biblioteca Digital":**  
  * **Ubicación:** Disponible tanto en el formulario de "Nuevo Registro" como en una acción rápida en el Listado Principal junto a cada alumno.  
  * **Acción:** Al hacer clic, el sistema debe enviar la matrícula a **Supabase**.  
* **RF-010 | Generación de Token (Backend):** El sistema debe generar un registro/token con una vigencia de **6 meses** a partir de la fecha de clic.  
* **RF-011 | Feedback Visual:**  
  * Al presionar el botón, mostrar un indicador de carga ("Activando...").  
  * Mostrar confirmación de éxito ("Acceso Digital Activado hasta \[Fecha \+ 6 meses\]").  
  * Cambiar el icono de estado digital en la tabla a "Verde/Activo".

### **3\. Flujo de Trabajo Simplificado**

1. **Bibliotecario se loguea.**  
2. **Llega un alumno:**  
   * Si viene por un libro físico: Clic en "Nuevo Registro" \-\> Llena datos \-\> Guardar.  
   * Si viene a renovar credencial/digital: Busca al alumno en la lista \-\> Clic en botón **"Activar Biblioteca Digital"**.  
3. **Fin del proceso.** El alumno ya puede entrar a la app Parse en su móvil.

### **4\. Requisitos No Funcionales (Técnicos)**

* **Plataforma:** Aplicación Web (accesible desde navegador Chrome/Edge/Firefox).  
* **Interfaz:** Diseño limpio, minimalista, optimizado para uso en escritorio (Mouse y Teclado).  
* **Velocidad:** La carga del listado y la activación del token deben ser casi instantáneos (\< 2 segundos).