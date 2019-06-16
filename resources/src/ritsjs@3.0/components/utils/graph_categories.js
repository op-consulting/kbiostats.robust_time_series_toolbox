const graphic_category = {};

graphic_category["plain"] = () => {
    let options = default_options();
    let data = dygraphize(config.model.dates, config.model.y);
    options.labels = ["Time", "Value"];
    return [data, options]
};

graphic_category["loglikelihood"] = () => {
    let options = default_options();
    let data = dygraphize(
        config.model.estimations.change_point_candidates.map((i) => config.model.dates[i]),
        config.model.estimations.loglikelihood_candidates
    );
    options.labels = ["Time", "Loglikelihood"];
    return [data, options]
};

graphic_category["--change-point-residuals"] = (before_or_after) => {
    var residual = config.model.estimations[before_or_after].residuals.values;
    let options = default_options();
    let data = dygraphize(
        //config.model.estimations.likelihood.change_points.map((i) => config.model.dates[i]),
        residual.map((i) => config.model.dates[config.model.estimations.change_point_index + i]),
        residual
    );
    options.labels = ["Time", "Residual"];
    return [data, options]
};

graphic_category["--change-point-autocorrelation"] = (before_or_after) => {
    var acf = config.model.estimations[before_or_after].residuals.autocorrelation;
    let options = default_options();
    let data = dygraphize(
        acf.autocorrelation.map((_, i) => i),
        acf.autocorrelation
    );
    options.plotter = acfPlotter;
    options.labels = ["Lag", "Autocorrelation"];
    return [data, options]
};

graphic_category["box-plot-residuals"] = () => {
    const messages = [
        'Before intervention',
        'After intervention',
    ];
    var pre_residual = config.model.estimations.initial.residuals.values;
    var post_residual = config.model.estimations.increment_change.residuals.values;
    let options = default_options();
    let data = [
        [0, st.mean(pre_residual)],
        [1, st.mean(post_residual)],
    ]
    options.plotter = boxPlotter(pre_residual, post_residual);
    options.dateWindow = [-0.5, 1.5];
    options.valueRange = [Math.min(...[...pre_residual, ...post_residual]), Math.max(...[...pre_residual, ...post_residual])];
    const delta = options.valueRange[1] - options.valueRange[0]
    options.valueRange[0] -= delta
    options.valueRange[1] += delta

    options.axes = {
        x: {},
        y: {}
    }

    options.axes.x.valueFormatter = (d) => d == 0 ? messages[0] : (d == 1 ? messages[1] : ".");
    //options.axes.x.axisLabelFormatter = (d) => d==0?messages[0]:(d==1?messages[1]:"")
    //options.axes.x.pixelsPerLabel = 100
    options.axes.x.ticker = () => [{
            v: 0,
            label_v: 0,
            label: messages[0]
        },
        {
            v: 1,
            label_v: 1,
            label: messages[1]
        },
    ]
    options.axes.x.axisLabelWidth = 150

    options.labels = ["Type", "Mean"];
    return [data, options]
};

graphic_category["before-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
    "initial")
graphic_category["after-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
    "increment_change")
graphic_category["before-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
    "initial")
graphic_category["after-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
    "increment_change")

exports.graphic_category = graphic_category;
