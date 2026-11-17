-- Создаёт таблицы проекта. БД и пользователь создаются контейнером из docker-compose.yml
-- (либо вручную от лица postgres: CREATE USER exampleuser ...; CREATE DATABASE exampledb OWNER exampleuser;).
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
    id uuid PRIMARY KEY,
    rating double precision NOT NULL,
    director varchar NOT NULL,
    tags text[] NOT NULL DEFAULT '{}',
    title varchar NOT NULL,
    about varchar NOT NULL,
    description text NOT NULL,
    image varchar NOT NULL,
    cover varchar NOT NULL
);

CREATE TABLE schedules (
    id uuid PRIMARY KEY,
    daytime varchar NOT NULL,
    hall varchar NOT NULL,
    rows integer NOT NULL,
    seats integer NOT NULL,
    price double precision NOT NULL,
    taken text[] NOT NULL DEFAULT '{}',
    film_id uuid NOT NULL REFERENCES films (id) ON DELETE CASCADE
);

CREATE INDEX schedules_film_id_idx ON schedules (film_id);
