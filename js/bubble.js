// lightens or darkens colors for colored grouped stacked bar chart
function lightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}


// contains grouped bubble chart and bar chart
class Bubble {
  constructor() {
  }

  draw(raw_dataset) {
    // arrays to hold selected bubbles data
    var selectedMajors = [];
    var selectedIndices = [];

    // draw default bubble chart
    drawBarChart();

    // colors of selected bubbles
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // turns numbers into dollars
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
	  
    // create dataset according to bubble formatting
    var dataset = new Object();
    dataset['children'] = [];
    raw_dataset.forEach((row) => dataset['children'].push({
      'Starting Median Salary':Number(row['Starting Median Salary'].replace(/[^0-9.-]+/g,"")),
      'Undergraduate Major': row['Undergraduate Major'],
      'data': row,
    }));

    var diameter = 750;
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
        }).style('stroke', 'lightgray').style('stroke-width', 3).attr('z-index', 1001)

        function mouseoverC() {
          d3.select(this).select("circle").transition()
              .duration(700)
              .attr("r", function(d){return d.r*1.2});
      }
      
      //hover opposite, to bring back to its original state 
      function mouseoutC() {
          d3.select(this).select("circle").transition()
              .duration(750)
          .attr("r", function(d){return d.r});
      }

    // add major title inside of circle
    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data['Undergraduate Major'].substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/4.5;
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
	      // remove and set back to gray
              var index = selectedIndices.indexOf(i);
              selectedIndices.splice(index, index+1);
              selectedMajors.splice(index, index+1);
              bc.selectedElement.attr('fill', '#555555');
            } else {
	      // add and pick color according to index
              bc.selectedDatum = d;
              bc.selectedElement.attr('fill', color(i));
              selectedIndices.push(i);
              selectedMajors.push({data:bc.selectedDatum, index: i});
            }
            // update the chart
            drawBarChart();
        }).on("mouseover", mouseoverC)
        .on("mouseout", mouseoutC); // grow on mouseover

    //*********************************************88
    // bar chart
    //*********************************************88
    function drawBarChart() {
    d3.select('#bars').selectAll('rect').remove();
	 // majors for the x axis
    let xScale = d3.scaleBand()
      .domain(selectedMajors.map(x => x['data']['data']['Undergraduate Major']))
      .range([0, 400])

	    // dollar amount for the y axis
    let yScale = d3.scaleLinear()
      .domain([0, 200000])
      .range([450, 0 ]);

	    // align the axis
    let xAxis = d3.axisBottom(xScale);
    d3.select('#xAxis')
      .attr("transform", `translate(${50}, ${475})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(90)")
      .attr("x", 9)
      .attr("dy", "-.35em")
      .style("text-anchor", "start");

	    // titles
    d3.select('#barChartSvg').append('text').attr('x', 0).attr('y', 10).text('Yearly Salary($)').style('font-size', '11').style('font-weight', 'bold')
    d3.select('#barChartSvg').append('text').attr('x', 440).attr('y', 495).text('Degree').style('font-size', '11').style('font-weight', 'bold')

	    // align the y axis
    let yAxis = d3.axisLeft(yScale);
    d3.select('#yAxis')
      .attr("transform", `translate(${50}, 25)`)
      .call(yAxis)
      .selectAll("text");

	    // g's for every gorup - starting, 10th, 25th, median, etc.
    let bars = d3.select('#bars');
    let g1 = bars.append('g');
    let g2 = bars.append('g');
    let g3 = bars.append('g');
    let g4 = bars.append('g');
    let g5 = bars.append('g');
    let g6 = bars.append('g');

    // display the starting median bars
    g1.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), 50))
      .attr('x', (d,i) => 30 -1 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {return 450-yScale(d['data']['data']['Starting Median Salary']); }) // always equal to 0
      .attr("y", function(d) { return 25 + yScale(d['data']['data']['Starting Median Salary']); })
      .append('title')
      .text((d) => `Starting Median Salary\n${formatter.format(d['data']['data']['data']['Starting Median Salary'].replace(/[^0-9.-]+/g,""))}`)

    // display the stacked mid career bars
    // let tenthbars = d3.select('#bars').selectAll('rect')
    g2.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), 40))
      .attr('x', (d,i) => 50 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {
        return 450-yScale(Number(d['data']['data']['data']['Mid-Career 10th Percentile Salary'].replace(/[^0-9.-]+/g,""))); }) // always equal to 0
      .attr("y", function(d) {return 25 + yScale(Number(d['data']['data']['data']['Mid-Career 10th Percentile Salary'].replace(/[^0-9.-]+/g,""))); })
      .append('title')
      .text((d) => `Mid Career 10th Percentile\n${formatter.format(d['data']['data']['data']['Mid-Career 10th Percentile Salary'].replace(/[^0-9.-]+/g,""))}`)

	    // 25th percentile salaries
    g3.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), 30))
      .attr('x', (d,i) => 50 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {
        return 450-1-yScale(Number(d['data']['data']['data']['Mid-Career 25th Percentile Salary'].replace(/[^0-9.-]+/g,""))-Number(d['data']['data']['data']['Mid-Career 10th Percentile Salary'].replace(/[^0-9.-]+/g,""))); }) // always equal to 0
      .attr("y", function(d) {return 25 + yScale(Number(d['data']['data']['data']['Mid-Career 25th Percentile Salary'].replace(/[^0-9.-]+/g,""))); })
      .append('title')
      .text((d) => `Mid Career 25th Percentile\n${formatter.format(d['data']['data']['data']['Mid-Career 25th Percentile Salary'].replace(/[^0-9.-]+/g,""))}`)


	    // median salaries
    g4.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), 20))
      .attr('x', (d,i) => 50 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {
        return 450-1-yScale(Number(d['data']['data']['data']['Mid-Career Median Salary'].replace(/[^0-9.-]+/g,""))-Number(d['data']['data']['data']['Mid-Career 25th Percentile Salary'].replace(/[^0-9.-]+/g,""))); }) // always equal to 0
      .attr("y", function(d) {return 25 + yScale(Number(d['data']['data']['data']['Mid-Career Median Salary'].replace(/[^0-9.-]+/g,""))); })
      .append('title')
      .text((d) => `Mid Career Median\n${formatter.format(d['data']['data']['data']['Mid-Career Median Salary'].replace(/[^0-9.-]+/g,""))}`)


	    // 75th percentile
    g5.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), 10))
      .attr('x', (d,i) => 50 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {
        return 450-1-yScale(Number(d['data']['data']['data']['Mid-Career 75th Percentile Salary'].replace(/[^0-9.-]+/g,""))-Number(d['data']['data']['data']['Mid-Career Median Salary'].replace(/[^0-9.-]+/g,""))); }) // always equal to 0
      .attr("y", function(d) {return 25 + yScale(Number(d['data']['data']['data']['Mid-Career 75th Percentile Salary'].replace(/[^0-9.-]+/g,""))); })
      .append('title')
      .text((d) => `Mid Career 75th Percentile\n${formatter.format(d['data']['data']['data']['Mid-Career 75th Percentile Salary'].replace(/[^0-9.-]+/g,""))}`)


	    // 90th percentile bars
    g6.selectAll('rect')
      .data(selectedMajors).enter().append('rect')
      .attr('width', 20)
      .attr('fill', (d) => lightenDarkenColor(color(d['index']), -5))
      .attr('x', (d,i) => 50 + xScale.bandwidth()/2+ xScale.bandwidth()*i)
      .attr("height", function(d) {
        return 450-1-yScale(Number(d['data']['data']['data']['Mid-Career 90th Percentile Salary'].replace(/[^0-9.-]+/g,""))-Number(d['data']['data']['data']['Mid-Career 75th Percentile Salary'].replace(/[^0-9.-]+/g,""))); }) // always equal to 0
      .attr("y", function(d) {return 25 + yScale(Number(d['data']['data']['data']['Mid-Career 90th Percentile Salary'].replace(/[^0-9.-]+/g,""))); })
      .append('title')
      .text((d) => `Mid Career 90th Percentile\n${formatter.format(d['data']['data']['data']['Mid-Career 90th Percentile Salary'].replace(/[^0-9.-]+/g,""))}`)
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
