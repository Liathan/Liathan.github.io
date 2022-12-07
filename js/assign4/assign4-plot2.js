const id_ref_2 = "#radarchart"

// Set the dimensions and margins of the graph
const margin_2 = { top: 70, right: 20, bottom: 70, left: 20 },
    width_2 = 1024 - margin_2.left - margin_2.right,
    height_2 = 768 - margin_2.top - margin_2.bottom;
    

// Append the svg_2 object to the page
const svg_2 = d3.select(id_ref_2)
    .append("svg")
    //.attr("width", width_2 + margin_2.left + margin_2.right)
    //.attr("height", height_2 + margin_2.top + margin_2.bottom)
    .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
        ' ' + (height_2 + margin_2.top + margin_2.bottom))
    .append("g")
    .attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
    };

// Title
svg_2.append("text")
.attr("x", 0)             
.attr("y", -20 )
.style("class", "h2")
.style("font-size", "18px")
.attr("text-anchor", "left")  
.style("text-decoration", "underline")
.text("Average Temperature")
.append("tspan")
.attr("x", 0)
.attr("dy", "1.4em")
.text("by month per year");

color_2 = d3.scaleOrdinal().range(["#F00314", "#FF8019", "#FAE603", "#28E10A", "#3BB5FF", "#0500C7", "#5C03FA", "#DE00ED"])

var years_2 = new Set
d3.csv("../../data/assign4/assign4-plot2.csv").then( function (data)
{
    for(i = 0; i < data.length; ++i)
        years_2.add(data[i]['year'])    
    
    var names = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
    
    years_2 = Array.from(years_2)

    color_2.domain(years_2)

    var numAxis = 4
    var radius = height_2 / 2
    var angle = 2 * Math.PI / 12

    var scale = d3.scaleLinear().domain([-10, 30]).range([0, radius])

    var axisGrid = svg_2.append('g').attr("class", "axisWrapper")

    xCoord = (l,i) => scale(l) * Math.cos(angle * i - Math.PI / 2)
    yCoord = (l,i) => scale(l) * Math.sin(angle * i - Math.PI / 2)

    axisGrid.selectAll(".levels")
    .data(d3.range(1, numAxis + 1))
    .join("circle")
    .attr("r", (d) => d / numAxis * radius)
    .attr("cx", width_2 / 2)
    .attr("cy", height_2 / 2)
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.1)

    axisGrid.selectAll(".axisLabel")
    .data(d3.range(numAxis))
    .join("text")
    .attr("x", width_2 / 2)
    .attr("y", d => (numAxis - d -1 ) / numAxis * radius)
    .text(d => d * 10)

    var axis = axisGrid.selectAll(".axis")
    .data(names)
    .join("g")
    .attr("transform", `translate(${width_2 / 2}, ${height_2 / 2})`)
    .attr("class", "axis")
    
    axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => xCoord(30, i))
    .attr("y2", (d, i) => yCoord(30, i))
    .attr("class", "line")
    .style("stroke", "lightgrey")
    .style("stroke-width", "2px")
    
    axis.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => xCoord(30, i) * 1.15)
    .attr("y", (d, i) => yCoord(30, i) * 1.15)
    .text(d => d)
    
    var byYear = groupBy(data, "year")

    years_2.forEach( yearEl => 
        svg_2.append("g")
        .attr("transform", `translate(${width_2 / 2}, ${height_2 / 2})`)
        .append("polygon")
        .data( [ byYear[yearEl] ] )
        .attr("points", d => d.reduce((acc, el) => acc + xCoord(el.avg, (el.month -1)) + "," + yCoord(el.avg, (el.month -1))+" ", ""))
        .attr("stroke", (d => color_2(yearEl)))
        .attr("stroke-width", "3px")
        .attr("fill", (d => color_2(yearEl)))
        .attr("fill-opacity", 0.05)
    )

    var legend_2 = svg_2.append("g")
    .selectAll(".legend2")
    .data(years_2)

    legend_2.join("rect")
    .attr("x", 0)
    .attr("y", (d,i) => 30 + i * 25)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => color_2(d))

    legend_2.join("text")
    .attr("x", 22)
    .attr("y", (d,i) => 30 + i * 25)
    .text(d => d)
    .attr("dy", 15)
    .style("alignment-baseline", "middle")
})