var samplesJson = "samples.json"
var idSelect = d3.select("#selDataset");
var demoTable = d3.select("#sample-metadata");
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

function init() {
d3.json("samples.json").then(data => {
    populateDropdown(data.names);
    var initID = idSelect.property("value");
    buildMetadata(initID);
    plotCharts(initID);
    });
};

function buildMetadata(id){
    resetHtml();
    d3.json("samples.json").then(data => {
        var individualMetadata = data.metadata.filter(participant => participant.id == id)[0];
        console.log(individualMetadata);
        Object.entries(individualMetadata).forEach(([key, value]) => {
            var demoList = demoTable.append("ul")
                .attr("class","list-group");
            var listItem = demoList.append("li")
                .attr("style", "list-style-type: none");
            listItem.text(`${key}; ${value}`);
        });
})};

function plotCharts(id) {
    d3.json("samples.json").then(data => {
        var individualSample = data.samples.filter(sample => sample.id === id)[0];
        var sampleValues = individualSample.sample_values;
        var top10otuSamples = sampleValues.slice(0,10).reverse();
        var otuIDs = individualSample.otu_ids
        var top10otuIDs = otuIDs.slice(0,10).reverse();
        var otuLabels = individualSample.otu_labels
        var top10otuLabels = otuLabels.slice(0,10).reverse();
        var trace = {
            x: top10otuIDs,
            y: top10otuSamples.map(otu => `OTU ${otu}`),
            text: top10otuLabels,
            type: 'bar',
            orientation: 'h'
        };
        var data = [trace];
        Plotly.newPlot('bar', data);
        var trace2 = {
            x: top10otuIDs,
            y: top10otuSamples,
            text: top10otuLabels,
            mode: 'markers',
            marker: {
                size: top10otuSamples,
                color: top10otuIDs
            }
        };
        var data2 = [trace2];
        Plotly.newPlot('bubble', data2);
       });
    }

function populateDropdown(names) {
    idSelect.selectAll('option')
        .data(names)
        .enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
   };
   
// function buildMetadata(id) {
//     var metadata_panel = d3.select("#sample-metadata");
//     metadata_panel.html("");
//     Object.entries(metadata).forEach(([key, value]) => {
//         metadata_panel.append("p").text(`${key}; ${value}`);
//     });
// }
// function updatePlotly(newdata) {
//     Plotly.restyle('bar', "values", [newdata]);
//     var drawChart = function(x_data, y_data, hoverText, metadata) {
//         var metadata_panel = d3.select("#sample-metadata");
//         metadata_panel.html("");
//         Object.entries(metadata).forEach(([key, value]) => {
//             metadata_panel.append("p").text(`${key}; ${value}`);
//         });
//         var trace = {
//             x: x_data.slice(0,10).reverse(),
//             y: y_data.map(otu => `OTU ${otu}`).slice(0,10).reverse(),
//             text: hoverText.slice(0,10).reverse(),
//             type: 'bar',
//             orientation: 'h'
//         };
//         var data = [trace];
//         Plotly.newPlot('bar', data);
//         var trace2 = {
//             x: x_data,
//             y: y_data,
//             text: hoverText,
//             mode: 'markers',
//             marker: {
//                 size: y_data,
//                 color: x_data
//             }
//         };
//         var data2 = [trace2];
//         Plotly.newPlot('bubble', data2);
//        };
//        d3.json("samples.json").then(function(data) {
//         //Populate dropdown with names
//         populateDropdown(data["names"]);
//         //Populate the page with the first value
//         var x_data = data["samples"][0]["otu_ids"];
//         var y_data = data["samples"][0]["sample_values"];
//         var hoverText = data["samples"][0]["otu_labels"];
//         var metadata = data["metadata"][0];
//         //Draw the chart on load
//         drawChart(x_data, y_data, hoverText, metadata);
//        });
// }
// var optionChange = function(newValue) {
//     console.log(newValue);
//     d3.json("samples.json").then(function(data) {
//     sample_new = data["samples"].filter(function(sample) {
//         return sample.id == newValue;
//     });
//     metadata_new = data["metadata"].filter(function(metadata) {
//         return metadata.id == newValue;
//     });
//     var x_data = sample_new[0]["otu_ids"];
//     var y_data = sample_new[0]["sample_values"];
//     var hoverText = sample_new[0]["otu_labels"];
//     console.log(x_data);
//     console.log(y_data);
//     console.log(hoverText);
//     drawChart(x_data, y_data, hoverText, metadata_new[0]);
//      });
//    };
function resetHtml(){
    demoTable.html("");
    barChart.html("");
    bubbleChart.html("");
}
d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged(id) {
    buildMetadata(id);
    plotCharts(id);
}
init();
