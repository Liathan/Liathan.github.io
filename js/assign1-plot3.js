// Refer to the id div
const id_ref_3 = "#small-multiple-stacked-barchart"

// Set the dimensions and margins of the graph
const margin_3 = {top: 50, right: 20, bottom: 50, left: 270},
    width_3 = 800 ,
    height_3 = 600 - margin_3.top - margin_3.bottom;

// Append the svg_3 object to the page
const svg_3 = d3.select(id_ref_3)
    .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        //.attr("width", width_3 + margin_3.left + margin_3.right)
        //.attr("height", height_3 + margin_3.top + margin_3.bottom)
        .attr("viewBox", '0 0 ' + (width_3+ margin_3.left + margin_3.right) +
            ' ' + (height_3 + margin_3.top + margin_3.bottom))
        .append("g")
            .attr("transform", `translate(-50, ${margin_3.top})`);


cose3 = 0
// Parse the Data
d3.csv("../data/assign1-plot3.csv").then(function(data) {

    // Extract the highest "num" values
    const topNum = data.slice(0)//.reverse();
    const subgroups = data.columns.slice(1);
    var max_widths_3 = Array(6)
    var cumsum = []
    var sum = 0

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);

    for( i = 0; i < 6; ++i)
    {
        max =  Math.max.apply(Math, topNum.map(function(value) { return value[subgroups[i]] / 3; }))
        sum += max
        max_widths_3[i] = (max)
        cumsum.push(sum)
    }

    var y = d3.scaleBand()
    .range([0, height_3])
    .domain(topNum.map(function(d) { return d.Circoscrizione; }))
    .padding(.1);
    
    //--------------------------- X ---------------------------------
    const x1 = d3.scaleLinear()
    .domain([0, max_widths_3[0] / 3])
    .range([0, max_widths_3[0] / 3-1]);
    cose3 = x1
    
    const x2 = d3.scaleLinear()
    .domain([0, max_widths_3[1] / 3])
    .range([0, max_widths_3[1] / 3-1]);

    const x3 = d3.scaleLinear()
    .domain([0, max_widths_3[2] / 3])
    .range([0, max_widths_3[2] / 3-1]);

    const x4 = d3.scaleLinear()
    .domain([0, max_widths_3[3] / 3])
    .range([0, max_widths_3[3] / 3-1]);
    
    const x5 = d3.scaleLinear()
    .domain([0, max_widths_3[4] / 3])
    .range([0, max_widths_3[4] / 3 -1]);

    const x6 = d3.scaleLinear()
    .domain([0, max_widths_3[5] / 3])
    .range([0, max_widths_3[5] / 6-1]);
    // MEGA HACK: ho cambiato la scala di other, SE lo vogliamo tenere dobbiamo commentarlo nella descrizione del grafico

    // ------------------------------ Y axis --------------------------------
    svg_3.append("g")
    //.attr("class", "y-ticks")
    .call(d3.axisLeft(y))
    .attr("transform", `translate(${margin_3.left}, 0)`)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "14px")

    svg_3.append("g")
    //.attr("class", "y-ticks")
    .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0))
    .attr("transform", `translate(${margin_3.left + cumsum[0]}, 0)`)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "0px")

    svg_3.append("g")
    //.attr("class", "y-ticks")
    .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0))
    .attr("transform", `translate(${margin_3.left + cumsum[1]}, 0)`)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "0px")

    svg_3.append("g")
    //.attr("class", "y-ticks")
    .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0))
    .attr("transform", `translate(${margin_3.left + cumsum[2]}, 0)`)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "0px")
        // Add x axis

    
    svg_3.append("g")
    //.attr("class", "y-ticks")
        .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0))
        .attr("transform", `translate(${margin_3.left + cumsum[3]}, 0)`)
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "0px")

    svg_3.append("g")
    //.attr("class", "y-ticks")
        .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0))
        .attr("transform", `translate(${margin_3.left + cumsum[4]}, 0)`)
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "0px")
    
    // ----------------------------------- Plotting ---------------------------
    console.log(topNum)
    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x1(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) {console.log(d['Circoscrizione'], subgroups[0], x1(d[subgroups[0]])); return x1(d[subgroups[0]]) / 3;})
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[0]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left}, 0)`)
    
    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x2(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) { return x2(d[subgroups[1]]) / 3; })
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[1]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + cumsum[0]}, 0)`)

    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x3(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) { return x3(d[subgroups[2]]) / 3; })
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[2]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + cumsum[1]}, 0)`);

    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x4(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) { return x4(d[subgroups[3]]) / 3; })
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[3]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + cumsum[2]}, 0)`);


    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x5(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) { return x5(d[subgroups[4]]) / 3; })
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[4]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + cumsum[3]}, 0)`);

    svg_3.selectAll(id_ref_3)
    .data(topNum)
    .join("rect")
        .attr("x", x6(0))
        .attr("y", function(d) {  return y(d.Circoscrizione); })
        //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
        .attr("width", function(d) { return x6(d[subgroups[5]]) / 3; })
        .attr("height", y.bandwidth() )
        .attr("fill", color(subgroups[5]))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin_3.left + cumsum[4]}, 0)`);
    // ----------------------------- FINE PLOTTING -----------------------------
    
    // // Animation
    // svg_3.selectAll("rect")
    //     .transition("loading")
    //     .duration(800)
    //     .attr("x", function(d) { return x(0); })
    //     .attr("width", function(d) { return x(d["Celtis australis"]); });
    //     //.delay(function(d,i){return(i*100);})

    // // Animation and filling of tooltip
    // svg_3.selectAll("rect")

    //     // MouseOver
    //     .on("mouseover", function (event, d) {

    //         d3.select(event.currentTarget)
    //             .transition("selected")
    //                 .duration(300)
    //                 .style("opacity", 1.0);

    //         tooltip.transition("appear-box")
    //             .duration(300)
    //             .style("opacity", .9)
    //             // Added to control the fact that the tooltip disappear if
    //             // we move between near boxes (horizontally)
    //             .delay(1);

    //         tooltip.html("<span class='tooltiptext'>" + "<b>Abundance: " + d["Celtis australis"] + 
    //                      "</b><br>" + "Average canopy size: "+ d.AverageCanopySize + "</span>")
    //             .style("left", (event.pageX) + "px")
    //             .style("top", (event.pageY - 28) + "px");

    //     })

    //     // MouseOut
    //     .on("mouseout", function (event, d) {
    //         d3.select(event.currentTarget)
    //             .transition("unselected")
    //                 .duration(300)
    //                 .style("opacity", 0.5);

    //         tooltip.transition("disappear-box")
    //             .duration(300)
    //             .style("opacity", 0);
    //     });

});