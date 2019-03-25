class CallbackEvent{
    constructor(){
        this.__callers = []
    }
    add(caller){
        this.__callers.push(caller)
    }
    call(){
        for (let i = 0; i < this.__callers.length; i++) {
            this.__callers[i](...arguments)
        }
    }
}


/*
// Meta-generator for RITSParameters
{
    let parameters = [
        //"hospital_number", 
        //"hospital_name", 
        "theoretical_executive_time_point",
        "candidate_before_tet",
        "candidate_after_tet",
        "candidate_after_tet",
        //"start_month",
        //"start_year",
        //"history"
    ];
    let constructors = ""
    let getters = ""
    let setters = ""
    parameters.forEach(parameter => {
        constructors += `        this.__${parameter} = null;\n`;
        constructors += `        this.__create_events('${parameter}');\n`;
        getters += `    get ${parameter}(){\n`;
        getters += `        this.raise('${parameter}', 'get', []);\n`;
        getters += `        return this.__${parameter};\n`;
        getters += `    }\n`;
        setters += `    set ${parameter}(value){\n`;
        setters += `        let old_value = this.__${parameter};\n`;
        setters += `        this.__${parameter} = value;\n`;
        setters += `        this.raise('${parameter}', 'set', [old_value, value]);\n`;
        setters += `    }\n`;
    });
    let code = "class ModelParameters{\n    constructor(){\n";
    code += "        this.__events = {};\n";
    code += constructors;
    code += "    }\n";
    code += "    __create_events(name){\n";
    code += "        this.__events[name] = {};\n";
    code += "        this.__events[name]['get'] = new CallbackEvent();\n";
    code += "        this.__events[name]['set'] = new CallbackEvent();\n";
    code += "    }\n";
    code += "    on(name, event, callback){\n";
    code += "        this.__events[name][event].add(callback,);\n";
    code += "    }\n";
    code += "    raise(name, event, args){\n";
    code += "        this.__events[name][event].call(...args);\n";
    code += "    }\n";
    code += getters;
    code += setters;
    code += "}\n";
    console.log(code);
}
*/

class ModelParameters{
    constructor(){
        this.__events = {};
        this.__theoretical_executive_time_point = null;
        this.__create_events('theoretical_executive_time_point');
        this.__candidate_before_tet = null;
        this.__create_events('candidate_before_tet');
        this.__candidate_after_tet = null;
        this.__create_events('candidate_after_tet');
        this.__candidate_after_tet = null;
        this.__create_events('candidate_after_tet');
    }
    __create_events(name){
        this.__events[name] = {};
        this.__events[name]['get'] = new CallbackEvent();
        this.__events[name]['set'] = new CallbackEvent();
    }
    on(name, event, callback){
        this.__events[name][event].add(callback,);
    }
    raise(name, event, args){
        this.__events[name][event].call(...args);
    }
    get theoretical_executive_time_point(){
        this.raise('theoretical_executive_time_point', 'get', []);
        return this.__theoretical_executive_time_point;
    }
    get candidate_before_tet(){
        this.raise('candidate_before_tet', 'get', []);
        return this.__candidate_before_tet;
    }
    get candidate_after_tet(){
        this.raise('candidate_after_tet', 'get', []);
        return this.__candidate_after_tet;
    }
    get candidate_after_tet(){
        this.raise('candidate_after_tet', 'get', []);
        return this.__candidate_after_tet;
    }
    set theoretical_executive_time_point(value){
        let old_value = this.__theoretical_executive_time_point;
        this.__theoretical_executive_time_point = value;
        this.raise('theoretical_executive_time_point', 'set', [old_value, value]);
    }
    set candidate_before_tet(value){
        let old_value = this.__candidate_before_tet;
        this.__candidate_before_tet = value;
        this.raise('candidate_before_tet', 'set', [old_value, value]);
    }
    set candidate_after_tet(value){
        let old_value = this.__candidate_after_tet;
        this.__candidate_after_tet = value;
        this.raise('candidate_after_tet', 'set', [old_value, value]);
    }
    set candidate_after_tet(value){
        let old_value = this.__candidate_after_tet;
        this.__candidate_after_tet = value;
        this.raise('candidate_after_tet', 'set', [old_value, value]);
    }
}


exports.CallbackEvent = CallbackEvent;
exports.ModelParameters = ModelParameters;
