function init() {
  // step 1:Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // step 2: Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// DELIVERABLE 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
      console.log(allSamples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray= allSamples.filter(sampleObj => sampleObj.id == sample);
      console.log(sampleArray); 
    //  5. Create a variable that holds the first sample in the array.
    firstSample = sampleArray[0];
      console.log(firstSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
      console.log(otu_ids);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    top10_otu_ids = otu_ids.slice(0, 10).map(otu_ids => "OTU" + otu_ids).reverse();
    top10_otu_labels = otu_labels.slice(0.10).map(otu_labels => "OTU" + otu_labels).reverse();
    top10_sample_values = sample_values.slice(0.10).map(sample_values => "OTU" + sample_values).reverse();

    var yticks = top10_otu_ids;
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: top10_sample_values,
      y: yticks,
      text: top10_otu_labels,
      marker: {color: 'blue'},
      type: "bar",
      orientation: "h"
    }];
    //var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
// DELIVERABLE 2
// Bar and Bubble charts
// Create the buildCharts function.

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: yticks,
      y: sample_values,
      text: top10_otu_labels,
      mode : "markers",
      marker: {
        color: 'top10_otu_ids', 
        size : "top10_sample_values" , 
        colorscale: "earth"
      }
    }];
    //var bubbleData = [trace];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { 
        title : "OTU " + sample},
      margins: false,
      hovermode: true
    };
    
    // DELIVERABLE 3
  // Create the buildChart function.
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = allSamples.filter(sampleObj => sampleObj.id == sample);
      console.log(metaArray); 
    // 2. Create a variable that holds the first sample in the metadata array.
    firstMeta = metaArray[0];
      console.log(firstMeta);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = firstMeta.wfreq;

    4// Create the yticks for the bar chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: "Belly Button Washing Frequency",
      type: "indicator",
      mode: "gauge+number",            
      gauge: {
      axis: { range: [0, 10] },            
      bar : { color: "black"},
        steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8, 10], color: "green" }
       ]
      }
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400, 
      height: 350,          
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);      
    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", barData, barLayout);
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);
     
  });
};
