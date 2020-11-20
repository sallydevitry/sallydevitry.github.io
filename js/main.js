function init() {
    var rankData = null
    d3.csv("./data/sallys_data.csv").then(function (rows){
        rankData = rows
        d3.csv("./data/degrees.csv").then((degreeData) => {
            drawTable(rankData)
            bubbleChart = new Bubble();
            bubbleChart.draw(degreeData);
            //call draw map
            fMap = new FilterMap(d3.select('#mapSVG'))
            //call draw table
        })
    })
}
