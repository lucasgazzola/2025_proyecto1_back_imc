## Endpoints de Estadísticas

### 1. GET `/estadisticas/summary`

**Descripción:**
Devuelve estadísticas agregadas del usuario autenticado. Permite seleccionar el tipo de cálculo estadístico (media o mediana) mediante un parámetro opcional en la query.

**Uso desde el frontend:**

- Por defecto, calcula la **media** de los IMC:
  `/estadisticas/summary`
- Para calcular la **mediana** de los IMC:
  `/estadisticas/summary?estrategia=mediana`
- Si se envía cualquier otro valor o se omite, se usará la media.

**Parámetro de query:**

- `estrategia`: Permite elegir el método de cálculo del campo `promedioImc`. Valores posibles:
  - `media` (default)
  - `mediana`

**Ejemplo de respuesta:**

```json
{
  "promedioImc": 18.08,
  "variacionPeso": 11,
  "conteoCategorias": [
    {
      "categoria": "Bajo peso",
      "count": 2
    },
    {
      "categoria": "Normal",
      "count": 1
    }
  ]
}
```

**Notas:**

- Filtra por el usuario autenticado.
- Si no hay datos, devuelve:

```json
{
  "promedioImc": null,
  "variacionPeso": null,
  "conteoCategorias": []
}
```

---

### 2. GET `/historial`

**Descripción:**
Devuelve la serie temporal de cálculos del usuario autenticado.

**Respuesta:**

```json
[
  {
    "id": 20,
    "fecha": "2025-09-28T21:03:40.000Z",
    "peso": 68,
    "altura": 2,
    "imc": 17,
    "resultado": "Bajo peso"
  },
  {
    "id": 21,
    "fecha": "2025-09-28T21:03:52.000Z",
    "peso": 70,
    "altura": 2,
    "imc": 17.5,
    "resultado": "Bajo peso"
  },
  {
    "id": 22,
    "fecha": "2025-09-28T21:03:59.000Z",
    "peso": 79,
    "altura": 2,
    "imc": 19.75,
    "resultado": "Normal"
  }
  // ...
]
```

**Notas:**

- Filtra por el usuario autenticado.
- Si no hay datos, devuelve: `[]`

---

### Seguridad

- Todos los endpoints requieren autenticación JWT.
- Las estadísticas se filtran por el `userEmail` del usuario autenticado.

---

### Manejo de errores

- Si no hay datos, las respuestas son vacías pero bien formateadas (ver ejemplos arriba).
- Si el usuario no está autenticado, devuelve error 401.

---

### Consultas agregadas

- Las queries usan agregaciones SQL optimizadas (`AVG`, `COUNT`, `GROUP BY`, `ORDER BY`).
- Se recomienda paginación si la serie temporal es muy grande.

---

### DTOs

- `EstadisticasSummaryDto`: estructura para `/summary`.
- `EstadisticasSeriesDto`: estructura para `/series`.
