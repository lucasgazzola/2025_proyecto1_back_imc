# 📌 Calculadora IMC – Deploy (Entrega 1)

Este documento explica los pasos realizados para desplegar la aplicación **Calculadora IMC**, tanto en el **backend (NestJS en Azure)** como en el **frontend (React-Vite en Vercel)**.
La idea es que cualquier persona pueda reproducir el proceso de manera sencilla.

---

## 🚀 1. Preparación de repositorios

1. Hacer **fork** de los repositorios oficiales:
   - [Frontend](https://github.com/Programacion-Avanzada-UTN-FRVM/2025_proyecto1_front_imc)
   - [Backend](https://github.com/Programacion-Avanzada-UTN-FRVM/2025_proyecto1_back_imc)

2. Clonar los forks en tu máquina local y realizar los ajustes necesarios:

   ```sh
   # Clonar el backend
   git clone https://github.com/<nombreusuario>/2025_proyecto1_back_imc

   # Clonar el frontend
   git clone https://github.com/<nombreusuario>/2025_proyecto1_front_imc
   ```

---

## 🔧 2. Configuración del Backend (NestJS en Azure)

### 2.1 Ajustes en el código

Antes de desplegar en Azure, se hicieron dos cambios importantes:
En `main.ts`:

- **Puerto dinámico**:

  ```ts
  const port = process.env.PORT || 3000;
  await app.listen(port);
  ```

  Azure necesita manejar el puerto automáticamente mediante `process.env.PORT`.

- **Habilitar CORS**:
  Se agregó:
  ```ts
  app.enableCors();
  ```
  Esto permite que el frontend pueda conectarse al backend sin problemas.

---

### 2.2 Deploy en Azure App Services

1. Ingresar al [Portal de Azure](https://portal.azure.com).
2. Ir a **App Services → Crear → Aplicación Web**.
3. Configurar los siguientes parámetros:
   - **Nombre de la aplicación** (ej: `imc-backend`).
   - **Región** (ej: _South Central US_ o la más cercana).
   - **Plan de hosting**: capa gratuita o de estudiantes.

4. Activar **Integración Continua (CI/CD)**:
   - Seleccionar GitHub como origen.
   - Elegir el repositorio del backend (fork) y la rama `master`.
   - Con esto, cada `git push` a `master` actualizará automáticamente la app en Azure.

5. Una vez finalizado, Azure generará una **URL pública** (ej:
   `imc-backend-gtc4h9dhddckh2fh.brazilsouth-01.azurewebsites.net`).

---

## 🌐 3. Configuración del Frontend (React-Vite en Vercel)

### 3.1 Deploy en Vercel

1. Ir a [Vercel](https://vercel.com) y crear cuenta (puede ser con GitHub).
2. Seleccionar **Nuevo Proyecto** → elegir el repositorio del frontend.
3. Configurar variables de entorno (`.env`) con la **URL del backend en Azure**.
   Ejemplo:
   ```env
   VITE_API_URL=https://calculadora-imc-back.azurewebsites.net
   ```
4. Configurar `outDir` si es necesario (por defecto, Vite usa `dist`).
5. Hacer clic en **Deploy**.

Tras unos minutos, Vercel dará una **URL pública** para el frontend (ej:
`https://2025-proyecto1-front-imc-three.vercel.app/`).

---

## ✅ 4. Verificación

- Acceder al **frontend en Vercel**.
- Ingresar peso y altura → la app debe conectarse con el **backend en Azure** y mostrar el resultado del IMC.

---

## 📊 5. Lecciones aprendidas

- Azure requiere que el puerto sea dinámico (`process.env.PORT`).
- Es fundamental habilitar **CORS** en el backend para permitir comunicación con el frontend.
- Vercel facilita el deploy del frontend con mínima configuración.
- La integración continua en Azure permite que cada cambio en el repositorio se despliegue automáticamente.

---

## 🔗 6. URLs finales

- **Frontend**: [https://github.com/lucasgazzola/2025_proyecto1_front_imc](https://github.com/lucasgazzola/2025_proyecto1_front_imc)
- **Backend**: [https://github.com/lucasgazzola/2025_proyecto1_back_imc](https://github.com/lucasgazzola/2025_proyecto1_back_imc)
- **LiveUIRL**: [https://2025-proyecto1-front-imc-three.vercel.app/](https://2025-proyecto1-front-imc-three.vercel.app/)

---
