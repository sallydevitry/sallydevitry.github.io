function drawTable(rankData) {
    rankData.forEach(function (d) {
        schoolName = d.Name
        schoolRank = d.Rank
        schoolTuition = d['Total Annual Cost']
        schoolsTable = d3.select("#schools-table")
        tableRow = schoolsTable.append('tr')
        tableRow.attr('class', 't'+schoolTuition + " " + d['School Type'] + " " + d.Region)
        tableRow.append('td').append('input').attr('type', 'checkbox').attr('id', `check${stripSpaces(schoolName)}`).on('click', () => showHideSchoolDetails(d))
        tableRow.append('td').append('text').text(schoolName)
        tableRow.append('td').append('text').text(schoolRank)
        tableRow.append('td').append('text').attr('class', 'school-tuition').text(schoolTuition)
    })
}
function stripSpaces(schoolName) {
    return schoolName.split(" ").join("")
}

function showHideSchoolDetails(data) {

    var schoolToRemoveExists = document.getElementById(`tr${stripSpaces(data.Name)}`)
    console.log(schoolToRemoveExists)

    if (schoolToRemoveExists) {
        d3.select(`#tr${stripSpaces(data.Name)}`).remove()
    }
    else {

        schoolDeetsTable = d3.select('#school-deets-table')
        schoolRow = schoolDeetsTable.append('tr').attr('id',`tr${stripSpaces(data.Name)}`)
        textAndPic = schoolRow.append('td')

        textAndPic.append('a').style('font-weight', 'bold').style('font-size', '20px').attr('target', '_blank').attr('href', 'https://' + data.Website).text(data.Name)
        textAndPic.append('br')
        textAndPic.append('text').text('Location: ')
        textAndPic.append('text').text(data['City'] + ", " + data['State'])
        textAndPic.append('br')
        textAndPic.append('text').text("Student Population: ")
        textAndPic.append('text').text(data['Student Population'])
        textAndPic.append('br')
        textAndPic.append('text').text("Average ACT score: ")
        textAndPic.append('text').text(data['ACT Lower'] + "-" + data['ACT Upper'])
        textAndPic.append('br')
        textAndPic.append('text').text("Acceptance rate: ")
        textAndPic.append('text').text(data['Acceptance Rate'] + '%')
        textAndPic.append('br')
        textAndPic.append('text').text("Net Cost: ")
        textAndPic.append('text').text('$' + data['Net Price'])
        textAndPic.append('br')

        imgTd = schoolRow.append('td')
        imgTd.append('a').attr('target', '_blank').attr('href', 'https://' + data.Website)
        imgTd.append('img').attr('src', `../img/${stripSpaces(data.Name)}.jpg`).attr('class', 'school-imgs')

        chartTr = schoolRow.append('td').attr('class', 'boxPlot')

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
        var svg = chartTr.append('svg')
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

function filterByType() {
    var typeOfSchool = document.getElementById('type-select').value;
    console.log(typeOfSchool)
    schoolsTable = document.getElementById("schools-table");
    schoolsToShow = document.getElementsByClassName(typeOfSchool)
    console.log(schoolsToShow)
    tr = schoolsTable.getElementsByTagName("tr")
    for (var i = 0; i < tr.length; i++) {
        tr[i].style.display = 'none';
    }
    for (var j = 0; j < schoolsToShow.length; j++) {
        schoolsToShow[j].style.display = '';
    }
}

function filterByTuition() {
    putAllBackInTable()
    var tuitionMax = document.getElementById('tuition-select').value;
    console.log(tuitionMax)
    schoolsTable = document.getElementById('schools-table');
    trs = schoolsTable.getElementsByTagName("tr")

    for (i = 0; i < trs.length; i++) {
        currTr = trs[i];
        if (tuitionMax === 'Any') {
            currTr.style.display = ''
        }
        else {
            tuitionMaxStripped = tuitionMax.replace(/</g, '').replace('$', '').replace('+', '').replace(',', '');
            tuitionCell = currTr.querySelector('td > .school-tuition')
            classOfCurr = tuitionCell.innerText.replace('t', '');
            tuitionNum = parseInt(classOfCurr);

            if (tuitionMax.includes('+')) {
                if (tuitionNum < parseInt(tuitionMaxStripped)) {
                    currTr.style.display = 'none';
                }
            }
            else {
                if (tuitionNum > parseInt(tuitionMaxStripped)) {
                    currTr.style.display = 'none';
                }
            }
        }
    }
}

function putAllBackInTable() {
    schoolsTable = document.getElementById('schools-table');
    tr = schoolsTable.getElementsByTagName("tr")
    for (i = 0; i < tr.length; i++) {
        currTr = tr[i];
        currTr.style.display = ''
    }
}

let selectedRegions = {Southern:true, Northeastern:true, Midwestern:true, Western:true, California:true};
function filterMapSchools(region){
  sel = d3.select('#schools-table').selectAll('tr.'+region)
  if(selectedRegions[region]){
    sel.style('display', 'none')
    selectedRegions[region] = false;
  }
  else{
    sel.style('display', '')
    selectedRegions[region] = true;
  }
  if(selectedRegions[region]){
    d3.selectAll("." + region).style('fill', 'lightskyblue')

  }else{
    d3.selectAll("." + region).style('fill', 'darksalmon')
  }
}
