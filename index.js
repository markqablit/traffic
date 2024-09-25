const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5000;

const cors = require('cors'); // Импортируйте пакет cors
app.use(cors()); 
// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'node_post',
  password: 'Qablit79',
  port: 5432,
});

app.use(express.json());

async function getStations(){
  fetch('https://api.hh.ru/metro/1')
    .then(response => response.json())
    .then(data => {
    const allStations = data.lines.flatMap(line =>
      line.stations.map(station => ({
        name: station.name,               // Название станции
        line: line.name,                  // Линия станции
        lineColor: line.hex_color,        // Цвет линии
        latitude: station.lat,            // Широта станции
        longitude: station.lng            // Долгота станции
      }))
    );
    console.log(allStations[0].name);
    return allStations;
    })
};
// Пример маршрута для проверки работы сервера
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Пример маршрута для получения данных из базы
app.get('/roads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roads');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/metro_stations', async (req, res) => {
  try {
    //const allStations = await getStations();
    const result = await pool.query('SELECT * FROM metro_stations');
    console.log("[eq");

    res.json(result.rows);
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
