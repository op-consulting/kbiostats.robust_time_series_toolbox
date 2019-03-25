let {Stats} = require("./model-core");

class AbstractPlotter {
    constructor(model, element) {
        this.__model = model;
        this.__element = element;
        this.__chart = null;
    }
    get options() {
        return {}
    }
    update() {
        let options = this.options;
        this.__chart.updateOptions(options);
    }
    create() {
        if (this.__chart !== null) {
            this.update();
            return;
        }
        //TODO: Include event for changing options
        let options = this.options;
        if (Object.keys(options).length == 0) return;
        this.__chart = new ApexCharts(this.__element, options);
        this.__chart.render();
    }
}

class PlotTimeSeries extends AbstractPlotter {
    constructor(model, element) {
        super(model, element);
        this.title = "Time series (" + model.unit_name + ")";
    }

    get options() {
        let dates = this.__model.data_source.pairsOfUnit(this.__model.unit_name).map(v => [v[0].getTime(), v[1]]);
        let execute_date_point = this.__model.data_source.dates[this.__model.parameters.theoretical_executive_time_point];
        return {
            chart: {
                animations: {enabled: false,},
                type: 'area',
                height: "400px",
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            series: [{
                name: this.__model.unit_name,
                data: dates
            }],
            //labels: labels,
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },
            annotations: {
                xaxis: [{
                    x: execute_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Theoretical Executive Time',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    },
                }],
            },
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16pt',
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: "bold",
                },
            },
        };
    }
}

class PlotLikelihood extends AbstractPlotter {
    constructor(model, element) {
        super(model, element);
        this.title = "Log-likelihood at differente time points (" + model.unit_name + ")";
    }

    get options() {
        let unit_name = this.__model.parameters.hospital_name;
        let logLikelihoodInfo = this.__model.logLikelihoodInfo;
        let data = [];
        let dates = this.__model.data_source.dates;
        let time_index = this.__model.logLikelihoodInfo.time_index.tolist();
        let loglikelihood = this.__model.logLikelihoodInfo.loglikelihood.tolist();
        for (let i = 0; i < time_index.length; i++) {
            const t = dates[time_index[i]];
            const LL = loglikelihood[i];
            data.push({
                x: t.getTime(),
                y: Math.round(LL * 100) / 100,
            });
        }
        let execute_date_point = this.__model.data_source.dates[this.__model.parameters.theoretical_executive_time_point];
        let application_date_point = dates[this.__model.logLikelihoodInfo.max_time];

        return {
            chart: {
                animations: {enabled: false,},
                type: 'area',
                height: "400px",
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            series: [{
                name: this.__model.unit_name,
                data: data
            }],
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },
            annotations: {
                xaxis: [{
                    x: execute_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Theoretical Executive Time',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    },
                }, {
                    x: application_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Executive Application Time',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    },
                }],
            },
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16pt',
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: "bold",
                },
            },
        };
    }
}

class PlotTimeSeriesEstimation extends AbstractPlotter {
    constructor(model, element) {
        super(model, element);
        this.title = "Adjusted curves before and after TET (" + model.unit_name + ")";
    }

    get options() {
        let application_date_point = this.__model.data_source.dates[this.__model.logLikelihoodInfo.max_time];
        let execute_date_point = this.__model.data_source.dates[this.__model.parameters.theoretical_executive_time_point]
        let actual_dates = this.__model.data_source.pairsOfUnit(this.__model.unit_name).map(v => {
            return {
                "x": v[0].getTime(),
                "y": v[1],
            };
        });
        let values_estimated = this.__model.logLikelihoodInfo.values_estimated.tolist();
        let adjusted_dates = this.__model.data_source.pairsOfUnit(this.__model.unit_name).map((v, i) => {
            return {
                "x": v[0].getTime(),
                "y": Math.round(values_estimated[i] * 100) / 100,
            };
        });

        return {
            chart: {
                animations: {enabled: false,},
                type: 'line',
                stacked: false,
                height: "400px",
            },
            stroke: {
                width: [1, 2],
                curve: ['smooth', 'straight'],
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            plotOptions: {
            },
            series: [{
                name: 'Actual value',
                type: 'area',
                data: actual_dates,
            }, {
                name: 'Adjusted value',
                type: 'line',
                data: adjusted_dates,
            }],
            colors: ['#A5C351', '#E14A84'],
            fill: {
                opacity: [0.25, 1],
                //type: "gradient",
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [100, 100, 0, 100,]
                }
            },
            markers: {
                size: 0
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            legend: {
                labels: {
                    useSeriesColors: true
                },
                markers: {
                    customHTML: [
                        function () {
                            return ''
                        }, function () {
                            return ''
                        }, function () {
                            return ''
                        }
                    ]
                }
            },
            annotations: {
                xaxis: [{
                    x: execute_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Theoretical Executive Time',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    },
                }, {
                    x: application_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Executive Application Time',
                        style: {
                            color: "#fff",
                            background: '#E14A84'
                        }
                    },
                }],
            },
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16pt',
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: "bold",
                },
            },
        };
    }
}


class PlotSnapshootTimeSeries extends AbstractPlotter {
    constructor(model, element) {
        super(model, element);
    }
    get options() {
        let application_date_point = this.__model.data_source.dates[this.__model.logLikelihoodInfo.max_time];
        let execute_date_point = this.__model.data_source.dates[this.__model.parameters.theoretical_executive_time_point]
        let actual_dates = this.__model.data_source.pairsOfUnit(this.__model.unit_name).map(v => {
            return {
                "x": v[0].getTime(),
                "y": v[1],
            };
        });
        let values_estimated = this.__model.logLikelihoodInfo.values_estimated.tolist();
        let adjusted_dates = this.__model.data_source.pairsOfUnit(this.__model.unit_name).map((v, i) => {
            return {
                "x": v[0].getTime(),
                "y": Math.round(values_estimated[i] * 100) / 100,
            };
        });

        return {
            chart: {
                animations: {enabled: false,},
                type: 'line',
                stacked: false,
                height: "350px",
                toolbar: {
                    show: false,
                },
            },
            stroke: {
                width: [1, 2],
                curve: ['smooth', 'straight'],
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            plotOptions: {
            },
            series: [{
                name: 'Actual value',
                type: 'area',
                data: actual_dates,
            }, {
                name: 'Adjusted value',
                type: 'line',
                data: adjusted_dates,
            }],
            colors: ['#A5C351', '#E14A84'],
            fill: {
                opacity: [0.25, 1],
                //type: "gradient",
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [100, 100, 0, 100,]
                }
            },
            markers: {
                size: 0
            },
            xaxis: {
                type: 'datetime',
                show: false,
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            legend: {
                show: false,
                labels: {
                    useSeriesColors: true
                },
                markers: {
                    customHTML: [
                        function () {
                            return ''
                        }, function () {
                            return ''
                        }, function () {
                            return ''
                        }
                    ]
                }
            },
            annotations: {
                xaxis: [{
                    x: execute_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Theoretical Executive Time',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    },
                }, {
                    x: application_date_point.getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Executive Application Time',
                        style: {
                            color: "#fff",
                            background: '#E14A84'
                        }
                    },
                }],
            },
        };
    }
}

class PlotResidualsHistogram extends AbstractPlotter {
    constructor(moment, model, element) {
        super(model, element)
        this.__moment = moment.toLowerCase();
        this.title = "Histogram of residuals"
    }

    get options() {
        let name = null;
        let residuals = null;
        if (this.__moment == "before") {
            name = "Residuals before the intervention";
            residuals = this.__model.logLikelihoodInfo.linear_reg_before_max.residuals.estimates;
        } else {
            name = "Residuals after the intervention";
            residuals = this.__model.logLikelihoodInfo.linear_reg_after_max.residuals.estimates;
        }
        let bins = 30;
        bins = Math.min(bins, residuals.shape[0]);
        let histogram = Stats.histogram(residuals, bins);
        histogram.x = histogram.x.tolist();
        histogram.y = histogram.y.tolist();
        let data = []
        for (let i = 0; i < histogram.x.length; i++) {
            data.push([
                histogram.x[i],
                histogram.y[i],
            ])
        }
        return {
            chart: {
                animations: {enabled: false,},
                type: 'line',
                stacked: false,
                height: "400px",
            },
            dataLabels: {
                enabled: false, 
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            stroke: {
                width: [2, 0.1,],
                curve: ['straight', 'smooth', ],
            },
            plotOptions: {
            },
            series: [{
                name: 'Histogram of residuals',
                type: 'bar',
                data: data,
            }, {
                name: '',
                type: 'area',
                data: data,
            }],
            colors: ['#E14A84', '#E14A84'],
            fill: {
                opacity: [1, 0.15,],
                //type: "gradient",
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [100, 100, 0, 100,]
                }
            },
            markers: {
                size: 0,
            },
            xaxis: {
                type: 'numeric',
                min: np.min(histogram.x) - 0.5 * (histogram.x[1] - histogram.x[0]),
                max: np.max(histogram.x) + 0.5 * (histogram.x[1] - histogram.x[0]),
                tickAmount: bins,
            },
            yaxis: {
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            legend: {
                labels: {
                    useSeriesColors: !true,
                },
                markers: {
                    width: [12, 0],
                }
            },
            annotations: {},
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16pt',
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: "bold",
                },
            },
        };
    }
}

class PlotPreResidualsHistogram extends PlotResidualsHistogram {
    constructor(model, element) {
        super("before", model, element);
        this.title = "Histogram of residuals before TET (" + model.unit_name + ")"
    }
}

class PlotPostResidualsHistogram extends PlotResidualsHistogram {
    constructor(model, element) {
        super("after", model, element);
        this.title = "Histogram of residuals after TET (" + model.unit_name + ")"
    }
}

class PlotResidualsACF extends AbstractPlotter {
    constructor(moment, model, element) {
        super(model, element)
        this.__moment = moment;
        this.title = "ACF of residuals)"
    }

    get options() {
        let name = null;
        let residuals = null;
        if (this.__moment == "before") {
            name = "Residuals before the intervention";
            residuals = this.__model.logLikelihoodInfo.linear_reg_before_max.residuals.estimates;
        } else {
            name = "Residuals after the intervention";
            residuals = this.__model.logLikelihoodInfo.linear_reg_after_max.residuals.estimates;
        }
        let bins = 10;
        let acf = Stats.autocorrelationFunction(residuals, 0, 50).tolist();
        let data = []
        for (let i = 0; i < acf.length; i++) {
            data.push([
                i,
                Math.round(acf[i] * 100) / 100,
            ])
        }

        let y_acf_ci = 1.96 * Math.sqrt(1 / residuals.shape[0]);
        let y_max = Math.max(y_acf_ci, np.max(acf)) + 0.2;
        let y_min = Math.min(-y_acf_ci, np.min(acf)) - 0.2;
        
        return {
            chart: {
                animations: {enabled: false,},
                type: 'line',
                stacked: false,
                height: "400px",
            },
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            stroke: {
                width: [2, 0.1,],
                curve: ['straight', 'smooth', ],
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
            series: [{
                name: 'ACF of residuals',
                type: 'bar',
                data: data,
            }, {
                name: '',
                type: 'area',
                data: data,
            }],
            colors: ['#E14A84', '#E14A84'],
            fill: {
                opacity: [1, 0.15,],
                //type: "gradient",
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [100, 100, 0, 100,]
                }
            },
            markers: {
                size: 0
            },
            xaxis: {
                type: 'numeric',
                min: -1,
                max: np.max(acf.length),
                tickAmount: acf.length + 1,
            },
            yaxis: {
                min: y_min,
                max: y_max,
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            legend: {
                labels: {
                    useSeriesColors: !true
                },
                markers: {
                    width: [12, 0],
                }
            },
            annotations: {
                yaxis: [
                    {
                        y: y_acf_ci,
                        borderColor: '#999',
                        xAxisIndex: 0,
                        label: {
                            show: true,
                            text: 'Confidence interval band: ' + Math.round(y_acf_ci * 100) / 100,
                            style: {
                                color: "#fff",
                                background: '#775DD0'
                            }
                        }
                    }, {
                        y: -y_acf_ci,
                        borderColor: '#999',
                        xAxisIndex: 0,
                        label: {
                            show: true,
                            text: 'Confidence interval band: ' + Math.round(-y_acf_ci * 100) / 100,
                            style: {
                                color: "#fff",
                                background: '#775DD0'
                            }
                        }
                    }
                ]
            },
            title: {
                text: this.title,
                align: 'left',
                style: {
                    fontSize: '16pt',
                    fontFamily: 'Arial',
                    color: '#000000',
                    fontWeight: "bold",
                },
            },
        };
    }
}

class PlotPreResidualsACF extends PlotResidualsACF {
    constructor(model, element) {
        super("before", model, element);
        this.title = "Autocorrelation function of residuals before TET (" + model.unit_name + ")"
    }
}

class PlotPostResidualsACF extends PlotResidualsACF {
    constructor(model, element) {
        super("after", model, element);
        this.title = "Autocorrelation function of residuals after TET (" + model.unit_name + ")"
    }
}

// DEPRECATED
class UnitModelPlotter1 {
    constructor(model) {
        this.__model = model;
        this.__type_plot_list = {
            "time-series": PlotTimeSeries,
            "likelihood": PlotLikelihood,
            "time-series-estimation": PlotTimeSeriesEstimation,
            "pre-event-residuals-histogram": PlotPreResidualsHistogram,
            "pre-event-residuals-acf": PlotPreResidualsACF,
            "post-event-residuals-histogram": PlotPostResidualsHistogram,
            "post-event-residuals-acf": PlotPostResidualsACF,
        };
        this.__plots = [];
    }
    get plots() {
        return this.__plots;
    }
    link(type_plot, element) {
        type_plot = type_plot.toLowerCase();
        if (!(type_plot in this.__type_plot_list)) {
            console.error(type_plot, "is not a valid type plot");
        }
        let plotter = new (this.__type_plot_list[type_plot])(this.__model, element);
        plotter.create();
        this.__plots[type_plot] = plotter;
        return this;
    }
    make_links() {
        console.log(" **", arguments)
        for (let i = 0; i < arguments.length; i += 2) {
            const type = arguments[i];
            const querySelector = arguments[i + 1];
            console.log(" **", type, querySelector)
            this.link(type, document.querySelector(querySelector));
        }
        return this;
    }
    static options(type_plot, model) {
        let plotter = new UnitModelPlotter(model);
        type_plot = type_plot.toLowerCase();
        if (!(type_plot in plotter.__type_plot_list)) {
            console.error(type_plot, "is not a valid type plot");
        }
        let ClassPlotter = plotter.__type_plot_list[type_plot];
        return (new ClassPlotter(model, null)).options;
    }
}

class PlotCollector {
    constructor(element, models) {
        this.__element = element;
        this.__plots = {};
        this.models = models;
    }
    
    set models(models){
        this.__models = models;
        this.__struct_models = {};
        models.forEach(model => {
            this.__struct_models[model.unit_name] = model;
        });
    }
    get models(){
        return this.__models;
    }

    createChart(type_plot, unit_model){
        let component = document.createElement("div");
        component.classList.add("plot");
        component.classList.add(type_plot);
        component.classList.add(unit_model.unit_name);
        component.style.display = "block";
        this.__element.appendChild(component);
        let plotter = (new (PlotCollector.selectPlotter(type_plot))(unit_model, component));
        plotter.create();
        return {component, plotter};
    }

    getChart(type_plot, unit_model){
        if(!(type_plot in this.__plots)){
            this.__plots[type_plot] = {};
        }
        if(!(unit_model.unit_name in this.__plots[type_plot])){
            this.__plots[type_plot][unit_model.unit_name] = this.createChart(type_plot, unit_model);
        }else{
            this.__plots[type_plot][unit_model.unit_name].component.style.display = "block";
            this.__plots[type_plot][unit_model.unit_name].component.style.opacity = 0;
            setTimeout(() => {
                this.__plots[type_plot][unit_model.unit_name].component.style.opacity = 1;                
            }, 200);
            //window.dispatchEvent(new Event('resize'));
        }
    }

    hideAll(categories_except, unit_names_except){
        Object.keys(this.__plots).forEach(key_plots => {
            let unit_model_plots = this.__plots[key_plots];
            Object.keys(unit_model_plots).forEach(key_unit_plot => {
                if(categories_except.indexOf(key_plots) >= 0 && unit_names_except.indexOf(key_unit_plot) >= 0) return;
                let unit_model_plot = unit_model_plots[key_unit_plot];
                unit_model_plot.component.style.display = "none";
            });
        });
    }

    filterByCategory(...categories){
        this.hideAll(categories, []);
        categories.forEach(category => {
            Object.keys(this.__struct_models).forEach((unit_model) => {
                this.getChart(category, unit_model);
            });
        });
    }

    filterByUnits(...unit_names){
        this.hideAll([], unit_names);
        Object.keys(PlotCollector.PlotTypes).forEach(category => {
            unit_names.forEach((unit_name, index) => {
                this.getChart(category, this.__struct_models[unit_name]);
            });
        });
    }

    filter(categories, unit_names){
        this.hideAll(categories, unit_names);
        categories.forEach(category => {
            unit_names.forEach((unit_name, index) => {
                this.getChart(category, this.__struct_models[unit_name]);
            });
        });
    }

    static selectPlotter(type_plot){
        type_plot = type_plot.toLowerCase();
        if (!(type_plot in PlotCollector.PlotTypes)) {
            console.error(type_plot, "is not a valid type plot");
        }
        return PlotCollector.PlotTypes[type_plot];
    }

    static options(type_plot, model) {
        let ClassPlotter = this.selectPlotter(type_plot);
        return (new ClassPlotter(model, null)).options;
    }
}
PlotCollector.PlotTypes = {
    "time-series": PlotTimeSeries,
    "likelihood": PlotLikelihood,
    "time-series-estimation": PlotTimeSeriesEstimation,
    "snapshoot": PlotSnapshootTimeSeries,
    "pre-event-residuals-histogram": PlotPreResidualsHistogram,
    "pre-event-residuals-acf": PlotPreResidualsACF,
    "post-event-residuals-histogram": PlotPostResidualsHistogram,
    "post-event-residuals-acf": PlotPostResidualsACF,
};



class PlotThumbnailsCollector {
    constructor(models) {
        this.__elements = [];
        this.__drawers = [];
        this.models = models;
    }
    
    set models(models){
        this.__models = models;
        this.__struct_models = {};
        models.forEach(model => {
            this.__struct_models[model.unit_name] = model;
        });
    }
    get models(){
        return this.__models;
    }

    getChart(element, type_plot, unit_model){
        let index = this.__elements.indexOf(element);
        if(index < 0){
            this.__elements.push(element);
            this.__drawers.push(new PlotCollector(element, this.models));
            index = this.__elements.length - 1;
        }
        this.__drawers[index].getChart(type_plot, unit_model);
    }

}

//exports.UnitModelPlotter = UnitModelPlotter;
exports.PlotTimeSeries = PlotTimeSeries;
exports.PlotLikelihood = PlotLikelihood;
exports.PlotTimeSeriesEstimation = PlotTimeSeriesEstimation;
exports.PlotSnapshootTimeSeries = PlotSnapshootTimeSeries;
exports.PlotPreResidualsHistogram = PlotPreResidualsHistogram;
exports.PlotPreResidualsACF = PlotPreResidualsACF;
exports.PlotPostResidualsHistogram = PlotPostResidualsHistogram;
exports.PlotPostResidualsACF = PlotPostResidualsACF;

exports.PlotCollector = PlotCollector;
exports.PlotThumbnailsCollector = PlotThumbnailsCollector;
