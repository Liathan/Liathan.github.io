// -------------------------------------------------------------------------
// Assignment 3: Choropleth map dot density - top 6 tree year + "Others" (fifth plot)
// We want to show the density of trees in each neighborhood 
// ("Circoscrizione") of Trento's territory visualizing a point for each tree
// highlighting the top 6 tree year + "Others" 
//--------------------------------------------------------------------------
const id_ref_1 = "#linechart";
// set the dimensions and margin_1s of the graph
const margin_1 = {top: 20, right: 120, bottom: 70, left: 30},
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 768 - margin_1.top - margin_1.bottom;

// Scale factor on both dimensions (width and height)
const scaleFactor_1 = 1;

// Append the svg_5 object to the page
const svg_1 = d3.select(id_ref_1)
    .append("svg")
    //.attr("width", width_5 + margin_5.left + margin_5.right)
    //.attr("height", height_5 + margin_5.top + margin_5.bottom)
    .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) +
        ' ' + (height_1 + margin_1.top + margin_1.bottom))
    .append("g")
    .attr("transform", `translate(${(1 - scaleFactor_1) * width_1 / 2 + margin_1.left},
                                  ${(1 - scaleFactor_1) * height_1 / 2 + margin_1.top})`);

//Read the data
d3.csv("../../data/assign4/assign4-plot1.csv").then( function(data) {

  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, d => d.year); // nest function allows to group the calculation per level of a factor

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    //.domain(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
    .domain([1,12])
    .range([ 0, width_1 ]);
  svg_1.append("g")
    .attr("transform", `translate(0, ${height_1})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.min; }), d3.max(data, function(d) { return +d.max; })])
    .range([ height_1, 0 ]);
  svg_1.append("g")
    .call(d3.axisLeft(y));

  // color avg
  const color_avg = d3.scaleOrdinal()
    .domain(["1993","1997","2001","2005","2009","2013","2017","2021"])
    .range(['#ff2d00','#fff700','#2aff00','#00ffe0','#005dff','#6b0cff','#ff00d8','#fa8d01'])
    
// color max scuro
    const color_max = d3.scaleOrdinal()
    .domain(["1993","1997","2001","2005","2009","2013","2017","2021"])
    .range(['#be0000','#bfbc01','#157f00','#00a38f','#00348e','#4b159e','#9e0186','#a85e00'])
// color min chiaro
    const color_min = d3.scaleOrdinal()
    .domain(["1993","1997","2001","2005","2009","2013","2017","2021"])
    .range(['#ff6565','#fffd86','#89ff84','#79ffdc','#68adff','#b484ff','#ff81ec','#ffbb65'])

  // Draw the line
  svg_1.selectAll(".line")
      .data(sumstat)
      .join("path")
        .attr("fill", "transparent")
        .attr("stroke", function(d){ return color_min(d[0]) })
        .attr("stroke-width_1", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.month); })
            
            .y(function(d) { return y(+d.min); })
            (d[1])
        })
        svg_1.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill","transparent")
        .attr("stroke", function(d){ return color_max(d[0]) })
        .attr("stroke-width_1", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.month); })
         
            .y(function(d) { return y(+d.max); })
            (d[1])
        })
        
        svg_1.append('g')
        .selectAll(".circle")
        .data(data)
        .join("circle")
        .attr("fill",function(d){return color_avg(d.year)})
        .attr("cx",function (d) {return x(d.month);})
        .attr("cy",function (d) {return y(d.avg);})
        .attr("r",3)
        
        // svg_1.selectAll(".line")
        // .data(sumstat)
        // .join("path")
        // .attr("fill","transparent")
        // .attr("stroke", function(d){ return color(d[0]) })
        // .attr("stroke-width_1", 1.5)
        // .attr("d", function(d){
        //   return d3.line()
        //     .x(function(d) { return x(d.month); })
         
        //     .y(function(d) { return y(+d.avg); })
        //     (d[1])
        // })
        const legend_1 = svg_1.append("g")
        .selectAll(".legend_1")
        .data(color_avg.domain());
        
        legend_1.join("circle")
        .attr("cx", (width_1 + 100))
        .attr("cy", d => 20 * color_avg.domain().indexOf(d) + height_1 / 4 )
        .attr("r", 5)
        .attr("fill", d => color_avg(d))

        legend_1.join("text")
        .attr("x", (width_1+80))
        .attr("y", d => 20 * color_avg.domain().indexOf(d) + height_1 / 4 + 3)
        .append("tspan")
        .attr("fill", d => color_avg(d))
        .style("alignment-baseline", "middle")
        .style("text-anchor", "end")
        .style("font-size", "14px")
        .text(d => d)   



})