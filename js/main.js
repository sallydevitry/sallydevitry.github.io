function init() {
    var rankData = null
    console.log('here')
    d3.csv("./data/sallys_data.csv").then(function (rows){
        rankData = rows
        drawTable(rankData)
    })

    //call draw map
    //call draw table
    //call draw bubbleChart
}