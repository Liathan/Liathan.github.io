const id_ref_5 = "#waffle-chart"


const margin_5 = {top:10,right:0,bottom:30,left:0},
    width_5  = 600 - margin_5.left - margin_5.right,
    height_5 = 640 - margin_5.top - margin_5.bottom,
    boxSize = 60, //size of each box
    boxGap = 3, //space between each box
    howManyAcross = Math.floor(width_5 / boxSize);
  
const svg_5 = d3.select(id_ref_5)
    .append("svg")
    .attr("width", width_5 + margin_5.left + margin_5.right)
    .attr("height", height_5 + margin_5.top + margin_5.bottom)
    .attr("viewBox", "0 0 " + (width_5 + margin_5.left + margin_5.right) + " " + (height_5 + margin_5.top + margin_5.bottom));


const categoryHeading = "SARDAGNA"

const g = svg_5.append("g")
    .attr("transform","translate(" + margin_5.left + "," + margin_5.top + ")");

//rainbow colors
// const colors = d3.scaleSequential(d3.interpolateCubehelixDefault);

d3.csv('../data/assign1-plot5.csv').then(function(data, i){
    
    const subgroups = data.columns.slice(0);
    //get all of the unique values in the column for the scale
    var keys = d3.map(data, function(d){ return d[categoryHeading];}).keys();
    //console.log("Subgroups:", subgroups)
    //convert to a categorical scale

    const tooltip = d3.select(id_ref_2)
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0);

    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);
    pippo = data
    pluto = subgroups
    data2 = []
    for(j = 0; j < 12; ++j)
    {
        circo = data[j]['Circoscrizione']
        tmp = []
        for(k = 1; k < 7; ++k)
        {
            //console.log(k, data[j][subgroups[k]])
            tmp.push(Array(Math.round(data[j][subgroups[k]])).fill(subgroups[k]))
        }
        data2[circo] = tmp.flat()
    }
    //console.log("Data", data)
    //console.log("Data2", data2)
    // console.log(data2['POVO'])
   
    //make the main chart
    g.selectAll(".square")
        .data(data2['MEANO'])
        .join("rect")
            .attr("class", "square")
            .attr("x", function(d,i){ return boxSize * (i % howManyAcross); })
            .attr("y", function(d,i){ return Math.floor(i/howManyAcross) * boxSize; })
            .attr("width", boxSize - 3)
            .attr("height", boxSize - 3)
            .attr("fill", function(d){return color(d);})
            .attr("opacity", 0.5)
        
    // console.log(color)
    
    function count(d)
    {
        tot = 0;
        for(j = 0; j < data2['MEANO'].length; ++j)
        {
            if (data2['MEANO'][j] == d)
            {
                tot += 1
            }
        }
        return tot
    }

    svg_5.selectAll("rect")
        .on("mouseover", function (event, d){
            console.log(event)
            d3.select(event.currentTarget)
                    .transition("selected")
                        .duration(300)
                        .style("opacity", 1.0);

            tooltip.transition("appear-box")
                .duration(300)
                .style("opacity", 1)
                .delay(1);

            tooltip.html("<span class='tooltiptext'>" + "<b>Species: " + d + 
                            "</b><br>" + "Abundance: "+ count(d) + "</span>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (event, d) {

            d3.select(event.currentTarget)
                .transition("unselected")
                    .duration(300)
                    .style("opacity", 0.5);  

            tooltip.transition("disappear-box")
                .duration(300)
                .style("opacity", 0);
        });

    //legend
    var legend = svg_5.selectAll(".legend")
        .data(subgroups);
    
    
    legend.join("rect")
        .attr("x", margin_5.left + width_5 + boxGap )
        .attr("y", function(d,i){ return (i * boxSize) + margin_5.top; })
        .attr("width", boxSize - 3)
        .attr("height", boxSize - 3)
        .attr("fill", function(d){ console.log("AAAAAAAaa"); return color(d); })
    
    legend.join("text")
        .attr("x", margin_5.left + width_5 + boxSize + (boxGap*2))
        .attr("y", function(d,i){ return (i * boxSize) + margin_5.top; })
        .append("tspan")
        .attr("dx", 0)
        .attr("dy", boxSize/2)
        .style("alignment-baseline", "middle")
        .style("font-size", 10)
        .text(function(d){ console.log("BBBBBB");return d;})
});