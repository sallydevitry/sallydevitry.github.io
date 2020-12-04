function drawTable(rankData) {
    rankData.forEach(function (d) {
        schoolName = d.Name
        schoolRank = d.Rank
        schoolTuition = d['Total Annual Cost']
        schoolsTable = d3.select("#schools-table")
        tableRow = schoolsTable.append('tr')
        tableRow.append('td').append('input').attr('type', 'checkbox').attr('id', `check${stripSpaces(schoolName)}`).on('click', () => showHideSchoolDetails(d))
        tableRow.append('td').append('text').text(schoolName)
        tableRow.append('td').append('text').text(schoolRank)
        tableRow.append('td').append('text').text(schoolTuition)
    })
}
function stripSpaces(schoolName) {
    return schoolName.split(" ").join("")
}

function showHideSchoolDetails(data) {

    detailPanel = d3.select('#school-details')

    idSchoolToRemove = `#div${stripSpaces(data.Name)}`
    console.log(idSchoolToRemove)
    var schoolToRemoveExists = document.getElementById(`div${stripSpaces(data.Name)}`)
    console.log(schoolToRemoveExists)

    if (schoolToRemoveExists) {
        d3.select(`#div${stripSpaces(data.Name)}`).remove()
    }
    else {
        currDiv = detailPanel.append('div').attr('class', 'flexRow').attr('id', `div${stripSpaces(data.Name)}`)

        

        textDeetsDiv = currDiv.append('div').style('margin-left', '10px')
        textDeetsDiv.append('a').style('font-weight', 'bold').style('font-size', '20px').attr('href', data.Website).text(data.Name)
        textDeetsDiv.append('br')
        textDeetsDiv.append('text').text('Location: ')
        textDeetsDiv.append('text').text(data['City'] + ", " + data['State'])
        textDeetsDiv.append('br')
        textDeetsDiv.append('text').text("Student Population: ")
        textDeetsDiv.append('text').text(data['Student Population'])
        textDeetsDiv.append('br')
        textDeetsDiv.append('text').text("Average ACT score: ")
        textDeetsDiv.append('text').text(data['ACT Lower'] + "-" + data['ACT Upper'])
        textDeetsDiv.append('br')
        textDeetsDiv.append('text').text("Acceptance rate: ")
        textDeetsDiv.append('text').text(data['Acceptance Rate'] + '%')
        textDeetsDiv.append('br')
        textDeetsDiv.append('text').text("Net Cost: ")
        textDeetsDiv.append('text').text('$' + data['Net Price'])
        textDeetsDiv.append('br')

        imgDiv = currDiv.append('div')
        imgDiv.append('img').attr('src', `../img/${stripSpaces(data.Name)}.jpg`).attr('class', 'school-imgs')

        chartDiv = currDiv.append('div').attr('class', 'boxPlot')

        var q1 = parseFloat(data['Mid-Career 25th Percentile Salary'].replace(/\$|,/g, ''))
        var median = parseFloat(data['Mid-Career Median Salary'].replace(/\$|,/g, ''))
        var q3 = parseFloat(data['Mid-Career 75th Percentile Salary'].replace(/\$|,/g, ''))
        var max = parseFloat(data['Mid-Career 90th Percentile Salary'].replace(/\$|,/g, ''))
        var min = parseFloat(data['Mid-Career 10th Percentile Salary'].replace(/\$|,/g, ''))


        //box plot
        width = 600
        height = 200
        boxWidth = 100
        lilLineStart = 28
        lilLineEnd = 84

        // Create the axis
        var svg = chartDiv.append('svg')
            .attr('width', width)
            .attr('height', height);

        //x scale
        var xScale = d3.scaleLinear()
            .domain([45000, 330000])
            .range([0, width - 30])

        var x_axis = d3.axisBottom(xScale)
        axisG = svg.append('g').attr('transform', 'translate(10, 130)')
        axisG.call(x_axis)

        //actual box plot
        boxG = svg.append('g').attr('transform', 'translate(10, 5)')

        //min and max lil lines
        boxG.append('line')
            .attr('x1', xScale(min + 10))
            .attr('x2', xScale(min + 10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)

        boxG.append('line')
            .attr('x1', xScale(max + 10))
            .attr('x2', xScale(max + 10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)

        //connecting lines
        boxG.append('line')
            .attr('x1', xScale(min + 10))
            .attr('x2', xScale(q1 + 10))
            .attr('y1', (lilLineEnd + lilLineStart) / 2)
            .attr('y2', (lilLineEnd + lilLineStart) / 2)

        boxG.append('line')
            .attr('x1', xScale(max + 10))
            .attr('x2', xScale(q3 + 10))
            .attr('y1', (lilLineEnd + lilLineStart) / 2)
            .attr('y2', (lilLineEnd + lilLineStart) / 2)

        //median line
        boxG.append('line')
            .attr('x1', xScale(median + 10))
            .attr('x2', xScale(median + 10))
            .attr('y1', 15)
            .attr('y2', boxWidth)

        //the main box
        boxG.append('path')
            .attr('d', `M ${xScale(q1 + 10)} 15 L ${xScale(q1 + 10)} ${boxWidth} L ${xScale(q3 + 10)} ${boxWidth} L ${xScale(q3 + 10)} 15 L ${xScale(q1 + 10)} 15 `)
            .attr("stroke-width", 2)
            .attr("stroke", "#064789")
            .style('fill', 'none')

    }
}

function filterSchools() {
    var input, filter, tr, school, i, txtValue;
    input = document.getElementById('searchbox-filter');
    filter = input.value.toUpperCase();
    schoolsTable = document.getElementById("schools-table");
    tr = schoolsTable.getElementsByTagName("tr")

    for (i = 0; i < tr.length; i++) {
        school = tr[i]
        txtValue = school.textContent || school.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = ''
        } else {
            tr[i].style.display = 'none';
        }
    }
}
