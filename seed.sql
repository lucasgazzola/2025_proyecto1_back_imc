-- -- Limpiar tablas (respetar orden por claves foráneas)
-- DELETE FROM calculo;
-- DELETE FROM historial;
-- DELETE FROM user;

-- -- Insertar historiales primero (ya que user.historialId es FK única)
-- INSERT INTO historial (id) VALUES
-- (1),
-- (2),
-- (3);

-- -- Insertar usuarios con sus historiales
-- INSERT INTO user (id, email, password, historialId)
-- VALUES
-- (1, 'juan.perez@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36rF9Wf/6dK9Y3dF8sXK3b.', 1),
-- (2, 'maria.gomez@example.com', '$2b$10$7s1rGvYh7XG7J1g2iLq8ueVXtLVyQb3Dg.6N4J9NnRj3eF1QkP3sG', 2),
-- (3, 'lucas.rodriguez@example.com', '$2b$10$9vQZn8F5eT.QdQqD/0/UsOmZ7W8hRrO1a5U8mU6vC2N3zLk0yVp3K', 3);
-- SE OPTÓ POR CREAR USUARIOS A MANO POR EL HASH DE LAS CONTRASEÑAS

-- Insertar cálculos para cada usuario (10 cada uno)
-- Usuario 1 - Juan
INSERT INTO calculo (id, fecha, peso, altura, imc, resultado, historialId) VALUES
(1, '2024-01-15', 70, 1.75, 22.86, 'Normal', 1),
(2, '2024-02-10', 72, 1.75, 23.51, 'Normal', 1),
(3, '2024-03-05', 74, 1.75, 24.16, 'Normal', 1),
(4, '2024-04-20', 76, 1.75, 24.81, 'Normal', 1),
(5, '2024-05-15', 78, 1.75, 25.47, 'Sobrepeso', 1),
(6, '2024-06-18', 80, 1.75, 26.12, 'Sobrepeso', 1),
(7, '2024-07-12', 82, 1.75, 26.77, 'Sobrepeso', 1),
(8, '2024-08-01', 85, 1.75, 27.76, 'Sobrepeso', 1),
(9, '2024-09-25', 88, 1.75, 28.73, 'Sobrepeso', 1),
(10, '2025-01-05', 90, 1.75, 29.39, 'Sobrepeso', 1);

-- Usuario 2 - María
INSERT INTO calculo (id, fecha, peso, altura, imc, resultado, historialId) VALUES
(11, '2024-01-22', 50, 1.60, 19.53, 'Normal', 2),
(12, '2024-02-14', 48, 1.60, 18.75, 'Normal', 2),
(13, '2024-03-11', 47, 1.60, 18.36, 'Bajo peso', 2),
(14, '2024-04-08', 49, 1.60, 19.14, 'Normal', 2),
(15, '2024-05-30', 52, 1.60, 20.31, 'Normal', 2),
(16, '2024-06-25', 55, 1.60, 21.48, 'Normal', 2),
(17, '2024-07-19', 57, 1.60, 22.27, 'Normal', 2),
(18, '2024-08-21', 60, 1.60, 23.44, 'Normal', 2),
(19, '2024-09-15', 62, 1.60, 24.22, 'Normal', 2),
(20, '2025-01-10', 65, 1.60, 25.39, 'Sobrepeso', 2);

-- Usuario 3 - Lucas
INSERT INTO calculo (id, fecha, peso, altura, imc, resultado, historialId) VALUES
(21, '2024-01-28', 90, 1.80, 27.78, 'Sobrepeso', 3),
(22, '2024-02-20', 92, 1.80, 28.40, 'Sobrepeso', 3),
(23, '2024-03-16', 95, 1.80, 29.32, 'Sobrepeso', 3),
(24, '2024-04-12', 98, 1.80, 30.25, 'Obesidad', 3),
(25, '2024-05-09', 100, 1.80, 30.86, 'Obesidad', 3),
(26, '2024-06-04', 102, 1.80, 31.48, 'Obesidad', 3),
(27, '2024-07-01', 105, 1.80, 32.41, 'Obesidad', 3),
(28, '2024-08-18', 107, 1.80, 33.02, 'Obesidad', 3),
(29, '2024-09-10', 110, 1.80, 33.95, 'Obesidad', 3),
(30, '2025-01-20', 112, 1.80, 34.57, 'Obesidad', 3);