// -------------------------------------------------------------------------
// Assignment 2: Small Multiple Scatterplot (fourth plot)
// We want to show the CO2 (y axis) with respect to some measures of trees 
// in Trento's territory. One scatterplot for different tree species.
// We analyze: Height (m), Diameter (cm), Canopy Size (m2), and Leaf area (m2).
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_4 = "#small-multiple-scatterplot"

const divisor = 70
const margin_4 = {top: 70, right: 20, bottom: 70, left: 70},
width_4 = 1024 - margin_4.left - margin_4.right,
height_4 = 768 - margin_4.top - margin_4.bottom;

const svg_4 = d3.select(id_ref_4)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", '0 0 ' + (width_4 + margin_4.left + margin_4.right) +
        ' ' + (height_4 + margin_4.top + margin_4.bottom))
        // .attr("width", width_4 + margin_4.left + margin_4.right)
        // .attr("height", height_4 + margin_4.top + margin_4.bottom)
    .append("g")
        .attr("transform", `translate(${margin_4.left}, ${margin_4.top})`);
        //.style("margin_4-bottom", "50px");

// Dimensions of plots
var smallWidth =  (width_4/3) - divisor/1.5
var smallHeight = (height_4/2) - divisor/1.5

// SelectBox to choose the measure to show
var selectItem_small_multiple_scatterplot_measure = document.getElementById("selection-small-multiple-scatterplot-measure");

// The selected measure
var measureHeading_4 = '';

// The possible tree species
var names_uniq = [];

// The possible measures (Height, CanopySize, Diameter, Leaf Area)
var subgroups_4 = [];

// X axis label
var x_label_4 = ["Height (m)", "Diameter (cm)", "Canopy size (m\u00B2)", "Leaf area (m\u00B2)"];

// Data
var data4 = [];
var dataBySpecies = [];

function draw4() {

    var data = data4;

    svg_4.selectAll("text")
        .remove();
    svg_4.selectAll(".plot4-axisX")
        .remove();
    svg_4.selectAll(".plot4-axisY")
        .remove();
    svg_4.selectAll("circle")
        .remove();

    // Selected measure
    measureHeading_4 = selectItem_small_multiple_scatterplot_measure.value;

    // Create a tooltip
    const tooltip = d3.select(id_ref_4)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

    //Title
    svg_4.append("text")
        .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2))             
        .attr("y", 0 - (margin_4.top / 1.424))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")  
        .text(`Correlation between ${measureHeading_4.replace("_", " ").toLowerCase()} and CO\u2082`);

    // X axis label
    svg_4.append("text")      // text label for the x axis
        .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2))
        .attr("y", (height_4 + divisor/1.5))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text(x_label_4[subgroups_4.indexOf(measureHeading_4)]);

    // Y axis label
    svg_4.append("text")
        .attr("x", (-height_4 / 2))
        .attr("y", -divisor/1.5)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("CO\u2082 (kg/yr)");

    var max_Y_4 = data.reduce((a, b) => Math.max(a, b['CO2']), -Infinity)
    max_Y_4 = (Math.ceil(max_Y_4 + (5/100*max_Y_4))/5)*5
    
    for(i = 0; i < 6; ++i)
    {
        var max_X_4 = data.reduce((a,b) => Math.max(a, b[measureHeading_4]), -Infinity)
        max_X_4 = (Math.ceil(max_X_4 + (5/100*max_X_4))/5)*5

        var x = d3.scaleLinear()
            .domain([0, max_X_4])
            .range([0, smallWidth]);
        svg_4.append("g")
            .attr("class", "plot4-axisX")
            .call(d3.axisBottom(x))
            .attr("transform", `translate(${(i % 3) * (smallWidth + divisor)}, ${smallHeight + i % 2 * (smallHeight + divisor)})`)
            .selectAll("text")
                .attr("transform", "translate(-10,10) rotate(-45)")
                .style("text-anchor", "center")
                .style("font-family", "Fira Sans, sans-serif")
                .style("font-size", "12px");

        var y = d3.scaleLinear()
            .domain([0, max_Y_4])
            .range([smallHeight, 0])
        svg_4.append("g")
            .attr("class", "plot4-axisY")
            .call(d3.axisLeft(y))
            .attr("transform", `translate(${(i % 3) * (smallWidth + divisor)}, ${i % 2 * (smallHeight + divisor)})`)
            .selectAll("text")
                .style("text-anchor", "end")
                .style("font-family", "Fira Sans, sans-serif")
                .style("font-size", "12px");

        svg_4.append('g')
        .selectAll("dot")
        .data(dataBySpecies[i])
        .join("circle")
        .attr("class", "class"+i)
        .attr("cx", d => x(d[measureHeading_4]) + (i % 3) * (smallWidth + divisor))
        .attr("cy", d => y(d['CO2']) + (i % 2) * (smallHeight + divisor))
        .attr("r", 0)
        .style("stroke", "black")
        .style("fill-opacity", 0.5)
        .style("stroke-opacity", 0.5)
        .style("fill", d => color(d["Species"]));

        // Title for subgraph
        svg_4.append("text")
            //.attr("x", (2*(i % 3)+1)/6 * (width_4 - (margin_4.left - margin_4.right)))           
            .attr("x", (i % 3) * (smallWidth + divisor) + smallWidth/2)
            //.attr("y", (i % 2)/2 * height_4)
            .attr("y", (i % 2) * (smallHeight + divisor) - 10)
            .style("class", "h2")
            .style("font-size", "16px")
            .attr("text-anchor", "middle")  
            //.style("text-decoration", "underline")  
            .text(names_uniq[i]);

        svg_4.selectAll("circle")
            .transition("loading")
            .duration(800)
            .attr("r", 4)
            .delay(function(d,i){return(i);});
    }

   // Animation and filling of tooltip
   svg_4.selectAll("circle")

   // MouseOver
   .on("mouseover", function (event, d) {
       
       // Select all circles
       svg_4.selectAll("circle")
           .transition("selected")
           .duration(300)
           .style("fill-opacity", 0.05)
           .style("stroke-opacity", 0);

       // Select all the circle with this specific class (tree species)
       idx_d = names_uniq.indexOf(d.Species);
       svg_4.selectAll(`.class${idx_d}`)
           .transition("selected")
           .duration(300)
           .style("fill-opacity", 1.0)
           .style("stroke-opacity", 1.0);

       tooltip.transition("appear-box")
           .duration(300)
           .style("opacity", .9)
           // Added to control the fact that the tooltip disappear if
           // we move between near boxes (horizontally)
           .delay(1);

       tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d.Species + "</b>" + 
           "<br>" + `${x_label_4[subgroups_4.indexOf(measureHeading_4)]}: ` + d[measureHeading_4] + 
           "<br>" + "CO2 (kg/yr): " + d.CO2 + "</span>")
           .style("left", (event.pageX) + "px")
           .style("top", (event.pageY - 28) + "px");
   })

   // MouseOut
   .on("mouseout", function (event, d) {

       // Select all circles
       svg_4.selectAll("circle")
           .transition("unselected")
           .duration(300)
           .style("fill-opacity", 0.5)
           .style("stroke-opacity", 0.5);

       // Select all the circle with this specific class (tree species)
       idx_d = names_uniq.indexOf(d.Species);
       svg_4.selectAll(`.class${idx_d}`)
       .transition("unselected")
       .duration(300)
       .style("fill-opacity", 0.5)
       .style("stroke-opacity", 0.5); 

       tooltip.transition("disappear-box")
           .duration(300)
           .style("opacity", 0);
   });
};

// Parse the data
d3.csv("../data/assign2-plot4.csv").then(function(data) {

    data4 = data;

    // Extract subgroups (possible measures)
    subgroups_4 = data.columns.slice(1,5);

    // Load possible options for "measures" in the selectBox
    for(j = 0; j < subgroups_4.length; ++j)
    {
        opt = new Option(subgroups_4[j].replace("_", " "), subgroups_4[j]);
        selectItem_small_multiple_scatterplot_measure.appendChild(opt);
    };

    dataBySpecies = Array()
    names_uniq = [...new Set(data.map(d => d.Species))];
    names_uniq.forEach( e => dataBySpecies.push(data.filter( d => d['Species'] === e)));

    draw4();

});