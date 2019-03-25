
class ModelDataSource {
    constructor() {
    }
    pairsOfUnit(unit) {
        return {};
    }
    valuesOfUnit(unit) {
        return [];
    }
    datesOfUnit(unit) {
        return [];
    }
    get values() {
        return [];
    }
    get dates() {
        return [];
    }
    get units() {
        return [];
    }
}

class ModelDataSourceJson extends ModelDataSource {
    constructor() {
        super();
        this.__data = {}
    }
    pairsOfUnit(unit) {
        return this.__data[unit]
    }
    valuesOfUnit(unit) {
        return this.__data[unit].map((v) => v[1])
    }
    datesOfUnit(unit) {
        return this.__data[unit].map((v) => v[0])
    }
    get values() {
        return [].concat(...Object.values(this.__data)).map((v) => v[1]);
    }
    get dates() {
        return [].concat(...Object.values(this.__data)).map((v) => v[0]);
    }
    get units() {
        return Object.keys(this.__data);
    }
    closeIndexTo(date){
        const _units = this.units;
        let i = 0;
        for(; i < this.__data[_units[0]].length; i++){
            if(date <= this.__data[_units[0]][i][0]) break;
        }
        return i;
    }
    filter(start_date, end_date){
        let _d = {};
        Object.keys(this.__data).forEach((k) => {_d[k] = this.__data[k].filter((_v) => _v[0] <= end_date && _v[0] >= start_date)});
        this.__data = null;
        this.__data = _d;
    }
    clone(){
        let stormtropper = new ModelDataSourceJson();
        Object.keys(this.__data).forEach((k) => {
            stormtropper.__data[k] = this.__data[k].map((e) => [e[0], e[1]]);
        });
        return stormtropper;
    }
    from(array){
        console.log("ÄSDFG")
        console.log(array)
        if(!array.length)
            throw new Error("Data is not a valid table");
        let _d = {}
        for(let i = 0; i < array.length; i++){
            if(!array[i].length || array[i].length != 3){
                throw new Error("Data must have only three columns");
            }
            const name = array[i][0].trim().capitalize();
            const date_string = array[i][1].trim();
            const value_string = array[i][2].trim();
            let date, value;
            try {
                date = moment(date_string).toDate();
            } catch (e) {
                throw new Error(`${date_string} (in line ${i + 1}) is not a valid date. Please check it.`);
            }
            try {
                value = Number.parseFloat(value_string);
            } catch (e) {
                throw new Error(`${value_string} (in line ${i + 1}) is not a valid number. Please check it.`);
            }
            if(!(name in _d)){
                _d[name] = [];
            }
            _d[name].push([date, value]);
        }
        this.__data = _d;
    }
}

class ModelDataSourceTest extends ModelDataSourceJson {
    constructor() {
        super();
        this.__data = {
            "Unit1": [
                [new Date("8-Jan"), 65.4],
                [new Date("8-Feb"), 57.4],
                [new Date("8-Mar"), 69.3],
                [new Date("8-Apr"), 55.4],
                [new Date("8-May"), 76.9],
                [new Date("8-Jun"), 77.2],
                [new Date("8-Jul"), 69.6],
                [new Date("8-Aug"), 77.8],
                [new Date("8-Sep"), 68.5],
                [new Date("8-Oct"), 63.4],
                [new Date("8-Nov"), 68.1],
                [new Date("8-Dec"), 69.8],
            ],
            "Unit2": [
                [new Date("8-Jan"), 88],
                [new Date("8-Feb"), 70.1],
                [new Date("8-Mar"), 78.1],
                [new Date("8-Apr"), 78.9],
                [new Date("8-May"), 81.3],
                [new Date("8-Jun"), 75.6],
                [new Date("8-Jul"), 68.8],
                [new Date("8-Aug"), 65.2],
                [new Date("8-Sep"), 70.4],
                [new Date("8-Oct"), 80.4],
                [new Date("8-Nov"), 82.8],
                [new Date("8-Dec"), 74.7],
            ],
            "Unit3": [
                [new Date("8-Jan"), 65.4],
                [new Date("8-Feb"), 57.4],
                [new Date("8-Mar"), 69.3],
                [new Date("8-Apr"), 55.4],
                [new Date("8-May"), 76.9],
                [new Date("8-Jun"), 77.2],
                [new Date("8-Jul"), 69.6],
                [new Date("8-Aug"), 77.8],
                [new Date("8-Sep"), 68.5],
                [new Date("8-Oct"), 63.4],
                [new Date("8-Nov"), 68.1],
                [new Date("8-Dec"), 69.8],
            ],
            "Unit4": [
                [new Date("8-Jan"), 88],
                [new Date("8-Feb"), 70.1],
                [new Date("8-Mar"), 78.1],
                [new Date("8-Apr"), 78.9],
                [new Date("8-May"), 81.3],
                [new Date("8-Jun"), 75.6],
                [new Date("8-Jul"), 68.8],
                [new Date("8-Aug"), 65.2],
                [new Date("8-Sep"), 70.4],
                [new Date("8-Oct"), 80.4],
                [new Date("8-Nov"), 82.8],
                [new Date("8-Dec"), 74.7],
            ],
        }
    }
}

class ModelDataSourceLargeTest extends ModelDataSourceJson {
    constructor() {
        super();
        this.__data = require("./medium-dataset.js").data;
    }
}

exports.ModelDataSource = ModelDataSource;
exports.ModelDataSourceJson = ModelDataSourceJson;
exports.ModelDataSourceTest = ModelDataSourceTest;
exports.ModelDataSourceLargeTest = ModelDataSourceLargeTest;

