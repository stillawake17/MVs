// Assuming your Excel data has been converted to a JSON file.
d3.json('./members.json').then(function(data) {
    // Your data is now loaded, this is akin to the pandas.read_excel part
  
    // Create nodes and links arrays for D3.js graph

    
    var nodes = [];
    var links = [];
  
    // Process the data to create nodes and links
    data.forEach(function(row) {
      var person = row['Name']; // Replace 'Name' with the actual key from your JSON data
  
      // Add the person as a node if not already added
      if (!nodes.some(n => n.id === person)) {
        nodes.push({ id: person });
      }
  
      // Add links and the associated nodes
      Object.keys(row).forEach(function(key) {
        if (key !== 'Name' && row[key]) { // Replace 'Name' with the key to skip
          var link = row[key];
          if (!nodes.some(n => n.id === link)) {
            nodes.push({ id: link });
          }
          links.push({ source: person, target: link });
        }
      });
    });
  
    function searchNodes() {
        var term = document.getElementById('search').value.toLowerCase();
        var infoPanel = document.getElementById('info-panel');
      
        // Reset styles if the search term is empty
        if (term === "") {
          node.style('opacity', 1);
          link.style('opacity', 1);
          labels.style('opacity', 1);
          infoPanel.style.display = 'none'; // Hide the panel
          return;
        }
      
        var searchedNodes = nodes.filter(n => n.id && typeof n.id === 'string' && n.id.toLowerCase().includes(term));
        var searchedLinks = links.filter(l => searchedNodes.includes(l.source) && searchedNodes.includes(l.target));
      
        // Dim all nodes and links
        node.style('opacity', 0.1);
        link.style('opacity', 0.1);
        labels.style('opacity', 0.1);
      
        // Highlight and display attributes of the searched nodes
        node.filter(function(d) { return searchedNodes.includes(d); }).style('opacity', 1);
        link.filter(function(d) { return searchedLinks.includes(d); }).style('opacity', 1);
        labels.filter(function(d) { return searchedNodes.includes(d); }).style('opacity', 1);
      
        // Update and show the information panel
        if (searchedNodes.length > 0) {
          var htmlContent = searchedNodes.map(function(n) {
            return `<strong>${n.id}</strong><br>` +
                   `Attribute 1: ${n.attribute1}<br>` +
                   `Attribute 2: ${n.attribute2}<br>`;
            // ... add more attributes as needed
          }).join('<hr>'); // Separator between multiple nodes
      
          infoPanel.innerHTML = htmlContent;
          infoPanel.style.display = 'block'; // Show the panel
        } else {
          infoPanel.style.display = 'none'; // Hide the panel if no nodes match
        }
      }
      
      
      // Attach the search function to the input field
      document.getElementById('search').addEventListener('input', searchNodes);
        
    // add width
    // var width = 960; // Set this to the desired width of your graphic
    var width = document.getElementById('content').clientWidth || 640; // The width of the #content div
    // or
    // var width = window.innerWidth; // The width of the browser window

    // defining height as appropriate
    // var height = 500; // Set this to the desired height of your graphic
    var height = document.getElementById('content').clientHeight ||540; // The height of the #content div
    // or
    // var height = window.innerHeight; // The height of the browser window

    var color = d3.scaleOrdinal(d3.schemeCategory10); // This is a predefined set of colors


    // Now you can use the nodes and links array to create a D3.js graph
    // Set up the simulation and add forces
    
    var simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));
  
    // Create SVG container for the visualization
var svg = d3.select('#content').append('svg') // Changed from 'body' to '#content'
.attr('width', width)
.attr('height', height)
.call(d3.zoom().on("zoom", function (event) { 
  container.attr("transform", event.transform); // Apply zoom to the container
}))
.append('g'); // This is where you append a 'g' element to the SVG

// Create a container for everything to be zoomed
var container = svg.append("g")
.attr("class", "everything");

// Create the links lines
var link = container.append('g')
.attr('class', 'links')
.selectAll('line')
.data(links)
.enter().append('line');



// Create the nodes circles
var node = container.append('g')
.attr('class', 'nodes')
.selectAll('circle')
.data(nodes)
.enter().append('circle')
.attr('r', 5)
.style('fill', function(d) { return color(d.group); });

var labels = container.append('g')
  .attr('class', 'labels')
  .selectAll('text')
  .data(nodes)
  .enter().append('text')
  .attr('dx', 12)
  .attr('dy', '.35em')
  .text(function(d) { return d.id; })
  .style('fill', 'aquamarine'); // You can choose a different color if you like


  
    // Create the links lines
    var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line');
  
    // Create the nodes circles
    var node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 5);
  
    // Add drag capabilities
    node.call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded));
  

   
    // Add tick instructions
    simulation.on('tick', function() {
        console.log('tick'); // Check if this is being called
      
        link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
  
      node
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

      labels
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; });
    });
  
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  

    
    // Add zoom capabilities
    var zoom_handler = d3.zoom()
      .on("zoom", function (event) { 
        svg.attr("transform", event.transform)
      });
  
    zoom_handler(svg);
  
  }).catch(function(error) {
    // Handle error
    console.log(error);
  });
  
  // Add this if you need to convert your Excel to JSON
  // This should be done beforehand, not in the client-side JavaScript
//   function convertExcelToJson() {
    // Code to convert Excel to JSON goes here
  