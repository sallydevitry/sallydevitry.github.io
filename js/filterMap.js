class FilterMap{



  constructor(svg){
    var path = d3.geoPath();
    var stateNames = null;
    //console.log("loading states")
    d3.csv("../data/stateNames.csv").then(function(nameData){
      stateNames = nameData;
      d3.json("../data/filterMap.json").then(function(us) {
        us.objects.states.geometries.forEach(function(d,i){
          d.abr = stateNames[parseInt(d.id)].code
          d.name = stateNames[parseInt(d.id)].name
        })
        /*us.objects.states.geometries.forEach(function(d,i){
          console.log(d.abr)
          console.log(d.name)
        })*/
        //console.log('here')
        svg.append("g")
        .attr("class", "states")
        .attr("transform", "scale(.5)")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("id", d => {return stateNames[parseInt(d.id)].code} )
        .attr("class", d => {return "states " + stateNames[parseInt(d.id)].region})
        .on("mouseover", d => { fMap.hoverRegion(stateNames[parseInt(d.id)].region)})
        .on("mouseout", d => { fMap.unhoverRegion(stateNames[parseInt(d.id)].region)})
        .on("click", d => { fMap.selectRegion(stateNames[parseInt(d.id)].region)})

      });
    })
  }

  hoverRegion(region){
    //console.log('in ' + region);
    d3.selectAll("." + region).style('fill', 'darkblue')
  }
  unhoverRegion(region){
    //console.log('out ' + region)
    d3.selectAll("." + region).style('fill', 'lightblue')
  }
  selectRegion(region){
    //console.log('sel ' + region)
    //TODO: give this the filter class so it can call it. Add it to the constroctor
    filterMapSchools(region);
  }
}
