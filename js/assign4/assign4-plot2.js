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
// svg_2.append("text")
//     .attr("x", ((width_2 - (width_2 + margin_2.left - margin_2.right)) / 2))             
//     .attr("y", 0 - ((height_2 - margin_2.top) / 2))
//     .style("class", "h2")
//     .style("font-size", "18px")
//     .attr("text-anchor", "middle")  
//     .style("text-decoration", "underline")  
//     .text("Density of trees in Trento's neighborhoods");

var pippo;
var years = new Set
d3.csv("../../data/assign4/assign4-plot2.csv").then( function (data)
{
    for(i = 0; i < data.length; ++i)
        years.add(data[i]['year'])    
    var max = data.reduce((x, y) => Math.max(x, y.avg), -Infinity)
    var names = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"]

    var numAxis = 4
    var radius = height_2 / 2
    var angle = 2 * Math.PI / 12

    var scale = d3.scaleLinear().domain([-10, 30]).range([0, radius])

    var axisGrid = svg_2.append('g').attr("class", "axisWrapper")

    axisGrid.selectAll(".levels")
    .data(d3.range(1, numAxis + 1))
    .join("circle")
    .attr("r", function (d) {
        console.log(d) 
        return d / numAxis * radius;
        })
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
    .attr("x2", (d, i) => scale(30 ) * Math.cos(angle * i - Math.PI / 2))
    .attr("y2", (d, i) => scale(30 ) * Math.sin(angle * i - Math.PI / 2))
    .attr("class", "line")
    .style("stroke", "lightgrey")
    .style("stroke-width", "2px")
    
    axis.append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => scale(30) *1.15 * Math.cos(angle * i - Math.PI / 2))
    .attr("y", (d, i) => scale(30) *1.15 * Math.sin(angle * i - Math.PI / 2))
    .text(d => d)
    
    byYear = groupBy(data, "year")

    fooX = (l,i) => scale(l) * Math.cos(angle * i - Math.PI / 2)
    fooY = (l,i) => scale(l) * Math.sin(angle * i - Math.PI / 2)
    years = Array.from(years)
    years.forEach( yearEl => 
        svg_2.append("g")
        .attr("transform", `translate(${width_2 / 2}, ${height_2 / 2})`)
        .append("polygon")
        .data( [ byYear[yearEl] ] )
        .attr("points", d => d.reduce((acc, el) => acc + fooX(el.avg, (el.month -1)) + "," + fooY(el.avg, (el.month -1))+" ", ""))
        .attr("stroke", (d => color(years.indexOf(yearEl))))
        .attr("stroke-width", "3px")
        .attr("fill", (d => color(years.indexOf(yearEl))))
        .attr("fill-opacity", 0.05)
    )
})