# 🍔 FoodStore - Full Stack Project

¡Bienvenido a **FoodStore**! Este es un proyecto Full Stack robusto diseñado con una arquitectura limpia y moderna, ideal para gestionar un catálogo de productos, categorías e ingredientes de manera eficiente.

## 🚀 Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework moderno y rápido para construir APIs con Python.
- **SQLModel**: Combinación perfecta de SQLAlchemy y Pydantic para el manejo de bases de datos.
- **PostgreSQL**: Motor de base de datos relacional (vía `psycopg2-binary`).
- **Patrones de Diseño**: Implementación de **Unit of Work (UOW)** y capa de **Services** para asegurar la integridad de los datos y lógica de negocio desacoplada.

### Frontend
- **React 19**: Biblioteca líder para interfaces de usuario dinámicas.
- **Vite**: Herramienta de construcción ultra rápida.
- **Tailwind CSS 4**: Estilizado moderno utilizando el nuevo motor de alto rendimiento.
- **TanStack Query (React Query)**: Gestión de estado del servidor, caché e invalidación de consultas.
- **TypeScript**: Tipado estático para un desarrollo más seguro y escalable.

---

## 🏗️ Arquitectura y Conceptos Clave

El proyecto no es solo un CRUD básico; aplica conceptos de nivel profesional:

- **Screaming Architecture**: La estructura de carpetas revela la intención del sistema, organizando el código por módulos y funcionalidades.
- **Borrado Lógico (Logic Delete)**: No eliminamos datos de forma física; usamos una bandera `logic_delete` para preservar el historial y la integridad referencial.
- **Auditoría Automática**: Todas las entidades cuentan con campos de `created_at` y `updated_at` gestionados automáticamente.
- **Manejo de Errores Centralizado**: Tanto en backend como en frontend, los errores se gestionan de forma consistente para mejorar la UX.

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/Manu-Crespo/Final
cd Final
```

### 2. Backend Setup
```bash
cd Backend
# Crear entorno virtual
python -m venv .venv
# Activar entorno (Windows)
.\venv\Scripts\activate
# Instalar dependencias
pip install -r requirements.txt
# Configurar variables de entorno (.env)
# Ejecutar servidor
fastapi dev app/main.py
```

### 3. Frontend Setup
```bash
cd Frontend/Frontend
# Instalar dependencias (recomendado pnpm)
pnpm install
# Ejecutar en modo desarrollo
pnpm dev
```

---

## 📖 Documentación de la API

Una vez que el backend esté corriendo, podés acceder a la documentación interactiva (Swagger) en:
`http://localhost:8000/docs`

---

## ✨ Características Principales
- ✅ **CRUD de Productos**: Gestión completa con fotos, precios e ingredientes.
- ✅ **Gestión de Categorías**: Organización jerárquica de productos.
- ✅ **Manejo de Ingredientes**: Relación Muchos a Muchos con productos.
- ✅ **Interfaz Responsiva**: Diseño optimizado para todos los dispositivos con Tailwind 4.
- ✅ **Feedback al Usuario**: Modales de confirmación y estados de carga optimizados.

---

