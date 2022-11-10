// -------------------------------------------------------------------------
// Assignment 1: BarChart (first plot)
// We want to show the aboundance of each tree Circoscrizione in Trento's territory
//--------------------------------------------------------------------------


// Refer to the id div
const id_ref_3 = "#small-multiple-stacked-barchart"

// Set the dimensions and margins of the graph
const margin_3 = {top: 50, right: 20, bottom: 50, left: 200},
    width_3 = 800 - margin_3.left - margin_3.right,
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
            .attr("transform", `translate(10, ${margin_3.top})`);


cose3 = 0
// Parse the Data
d3.csv("../data/assign1-plot3.csv").then(function(data, num=15) {

    // Extract the highest "num" values
    const topNum = data.slice(0,num).reverse();
    const subgroups = data.columns.slice(1);
    var max_widths_3 = Array(6)
    var sum = 0
    for(i = 0; i < 6; ++i)
    {
        max_widths_3[i] = Math.max.apply(Math, topNum.map(function(value) {
            return value[subgroups[i]]/2; }))
        
        var y = d3.scaleBand()
        .range([0, height_3])
        .domain(topNum.map(function(d) { return d.Circoscrizione; }))
        .padding(.1);

        if(i==0)
        {  
        svg_3.append("g")
        //.attr("class", "y-ticks")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(${margin_3.left+sum+5}, ${margin_3.top})`)
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px")
        }
        else
        {  
        svg_3.append("g")
        //.attr("class", "y-ticks")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(${margin_3.left+sum+5}, ${margin_3.top})`)
        .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "0px")
        }
        
        // Add x axis
        const x = d3.scaleLinear()
        .domain([0, max_widths_3[i]])
        .range([sum+5+margin_3.left, (sum + max_widths_3[i])/5]);
        
        console.log("AAAAAAAAAAAA", Math.ceil(max_widths_3[i]/100)*100, max_widths_3[i])

        cose3 = x
        sum += max_widths_3[i]
        console.log("XXXXXXXXXXX", x)
        svg_3.selectAll(id_ref_3)
        .data(topNum)
        .join("rect")
            .attr("x", x(0))
            .attr("y", function(d) {  return y(d.Circoscrizione); })
            //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
            .attr("width", function(d) { console.log(d[subgroups[i]]); return x(d[subgroups[i]])/max_widths_3[i]; })
            .attr("height", y.bandwidth() )
            .attr("fill", "#1c7c54")
            .attr("opacity", 0.5);
    } 
    // cose3 = max_widths_3
    // Compute the max_width of the x axis
    // const max_width_3 = Math.max.apply(Math, topNum.map(function(value) {
    //     return value["Celtis australis"];
    // }));

    // // Add x axis
    // const x = d3.scaleLinear()
    //     .domain([0, Math.ceil(max_width_3/100)*100])
    //     .range([0, width_3/5]);
    // svg_3.append("g")
    //     .attr("transform", "translate(0," + height_3 + ")")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //         .attr("transform", "translate(-10,0)rotate(-45)")
    //         .style("text-anchor", "end")
    //         .style("font-size", "12px");

    // // Y axis
    // // const y = d3.scaleBand()
    // //     .range([0, height_3])
    // //     .domain(topNum.map(function(d) { return d.Circoscrizione; }))
    // //     .padding(.1);
    // // svg_3.append("g")
    // //     //.attr("class", "y-ticks")
    // //     .call(d3.axisLeft(y))
    // //     .selectAll("text")
    // //         .style("text-anchor", "end")
    // //         .style("font-size", "12px")

    // // create a tooltip
    // const tooltip = d3.select(id_ref_3)
    //     .append("div")
    //     .attr("class", "tooltip")
    //     .style("font-size", "14px")
    //     .style("background-color", "white")
    //     .style("border", "solid")
    //     .style("border-width", "1px")
    //     .style("border-radius", "5px")
    //     .style("padding", "10px")
    //     .style("opacity", 0);

    // // Show the bars
    // svg_3.selectAll(id_ref_3)
    //     .data(topNum)
    //     .join("rect")
    //         .attr("x", x(0))
    //         .attr("y", function(d) { return y(d.Circoscrizione); })
    //         //.attr("width", function(d) { return Math.max(x(d["Celtis australis"])-width_3, 0); })
    //         .attr("width", function(d) { return x(0); })
    //         .attr("height", y.bandwidth() )
    //         .attr("fill", "#1c7c54")
    //         .attr("opacity", 0.5);
    
    // // Title
    // svg_3.append("text")
    //     .attr("x", ((width_3 - (margin_3.left - margin_3.right)) / 2))             
    //     .attr("y", 0 - (margin_3.top / 2))
    //     .style("class", "h2")
    //     .style("font-size", "18px")
    //     .attr("text-anchor", "middle")  
    //     .style("text-decoration", "underline")  
    //     .text("Aboundance of tree Circoscrizione - Top " + num);

    // // X axis label
    // svg_3.append("text")      // text label for the x axis
    //     .attr("x", (width_3 / 2))
    //     .attr("y", (height_3 + margin_3.bottom))
    //     .style("class", "h2")
    //     .style("font-size", "16px")
    //     .style("text-anchor", "middle")
    //     .text("Count");

    // // // Y axis label
    // // svg_3.append("text")      // text label for the y axis
    // //     .attr("x", (-height_3 / 2))
    // //     .attr("y", -170)
    // //     .style("text-anchor", "middle")
    // //     .style("class", "h2")
    // //     .style("font-size", "16px")
    // //     .attr("transform", "rotate(-90)")
    // //     .text("Tree Circoscrizione");

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