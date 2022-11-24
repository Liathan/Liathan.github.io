// -------------------------------------------------------------------------
// Assignment 3: Choropleth map Oxygen (second plot)
// We want to show the Oxygen of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_3 = "#choropleth-map-oxygen"

// Set the dimensions and margins of the graph
const margin_3 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_3 = 0.8;

// Append the svg_3 object to the page
const svg_3 = d3.select(id_ref_3)
    .append("svg")
    //.attr("width", width_3 + margin_3.left + margin_3.right)
    //.attr("height", height_3 + margin_3.top + margin_3.bottom)
    .attr("viewBox", '0 0 ' + (width_3 + margin_3.left + margin_3.right) +
        ' ' + (height_3 + margin_3.top + margin_3.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_3)*width_3/2 + margin_3.left},
                                  ${(1-scaleFactor_3)*height_3/2 + margin_3.top})`);

// Title
svg_3.append("text")
    .attr("x", ((width_3 - ((1-scaleFactor_3)*width_3 + margin_3.left - margin_3.right)) / 2))             
    .attr("y", 0 - (((1-scaleFactor_3)*height_3 - margin_3.top) / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Oxygen production of trees in Trento's neighborhoods");

// Map and projection
const path3 = d3.geoPath();
var projection = d3.geoIdentity().reflectY(true)

// Data and color scale
const data_3_Oxygen = new Map();
const data_3_Count = new Map(); 
const colorScale_3 = d3.scaleThreshold()
    .domain([ 1000, 2000, 4000, 10000,50000, 53818.4])
    .range(d3.schemeBlues[6]);

// Add color legend
shapeWidthlegend_3 = 100;
const labels_3 = ['0', '1000', '2000', '4000', '10000', '50000',];
const legend_3_size = shapeWidthlegend_3*labels_3.length;

const legend_3 = d3.legendColor()
    .labels(function (d) { return labels_3[d.i]; })
    .shapePadding(0)
    .orient("horizontal")
    .shapeWidth(shapeWidthlegend_3)
    .scale(colorScale_3)
    .labelAlign("start") ;
svg_3.append("g")
    .attr("class", "legendThreshold")
    .attr("font-family", "Fira Sans, sans-serif")
    .attr("font-size", "12px")
    .attr("transform", `translate(${(scaleFactor_3*width_3 - legend_3_size - (margin_3.left - margin_3.right))/2},
                                  ${height_3 - margin_3.bottom/2})`);

svg_3.select(".legendThreshold")
    .append("text")
        .attr("class", "caption")
        .attr("x", legend_3_size/2)
        .attr("y", -20)
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .text("Oxygen (kg/yr)");

svg_3.select(".legendThreshold")
    .call(legend_3);

// Create a tooltip
const tooltip_3 = d3.select(id_ref_3)
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
    d3.csv("../../data/assign3/assign3-plot3.csv", function (d) {
        data_3_Oxygen.set(d["Circoscrizione"], +d["Oxygen(kg/yr)"])
        data_3_Count.set(d['Circoscrizione'], +d['Count'])
    })])
    .then(function (loadData) {

        let topo = loadData[0]
        projection.fitSize([scaleFactor_3*width_3, 
                            scaleFactor_3*height_3], topo);

        // Draw the map
        svg_3.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            // draw each country
            .attr("d", d3.geoPath().projection(projection))
            // set the color of each country
            .attr("fill", (d) => colorScale_3(data_3_Oxygen.get(d.properties.nome)))
            .style("fill-opacity", "0.9")
            .attr("class", (d) => `circo${d.properties.numero_cir}`)
            .style("stroke", "white")
            .style("stroke-width", "1px");

        // Animations and filling of tooltip
        svg_3.join("g")
        .selectAll("path")
        // MouseOver
        .on("mouseover", function (event, d) {
            // Opacity 0.5 to all the neighborhoods
            svg_3.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")
                .transition("selected")
                .duration(300);
            
            // Select the specific neighborhood and
            var circo = d.properties.numero_cir;
            svg_3.selectAll(`.circo${circo}`)
                .style("stroke", "#000")
                .style("stroke-width", "2px")
                .style("fill-opacity", "1.0")
                .transition("selected")
                .duration(300);

            // Appear tooltip
            tooltip_3.transition("appear-box")
                .duration(300)
                .style("opacity", "0.9");
            
            // Tooltip content
            tooltip_3.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome +
                "</b><br>" + "Oxygen (kg/yr): " + data_3_Oxygen.get(d.properties.nome).toFixed(1) +
                "<br>" + "Tree Abundance: " + data_3_Count.get(d.properties.nome) +               
                "<br>" + "Area (Km\u00B2): " + (d.properties.area/Math.pow(10, 6)).toFixed(2) + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        // MouseOut
        .on("mouseout", function (event, d) {
            
            // All the neighborhoods to the original settings
            svg_3.selectAll("path")
                .style("stroke", "white")
                .style("stroke-width", "1px")
                .style("fill-opacity", "0.9")
                .transition("selected")
                .duration(300);
        });

        svg_3.selectAll("g")
        // MouseLeave
        .on("mouseleave", function (event, d) {
            // Disappear tooltip
            tooltip_3.transition("disappear-box")
                .duration(300)
                .style("opacity", "0.0");
        });

    });

