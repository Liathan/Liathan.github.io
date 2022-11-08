const id_ref_2 = "#stacked-barchart"

const margin_2 = {top: 50, right: 20, bottom: 175, left: 190},
    width_2 = 800 - margin_2.left - margin_2.right,
    height_2 = 600 - margin_2.top - margin_2.bottom;

const svg_2 = d3.select(id_ref_2)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    //.attr("width", width + margin_2.left + margin_2.right)
    //.attr("height", height + margin_2.top + margin_2.bottom)
    .attr("viewBox", '0 0 ' + (width_2 + margin_2.left + margin_2.right) +
        ' ' + (height_2 + margin_2.top + margin_2.bottom))
    .append("g")
    .attr("transform", `translate(${margin_2.left}, ${margin_2.top})`);


    d3.csv("../data/assign1-plot2.csv").then(function(data) {

        var subgroups = data.columns.slice(1)
        var groups = d3.map(data, function(d){return(d.Circoscrizione)})
        console.log(subgroups)
        var x = d3.scaleBand()
        .domain(groups)
        .range([0, width_2])
        .padding([0.2])
        
        
        

        svg_2.append("g")
            .attr("transform", "translate(0," + height_2 + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

  
            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, 3500])
            .range([ height_2, 0 ]);
            svg_2.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px");
        
            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['red', 'green', 'pink', 'yellow', 'black','blue'])
        
            //stack the data? --> stack per subgroup
            var stackedData = d3.stack()
            .keys(subgroups)
            (data)
        
            // Show the bars
            svg_2.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Circoscrizione); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())

        svg_2.selectAll("rect")
        .on("mouseover", function (event, d) {
            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("opacity", 1.0)
            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", .9);
            tooltip.html("<span class='tooltiptext'>" + "<b>Abundance: " + d.Count + 
                            "</b><br>" + "Average canopy size: "+ d.AverageCanopySize + "</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5)
            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
            });
  })
