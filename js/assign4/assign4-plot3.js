const id_ref_3 = "#ridgeline"

// Set the dimensions and margins of the graph
const margin_3 = { top: 200, right: 20, bottom: 70, left: 75 },
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

svg_3.append("text")
.text("Min and Max temperature distribution by month of the 1993")
.attr("y", -150)
.attr("id", "ridgeTitle")
.style("class", "h2")
.style("font-size", "18px")
.attr("text-anchor", "left")  
.style("text-decoration", "underline")

svg_3.append("text")
.text("Temperature, °C")
.attr("text-anchor", "end")
.attr("x", width_3)
.attr("y", height_3 + margin_3.bottom- 5)

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
var names = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"]

var min, max, xAxis, yBandAxis, yDensityAxis, byYear
const selectionBox = document.getElementById("ridgeSelection")


d3.csv("../../data/assign4/assign4-plot3.csv").then( function (data)
{
    for(i = 0; i < data.length; ++i)
        years_3.add(data[i]['year']) 
    
    Array.from(years_3).forEach(function (el){
        selectionBox.appendChild(new Option(el, el))
    })
    

    min = data.reduce((acc, el) => Math.min(acc, el.min), Infinity)
    max = data.reduce((acc, el) => Math.max(acc, el.max), -Infinity)
    
    xAxis = d3.scaleLinear().domain([min - 0.01, max + 0.01]).range([0, width_3])
    yBandAxis = d3.scalePoint().range([0, height_3]).domain(names)
    yDensityAxis = d3.scaleLinear().domain([0, 0.4]).range([height_3, 0])
    
    svg_3.append("g").attr("transform", `translate(0, ${height_3})`).call(d3.axisBottom(xAxis).tickFormat(d => d +"°"))
    svg_3.append("g").call(d3.axisLeft(yBandAxis))
    
    
    byYear = groupBy(data, "year")
    
    draw()
})

function draw()
{
    var year = selectionBox.value
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xAxis.ticks(80))
    
    chartTitle = document.getElementById("ridgeTitle").textContent = `Min and Max temperature distribution by month of the ${year}`

    var byMonth = groupBy(byYear[year], "month")
    var densities = Array()
    
    for(var i = 0; i < 12; ++i)
    {
        // Non sono convintissimo che mi piaccia, ma almeno esce giusto
        var mins = [[min -0.01, 0]].concat(kde(byMonth[i+1].map(el => el.min)))
        var maxs = [[min -0.01, 0]].concat(kde(byMonth[i+1].map(el => el.max)))
        mins.push([max + 0.01, 0])
        maxs.push([max + 0.01, 0])
        
        // Le metto così in modo che le disegni in ordine, che è l'unico modo che ho trovato per mmetterli uno sopra l'altro
        densities.push({"month": names[i], "density" : mins, "type": "min"})
        densities.push({"month": names[i], "density" : maxs, "type": "max"})
    }
    
    svg_3.selectAll(".areas")
    .data(densities)
    .join("path")
    .attr("class", "areas")
    .attr("transform", d => `translate(0, ${(yBandAxis(d.month) - height_3)})`)
    .attr("fill", d => d.type === "min" ? "blue" : "red")
    // .attr("opacity",  0.8) // Non so, non mi piace
    .datum(d => d.density)
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("d", d3.line().curve(d3.curveBasis).x(d => xAxis(d[0])).y(d => yDensityAxis(d[1])))

}