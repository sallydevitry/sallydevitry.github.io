class Bubble {
  constructor() {
  }

  draw(raw_dataset) {
    var selectedMajors = [];
    var selectedIndices = [];
    drawBarChart();
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
    var dataset = new Object();
    dataset['children'] = [];
    raw_dataset.forEach((row) => dataset['children'].push({
      'Starting Median Salary':Number(row['Starting Median Salary'].replace(/[^0-9.-]+/g,"")),
      'Undergraduate Major': row['Undergraduate Major'],
      'data': row,
    }));

    var diameter = 600;
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    // get the bubble chart svg element
    var svg = d3.select("#bubbleSvg")
    // git the bar chart svg element
    var barChartSvg = d3.select("#barChartSvg");

    // give the radius to the bubble
    var nodes = d3.hierarchy(dataset)
        .sum(function(d) {
          return d['Starting Median Salary'];
        });

    // move and give id to bubbles
    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr('id', function(d) {return (stripSpaces(d['data']['Undergraduate Major']))})
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // insert a title
    node.append("title")
        .text(function(d) {
            return d['data']['Undergraduate Major'] + ": " + formatter.format(d.data['Starting Median Salary']);
        })

    // a circle with the radius from heirarchy
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .attr("fill", function(d,i) {
            return '#555555';
        });

    // add major title inside of circle
    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data['Undergraduate Major'].substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    // add starting median salary inside of circle
    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return formatter.format(d.data['Starting Median Salary']);
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    let bc = this;

    // add an on click to change color and add to selected array
    svg.selectAll('g')
        .on('click', function(d,i) {
          // check if it's already in the array
            bc.selectedElement = d3.select(this).selectAll('circle');
            if (selectedIndices.includes(i)) {
              console.log('removing');
              var index = selectedIndices.indexOf(i);
              selectedIndices.splice(index, index+1);
              selectedMajors.splice(index, index+1);
              bc.selectedElement.attr('fill', '#555555');
            } else {
              console.log('adding');
              bc.selectedDatum = d;
              bc.selectedElement.attr('fill', color(i));
              selectedIndices.push(i);
              selectedMajors.push({data:bc.selectedDatum, index: i});
            }
            drawBarChart();
        });

    //*********************************************88
    // bar chart
    //*********************************************88
    function drawBarChart() {
    d3.select('#bars').selectAll('rect').remove();
    let xScale = d3.scaleBand()
      .domain(selectedMajors.map(x => x['data']['data']['Undergraduate Major']))
      .range([0, 400])

    let yScale = d3.scaleLinear()
      .domain([0, 300000])
      .range([450, 0 ]);

    let xAxis = d3.axisBottom(xScale);
    d3.select('#xAxis')
      .attr("transform", `translate(${50}, ${475})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(90)")
      .attr("x", 9)
      .attr("dy", "-.35em")
      .style("text-anchor", "start");

    let yAxis = d3.axisLeft(yScale);
    d3.select('#yAxis')
      .attr("transform", `translate(${50}, 25)`)
      .call(yAxis)
      .selectAll("text");

    // display the starting median bars
    let bars = d3.select('#bars').selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => color(d['index']))
      .attr('x', (d,i) => 55 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) { console.log(d);return 450-yScale(d['data']['data']['Starting Median Salary']); }) // always equal to 0
      .attr("y", function(d) { return 25 + yScale(d['data']['data']['Starting Median Salary']); });


    }
  }
}

// filter degrees in search bar
function filterJobs() {
    var input, filter, tr, school, i, txtValue;
    input = document.getElementById('searchbox-jobs');
    filter = input.value.toUpperCase();
    bubbles = document.querySelectorAll('g.node')
    degreesList = []
    bubblesToShow = []
    for (i=0; i< bubbles.length; i++) {
        degreesList.push(bubbles[i].id)
    }
    for (i=0; i<bubbles.length; i++) {
        bubbles[i].style.display = 'none';
    }

    for (i = 0; i < degreesList.length; i++) {
        degree = degreesList[i]
        if (degree.toUpperCase().indexOf(filter) > -1) {
            bubblesToShow.push(document.getElementById(degree))
        }
    }
    for (j=0; j<bubblesToShow.length; j++){
        bubblesToShow[j].style.display=''
    }
}
