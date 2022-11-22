const id_ref_1 = "#choropleth-map-abundance"

// Set the dimensions and margins of the graph
const margin_1 = { top: 50, right: 20, bottom: 70, left: 20 },
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;

// Append the svg_1 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    //.attr("width", width_1 + margin_1.left + margin_1.right)
    //.attr("height", height_1 + margin_1.top + margin_1.bottom)
    .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) +
        ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

// Map and projection
const path = d3.geoPath();
var projection = d3.geoIdentity().reflectY(true)
// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
.domain([10, 100, 200, 500, 1000, 2000])
.range(d3.schemeGreens[7]);


var pippo, pluto;
// Load external data and boot
Promise.all([
    d3.json("../../data/raw_data/circoscrizioni.json"),
    d3.csv("../../data/assign3/assign3-plot1.csv", function (d) {
        data.set(d["Circoscrizione"], +d["Count"])
    })])
    .then(function (loadData)
    {
        pluto = loadData[0].features
        let topo = loadData[0]
        console.log("AAAAAAAAAAAa")
        console.log(loadData)
        projection.fitSize([width_1, height_1], topo)
        pippo = loadData

        // Draw the map
        svg_1.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
                console.log(data.get(d.properties.nome))
                return colorScale(data.get(d.properties.nome));
            })
        .style("stroke", "#fff")


        
    })

