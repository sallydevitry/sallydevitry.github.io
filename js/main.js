// The filter map stored for easy debugging
var fMap;
// the rank data stored for easy debugging
var rData;

// loads data, then draws charts, graphs, tables, and filter options
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
