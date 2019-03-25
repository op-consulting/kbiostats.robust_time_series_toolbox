
class DataSource{
    constructor(){

    }
}

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
        "hospital_number", 
        "hospital_name", 
        "theoretical_executive_time_point",
        "candidate_before_tet",
        "candidate_after_tet",
        "candidate_after_tet",
        "start_month",
        "start_year",
        "history"
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
        this.__hospital_number = null;
        this.__create_events('hospital_number');
        this.__hospital_name = null;
        this.__create_events('hospital_name');
        this.__theoretical_executive_time_point = null;
        this.__create_events('theoretical_executive_time_point');
        this.__candidate_before_tet = null;
        this.__create_events('candidate_before_tet');
        this.__candidate_after_tet = null;
        this.__create_events('candidate_after_tet');
        this.__candidate_after_tet = null;
        this.__create_events('candidate_after_tet');
        this.__start_month = null;
        this.__create_events('start_month');
        this.__start_year = null;
        this.__create_events('start_year');
        this.__history = null;
        this.__create_events('history');
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
    get hospital_number(){
        this.raise('hospital_number', 'get', []);
        return this.__hospital_number;
    }
    get hospital_name(){
        this.raise('hospital_name', 'get', []);
        return this.__hospital_name;
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
    get start_month(){
        this.raise('start_month', 'get', []);
        return this.__start_month;
    }
    get start_year(){
        this.raise('start_year', 'get', []);
        return this.__start_year;
    }
    get history(){
        this.raise('history', 'get', []);
        return this.__history;
    }
    set hospital_number(value){
        let old_value = this.__hospital_number;
        this.__hospital_number = value;
        this.raise('hospital_number', 'set', [old_value, value]);
    }
    set hospital_name(value){
        let old_value = this.__hospital_name;
        this.__hospital_name = value;
        this.raise('hospital_name', 'set', [old_value, value]);
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
    set start_month(value){
        let old_value = this.__start_month;
        this.__start_month = value;
        this.raise('start_month', 'set', [old_value, value]);
    }
    set start_year(value){
        let old_value = this.__start_year;
        this.__start_year = value;
        this.raise('start_year', 'set', [old_value, value]);
    }
    set history(value){
        let old_value = this.__history;
        this.__history = value;
        this.raise('history', 'set', [old_value, value]);
    }
}



class VisualModelConnector{
    constructor(data_model, graphical_component){
        this.data_model = data_model;
        this.graphical_component = graphical_component;
    }
    showValuesPerDate(unit){}
}

Date.prototype.toPersonalizedString = function(){
    return `${("0" + this.getDate()).slice(-2)}/${("0" + (1 + this.getMonth())).slice(-2)}/${this.getYear()}`
}

class ApexVisualModelConnector extends VisualModelConnector{
    constructor(data_model, graphical_component){
        super(data_model, graphical_component);
    }

    showValuesPerDate(unit_name){
        if(typeof unit_name == "undefined"){
            unit_name = this.data_model.parameters.hospital_name;
        }
        this.graphical_component.updateSeries([{
            name: unit_name,
            data: this.data_model.data_source.pairsOfUnit(unit_name).map(v => {return {
                "x": v[0].getTime(),
                "y": v[1],
            };})
          }], true)
    }

    showLoglikelihood(){
        let unit_name = this.data_model.parameters.hospital_name;
        let logLikelihoodInfo = this.data_model.logLikelihoodInfo;
        console.log(this.data_model.logLikelihoodInfo); window.logLikelihoodInfo = logLikelihoodInfo
        let data = [];
        let dates = this.data_model.data_source.dates;
        let time_index = logLikelihoodInfo.time_index.tolist();
        let loglikelihood = logLikelihoodInfo.loglikelihood.tolist();
        for (let i = 0; i < time_index.length; i++) {
            const t = dates[time_index[i]];
            const LL = loglikelihood[i];
            data.push({
                x: t.getTime(),
                y: Math.round(LL * 100) / 100,
            });
        }
        this.graphical_component.updateSeries([{
            name: unit_name,
            type: "area",
            data: data
          }], true);
        this.showMaximumLikelihoodPoint();
    }

    showAdjustedChangePointLines(){
        let unit_name = this.data_model.parameters.hospital_name;
        let values_estimated = this.data_model.logLikelihoodInfo.values_estimated.tolist();
        let series = JSON.parse(JSON.stringify(this.graphical_component.annotations.w.config.series))
        series.push({
            name: unit_name + " (adjusted)",
            type: "area",
            data: this.data_model.data_source.pairsOfUnit(unit_name).map((v, i) => {return {
                "x": v[0].getTime(),
                "y": Math.round(values_estimated[i] * 100) / 100,
            };})
          });
        this.graphical_component.updateSeries(series, !true)
    }

    showMaximumLikelihoodPoint(){
        let dates = this.data_model.data_source.dates;
        let date_point = dates[this.data_model.logLikelihoodInfo.max_time];
        let xaxis_annotations = JSON.parse(JSON.stringify(this.graphical_component.annotations.w.config.annotations.xaxis))
        xaxis_annotations.push({
            x: date_point.getTime(),
            borderColor: '#999',
            yAxisIndex: 0,
            label: {
              show: true,
              text: 'Maximum LL',
              style: {
                color: "#fff",
                background: '#775DD0'
              }
            }
          })
        this.graphical_component.updateOptions({
            annotations: {
                xaxis: xaxis_annotations
              },
        })
    }
    
    showTheoreticalExecutivePoint(){
        let xaxis_annotations = JSON.parse(JSON.stringify(this.graphical_component.annotations.w.config.annotations.xaxis))
        xaxis_annotations.push({
            x: this.data_model.data_source.dates[this.data_model.parameters.theoretical_executive_time_point].getTime(),
            borderColor: '#999',
            yAxisIndex: 0,
            label: {
              show: true,
              text: 'Theoretical Executive Time',
              style: {
                color: "#fff",
                background: '#775DD0'
              }
            }
          })
        this.graphical_component.updateOptions({
            annotations: {
                xaxis: xaxis_annotations
              },
        })
    }

    showHistogramResiduals(type){
        type = type.toLowerCase();
        let name = null;
        let residuals = null;
        if(type == "before"){
            name = "Residuals before the intervention";
            residuals = this.data_model.logLikelihoodInfo.linear_reg_before_max.residuals;
        }else{
            name = "Residuals after the intervention";
            residuals = this.data_model.logLikelihoodInfo.linear_reg_after_max.residuals;
        }
        let bins = 10;
        let {x_histogram, y_histogram} = Stats.histogram(residuals, Math.min(bins, residuals.shape[0]))
        x_histogram = x_histogram.tolist();
        y_histogram = y_histogram.tolist();
        let data = []
        for (let i = 0; i < x_histogram.length; i++) {
            /*data.push({
                x: x_histogram[i],
                y: y_histogram[i],
            }) */
            data.push([
                x_histogram[i],
                y_histogram[i],
            ])
        }
        this.graphical_component.updateSeries([{
            name: name,
            type: 'area',
            data: data,
          }
        ], true)
        this.graphical_component.updateOptions({
          chart: {
            type: "bar"
          },
          xaxis: {
            type: 'numeric',
            //tickAmount: 6,
            min: np.min(x_histogram) - 0.15 * (np.max(x_histogram) - np.min(x_histogram)),
            max: np.max(x_histogram) + 0.15 * (np.max(x_histogram) - np.min(x_histogram)),
          },
          dataLabels: {
            enabled: true,
            style: {
              //colors: ['red'],
            },
            offsetX: 5,
            offsetY: -20,
          },
        })
    }

    showACFResiduals(type){
        type = type.toLowerCase();
        let name = null;
        let residuals = null;
        if(type == "before"){
            name = "Residuals before the intervention";
            residuals = this.data_model.logLikelihoodInfo.linear_reg_before_max.residuals;
        }else{
            name = "Residuals after the intervention";
            residuals = this.data_model.logLikelihoodInfo.linear_reg_after_max.residuals;
        }
        let bins = 10;
        let acf = Stats.autocorrelationFunction(residuals, 0, 50).tolist();
        let data = []
        for (let i = 0; i < acf.length; i++) {
            data.push([
                i,
                Math.round(acf[i] * 100)/100,
            ])
        }
        this.graphical_component.updateSeries([{
            name: name,
            type: 'bar',
            data: data,
          }
        ], true)
        
        this._showConfidenceIntervalsACF(acf);
        let y_acf_ci = 1.96 * Math.sqrt(1/acf.length);

        this.graphical_component.updateOptions({
            chart: {
              type: "bar"
            },
          xaxis: {
            type: 'numeric',
            //tickAmount: 6,
            min: -0.5,
            max: acf.length,
          },
          yaxis: {
              min: Math.min(-y_acf_ci, np.min(acf)) - 0.2,
              max: Math.max(y_acf_ci, np.max(acf)) + 0.2,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: 'rounded',
              columnWidth: '5%',
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: true,
            style: {
              //colors: ['red'],
            },
            offsetX: 5,
            offsetY: -20,
          },
        })

        /*
        Plot confidence intervals for 95%:
        1.96 * Math.sqrt(acf.length)
        */
    }

    _showConfidenceIntervalsACF(acf){
        let yaxis_annotations = JSON.parse(JSON.stringify(this.graphical_component.annotations.w.config.annotations.yaxis))
        let y_positive = 1.96 * Math.sqrt(1/acf.length);
        let y_negative = -1.96 * Math.sqrt(1/acf.length);
        console.log(y_negative)
        yaxis_annotations.push({
            y: y_positive,
            borderColor: '#999',
            xAxisIndex: 0,
            label: {
              show: true,
              text: 'Confidence interval band: ' + Math.round(y_positive * 100)/100,
              style: {
                color: "#fff",
                background: '#775DD0'
              }
            }
          })
        yaxis_annotations.push({
            y: y_negative,
            borderColor: '#999',
            xAxisIndex: 0,
            label: {
              show: true,
              text: 'Confidence interval band: ' + Math.round(y_negative * 100)/100,
              style: {
                color: "#fff",
                background: '#775DD0'
              }
            }
          })
        this.graphical_component.updateOptions({
            annotations: {
                yaxis: yaxis_annotations
            },
        })
    }

}
/*
Usar algo impactante como
https://apexcharts.com/javascript-chart-demos/sparklines/basic/
*/

class ModelDataSource{
    constructor(){
    }
    get values(){
        return [];
    }
    get dates(){
        return [];
    }
    get units(){
        return [];
    }
}

class ModelDataSourceTest extends ModelDataSource{
    constructor(){
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
            ], "Unit2": [
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
            ]
        }
    }
    pairsOfUnit(unit){
        return this.__data[unit]
    }
    valuesOfUnit(unit){
        return this.__data[unit].map((v) => v[1])
    }
    datesOfUnit(unit){
        return this.__data[unit].map((v) => v[0])
    }
    get values(){
        return [].concat(...Object.values(this.__data)).map((v) => v[1]);
    }
    get dates(){
        return [].concat(...Object.values(this.__data)).map((v) => v[0]);
    }
    get units(){
        return Object.keys(this.__data);
    }
}

/*
pyodide.loadPackage('numpy')
pyodide.runPython('import numpy as np;');
pyodide.runPython(`
class RobustInterruptedTS:
    def __init__(self):
        pass

#import numpy as np
#unit_all = np.unique(data[:, 2])
#subdata = data[unit_all, 2]
`);
let np = pyodide.pyimport("np")
*/

class Stats{
    static autocorrelationAtLag(y, lag){
        let y_avg = y.mean();
        let n = y.shape[0];
        let acf2 = y.slice([lag, n]).subtract(y_avg).multiply(
            y.slice([0, n - lag]).subtract(y_avg)
        ).mean() / Math.sqrt(
            y.subtract(y_avg).pow(2).mean() * 
            y.slice([0, n - lag]).subtract(y_avg).pow(2).mean()
        );

        //let res_1 = y.slice([lag, n]).subtract(y.slice([lag, n]).mean());
        //let res_2 = y.slice([0, n - lag]).subtract(y.slice([0, n - lag]).mean());
        //let acf = res_1.multiply(res_2).mean() / Math.sqrt(
        //    res_1.pow(2).mean() * res_2.pow(2).mean()
        //);
        return acf2;
    }
    
    static autocorrelationFunction(y, lag_0, lag_1){
        lag_0 = Math.max(0, lag_0);
        lag_1 = Math.min(lag_1, y.shape[0] - 1);
        let acf = np.zeros(lag_1 - lag_0 + 1);
        for (let k = lag_0; k <= lag_1; k++) {
            acf.set(k, Stats.autocorrelationAtLag(y, k));
        }
        return acf;
    }

    static histogram(y, bins){
        let x_histogram = np.arange(bins).add(0.5).multiply((1e-10 + y.max() - y.min())/(bins));
        let y_histogram = np.round(y.subtract(y.min()).multiply((bins - 1) / (1e-10 + y.max() - y.min())));
        return {x_histogram, y_histogram}
    }
    
    static linearRegression(y, x){
        let n = y.shape[0];
        if(typeof x == "undefined"){ x = np.arange(n); }
        let x_avg = x.mean();
        let y_avg = y.mean();
        
        //Slow, but easy to debug
        let slope = y.subtract(y_avg).multiply(x.subtract(x_avg)).sum() / x.subtract(x_avg).pow(2).sum();
        let intercept = y_avg - slope * x_avg;
        
        let y_est = x.multiply(slope).add(intercept);
        let R = y.subtract(y_est);
        let sse = R.pow(2).sum();
        let sigma2_ols = sse/(n - 2);
        //Variance estimation considering an AR(1) process. Pag. 15-16
        let phi = R.slice([1, n]).subtract(R.slice([1, n]).mean()).multiply(
            R.slice([0, n - 1]).subtract(R.slice([0, n - 1]).mean())
        ).sum() / R.slice([1, n]).subtract(R.slice([1, n]).mean()).pow(2).sum();
        let W = R.subtract(np.concatenate([[0], R.slice([0, n-1])]).multiply(phi));
        // W was not defined for t == 0:
        //  let sigma2 = W.slice([1, n]).subtract(W.slice([1, n-1]).mean()).subtract(
        //      W.slice([0, n-1]).subtract(W.slice([0, n-2]).mean()).multiply(phi)
        //  ).pow(2).mean();
        let sigma2 = W.slice([2, n]).subtract(W.slice([2, n-1]).mean()).subtract(
            W.slice([1, n-1]).subtract(W.slice([1, n-2]).mean()).multiply(phi)
        ).pow(2).sum() / (n - 2);
        //let acf = Stats.autocorrelationFunction(y, 0, 10);
        //let acf_R = Stats.autocorrelationFunction(R, 0, 10);
        //let acf_W = Stats.autocorrelationFunction(W, 0, 10);
        // Uncertainty measurements
        let sum_x2 = x.multiply(x).sum();
        let sum_x = x.sum();
        let var_intercept = sigma2_ols * sum_x2 / (n * sum_x2 - sum_x * sum_x);
        let var_slope = sigma2_ols * n / (n * sum_x2 - sum_x * sum_x);
        //https://stats.stackexchange.com/questions/180741/how-to-understand-t-value-in-rs-lm
        let t_score_intercept = intercept / Math.sqrt(var_intercept);
        let t_score_slope = slope / Math.sqrt(var_slope);
        let p_score_intercept = 2 - 2 * st.studentt.cdf(Math.abs(t_score_intercept), n-2);
        let p_score_slope = 2 - 2 * st.studentt.cdf(Math.abs(t_score_slope), n-2);
        // Just for legibility
        let residuals = R;
        let residuals_of_residuals = W;
        return {slope, intercept, sigma2_ols, sigma2, residuals, residuals_of_residuals, phi, t_score_intercept, p_score_intercept, var_intercept, t_score_slope, p_score_slope, var_slope};
    }

    static differenceBetweenParameters(linearRegressionBefore, linearRegressionAfter){
        let parameters = ["slope", "intercept"]
        let results = {}
        for (let k = 0; k < parameters.length; k++) {
            const parameter = parameters[k];
            const estimate_a = linearRegressionBefore[parameter];
            const estimate_b = linearRegressionAfter[parameter];
            const var_estimate_a = linearRegressionBefore["var_" + parameter];
            const var_estimate_b = linearRegressionAfter["var_" + parameter];
            const n_a = linearRegressionBefore["residuals"].shape[0];
            const n_b = linearRegressionAfter["residuals"].shape[0];
            let difference = estimate_b - estimate_a;
            let var_difference = var_estimate_a + var_estimate_b;
            let df = n_a + n_b - 4;
            results["estimate_" + parameter] = difference;
            results["var_" + parameter] = var_difference;
            results["CI_upper_bound_" + parameter] = difference + Math.sqrt(var_difference) * st.studentt.inv(0.975, df);
            results["CI_lower_bound_" + parameter] = difference - Math.sqrt(var_difference) * st.studentt.inv(0.975, df);
        }
        //(-1.49-.28)+ sqrt(.88*.88+.6*.6) * qt(0.975, 2*n-4)
        return results;
    }
}

class Model{
    constructor(parameters, data_source){
        this.parameters = parameters
        this.data_source = data_source
        this.__loglikelihood_info = null;
    }

    get logLikelihoodInfo(){
        if(this.__loglikelihood_info == null){
            this.__loglikelihood_info = this.calculateLogLikelihoodInfo();
        }
        return this.__loglikelihood_info;
    }

    calculateLogLikelihoodInfo(){
        // Nomenclature in the paper: pag 7
        let Y = np.array(this.data_source.valuesOfUnit(this.parameters.hospital_name));
        let T = Y.shape[0];
        let t_star = this.parameters.theoretical_executive_time_point;
        let m = this.parameters.candidate_before_tet;
        let k = this.parameters.candidate_after_tet;
        let linear_reg_before = Stats.linearRegression(Y.slice([0, t_star]))
        let beta_1=linear_reg_before.slope, beta_0=linear_reg_before.intercept, sigma2_1=linear_reg_before.sigma2;
        let linear_reg_after = Stats.linearRegression(Y.slice([t_star, T]), np.arange(t_star, T))
        let beta_1_B=linear_reg_after.slope, beta_0_B=linear_reg_after.intercept, sigma2_2=linear_reg_after.sigma2;
        let delta = beta_1_B - beta_1;
        let epsilon = beta_0_B - beta_0;
        //
        //let L = np.zeros(m + k + 1).tolist();
        let LL = np.zeros(m + k + 1).tolist();
        let t_L = np.arange(t_star - m, t_star + k + 1);
        //
        let LL_max = -1e100, q_max = null;
        for (let q = t_star - m; q < t_star + k + 1; q++) {
            let i = q - t_star + m;
            let t_1 = np.arange(0, q);
            let t_2 = np.arange(q, T);
            //L[i] = (Math.pow(2 * Math.PI * sigma2_1, - 0.5 * q + 0.5)
            //       * np.exp( - Y.slice([0, q]).subtract(t_1.multiply(beta_1).add(beta_0)).pow(2).sum() / (2 * sigma2_1) )
            //       * Math.pow(2 * Math.PI * sigma2_2, -0.5 * T + 0.5 * q - 0.5)
            //       * np.exp( - Y.slice([q, T]).subtract(t_2.multiply(beta_1_B).add(beta_0_B)).pow(2).sum() / (2 * sigma2_2) ));
            LL[i] = ( (- 0.5 * q + 0.5) * Math.log(2 * Math.PI * sigma2_1)
                   + ( - Y.slice([0, q]).subtract(t_1.multiply(beta_1).add(beta_0)).pow(2).sum() / (2 * sigma2_1) )
                   + (-0.5 * T + 0.5 * q - 0.5) * Math.log(2 * Math.PI * sigma2_2)
                   + ( - Y.slice([q, T]).subtract(t_2.multiply(beta_1_B).add(beta_0_B)).pow(2).sum() / (2 * sigma2_2) ));
            if(LL[i] >= LL_max){
                LL_max = LL[i];
                q_max = q;
            }
        }
        LL = np.array(LL);
        let {Y_est, linear_reg_before_max, linear_reg_after_max, linear_reg_differences} = this.createRegressionLinesAfterChange(q_max);
        return {
            time_index: t_L,
            loglikelihood: LL,
            max_time: q_max,
            max_index_in_LL: q_max - t_star + m,
            linear_reg_before_max: linear_reg_before_max,
            linear_reg_after_max: linear_reg_after_max,
            linear_reg_differences: linear_reg_differences,
            values_estimated: Y_est,
        };
    }

    createRegressionLinesAfterChange(q_max){
        let Y = np.array(this.data_source.valuesOfUnit(this.parameters.hospital_name));
        let T = Y.shape[0];
        let t_bef_max = np.arange(0, q_max);
        let t_aft_max = np.arange(q_max, T);
        let linear_reg_before_max = Stats.linearRegression(Y.slice([0, q_max]), t_bef_max);
        let linear_reg_after_max = Stats.linearRegression(Y.slice([q_max, T]), t_aft_max);
        let Y_est = np.concatenate([
            t_bef_max.multiply(linear_reg_before_max.slope).add(linear_reg_before_max.intercept),
            t_aft_max.multiply(linear_reg_after_max.slope).add(linear_reg_after_max.intercept),
        ]);
        let linear_reg_differences = Stats.differenceBetweenParameters(linear_reg_before_max, linear_reg_after_max);
        return {Y_est, linear_reg_before_max, linear_reg_after_max, linear_reg_differences};
    }

}


exports.ApexVisualModelConnector = ApexVisualModelConnector;
exports.ModelDataSource = ModelDataSource;
exports.ModelDataSourceTest = ModelDataSourceTest;
exports.ModelParameters = ModelParameters;
exports.Model = Model;
exports.Stats = Stats;
