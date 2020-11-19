class Bubble {
  constructor() {
  }

  draw(dataset) {
    var diameter = 600;
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);
    var svg = d3.select("myAreaChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d['Starting Median Salary']; });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    node.append("title")
        .text(function(d) {
            return d['Undergraduate Major'] + ": " + d['Starting Median Salary'];
        });
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(i);
        });
    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data['Undergraduate Major'].substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data['Starting Median Salary'];
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
    d3.select(self.frameElement)
        .style("height", diameter + "px");
  }
}
