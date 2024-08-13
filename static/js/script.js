// data todo
// sort data with other at the bottom

// ----- CONSTANTS -----
const is_mobile = window.innerWidth < 600;
const margin = { top: 10, right: 30, bottom: 30, left: 50 };
const container = document.getElementById("container");
const chartWidth = container.getBoundingClientRect().width * 0.4;
let height;

if (is_mobile) {
  height = window.innerHeight * 0.5;
} else {
  height = window.innerHeight - margin.top - margin.bottom;
}

highlightColor = "red";

colorCodes5 = ["#d7191c", "#fda148", "#83cd7b", "#6ebed9", "#2c7bb6"];
const colors5 = {
  "Department of Energy": colorCodes5[0],
  "Department of Health and Human Services": colorCodes5[1],
  "Department of Commerce": colorCodes5[2],
  "Department of Homeland Security": colorCodes5[3],
  "Department of Veterans Affairs": colorCodes5[4],
  "All Other Departments": "grey",

  "Unspecified Machine Learning": colorCodes5[0],
  "Neural Network": colorCodes5[1],
  Other: colorCodes5[2],
  "Natural Language Processing": colorCodes5[3],
  "Machine Vision": colorCodes5[4],
};

colorCodes3 = ["#fda148", "#83cd7b", "#2c7bb6"];

const colors3 = {
  "In Use": colorCodes3[1],
  "In Development": colorCodes3[0],
  "In Planning": colorCodes3[2],
};

const defaultColor = "steelblue";

// -------- LOAD/CLEAN DATA ---------

// load data
d3.csv("static/data/2023_ai_inventory_edit.csv", function (error, data) {
  console.log(data);
  sessionStorage.setItem("data", JSON.stringify(data));
});

let data = JSON.parse(sessionStorage.getItem("data"));

//
const startXMax = d3.max(data, (d) => +d.start_dep_x);
// current max is 37, maybe programmatically determine this
const startYMax = 45;

// -------- CHART FUNCTIONS ---------

function resetChart() {
  d3.selectAll("rect")
    .attr("fill", "steelblue")
    .attr("stroke", "none")
    .attr("stroke-width", 1);
}

function highlightDep() {
  dep = document.querySelector("#dep-select").value;

  var chart = d3.select("#g-chart");

  chart
    .selectAll("rect")
    .attr("stroke", (d) => (d.Department == dep ? "black" : "none"))
    .attr("stroke-width", (d) => (d.Department == dep ? 2 : 0));
}

// -------- CHART ---------

function boxSize(numWidth = 27) {
  return (chartWidth - margin.left - margin.right) / numWidth - 4;
}

function startingChart() {
  var chart = d3
    .select(".graphic-container")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "g-chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", chartWidth - margin.left - margin.right);

  // scales
  x = d3
    .scaleLinear()
    .range([0, chartWidth - margin.left - margin.right])
    .domain([0, startXMax]);
  y = d3.scaleLinear().range([height, 0]).domain([0, startYMax]);

  // add axes
  chart
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + 20 + ")")
    .call(d3.axisBottom(x));

  let Tooltip = d3
    .select(".graphic-container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", "0")
    .style("stroke", "none");

  // Three function that change the tooltip when user hover / move / leave a voronoi cell
  var mouseover = function (d) {
    if (d) {
      // avoids console error when cursor goes off chart

      // show tooltip and update html
      Tooltip.style("opacity", 1) // show opacity only if there is a found data element
        .html(
          "<div class = 'tooltip-content'>" +
            "<div style = 'padding: 1px;'>" +
            "<b>" +
            d.Title +
            "</b>" +
            "</div>" +
            "<div style = 'padding: 1px;'>" +
            d.Department +
            "</div>" +
            "<div class = 'tooltip-info'>" +
            "<div class = '" +
            d.dev_edit +
            "'>" +
            d.dev_edit +
            "</div>" +
            "<div class = '" +
            d.tech_clean +
            "'>" +
            d.tech_clean +
            "</div>" +
            "<div class = '" +
            (d.Source_Code == "" ? "noSource" : "yesSource") +
            "'>" +
            (d.Source_Code == ""
              ? "Source Code Not Available"
              : "Source Code Available") +
            "</div>" +
            "</div>" +
            "<hr>" +
            d.Summary +
            "</div>"
        );

      // highlight bar corresponding to the voronoi path
      const id = "#" + String(d.Use_Case_ID) + " rect";
      d3.select(id).attr("stroke", "black").attr("strokeWidth", 1);
    }
  };
  var mousemove = function () {
    const [mouseX, mouseY] = d3.mouse(this);
    const tooltipWidth = Tooltip.node().offsetWidth;
    const tooltipHeight = Tooltip.node().offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let tooltipX = mouseX + 100; // Add some offset to avoid overlapping with the cursor
    let tooltipY = mouseY;

    // Adjust if the tooltip goes beyond the right edge of the window
    if (tooltipX + tooltipWidth > windowWidth) {
      tooltipX = mouseX - tooltipWidth - 10;
    }

    // Adjust if the tooltip goes beyond the bottom edge of the window
    if (tooltipY + tooltipHeight > windowHeight) {
      tooltipY = mouseY - tooltipHeight - 10;
    }

    // Adjust if the tooltip goes beyond the top edge of the window
    if (tooltipY < 0) {
      tooltipY = 10; // Set a minimum offset from the top edge
    }
    Tooltip.style("left", `${tooltipX}px`).style("top", `${tooltipY}px`);
  };
  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    if (d) {
      // prevent console error caused by voronoi side effects
      const id = "#" + String(d.Use_Case_ID) + " rect";
      d3.select(id).attr("stroke", "none");
    }
  };

  //.ticks(0).tickValues(tickValuesTech).tickFormat((d,i) => wrap(tickLabelsTech[i], 20)))
  //   .selectAll("text")
  //         .attr("transform", function(d) {
  //             return "rotate(15)"
  //             });
  //chart.selectAll('#x-axis text').each(insertLinebreaks);

  // remove ticks and line
  d3.selectAll("path,line").remove();

  chart
    .selectAll(".rect")
    .data(data)
    .enter()
    .append("g")
    .attr("id", (d) => d.Use_Case_ID) // TODO what should this be
    .append("rect")
    .attr("x", (d) => x(+d.start_dep_x))
    .attr("y", (d) => y(+d.start_dep_y))
    .attr("width", boxSize())
    .attr("height", boxSize())
    .attr("fill", "steelblue");

  // add tooltip
  chart
    .selectAll("rect")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}

function switchStarting(col, transition = false) {
  resetChart();

  xName = col + "_x";
  yName = col + "_y";

  var chart = d3.select("#g-chart");

  selection = chart.selectAll("rect");

  if (transition) {
    selection = selection.transition().duration(1000);
  }
  selection
    .attr("x", (d) => x(d[xName]))
    .attr("y", (d) => y(d[yName]))
    .attr("fill", defaultColor);

  // remove labels
  chart.selectAll(".label").remove();
}

function switchSplit(col, colName, colors, transition = true) {
  resetChart();

  xName = col + "_x";
  yName = col + "_y";

  var chart = d3.select("#g-chart");

  selection = chart.selectAll("rect");
  if (transition) {
    selection = selection.transition().duration(1000);
  }

  selection
    .attr("x", (d) => x(d[xName]))
    .attr("y", (d) => y(d[yName]))
    .attr("fill", (d) => colors[d[colName]] || "grey");

  // add labels
  // make object wtih label name and y
  const maxValues = {};
  data.forEach((item) => {
    const category = item[colName];
    const yValue = item[yName];
    const xValue = item[xName];

    // If the category is not in the object, add it
    // If the category is in the object, update the value if the current value is greater
    if (!maxValues[category] || yValue > maxValues[category]) {
      let adjust = 0.5;
      // adjustments for Other category in Dep
      if (category == "All Other Departments") {
        adjust = 0;
      }
      maxValues[category] = parseInt(yValue) + adjust;
    }
  });

  // Counts
  counts = [];
  data.forEach((i) => {
    counts.push(i[colName]);
  });

  const result = counts.reduce((total, value) => {
    total[value] = (total[value] || 0) + 1;
    return total;
  }, {});

  for (const [name, value] of Object.entries(maxValues)) {
    chart
      .append("text")
      .transition()
      .duration(1000)
      .delay(500)
      .attr("class", "label")
      .attr("x", x(startXMax / 2))
      .attr("text-anchor", "middle")
      .attr("y", y(value))
      .attr("fill", colors[name] || "grey")
      .attr("color", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "1em")

      .text(name + " (" + result[name] + ")");
  }
}
function transitionChart(startName, endName) {
  const transition = async () => {
    switchStarting(startName, true);
    await sleep(1000);
    switchStarting(endName, false); // maybe true?
  };
  transition();
}

// -------- AG-GRID ---------
// todo consider moving to https://datatables.net/ from ag grid
let gridAPI;
function createTable(data) {
  let cols_list = [];
  for (col of Object.keys(data[0])) {
    dict = { field: col };
    cols_list.push(dict);
  }

  let gridOptions = {
    // Row Data: The data to be displayed.
    rowData: data,
    // Columns to be displayed (Should match rowData properties)
    columnDefs: cols_list,
  };

  const table = document.querySelector("#table");
  gridAPI = agGrid.createGrid(table, gridOptions);
}

function onFilterTextBoxChanged() {
  gridAPI.setGridOption(
    "quickFilterText",
    document.getElementById("filter-text-box").value
  );
}

// -------- functions ---------

// scroll to table
function scrollToTable() {
  var table = document.getElementById("table");
  const scrollIntoViewOptions = { behavior: "smooth" };
  table.scrollIntoView(scrollIntoViewOptions);
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// ------ waypoints ------
function makeWaypoints() {
  let offset = "60%";
  // fade in chart
  new Waypoint({
    element: document.getElementById("sIntro"),
    handler: function (direction) {
      if (direction == "down") {
        d3.select(".graphic-container")
          .transition()
          .duration(1000)
          .style("opacity", "1");
      } else {
        d3.select(".graphic-container")
          .transition()
          .duration(1000)
          .style("opacity", "0");
      }
    },
    offset: "100%",
  });
  new Waypoint({
    element: document.getElementById("sExample"),
    handler: function () {
      // highlight one model
      // change color
      d3.select("g#DOC-0029-2023 rect")
        .transition()
        .duration(500)
        .attr("fill", highlightColor);
      // enable tooltip
      d3.select("g#DOC-0029-2023 rect").dispatch("mouseover");
      d3.select(".tooltip").style("left", "50%").style("top", 0);

      //TODO;
      //switchSplit("split_dep", depColors);
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sDep"),
    handler: function (direction) {
      if (direction == "down") {
        // switch to split chart
        d3.select("g#DOC-0029-2023 rect").dispatch("mouseleave");
        switchSplit("split_dep", "dep_edit", colors5);
      } else {
        // switch to starting chart
        switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sTechEx"),
    handler: function (direction) {
      if (direction == "down") {
        // switch to tech chart
        transitionChart("start_dep", "start_t");

        // TODO change to actually chained https://stackoverflow.com/questions/59513673/how-to-chain-d3-transitions

        const cheating = async () => {
          await sleep(1100);
          d3.selectAll(
            "#DOC-0005-2023 rect, #DHS-0032-2023 rect, #HHS-0091-2023 rect"
          )
            .transition()
            .delay((d, i) => i * 100)
            .attr("fill", "red");
        };
        cheating();
      } else {
        // switch to starting chart
        switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sTechMiss"),
    handler: function (direction) {
      if (direction == "down") {
        // just in case
        switchStarting("start_t", false);

        // show all the missing tech
        d3.selectAll("rect")
          .transition()
          .duration(1000)
          .attr("fill", (d) =>
            d.tech_edit == "No Technique Provided" ? "grey" : "steelblue"
          );
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sTechSplit"),
    handler: function (direction) {
      if (direction == "down") {
        switchSplit("split_t", "tech_edit", colors5);
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });
  new Waypoint({
    element: document.getElementById("sTechSource"),
    handler: function (direction) {
      if (direction == "down") {
        d3.selectAll("rect")
          .transition()
          .duration(1000)
          .attr("fill", (d) =>
            d.Source_Code ? "black" : colors5[d.tech_edit] || "grey"
          );
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sStageMiss"),
    handler: function (direction) {
      if (direction == "down") {
        transitionChart("start_t", "start_dev");

        const cheating = async () => {
          await sleep(1100);
          d3.selectAll("rect")
            .transition()
            .duration(1000)
            .attr("fill", (d) =>
              d.dev_edit == "No Development Stage Indicated"
                ? "grey"
                : "steelblue"
            );
        };
        cheating();
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sStageSplit"),
    handler: function (direction) {
      if (direction == "down") {
        switchSplit("split_dev", "dev_edit", colors3);
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("closing"),
    handler: function (direction) {
      if (direction == "down") {
        //
        d3.selectAll(".graphic-container, #sClosing")
          .transition()
          .duration(1000)
          .style("opacity", "0");
      } else {
        d3.selectAll(".graphic-container, #sClosing")
          .transition()
          .duration(1000)
          .style("opacity", "1");
      }
    },
    offset: "90%",
  });
}

// -------- main ---------

function init() {
  createTable(data);
  makeWaypoints();
  startingChart();
}

init();
