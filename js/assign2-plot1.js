// -------------------------------------------------------------------------
// Assignment 2: Histogram (first plot)
// We want to show the distribution of some measures of trees in Trento's 
// territory. We analyze: Height (m), Canopy Size (m2), and Diameter (cm)
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_1 = "#histogram-tree-size";

// Set the dimensions and margins of the graph
const margin_1 = {top: 50, right: 20, bottom: 70, left: 70},
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;

// Append the svg_1 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_1 + margin_1.left + margin_1.right)
        //.attr("height", height_1 + margin_1.top + margin_1.bottom)
        .attr("viewBox", '0 0 ' + (width_1+ margin_1.left + margin_1.right) +
            ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
            .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

// SelectBox to choose the measure to show and the number of bins
var selectItem_hist_measure = document.getElementById("selection-histogram-measure");
var selectItem_hist_n_bins = document.getElementById("selection-histogram-n-bins");
for(t = 20; t < 61; t=t+20)
{
    selectItem_hist_n_bins.appendChild(new Option(t, t));
};

// Default choice for n_bins: 30
selectItem_hist_n_bins.selectedIndex = 1;

// The selected measure and number of bins
var measureHeading_1 = '';
var n_bins_1 = 0;

// The possible measures (Height, CanopySize, Diameter)
var subgroups_1 = [];

// Data array for plotting
var plotData_1 = [];

// X axis
var x = [];

// Y axis
var y = [];

// Bins
var bins = [];

// Max width for the x axis
var max_width_1 = [];

// Histogram
var histogram = [];

// Create a tooltip
const tooltip = d3.select(id_ref_1)
    .append("div")
    .attr("class", "tooltip")
    .style("font-size", "14px")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// Possible label for x axis depending on the selected measure
var x_label = ["Height (m)", "Canopy size (m\u00B2)", "Diameter (cm)", "Leaf area (m\u00B2)"];

// Parse the Data
d3.csv("../data/assign2-plot2.csv", function(data) {

    // Extract subgroups (tree measures)
    subgroups_1 = data.columns;

    // Load possible options for "measures" in the selectBox
    for(j = 0; j < subgroups_1.length; ++j)
    {
        opt = new Option(subgroups_1[j].replace("_", " "), subgroups_1[j]);
        selectItem_hist_measure.appendChild(opt);
    };

    // Take the selected item from the selectBox
    measureHeading_1 = selectItem_hist_measure.value;

    // Take the selected number of bins
    n_bins_1 = selectItem_hist_n_bins.value;

    // Extracting and preparing data for each measure plot
    tmp_height = [];
    tmp_canopy = [];
    tmp_diameter = [];
    tmp_leafarea = [];
    for(k = 0; k < data.length; ++k)
    {
        tmp_height.push(data[k][subgroups_1[0]]);
        tmp_canopy.push(data[k][subgroups_1[1]]);
        tmp_diameter.push(data[k][subgroups_1[2]]);
        tmp_leafarea.push(data[k][subgroups_1[3]]);
    };

    plotData_1[subgroups_1[0]] = tmp_height;
    plotData_1[subgroups_1[1]] = tmp_canopy;
    plotData_1[subgroups_1[2]] = tmp_diameter;
    plotData_1[subgroups_1[3]] = tmp_leafarea;

    // Max value on x axis
    max_width_1 = ((Math.ceil(Math.max(...plotData_1[measureHeading_1])/5)*5)+5);

    // Add x axis
    x = d3.scaleLinear()
        .domain([0, max_width_1])
        .range([0, width_1]);
    svg_1.append("g")
        .attr("class", "plot1_axisX")
        .attr("transform", "translate(0," + height_1 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Histogram
    histogram = d3.histogram()
        // I need to give the vector of value
        .value(function(d) { return d; })   
        // Then the domain of the graphic
        .domain(x.domain())  
        // Then the numbers of bins
        .thresholds(x.ticks(n_bins_1)); 

    // And apply this function to data to get the bins
    bins = histogram(plotData_1[measureHeading_1]);

    // Y axis: scale and draw
    y = d3.scaleLinear()
        .range([height_1, 0])
        .domain([0, d3.max(bins, function(d) { return Math.ceil(d.length/500)*500; })]);   // d3.hist has to be called before the Y axis obviously
    svg_1.append("g")
        .attr("class", "plot1_axisY")
        .call(d3.axisLeft(y))
        .selectAll("text")
                .style("text-anchor", "end")
                .style("font-family", "Fira Sans, sans-serif")
                .style("font-size", "12px");

    // Show the hist
    svg_1.selectAll(id_ref_1)
        .data(bins)
        .join("rect")
        .attr("x", 1)
        .attr("transform", function(d) {return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("y", function(d) { return height_1 - y(d.length); })
        //.attr("height", function(d) { return height_1 - y(d.length); })
        .attr("height", function(d) { return 0; })
        .style("fill", "#1c7c54")
        .attr("opacity", 0.5);
    
    // Title
    svg_1.append("text")
        .attr("x", ((width_1 - (margin_1.left - margin_1.right)) / 2))             
        .attr("y", 0 - (margin_1.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")
        .attr("class", "hist-title")  
        .text(`Trees ${measureHeading_1.replace("_", " ").toLowerCase()} histogram`);

    // X axis label
    svg_1.append("text")
        .attr("x", (width_1 / 2))
        .attr("y", (height_1 + 50))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .attr("class", "hist-axisX")
        .text(x_label[subgroups_1.indexOf(measureHeading_1)]);

    // Y axis label
    svg_1.append("text")
        .attr("x", (-height_1 / 2))
        .attr("y", -50)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("Count");

    // Animation
    svg_1.selectAll("rect")
        .transition("loading")
        .duration(800)
        .attr("y", function(d) { return 0; })
        .attr("height", function(d) { return height_1 - y(d.length); });
        //.delay(function(d,i){return(i*100);})

    // Animation and filling of tooltip
    svg_1.selectAll("rect")

        // MouseOver
        .on("mouseover", function (event, d) {

            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("opacity", 1.0);

            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", .9)
                // Added to control the fact that the tooltip disappear if
                // we move between near boxes (horizontally)
                .delay(1);

            tooltip.html("<span class='tooltiptext'>" + "<b>Range: " + d.x0 + " - " + d.x1 + "</b>" + 
                "<br>" + "Count: " + d.length + 
                "<br>" + "Percentage: "+ (d.length / plotData_1[measureHeading_1].length * 100).toFixed(2) + "%</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })

        // MouseOut
        .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5);

            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
        });

});

// Function to update the chart when the user changes the measure or the number of bins from the selectBoxes
function draw1()
{
    // New selected measure
    measureHeading_1 = selectItem_hist_measure.value;

    // New selected number of bins
    n_bins_1 = selectItem_hist_n_bins.value;

    // Delete the previous data
    svg_1.selectAll("rect")
        .remove();
    svg_1.selectAll(".plot1_axisX")
        .remove();
    svg_1.selectAll(".plot1_axisY")
        .remove();

    // Max value on x axis
    max_width_1 = ((Math.ceil(Math.max(...plotData_1[measureHeading_1])/5)*5)+5);

    // Add x axis
    x = d3.scaleLinear()
        .domain([0, max_width_1])
        .range([0, width_1]);
    svg_1.append("g")
        .attr("class", "plot1_axisX")
        .attr("transform", "translate(0," + height_1 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-family", "Fira Sans, sans-serif")
            .style("font-size", "12px");

    // Histogram
    histogram = d3.histogram()
        // I need to give the vector of value
        .value(function(d) { return d; })   
        // Then the domain of the graphic
        .domain(x.domain())  
        // Then the numbers of bins
        .thresholds(x.ticks(n_bins_1)); 

    // And apply this function to data to get the bins
    bins = histogram(plotData_1[measureHeading_1]);

    // Y axis: scale and draw
    y = d3.scaleLinear()
        .range([height_1, 0])
        .domain([0, d3.max(bins, function(d) { return Math.ceil(d.length/500)*500; })]);   // d3.hist has to be called before the Y axis obviously
    svg_1.append("g")
        .attr("class", "plot1_axisY")
        .call(d3.axisLeft(y))
        .selectAll("text")
                .style("text-anchor", "end")
                .style("font-family", "Fira Sans, sans-serif")
                .style("font-size", "12px");

    // Show the hist
    svg_1.selectAll(id_ref_1)
        .data(bins)
        .join("rect")
            .attr("x", 1)
        .attr("transform", function(d) {return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
        .attr("y", function(d) { return height_1 - y(d.length); })
        //.attr("height", function(d) { return height_1 - y(d.length); })
        .attr("height", function(d) { return 0; })
        .style("fill", "#1c7c54")
        .attr("opacity", 0.5);

    // Update title
    svg_1.select(".hist-title")
        .text(`Trees ${measureHeading_1.replace("_", " ").toLowerCase()} histogram`);
    
    // Update x axis label
    svg_1.select(".hist-axisX")
        .text(x_label[subgroups_1.indexOf(measureHeading_1)]);

    // Animation
    svg_1.selectAll("rect")
        .transition("loading")
        .duration(800)
        .attr("y", function(d) { return 0; })
        .attr("height", function(d) { return height_1 - y(d.length); });

    // Animation and filling of tooltip
    svg_1.selectAll("rect")

        // MouseOver
        .on("mouseover", function (event, d) {

            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("opacity", 1.0);

            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", .9)
                // Added to control the fact that the tooltip disappear if
                // we move between near boxes (horizontally)
                .delay(1);

            tooltip.html("<span class='tooltiptext'>" + "<b>Range: " + Math.min(...d) + " - " + Math.max(...d) + "</b>" + 
                "<br>" + "Count: " + d.length + 
                "<br>" + "Percentage: "+ (d.length / plotData_1[measureHeading_1].length * 100).toFixed(2) + "%</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })

        // MouseOut
        .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5);

            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
        });
};