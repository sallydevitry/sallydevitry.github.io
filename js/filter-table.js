function drawTable(rankData){
    rankData.forEach(function(d) {
        schoolName = d.Name
        schoolRank = d.Rank
        schoolTuition = d['Total Annual Cost']
        schoolsTable = d3.select("#schools-table")
        tableRow = schoolsTable.append('tr')
        tableRow.append('td').append('input').attr('type', 'checkbox').attr('id', `i${schoolName}`).on('click', () => showSchoolDetails(d))
        tableRow.append('td').append('text').text(schoolName)
        tableRow.append('td').append('text').text(schoolRank)
        tableRow.append('td').append('text').text(schoolTuition)
    })
}

function showSchoolDetails(data) {
    console.log(data)
    detailPanel = d3.select('#school-details')
    currDiv = detailPanel.append('div').attr('class', 'flexRow')
    textDeetsDiv = currDiv.append('div')
    textDeetsDiv.append('text').text(data.Name)
    textDeetsDiv.append('br')
    textDeetsDiv.append('text').text("Student Population: ")
    textDeetsDiv.append('text').text(data['Student Population'])
    textDeetsDiv.append('br')
    textDeetsDiv.append('text').text("Average ACT score range: ")
    textDeetsDiv.append('text').text(data['ACT Lower'] + "-" + data['ACT Upper'])
    textDeetsDiv.append('br')
    textDeetsDiv.append('br')

    chartDeetsDiv = currDiv.append('div')
    chartDeetsDiv.append('text').text('heey')
    var q1 = data['Mid-Career 25th Percentile Salary']
    var median = data['Mid-Career Median Salary']
    var q3 = data['Mid-Career 75th Percentile Salary']
    var min = data['Mid-Career 90th Percentile Salary']
    var max = data['Mid-Career 10th Percentile Salary']

    //box plot
    var totalWidth = 450
        totalHeight = 120,
        margin = {
            top: 30,
            right: 30,
            bottom: 50,
            left: 30
        },
        width = totalWidth - margin.left - margin.right,
        height = totalHeight - margin.top - margin.bottom;

        //x scale
        var xScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, width])

        //features of the box
        var center = 200
        var width = 100
        chartDeetsDiv
            .append('line')
            .attr('x1', center)
            .attr('x2', center)
            .attr('y1', xScale(min))
            .attr('y2', xScale(max))
            .attr("stroke", "black")
        
        chartDeetsDiv
            .append('rect')
            .attr('x', center - width/2)
            .attr('y', xScale(q3))
            .attr('height', (xScale(q1)-xScale(q3)) )  
            .attr('width', width)
            .attr('stroke', 'black')
            .style('fill', 'blue')  
        }

