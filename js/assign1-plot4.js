// -------------------------------------------------------------------------
// Assignment 1: Stacked BarChart percentage(fourth plot)
// We want to show the aboundance of each top-5 tree species + "Others" 
// in each circoscrizione of Trento's territory
//--------------------------------------------------------------------------


// Refer to the id dive
const id_ref_4 = "#stacked-barchart-percentage"

// Set the dimensions and margins of the graph
const margin_4 = {top: 50, right: 20, bottom: 60, left: 240},
    width_4 = 800 - margin_4.left - margin_4.right,
    height_4 = 600 - margin_4.top - margin_4.bottom;

// Append the svg_4 object to the page
const svg_4 = d3.select(id_ref_4)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width + margin_4.left + margin_4.right)
        //.attr("height", height + margin_4.top + margin_4.bottom)
        .attr("viewBox", '0 0 ' + (width_4 + margin_4.left + margin_4.right) +
            ' ' + (height_4 + margin_4.top + margin_4.bottom))
        .append("g")
            .attr("transform", `translate(${margin_4.left}, ${margin_4.top})`);

cose=[];
// Parse the data
d3.csv("../data/assign1-plot4.csv").then(function(data) {
       
    // Extract subgroups
    const subgroups = data.columns.slice(1);
    cose = subgroups;
    // Extract circoscrizioni
    const groups = data.map(d => (d.Circoscrizione));

    // Add x axis
    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width_4]);
    svg_4.append("g")
        .attr("transform", "translate(0," + height_4 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

    // Add axis y
    const y = d3.scaleBand()
        .range([0, height_4])
        .domain(groups)
        .padding(.1);
    svg_4.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px");

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
        
    // Color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);
        
    // Stack the data? --> Stack per subgroup (top-5 + "Others" species)
    const stackedData = d3.stack()
        .keys(subgroups)
        (data)
    
    // Show the bars
    //svg_4.append("g")
    //    .selectAll("g")
    svg_4.selectAll(id_ref_4) 
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", d => x(0))
                .attr("y", d => y(d.data.Circoscrizione))
                .attr("width", d => x(0))
                .attr("height", y.bandwidth())
                .attr("opacity", 0.5);

    // Title
    svg_4.append("text")
        .attr("x", ((width_4 - (margin_4.left - margin_4.right)) / 2))             
        .attr("y", 0 - (margin_4.top / 2))
        .style("class", "h2")
        .style("font-size", "18px")
        .attr("text-anchor", "middle")  
        .style("text-decoration", "underline")  
        .text("Top-5 tree species + \"Others\" in each Circoscrizione");

    // X axis label
    svg_4.append("text")      // text label for the x axis
        .attr("x", (width_4 / 2))
        .attr("y", (height_4 + margin_4.bottom))
        .style("class", "h2")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text("Percentage (%)");

    // Y axis label
    svg_4.append("text")      // text label for the y axis
        .attr("x", (-height_4 / 2))
        .attr("y", -220)
        .style("text-anchor", "middle")
        .style("class", "h2")
        .style("font-size", "16px")
        .attr("transform", "rotate(-90)")
        .text("Circoscrizione");

    // Animation
    svg_4.selectAll("rect")
        .transition("loading")
        .duration(800)
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); });
        //.delay(function(d,i){console.log(i) ; return(i*10);})

    // Animation and filling of tooltip
    svg_4.selectAll("rect")

        // MouseOver
        .on("mouseover", function (event, d) {

            // Extract species names
            const species = d3.select(this.parentNode).datum().key

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

            tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + species + 
                            "</b><br>" + "Percentage: "+ (d[1] - d[0]).toFixed(2) + "%</span>")
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
