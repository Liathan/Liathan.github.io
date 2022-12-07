const id_ref_3 = "#ridgeline"

// Set the dimensions and margins of the graph
const margin_3 = { top: 70, right: 20, bottom: 70, left: 75 },
    width_3 = 1024 - margin_3.left - margin_3.right,
    height_3 = 768 - margin_3.top - margin_3.bottom;


// Append the svg_3 object to the page
const svg_3 = d3.select(id_ref_3)
    .append("svg")
    //.attr("width", width_3 + margin_3.left + margin_3.right)
    //.attr("height", height_3 + margin_3.top + margin_3.bottom)
    .attr("viewBox", '0 0 ' + (width_3 + margin_3.left + margin_3.right) +
        ' ' + (height_3 + margin_3.top + margin_3.bottom))
    .append("g")
    .attr("transform", `translate(${margin_3.left}, ${margin_3.top})`);

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
    };

function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}
var years_3 = new Set
d3.csv("../../data/assign4/assign4-plot3.csv").then( function (data)
{
    for(i = 0; i < data.length; ++i)
        years_3.add(data[i]['year'])  
    
    var names = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

    var min = data.reduce((acc, el) => Math.min(acc, el.min), Infinity)
    var max = data.reduce((acc, el) => Math.max(acc, el.max), -Infinity)

    var xAxis = d3.scaleLinear().domain([min, max]).range([0, width_3])
    var yBandAxis = d3.scaleBand().range([0, height_3]).domain(names).padding(0.1)
    var yDensityAxis = d3.scaleLinear().domain([0, 0.4]).range([height_3, 0])

    svg_3.append("g").attr("transform", `translate(0, ${height_3})`).call(d3.axisBottom(xAxis))
    svg_3.append("g").call(d3.axisLeft(yBandAxis))

    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xAxis.ticks(80))

    var byYear = groupBy(data, "year")

    // TODO -> permettere di cambiare anno
    var byMonth = groupBy(byYear[1993], "month")
    densities = Array()
    for(var i = 0; i < 12; ++i)
    {
        densities.push({"month": names[i], "density" :kde(byMonth[i+1].map(el => el.min))})
    }

    svg_3.selectAll("areas")
    .data(densities)
    .join("path")
    .attr("transform", d => `translate(0, ${(yBandAxis(d.month) - height_3 + 53)})`)
    .datum(d => d.density)
    .attr("fill", "blue")
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("d", d3.line().curve(d3.curveBasis).x(d => xAxis(d[0])).y(d => yDensityAxis(d[1])))

})
