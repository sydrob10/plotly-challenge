// function to build plots
function buildPlots(sample) {

  // read json data and set values
  d3.json("samples.json").then((data) => {
    let samples = data.samples
    let result = samples.filter(d => d.id == sample)

    let sample_values = result[0].sample_values;
    let otu_ids = result[0].otu_ids;
    let otu_labels = result[0].otu_labels;

    // create bar chart
    let trace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).reverse().map((id) => "OTU " + id),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: 'red'
      },
    };

    let chartdata = [trace];

    let layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Value" },
        yaxis: { title: "OTU ID" }
      };

    Plotly.newPlot("bar", chartdata, layout);

    // create bubble chart
    let bubtrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Inferno"
      }
    }

    let bubdata = [bubtrace]

    let bublayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {t:0},
      xaxis: {title: "OTU ID"},
      margin: {t:30},
      hovermode: "closest",
      yaxis: {title: "Sample Value"},
      margin: {t:30}
    }
    
    Plotly.newPlot("bubble", bubdata, bublayout)
  });
}

// function to show metadata
function buildMetadata(sample) {

  // read json and set values
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;

    // filter the data for sample number
    let result = metadata.filter(d => d.id == sample)[0];

    // select #sample-metadata id
    let div = d3.select("#sample-metadata");

    // clear existing data
    div.html("");

    // add each key and value pair to the div
    Object.entries(result).forEach(([key, value]) => {
      div.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to initialize the page
function init() {

  // refer to dropdown select element
  let selection = d3.select("#selDataset");

  // add all select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selection
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // use first sample to build initial plots
    let firstSample = sampleNames[0];
    buildPlots(firstSample);
    buildMetadata(firstSample);
  });
}

// function for option changes
function optionChanged(newSample) {

  // grab new data each time a new id is clicked
  buildPlots(newSample);
  buildMetadata(newSample);
}

// run init function to initialize the page
init();
