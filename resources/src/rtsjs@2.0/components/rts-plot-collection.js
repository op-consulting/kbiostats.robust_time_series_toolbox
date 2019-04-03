riot.tag2('rts-plot-collection', '<div> <virtual each="{model, index in opts.models}"> <div class="{⁗graph-collection collection-⁗ + index}"> <rts-model-plot type="plain" class="plain" model="{model}"></rts-model-plot> <rts-model-plot type="box-plot-residuals" class="box-plot-residuals" model="{model}"></rts-model-plot> <rts-model-plot type="loglikelihood" class="loglikelihood" model="{model}"></rts-model-plot> <rts-model-plot type="before-change-point-residuals" class="before-change-point-residuals" model="{model}"></rts-model-plot> <rts-model-plot type="before-change-point-autocorrelation" class="before-change-point-autocorrelation" model="{model}"></rts-model-plot> <rts-model-plot type="after-change-point-residuals" class="after-change-point-residuals" model="{model}"></rts-model-plot> <rts-model-plot type="after-change-point-autocorrelation" class="after-change-point-autocorrelation" model="{model}"></rts-model-plot> </div> </virtual> </div>', '', '', function(opts) {


    const self = this;
    const config = opts;

    config.models = !!config.models ? config.models : [];

    self.on("update", () => {

    });
    self.on("mount", () => {

      self.update();
    });
});