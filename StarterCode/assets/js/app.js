var svgWidth = 800;
var svgHeight = 400;

var margin = {
  top: 10,
  right: 50,
  bottom: 80,
  left: 60
};
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter").append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class","insideChart");

d3.csv("./assets/data/data.csv",function(data){
    data.forEach(function(d){
        // console.log(d.abbr)
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    })

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty)-0.5,d3.max(data, d => d.poverty)+0.5])
      .range([0,chartWidth-10]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)+4])
      .range([chartHeight, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(6);

    // append x axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);
    
    // text label for the x axis
    svg.append("text")             
    .attr("transform",
          "translate(" + (chartWidth/2) + " ," + 
                        (chartHeight + margin.top + 50) + ")")
    .text(`Poverty(%)`);
    
    // append y axes
    chartGroup.append("g")
      .call(yAxis);
    
    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x",0 - (chartHeight / 2))
    .text("Healthcare(%)");

    // line generator
    var line = d3.line()
      .x(d => xLinearScale(d.poverty))
      .y(d => yLinearScale(d.healthcare));

    // append line
    chartGroup.append("path")
      .data([data])
      .attr("d", line)
      .attr("fill", "none");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "8")
      .attr("fill", "lightblue")
      .attr("stroke-width", "1")
      .attr("stroke", "black")


    //append text in circles
    var abbrGroup = chartGroup.selectAll("insideChart")
      .data(data)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d.poverty-0.11))
      .attr("y", d => yLinearScale(d.healthcare-0.17))
      .attr("font_family", "sans-serif")  // Font type
      .attr("font-size", "8px")  // Font size
      .attr("fill", "black")   // Font color
      .attr("font-weight","bold")
});

