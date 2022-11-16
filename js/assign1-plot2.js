// -------------------------------------------------------------------------
// Assignment 1: Stacked BarChart (second plot)
// We want to show the aboundance of each top-5 tree species + "Others" 
// in each circoscrizione of Trento's territory
//--------------------------------------------------------------------------


// Refer to the div id
const id_ref_2 = "#stacked-barchart"

const boxSize_2 = 40
const legend_sep_2 = 20

// Set the dimensions and margins of the graph
const margin_2 = {top: 50, right: 60, bottom: 60, left: 240},
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width + margin_2.left + margin_2.right)
        //.attr("height", height + margin_2.top + margin_2.bottom)
        .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
            ' ' + (height_2 + margin_2.top + margin_2.bottom))
        .append("g")
            .attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);

// Parse the data
d3.csv("../data/assign1-plot2.csv").then(function(data) {
       
    // Extract subgroups
    const subgroups = data.columns.slice(1);

    // Extract circoscrizioni
    const groups = data.map(d => (d.Circoscrizione));

    // Add x axis
    const x = d3.scaleLinear()
    .domain([0, 3100])
    .range([0, width_2]);

    svg_2.append("g")
    .attr("transform", "translate(0," + height_2 + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px");

    // Add axis y
    const y = d3.scaleBand()
    .range([0, height_2])
    .domain(groups)
    .padding(.1);
    
    svg_2.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-family", "Fira Sans, sans-serif")
        .style("font-size", "12px");

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
        
    // Color palette = one color per subgroup
    // const color = d3.scaleOrdinal()
    // .domain(subgroups)
    // .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);
    
    // Stack the data? --> Stack per subgroup (top-5 + "Others" species)
    const stackedData = d3.stack()
    .keys(subgroups)(data)
    
    // Make the bars
    svg_2.selectAll(id_ref_2) 
    .data(stackedData)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(0))
    .attr("y", d => y(d.data.Circoscrizione))
    .attr("class", function (d) {
        const species = d3.select(this.parentNode).datum().key  
        return "class" + subgroups.indexOf(species);
        })
    .attr("width", d => x(0))
    .attr("height", y.bandwidth())
    .attr("opacity", 0.5);

    // Title
    svg_2.append("text")
    .attr("x", ((width_2 - (margin_2.left - margin_2.right)) / 2))             
    .attr("y", 0 - (margin_2.top / 2))
    .style("class", "h2")
    .style("font-size", "18px")
    .attr("text-anchor", "middle")  
    .style("text-decoration", "underline")  
    .text("Top-5 tree species + \"Others\" in each Circoscrizione");

    // X axis label
    svg_2.append("text")      // text label for the x axis
    .attr("x", (width_2 / 2))
    .attr("y", (height_2 + margin_2.bottom))
    .style("class", "h2")
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text("Count");

    // Y axis label
    svg_2.append("text")      // text label for the y axis
    .attr("x", (-height_2 / 2))
    .attr("y", -220)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("Circoscrizione");

    // Animation
    svg_2.selectAll("rect")
    .transition("loading")
    .duration(800)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); });
    
    var legend_2 = svg_2.join("g")
    .selectAll("legend_2")
    .data(subgroups);

    legend_2.join("rect")
    .attr("x", width_2 + legend_sep_2)
    .attr("y", (d, i) => i * boxSize_2 + 5)
    .attr("width", boxSize_2 - 3)
    .attr("height", boxSize_2 - 3)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .attr("fill", (d) => color(d))
    .attr("opacity", 0.5)
    .attr("tag", "legend_2");

    legend_2.join("text")
    .attr("x", width_2 + legend_sep_2 )
    .attr("y", (d, i) => i * boxSize_2 + 5)
    .append("tspan")
    .attr("dx", -5)
    .attr("dy", boxSize_2 / 2 + 5)
    .attr("class", d => "class"+subgroups.indexOf(d))
    .text((d) => d)
    .style("fill",(d) => color(d))
    .style("font-size", "14px")
    .style("text-anchor", "end")
    .attr("opacity", 0.5)
    .attr("tag", "legend_2");

    // Animation and filling of tooltip
    svg_2.selectAll("rect")
    
    // MouseOver
    .on("mouseover", function (event, d) {

        const species = d3.select(this.parentNode).datum().key

        d3.select(event.currentTarget)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);

        class_of_interest = event.currentTarget.classList[0]
        svg_2.selectAll(`rect.${class_of_interest}[tag='legend_2'],
                         tspan.${class_of_interest}[tag='legend_2']`)
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
                        "</b><br>" + "Abundance: "+ (d[1] - d[0]) + "</span>")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    
    // MouseOut
    .on("mouseout", function (event, d) {

        d3.select(event.currentTarget)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);  

        class_of_interest = event.currentTarget.classList[0]
        svg_2.selectAll(`rect.${class_of_interest}[tag='legend_2'], 
                         tspan.${class_of_interest}[tag='legend_2']`)
        .transition("selected")
        .duration(300)
        .style("opacity", 0.5);

        tooltip.transition("disappear-box")
        .duration(300)
        .style("opacity", 0);
    });
        
    svg_2.join("g").selectAll("rect[tag='legend_2']")
    .on("mouseover", function (event, d) {
        idx = subgroups.indexOf(d);
        svg_2.selectAll(`.class${idx}`)
        .transition("selected")
        .duration(300)
        .style("opacity", 1.0);
    })
    .on("mouseout", function (event, d){
        idx = subgroups.indexOf(d);
        svg_2.selectAll(`.class${idx}`)
        .transition("unselected")
        .duration(300)
        .style("opacity", 0.5);
    })
});
