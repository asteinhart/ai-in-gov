// scroll to table
function scrollToGrid() {
    var grid = document.getElementById("myGrid");
    const scrollIntoViewOptions = {behavior: "smooth"}
    grid.scrollIntoView(scrollIntoViewOptions); 
};

let gridOptions = {};

d3.csv("data/2023_ai_inventory.csv", function (error, data) {
    let cols_list = []
    for (col of data.columns) {
        dict = {field: col}
        cols_list.push(dict);
    }
    
    gridOptions = {
        // Row Data: The data to be displayed.
        rowData: data,
        // Columns to be displayed (Should match rowData properties)
        columnDefs: cols_list,
       };

       const myGridElement = document.querySelector('#myGrid');
       agGrid.createGrid(myGridElement, gridOptions);
});

// Your Javascript code to create the grid




