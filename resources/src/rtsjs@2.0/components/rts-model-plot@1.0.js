riot.tag2('rts-model-plot', '<div class="simple-plot w-100 h-100"> <div data-role="appbar" class="pos-relative z-dropdown"> <button id="" class="button" title="Zoom in" onclick="{zoomin}"> <span class="mif-zoom-in"></span> </button> <button id="" class="button" title="Zoom out" onclick="{zoomout}"> <span class="mif-zoom-out"></span> </button> <button id="" class="button" title="Zoom reset" onclick="{zoomreset}"> <span class="mif-home"></span> </button> </div> <div class="plot-container"></div> </div>', 'rts-model-plot .app-bar button,[data-is="rts-model-plot"] .app-bar button{ height: 34px !important; width: 34px !important; padding: 0; cursor: default; } rts-model-plot .app-bar,[data-is="rts-model-plot"] .app-bar{ text-align: left; display: block; min-height: 25px; height: 42px; padding: 3px; background: #f5f6f7; } rts-model-plot .simple-plot,[data-is="rts-model-plot"] .simple-plot{ border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-model-plot .plot-container,[data-is="rts-model-plot"] .plot-container{ padding-top: 10px; height: calc(100% - 70px); width: calc(100% - 30px); left: 0; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend,rts-model-plot .dygraph-legend .legend-time,[data-is="rts-model-plot"] .dygraph-legend .legend-time{ background: rgb(237, 237, 237); } rts-model-plot .dygraph-legend .legend-values,[data-is="rts-model-plot"] .dygraph-legend .legend-values{ background: #f5f6f7; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend{ position: absolute; width: 100px; border: 1px solid rgb(205, 205, 205); zoom: 0.8; } rts-model-plot .legend-container,[data-is="rts-model-plot"] .legend-container{ padding: 5px; } rts-model-plot .label,[data-is="rts-model-plot"] .label{ height: 20px; padding: 5px; user-select: text; cursor: text; } rts-model-plot .legend-label,[data-is="rts-model-plot"] .legend-label{ padding-right: 5px; filter: brightness(100%); font-weight: bold; } rts-model-plot .legend-line,[data-is="rts-model-plot"] .legend-line{ min-width: 10px; display: inline-block; height: 5px; position: relative; top: -4px; } rts-model-plot *,[data-is="rts-model-plot"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.width = !!config.width ? config.width : "100%";
    config.height = !!config.height ? config.height : "400px";
    config.type = !!config.type ? config.type : "plain";

    self.series_1 = {
      enabled: true,
      x: 0,
      y: 0
    }
    self.series_2 = {
      enabled: true,
      x: 0,
      y: 0
    }

    self.view_blank = () => {
      self.root.querySelector(".outline-blank-button").click();
    };

    self.view_list_unit_names = () => {
      self.root.querySelector(".unit-name-button").click();
    };

    self.view_list_plot_types = () => {
      self.root.querySelector(".plot-type-button").click();
    };

    self._zoom = (factor = 0.8) => {
      var r = self.graph.xAxisRange();
      var delta = 0.5 * factor * (r[1] - r[0])
      var x0 = r[0] + delta,
        x1 = r[1] - delta;
      self.graph.updateOptions({
        dateWindow: [x0, x1]
      });
    }

    self.zoomreset = () => {
      self.graph.updateOptions({
        dateWindow: null,
        valueRange: null
      });
    }
    const zoom_factor = 0.2
    self.zoomout = () => self._zoom(zoom_factor / (zoom_factor - 1))

    self.zoomin = () => self._zoom(zoom_factor)

    var gdata = "X,Y1,Y2\n";
    for (var i = 0; i < 100; i++) {

      if (i < 50) {
        gdata += i + "," + Math.random() + "," + "\n";
      } else {
        gdata += i + "," + "," + 0.5 * Math.random() + "\n";
      }
    }

    const defaultLegendFormatter = (data) => {
      if (data.x == null) {
        data.x = "";
        data.xHTML = "";
      }
      let html = `
        <div class='legend-container'>
        <div class='legend-title'>
        </div>
        <div class='legend-values'>
          <div class='legend-time'>
            <span class='legend-label'>Time</span>
            <span class='legend-value'>${data.xHTML}</span>
          </div>
      `
      data.series.forEach((series, index) => {
        if (typeof series.yHTML == "undefined") series.yHTML = ""
        html += `
          <div class='series-${index + 1} ${series.isHighlighted?'highlighted':''}'>
            <span class="legend-line" style='background-color:${series.color};'></span>
            <span class='legend-label' style='color:${series.color}; '>${series.labelHTML}</span>
            <span class='legend-value'>${series.yHTML}</span>
          </div>
        `
      });
      return html + "</div></div>";
    }

    self.graph = null;

    const dygraphize = (x, y) => x.map((_x, i) => [_x, y[i]])

    const default_options = () => ({
      fillGraph: true,
      fillAlpha: 0.5,
      colors: ["#0074ce", "#6fce00"],
      legend: 'follow',
      legendFormatter: defaultLegendFormatter,
    });

    const graphic_category = {};
    graphic_category["plain"] = () => {
      let options = default_options();
      let data = dygraphize(config.model.dates, config.model.y);
      options.labels = ["Time", "Value"];
      return [data, options]
    };
    graphic_category["loglikelihood"] = () => {
      let options = default_options();
      let data = dygraphize(config.model.estimations.likelihood.change_points.map((i) => model.dates[i]), config.model.estimations.likelihood.loglikelihood);
      options.labels = ["Time", "Value"];
      return [data, options]
    };

    self.on("mount", () => {
      self.root.style.cssText += `width: ${config.width}; height: ${config.height}; display: block;`

      model = {}
      model.dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      model.dates = [...Array(model.dates.length).keys()].map((i) => new Date(new Date().setDate(i)))
      model.x = [...Array(model.dates.length).keys()]
      model.change_point = {}
      model.change_point.theoretical = 5
      model.change_point.before = 5
      model.change_point.after = 6
      model.y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]
      model.estimations = RTSModel.robust_interrupted_time_series(model.x, model.y, model.change_point.theoretical,
        model.change_point.before, model.change_point.after)

      config.model = model;

      self.graph = new Dygraph(
        self.root.querySelector(".plot-container"),
        ...graphic_category[config.type]()
      );
    });
});