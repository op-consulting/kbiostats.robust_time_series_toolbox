riot.tag2('rts-plot-collection', '<div> <virtual each="{model, index in opts.models}"> <div class="{⁗graph-collection collection-⁗ + (index + 1)}"> <rts-model-plot type="plain" class="plain" model="{model}"></rts-model-plot> <rts-model-plot type="loglikelihood" class="loglikelihood" model="{model}"></rts-model-plot> <rts-model-plot type="before-change-point-residuals" class="before-change-point-residuals" model="{model}"></rts-model-plot> <rts-model-plot type="before-change-point-autocorrelation" class="before-change-point-autocorrelation" model="{model}"></rts-model-plot> <rts-model-plot type="after-change-point-residuals" class="after-change-point-residuals" model="{model}"></rts-model-plot> <rts-model-plot type="after-change-point-autocorrelation" class="after-change-point-autocorrelation" model="{model}"></rts-model-plot> <rts-model-plot type="box-plot-residuals" class="box-plot-residuals" model="{model}"></rts-model-plot> </div> </virtual> </div>', 'rts-plot-collection .hidden,[data-is="rts-plot-collection"] .hidden{ display: none!important; }', '', function(opts) {


    const self = this;
    const config = opts;

    config.models = !!config.models ? config.models : [];

    self.hide_all = () => {
      Array.from(self.root.querySelectorAll("rts-model-plot")).forEach((el) => {el.classList.add("hidden"); });
    };
    self.show = (unit_index, type) => {
      self.root.querySelector(`.collection-${unit_index} rts-model-plot[type='${type}']`).classList.remove("hidden");
    };
    self.filter = (unit_index, types) => {
      self.hide_all();
      types.forEach((type) => self.show(unit_index, type));
    }

    self.on("update", () => {

    });
    self.on("mount", () => {

      self.update();
    });
});