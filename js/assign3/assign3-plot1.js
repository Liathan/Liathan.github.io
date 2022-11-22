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
    .domain([10, 100, 300, 500, 1000, 2000, 3000])
    .range(d3.schemeGreens[8]);


const tooltip_1 = d3.select(id_ref_1)
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
    d3.csv("../../data/assign3/assign3-plot1.csv", function (d) {
        data.set(d["Circoscrizione"], +d["Count"])
    })])
    .then(function (loadData) {

        let topo = loadData[0]
        projection.fitSize([width_1, height_1], topo)

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
        .attr("fill", (d) => colorScale(data.get(d.properties.nome)))
        .style("fill-opacity", "0.9")
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "white")

        svg_1.join("g")
        .selectAll("path")
        .on("mouseover", function (event, d) {
            // Select all the rect with this specific class (tree species)
            var circo = d.properties.numero_cir;
            svg_1.selectAll("path")
            .style("stroke","transparent")
            .style("fill-opacity", "0.5")
            .transition("selected")
            .duration(300)
            
            svg_1.selectAll(`.circo${circo}`)
            .style("fill-opacity", "1")
            .transition("selected")
            .duration(300)
            .style("stroke", "#000")
            .style("stroke-width", "2px")

            tooltip_1.transition("appear-box")
            .duration(300)
            .style("opacity", .9)
            .delay(1);
            
            console.log(d)

            // tooltip_1.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
            //     "</b><br>" + "Percentage: "+ count(d) + "%</span>")


            // ---------------- TODO --------------------
            // Aggiungere l'area corretta nel tooltip
            tooltip_1.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome +"</b><br>Tree Abundance: "+data.get(d.properties.nome)+
            "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
            // Select all the rect with this specific class (tree species)
            
            svg_1.selectAll("path")
            .style("stroke", "white")
            .style("stroke-width", "1")
            .style("fill-opacity", "0.9")
            .transition("selected")
            .duration(300) 
    
            tooltip_1.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
            });

    })

