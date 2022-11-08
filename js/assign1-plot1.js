// -------------------------------------------------------------------------
// Assignment 1: BarChart (first plot)
// We want to show the aboundance of each tree species in Trento's territory
//--------------------------------------------------------------------------


// refer to the id div
const id_ref_1 = "#barchart-abundance"

// set the dimensions and margins of the graph
const margin_1 = {top: 50, right: 20, bottom: 50, left: 190},
    width = 800 - margin_1.left - margin_1.right,
    height = 600 - margin_1.top - margin_1.bottom;

// append the svg_1 object to the body of the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    //.attr("width", width + margin_1.left + margin_1.right)
    //.attr("height", height + margin_1.top + margin_1.bottom)
    .attr("viewBox", '0 0 ' + (width + margin_1.left + margin_1.right) +
        ' ' + (height + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

// Parse the Data
d3.csv("../data/assign1-plot1.csv").then(function(data, num=15) {

    var topNum = data.slice(0,num).reverse()

    var max_width = Math.max.apply(Math, topNum.map(function(value) {
        return value.Count;
    }))

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, Math.ceil(max_width/100)*100])
        .range([ 0, width]);
    svg_1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

    // Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(topNum.map(function(d) { return d.Species; }))
        .padding(.1);
    svg_1.append("g")
        //.attr("class", "y-ticks")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")

    // create a tooltip
    var tooltip = d3.select(id_ref_1)
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    // Bars
    svg_1.selectAll(id_ref_1)
        .data(topNum)
        .join("rect")
            .attr("x", x(0))
            .attr("y", function(d) { return y(d.Species); })
            //.attr("width", function(d) { return Math.max(x(d.Count)-width, 0); })
            .attr("width", function(d) { return x(0); })
            .attr("height", y.bandwidth() )
            .attr("fill", "#1c7c54")
            .attr("opacity", 0.5);
    
    // Title
    svg_1.append("text")
        .attr("x", ((width - (margin_1.left - margin_1.right)) / 2))             
        .attr("y", 0 - (margin_1.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")  
        .text("Aboundance of tree species - Top " + num);

    // Y axis label
    svg_1.append("text")      // text label for the y axis
        .attr("x", (-height / 2))
        .attr("y", -170)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("Tree Species");

    // X axis label
    svg_1.append("text")      // text label for the x axis
        .attr("x", (width / 2))
        .attr("y", (height + margin_1.bottom))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Count");

    // Animation
    svg_1.selectAll("rect")
        .transition("loading")
        .duration(800)
        .attr("x", function(d) { return x(0); })
        .attr("width", function(d) { return x(d.Count); })
        .delay(function(d,i){console.log(i) ; return(i*100)})

    svg_1.selectAll("rect")
        .on("mouseover", function (event, d) {
            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("opacity", 1.0)
            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", .9);
            tooltip.html("<span class='tooltiptext'>" + "<b>Abundance: " + d.Count + 
                         "</b><br>" + "Average canopy size: "+ d.AverageCanopySize + "</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5)
            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
            });

})