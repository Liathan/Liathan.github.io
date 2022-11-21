// -------------------------------------------------------------------------
// Assignment 2: Boxplot (second plot)
// We want to show the distribution (via boxplot) of some measures of trees 
// in Trento's territory. 
// We analyze: Height (m), Canopy Size (m2), Diameter (cm), and Leaf Area (m2).
//--------------------------------------------------------------------------


// Refer to the id dive
const id_ref_2 = "#boxplot-tree-size"

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 20, bottom: 70, left: 70},
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_2 + margin_2.left + margin_2.right)
        //.attr("height", height_2 + margin_2.top + margin_2.bottom)
        .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
            ' ' + (height_2 + margin_2.top + margin_2.bottom))
        .append("g")
            .attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);

// SelectBox to choose the measure to show
var selectItem_boxplot_measure = document.getElementById("selection-boxplot-measure");

// The selected measure
var measureHeading_2 = '';

// The possible measures (Height, CanopySize, Diameter, Leaf Area)
var subgroups_2 = [];

// Y axis
var y_2 = [];
var y_label_2 = ["Height (m)", "Diameter (cm)", "Canopy size (m\u00B2)", "Leaf area (m\u00B2)"];

// Data
var data2 = [];

var cose=0, cose2=0;

// Function to plot different measures depending on the selectionBox
function draw2() {

    // Load data
    var data = data2;

    // Remove previous boxplot and information (like y axis)
    svg_2.selectAll("text")
        .remove();
    svg_2.selectAll(".plot2-axisY")
        .remove();
    svg_2.selectAll(".iqr-line")
        .remove();
    svg_2.selectAll(".boxplot-rect")
        .remove();
    svg_2.selectAll(".median-line")
        .remove();
    svg_2.selectAll(".data-point")
        .remove();

    // Selected measure
    measureHeading_2 = selectItem_boxplot_measure.value;

    // Create a tooltip
    const tooltip = d3.select(id_ref_2)
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    // max data assumed for the selected measure
    max_data = Math.max(...Array.from(d3.map(data, d => d[measureHeading_2])))

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    //var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    //  .key(function(d) { return d.Species;})
    //  .rollup(function(d) {
    var sumstat = Array.from(d3.group(data, d => d.Species))
        .map(function(d) {
            q1 = d3.quantile(d[1].map(function(g) { return g[measureHeading_2];}).sort(d3.ascending),.25)
            median = d3.quantile(d[1].map(function(g) { return g[measureHeading_2];}).sort(d3.ascending),.5)
            q3 = d3.quantile(d[1].map(function(g) { return g[measureHeading_2];}).sort(d3.ascending),.75)
            mean = d3.mean(d[1].map(function(g) { return g[measureHeading_2];}))
            interQuantileRange = q3 - q1
            //tmp_min = q1 - 1.5 * interQuantileRange
            //min = (tmp_min > 0) ? tmp_min : 0
            min = Math.max(0, q1 - 1.5 * interQuantileRange)
            //tmp_max = q3 + 1.5 * interQuantileRange
            //max = (max_data > tmp_max) ? tmp_max : max_data
            max = Math.min(max_data, q3 + 1.5 * interQuantileRange)
            return ({key: d[0], q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max, mean: mean})
        });

    var outlier = [];
    for(i = 0; i < sumstat.length; ++i)
    {
        current_species = sumstat[i].key
        current_max = sumstat[i].max
        current_min = sumstat[i].min

        for(j = 0; j < data.length; ++j)
        {
            if ((data[j].Species === current_species) && ((data[j][measureHeading_2] < current_min) || (data[j][measureHeading_2] > current_max)))
                {
                    outlier.push(data[j])
                }
        }
    }

    // X axis label
    x_label = [...new Set(d3.map(data, d => d.Species))];

    // Color respect to the subgroups (tree species)
    // var color = d3.scaleOrdinal()
    //     .domain(x_label)
    //     .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93']);
    
    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width_2 ])
        .domain(x_label)
        .paddingInner(1)
        .paddingOuter(.5)
    svg_2.append("g")
        .attr("transform", "translate(0," + height_2 + ")")
        .call(d3.axisBottom(x).tickSizeInner(0).tickSizeOuter(0))
        .selectAll("text")
            .attr("transform", "translate(0,10)")
            .style("text-anchor", "center")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Y axis max value
    y_max = (Math.ceil(max_data+(5/100*max_data))/5)*5
    
    // Show the Y scale
    y_2 = d3.scaleLinear()
        .domain([0, y_max])
        .range([height_2, 0])
    svg_2.append("g")
        .attr("class", "plot2-axisY")
        .call(d3.axisLeft(y_2))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Show the main vertical line
    svg_2.selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("class", "iqr-line")
            .attr("x1", function(d){return(x(d.key))})
            .attr("x2", function(d){return(x(d.key))})
            .attr("y1", function(d){return(y_2(d.min))})
            .attr("y2", function(d){return(y_2(d.min))})
            .attr("stroke", "black")
            .style("width", 40);

    // rectangle for the main box
    var boxWidth = 100;
    
    svg_2.selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("class", "boxplot-rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y_2(d.q1))})
            .attr("height", function(d){return(0)})
            .attr("width", boxWidth)
            .attr("stroke", "black")
            .style("fill", d => color(d.key))
            .attr("fill-opacity", 0.5);

    // Show the median
    svg_2.selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("class", "median-line")
            .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
            .attr("x2", function(d){return(x(d.key)-boxWidth/2) })
            .attr("y1", function(d){return(y_2(d.median))})
            .attr("y2", function(d){return(y_2(d.median))})
            .attr("stroke", "black")
            .style("width", 80);

    // Add individual points with jitter
    var jitterWidth = 50
    svg_2.selectAll("indPoints")
    .data(outlier)
    .enter()
    .append("circle")
        .attr("class", "data-point")
        .attr("cx", function(d){return(x(d.Species) - jitterWidth/2 + Math.random()*jitterWidth )})
        .attr("cy", function(d){return(height_2)})
        .attr("r", 0)
        .style("fill", d => color(d.Species))
        .attr("stroke", "black");

    
    // Title
    svg_2.append("text")
        .attr("class", "plot2-title")
        .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
        .attr("y", 0 - (margin_2.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")
        //.text(`Boxplot of height for the top-5 tree species`);
        .text(`Boxplot of ${measureHeading_2.replace("_", " ").toLowerCase()} for the top-5 tree species`);

    // X axis label
    svg_2.append("text")
        .attr("x", (width_2 / 2))
        .attr("y", (height_2 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Species");

    // Y axis label
    svg_2.append("text")
        .attr("class", ".plot2-axisY")
        .attr("x", (-height_2 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text(y_label_2[subgroups_2.indexOf(measureHeading_2)]);

    // Animations
    svg_2.selectAll(".iqr-line")
        .transition("loading")
        .duration(800)
        .attr("y2", function(d){return(y_2(d.max))});

    svg_2.selectAll(".boxplot-rect")
        .transition("loading")
        .duration(800)
        .attr("y", function(d){return(y_2(d.q3))})
        .attr("height", function(d){return(y_2(d.q1)-y_2(d.q3))})
        .delay(700);

    svg_2.selectAll(".median-line")
        .transition("loading")
        .duration(800)
        .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
        .delay(1500);
    
    svg_2.selectAll(".data-point")
        .transition("loading")
        .duration(800)
        .attr("cy", function(d){return(y_2(d[measureHeading_2]))})
        .attr("r", 4)
        .delay(2300);

    // Animation and filling of tooltip
    svg_2.selectAll("rect")

        // MouseOver
        .on("mouseover", function (event, d) {

            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("fill-opacity", 1.0);

            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", .9)
                // Added to control the fact that the tooltip disappear if
                // we move between near boxes (horizontally)
                .delay(1);

            tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d.key + "</b>" + 
                "<br>" + "Q1: " + d.q1.toFixed(2) + " - Q3: " + d.q3.toFixed(2) + 
                "<br>" + "Mean: " + d.mean.toFixed(2) + 
                "<br>" + "Median: " + d.median.toFixed(2) + "</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })

        // MouseOut
        .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("fill-opacity", 0.5);

            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
        });

}

// Read the data and compute summary statistics for each species
d3.csv("../../data/assign2/assign2-plot2.csv").then(function(data) {

    data2 = data;

    // Extract subgroups (possible measures)
    subgroups_2 = data.columns.slice(1);

    // Load possible options for "measures" in the selectBox
    for(j = 0; j < subgroups_2.length; ++j)
    {
        opt = new Option(subgroups_2[j].replace("_", " "), subgroups_2[j]);
        selectItem_boxplot_measure.appendChild(opt);
    };

    draw2();

});
