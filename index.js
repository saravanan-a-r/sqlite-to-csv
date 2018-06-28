const sqliteToCsv = require("./sqlite-to-csv");

var args = {
    filePath : "/Users/saravana-4455/Library/Application Support/Notebook/allResources.db",
    outputPath : "csv"
};

sqliteToCsv.toCSV(args, (err) => {
    console.log(err);
});

