const id_ref_4 = "#small-multiple-scatterplot"


const trees=["Tilia cordata","Carpinus betulus","Celtis australis","Platanus x hispanica","Aesculus hippocastanum"]

const margin_4 = { top: 20, right: 20, bottom: 30, left: 50 },
            cWidth = 170,
            cHeight = 200,
            width_4 = (cWidth + margin_4.left + margin_4.right) * trees.length,
            height_4 = (cHeight + margin_4.top + margin_4.bottom) ;

              // set the ranges
        var x = d3.scaleLinear().range([0, cWidth]);
        var y = d3.scaleLinear().range([cHeight, 0]);

        // Scale the range BUT not based on the data
        x.domain([0, 1]);
        y.domain([0, 0.3]);

        var svg = d3.select("body").append("svg")
        .attr("width", width_4)
        .attr("height", height_4)
        .append("g")
        ;



        d3.csv("../data/assign2-plot3.csv").then(function(data) {
            for (j = 0; j < trees.length; j++) {
                var tree = trees[j];
                var gtree = svg.append("g")
                .attr("id", tree)
                .attr("transform",
                "translate(" + (j * (cWidth + margin_4.left + margin_4.right)) + "," + 0 + ")");

            gtree.append("text")
                .attr("class", "label")
                .attr("x", cWidth / 2 + 30)
                .attr("y", height_4 - 5)
                .style("text-anchor", "center")
                .text(tree);
                var filtered = data.filter(function (d) { return d.Species == tree ; });

                 // Add the scatterplot
                 gtree.selectAll(".dot")
                 .data(filtered)
                 .enter().append("circle")
                 .classed("dot", true)
                 .attr("r", 4)
                 .attr("cx", function (d) { return x(d.Leaf_Area); })
                 .attr("cy", function (d) { return y(d.CO2); })
                 gtree.append("g")
                 .attr("transform", "translate(0," + cHeight + ")")
                 .call(d3.axisBottom(x));

             gtree.append("text")
                 .attr("class", "label")
                 .attr("x", cWidth)
                 .attr("y", cHeight - 5)
                 .style("text-anchor", "end")
                 .text("employed/pop.");

             // Add the Y Axis
             gtree.append("g")
                 .call(d3.axisLeft(y));

             gtree.append("text")
                 .attr("class", "label")
                 .attr("transform", "rotate(-90)")
                 .attr("y", 10)
                 .attr("x", 0)
                 .style("text-anchor", "end")
                 .text("unempl./pop.");
         }
     
 });
        