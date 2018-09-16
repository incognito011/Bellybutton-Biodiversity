function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Get route url  
    const defaultURL = "/metadata/";
    url = defaultURL + sample;
    
  
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var select_meta = d3.select("#sample-metadata").html("");
    
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(response) {

   
    var data = [response];
   
        data.forEach((meta) => {
          // Use `Object.entries` to add each key and value pair to the panel
          Object.entries(meta).forEach(([key, value]) => {
          
           // Hint: Inside the loop, you will need to use d3 to append new
           // tags for each key-value in the metadata.
           
           var sample_key = select_meta.append("p");
           sample_key.text(key);
          
           var sample_value = select_meta.append("p");
           sample_value.text(value);
         
           });
        });
    });
    
 }
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // Get route url
   
    const defaultURL = "/samples/";
    url = defaultURL + sample;
    
   // Use d3 to select the panels with ids of `#pie and #bubble`
   // Use `.html("") to clear any existing data 
   var select_pie = d3.select("#pie").html("");
   var select_bubble = d3.select("#bubble").html("");
   
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(response){
            
        
            var data = [response];
           
            // Build Pie Chart
            var pieData = [{
                 values: data[0]["sample_values"].slice(0, 10),
                 labels: data[0]["otu_ids"].slice(0, 10),
                 hovertext: data[0]["otu_labels"].slice(0, 10),
                 hoverinfo: 'hovertext',
                 type: 'pie'
             }];
           
            var pieLayout = {
                margin:  {
                          l: 50,
                          r: 50,
                          b: 100,
                          t: 100,
                          pad: 4 }
                        };
            
            Plotly.newPlot(pie, pieData, pieLayout);
            
            // Build Bubble Chart
            var bubbleLayout = {
            margin: {
                          l: 50,
                          r: 50,
                          b: 200,
                          t: 50,
                          pad: 4 },
            
            yaxis: {range: [0, 600]},
            xaxis: { title: "OTU ID" }
            };
            
            var bubbleData = [{
               x: data[0]["otu_ids"],
               y: data[0]["sample_values"],
               text: data[0]["otu_labels"],
               mode: "markers",
               marker: {
                    size: data[0]["sample_values"],
                    color: data[0]["otu_ids"],
                    
                   }
             }];
    
             Plotly.newPlot(bubble, bubbleData, bubbleLayout);
             
            });
 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();