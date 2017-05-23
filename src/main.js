// import 'pixi'
// import 'p2'
// import Phaser from 'phaser'

const stations = require('../assets/metro-spb.json');
const TWEEN = require('tween.js');

console.log(TWEEN);

console.log(stations);

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

const linesNumbers = [1, 2, 3, 4, 5];
let lines = [];

for (let line of linesNumbers) {
  lines.push(stations.filter(station => station.line === line));
}

function latLngToXY(c) {
  const mapWidth = 800;
  const mapHeight = 800;

  // get x value
  let x = (c[1] + 180) * (mapWidth / 360)

  // convert from degrees to radians
  let latRad = c[0] * Math.PI / 180;

  // get y value
  let mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  let y = (mapHeight / 2) - (mapWidth * mercN / (2 * Math.PI));

  return [(x -467.15)*500,(y - 232)*500];
}

function getLineColor(lineNumber) {
  switch (lineNumber) {
    case 1:
      return "red";
      break;
    case 2:
      return "blue";
      break;
    case 3:
      return "green";
      break;
    case 4:
      return "orange";
      break;
    case 5:
      return "purple";
      break;
  }
}

function drawLine(line) {
  ctx.beginPath();
  ctx.lineWidth = "5";
  ctx.strokeStyle = getLineColor(line[0].line);

  let c = latLngToXY(line[0].realCoordinates);
  ctx.moveTo(line[0].coordinates[0] / 4, line[0].coordinates[1] / 4);

  for (let station of line) {
    c = latLngToXY(station.realCoordinates);
    console.log(c);
    ctx.lineTo(station.coordinates[0] / 4, station.coordinates[1] / 4);
  }

  ctx.stroke(); // Draw it
}

function drawRealLine(line) {
  ctx.beginPath();
  ctx.lineWidth = "5";
  ctx.strokeStyle = getLineColor(line[0].line);

  let c = latLngToXY(line[0].realCoordinates);
  ctx.moveTo(c[0], c[1]);
  // ctx.moveTo(line[0].coordinates[0] / 4, line[0].coordinates[1] / 4);

  for (let station of line) {
    c = latLngToXY(station.realCoordinates);
    console.log(c);
    ctx.lineTo(c[0], c[1]);
    // ctx.lineTo(station.coordinates[0] / 4, station.coordinates[1] / 4);
  }

  ctx.stroke(); // Draw it
}

for (let line of lines) {
  //drawLine(line);
}

for (let line of lines) {
  drawRealLine(line);
}