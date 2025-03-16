"use strict";
import * as d3 from "d3";

window.onload = () => main();

async function main() {
    const train_network_config = {
        width: 500,
        height: 500,
        center: [8.2275, 46.8182],
        scale: 7000
    };
    await create_train_network_map(train_network_config);
}

async function load_train_network_data() {
    const file_path = "./sbb_train_network.geojson";
    const response = await fetch(file_path);
    const data = await response.json();
    return data.features;
}

async function create_train_network_map(config) {
    const train_network_data = await load_train_network_data();

    const svg = d3.select(".train-network-map")
        .append("svg")
        .attr("width", config.width)
        .attr("height", config.height)

    const projection = d3.geoMercator()
        .center(config.center)
        .translate([config.width / 2, config.height / 2])
        .scale(config.scale);

    const path = d3.geoPath().projection(projection);
    svg.selectAll("g")
        .data(train_network_data)
        .enter()
        .append("g").each(function() {
            // "this" refers the the group element
            d3.select(this)
                .append("path")
                .attr("class", "train-track")
                .attr("d", path)
            d3.select(this)
                .append("text")
                .attr("class", "train-track-name")
                .attr("x", (d) => projection([d.properties["geo_point_2d"].lon, d.properties["geo_point_2d"].lat])[0])
                .attr("y", (d) => projection([d.properties["geo_point_2d"].lon, d.properties["geo_point_2d"].lat])[1])
                .text((d) => d.properties["linienname"])
        });

}
