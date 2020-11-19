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
    textDeetsDiv.append('text').style('font-weight', 'bold').text(data.Name)
    textDeetsDiv.append('br')
    textDeetsDiv.append('text').text("Student Population: ")
    textDeetsDiv.append('text').text(data['Student Population'])
    textDeetsDiv.append('br')
    textDeetsDiv.append('text').text("Average ACT score range: ")
    textDeetsDiv.append('text').text(data['ACT Lower'] + "-" + data['ACT Upper'])
    textDeetsDiv.append('br')
    textDeetsDiv.append('br')

    chartDiv = currDiv.append('div').attr('class', 'boxPlot')
    // if ( $('.boxPlot').children().length == 0 ) {
    //     console.log('yep')
    //     textG = chartDiv.append('g').attr('transform', 'translate(100, 0)')
    //     textG.append('text').text('Salaries of Students upon Exit')
    // }

    var q1 = parseFloat(data['Mid-Career 25th Percentile Salary'].replace(/\$|,/g, ''))
    var median = parseFloat(data['Mid-Career Median Salary'].replace(/\$|,/g, ''))
    var q3 = parseFloat(data['Mid-Career 75th Percentile Salary'].replace(/\$|,/g, ''))
    var max = parseFloat(data['Mid-Career 90th Percentile Salary'].replace(/\$|,/g, ''))
    var min = parseFloat(data['Mid-Career 10th Percentile Salary'].replace(/\$|,/g, ''))


    //box plot
    width = 600
    height = 150
    boxWidth = 65
    lilLineStart = 20
    lilLineEnd = 50

        // Create the axis
        var svg = chartDiv.append('svg')
            .attr('width', width)
            .attr('height', height);

        //x scale
        var xScale = d3.scaleLinear()
            .domain([45000, 330000])
            .range([0, width-30])

        var x_axis = d3.axisBottom(xScale)
        axisG = svg.append('g').attr('transform', 'translate(10, 100)')
        axisG.call(x_axis)

        //actual box plot
        boxG = svg.append('g').attr('transform', 'translate(10, 5)')
        
        //min and max lil lines
        boxG.append('line')
            .attr('x1', xScale(min+10))
            .attr('x2', xScale(min+10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)
        
        boxG.append('line')
            .attr('x1', xScale(max+10))
            .attr('x2', xScale(max+10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)

        //connecting lines
        boxG.append('line')
            .attr('x1', xScale(min+10))
            .attr('x2', xScale(q1 +10))
            .attr('y1', (lilLineEnd+lilLineStart)/2)
            .attr('y2', (lilLineEnd+lilLineStart)/2)

        boxG.append('line')
            .attr('x1', xScale(max+10))
            .attr('x2', xScale(q3 +10))
            .attr('y1', (lilLineEnd+lilLineStart)/2)
            .attr('y2', (lilLineEnd+lilLineStart)/2)

        //median line
        boxG.append('line')
            .attr('x1', xScale(median+10))
            .attr('x2', xScale(median+10))
            .attr('y1', 15)
            .attr('y2', boxWidth)

        //the main box
        boxG.append('path')
            .attr('d', `M ${xScale(q1+10)} 15 L ${xScale(q1+10)} ${boxWidth} L ${xScale(q3+10)} ${boxWidth} L ${xScale(q3+10)} 15 L ${xScale(q1+10)} 15 `)
            .attr("stroke-width", 2)
            .attr("stroke", "#064789")
            .style('fill', 'none')

        }
