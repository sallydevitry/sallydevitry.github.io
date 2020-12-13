var fMap;
var rData;
function init() {
    var rankData = null
    //load the data from csvs
    d3.csv("./data/sallys_data.csv").then(function (rows) {
        rankData = rows
        rData = rankData;
        d3.csv("./data/degrees.csv").then((degreeData) => {
            //call all necessary functions
            drawTable(rankData)
            bubbleChart = new Bubble();
            bubbleChart.draw(degreeData);
            fMap = new FilterMap(d3.select('#mapSVG'))
        })
    })
}
