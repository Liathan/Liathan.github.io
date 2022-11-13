// Refer to the id div
const id_ref_3 = "#small-multiple-stacked-barchart"

// Set the dimensions and margins of the graph
const legend_sep_3 = 5
const boxSize_3 = 40
const margin_3 = {top: 50, right: 40, bottom: 50, left: 270},
    width_3 = 800 + margin_3.left + margin_3.right + legend_sep_3 + boxSize_3,
    height_3 = 600 - margin_3.top - margin_3.bottom;
// Append the svg_3 object to the page
const svg_3 = d3.select(id_ref_3)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_3 + margin_3.left + margin_3.right)
        //.attr("height", height_3 + margin_3.top + margin_3.bottom)
        .attr("viewBox", '0 0 ' + (width_3) +
            ' ' + (height_3 + margin_3.top + margin_3.bottom))
        .append("g")
            .attr("transform", `translate(-50, ${margin_3.top})`);


cose3 = 0
// Parse the Data
d3.csv("../data/assign1-plot3.csv").then(function(data) {

    // Extract the highest "num" values
    const topNum = data.slice(0)//.reverse();
    const subgroups = data.columns.slice(1);
    var sum = 0

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);

    var y = d3.scaleBand()
    .range([0, height_3])
    .domain(topNum.map(function(d) { return d.Circoscrizione; }))
    .padding(.1);

    for( i = 0; i < 6; ++i)
    {
        max =  Math.max.apply(Math, topNum.map(function(value) { return value[subgroups[i]] / 3; }))
        
        x = d3.scaleLinear()
        .domain([0, max / 3])
        .range([0, max / 3 -1]);
        
        newY = (i > 0) ? d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0) : d3.axisLeft(y);
        
        svg_3.append("g")
        .call(newY)
        .attr("transform", `translate(${margin_3.left + sum}, 0)`)
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", `${i == 0 ? 14 : 0}px`)
        
        svg_3.selectAll(id_ref_3)
        .data(topNum)
        .join("rect")
        .attr("x", x(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        .attr("width", function(d) { return x(d[subgroups[i]]) / (i == 5 ? 6: 3); })
        .attr("height", y.bandwidth() )
        .attr("class", d => "class"+i)
        .attr("fill", color(subgroups[i]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + sum}, 0)`)
        .attr("name", subgroups[i])
        
        sum += max

    }
    
    svg_3.selectAll("rect")
        .on("mouseover", function (event, d) {
            const species = event.currentTarget.getAttribute("name")
            d3.select(event.currentTarget)
            .transition("selected")
            .duration(300)
            .style("opacity", 1.0);

            tooltip.transition("appear-box")
            .duration(300)
            .style("opacity", .9)
            .delay(1);

            tooltip.html("<span class='tooltiptext'>" + "<b>Abundance: " + d[species] + 
                         "</b><br>" + "Average canopy size: "+ d.AverageCanopySize + "</span>")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");

        })
        .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
            .transition("unselected")
            .duration(300)
            .style("opacity", 0.5);

            tooltip.transition("disappear-box")
            .duration(300)
            .style("opacity", 0);
        });


        var legend_3 = svg_3.join("g")
        .selectAll("legend_3")
        .data(subgroups);

        legend_3.join("rect")
        .attr("x", width_3)
        .attr("y", function(d,i){ return (i * boxSize_3)})
        .attr("width", boxSize - 3)
        .attr("height", boxSize - 3)
        .attr("class", d => "class"+subgroups.indexOf(d))
        .attr("fill", (d) => color(d))
        .attr("opacity", 0.5)
        .attr("tag", "legend_3");
    
        legend_3.join("text")
        .attr("x", width_3 -160)
        .attr("y", (d, i) => (i * boxSize_3))
        .append("tspan")
        .attr("dx", 155)
        .attr("dy", boxSize/2)
        .text((d) => d)
        .style("fill", (d) => color(d))
        .style("text-anchor", "end")
        .style("font-size", "14px")
        // .style("alignment-baseline", "right")
        .attr("class", d => "class"+subgroups.indexOf(d))

        svg_3.join("g").selectAll("rect[tag='legend_3']")
        .on("mouseover", function (event, d) {
            idx = subgroups.indexOf(d);
            svg_3.selectAll(`.class${idx}`)
            .transition("selected")
            .duration(300)
            .style("opacity", 1.0);
        })
        .on("mouseout", function (event, d){
            idx = subgroups.indexOf(d);
            svg_3.selectAll(`.class${idx}`)
            .transition("unselected")
            .duration(300)
            .style("opacity", 0.5);
        })

});