// -------------------------------------------------------------------------
// Assignment 3: Choropleth map density (second plot)
// We want to show the density of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_5 = "#dot-density-map-2"

// Set the dimensions and margins of the graph
const margin_5 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_5 = 1024 - margin_5.left - margin_5.right,
    height_5 = 768 - margin_5.top - margin_5.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_5 = 0.8;

// Append the svg_5 object to the page
const svg_5 = d3.select(id_ref_5)
    .append("svg")
    //.attr("width", width_5 + margin_5.left + margin_5.right)
    //.attr("height", height_5 + margin_5.top + margin_5.bottom)
    .attr("viewBox", '0 0 ' + (width_5 + margin_5.left + margin_5.right) +
        ' ' + (height_5 + margin_5.top + margin_5.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_5)*width_5/2 + margin_5.left},
                                  ${(1-scaleFactor_5)*height_5/2 + margin_5.top})`);

// Title
svg_5.append("text")
    .attr("x", ((width_5 - ((1-scaleFactor_5)*width_5 + margin_5.left - margin_5.right)) / 2))             
    .attr("y", 0 - (((1-scaleFactor_5)*height_5 - margin_5.top) / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Density of trees in Trento's neighborhoods");

// Map and projection
const path_5 = d3.geoPath();
var projection_5 = d3.geoIdentity().reflectY(true)


// Create a tooltip
const tooltip_5 = d3.select(id_ref_5)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// Load external data and boot
Promise.all([
    d3.json("../../data/raw_data/circoscrizioni.json"),
    d3.json("../../data/raw_data/geo_data_trees.geojson")])
    .then(function (loadData) {

        var topo = loadData[0]
        var trees = loadData[1]
        projection_5.fitSize([scaleFactor_5*width_5, 
                            scaleFactor_5*height_5], topo);

        // Draw the map
        svg_5.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath().projection(projection_5))
        // set the color of each country
        .attr("fill", "white")
        .style("fill-opacity", "0.9")
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "black")
        .style("stroke-width", "1px");
    
        trees.features.pop()

        svg_5.append("g")
        .selectAll("circle")
        .data(trees.features)
        .join("circle")
        .attr("cx", d => projection_5(d.geometry.coordinates)[0])
        .attr("cy", d => projection_5(d.geometry.coordinates)[1])
        .attr("r", "2")
        .attr("fill", (d) => color.domain().includes(d.properties.Name) ? color(d.properties.Name) : color("Others"))

    });

