# Documentación Backend API IMC

## Cambios realizados

- Integración de MySQL con TypeORM usando variables de entorno.
- Creación de entidades: `User`, `Historial`, `Calculo`.
- Relación uno a uno entre `User` y `Historial`.
- Relación uno a muchos entre `Historial` y `Calculo`.
- Persistencia de cálculos de IMC en el historial del usuario.
- Autenticación JWT: endpoints protegidos y acceso solo al historial propio.
- Contraseñas hasheadas con bcrypt en el registro y validadas en el login.
- Modularización con servicios, controladores y módulos separados.
- Uso de `TypeOrmModule.forFeature` para inyección de repositorios.
- Endpoints RESTful claros y seguros.

---

## Endpoints de la API

### 1. Registro de usuario

- **POST** `/auth/register`
- **Body:**

```json
{
  "email": "usuario@correo.com",
  "password": "contraseñaSegura"
}
```

- **Respuesta:**

```json
{
  "message": "Usuario registrado correctamente"
}
```

- La contraseña se guarda hasheada. El usuario se crea junto a su historial vacío.

---

### 2. Login de usuario

- **POST** `/auth/login`
- **Body:**

```json
{
  "email": "usuario@correo.com",
  "password": "contraseñaSegura"
}
```

- **Respuesta:**

```json
{
  "access_token": "JWT_TOKEN"
}
```

- Valida la contraseña hasheada con bcrypt.

---

### 3. Calcular IMC y guardar en historial

- **POST** `/imc/calcular`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**

```json
{
  "peso": 70,
  "altura": 175
}
```

- **Respuesta:**

```json
{
  "imc": 22.86,
  "categoria": "Normal"
}
```

- El cálculo se guarda automáticamente en el historial del usuario autenticado.

---

### 4. Obtener historial del usuario autenticado

- **GET** `/historial`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Respuesta:**

```json
[
  {
    "id": 1,
    "fecha": "2025-09-13T18:00:00.000Z",
    "peso": 70,
    "altura": 175,
    "imc": 22.86,
    "resultado": "Normal"
  },
  ...
]
```

- Devuelve solo los cálculos del historial del usuario autenticado.

---

## Modelo de datos

- **User**: id, email, password (hasheada), historial (OneToOne)
- **Historial**: id, user (OneToOne), calculos (OneToMany)
- **Calculo**: id, fecha, peso, altura, imc, resultado, historial (ManyToOne)

---

## Seguridad

- Contraseñas nunca se guardan en texto plano.
- JWT protege todos los endpoints sensibles.
- Cada usuario solo accede a su propio historial y cálculos.

---

## Recomendaciones para el frontend

- Usar `/auth/register` y `/auth/login` para autenticación.
- Guardar el JWT y enviarlo en el header `Authorization` en cada petición protegida.
- Usar `/imc/calcular` para registrar cálculos y `/historial` para mostrar el historial del usuario logueado.
- No mostrar ni permitir acceso a historiales o usuarios de otros usuarios.

---

## Ejemplo de flujo

1. Registrar usuario.
2. Loguear usuario → obtener token.
3. Calcular IMC → guardar cálculo en historial.
4. Consultar historial → ver solo los cálculos propios.

---

## Notas técnicas

- Modularización con servicios, controladores y módulos separados.
- Uso de `TypeOrmModule.forFeature([User, Historial, Calculo])` para inyección de repositorios.
- Uso de bcrypt para hash y validación de contraseñas.
- Uso de JWT para autenticación y autorización.
