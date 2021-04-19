var samplesJson = "samples.json"

var idSelect = d3.select("#selDataset");
var demoTable = d3.select("sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

function init() {
d3.json("samples.json").then(function(data) {
    console.log(data);
    data.names.forEach(name => {
        var option = idSelect.append("option");
        option.text(name);
        });
    var initID = idSelect.property("value")
    plotCharts(initID);
});
}

function plotCharts(id) {
    
    //resetHtml();

    d3.json("samples.json").then(data => {
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];

        Object.entries(individualMetadata).forEach(([key, value]) => {
            var demoList = demoTable.append("ul")
                .attr("class","list-group");
            var listItem = demoList.append("li")
                .attr("style", "list-style-type: none");
            listItem.text('${key}; ${value}');
        });
        
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        var sampleValues = []
            sampleValues.push(individualSample.sample_values);
            var top10otuSamples = sampleValues[0].slice(0,10).reverse();
        var otuIDs = []
            otuIDs.push(individualSample.otu_ids);
            var top10otuIDs = otuIDs[0].slice(0,10).reverse();
        var otuLabels = []
            otuLabels.push(individualSample.otu_labels);
            var top10otuLabels = otuLabels[0].slice(0,10).reverse();

    console.log(sampleValues);
    console.log(otuIDs);
    console.log(otuLabels)
    var data1 = [
        {
        x: top10otuIDs,
        y: top10otuSamples,
        text: top10otuLabels,
        type: 'bar',
        orientation: 'h'
        }
        ];
              
        Plotly.newPlot('bar', data1);
    });
};

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    var data = [];

    if (dataset == 'listItem') {
        data = listItem;
    }

    // Call function to update the chart
    updatePlotly(data);
}
function updatePlotly(newdata) {
    Plotly.restyle('bar', "values", [newdata]);
  }

init();
