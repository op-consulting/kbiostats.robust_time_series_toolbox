riot.tag2('rts-plot-collection', '<div> <virtual if="{_anyPlotFilter()}"> <div class="{⁗graph-collection collection-⁗ + (plot.index + 1)}" each="{plot, index in opts.plots}"> <rts-model-plot type="{plot.type}" class="{plot.type}" model="{opts.models[plot.index]}" title="{plot.title}"></rts-model-plot> </div> </virtual> </div>', 'rts-plot-collection .hidden,[data-is="rts-plot-collection"] .hidden{ display: none!important; } rts-plot-collection .graph-collection rts-model-plot > div,[data-is="rts-plot-collection"] .graph-collection rts-model-plot > div{ border: none!important; box-shadow: none!important; } rts-plot-collection .graph-collection rts-model-plot,[data-is="rts-plot-collection"] .graph-collection rts-model-plot{ margin-top:10px; margin-bottom: 20px; }', '', function(opts) {


    const self = this;
    const config = opts;

    config.models = !!config.models ? config.models : [];
    config.plots = !!config.plots ? config.plots : [];

self._anyPlotFilter = () => (!!config.plots && config.plots.length > 0)
    self.on("update", () => {
      console.log("config.plots ", config.plots )
    });
    self.on("mount", () => {

      self.update();
    });
});