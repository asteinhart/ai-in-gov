//// nice to add
// interaction to text
// make tooltip nicer

// ----- CONSTANTS -----
let highlightCol = "1";
let highlightValue = "2";

let strokeBefore = "none";
let strokeWidthBefore = 0;

const is_mobile = window.innerWidth < 800;
const margin = { top: 10, right: 30, bottom: 30, left: 50 };
const container = document.getElementById("graphic-container");
const chartWidth = is_mobile
  ? container.getBoundingClientRect().width * 0.95
  : container.getBoundingClientRect().width * 0.8;
let height;

//colorsDep = ["#fed98e", "#fe9929", "#d95f0e", "#993404", "#800000"];
//colorsDep = ["#dd2c2f", "#d02224", "#bd1f21", "#ac1c1e", "#9c191b"];
colorsDep = ["#da7e37", "#c06722", "#a85311", "#8f3e00", "#713200"];

colorTech = ["#bae4bc", "#7bccc4", "#43a2ca", "#2c7bb6", "#0868ac"];
colorTech = ["#25a244", "#208b3a", "#1a7431", "#155d27", "#10451d"];
const colors5 = {
  "Department of Energy": colorsDep[4],
  "Department of Health and Human Services": colorsDep[3],
  "Department of Commerce": colorsDep[2],
  "Department of Homeland Security": colorsDep[1],
  "Department of Veterans Affairs": colorsDep[0],
  "All Other Departments": "grey",

  "Unspecified Machine Learning": colorTech[4],
  "Neural Network": colorTech[2],
  Automation: colorTech[2],
  Other: colorTech[1],
  "All Other Techniques": "grey",
  "Natural Language Processing": colorTech[3],
  "Machine Vision": colorTech[0],
};

colorsDev = ["#b9375e", "#8a2846", "#602437"];

const colors3 = {
  "In Use": colorsDev[2],
  "In Development": colorsDev[1],
  "In Planning": colorsDev[0],
  "No Development Stage Indicated": "grey",
};

const defaultColor = "#01397D";
const highlightColor = defaultColor;

// -------- MOBILE ---------
// ----- mobile ------
if (is_mobile) {
  // change height of chart
  height = window.innerHeight * 0.8;

  // move chart to top of container for formatting
  parent = document.querySelector(".container");
  chart = document.querySelector(".graphic-container");
  scrollers = document.querySelector(".scroller-container");
  parent.insertBefore(chart, scrollers);

  // rm mention of tooltip (for now)
  d3.select(".tooltip").remove();
  document.querySelector("#hover-text").remove();
  document.querySelector(
    "#exit-hover-text"
  ).innerHTML = `In the meantime, you can explore the current inventory in the table below.`;
} else {
  height = window.innerHeight - margin.top - margin.bottom;
}

const startXMax = 27;
// current max is 37, maybe programmatically determine this
const startYMax = 45;

// -------- CHART FUNCTIONS ---------
function isDark(bgColor) {
  var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB

  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

function resetChart() {
  d3.selectAll(".use-case")
    .transition()
    .duration(1000)
    .attr("fill", defaultColor)
    .attr("stroke", "none")
    .attr("stroke-width", 1)
    .style("opacity", 1);

  d3.selectAll(".label-text, .label-rect").remove();
}

function highlightDep() {
  dep = document.querySelector("#dep-select").value;

  var chart = d3.select("#g-chart");

  chart
    .selectAll(".use-case")
    .attr("stroke", (d) => (d.Department == dep ? "white" : "none"))
    .attr("stroke-width", (d) => (d.Department == dep ? 3 : 0));
}
function highlightTech() {
  tech = document.querySelector("#tech-select").value;

  var chart = d3.select("#g-chart");

  chart
    .selectAll(".use-case")
    .attr("stroke", (d) => (d.tech_clean == tech ? "white" : "none"))
    .attr("stroke-width", (d) => (d.tech_clean == tech ? 3 : 0));
}

// -------- CHART ---------

function boxSize(numWidth = 27) {
  return is_mobile
    ? 8
    : (chartWidth - margin.left - margin.right) / numWidth - 3.8;
}

function startingChart() {
  var chart = d3
    .select(".graphic-container")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "g-chart")
    .attr("width", chartWidth - margin.left - margin.right);

  // scales
  x = d3
    .scaleLinear()
    .range([0, chartWidth - margin.left - margin.right])
    .domain([0, startXMax]);
  y = d3.scaleLinear().range([height, 0]).domain([0, startYMax]);

  // add axe

  let Tooltip = d3
    .select(".graphic-container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("opacity", "0")
    .style("stroke", "none");

  // Three function that change the tooltip when user hover / move / leave a voronoi cell
  var mouseover = function (d) {
    if (!is_mobile) {
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
      strokeBefore = d3.select(id).attr("stroke");
      strokeWidthBefore = d3.select(id).attr("stroke-width");
      d3.select(id).attr("stroke", "white").attr("stroke-width", 3);
    }
  };
  var mousemove = function () {
    if (is_mobile) {
      return;
    }
    const [mouseX, mouseY] = d3.mouse(this);
    const [absMouseX, absMouseY] = d3.mouse(document.body);
    const tooltipWidth = Tooltip.node().offsetWidth;
    const tooltipHeight = Tooltip.node().offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let tooltipX = mouseX + (!is_mobile ? 100 : 0); // Add some offset to avoid overlapping with the cursor
    let tooltipY = mouseY;

    // Adjust if the tooltip goes beyond the right edge of the window

    if (absMouseX + 100 + tooltipWidth > windowWidth) {
      tooltipX = mouseX - tooltipWidth + 10;
    }
    // TODO for mobile
    // left edge
    if (absMouseX - tooltipWidth < 0) {
      tooltipX = mouseX - tooltipWidth + 10;
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
    const id = "#" + String(d.Use_Case_ID) + " rect";
    Tooltip.style("opacity", 0);
    d3.select(id).attr("stroke-width", strokeWidthBefore);
    d3.select(id).attr("stroke", strokeBefore);
  };

  // remove ticks and line
  d3.selectAll("path,line").remove();

  chart
    .selectAll(".rect")
    .data(data)
    .enter()
    .append("g")
    .attr("id", (d) => d.Use_Case_ID) // TODO what should this be
    .append("rect")
    .attr("class", "use-case")
    .attr("x", (d) => x(+d.start_dep_x))
    .attr("y", (d) => y(+d.start_dep_y))
    .attr("width", boxSize())
    .attr("height", boxSize())
    .attr("fill", defaultColor)
    .style("opacity", 0);

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

  selection = chart.selectAll(".use-case");

  if (transition) {
    selection = selection.transition().duration(1000);
  }
  selection
    .attr("x", (d) => x(d[xName]))
    .attr("y", (d) => y(d[yName]))
    .attr("width", boxSize())
    .attr("height", boxSize())
    .attr("fill", defaultColor)
    .style("opacity", 1)
    .attr("stroke", "none")
    .attr("stroke-width", 1);

  // reset
  highlightCol = "1";
  highlightValue = "2";
}

function switchSplit(col, colName, colors, transition = true) {
  resetChart();
  xName = col + "_x";
  yName = col + "_y";

  var chart = d3.select("#g-chart");

  selection = chart.selectAll(".use-case");
  if (transition) {
    selection = selection.transition().duration(1000);
  }

  selection
    .attr("x", (d) => x(d[xName]))
    .attr("y", (d) => y(d[yName]))
    .attr("width", boxSize())
    .attr("height", boxSize())
    .attr("fill", (d) => colors[d[colName]] || "grey")
    .style("opacity", 1);

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
    id_text = "text-" + name.split(" ").join("_");
    id_rect = "rect-" + name.split(" ").join("_");

    chart
      .append("text")
      .attr("id", id_text)
      .attr("class", "label-text")
      .attr("x", x(startXMax / 2))
      .attr("text-anchor", "middle")
      .attr("y", y(value))
      .attr("fill", isDark(colors[name]) ? "black" : "white")
      .attr("opacity", 0)
      .text(name + " (" + result[name] + ")");

    var rectBox = document.querySelector("#" + id_text).getBBox();

    chart
      .append("rect")
      .attr("class", "label-rect")
      .attr("id", id_rect)
      .attr("x", rectBox.x - 5)
      .attr("y", rectBox.y)
      .attr("width", rectBox.width + 10)
      .attr("height", rectBox.height)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", colors[name])
      .attr("opacity", 0)
      .lower();

    d3.selectAll(".label-text, .label-rect")
      .transition()
      .duration(1000)
      .attr("opacity", 1);
    // reset
    highlightCol = "1";
    highlightValue = "2";
  }
}
function transitionChart(startName, endName) {
  const transition = async () => {
    switchStarting(startName, true);
    await sleep(1100);
    switchStarting(endName, false); // maybe true?

    // reset
    highlightCol = "1";
    highlightValue = "2";
  };
  transition();
}

// -------- AG-GRID ---------
// todo consider moving to https://datatables.net/ from ag grid
let gridAPI;
function createTable(tableData) {
  let cols_list = [];
  for (col of Object.keys(tableData[0])) {
    if (col == "Title") {
      dict = {
        field: col,
        pinned: "left",
        lockPinned: true,
        width: is_mobile ? 125 : 300,
        suppressMovable: true,
        wrapText: true,
        autoHeight: true,
      };
    } else if (col == "Summary") {
      dict = {
        field: col,
        suppressMovable: true,
        wrapText: true,
        autoHeight: true,
        width: is_mobile ? 200 : 600,
      };
    } else {
      dict = {
        field: col,
        suppressMovable: true,
        wrapText: true,
        autoHeight: true,
        width: is_mobile ? 100 : 200,
      };
    }
    cols_list.push(dict);
  }

  let gridOptions = {
    // Row Data: The data to be displayed.
    rowData: tableData,
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

// DROPDOWN BUTTON-------------------------------------------------------------
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", async function () {
    if (this.innerHTML.indexOf("▾") !== -1) {
      this.innerHTML = "&#9656; Learn more about the techniques listed.";
    } else {
      this.innerHTML = "&#9662 Learn more about the techniques listed.";
    }
    var content = document.getElementById("content");
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }

    // need to trigger reset after css animation lol
    await sleep(300);
    Waypoint.refreshAll();
    å;
  });
}

// -------- functions ---------

// scroll to table
function scrollToTable() {
  var table = document.getElementById("table");
  const scrollIntoViewOptions = { behavior: "smooth" };
  table.scrollIntoView(scrollIntoViewOptions);
}
function scrollToTop() {
  var top = document.getElementById("use-case-button");
  const scrollIntoViewOptions = { behavior: "smooth" };
  top.scrollIntoView(scrollIntoViewOptions);
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

// ------ waypoints ------

let techSourceWaypoint;
function makeWaypoints() {
  let offset = "60%";
  // fade in chart
  new Waypoint({
    element: document.getElementById("sIntro"),
    handler: function (direction) {
      if (direction == "down") {
        async function fadeIn() {
          d3.selectAll(".graphic-container, .use-case")
            .transition()
            .duration(1000)
            .style("opacity", "1");
          await sleep(1001);
          switchStarting("start_dep", true);
          await sleep(1001);
          d3.select("g#TREAS-0004-2023 rect").dispatch("mouseleave");
        }
        fadeIn();
      } else {
        d3.interrupt(d3.select(".graphic-container"));
        switchStarting("start_dep", true);

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
    handler: function (direction) {
      if (direction == "down") {
        // highlight one model
        // change color
        d3.selectAll(".use-case")
          .transition()
          .duration(800)
          .style("opacity", (d) =>
            d.Use_Case_ID == "TREAS-0004-2023" ? 1 : 0.2
          )
          .on("end", () => {
            if (!is_mobile) {
              d3.select("g#TREAS-0004-2023 rect").dispatch("mouseover");
              d3.select(".tooltip").style("right", "2%").style("top", "2%");
            }
          });
        // enable tooltip
      } else {
        // switch to starting chart
        switchStarting("start_dep", true);
        d3.select("g#TREAS-0004-2023 rect").dispatch("mouseleave");
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sDep"),
    handler: function (direction) {
      if (direction == "down") {
        // switch to split chart
        d3.select("g#TREAS-0004-2023 rect").dispatch("mouseleave");
        switchSplit("split_dep", "dep_edit", colors5);
      } else {
        // switch to starting chart

        const cheating = async () => {
          switchStarting("start_dep", true);
          await sleep(1001);

          d3.selectAll(".use-case")
            .transition()
            .duration(800)
            .style("opacity", (d) =>
              d.Use_Case_ID == "TREAS-0004-2023" ? 1 : 0.2
            )
            .on("end", () => {
              if (!is_mobile) {
                d3.select("g#TREAS-0004-2023 rect").dispatch("mouseover");
                d3.select(".tooltip")
                  .transition()
                  .duration(500)
                  .style("right", "2%")
                  .style("top", "2%");
              }
            });
        };
        cheating();
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sTechEx"),
    handler: function (direction) {
      if (direction == "down") {
        const techHighlight = [
          "DOC-0005-2023",
          "DHS-0032-2023",
          "HHS-0089-2023",
          "HHS-0014-2023",
        ];

        // TODO change to actually chained https://stackoverflow.com/questions/59513673/how-to-chain-d3-transitions

        const cheating = async () => {
          transitionChart("start_dep", "start_t");
          await sleep(1100);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", highlightColor)
            .style("opacity", (d) =>
              techHighlight.includes(d.Use_Case_ID) ? 1 : 0.2
            );
        };
        cheating();
      } else {
        // switch to starting chart
        //switchStarting("start_dep", true);
        switchSplit("split_dep", "dep_edit", colors5);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sTechMiss"),
    handler: function (direction) {
      if (direction == "down") {
        const cheating = async () => {
          d3.selectAll(".use-case")
            .transition()
            .duration(500)
            .style("opacity", 1);
          await sleep(550);
          resetChart();
          switchStarting("start_t", false);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", (d) => (!d.Techniques ? "white" : defaultColor))
            .attr("stroke", (d) => (!d.Techniques ? defaultColor : "none"));
        };
        cheating();

        // show all the missing tech
      } else {
        const techHighlight = [
          "DOC-0005-2023",
          "DHS-0032-2023",
          "HHS-0089-2023",
          "HHS-0014-2023",
        ];
        const cheating = async () => {
          resetChart();
          await sleep(1001);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", highlightColor)
            .style("opacity", (d) =>
              techHighlight.includes(d.Use_Case_ID) ? 1 : 0.2
            );
        };
        cheating();
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
        const cheating = async () => {
          switchStarting("start_t", true);
          await sleep(1001);
          d3.selectAll(".use-case")
            .transition()
            .duration(500)
            .style("opacity", 1);
          await sleep(550);
          resetChart();
          await sleep(100);
          switchStarting("start_t", false);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", (d) => (!d.Techniques ? "white" : defaultColor))
            .attr("stroke", (d) => (!d.Techniques ? defaultColor : "none"))
            .attr("stroke-width", (d) => (!d.Techniques ? 1 : "none"));
        };
        cheating();
      }
    },
    offset: offset,
  });

  techSourceWaypoint = new Waypoint({
    element: document.getElementById("sTechSource"),
    handler: function (direction) {
      if (direction == "down") {
        d3.selectAll(".use-case")
          .transition()
          .duration(1000)
          .attr("stroke", "none")
          .style("opacity", (d) => (d.Source_Code ? 1 : 0.2));
      } else {
        switchSplit("split_t", "tech_edit", colors5);
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sStageMiss"),
    handler: function (direction) {
      if (direction == "down") {
        const cheating = async () => {
          switchStarting("start_t", true);
          await sleep(1020);
          switchStarting("start_dev", false);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", (d) =>
              d.dev_edit == "No Development Stage Indicated"
                ? "white"
                : defaultColor
            )
            .attr("stroke", (d) =>
              d.dev_edit == "No Development Stage Indicated"
                ? defaultColor
                : "none"
            );
        };
        cheating();
      } else {
        const cheating = async () => {
          switchSplit("split_t", "tech_edit", colors5);
          await sleep(1050);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .style("opacity", (d) => (d.Source_Code ? 1 : 0.2));
        };
        cheating();
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
        const cheating = async () => {
          switchStarting("start_dev", true);
          await sleep(1001);
          d3.selectAll(".use-case")
            .transition()
            .duration(1000)
            .attr("fill", (d) =>
              d.dev_edit == "No Development Stage Indicated"
                ? "white"
                : defaultColor
            )
            .attr("stroke", (d) =>
              d.dev_edit == "No Development Stage Indicated"
                ? defaultColor
                : "none"
            );
        };
        cheating();
      }
    },
    offset: offset,
  });

  new Waypoint({
    element: document.getElementById("sClosing"),
    handler: function (direction) {
      if (direction == "down") {
        switchStarting("start_dev", true);
      } else {
        switchSplit("split_dev", "dev_edit", colors3);
      }
    },
    offset: "60%",
  });

  if (is_mobile) {
    new Waypoint({
      element: document.getElementById("sFake"),
      handler: function (direction) {
        if (direction == "down") {
          //
          //d3.select(".graphic-container").style("position", "fixed");

          d3.selectAll(".graphic-container, #sClosing")
            .transition()
            .duration(500)
            .style("opacity", "0");
        } else {
          d3.selectAll(".graphic-container, #sClosing")
            .transition()
            .duration(500)
            .style("opacity", "1");
        }
      },
      offset: "100%",
    });
  }

  new Waypoint({
    element: document.getElementById("topLink"),
    handler: function (direction) {
      if (direction == "down") {
        //
        //d3.select(".graphic-container").style("position", "fixed");

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

let data;

// load data
async function loadData() {
  const response = await fetch("static/data/2023_ai_inventory_edit.csv");
  const text = await response.text();
  const d = d3.csvParse(text);

  console.log("data loaded");
  console.log(d);
  return d;
}

async function init() {
  data = await loadData();
  tableData = data.map((d) => {
    return {
      Title: d.Title,
      Department: d.Department,
      Agency: d.Agency,
      Office: d.Office,
      Summary: d.Summary,
      "Original Technique": d.Techniques,
      "Inferred Technique": d.tech_clean,
      "Development Stage": d.dev_edit,
      "Source Code": d.Source_Code,
    };
  });
  createTable(tableData);
  makeWaypoints();
  startingChart();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});
