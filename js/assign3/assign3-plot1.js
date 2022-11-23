// -------------------------------------------------------------------------
// Assignment 3: Choropleth map abundance (first plot)
// We want to show the abundance of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_1 = "#choropleth-map-abundance"

// Set the dimensions and margins of the graph
const margin_1 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_1 = 0.8;

// Append the svg_1 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    //.attr("width", width_1 + margin_1.left + margin_1.right)
    //.attr("height", height_1 + margin_1.top + margin_1.bottom)
    .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) +
        ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_1)*width_1/2 + margin_1.left},
                                  ${(1-scaleFactor_1)*height_1/2 + margin_1.top})`);

// Title
svg_1.append("text")
    .attr("x", ((width_1 - ((1-scaleFactor_1)*width_1 + margin_1.left - margin_1.right)) / 2))             
    .attr("y", 0 - (((1-scaleFactor_1)*height_1 - margin_1.top) / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Aboundance of trees in Trento's neighborhoods");

// Map and projection
const path = d3.geoPath();
var projection = d3.geoIdentity().reflectY(true)

// Data and color scale
const data_1 = new Map();
const colorScale_1 = d3.scaleThreshold()
    .domain([100, 300, 500, 1000, 2000, 3000])
    .range(d3.schemeGreens[7]);

// Add color legend
shapeWidthLegend_1 = 70;
const labels_1 = ['0-100', '100-300', '300-500', '500-1000', '1000-2000', '2000-3000', '> 3000'];
const legend_1_size = shapeWidthLegend_1*labels_1.length;

const legend_1 = d3.legendColor()
    .labels(function (d) { return labels_1[d.i]; })
    .shapePadding(0)
    .orient("horizontal")
    .shapeWidth(shapeWidthLegend_1)
    .scale(colorScale_1);

svg_1.append("g")
    .attr("class", "legendThreshold")
    .attr("font-family", "Fira Sans, sans-serif")
    .attr("font-size", "12px")
    .attr("transform", `translate(${(scaleFactor_1*width_1 - legend_1_size - (margin_1.left - margin_1.right))/2},
                                  ${height_1 - margin_1.bottom/2})`);

svg_1.select(".legendThreshold")
    .append("text")
        .attr("class", "caption")
        .attr("x", legend_1_size/2)
        .attr("y", -20)
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .text("Abundance");

svg_1.select(".legendThreshold")
    .call(legend_1);

// Create a tooltip
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
        data_1.set(d["Circoscrizione"], +d["Count"])
    })])
    .then(function (loadData) {

        let topo = loadData[0]
        projection.fitSize([scaleFactor_1*width_1, 
                            scaleFactor_1*height_1], topo);

        // Draw the map
        svg_1.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            // draw each country
            .attr("d", d3.geoPath().projection(projection))
            // set the color of each country
            .attr("fill", (d) => colorScale_1(data_1.get(d.properties.nome)))
            .style("fill-opacity", "0.9")
            .attr("class", (d) => `circo${d.properties.numero_cir}`)
            .style("stroke", "white")
            .style("stroke-width", "1px");

        // Animations and filling of tooltip
        svg_1.join("g")
        .selectAll("path")
        // MouseOver
        .on("mouseover", function (event, d) {
            // Opacity 0.5 to all the neighborhoods
            svg_1.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")
                .transition("selected")
                .duration(300);
            
            // Select the specific neighborhood and
            var circo = d.properties.numero_cir;
            svg_1.selectAll(`.circo${circo}`)
                .style("stroke", "#000")
                .style("stroke-width", "2px")
                .style("fill-opacity", "1.0")
                .transition("selected")
                .duration(300);

            // Appear tooltip
            tooltip_1.transition("appear-box")
                .duration(300)
                .style("opacity", "0.9");
            
            // Tooltip content
            tooltip_1.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome +
                "</b><br>" + "Tree Abundance: " + data_1.get(d.properties.nome) +
                "<br>" + "Area (Km\u00B2): " + (d.properties.area/Math.pow(10, 6)).toFixed(2) + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        // MouseOut
        .on("mouseout", function (event, d) {
            
            // All the neighborhoods to the original settings
            svg_1.selectAll("path")
                .style("stroke", "white")
                .style("stroke-width", "1px")
                .style("fill-opacity", "0.9")
                .transition("selected")
                .duration(300);
        });

        svg_1.selectAll("g")
        // MouseLeave
        .on("mouseleave", function (event, d) {
            // Disappear tooltip
            tooltip_1.transition("disappear-box")
                .duration(300)
                .style("opacity", "0.0");
        });

    });

