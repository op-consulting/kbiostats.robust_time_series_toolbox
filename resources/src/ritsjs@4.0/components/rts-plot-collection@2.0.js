riot.tag2('rts-plot-collection', '<div> <virtual if="{_anyPlotFilter()}"> <div class="{⁗graph-collection collection-⁗ + (plot.index + 1)}" each="{plot, index in opts.plots}"> <virtual if="{!plot.type.startsWith(\'combined-\')}"> <rts-model-plot type="{plot.type}" class="{plot.type}" model="{opts.models[plot.index]}" title="{plot.title}" subtitle="{plot.subtitle}"></rts-model-plot> </virtual> <virtual if="{plot.type.startsWith(\'combined-\')}"> <div class="column-before"> <rts-model-plot type="{_adjust_type(plot, \'before-\')}" class="{_adjust_type(plot, \'before-\')}" model="{opts.models[plot.index]}" title="{plot.title}" subtitle="{plot.subtitle}"></rts-model-plot> </div> <div class="column-after"> <rts-model-plot type="{_adjust_type(plot, \'after-\')}" class="{_adjust_type(plot, \'after-\')}" model="{opts.models[plot.index]}" title="{plot.title}" subtitle="{plot.subtitle}"></rts-model-plot> </div> </virtual> </div> </virtual> </div>', 'rts-plot-collection .hidden,[data-is="rts-plot-collection"] .hidden{ display: none!important; } rts-plot-collection .graph-collection,[data-is="rts-plot-collection"] .graph-collection{ width: 100%; display: inline-table; } rts-plot-collection .graph-collection rts-model-plot > div,[data-is="rts-plot-collection"] .graph-collection rts-model-plot > div{ border: none!important; box-shadow: none!important; } rts-plot-collection .graph-collection rts-model-plot,[data-is="rts-plot-collection"] .graph-collection rts-model-plot{ margin-top:10px; margin-bottom: 20px; } rts-plot-collection .column-after,[data-is="rts-plot-collection"] .column-after,rts-plot-collection .column-before,[data-is="rts-plot-collection"] .column-before{ width: 45%; margin-left: 2.5%; margin-right: 2.5%; display: table-cell; }', '', function(opts) {


    const self = this;
    const config = opts;

    config.models = !!config.models ? config.models : [];
    config.plots = !!config.plots ? config.plots : [];

    self._adjust_type = (plot, actual_type) => plot.type.replace('combined-', actual_type);

    self._anyPlotFilter = () => (!!config.plots && config.plots.length > 0)

    self.on("update", () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        console.log(123456)
      }, 10);
      console.log("config.plots ", config.plots );
    });

    self.on("mount", () => {

      self.update();
    });
});