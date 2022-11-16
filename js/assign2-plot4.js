const id_ref_4 = "#small-multiple-scatterplot"

const divisor = 25
const margin_4 = { top: 10, right: 20, bottom: 70, left: 30 },
width_4 = 1200 - margin_4.left - margin_4.right,
height_4 = 1000 - margin_4.top - margin_4.bottom;

const svg_4 = d3.select(id_ref_4)
.append("svg")
.attr("preserveAspectRatio", "xMidYMid meet")
.attr("viewBox", '0 0 ' + (width_4 + margin_4.left + margin_4.right) +
    ' ' + (height_4 + margin_4.top + margin_4.bottom))
// .attr("width", width_4 + margin_4.left + margin_4.right)
// .attr("height", height_4 + margin_4.top + margin_4.bottom)
.append("g")
.attr("transform", "translate(" + margin_4.left * 2 + "," + margin_4.top * 3 + ")")
.style("margin_4-bottom", "50px");

pippo = 0

d3.csv("../data/assign2-plot4.csv").then(function (data) {

    pippo = data
    var dataBySpecies = Array()
    const names_uniq = [...new Set(data.map(d => d.Species))];
    names_uniq.forEach( e => dataBySpecies.push(data.filter( d => d['Species'] === e)))
    console.log(dataBySpecies)

    for(i = 0; i < 6; ++i)
    {
        const max_X_4 = data.reduce((a,b) => Math.max(a, b['Leaf_area']), -Infinity)
        const max_Y_4 = data.reduce((a, b) => Math.max(a, b['CO2']), -Infinity)

        const smallWidth =  width_4 / 3 -divisor
        const smallHeight = height_4 / 2 -divisor

        const x = d3.scaleLinear()
        .domain([0, max_X_4])
        .range([0, smallWidth])
        
        const y = d3.scaleLinear()
        .domain([0, max_Y_4])
        .range([smallHeight, 0])

        svg_4.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(${(i % 3) * (smallWidth + divisor)}, ${i % 2 * (smallHeight + divisor)})`)

        svg_4.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", `translate(${(i % 3) * (smallWidth + divisor)}, ${smallHeight + i % 2 * (smallHeight + divisor)})`)

        svg_4.append('g')
        .selectAll("dot")
        .data(dataBySpecies[i])
        .join("circle")
        .attr("cx", d => x(d['Leaf_area']) + (i % 3) * (smallWidth + divisor))
        .attr("cy", d => y(d['CO2']) + (i % 2) * (smallHeight + divisor))
        .attr("r", 4)
        .style("stroke", "black")
        .style("opacity", 0.7)
        .style("fill", d => color(d["Species"]))
    }


    //     svg_4.append('g')
    //         .selectAll("dot")
    //         .data(data.filter(d => d.Species == e))
    //         .enter()
    //         .append("circle")
    //         .attr("cx", function (d) { return x(d.Leaf_area); })
    //         .attr("cy", function (d) { return y(d.CO2); })
    //         .attr("r", 3)
    //         .style("fill", function (d) { return color(d.Species) })
          

    //     svg_4.append("text")
    //         .attr("text-anchor", "end")
    //         .attr("x", (width_4 / 2) + 50)
    //         .attr("y", height_4 + 35)
    //         .text("Leaf_Area");

    //     // Y axis label
    // svg_4.append("text")      // text label for the y axis
    // .attr("x", (-height_4 / 2))
    // .attr("y", -30)
    // .style("text-anchor", "middle")
    // .style("class", "h2")
    // .style("font-size", "16px")
    // .attr("transform", "rotate(-90)")
    // .text("CO2");

   




       
    // });
  })