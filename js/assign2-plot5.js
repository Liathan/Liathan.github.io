// -------------------------------------------------------------------------
// Assignment 2: BubbleChart (fifth plot)
// We want to show the canopy size with respect to a tree size, such as
// height, diameter, or leaf area, and the CO2 sequestratede of each top-6
// tree species in Trento's territory.
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_5 = "#bubblechart-canopysize"

// Set the dimensions and margins of the graph
const margin_5 = {top: 50, right: 20, bottom: 70, left: 70},
    width_5 = 1024 - margin_5.left - margin_5.right,
    height_5 = 768 - margin_5.top - margin_5.bottom;

// Append the svg_5 object to the page
const svg_5 = d3.select(id_ref_5)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_5 + margin_5.left + margin_5.right)
        //.attr("height", height_5 + margin_5.top + margin_5.bottom)
        .attr("viewBox", '0 0 ' + (width_5 + margin_5.left + margin_5.right) +
            ' ' + (height_5 + margin_5.top + margin_5.bottom))
    .append("g")
        .attr("transform", `translate(${margin_5.left}, ${margin_5.top})`);

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

// SelectBox to choose the measure to show
var selectItem_bubblechart_measure = document.getElementById("selection-bubblechart-measure");

// The selected measure
var measureHeading_5 = '';

// The possible tree species
var tree_species_5 = [];

// The possible measures (Height, CanopySize, Diameter, Leaf Area)
var subgroups_5 = [];

// X axis label
var x_label_5 = ["Height (m)", "Diameter (cm)", "Leaf area (m\u00B2)"];

// Data
var data5 = [];

// Parse the Data
d3.csv('../data/assign2-plot5.csv').then(function(data) {

    // Save data in a shared variable
    data5 = data;

    // Recall the top-6 tree names, without "Others"
    tree_species_5 = color.domain().slice(0,6);
    
    // Extract subgroups (possible measures)
    subgroups_5 = data.columns.slice(1,4);

    // Load possible options for "measures" in the selectBox
    for(j = 0; j < subgroups_5.length; ++j)
    {
        opt = new Option(subgroups_5[j].replace("_", " "), subgroups_5[j]);
        selectItem_bubblechart_measure.appendChild(opt);
    };


    var max_X_5 = d3.max(data, (d) => +d["Height"]) // il più serve a convertire le stringhe in numeri. JS ....
    max_X_5 = Math.ceil(max_X_5+(5/100*max_X_5))
    var max_Y_5 = d3.max(data, (d) => +d["CO2"])
    max_Y_5 = Math.ceil(max_Y_5 + (5/100*max_Y_5))
    var max_Z_5 = d3.max(data, d => +d["Canopy_size"])
    max_Z_5 = Math.ceil(max_Z_5+(5/100*max_Z_5))

    // const color = d3.scaleOrdinal()
    // .domain(trees)
    // .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);

    var x = d3.scaleLinear()
        .domain([0, max_X_5])
        .range([0, width_5])
    svg_5.append("g")
        .attr("class", "plot5-axisX")
        .attr("transform", `translate(0, ${height_5})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
            .style("text-anchor", "center")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");
    
    // X axis label
    svg_5.append("text")      // text label for the x axis
        .attr("x", (width_5 / 2))
        .attr("y", (height_5 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Height");
    


    var y = d3.scaleLinear()
        .domain([0, max_Y_5])
        .range([height_5, 0])
    svg_5.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");
   
    // Y axis label
    svg_5.append("text")
        .attr("x", (-height_5 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("CO\u2082 (kg/yr)");

    const z = d3.scaleSqrt()
    .domain([0, max_Z_5])
    .range([0, 25])

    svg_5.append("g")
    .selectAll(".bubble")
    .data(data)
    .join("circle")
        .attr("class", d => `class${tree_species_5.indexOf(d.Species)}`)
        .attr("cx", (d) => x(d["Height"]))
        .attr("cy", d => y(d["CO2"]))
        .attr("r", d => z(0))
        .attr("stroke", "black")
        .attr("fill", d => color(d["Species"]))
        .attr("fill-opacity", 0.5);
    
    // Animations
    svg_5.selectAll("circle")
        .transition("loading")
        .duration(800)
        .attr("r", d => z(d["Canopy_size"]))
        .delay(function(d,i){return(i);});

    // Animation and filling of tooltip
    svg_5.selectAll("circle")

    // MouseOver
    .on("mouseover", function (event, d) {
        
        // Select all circles
        svg_5.selectAll("circle")
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 0)
            .attr("fill-opacity", 0.05);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species_5.indexOf(d.Species);
        svg_5.selectAll(`.class${idx_d}`)
            .transition("selected")
            .duration(300)
            .attr("stroke-opacity", 1.0)
            .attr("fill-opacity", 1.0);

        tooltip.transition("appear-box")
            .duration(300)
            .style("opacity", .9)
            // Added to control the fact that the tooltip disappear if
            // we move between near boxes (horizontally)
            .delay(1);

        tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d.Species + "</b>" + 
            "<br>" + `${x_label_3[subgroups_3.indexOf(measureHeading_3)]}: ` + d[measureHeading_3] + 
            "<br>" + "CO2 (kg/yr): " + d.CO2 + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })

    // MouseOut
    .on("mouseout", function (event, d) {

        // Select all circles
        svg_5.selectAll("circle")
            .transition("unselected")
            .duration(300)
            .attr("stroke-opacity", 0.5)
            .attr("fill-opacity", 0.5);

        // Select all the circle with this specific class (tree species)
        idx_d = tree_species_5.indexOf(d.Species);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .attr("stroke-opacity", 0.5)
        .attr("fill-opacity", 0.5); 

        tooltip.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
    });
});

//     // Load possible options for "measures" in the selectBox
//     for(j = 0; j < subgroups_1.length; ++j)
//     {
//         opt = new Option(subgroups_1[j].replace("_", " "), subgroups_1[j]);
//         selectItem_hist_measure.appendChild(opt);
//     };

//     // Take the selected item from the selectBox
//     measureHeading_1 = selectItem_hist_measure.value;

//     // Take the selected number of bins
//     n_bins_1 = selectItem_hist_n_bins.value;

//     // Extracting and preparing data for each measure plot
//     tmp_height = [];
//     tmp_canopy = [];
//     tmp_diameter = [];
//     tmp_leafarea = [];
//     for(k = 0; k < data.length; ++k)
//     {
//         tmp_height.push(data[k][subgroups_1[0]]);
//         tmp_canopy.push(data[k][subgroups_1[1]]);
//         tmp_diameter.push(data[k][subgroups_1[2]]);
//         tmp_leafarea.push(data[k][subgroups_1[3]]);
//     };

//     plotData_1[subgroups_1[0]] = tmp_height;
//     plotData_1[subgroups_1[1]] = tmp_canopy;
//     plotData_1[subgroups_1[2]] = tmp_diameter;
//     plotData_1[subgroups_1[3]] = tmp_leafarea;

//     // Max value on x axis
//     max_width_1 = ((Math.ceil(Math.max(...plotData_1[measureHeading_1])/5)*5)+5);

//   // ---------------------------//
//   //       AXIS  AND SCALE      //
//   // ---------------------------//

//   // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 45000])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).ticks(3));

//   // Add X axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", width)
//       .attr("y", height+50 )
//       .text("Gdp per Capita");

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([35, 90])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));

//   // Add Y axis label:
//   svg.append("text")
//       .attr("text-anchor", "end")
//       .attr("x", 0)
//       .attr("y", -20 )
//       .text("Life expectancy")
//       .attr("text-anchor", "start")

//   // Add a scale for bubble size
//   var z = d3.scaleSqrt()
//     .domain([200000, 1310000000])
//     .range([ 2, 30]);

//   // Add a scale for bubble color
//   var myColor = d3.scaleOrdinal()
//     .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
//     .range(d3.schemeSet1);


//   // ---------------------------//
//   //      TOOLTIP               //
//   // ---------------------------//

//   // -1- Create a tooltip div that is hidden by default:
//   var tooltip = d3.select("#my_dataviz")
//     .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "black")
//       .style("border-radius", "5px")
//       .style("padding", "10px")
//       .style("color", "white")

//   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
//   var showTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//     tooltip
//       .style("opacity", 1)
//       .html("Country: " + d.country)
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var moveTooltip = function(d) {
//     tooltip
//       .style("left", (d3.mouse(this)[0]+30) + "px")
//       .style("top", (d3.mouse(this)[1]+30) + "px")
//   }
//   var hideTooltip = function(d) {
//     tooltip
//       .transition()
//       .duration(200)
//       .style("opacity", 0)
//   }


//   // ---------------------------//
//   //       HIGHLIGHT GROUP      //
//   // ---------------------------//

//   // What to do when one group is hovered
//   var highlight = function(d){
//     // reduce opacity of all groups
//     d3.selectAll(".bubbles").style("opacity", .05)
//     // expect the one that is hovered
//     d3.selectAll("."+d).style("opacity", 1)
//   }

//   // And when it is not hovered anymore
//   var noHighlight = function(d){
//     d3.selectAll(".bubbles").style("opacity", 1)
//   }


//   // ---------------------------//
//   //       CIRCLES              //
//   // ---------------------------//

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(data)
//     .enter()
//     .append("circle")
//       .attr("class", function(d) { return "bubbles " + d.continent })
//       .attr("cx", function (d) { return x(d.gdpPercap); } )
//       .attr("cy", function (d) { return y(d.lifeExp); } )
//       .attr("r", function (d) { return z(d.pop); } )
//       .style("fill", function (d) { return myColor(d.continent); } )
//     // -3- Trigger the functions for hover
//     .on("mouseover", showTooltip )
//     .on("mousemove", moveTooltip )
//     .on("mouseleave", hideTooltip )



//     // ---------------------------//
//     //       LEGEND              //
//     // ---------------------------//

//     // Add legend: circles
//     var valuesToShow = [10000000, 100000000, 1000000000]
//     var xCircle = 390
//     var xLabel = 440
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("circle")
//         .attr("cx", xCircle)
//         .attr("cy", function(d){ return height - 100 - z(d) } )
//         .attr("r", function(d){ return z(d) })
//         .style("fill", "none")
//         .attr("stroke", "black")

//     // Add legend: segments
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("line")
//         .attr('x1', function(d){ return xCircle + z(d) } )
//         .attr('x2', xLabel)
//         .attr('y1', function(d){ return height - 100 - z(d) } )
//         .attr('y2', function(d){ return height - 100 - z(d) } )
//         .attr('stroke', 'black')
//         .style('stroke-dasharray', ('2,2'))

//     // Add legend: labels
//     svg
//       .selectAll("legend")
//       .data(valuesToShow)
//       .enter()
//       .append("text")
//         .attr('x', xLabel)
//         .attr('y', function(d){ return height - 100 - z(d) } )
//         .text( function(d){ return d/1000000 } )
//         .style("font-size", 10)
//         .attr('alignment-baseline', 'middle')

//     // Legend title
//     svg.append("text")
//       .attr('x', xCircle)
//       .attr("y", height - 100 +30)
//       .text("Population (M)")
//       .attr("text-anchor", "middle")

//     // Add one dot in the legend for each name.
//     var size = 20
//     var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"]
//     svg.selectAll("myrect")
//       .data(allgroups)
//       .enter()
//       .append("circle")
//         .attr("cx", 390)
//         .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .attr("r", 7)
//         .style("fill", function(d){ return myColor(d)})
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)

//     // Add labels beside legend dots
//     svg.selectAll("mylabels")
//       .data(allgroups)
//       .enter()
//       .append("text")
//         .attr("x", 390 + size*.8)
//         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//         .style("fill", function(d){ return myColor(d)})
//         .text(function(d){ return d})
//         .attr("text-anchor", "left")
//         .style("alignment-baseline", "middle")
//         .on("mouseover", highlight)
//         .on("mouseleave", noHighlight)
//   })