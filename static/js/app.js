// Create a function to build and generate plots
// ----------------------------------------------
function buildPlots(subject) {
    d3.json("data/samples.json").then((data) => {

// Grab values from the data samples.json object to build the plots
// ----------------------------------------------
        var metadata = data.metadata.filter(m => m.id.toString() === subject)[0];
        console.log(metadata);
        var wfreq = metadata.wfreq;
        console.log(wfreq);
        var samples = data.samples.filter(s => s.id.toString() === subject)[0];
        console.log(samples);
        var sampleData = samples.sample_values.slice(0, 10).reverse();
        console.log(sampleData);
        var otuData = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(otuData);
        var otuID = otuData.map(d => `OTU ${d}`);
        console.log(otuID);
        var labels = samples.otu_labels.slice(0, 10);
        console.log(labels);

// Create Bar Chart
// ----------------------------------------------
        var traceBarChart = {
            x: sampleData,
            y: otuID,
            text: labels,
            marker: {
                color: "rgb(25, 120, 181)"
            },
            type: "bar",
            orientation: "h",
        };

        console.log(traceBarChart);

        var dataBarChart = [traceBarChart];
        console.log(dataBarChart);

        var layoutBarChart = {
            title: "<b>Top 10 OTU Per Subject</b>",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 80,
                r: 50,
                t: 80,
                b: 25
            }
        };

        Plotly.newPlot("bar", dataBarChart, layoutBarChart);

// Create Bubble Chart
// ----------------------------------------------
        var traceBubbleChart = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: 'Earth'
            },
            text: samples.otu_labels
        };

        console.log(traceBubbleChart);

        var layoutBubbleChart = {
            xaxis: {
                title: "OTU ID"
            },
            height: 800,
            width: 1250
        };

        var dataBubbleChart = [traceBubbleChart];

        Plotly.newPlot("bubble", dataBubbleChart, layoutBubbleChart);

// Create Gauge Chart
// ----------------------------------------------
        var traceGaugeChart = [{
            domain: {
                x: [0, 1],
                y: [0, 1]
            },
            value: parseInt(wfreq),
            title: {
                text: `<b>Belly Button Washing Frequency</b> <br>Scrubs per Week`,
                font: {size: 20}
            },
            type: "indicator",

            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 9]
                },
                bar: {color: "rgb(25, 120, 181)"
                },
                steps: [
                    {range: [0, 1], color: "rgb(247, 242, 236)"},
                    {range: [1, 2], color: "rgb(243, 240, 229)"},
                    {range: [2, 3], color: "rgb(233, 231, 201)"},
                    {range: [3, 4], color: "rgb(229, 233, 176)"},
                    {range: [4, 5], color: "rgb(213, 229, 149)"},
                    {range: [5, 6], color: "rgb(183, 205, 139)"},
                    {range: [6, 7], color: "rgb(135, 192, 128)"},
                    {range: [7, 8], color: "rgb(133, 188, 139)"},
                    {range: [8, 9], color: "rgb(128, 181, 134)"},
                ]
            }
        }];

        console.log(traceGaugeChart);

        var layoutGaugeChart = {
            width: 600,
            height: 500,
            margin: {
                t: 20,
                b: 20,
                l: 50,
                r: 50
            },
            paper_bgcolor: "white",
            font: {color: "black", size: 20}
        };

        Plotly.newPlot("gauge", traceGaugeChart, layoutGaugeChart);
    });
}

// Create a function to get the demographic info
// ----------------------------------------------
function getDemographicInfo(subject) {
    d3.json("data/samples.json").then((data) => {

        console.log(subject);

        var metadata = data.metadata;
        console.log(metadata);
        var demographicData = metadata.filter(m => m.id.toString() === subject)[0];
        console.log(demographicData);
        var metadataField = d3.select("#sample-metadata");
        console.log(metadataField);

        metadataField.html("");

        Object.entries(demographicData).forEach((key) => {
            metadataField.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// Create a function to update plots on change
// ----------------------------------------------
function optionChanged(subject) {
    buildPlots(subject);
    getDemographicInfo(subject);
}

// Create a function to initialize the page data
// ----------------------------------------------
function init() {
    d3.json("data/samples.json").then((data) => {

        var dropdownMenu = d3.select("#selDataset");

        data.names.forEach(function (name) {
            dropdownMenu.append("option").text(name).property("value");
        });

        buildPlots(data.names[0]);
        getDemographicInfo(data.names[0]);
    });
}
init();