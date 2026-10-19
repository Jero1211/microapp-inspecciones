# CampusAudit PRO | MicroApp de Inspecciones Técnicas

> **Proyecto Académico & Práctico:** Desarrollo de Aplicaciones Móviles  
> **Institución:** Corporación Universitaria Lasallista (UniLasallista)  
> **Desarrollado por:** Jero — Estudiante de 6.º semestre de Ingeniería de Software  

![Ionic](https://img.shields.io/badge/Ionic-9.x-blue?style=flat-square&logo=ionic)
![Capacitor](https://img.shields.io/badge/Capacitor-8.x-119EFF?style=flat-square&logo=capacitor)
![Angular](https://img.shields.io/badge/Angular-22.x-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue?style=flat-square&logo=typescript)
![Plataforma](https://img.shields.io/badge/Plataforma-Android%20%7C%20Web-green?style=flat-square&logo=android)

---

## 📱 Descripción General

**CampusAudit PRO** es una aplicación móvil híbrida desarrollada para registrar y auditar el estado físico y técnico de aulas, laboratorios y zonas comunes dentro del campus de **UniLasallista**.

Como estudiante de 6.º semestre, desarrollé esta solución en el curso de Aplicaciones Móviles. Me apoyé en herramientas de Inteligencia Artificial para aprender a configurar el ecosistema de **Ionic con Capacitor**, gestionar la persistencia local en dispositivos Android y diseñar una interfaz táctil que permitiera levantar reportes directamente en terreno sin depender de conectividad constante a internet.

---

## ✨ Características Principales

- **Registro de Auditorías en Terreno:** Formulario guiado para capturar novedades en aulas, laboratorios de cómputo, biblioteca y áreas comunes.
- **Categorización por Nivel de Criticidad:** Clasificación visual de incidencias en tres niveles (*Baja*, *Media*, *Alta / Urgente*) para facilitar la priorización del personal de mantenimiento.
- **Persistencia Local Offline:** Implementación con `@capacitor/preferences` (almacenamiento local clave-valor persistente) que conserva los reportes guardados en el almacenamiento del dispositivo móvil.
- **Detección de Estado de Red:** Integración con `@capacitor/network` para verificar si el dispositivo cuenta con conexión activa a internet o datos móviles.
- **Empaquetado Nativo para Android:** Proyecto configurado con Gradle y Capacitor (`io.ionic.inspecciones`) listo para compilarse y ejecutarse en dispositivos Android físicos o emuladores de Android Studio.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Framework Móvil** | Ionic 9 (Componentes UI móviles) |
| **Framework Base** | Angular |
| **Runtime Nativo** | Capacitor 8 |
| **Lenguaje** | TypeScript, HTML5, SCSS |
| **Plugins Capacitor** | `@capacitor/preferences`, `@capacitor/network`, `@capacitor/android` |
| **Entorno de Compilación** | Android SDK, Gradle, Android Studio |

---

## 📁 Estructura del Repositorio

```text
├── android/                # Proyecto nativo Gradle para Android Studio
│   └── app/                # Código fuente Java/Kotlin, manifiesto y recursos nativos
├── src/
│   ├── app/                # Componentes Angular, vistas de inspección y servicios
│   ├── assets/             # Íconos e imágenes de la aplicación
│   ├── theme/              # Variables de diseño y estilos globales de Ionic
│   └── index.html          # Shell principal de la aplicación web híbrida
├── capacitor.config.ts     # Configuración de appId ('io.ionic.inspecciones') y webDir
├── ionic.config.json       # Configuración del CLI de Ionic
├── package.json            # Dependencias del proyecto
└── README.md               # Documentación del proyecto
```

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- **Node.js** (v18+)
- **Ionic CLI** instalado globalmente: `npm install -g @ionic/cli`
- *(Opcional para Android)*: **Android Studio** con Android SDK configurado.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jero1211/microapp-inspecciones.git
cd microapp-inspecciones
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en el navegador (Modo Desarrollo Web)
```bash
ionic serve
# O también:
npm start
```
La aplicación se abrirá en `http://localhost:8100` con recarga automática en vivo.

### 4. Compilar y sincronizar con Android
```bash
# Compilar los recursos web
npm run build

# Sincronizar los assets y plugins con el proyecto Android
npx cap sync android

# Abrir el proyecto en Android Studio
npx cap open android
```
Desde Android Studio podrás compilar el APK o instalarlo directamente en tu teléfono móvil mediante depuración USB.

---

## 👨‍💻 Autor

- **Jero** — Estudiante de 6.º semestre de Ingeniería de Software (UniLasallista).
- **GitHub:** [@Jero1211](https://github.com/Jero1211)
- **Portafolio:** [Ver Portafolio Profesional](https://github.com/Jero1211)
