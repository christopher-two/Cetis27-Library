# 📚 Biblioteca Digital - Override Index

Sistema integral de gestion bibliotecaria desarrollado por **Override Index**. Esta plataforma permite administrar de manera eficiente prestamos, inventario de libros y el directorio de alumnos con integracion en tiempo real.

---

## ✨ Características Principales

### 📊 Panel de Control (Dashboard)

- **Estadísticas en Tiempo Real:** Visualización instantánea de préstamos activos, vencidos y total de libros.
- **Gráficos Dinámicos:**
  - Tendencia de préstamos y devoluciones (últimos 7 días).
  - Distribución de libros por categorías.
  - Actividad de usuarios por día de la semana.

### 👥 Gestión de Alumnos

- Directorio completo de alumnos registrados.
- Búsqueda avanzada por nombre, matrícula o carrera.
- Registro y edición de información de estudiantes.

### 📖 Inventario de Libros

- Catálogo detallado con títulos, autores, ISBN y ubicación física.
- Control automático de existencias (Copias totales vs. disponibles).
- Gestión de categorías para una mejor organización.

### ⏳ Historial de Préstamos

- Registro completo de todas las transacciones.
- Filtros rápidos por estado (Activo, Devuelto, Vencido).
- Sistema de búsqueda para localización rápida de folios.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [Astro](https://astro.build/) (v5.0+) con componentes de UI personalizados siguiendo **Material Design 3**.
- **Estilos:** Vanilla CSS / Tailwind (configurado).
- **Base de Datos & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Authentication).
- **Gráficos:** [ApexCharts](https://apexcharts.com/).
- **Despliegue:** [Cloudflare Pages](https://pages.cloudflare.com/).

---

## 🚀 Instalación y Desarrollo Local

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-repositorio>
    ```

2.  **Instalar dependencias:**

    ```bash
    pnpm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz con tus credenciales de Firebase:

    ```env
    PUBLIC_FIREBASE_API_KEY=xxx
    PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
    PUBLIC_FIREBASE_PROJECT_ID=xxx
    PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
    PUBLIC_FIREBASE_APP_ID=xxx
    PUBLIC_FIREBASE_MEASUREMENT_ID=xxx
    ```

4.  **Iniciar servidor de desarrollo:**
    ```bash
    pnpm dev
    ```

---

## 🛡️ Desarrollado por

Este proyecto es una solución a medida desarrollada por **Override**.

[![Override Logo](https://www.override.com.mx/logo.png)](https://www.override.com.mx)
[www.override.com.mx](https://www.override.com.mx)
