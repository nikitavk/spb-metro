const stations = require('../assets/metro-spb.json');
const TWEEN = require('tween.js');

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

  return [(x - 467.15) * 1200 + 100, (y - 232) * 1200];
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

const scale = 0.5;

function drawLine(line) {
  ctx.beginPath();
  ctx.lineWidth = "10";
  ctx.strokeStyle = getLineColor(line[0].line);

  ctx.moveTo(line[0].tweenCoordinates[0] * scale, line[0].tweenCoordinates[1] * scale);

  for (let station of line) {
    ctx.lineTo(station.tweenCoordinates[0] * scale, station.tweenCoordinates[1] * scale);
  }

  ctx.stroke();
}

for (let line of lines) {
  for (let s of line) {
    var coords = { x: s.coordinates[0], y: s.coordinates[1] };
    let rc = latLngToXY(s.realCoordinates);
    var tween = new TWEEN.Tween(coords)
      .to({ x: rc[0], y: rc[1] }, 5000)
      .onUpdate(function () {
        s.tweenCoordinates = [this.x, this.y];
      })
      .start()
      .repeat(Infinity)
      .yoyo(true);
  }
}

function drawLines() {
  ctx.clearRect(0, 0, c.width, c.height);

  for (let line of lines) {
    drawLine(line);
  }

}

requestAnimationFrame(animate);

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
  drawLines();
}