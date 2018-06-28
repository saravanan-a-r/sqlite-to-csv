const fs = require("fs");
const sqlite3 = require("sqlite3");

module.exports = {
    toCSV : toCSV
};

function toCSV(args, error) {

    if(!args.filePath) {
        error("ERR102 :: filePath params missing in first argument of toCSV()");
        return;
    }

    if(!args.outputPath) {
        error("ERR103 :: outputPath params missing in first argument of toCSV()");
    }
    
    if(!fs.existsSync(args.filePath)) {
        error("ERR100 :: " + filePath + "not found");
        return;
    }

    if(!fs.existsSync(args.outputPath)) {
        error("WRN200 :: Output path director not found. Default folder named \"csv\" is created in current working directory");
        fs.mkdirSync("csv");
        args.outputPath = "csv";
    }

    var db = new sqlite3.Database(args.filePath, sqlite3.OPEN_READONLY, (err) => {
        if(err) {
            error("ERR101 : Failed to open given database with read only mode \n" + err );
        }
    });

    var tblNames = [];

    var tblMeta = [];

    db.serialize( () => {

        db.all("select name, sql from sqlite_master where type='table'", [], (err, rows) => {
            if(err) {
                error("ERR103 :: Failed to execute query :: select name from sqlite_master where type='table'");
                return;
            }
            tblMeta = rows.filterTblMeta(rows);
            readTables(tblNames);
        });

        var readTables = (tblNames, error) => {

            tblNames.map( (tbl) => {
        
                db.all("select * from " + tbl, [], (err, rows) => {
                    if(err) {
                        error("ERR103 :: Failed to execute query :: select * from " + tbl);
                        return;
                    }
                    writeCSV(rows, tbl + ".csv", args.outputPath);
                });
            });
        };
    });
}

function writeCSV(rows, filePath, outputPath) {

    var columnNames = "\"" + Object.keys(rows.length ? rows[0] : []).join("\",\"") + "\"";
    var csvData = columnNames + "\n";

    rows.map( (row) => {
        csvData = csvData + "\"" + Object.values(row).join("\",\"") + "\"" + "\n";
    });
    
    fs.writeFile(outputPath + "/" + filePath, csvData, "utf-8", (err) => {
        if(err) {
            error("ERR104 :: Failed to write to " + outputPath + "/" + filePath);
        }
    });
}

Array.prototype.filterTblMeta = (arr) => {
    
    var values  = [];
    arr.map( (obj) => {
        if(obj.name && obj.sql) {
            debugger;
            var columns = obj.sql.match(/.*CREATE\s+TABLE\s+(\S+)\s*\((.*)\).*/)[2].split(/,/);
            
            for(i = 0;i < columns.length; i++) {
                columns[i] = columns[i].replace(/\s.*/g, '');
            }
            console.log(columns);
            debugger;
            // values.push({
            //     name : obj.name,
                
            // }); 
        }
    });

    return values;
}


/* --- Error Handling --- */
/*
ERR100 -> Input database file not found
ERR101 -> Failed to open given database with read only mode
ERR102 -> filePath params missing in first argument of toCSV()
ERR103 -> outputPath params missing in first argument of toCSV()
ERR104 -> Failed to write to csv file
*/

/* --- Warning --- */
/*
WRN200 -> Output path director not found. Default folder named "csv" is created in current working directory. 
*/

/* Future developement */
/*
Table with 0 rows should write columgn name atlease */
