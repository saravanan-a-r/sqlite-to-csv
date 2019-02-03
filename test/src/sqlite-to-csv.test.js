const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sqlite3 = require("sqlite3");

const ToCsv = new require('../../src/sqlite-to-csv');

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

        it('should resolve with code 200');
    });

    context('ToCsv.readTable()', () => {

        it('should resolve with table rows', async () => {
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

    });

    context('ToCsv.writeTableToCsv()', () => {
        
        it('should resolve with code 200');
    });

    context('ToCsv.writeLog()', () => {

        it('should write log');
    });

    context('ToCsv.parseObj()', () => {

        it('should stringify the given JSON object', () => {
            let jsonObj = {
                key : 'value'
            };
            let result = toCsv.parseObj(jsonObj);
            expect(JSON.stringify(jsonObj)).to.equal(result);
        });

        it('should return the input string as it is', () => {
            let inputStr = "value_message";
            let result = toCsv.parseObj(inputStr);
            expect(inputStr).to.equal(result);
        });
    });
});