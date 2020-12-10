class FilterMap{



  constructor(svg){
    var path = d3.geoPath();
    var stateNames = null;
    d3.csv("../data/stateNames.csv").then(function(nameData){
      stateNames = nameData;
      d3.json("../data/filterMap.json").then(function(us) {
        us.objects.states.geometries.forEach(function(d,i){
          d.abr = stateNames[parseInt(d.id)].code
          d.name = stateNames[parseInt(d.id)].name
        })
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
    if(selectedRegions[region]){
      d3.selectAll("." + region).style('fill', 'lightskyblue')
    }else{
      d3.selectAll("." + region).style('fill', 'gray')
    }
  }
  unhoverRegion(region){
    if(selectedRegions[region]){
      d3.selectAll("." + region).style('fill', 'lightblue')
    }else{
      d3.selectAll("." + region).style('fill', 'lightgray')
    }
  }
  selectRegion(region){
    filterMapSchools(region);
  }
}
