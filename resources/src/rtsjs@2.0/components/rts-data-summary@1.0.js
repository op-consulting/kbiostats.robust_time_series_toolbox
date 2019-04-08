
riot.tag2('rts-data-block-summary', '<div class="model-title" style="" colspan="2"> <span class="mif-dashboard icon"></span> <span>{opts.model.unit_name}</span> </div> <div class="model-description"> <div class="model-mini-plot"> <rts-model-plot type="estimation" ref="plain" id="{\'executive-plot-\' + opts.index}" model="{opts.model}" toolbar="{false}" header="{false}" legend="{false}"></rts-model-plot> </div> </div> <div class="model-mini-info"> <ul class="v-menu model-information" style="width:100%;"> <li class="menu-title">Change point</li> <li class="change-point">{change_point(opts.model)}</li> <li class="menu-title">Slope estimate</li> <li class="info-before-TET"> {mean_estimate[\'slope\'](opts.model, 0)} </li> <li class="info-after-TET"> {mean_estimate[\'slope\'](opts.model, 1)} </li> <li class="info-diff"> {estimate_difference_on[\'slope\'](opts.model)} </li> <li class="info-95CI"> {confidence_interval[\'slope\'](opts.model)} </li> <li class="menu-title">Intercept estimate</li> <li class="info-before-TET"> {mean_estimate[\'intercept\'](opts.model, 0)} </li> <li class="info-after-TET"> {mean_estimate[\'intercept\'](opts.model, 1)} </li> <li class="info-diff"> {estimate_difference_on[\'intercept\'](opts.model)} </li> <li class="info-95CI"> {confidence_interval[\'intercept\'](opts.model)} </li> <li class="menu-title">White noise estimate</li> <li class="info-before-TET"> {mean_estimate[\'white_noise\'](opts.model, 0)} </li> <li class="info-after-TET"> {mean_estimate[\'white_noise\'](opts.model, 1)} </li> <li class="info-diff"> {estimate_difference_on[\'white_noise\'](opts.model)} </li> <li class="info-95CI"> {confidence_interval[\'white_noise\'](opts.model)} </li> </ul> </div> </div>', 'rts-data-block-summary *,[data-is="rts-data-block-summary"] *{ cursor: default !important; } rts-data-block-summary .model-mini-plot,[data-is="rts-data-block-summary"] .model-mini-plot{ width: 50%; position: absolute; top: 0; left: 0; } rts-data-block-summary .model-mini-info,[data-is="rts-data-block-summary"] .model-mini-info{ width: 50%; position: relative; right: 0; left: 50%; } rts-data-block-summary .model-title,[data-is="rts-data-block-summary"] .model-title{ width: 100%; background-color: #efefef; font-size: 15pt; font-weight: 300 } rts-data-block-summary .model-information li,[data-is="rts-data-block-summary"] .model-information li{ font-weight: 500; font-size: 11pt; } rts-data-block-summary .model-information .menu-title,[data-is="rts-data-block-summary"] .model-information .menu-title{ font-size: 12pt; font-weight: 200; } rts-data-block-summary .model-information .change-point-TET,[data-is="rts-data-block-summary"] .model-information .change-point-TET{ color: rgb(75, 22, 22); } rts-data-block-summary .model-information .info-before-TET,[data-is="rts-data-block-summary"] .model-information .info-before-TET{ font-weight: normal; } rts-data-block-summary .model-information .info-after-TET,[data-is="rts-data-block-summary"] .model-information .info-after-TET{ font-weight: normal; } rts-data-block-summary .model-information .info-diff,[data-is="rts-data-block-summary"] .model-information .info-diff{ color: rgb(19, 38, 66); color: rgb(15, 56, 56); } rts-data-block-summary .model-information .info-95CI,[data-is="rts-data-block-summary"] .model-information .info-95CI{ color: rgb(15, 56, 56); } rts-data-block-summary .model-information li::before,[data-is="rts-data-block-summary"] .model-information li::before{ font-size: 10pt; font-weight: normal; width: 160px; display: inline-block; } rts-data-block-summary .model-information .change-point::before,[data-is="rts-data-block-summary"] .model-information .change-point::before{ content: "Estimated change-point:"; } rts-data-block-summary .model-information .info-before-TET::before,[data-is="rts-data-block-summary"] .model-information .info-before-TET::before{ content: "Before change-point:"; } rts-data-block-summary .model-information .info-after-TET::before,[data-is="rts-data-block-summary"] .model-information .info-after-TET::before{ content: "After change-point:"; } rts-data-block-summary .model-information .info-diff::before,[data-is="rts-data-block-summary"] .model-information .info-diff::before{ content: "Difference:"; } rts-data-block-summary .model-information .info-95CI::before,[data-is="rts-data-block-summary"] .model-information .info-95CI::before{ content: "95% C.I.:"; } rts-data-block-summary .model-information-table .model-title,[data-is="rts-data-block-summary"] .model-information-table .model-title{ width: 100%; background-color: #efefef; font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Ubuntu", "Helvetica Neue", sans-serif; font-size: 15pt; font-weight: 300; } rts-data-block-summary .model-mini-plot rts-model-plot>div,[data-is="rts-data-block-summary"] .model-mini-plot rts-model-plot>div{ border: none !important; box-shadow: none !important; } rts-data-block-summary .model-mini-plot rts-model-plot,[data-is="rts-data-block-summary"] .model-mini-plot rts-model-plot{ margin-to3p: 5px; margin-bot3tom: 5px; max-width: 110%; min-width: 110%; width: 110% !important; min-height: 450px; max-height: 450px; height: 450px !important; margin-left: -10%; } rts-data-block-summary .model-mini-plot rts-model-plot [data-role="appbar"],[data-is="rts-data-block-summary"] .model-mini-plot rts-model-plot [data-role="appbar"],rts-data-block-summary .model-mini-plot rts-model-plot .image-container h4,[data-is="rts-data-block-summary"] .model-mini-plot rts-model-plot .image-container h4{ display: none; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.model = !!config.model ? config.model : null;
    self.change_point = (model) => moment(model.dates[model.estimations.likelihood.best_index]).format(
      "MMM DD, YYYY");

    const rnd = (f) => Math.round(f * 1000) / 1000;
    self.estimate_difference_on = {
      slope: (model) => {
        console.log(model)
        x0 = model.estimations.before_change.mean_structure.slope;
        x1 = model.estimations.after_change.mean_structure.slope;
        return rnd(x1 - x0);
      },
      intercept: (model) => {
        x0 = model.estimations.before_change.mean_structure.intercept;
        x1 = model.estimations.after_change.mean_structure.intercept;
        return rnd(x1 - x0);
      },
      white_noise: (model) => {
        x0 = model.estimations.before_change.autoregressive_structure.slope;
        x1 = model.estimations.after_change.autoregressive_structure.slope;
        return rnd(x1 - x0);
      },
    };
    self.mean_estimate = {
      slope: (model, idx) => {
        x0 = model.estimations.before_change.mean_structure.slope;
        x1 = model.estimations.after_change.mean_structure.slope;
        return rnd([x0, x1][idx]);
      },
      intercept: (model, idx) => {
        x0 = model.estimations.before_change.mean_structure.intercept;
        x1 = model.estimations.after_change.mean_structure.intercept;
        return rnd([x0, x1][idx]);
      },
      white_noise: (model, idx) => {
        x0 = model.estimations.before_change.autoregressive_structure.slope;
        x1 = model.estimations.after_change.autoregressive_structure.slope;
        return rnd([x0, x1][idx]);
      },
    };
    const calc_confidence_interval = (model, estimate) => {
      let ci = model.estimations.parameter_differences[estimate + "_confidence_interval"];
      return `(${rnd(ci[0])}, ${rnd(ci[1])})`
    }
    self.confidence_interval = {
      slope: (model, idx) => calc_confidence_interval(model, "slope"),
      intercept: (model, idx) => calc_confidence_interval(model, "intercept"),
      white_noise: (model, idx) => calc_confidence_interval(model, "autoregressive_slope"),
    };

    self.on("update", () => {
      self.refs.plain.update();
    });

    self.on("mount", () => {});
});



riot.tag2('rts-data-table-summary', '<div class="par-container"> <h4 class="text-light">Data summary</h4> </div> <div class="paper-style"> <ul class="v-menu" style="width:100%;"> <li class="menu-title"> <div class="row"> <div class="cell-3"> <div></div> </div> <div class="cell-3"> <div>Impact on slope</div> </div> <div class="cell-3"> <div>Impact on level</div> </div> <div class="cell-3"> <div>Changes on noise</div> </div> </div> </li> <virtual each="{model, index in opts.models}"> <li class=""> <div class="row"> <div class="cell-3"> <div class="centered-cell"> <span class="icon"><svg class="{⁗unit-⁗ + (index + 1) + ⁗ unit-miniplot⁗}"></svg></span> <span>{model.unit_name}</span> </div> </div> <virtual each="{parameter in [\'slope\', \'intercept\' , \'white_noise\' ]}"> <div class="cell"> <div class="centered-cell"> <span class="mif-move-up mif-2x parameter-indication" if="{estimate_difference_on[parameter](model)>=                     0}"></span> <span class="mif-move-down mif-2x parameter-indication" if="{estimate_difference_on[parameter](model)                     < 0}"></span> <span class="parameter-estimation"> {estimate_difference_on[parameter](model)} </span> </div> </div> <div class="cell-2"> <div> <div class="parameter-changes"> <span class="label">Changes:</span> <span class="values"> <span class="value-before">{mean_estimate[parameter](model, 0)}</span> <span class="mif-forward" style="position: relative;top: 2px;"></span> <span class="value-after">{mean_estimate[parameter](model, 1)}</span> </span> </div> <div class="parameter-confidence-interval"> <span class="label">95% C.I.:</span> <span class="values"> {confidence_interval[parameter](model)} </span> </div> </div> </div> </virtual> </div> </li> </virtual> </ul> </div>', 'rts-data-table-summary *,[data-is="rts-data-table-summary"] *{ cursor: default; } rts-data-table-summary .unit-miniplot,[data-is="rts-data-table-summary"] .unit-miniplot{ zoom: 0.35; margin-top: 23px; float: left; } rts-data-table-summary .icon+span,[data-is="rts-data-table-summary"] .icon+span{ display: block; width: calc(100% - 50px); height: 75%; position: absolute; left: 45px; top: 11%; } rts-data-table-summary .centered-cell,[data-is="rts-data-table-summary"] .centered-cell{ height: 100%; } rts-data-table-summary .parameter-indication,[data-is="rts-data-table-summary"] .parameter-indication{ float: left; } rts-data-table-summary .parameter-estimation,[data-is="rts-data-table-summary"] .parameter-estimation{ font-size: 115%; text-align: center; } rts-data-table-summary .parameter-changes,[data-is="rts-data-table-summary"] .parameter-changes,rts-data-table-summary .parameter-confidence-interval,[data-is="rts-data-table-summary"] .parameter-confidence-interval{ font-size: 80%; text-align: center; } rts-data-table-summary .parameter-changes .values,[data-is="rts-data-table-summary"] .parameter-changes .values,rts-data-table-summary .parameter-confidence-interval .values,[data-is="rts-data-table-summary"] .parameter-confidence-interval .values{ font-weight: bold; } rts-data-table-summary .centered-cell,[data-is="rts-data-table-summary"] .centered-cell{ display: table; width: 100%; text-align: left; } rts-data-table-summary .centered-cell *:nth-child(2),[data-is="rts-data-table-summary"] .centered-cell *:nth-child(2){ margin-left: 5px; margin-top: 5px; display: inline-block; } rts-data-table-summary .centered-cell .parameter-estimation,[data-is="rts-data-table-summary"] .centered-cell .parameter-estimation{ margin-right: -5px; width: 5px; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.models = !!config.models ? config.models : [];

    const rnd = (f) => Math.round(f * 100) / 100;
    self.estimate_difference_on = {
      slope: (model) => {
        x0 = model.estimations.before_change.mean_structure.slope;
        x1 = model.estimations.after_change.mean_structure.slope;
        return rnd(x1 - x0);
      },
      intercept: (model) => {
        x0 = model.estimations.before_change.mean_structure.intercept;
        x1 = model.estimations.after_change.mean_structure.intercept;
        return rnd(x1 - x0);
      },
      white_noise: (model) => {
        x0 = model.estimations.before_change.autoregressive_structure.slope;
        x1 = model.estimations.after_change.autoregressive_structure.slope;
        return rnd(x1 - x0);
      },
    };
    self.mean_estimate = {
      slope: (model, idx) => {
        x0 = model.estimations.before_change.mean_structure.slope;
        x1 = model.estimations.after_change.mean_structure.slope;
        return rnd([x0, x1][idx]);
      },
      intercept: (model, idx) => {
        x0 = model.estimations.before_change.mean_structure.intercept;
        x1 = model.estimations.after_change.mean_structure.intercept;
        return rnd([x0, x1][idx]);
      },
      white_noise: (model, idx) => {
        x0 = model.estimations.before_change.autoregressive_structure.slope;
        x1 = model.estimations.after_change.autoregressive_structure.slope;
        return rnd([x0, x1][idx]);
      },
    };
    const calc_confidence_interval = (model, estimate) => {
      let ci = model.estimations.parameter_differences[estimate + "_confidence_interval"];
      return `(${rnd(ci[0])}, ${rnd(ci[1])})`
    }
    self.confidence_interval = {
      slope: (model, idx) => calc_confidence_interval(model, "slope"),
      intercept: (model, idx) => calc_confidence_interval(model, "intercept"),
      white_noise: (model, idx) => calc_confidence_interval(model, "autoregressive_slope"),
    };

    self.on("mount", () => {

    });
});


riot.tag2('rts-data-summary', '<div class="executive-summary hidden" style="" if="{model_exists()}"> <rts-data-table-summary models="{opts.models}"></rts-data-table-summary> <div class="par-container"> <h4 class="text-light">Relevant results</h4> </div> <div class="paper-style"> <div each="{model, index in opts.models}"> <rts-data-block-summary model="{model}" index="{index}"></rts-data-block-summary> </div> </div> </div>', 'rts-data-summary .hidden,[data-is="rts-data-summary"] .hidden{ display: none; } rts-data-summary .par-container,[data-is="rts-data-summary"] .par-container{ width: 80%; margin: auto; } rts-data-summary h4,[data-is="rts-data-summary"] h4{ margin-top: 40px; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.models = !!config.models ? config.models : [];

    self._models = () => config.models;
    self._models_indexes = () => (!!config.models ? Array.from(Array(config.models.length).keys()) : []);

    self.model_exists = () => config.models != null && config.models.length > 0;
    self._trigger_event = (name) => {
      return () => self.trigger('app:request:current:plot:allunits', {
        plottype: name.toLowerCase()
      });
    };

    self.on("mount", () => {

    });
});


