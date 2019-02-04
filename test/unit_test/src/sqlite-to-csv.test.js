const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sqlite3 = require("sqlite3");

const ToCsv = new require('../../../src/sqlite-to-csv');

describe('sqlite-to-csv', () => {
    let className, toCsv;

    beforeEach('Setting variable', () => {
       className = 'ToCsv';
       toCsv = new ToCsv();
    });

    afterEach('Clearing the variable', () => {
        className = undefined;
        toCsv = undefined;
    });

    context('ToCsv.setFilePath()', () => {

        it('should return ToCsv instance', () => {
            let result  = toCsv.setFilePath('some_path');
            expect(result.constructor.name).to.equal(className);
        });
    });

    context('ToCsv.setOutputPath()', () => {

        it('should return ToCsv instance', () => {
            let result = toCsv.setOutputPath('some_path');
            expect(result.constructor.name).to.equal(className);
        });
    });

    context('ToCsv.setLogPath()', () => {

        it('should return ToCsv instance', () => {
            let result = toCsv.setLogPath('some_path');
            expect(result.constructor.name).to.equal(className);
        });
    });

    context('ToCsv.convert()', () => {
        let sandbox, db;

        beforeEach('Creating sandbox environment', () => {
            sandbox = sinon.createSandbox();
            db = new sqlite3.Database(':memory');
        });

        afterEach('Clean up the sandbox environment', () => {
            sandbox.restore();
            db = null;
        });

        it('Should resolve with code 200. No error arise', async () => {
            toCsv.filePath = 'filepath';
            toCsv.outputPath = 'filepath';
            let fs = require('fs');
            let sqlite = require('sqlite3');
       
            sandbox.stub(fs, 'existsSync').callsFake( (path) => {
                return true;
            });

            sandbox.stub(sqlite, 'Database').callsFake( (path, mode, callback) => {
                callback(null);
                return db;
            });

            sandbox.stub(db, 'serialize').callsFake( (callback) => {
                callback();
            });

            sandbox.stub(db, 'all').callsFake( (query, params, callback) => {
                callback(null, [{}]);
            });

            let result = await toCsv.convert();
            let expectedResult = {
                code : 200,
                message : 'success'
            };
            expect(result).to.deep.equal(expectedResult);
        });

        it('Should throw error with code ERR102. The given toCsv.filePath params is undefined', async () => {
            toCsv.filePath = undefined;
            toCsv.outputPath = 'somepath';
            let actualErr, result;
            let expectedErr = "ERR102 :: filePath params missing in first argument of toCSV()";

            sandbox.stub(toCsv, 'writeLog').callsFake( () => {});

            [actualErr, result] = await parsePromise(toCsv.convert());
            expect(toCsv.writeLog.calledOnce).to.be.true;
            expect(actualErr).to.not.equal(null);
            expect(actualErr).to.not.equal(undefined);
            expect(actualErr).to.be.equal(expectedErr);
        });

        it('Should throw error with code ERR103. The given toCsv.outputPath params is undefined', async () => {
            toCsv.filePath = 'somepath';
            toCsv.outputPath = undefined;
            let actualErr, result;
            let expectedErr = "ERR103 :: outputPath params missing in first argument of toCSV()";

            sandbox.stub(toCsv, 'writeLog').callsFake( () => {});

            [actualErr, result] = await parsePromise(toCsv.convert());
            expect(toCsv.writeLog.calledOnce).to.be.true;
            expect(actualErr).to.not.equal(null);
            expect(actualErr).to.not.equal(undefined);
            expect(actualErr).to.be.equal(expectedErr);
        });

        it('Should throw error with code ERR100. The given toCsv.filePath params is not a valid path', async () => {
            toCsv.filePath = 'somepath';
            toCsv.outputPath = 'somepath';
            let fs = require('fs');

            let actualErr, result;
            let expectedErr = "ERR100 :: " + toCsv.filePath + "not found";

            sandbox.stub(fs, 'existsSync').callsFake( () => {
                return false;
            });

            sandbox.stub(toCsv, 'writeLog').callsFake( () => {});

            [actualErr, result] = await parsePromise(toCsv.convert());
            expect(toCsv.writeLog.calledOnce).to.be.true;
            expect(actualErr).to.not.equal(null);
            expect(actualErr).to.be.equal(expectedErr);
        });

        it('If toCsv.outputPath is not valid, the default csv folder will be created', async () => {
            toCsv.filePath = 'someFilePath';
            toCsv.outputPath = 'someOutputPath';
            let fs = require('fs');
            let sqlite = require('sqlite3');

            sandbox.stub(fs, 'existsSync').callsFake( (path) => {
                if(path === toCsv.filePath) {
                    return true;
                }
                return false;
            });

            sandbox.stub(toCsv, 'writeLog').callsFake( () => {});

            sandbox.stub(fs, 'mkdirSync').callsFake( () => {});

            sandbox.stub(sqlite, 'Database').callsFake( (path, mode, callback) => {
                callback(null);
                return db;
            });

            sandbox.stub(db, 'serialize').callsFake( (callback) => {
                callback();
            });

            sandbox.stub(db, 'all').callsFake( (query, params, callback) => {
                callback(null, [{}]);
            });

            let result = await toCsv.convert();
            let expectedResult = {
                code : 200,
                message : 'success'
            };
            expect(toCsv.writeLog.calledOnce).to.be.true;
            expect(fs.mkdirSync.calledOnce).to.be.true;
            expect(toCsv.outputPath).to.be.equal("csv");
            expect(result).to.deep.equal(expectedResult);
        });
    });

    context('ToCsv.readTable()', () => {

        it('Should resolve with table rows. No error arise.', async () => {
            toCsv.db = new sqlite3.Database(':memory');
            let rows = [{
                key : 'value'   
            }];

            let stub = sinon.stub(toCsv.db, 'all').callsFake( (query, params, callback) => {
                callback(null, rows);
            });
            let result = await toCsv.readTable('tableName');
            expect(result).to.deep.equal(rows);
            stub.restore();
        });

        it('Should fail db.all() and reject with error.', async () => {
            toCsv.db = new sqlite3.Database(':memory');

            let stub = sinon.stub(toCsv.db, 'all').callsFake( (query, params, callback) => {
                callback("someError", null);
            });
            let result, err;
            [err, result] = await parsePromise(toCsv.readTable('tableName'));
            expect(err).to.not.equal(null);
            stub.restore();
        });

    });

    context('ToCsv.writeTableToCsv()', () => {
        let sandbox;

        beforeEach('Setting environment', () => {
            sandbox = sinon.createSandbox();
        });

        afterEach('Clean up the environment', () => {
            sandbox.restore();
        });

        it('Should resolve with code 200', async () => {

            let rows = [{
                key1 : 'value1'
            }, {
                key2 : 'value2'
            }];
            let fs = require('fs');

            sandbox.stub(fs, 'writeFile').callsFake( (path, data, encode, callback) => {
                callback(null);
            });

            let result = await toCsv.writeTableToCsv(rows, 'somepath', 'somepath');
            let expectedResult = {
                code : 200,
                message : 'Write operation success'
            };
            expect(result).to.deep.equal(expectedResult);
        });

        it('Should reject with err if fs.writeFile() operation fail', async () => {

            let rows = [{
                key1 : 'value1'
            }, {
                key2 : 'value2'
            }];
            let fs = require('fs');

            sandbox.stub(fs, 'writeFile').callsFake( (path, data, encode, callback) => {
                callback("error");
            });

            let result, err;
            [err, result] = await parsePromise(toCsv.writeTableToCsv(rows, 'somepath', 'somepath'));

            expect(err).to.not.equal(null);
        });
    });

    context('ToCsv.writeLog()', () => {
        let sandbox;

        beforeEach('Setting environment', () => {
            sandbox = sinon.createSandbox();
        });

        afterEach('Clean up the environment', () => {
            sandbox.restore();
        });

        it('should write log', () => {
            toCsv.logPath = 'somepath';
            let fs = require('fs');

            sandbox.stub(fs, 'appendFileSync').callsFake( (path, message) => {
                expect(path).to.equal('somepath');
                expect(message).to.equal('demo log');
            });

            toCsv.writeLog('demo log');
        });
    });

    context('ToCsv.parseObj()', () => {

        it('Should stringify the given JSON object', () => {
            let jsonObj = {
                key : 'value'
            };
            let result = toCsv.parseObj(jsonObj);
            expect(JSON.stringify(jsonObj)).to.equal(result);
        });

        it('Should return the input string as it is', () => {
            let inputStr = "value_message";
            let result = toCsv.parseObj(inputStr);
            expect(inputStr).to.equal(result);
        });
    });

    context('ToCsv.filterTblMeta()', () => {

        it('Should return table meta data. No error arise', () => {

            let tableMetaExpected = [{
                name : 'mytable'
            }];

            let inputParams = [{
                name : 'mytable',
                sql : 'CREATE TABLE mytable (dummy_id Text PRIMARY KEY, main_id Text, type INTEGER, name TEXT)'
            }];

            let result = toCsv.filterTblMeta(inputParams);
            expect(result).to.deep.equal(tableMetaExpected);
        });
    });
});

function parsePromise(promise) {
    return promise.then( (result) => {
        return [null, result];
    }).catch( (err) => {
        return [err, null];
    });
}