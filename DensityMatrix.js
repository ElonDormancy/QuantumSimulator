function Matrix(data, options) {
    var margin = options.margin,
        width = options.width,
        height = options.height,
        container = options.container,
        startColor = options.start_color,
        endColor = options.end_color,
        highlightCellOnHover = options.highlight_cell_on_hover,
        highlightCellColor = options.highlight_cell_color,
        labelmarginleft = options.labelmarginleft;
        text_exist = options.text_exist

    var dataValues = data['values'];
    var dataLabels = data['labels'];

    if (!dataValues) {
        throw new Error('data is empty');
    }

    if (!Array.isArray(dataValues) || !dataValues.length || !Array.isArray(dataValues[0])) {
        throw new Error('2-D array expected');
    }

    var maxValue = d3.max(dataValues, function (layer) { return d3.max(layer, function (d) { return d; }); });
    var minValue = d3.min(dataValues, function (layer) { return d3.min(layer, function (d) { return d; }); });

    var numrows = dataValues.length;
    var numcols = dataValues[0].length;

    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 420)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var background = svg.append("rect")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("width", width)
        .attr("height", height);

    var x = d3
        .scaleBand()
        .domain(d3.range(numcols))
        .range([0, width]);


    var y = d3
        .scaleBand()
        .domain(d3.range(numrows))
        .range([0, height]);

    var colorMap = d3.scaleLinear()
        .domain([0, 0.1])
        .range([startColor, endColor]);

    var row = svg.selectAll(".row")
        .data(dataValues)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { return "translate(0," + y(i) + ")"; });

    var cell = row.selectAll(".cell")
        .data(function (d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d, i) { return "translate(" + x(i) + ", 0)"; });

    cell.append('rect')
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("stroke-width", 1);

    row.selectAll(".cell")
        .data(function (d, i) { return dataValues[i]; })
        .style("fill", colorMap);

    if (text_exist){
        cell
        .append("text")
        .attr("dy", ".32em")
        .attr("x", x.bandwidth() / 2)
        .attr("y", y.bandwidth() / 2 - 4)
        .attr("text-anchor", "middle")
        .style("fill", function (d, i) { 
            if(d >= 0.1 / 2)
            {
                return 'white'
            }
            else{
                return 'black'
            }})
        .text(function (d, i) {
            if (d > 0) { return d; }
            else {return 0     }
            });
        }
    // if (highlightCellOnHover) {
    //     row.selectAll(".cell")
    //         .on("mouseover", function (d) {
    //             d3.select(this).style("fill", highlightCellColor);
    //             d3.select(this)
    //                 .append("text")
    //                 .attr("dy", ".32em")
    //                 .attr("x", x.bandwidth() / 2)
    //                 .attr("y", y.bandwidth() / 2 - 4)
    //                 .attr("text-anchor", "middle")
    //                 .style("fill", function (d, i) { return d >= maxValue / 2 ? 'white' : 'black'; })
    //                 .text(function (d, i) {
    //                     if (d > 0) { return d; }
    //                     else {
    //                         return 0
    //                     }
    //                 });
    //         })
            // .on("mouseout", function () {
            //     var t = d3.select(this)
            //     setTimeout(function () {
            //         t.style("fill", colorMap);
            //         t.selectAll("text").remove()
            //     }, 500);
            // });
    // }

    var labels = svg.append('g')
        .attr('class', "labels");

    var columnLabels = labels.selectAll(".column-label")
        .data(dataLabels)
        .enter().append("g")
        .attr("class", "column-label")
        .attr("transform", function (d, i) { return "translate(" + x(i) + "," + (height) + ")"; });

    columnLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", x.bandwidth() / 2)
        .attr("x2", x.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", 5);

    columnLabels.append("text")
        .attr("x", 0)
        .attr("dx", "-0.1em")
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".40em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .text(function (d, i) { return d; });

    var rowLabels = labels.selectAll(".row-label")
        .data(dataLabels)
        .enter().append("g")
        .attr("class", "row-label")
        .attr("transform", function (d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

    rowLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", 0)
        .attr("x2", -5)
        .attr("y1", y.bandwidth() / 2)
        .attr("y2", y.bandwidth() / 2);

    rowLabels.append("text")
        .attr("x", labelmarginleft)
        .attr("y", y.bandwidth() / 2 - 4)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function (d, i) { return d; });
}

