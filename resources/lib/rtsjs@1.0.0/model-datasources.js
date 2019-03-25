
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

