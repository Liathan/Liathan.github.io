
const id_ref_4 = "#small-multiple-scatterplot"

d3.csv("../data/assign2-plot4.csv").then(function (data) {

    // set the dimensions and margin_4s of the graph
    const margin_4 = { top: 10, right: 20, bottom: 70, left: 30 },
    width_4 = 1024 - margin_4.left - margin_4.right,
    height_4 = 400- margin_4.top - margin_4.bottom;

    
    const names = data.map(d => d.Species);
    const names_uniq = [...new Set(names)];
    const name_counts = [];
    const sortable = [];

    for (const num of names) { //get the count of trees
        name_counts[num] = name_counts[num] ? name_counts[num] + 1 : 1;
    }
    //Get a sortable version of count of trees
    names_uniq.forEach(e => {
        sortable.push([e, name_counts[e]]);
    });

    

    var max_X = d3.max(data, function(d) { return +d.Leaf_area;} );

    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, max_X])
    .range([ 0, width_4 ]);
    svg_3.append("g")
    .attr("transform", `translate(0, ${height_3})`)
    .call(d3.axisBottom(x));

    var max_Y = d3.max(data, function(d) { return +d.CO2;} );

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, max_Y])
    .range([ height_4, 0]);
    svg_3.append("g")
    .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
        .domain(sortable)
        .range(["#440154ff", "#21908dff", "#fde725ff" , "#009bff" , "#08e8de" , "#191970" ]);

    // small multiples: for each specie, build a plot
    sortable.map(d => d[0]).forEach(e => {
        const svg_4 = d3.select("#small-multiple-scatterplot")
            .append("svg")
            .attr("width", width_4 + margin_4.left + margin_4.right)
          .attr("height", height_4 + margin_4.top + margin_4.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin_4.left * 2 + "," + margin_4.top * 3 + ")")
            .style("margin_4-bottom", "50px");

        svg_4.append("g")
            .attr("transform", "translate(0," + height_4 + ")")
            .call(d3.axisBottom(x));

        svg_4.append("g")
            .call(d3.axisLeft(y));


        svg_4.append("text")
            .attr("transform", "translate(" + (width_4 / 2) + " ," + (-margin_4.top) + ")")
            .style("text-anchor", "middle")
            .text(e)

        svg_4.append('g')
            .selectAll("dot")
            .data(data.filter(d => d.Species == e))
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Leaf_area); })
            .attr("cy", function (d) { return y(d.CO2); })
            .attr("r", 3)
            .style("fill", function (d) { return color(d.Species) })

        svg_4.append("text")
            .attr("text-anchor", "end")
            .attr("x", (width_4 / 2) + 50)
            .attr("y", height_4 + 35)
            .text("Leaf_Area");

        // Y axis label
    svg_4.append("text")      // text label for the y axis
    .attr("x", (-height_4 / 2))
    .attr("y", -30)
    .style("text-anchor", "middle")
    .style("class", "h2")
    .style("font-size", "16px")
    .attr("transform", "rotate(-90)")
    .text("CO2");

          
    
       
    });
  })