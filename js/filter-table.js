// draws the table with the list of schools
function drawTable(rankData) {

    //formats number to currency
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });

    //make a row in the schools table for each data item
    rankData.forEach(function (d) {
        schoolName = d.Name
        schoolRank = d.Rank
        schoolTuition = formatter.format(d['Total Annual Cost'])
        schoolsTable = d3.select("#schools-table")
        tableRow = schoolsTable.append('tr')
        tableRow.attr('class', 't'+schoolTuition + " " + stripSpaces(d['School Type']) + " " + d.Region + " hasATd")
        tableRow.append('td').append('input').attr('type', 'checkbox').attr('id', `check${stripSpaces(schoolName)}`).on('click', () => showHideSchoolDetails(d))
        tableRow.append('td').append('text').text(schoolName)
        tableRow.append('td').append('text').text(schoolRank)
        tableRow.append('td').append('text').attr('class', 'school-tuition').text(schoolTuition)
    })
}
// formats school names to play nicely
function stripSpaces(schoolName) {
    return schoolName.split(" ").join("")
}

//called when a school checkbox is clicked, removes or shows the school details row
function showHideSchoolDetails(data) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      });

    var schoolToRemoveExists = document.getElementById(`tr${stripSpaces(data.Name)}`)
    if (schoolToRemoveExists) {
        //remove the school details row
        d3.select(`#tr${stripSpaces(data.Name)}`).remove()
    }
    else {
        //add the school details row
        schoolDeetsTable = d3.select('#school-deets-table')
        schoolRow = schoolDeetsTable.append('tr').attr('id',`tr${stripSpaces(data.Name)}`)
        textAndPic = schoolRow.append('td')

        //add the text details and picture to a cell
        textAndPic.append('a').style('font-weight', 'bold').style('font-size', '20px').attr('target', '_blank').attr('href', 'https://' + data.Website).text(data.Name)
        textAndPic.append('br')
        textAndPic.append('text').text('Location: ').style('font-size', '14px')
        textAndPic.append('a').attr('target', '_blank').attr('href', data['aboutLocation']).text(data['City'] + ", " + data['State']).style('font-size', '14px')
        textAndPic.append('br')
        textAndPic.append('text').text("Student Population: ").style('font-size', '14px')
        textAndPic.append('text').text(data['Student Population']).style('font-size', '14px')
        textAndPic.append('br')
        textAndPic.append('text').text("Average ACT score: ").style('font-size', '14px')
        textAndPic.append('text').text(data['ACT Lower'] + "-" + data['ACT Upper']).style('font-size', '14px')
        textAndPic.append('br')
        textAndPic.append('text').text("Acceptance rate: ").style('font-size', '14px')
        textAndPic.append('text').text(data['Acceptance Rate'] + '%').style('font-size', '14px')
        textAndPic.append('br')
        textAndPic.append('text').text("Avg. grant aid: ").style('font-size', '14px')
        textAndPic.append('text').text(formatter.format(data['Average Grant Aid'])).style('font-size', '14px')
        textAndPic.append('br')

        imgTd = schoolRow.append('td')
        imgTd.append('a').attr('target', '_blank').attr('href', 'https://' + data.Website).append('img').attr('src', `../img/${stripSpaces(data.Name)}.jpg`).attr('class', 'school-imgs')

        //add the box plot to a cell
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
            .domain([35000, 330000])
            .range([0, width - 30])

        var x_axis = d3.axisBottom(xScale)
        axisG = svg.append('g').attr('transform', 'translate(10, 130)')
        axisG.call(x_axis)

        //actual box plot
        boxG = svg.append('g').attr('transform', 'translate(10, 5)')

        //min and max lil lines
        if (!Number.isNaN(min)) {
        boxG.append('line')
            .attr('x1', xScale(min + 10))
            .attr('x2', xScale(min + 10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)
        }

        if (!Number.isNaN(max)) {
        boxG.append('line')
            .attr('x1', xScale(max + 10))
            .attr('x2', xScale(max + 10))
            .attr('y1', lilLineStart)
            .attr('y2', lilLineEnd)
        }

        if (!Number.isNaN(max) && !Number.isNaN(min)) {
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
        }

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

        deleteButton = schoolRow.append('td').append('button').attr('class', 'my-btn').on('click', () => removeSchool(data.Name)).append('i').attr('class', 'fa fa-close')
    }
}

//remove school function called when 'x' delete row button is pressed
function removeSchool(name) {
    var schoolToRemoveExists = document.getElementById(`tr${stripSpaces(name)}`)

    if (schoolToRemoveExists) {
        d3.select(`#tr${stripSpaces(name)}`).remove()
        checkboxToUncheck = d3.select(`#check${stripSpaces(name)}`)
        checkboxToUncheck.property('checked', false)
    }
}

//called when searching
function filterSchools() {
    performFilter()
    var input, filter, tr, school, i, txtValue;
    input = document.getElementById('searchbox-filter');
    filter = input.value.toUpperCase();
    tr = document.querySelectorAll('tr.hasATd')

    for (i = 0; i < tr.length; i++) {
        school = tr[i]
        txtValue = school.textContent || school.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1 && school.style['display'] == '') {
            tr[i].style.display = ''
        } else {
            tr[i].style.display = 'none';
        }
    }
    if (filter == ''){
      performFilter();
    }
}

//called when selections change in the filtering
function performFilter() {
    putAllBackInTable()
    var typeOfSchool = stripSpaces(document.getElementById('type-select').value);
    var tuitionMax = document.getElementById('tuition-select').value;

    trSel = document.querySelectorAll('tr.hasATd');
    if (typeOfSchool != 'Any') {
        specSel = document.querySelectorAll("tr."+typeOfSchool)
    }
    else {
        specSel = trSel
    }
    //hide all rows
    for (i=0; i<trSel.length; i++) {
        trSel[i].style.display = 'none';
    }
    //reshow the ones that meet the criteria
    for (i = 0; i < specSel.length; i++) {
        currTr = specSel[i];
        tuitionMaxStripped = tuitionMax.replace(/</g, '').replace('$', '').replace('+', '').replace(',', '');
        tuitionCell = currTr.querySelector('td > .school-tuition')
        classOfCurr = tuitionCell.innerText.replace('t', '').replace('$', '').replace('+', '').replace(',', '');
        tuitionNum = parseInt(classOfCurr);
        if (tuitionNum > parseInt(tuitionMaxStripped)){
                currTr.style.display = 'none';
            }
        else {
            currTr.style.display = '';
        }
    }
    mapFilter();
}

// does this need explaining?
// Use this to put every school back in the table
function putAllBackInTable() {
    schoolsTable = document.getElementById('schools-table');
    tr = schoolsTable.getElementsByTagName("tr")
    for (i = 0; i < tr.length; i++) {
        currTr = tr[i];
        currTr.style.display = ''
    }
}

// keeps track of which regions are shown or not
let selectedRegions = {Southern:true, Northeastern:true, Midwestern:true, Western:true, California:true};
let selRegions = Object.keys(selectedRegions);
// filters the schools based on selected regions, then calls the main filter function
function filterMapSchools(region){
  performFilter();
  if(selectedRegions[region]){
    selectedRegions[region] = false;
  }
  else{
    selectedRegions[region] = true;
  }
  performFilter();
}
// toggles the selected region in selectedRegions
function mapFilter(){
  for(let i =0; i < 5; i++){
    region = selRegions[i]
    sel = d3.select('#schools-table').selectAll('tr.'+region)
    if(!selectedRegions[region]){
      sel.style('display', 'none')
    }
    if(selectedRegions[region]){
      d3.selectAll("." + region).style('fill', 'lightblue')

    }else{
      d3.selectAll("." + region).style('fill', 'lightgray')
    }
  }
}
