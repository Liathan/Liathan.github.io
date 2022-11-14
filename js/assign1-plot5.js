// -------------------------------------------------------------------------
// Assignment 1: WaffleChart (fifth plot)
// We want to show the percentage of each top-5 tree species + "Others" 
// in each circoscrizione of Trento's territory using wafflecharts
//--------------------------------------------------------------------------


// Refer to the div id
const id_ref_5 = "#waffle-chart"

// Set the dimensions and margins of the graph
const margin_5 = {top: 50, right: 40, bottom: 60, left: 40},
    width_5 = 1024 - margin_5.left - margin_5.right,
    height_5 = 480 - margin_5.top - margin_5.bottom,
    boxSize = 40, //Size of each box
    boxGap = 50, // Space between each box
    howManyAcross = 10; // 10 boxes per line 
    // howManyAcross = Math.floor(width_5 / boxSize);

// Dimension of g tag in svg (verified after visualization)
const g_xdim_5 = 707.36;
const g_x_translate_5 = (width_5 - g_xdim_5) / 2;
  
// Append the svg_5 object to the page
const svg_5 = d3.select(id_ref_5)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
//.attr("width", width_5 + margin_5.left + margin_5.right)
//.attr("height", height_5 + margin_5.top + margin_5.bottom)
.attr("viewBox", '0 0 ' + (width_5 + margin_5.left + margin_5.right) + 
    ' ' + (height_5 + margin_5.top + margin_5.bottom))
.append("g")
.attr("transform", `translate(${margin_5.left+g_x_translate_5}, ${margin_5.top})`);

// Subgroups
var subgroups = [];

// Data used to plot the wafflechart as percentage
var plotData = [];

// Data used in the tooltip
var tooltipData = [];

// Color variable for the top-5 tree species + "Others" class
var color = [];

// SelectBox to choose the "Circoscrizione" to show
selectItem = document.getElementById("selection-waffle")

// The selected "Circoscrizione"
var circoscrizioneHeading = '';

// Create a tooltip
const tooltip = d3.select(id_ref_5)
.append("div")
.attr("class", "tooltip")
.style("font-size", "14px")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
.style("opacity", 0);

// Parse the data
d3.csv('../data/assign1-plot5.csv').then(function(data, i) {
    
    // Extract subgroups (tree species)
    subgroups = data.columns.slice(1);
    
    // Update color respect to the subgroups (tree species)
    color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);

    // Load possible options for "Circoscrizione" in the selectBox
    // Also load data to plot the different wafflecharts
    for(j = 0; j < 12; ++j) 
    {
        circo = data[j]['Circoscrizione'];
        opt = new Option(circo, circo);
        selectItem.appendChild(opt);
        tmp_plot = [];
        tmp_tooltip = [];
        for(k = 0; k < 6; ++k)
        {
            if (data[j][subgroups[k]] != 0)
            {
                tmp_plot.push(Array(Math.max(Math.round(data[j][subgroups[k]]), 1)).fill(subgroups[k]));
                tmp_tooltip.push(Array(data[j][subgroups[k]]))
            }
            else {
                tmp_tooltip.push(Array('0'))
            }
        }

        console.log(tmp_tooltip)
        plotData[circo] = tmp_plot.flat()
        tooltipData[circo] = tmp_tooltip.flat()

        if (plotData[circo].length > 100)
            plotData[circo].pop()

        if (plotData[circo].length < 100)
            plotData[circo].push("Others")
    }

    // Take the selected item from the selectBox
    circoscrizioneHeading = selectItem.value
   
    // Make the main chart
    svg_5.join("g")
    .selectAll("rect")
    .data(plotData[circoscrizioneHeading])
    .join("rect")
    .attr("class", d => "square partOfWaffle class"+subgroups.indexOf(d))
    .attr("x", function(d,i) { return boxSize * (i % howManyAcross); })
    .attr("y", function(d,i) { return Math.floor(i/howManyAcross) * boxSize; })
    .attr("width", boxSize - 3)
    .attr("height", boxSize - 3)
    .attr("fill", function(d){ return color(d); })
    .attr("opacity", 0.5);

    // Title
    svg_5.append("text")
    .attr("x", ((width_5 - (margin_5.left - margin_5.right) - (g_x_translate_5*2)) / 2))             
    .attr("y", 0 - (margin_5.top / 2))
    .attr("class", "waffle-title")
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text(`Top-5 tree species + \"Others\" in Circoscrizione: ${circoscrizioneHeading}`);

    // legend_5
    var legend_5 = svg_5.join("g")
    .selectAll(".legend_5")
    .data(subgroups);
    
    legend_5.join("rect")
    .attr("x", (boxSize * (howManyAcross+1)) + boxGap )
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .attr("width", boxSize - 3)
    .attr("height", boxSize - 3)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .attr("fill", function(d){ return color(d); })
    .attr("opacity", 0.5);
    
    legend_5.join("text")
    .attr("x", (boxSize * (howManyAcross+1)) + boxGap + boxSize + 10)
    .attr("y", function(d,i){ return (i * boxSize) + 1/5*(boxSize*howManyAcross); })
    .append("tspan")
    .attr("dx", 0)
    .attr("dy", boxSize/2)
    .style("fill", d => color(d))
    .style("alignment-baseline", "middle")
    .style("font-size", "14px")
    .text((d) => d)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .attr("opacity", 0.5)

    // Animation and filling of tooltip
    svg_5.join("g")
    .selectAll("rect")
    .on("mouseover", function (event, d) {
        // Select all the rect with this specific class (tree species)
        idx_d = subgroups.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);

        tooltip.transition("appear-box")
        .duration(300)
        .style("opacity", .9)
        .delay(1);

        // tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
        //     "</b><br>" + "Percentage: "+ count(d) + "%</span>")
        tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
            "</b><br>" + "Percentage: "+ parseFloat(tooltipData[circoscrizioneHeading][subgroups.indexOf(d)]).toFixed(2) + "%</span>")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (event, d) {
        // Select all the rect with this specific class (tree species)
        idx_d = subgroups.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);  

        tooltip.transition("disappear-box")
        .duration(300)
        .style("opacity", 0);
        });

});

// Function to update the wafflechart when the user changes the "Circoscrizione" from the selectBox
function draw()
{   

    // New selected "Circoscrizione"
    circoscrizioneHeading = selectItem.value

    // Delete the previous data
    svg_5.join("g")
    .selectAll(".partOfWaffle")
    .remove()

    // Make the new main chart
    svg_5.join("g")
    .selectAll(".square")
    .data(plotData[circoscrizioneHeading])
    .join("rect")
    .attr("class", d => "square partOfWaffle class"+subgroups.indexOf(d))
    .attr("x", function(d,i){ return boxSize * (i % howManyAcross); })
    .attr("y", function(d,i){ return Math.floor(i/howManyAcross) * boxSize; })
    .attr("width", boxSize - 3)
    .attr("height", boxSize - 3)
    .attr("fill", function(d){return color(d)})
    .attr("opacity", 0.5);

    // Update the title to the current "Circoscrizione"
    svg_5.select(".waffle-title")
    .text(`Top-5 tree species + \"Others\" in Circoscrizione: ${circoscrizioneHeading}`)

    // Update the animation and filling of tooltip
    svg_5.join("g")
    .selectAll("rect")
    // MouseOver
    .on("mouseover", function (event, d) {
    // Select all the rect with this specific class (tree species)
        idx_d = subgroups.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);

        tooltip.transition("appear-box")
        .duration(300)
        .style("opacity", .9)
        .delay(1);

        // tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
        //     "</b><br>" + "Percentage: "+ count(d) + "%</span>")
        tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
            "</b><br>" + "Percentage: "+ parseFloat(tooltipData[circoscrizioneHeading][subgroups.indexOf(d)]).toFixed(2) + "%</span>")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function (event, d) {
        // Select all the rect with this specific class (tree species)
        idx_d = subgroups.indexOf(d);
        svg_5.selectAll(`.class${idx_d}`)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);  

        tooltip.transition("disappear-box")
        .duration(300)
        .style("opacity", 0);
    });            
}