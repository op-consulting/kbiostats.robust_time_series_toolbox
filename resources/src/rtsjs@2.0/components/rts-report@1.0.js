riot.tag2('rts-model-wald-test-decision', '<h4>Supremum Wald test conclusion</h4> <table border="1" cellpadding="0" cellspacing="0"> <tr> <td>Unit</td> <td>Formal intervention</td> <td>Estimated change point</td> <td>Intervention lag</td> <td>Supremum Wald-test decision</td> </tr> <tr each="{model, index in opts.models}"> <td>{model.unit_name}</td> <td>{theoretical_change_point(model)}</td> <td>{estimated_change_point(model)}</td> <td>{diff_change_point(model)}</td> <td>{supremum_wald(model)}</td> </tr> </table>', '', '', function(opts) {


        const self = this;
        self.theoretical_change_point = (model) => moment(model.dates[model.estimations.likelihood.best_time]).format(
            "MMM DD, YYYY");
        self.estimated_change_point = (model) => moment(model.dates[model.change_point.theoretical]).format(
            "MMM DD, YYYY");
        self.diff_change_point = (model) => moment(model.dates[model.estimations.likelihood.best_time]).from(
            moment(model.dates[model.change_point.theoretical]));
        self.supremum_wald = (model) => -12345;
});

riot.tag2('rts-model-pre-change-point-table', '<h4>Unit-specific pre-change point intercepts and slopes</h4> <table border="1" cellpadding="0" cellspacing="0" class="double-header"> <tr> <td rowspan="2">Unit</td> <td colspan="3">Intercept pre-change point</td> <td colspan="3">Slope pre-change point</td> </tr> <tr> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> </tr> <tr each="{model, index in opts.models}"> <td>{model.unit_name}</td> <td>{estimate_1(model)}</td> <td>{ci_1(model)}</td> <td>{pval_1(model)}</td> <td>{estimate_2(model)}</td> <td>{ci_2(model)}</td> <td>{pval_2(model)}</td> </tr> </table>', '', '', function(opts) {


        const self = this;
        const estimation_type = "after_change";
        const rnd = (r) => Math.round(1000 * r) / 1000;
        const confidence_interval = (ci) => `(${rnd(ci[0])}, ${rnd(ci[1])})`;
        self.estimate_1 = (model) => rnd(model.estimations[estimation_type].mean_structure.intercept);
        self.estimate_2 = (model) => rnd(model.estimations[estimation_type].mean_structure.slope);
        self.ci_1 = (model) => confidence_interval(model.estimations[estimation_type].mean_structure.intercept_confidence_interval);
        self.ci_2 = (model) => confidence_interval(model.estimations[estimation_type].mean_structure.slope_confidence_interval);
        self.pval_1 = (model) => rnd(model.estimations[estimation_type].mean_structure.intercept_p_value);
        self.pval_2 = (model) => rnd(model.estimations[estimation_type].mean_structure.slope_p_value);
});

riot.tag2('rts-model-post-change-point-table', '<h4>Unit-specific post-change point intercepts and slopes</h4> <table border="1" cellpadding="0" cellspacing="0" class="double-header"> <tr> <td rowspan="2">Unit</td> <td colspan="3">Intercept post-change point</td> <td colspan="3">Slope post-change point</td> </tr> <tr> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> </tr> <tr each="{model, index in opts.models}"> <td>{model.unit_name}</td> <td>{estimate_1(model)}</td> <td>{ci_1(model)}</td> <td>{pval_1(model)}</td> <td>{estimate_2(model)}</td> <td>{ci_2(model)}</td> <td>{pval_2(model)}</td> </tr> </table>', '', '', function(opts) {


        const self = this;
        const estimation_type = "before_change";
        const rnd = (r) => Math.round(1000 * r) / 1000;
        const confidence_interval = (ci) => `(${rnd(ci[0])}, ${rnd(ci[1])})`;
        self.estimate_1 = (model) => rnd(model.estimations[estimation_type].mean_structure.intercept);
        self.estimate_2 = (model) => rnd(model.estimations[estimation_type].mean_structure.slope);
        self.ci_1 = (model) => confidence_interval(model.estimations[estimation_type].mean_structure.intercept_confidence_interval);
        self.ci_2 = (model) => confidence_interval(model.estimations[estimation_type].mean_structure.slope_confidence_interval);
        self.pval_1 = (model) => rnd(model.estimations[estimation_type].mean_structure.intercept_p_value);
        self.pval_2 = (model) => rnd(model.estimations[estimation_type].mean_structure.slope_p_value);

});


riot.tag2('rts-model-parameter-changes-table', '<h4>Unit-specific changes in level and slope</h4> <table border="1" cellpadding="0" cellspacing="0" class="double-header"> <tr> <td rowspan="2">Unit</td> <td colspan="3">Changes in level</td> <td colspan="3">Changes in slope</td> </tr> <tr> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> <td>Estimate</td> <td>95% CI</td> <td>p-val</td> </tr> <tr each="{model, index in opts.models}"> <td>{model.unit_name}</td> <td>{estimate_1(model)}</td> <td>{ci_1(model)}</td> <td>{pval_1(model)}</td> <td>{estimate_2(model)}</td> <td>{ci_2(model)}</td> <td>{pval_2(model)}</td> </tr> </table>', '', '', function(opts) {


        const self = this;
        const estimation_type_1 = "intercept";
        const estimation_type_2 = "slope";
        const rnd = (r) => Math.round(1000 * r) / 1000;
        const confidence_interval = (ci) => `(${rnd(ci[0])}, ${rnd(ci[1])})`;
        self.estimate_1 = (model) => rnd(model.estimations.parameter_differences[estimation_type_1]);
        self.estimate_2 = (model) => rnd(model.estimations.parameter_differences[estimation_type_2]);
        self.ci_1 = (model) => confidence_interval(model.estimations.parameter_differences[estimation_type_1 + "_confidence_interval"]);
        self.ci_2 = (model) => confidence_interval(model.estimations.parameter_differences[estimation_type_2 + "_confidence_interval"]);
        self.pval_1 = (model) => rnd(model.estimations.parameter_differences[estimation_type_1 + "_p_value"]);
        self.pval_2 = (model) => rnd(model.estimations.parameter_differences[estimation_type_2 + "_p_value"]);

});

riot.tag2('rts-model-stochastic-parameter-changes-table', '<h4>Estimates of the stochastic component parameters</h4> <table border="1" cellpadding="0" cellspacing="0" class="double-header"> <tr> <td rowspan="2">Unit</td> <td colspan="2">Pre-change point</td> <td colspan="2">Post-change point</td> </tr> <tr> <td>Adjacent correlation</td> <td>Standard deviation</td> <td>Adjacent correlation</td> <td>Standard deviation</td> </tr> <tr each="{model, index in opts.models}"> <td>{model.unit_name}</td> <td>{estimate_1(model)}</td> <td>{std_1(model)}</td> <td>{estimate_2(model)}</td> <td>{std_2(model)}</td> </tr> </table>', '', '', function(opts) {


        const self = this;
        const estimation_type_1 = "intercept";
        const estimation_type_2 = "slope";
        const rnd = (r) => Math.round(1000 * r) / 1000;
        const confidence_interval = (ci) => `(${rnd(ci[0])}, ${rnd(ci[1])})`;
        self.estimate_1 = (model) => rnd(model.estimations.before_change.autoregressive_structure.slope);
        self.estimate_2 = (model) => rnd(Math.sqrt(model.estimations.before_change.autoregressive_structure.residual_variance));
        self.std_1 = (model) => rnd(model.estimations.after_change.autoregressive_structure.slope);
        self.std_2 = (model) => rnd(Math.sqrt(model.estimations.after_change.autoregressive_structure.residual_variance));
});
    
riot.tag2('rts-model-report', '<div> <h3>{opts.model.unit_name}</h3> <rts-model-plot type="plain" class="plain" model="{opts.model}" if="{opts.plain_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="estimation" class="estimation" model="{opts.model}" if="{opts.estimation_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="loglikelihood" class="loglikelihood" model="{opts.model}" if="{opts.loglikelihood_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="box-plot-residuals" class="box-plot-residuals" model="{opts.model}" if="{opts.residuals_boxplot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="before-change-point-residuals" class="before-change-point-residuals" model="{opts.model}" if="{opts.residuals_before_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="after-change-point-residuals" class="after-change-point-residuals" model="{opts.model}" if="{opts.residuals_after_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="before-change-point-autocorrelation" class="before-change-point-autocorrelation" model="{opts.model}" if="{opts.acf_before_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> <rts-model-plot type="after-change-point-autocorrelation" class="after-change-point-autocorrelation" model="{opts.model}" if="{opts.acf_after_plot}" toolbar="{false}" static_version="{true}"></rts-model-plot> </div>', '', '', function(opts) {
});


riot.tag2('rts-report', '<div class="report-container"> <virtual if="{opts.models}"> <rts-model-wald-test-decision models="{opts.models}"></rts-model-wald-test-decision> <rts-model-pre-change-point-table models="{opts.models}"></rts-model-pre-change-point-table> <rts-model-post-change-point-table models="{opts.models}"></rts-model-post-change-point-table> <rts-model-parameter-changes-table models="{opts.models}"></rts-model-parameter-changes-table> <rts-model-stochastic-parameter-changes-table models="{opts.models}"></rts-model-stochastic-parameter-changes-table> <virtual each="{model, index in opts.models}"> <rts-model-report model="{model}" plain_plot="{true}" estimation_plot="{true}" loglikelihood_plot="{true}" residuals_boxplot="{true}" residuals_before_plot="{true}" residuals_after_plot="{true}" acf_before_plot="{true}" acf_after_plot="{true}"></rts-model-report> </virtual> </virtual> </div>', 'rts-report .hidden,[data-is="rts-report"] .hidden{ display: none !important; } rts-report .graph-collection rts-model-plot>div,[data-is="rts-report"] .graph-collection rts-model-plot>div{ border: none !important; box-shadow: none !important; } rts-report .graph-collection rts-model-plot,[data-is="rts-report"] .graph-collection rts-model-plot{ margin-top: 10px; margin-bottom: 20px; } rts-report .column-after,[data-is="rts-report"] .column-after,rts-report .column-before,[data-is="rts-report"] .column-before{ width: 45%; margin-left: 2.5%; margin-right: 2.5%; display: table-cell; } rts-report *,[data-is="rts-report"] *{ user-select: auto !important; } rts-report .simple-plot,[data-is="rts-report"] .simple-plot{ box-shadow: none !important; border: none !important; } rts-report table,[data-is="rts-report"] table{ width: 90%; margin: auto; border-collapse: collapse; border-spacing: 0; border: 1px solid #bbbec2; margin-bottom: 30px; } rts-report table.double-header tr:nth-child(2),[data-is="rts-report"] table.double-header tr:nth-child(2),rts-report table tr:nth-child(1),[data-is="rts-report"] table tr:nth-child(1){ background: #f2f2f2; font-size: 110%; } rts-report table td,[data-is="rts-report"] table td{ padding: 10px; text-align: center; vertical-align: middle; }', '', function(opts) {


        const require_ = require;

        const self = this;
        const config = opts;

        config.models = !!config.models ? config.models : [];
        self.__updated = false;

        self._number_images_non_converted = () => self.root.querySelectorAll(".image-container .static-image.hidden")
            .length;

        self.save_as_docx = () => {
            const require_ = require;
            const fs = require_('fs');
            const {
                dialog
            } = require_("electron").remote;
            const node = self.root.querySelector(".report-container");
            var reader = new FileReader()
            const wait_until = () => {
                console.log("waiting..");

                const n = self._number_images_non_converted();
                if (n != 0) {
                    setTimeout(wait_until, 500);
                } else {
                    jQuery(":hidden", node).remove();
                    const content = `<!DOCTYPE html><html><body>${node.outerHTML}</body></html>`
                    dialog.showSaveDialog({
                        title: "Save full report",
                        defaultPath: 'Report.docx',
                        filters: [{
                            name: 'Microsoft Word Document (.docx)',
                            extensions: ['docx']
                        }]
                    }, function (file_path) {
                        if (file_path) {
                            const blob = htmlDocx.asBlob(content, {
                                orientation: "portrait"
                            });
                            reader.onload = () => {
                                fs.writeFile(file_path, new Buffer(reader.result), {},
                                    () => {});
                            }
                            reader.readAsArrayBuffer(blob);
                        }
                    });
                }
            };
            setTimeout(wait_until, 500);
        }

        self.on("update", () => {

        });
        self.on("mount", () => {

        });
});