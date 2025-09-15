# Documentación completa API Backend IMC

Esta API permite registrar usuarios, autenticarse, calcular el IMC y guardar cada cálculo en el historial personal. Todos los endpoints sensibles están protegidos con JWT y cada usuario solo accede a su propia información.

---

## Flujo general para el frontend

1. **Registro:** El usuario se registra y recibe un token JWT automáticamente.
2. **Login:** El usuario puede autenticarse y obtener un token JWT.
3. **Acceso protegido:** El frontend debe guardar el token y enviarlo en el header `Authorization` para acceder a los endpoints protegidos.
4. **Cálculo de IMC:** El usuario puede calcular su IMC y el resultado se guarda en su historial.
5. **Consulta de historial:** El usuario puede consultar todos sus cálculos previos.

---

## Endpoints principales

### 1. Registro de usuario

- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "usuario@correo.com",
    "password": "contraseñaSegura"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "access_token": "JWT_TOKEN"
  }
  ```
- **Errores posibles:**
  - Email inválido: 400
  - Contraseña muy corta: 400
  - Usuario ya existe: 409

### 2. Login de usuario

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "usuario@correo.com",
    "password": "contraseñaSegura"
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "access_token": "JWT_TOKEN"
  }
  ```
- **Errores posibles:**
  - Credenciales inválidas: 401

### 3. Calcular IMC y guardar en historial

- **POST** `/imc/calcular`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**

  ```json
  {
    "peso": 70,
    "altura": 1.75
  }
  ```

  - **peso**: en kilogramos (número entre 1 y 500)
  - **altura**: en metros (número entre 0.1 y 3)

- **Respuesta exitosa:**
  ```json
  {
    "imc": 22.86,
    "categoria": "Normal"
  }
  ```
- **Errores posibles:**
  - Token inválido o ausente: 401
  - Datos fuera de rango o inválidos: 400

### 4. Obtener historial del usuario autenticado

- **GET** `/historial`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Respuesta exitosa:**
  ```json
  [
    {
      "id": 1,
      "fecha": "2025-09-13T18:00:00.000Z",
      "peso": 70,
      "altura": 1.75,
      "imc": 22.86,
      "resultado": "Normal"
    },
    ...
  ]
  ```
- **Errores posibles:**
  - Token inválido o ausente: 401

---

## Validaciones y seguridad

- El email debe tener formato válido.
- La contraseña debe tener al menos 6 caracteres.
- El peso debe estar entre 1 y 500 kg.
- La altura debe estar entre 0.1 y 3 metros.
- Todos los endpoints protegidos requieren el token JWT en el header `Authorization`.
- Cada usuario solo accede a su propio historial y cálculos.
- Las contraseñas se almacenan hasheadas con bcrypt.

---

## Ejemplo de flujo completo para el frontend

1. **Registro:**
   - POST `/auth/register` → guardar `access_token` recibido.
2. **Login:**
   - POST `/auth/login` → guardar `access_token` recibido.
3. **Calcular IMC:**
   - POST `/imc/calcular` con el token en el header y los datos en el body.
   - Mostrar el resultado al usuario.
4. **Consultar historial:**
   - GET `/historial` con el token en el header.
   - Mostrar la lista de cálculos previos.

---

## Modelo de datos

- **User**: id, email, password (hasheada), historial (OneToOne)
- **Historial**: id, user (OneToOne), calculos (OneToMany)
- **Calculo**: id, fecha, peso, altura, imc, resultado, historial (ManyToOne)

---

## Errores comunes y cómo manejarlos en el frontend

- **401 Unauthorized:** Token inválido, ausente o expirado. Redirigir al login.
- **409 Conflict:** Email ya registrado. Mostrar mensaje claro al usuario.
- **400 Bad Request:** Datos inválidos (email, contraseña, peso, altura). Mostrar mensaje de validación.

---

## Recomendaciones para el frontend

- Guardar el JWT en localStorage o en memoria segura.
- Enviar siempre el token en el header `Authorization` para endpoints protegidos.
- Validar los datos antes de enviarlos (email, contraseña, peso, altura).
- Mostrar mensajes claros según el error recibido.
- No permitir acceso a historiales de otros usuarios.

---

## Notas técnicas

- Modularización con servicios, controladores y módulos separados.
- Uso de `TypeOrmModule.forFeature([User, Historial, Calculo])` para inyección de repositorios.
- Uso de bcrypt para hash y validación de contraseñas.
- Uso de JWT para autenticación y autorización.
