// -------------------------------------------------------------------------
// Assignment 3: Choropleth map density (second plot)
// We want to show the density of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_4 = "#dot-density-map"

// Set the dimensions and margins of the graph
const margin_4 = { top: 20, right: 20, bottom: 70, left: 20 },
    width_4 = 1024 - margin_4.left - margin_4.right,
    height_4 = 768 - margin_4.top - margin_4.bottom;
    
// Scale factor on both dimensions (width and height)
const scaleFactor_4 = 0.8;

// Append the svg_4 object to the page
const svg_4 = d3.select(id_ref_4)
    .append("svg")
    //.attr("width", width_4 + margin_4.left + margin_4.right)
    //.attr("height", height_4 + margin_4.top + margin_4.bottom)
    .attr("viewBox", '0 0 ' + (width_4 + margin_4.left + margin_4.right) +
        ' ' + (height_4 + margin_4.top + margin_4.bottom))
    .append("g")
    .attr("transform", `translate(${(1-scaleFactor_4)*width_4/2 + margin_4.left},
                                  ${(1-scaleFactor_4)*height_4/2 + margin_4.top})`);

// Title
svg_4.append("text")
    .attr("x", ((width_4 - ((1-scaleFactor_4)*width_4 + margin_4.left - margin_4.right)) / 2))             
    .attr("y", 0 - (((1-scaleFactor_4)*height_4 - margin_4.top) / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Density of trees in Trento's neighborhoods");

// Map and projection
const path_4 = d3.geoPath();
var projection_4 = d3.geoIdentity().reflectY(true)

// Data and color scale
const colorDot = "green"

// const legend_4 = d3.legendColor()
//     .labels(function (d) { return labels_4[d.i]; })
//     .shapePadding(0)
//     .orient("horizontal")
//     .shapeWidth(shapeWidthLegend_4)
//     .scale(colorScale_4);

// svg_4.append("g")
//     .attr("class", "legendThreshold")
//     .attr("font-family", "Fira Sans, sans-serif")
//     .attr("font-size", "12px")
//     .attr("transform", `translate(${(scaleFactor_4*width_4 - legend_4_size - (margin_4.left - margin_4.right))/2},
//                                   ${height_4 - margin_4.bottom/2})`);

// svg_4.select(".legendThreshold")
//     .append("text")
//         .attr("class", "caption")
//         .attr("x", legend_4_size/2)
//         .attr("y", -20)
//         .style("font-family", "Fira Sans, sans-serif")
//         .style("font-size", "14px")
//         .attr("text-anchor", "middle")
//         .text("Density");

// svg_4.select(".legendThreshold")
//     .call(legend_4);

// Create a tooltip
const tooltip_4 = d3.select(id_ref_4)
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
    d3.json("../../data/raw_data/geo_data_trees.geojson"
    // , function (d) {
    //     data_4_Density.set(d["Circoscrizione"], +d["density"])
    //     data_4_Count.set(d['Circoscrizione'], +d['Count'])
    // }
    )])
    .then(function (loadData) {

        var topo = loadData[0]
        var trees = loadData[1]
        projection_4.fitSize([scaleFactor_4*width_4, 
                            scaleFactor_4*height_4], topo);

        // Draw the map
        svg_4.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath().projection(projection_4))
        // set the color of each country
        .attr("fill", "white")
        .style("fill-opacity", "0.9")
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "black")
        .style("stroke-width", "1px");
    
        trees.features.pop()

        svg_4.append("g")
        .selectAll("circle")
        .data(trees.features)
        .join("circle")
        .attr("cx", d => projection_4(d.geometry.coordinates)[0])
        .attr("cy", d => projection_4(d.geometry.coordinates)[1])
        .attr("r", "1")
        .attr("fill", colorDot)
        

        // Animations and filling of tooltip
        // svg_4.join("g")
        // .selectAll("path")
        // MouseOver
        // .on("mouseover", function (event, d) {
        //     // Opacity 0.5 to all the neighborhoods
        //     svg_4.selectAll("path")
        //         .style("stroke", "transparent")
        //         .style("fill-opacity", "0.5")
        //         .transition("selected")
        //         .duration(300);
            
        //     // Select the specific neighborhood and
        //     var circo = d.properties.numero_cir;
        //     svg_4.selectAll(`.circo${circo}`)
        //         .style("stroke", "#000")
        //         .style("stroke-width", "2px")
        //         .style("fill-opacity", "1.0")
        //         .transition("selected")
        //         .duration(300);

        //     // Appear tooltip
        //     tooltip_4.transition("appear-box")
        //         .duration(300)
        //         .style("opacity", "0.9");
            
        //     // Tooltip content
        //     tooltip_4.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome +
        //         "</b><br>" + "Density: " + data_4_Density.get(d.properties.nome).toFixed(5) +
        //         "<br>" + "Tree Abundance: " + data_4_Count.get(d.properties.nome) +               
        //         "<br>" + "Area (Km\u00B2): " + (d.properties.area/Math.pow(10, 6)).toFixed(2) + "</span>")
        //     .style("left", (event.pageX) + "px")
        //     .style("top", (event.pageY - 28) + "px");
        // })
        // // MouseOut
        // .on("mouseout", function (event, d) {
            
        //     // All the neighborhoods to the original settings
        //     svg_4.selectAll("path")
        //         .style("stroke", "white")
        //         .style("stroke-width", "1px")
        //         .style("fill-opacity", "0.9")
        //         .transition("selected")
        //         .duration(300);
        // });

        // svg_4.selectAll("g")
        // // MouseLeave
        // .on("mouseleave", function (event, d) {
        //     // Disappear tooltip
        //     tooltip_4.transition("disappear-box")
        //         .duration(300)
        //         .style("opacity", "0.0");
        // });

    });

