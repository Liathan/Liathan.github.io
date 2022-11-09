const id_ref_5 = "#waffle-chart"


const margin_5 = {top:10,right:150,bottom:30,left:0},
    width_5  = 600 - margin_5.left - margin_5.right,
    height_5 = 700 - margin_5.top - margin_5.bottom,
    boxSize = 20, //size of each box
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
    console.log("Subgroups:", subgroups)
    //convert to a categorical scale
    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#ff595e", "#ffca3a", '#8ac926', '#1982c4', '#6a4c93', '#606470']);
    pippo = data
    data2 = []
    for(j = 0; j < 12; ++j)
    {
        circo = data[j]['Circoscrizione']
        tmp = []
        for(k = 1; k < 7; ++k)
        {
            // console.log(k, data[j][subgroups[k]])
            tmp.push(Array(parseInt(data[j][subgroups[k]])).fill(subgroups[k]))
        }
        data2[circo] = tmp.flat()
    }
    console.log("Data", data)
    console.log("Data2", data2)
    // console.log(data2['POVO'])
   
    //make the main chart
    g.selectAll(".square")
        .data(data2['POVO'])
        .join("rect")
            .attr("class", "square")
            .attr("x", function(d,i){ return boxSize * (i % howManyAcross); })
            .attr("y", function(d,i){ return Math.floor(i/howManyAcross) * boxSize; })
            .attr("width", boxSize - 3)
            .attr("height", boxSize - 3)
            .attr("fill", function(d){console.log("D", d); return color(d);})
        
    // console.log(color)
    
    //legend
    // var legend = svg.selectAll(".legend")
    //     .data(subgroups)
    //     .enter();
    
    
    // legend.append("rect")
    //     .attr("x", margin.left + width + boxGap )
    //     .attr("y", function(d,i){ return (i * boxSize) + margin.top; })
    //     .attr("width", boxSize - 3)
    //     .attr("height", boxSize - 3)
    //     .attr("fill", function(d){ return categoryScale(d); })
    
    // legend.append("text")
    //     .attr("x", margin.left + width + boxSize + (boxGap*2))
    //     .attr("y", function(d,i){ return (i * boxSize) + margin.top; })
    //     .append("tspan")
    //     .attr("dx", 0)
    //     .attr("dy", boxSize/2)
    //     .style("alignment-baseline", "middle")
    //     .style("font-size", 10)
    //     .style("font-family", "Helvetica, Arial, sans-serif")
    //     .text(function(d){ return d;})
});