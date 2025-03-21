# Hotel API

Este proyecto es una API creada con el framework **NestJS** para administrar las habitaciones de un hotel y sus reservas.

## Tecnologías utilizadas
- NestJS
- GraphQL
- TypeScript
- PostgreSQL
- Prisma ORM
- Jest

- NestJS: Framework para Node.js que permite desarrollar aplicaciones escalables y modulares.

- GraphQL: Lenguaje de consulta para APIs que permite obtener datos de manera eficiente.

- TypeScript: Lenguaje de programación tipado que mejora la mantenibilidad del código.

- PostgreSQL: Sistema de gestión de bases de datos relacional utilizado para almacenar las habitaciones y reservas.

- Prisma ORM: Herramienta para interactuar con la base de datos de manera eficiente y con tipado seguro.

- Jest: Framework de testing para JavaScript/TypeScript.

## Pruebas unitarias

Se realizaron pruebas unitarias utilizando Jest. Sin embargo, solo se implementaron pruebas en el método createReservation del servicio ReservationService, ya que este método es el más complejo de la aplicación. Se buscó lograr un 100% de cobertura en este método como demostración de conocimientos sobre cómo hacer pruebas unitarias.

## Ejecución del proyecto
Para ejecutar el proyecto, asegúrate de tener en funcionamiento los contenedores creados por el archivo **docker-compose** compartido. Luego, sigue estos pasos:

1. Corre las migraciones del proyecto.
2. Ejecuta el archivo de semillas incluido en el proyecto. Este archivo creará 30 habitaciones, distribuidas de la siguiente manera:
   - 10 habitaciones **SINGLE**
   - 10 habitaciones **DOUBLE**
   - 10 habitaciones **PRESIDENTIAL**

## Estructura del proyecto
El proyecto está compuesto por dos tablas principales:
- **Room** (Habitaciones)
- **Reservation** (Reservaciones)

Así mismo, existen dos módulos principales:
- **Reservation**
- **Room**

## Endpoints principales
### Módulo Reservation

- **`cancelReservation(id: String): Reservation`**
  - Permite cancelar una reservación mediante su ID.

- **`createReservation(input: ReservationInput): Reservation`**
  - Crea una nueva reservación según las necesidades del usuario.

- **`getReservations(): [Reservation]`**
  - Devuelve todas las reservaciones sin importar su estado (**PENDING, CONFIRMED, CANCELLED, COMPLETED**).

- **`getReservationById(id: String): Reservation`**
  - Obtiene información de una reservación específica por su ID.

- **`getAvailableRooms(startDate: Date, endDate: Date): [Room]`**
  - Consulta las habitaciones disponibles para un rango de fechas determinado. También permite comparar costos según el tipo de habitación y la disponibilidad de vista exterior.

  

### Módulo Room

- **`getAvailableRoomTypes(): [RoomType]`**
  - Devuelve los tipos de habitaciones disponibles en el hotel.

- **`getRooms(): [Room]`**
  - Retorna todas las habitaciones registradas en el hotel.

- **`getRoomById(id: String): Room`**
  - Obtiene la información de una habitación específica mediante su ID.

- **`createRoom(input: RoomInput): Room`**
  - Crea una nueva habitación en el sistema.

- **`updateRoom(id: String, input: RoomInput): Room`**
  - Actualiza la información de una habitación existente.

- **`deleteRoom(id: String): Boolean`**
  - Elimina una habitación del sistema.



