function init() {
    var rankData = null
    console.log('here')
    d3.csv("./data/sallys_data.csv").then(function (rows){
        rankData = rows
        d3.csv("./data/degrees.csv").then((degreeData) => {
            drawTable(rankData)
            bubbleChart = new Bubble();
            bubbleChart.draw(degreeData);
            //call draw map
            //call draw table
        })
    })
}