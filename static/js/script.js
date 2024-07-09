
// ----- CONSTANTS -----
const is_mobile = window.innerWidth < 600;
const margin = { top: 30, right: 30, bottom: 30, left: 50 };
const container = document.getElementById("container");
const chartWidth = container.getBoundingClientRect().width * .65
let height;

if (is_mobile) {
  height = window.innerHeight * 0.5;
} else {
  height = window.innerHeight * 0.66 - margin.top - margin.bottom;
}


const defaultColor = "steelblue",
  collegeColor = "#8B80F9",
  covidColor = "#D1495B",
  movingColor = defaultColor,
  nycColor = "#2A7F62",
  gradColor = "#EE964B",
  colors = [collegeColor, covidColor, movingColor, nycColor, gradColor];

let flag = true;

// -------- LOAD/CLEAN DATA ---------

// load data
d3.csv("static/data/2023_ai_inventory_edit.csv", function (error, data) {
    console.log(data);
    sessionStorage.setItem("data", JSON.stringify(data));
});

let data = JSON.parse(sessionStorage.getItem("data"));

// 
var parseDate = d3.timeParse("%Y-%m-%d");

data.forEach(function (d) {
    // parse strings into date object or numbers
    d.dept_x = +d.dept_x;
    d.dept_y = +d.dept_y;
  });


const maxDeptX = d3.max(data, (d) => +d.dept_x);
const maxDeptY = d3.max(data, (d) => +d.dept_y);

const maxDevX = d3.max(data, (d) => +d.dev_x);
const maxDevY = d3.max(data, (d) => +d.dev_y);

let tickValuesDept = Array((Math.floor(maxDeptX/7)+1)).fill().map((x,i)=>(i*7) + 3)
let tickValuesDev = Array((Math.floor(maxDevX/7)+1)).fill().map((x,i)=>(i*7) + 3)


const tickLabelsDept = data.reduce((acc, obj) => {
    if (!acc.includes(obj.Department_Code)) {
        acc.push(obj.Department_Code);
    }
    return acc;
}, []);

const tickLabelsDev = data.reduce((acc, obj) => {
    if (!acc.includes(obj.Development_Stage)) {
        acc.push(obj.Development_Stage);
    }
    return acc;
}, []);





// -------- CHART ---------

function barChart() {

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
        .domain([0, maxDeptX]);
    y = d3.scaleLinear().range([height, 0]).domain([0, maxDeptY]);

    // add axes
    chart
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(0).tickValues(tickValuesDept).tickFormat((d,i) => tickLabelsDept[i]));

    // remove ticks and line 
    d3.selectAll("path,line").remove();

    chart
        .selectAll(".rect")
        .data(data)
        .enter()
        .append("g")
        .attr("class", (d) => d.Department)
        .append("rect")
            .attr("x", (d) => x(d.dept_x))
            .attr("y", (d) => y(d.dept_y))
            .attr("width",5)
            .attr("height",5)
            .attr("stroke","black")
            .attr("fill","white");

}

function switchChart() {


    console.log("switching chart");

    var chart = d3.select("#g-chart");

    if (flag == false) {
        maxX = maxDeptX;
        maxY = maxDeptY;
    } else {
        maxX = maxDevX;
        maxY = maxDevY;
    }

    let x = d3
        .scaleLinear()
        .range([0, chartWidth - margin.left - margin.right])
        .domain([0, maxX]);

    let y = d3.scaleLinear().range([height, 0]).domain([0, maxY]);

    // add axes
    chart
        .select("#x-axis")
        .transition()
        .duration(2000)
        .call(d3.axisBottom(x).ticks(0).tickValues(tickValuesDev).tickFormat((d,i) => tickLabelsDev[i]));

    // remove ticks and line 
    d3.selectAll("path,line").remove();
    
 
    chart
        .selectAll("rect")
        .data(data)
        .transition()
        .duration(2000)
            .attr("x", (d) => !flag ? x(d.dept_x) : x(d.dev_x))
            .attr("y", (d) => !flag ? y(d.dept_y) : y(d.dev_y))

    flag = !flag;
}

// -------- functions ---------
function createTable(data) {
    let cols_list = []
    for (col of Object.keys(data[0])) {
        dict = {field: col}
        cols_list.push(dict);
    }
    
    let gridOptions = {
        // Row Data: The data to be displayed.
        rowData: data,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: cols_list,
       };

       const table = document.querySelector('#table');
       agGrid.createGrid(table, gridOptions);
}

// scroll to table
function scrollToTable() {
    var table = document.getElementById("table");
    const scrollIntoViewOptions = {behavior: "smooth"}
    table.scrollIntoView(scrollIntoViewOptions); 
};



// ------ waypoints ------
function makeWaypoints() {
    let offset = "60%";
    // fade in chart
    new Waypoint({
      element: document.getElementById("s1"),
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
        element: document.getElementById("s2"),
        handler: function (direction) {
          if (direction == "down") {
            switchChart(flag);
          }},
        offset: "100%",
      });
    
} 

// -------- main ---------

function init() {
    createTable(data);
    makeWaypoints();
    barChart();
}


init();