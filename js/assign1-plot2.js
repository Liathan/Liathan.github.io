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
        
        const subgroups = data.columns.slice(1)

        const groups = data.map(d => (d.Circoscrizione))
        const tooltip_2 = d3.select(id_ref_2)
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

        console.log(subgroups)
        
        const x = d3.scaleLinear()
        .domain([0, 3500])
        .range([0, width_2])
        
        var y = d3.scaleBand()
        .domain(groups)
        .range([ 0, height_2 ])
        .padding([0.2]);

        svg_2.append("g")
            .attr("transform", "translate(0," +height_2 +")" )
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px");

  
            // Add Y axis
        svg_2.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px");
        
            // color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['red', 'green', 'pink', 'yellow', 'black','blue'])
        
            //stack the data? --> stack per subgroup
        const stackedData = d3.stack()
            .keys(subgroups)
            (data)
            // Show the bars
        svg_2.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
                .attr("fill", d => color(d.key))
                .selectAll("rect")
                .data(d => d)
                .join("rect")
                    .attr("x", d => x(d[0]))
                    .attr("y", d => y(d.data.Circoscrizione))
                    .attr("height", y.bandwidth())
                    .attr("width", d => x(d[1]) - x(d[0]))
                    .attr("opacity", 0.5)

        svg_2.selectAll("rect")
        .on("mouseover", function (event, d) {
            const species = d3.select(this.parentNode).datum().key
            d3.select(event.currentTarget)
                .transition("selected")
                    .duration(300)
                    .style("opacity", 1.0)
            tooltip_2.transition("appear-box")
                .duration(300)
                .style("opacity", .9);
            tooltip_2.html("<span class='tooltiptext'>" + "<b>Species: " +species + 
                            "</b><br>" + "Abundance: "+ (d[1] - d[0]) + "</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5)
            tooltip_2.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
            });
  })
