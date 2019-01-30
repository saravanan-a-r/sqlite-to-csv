class ToCsv {
    constructor(filePath, outputPath) {
        this.filePath = filePath;
        this.outputPath = outputPath;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
        return this;
    }

    setOutputPath(outputPath) {
        this.outputPath = outputPath;
        return this;
    }

    convert() {

        return new Promise( async (resolve, reject) => {
            try {
                let filePath = this.filePath;
                let outputPath = this.outputPath;

                if(!filePath) {
                    throw "ERR102 :: filePath params missing in first argument of toCSV()";
                }

                if(!outputPath) {
                    throw "ERR103 :: outputPath params missing in first argument of toCSV()";
                }

                const fs = require("fs");

                if(!fs.existsSync(filePath)) {
                    throw "ERR100 :: " + filePath + "not found";
                }

                if(!fs.existsSync(outputPath)) {
                    console.log("WRN200 :: Output path director not found. Default folder named \"csv\" is created in current working directory");
                    fs.mkdirSync("csv");
                    this.outputPath = "csv";
                    outputPath = this.outputPath;
                }
    
                const sqlite3 = require("sqlite3");

                let db = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY, (err) => {
                    if(err) {
                        throw "ERR101 : Failed to open given database with read only mode \n" + err;
                    }
                });
    
                let tblNames = [];
                let tblMeta = [];

                db.serialize( () => {

                    db.all("select name, sql from sqlite_master where type='table'", [], (err, rows) => {
                        if(err) {
                            throw "ERR103 :: Failed to execute query :: select name from sqlite_master where type='table'";
                        }
                        tblMeta = rows.filterTblMeta(rows);
                        readTables(tblNames);
                    });
        
                    var readTables = (tblNames, error) => {
            
                        tblNames.map( async (tbl) => {
                    
                            db.all("select * from " + tbl, [], async (err, rows) => {
                                if(err) {
                                    throw "ERR103 :: Failed to execute query :: select * from " + tbl;
                                    return;
                                }
                                await this.writeCSV(rows, tbl + ".csv", outputPath);
                                resolve({
                                    code : 200,
                                    message : "success"
                                });
                            });
                        });
                    };
                });
            }
            catch(err) {
                console.log(err);
            }
        });
    }

    writeCSV(rows, filePath, outputPath) {

        return new Promise( async (resolve, reject) => {
            try {
                let columnNames = "\"" + Object.keys(rows.length ? rows[0] : []).join("\",\"") + "\"";
                let csvData = columnNames + "\n";
    
                rows.map( (row) => {
                    csvData = csvData + "\"" + Object.values(row).join("\",\"") + "\"" + "\n";
                });
                
                fs.writeFile(outputPath + "/" + filePath, csvData, "utf-8", (err) => {
                    if(err) {
                        throw "ERR104 :: Failed to write to " + outputPath + "/" + filePath;
                    }
                });
            }
            catch(err) {
                throw err;
            }
        });
    
    }
}

Array.prototype.filterTblMeta = (arr) => {
    
    var values  = [];
    arr.map( (obj) => {
        if(obj.name && obj.sql) {
            var columns = obj.sql.match(/.*CREATE\s+TABLE\s+(\S+)\s*\((.*)\).*/)[2].split(/,/);
            for(i = 0;i < columns.length; i++) {
                columns[i] = columns[i].replace(/\s.*/g, '');
            }
            values.push({
                name : obj.name,
            }); 
        }
    });

    return values;
}

module.exports = ToCsv;

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
