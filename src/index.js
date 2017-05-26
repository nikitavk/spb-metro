const data = require('./stations');

import * as d3 from "d3";
import TWEEN from 'tween.js';

const app = document.createElement('main');
document.getElementById('root').appendChild(app);

const svg = d3.select("main")
    .append("svg")
    .attr("width", 800)
    .attr("height", 800);

const lines = [];

for (let line of data.lines) {
    lines.push(data.stations.filter(s => s.line === line.number));
}

const colors = {};

for (let line of lines) {
    colors[line[0].line] = data.lines.filter(l => l.number === line[0].line)[0].color;
}

const realScale = 1000;

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

    return [(x - 467) * realScale, (y - 232) * realScale];
}

function drawLines() {
    const paths = svg.selectAll("path");

    paths.remove();

    for (let line of lines) {
        if (!line[0].tweenCoordinates) return;
        svg.append("path")
            .data([line])
            .attr("d", lineFunction)
            .attr("stroke", colors[line[0].line])
            .attr("stroke-width", 10)
            .attr("fill", "none");
    }
}

const scale = 0.5;

var lineFunction = d3.line()
    .x(function (d) { return d.tweenCoordinates[0] * scale; })
    .y(function (d) { return d.tweenCoordinates[1] * scale; })
    .curve(d3.curveCardinal);

for (let line of lines) {
    for (let s of line) {
        let coords = { x: s.coordinates[0], y: s.coordinates[1] };

        var rc = latLngToXY(s.realCoordinates); 
        let tween = new TWEEN.Tween(coords)
            .to({ x: rc[0], y: rc[1] }, 5000)
            .onUpdate(function () {
                s.tweenCoordinates = [this.x, this.y];
            })
            .start()
            .repeat(Infinity)
            .yoyo(true);
    }
}

requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
    drawLines();
}