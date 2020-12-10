class Bubble {
  constructor() {
  }
  //TODO: make monochromatic
  //TODO: create a lineup of bubbles
  //TODO: fix tooltip

  draw(raw_dataset) {
    var selectedMajors = [];
    var selectedIndices = [];
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
      'Undergraduate Major': row['Undergraduate Major']
    }));
    var diameter = 600;
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);
    var svg = d3.select("#myAreaChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) {
          return d['Starting Median Salary'];
        });

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
    node.append("title")
        .text(function(d) {
            return d['data']['Undergraduate Major'] + ": " + formatter.format(d.data['Starting Median Salary']);
        });
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return '#424242';
        });
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


        // the line chart
        let sortedData = [];
        raw_dataset.forEach(function(item) {
          item['Starting Median Salary'] = Number(item['Starting Median Salary'].replace(/[^0-9.-]+/g,""));
          sortedData.push(item);
        });

        sortedData.sort(function(a, b) {
          if (a['Starting Median Salary'] > b['Starting Median Salary']) return -1;
          else if (a['Starting Median Salary'] < b['Starting Median Salary']) return 1;
          else return 0;
      });
        let max = sortedData[0]['Starting Median Salary'];
    let lineHeight = 300;
    var svg2 = d3.select("#sequential")
        .append("svg")
        .attr("width", sortedData.length * 150+100)
        .attr("height", lineHeight)
        .attr("class", "bubble");

    let circles = svg2.selectAll('circle').data(sortedData).enter()
        .append('circle')
        .attr('cx', function(d, i) {console.log(d); return i*150+100})
        .attr('cy', 100)
        .attr('r', (d, i) => 50*d['Starting Median Salary']/max)
        .attr('fill', '#424242');

        var synth = window.speechSynthesis;

    svg2.selectAll('circle').on('mouseover', function(d,i) {
      // let utterThis = new SpeechSynthesisUtterance(d['Starting Median Salary']);
      // synth.speak(utterThis);
    });

    let bc = this;
    svg2.selectAll('circle').on('click', function(d,i) {
      let utterThis = new SpeechSynthesisUtterance(d['Starting Median Salary']);
      synth.speak(utterThis);
      // check if it's already in the array
      console.log(selectedIndices);
        bc.selectedElement = d3.select(this);
        if (selectedIndices.includes(i)) {
          var index = selectedIndices.indexOf(i);
          selectedIndices.splice(index, index+1);
          selectedMajors.splice(index, index+1);
          bc.selectedElement.attr('fill', '#424242');
        // bc.remove(bc.selectedDatum);
        } else {
          bc.selectedDatum = d;
          bc.selectedElement.attr('fill', color(i));
          selectedIndices.push(i);
          selectedMajors.push(bc.selectedDatum);
        // bc.select(bc.selectedDatum);
        }
    });

    let text = svg2.selectAll('div').data(sortedData).enter()
    .append('g')
        .insert('text')
        .text((d, i) => d['Undergraduate Major'])
        // .attr('x', (d,i) => i*150+50)
        // .attr('y', 200)
        .attr('transform', (d,i)=> `translate(${i*150+100},180) rotate(15)`);

    let text2 = svg2.selectAll('div').data(sortedData).enter()
        .append('text')
        .text((d, i) => formatter.format(d['Starting Median Salary']))
        // .attr('x', (d,i) => i*150+50)
        // .attr('y', 200)
        .attr('transform', (d,i)=> `translate(${i*150+105},200) rotate(15)`);
  }


}

function filterJobs() {
    var input, filter, tr, school, i, txtValue;
    input = document.getElementById('searchbox-jobs');
    console.log(input.value)
    filter = input.value.toUpperCase();
    bubbles = document.querySelectorAll('g.node')
    degreesList = []
    bubblesToShow = []
    for (i=0; i< bubbles.length; i++) {
        degreesList.push(bubbles[i].id)
    }
    console.log(degreesList)
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
