// -------------------------------------------------------------------------
// Assignment 3: Choropleth map density (second plot)
// We want to show the density of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_2 = "#choropleth-map-density"

// Set the dimensions and margins of the graph
const margin_2 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_2 = 0.8;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
    //.attr("width", width_2 + margin_2.left + margin_2.right)
    //.attr("height", height_2 + margin_2.top + margin_2.bottom)
    .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
        ' ' + (height_2 + margin_2.top + margin_2.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_2)*width_2/2 + margin_2.left},
                                  ${(1-scaleFactor_2)*height_2/2 + margin_2.top})`);

// Title
svg_2.append("text")
    .attr("x", ((width_2 - ((1-scaleFactor_2)*width_2 + margin_2.left - margin_2.right)) / 2))             
    .attr("y", 0 - (((1-scaleFactor_2)*height_2 - margin_2.top) / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Density of trees in Trento's neighborhoods");

// Map and projection
const path2 = d3.geoPath();
var projection = d3.geoIdentity().reflectY(true)

// Data and color scale
const data_2_Density = new Map();
const data_2_Count = new Map(); 
const colorScale_2 = d3.scaleThreshold()
    .domain([0.0001, 0.0005, 0.001, 0.005, 0.01, 0.02])
    .range(d3.schemeGreens[7]);

// Add color legend
shapeWidthLegend_2 = 100;
const labels_2 = ['0-0.0001', '0.0001-0.0005', '0.0005-0.001', '0.001-0.005', '0.005- 0.01', ' 0.01- 0.02', '> 0.02'];
const legend_2_size = shapeWidthLegend_2*labels_2.length;

const legend_2 = d3.legendColor()
    .labels(function (d) { return labels_2[d.i]; })
    .shapePadding(0)
    .orient("horizontal")
    .shapeWidth(shapeWidthLegend_2)
    .scale(colorScale_2);

svg_2.append("g")
    .attr("class", "legendThreshold")
    .attr("font-family", "Fira Sans, sans-serif")
    .attr("font-size", "12px")
    .attr("transform", `translate(${(scaleFactor_2*width_2 - legend_2_size - (margin_2.left - margin_2.right))/2},
                                  ${height_2 - margin_2.bottom/2})`);

svg_2.select(".legendThreshold")
    .append("text")
        .attr("class", "caption")
        .attr("x", legend_2_size/2)
        .attr("y", -20)
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "14px")
        .attr("text-anchor", "middle")
        .text("Density");

svg_2.select(".legendThreshold")
    .call(legend_2);

// Create a tooltip
const tooltip_2 = d3.select(id_ref_2)
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
    d3.csv("../../data/assign3/assign3-plot2.csv", function (d) {
        data_2_Density.set(d["Circoscrizione"], +d["density"])
        data_2_Count.set(d['Circoscrizione'], +d['Count'])
    })])
    .then(function (loadData) {

        let topo = loadData[0]
        projection.fitSize([scaleFactor_2*width_2, 
                            scaleFactor_2*height_2], topo);

        // Draw the map
        svg_2.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
            // draw each country
            .attr("d", d3.geoPath().projection(projection))
            // set the color of each country
            .attr("fill", (d) => colorScale_2(data_2_Density.get(d.properties.nome)))
            .style("fill-opacity", "0.9")
            .attr("class", (d) => `circo${d.properties.numero_cir}`)
            .style("stroke", "white")
            .style("stroke-width", "1px");

        // Animations and filling of tooltip
        svg_2.join("g")
        .selectAll("path")
        // MouseOver
        .on("mouseover", function (event, d) {
            // Opacity 0.5 to all the neighborhoods
            svg_2.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")
                .transition("selected")
                .duration(300);
            
            // Select the specific neighborhood and
            var circo = d.properties.numero_cir;
            svg_2.selectAll(`.circo${circo}`)
                .style("stroke", "#000")
                .style("stroke-width", "2px")
                .style("fill-opacity", "1.0")
                .transition("selected")
                .duration(300);

            // Appear tooltip
            tooltip_2.transition("appear-box")
                .duration(300)
                .style("opacity", "0.9");
            
            // Tooltip content
            tooltip_2.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome +
                "</b><br>" + "Density: " + data_2_Density.get(d.properties.nome).toFixed(5) +
                "<br>" + "Tree Abundance: " + data_2_Count.get(d.properties.nome) +               
                "<br>" + "Area (Km\u00B2): " + (d.properties.area/Math.pow(10, 6)).toFixed(2) + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        // MouseOut
        .on("mouseout", function (event, d) {
            
            // All the neighborhoods to the original settings
            svg_2.selectAll("path")
                .style("stroke", "white")
                .style("stroke-width", "1px")
                .style("fill-opacity", "0.9")
                .transition("selected")
                .duration(300);
        });

        svg_2.selectAll("g")
        // MouseLeave
        .on("mouseleave", function (event, d) {
            // Disappear tooltip
            tooltip_2.transition("disappear-box")
                .duration(300)
                .style("opacity", "0.0");
        });

    });

