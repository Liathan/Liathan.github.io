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

// Title
// svg_2.append("text")
//     .attr("x", ((width_2 - (width_2 + margin_2.left - margin_2.right)) / 2))             
//     .attr("y", 0 - ((height_2 - margin_2.top) / 2))
//     .style("class", "h2")
//     .style("font-size", "18px")
//     .attr("text-anchor", "middle")  
//     .style("text-decoration", "underline")  
//     .text("Density of trees in Trento's neighborhoods");

d3.csv("../../data/assign4/assign4-plot2.csv").then( function (data)
{
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
    
	var radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function(d) { return 100; })
    .angle(function(d,i) {	return i*angleSlice; });

    var blobWrapper = svg_2.selectAll(".radarWrapper")
    .data(data)
    .join("g")
    .attr("transform", `translate(${width_2 / 2}, ${height_2 / 2})`)
    .attr("class", "radarWrapper")


    blobWrapper.append("path")
    .attr("d", (d, i) => radarLine(d))
    .style("fill", (d, i) => color( color.domain()[i]))
    .style("fill-opacity", 0.35)

    blobWrapper.append("path")
    .attr("class", "radarstroke")
    .attr("d", d => radarLine(d))
    .style("stroke-width", "3px")
    .style("stroke", (d, i) => color( color.domain()[i]))
    .style("fill", "none")

    blobWrapper.selectAll(".radarCircle")
    .data( (d,i) => d)
    .join("circle")
    .attr("r", 1)
    .attr("cx", (d,i) => scale(d.avg) * Math.cos(angle * i - Math.PI / 2))
    .attr("cy", (d,i) => scale(d.avg) * Math.sin(angle * i - Math.PI / 2))
    .style("fill", (d, i) => color( color.domain()[i]))
    .style("fill-opacity", 0.8)

})