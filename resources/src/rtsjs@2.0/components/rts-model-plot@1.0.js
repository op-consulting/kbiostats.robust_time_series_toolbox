riot.tag2('rts-model-plot', '<div class="simple-plot w-100 h-100"> <div data-role="appbar" class="pos-relative z-dropdown"> <button id="" class="button" title="Zoom reset" onclick="{zoomreset}"> <span class="mif-home"></span> </button> <button id="" class="button" title="Zoom in" onclick="{zoomin}"> <span class="mif-zoom-in"></span> </button> <button id="" class="button" title="Zoom in" onclick="{zoomin}"> <span class="ms-Icon ms-Icon--ZoomIn"></span> </button> <button id="" class="button" title="Zoom out" onclick="{zoomout}"> <span class="mif-zoom-out"></span> </button> <button id="" class="button" title="Download image" onclick="{save_image}"> <span class="ms-Icon ms-Icon--Save"></span> </button> </div> <div class="plot-container"></div> </div>', 'rts-model-plot .app-bar button,[data-is="rts-model-plot"] .app-bar button{ height: 34px !important; width: 34px !important; padding: 0; cursor: default; } rts-model-plot .app-bar,[data-is="rts-model-plot"] .app-bar{ text-align: left; display: block; min-height: 25px; height: 42px; padding: 3px; background: #f5f6f7; } rts-model-plot .simple-plot,[data-is="rts-model-plot"] .simple-plot{ border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-model-plot .plot-container,[data-is="rts-model-plot"] .plot-container{ padding-top: 10px; height: calc(100% - 70px); width: calc(100% - 30px); left: 0; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend,rts-model-plot .dygraph-legend .legend-time,[data-is="rts-model-plot"] .dygraph-legend .legend-time{ background: rgb(237, 237, 237); } rts-model-plot .dygraph-legend .legend-values,[data-is="rts-model-plot"] .dygraph-legend .legend-values{ background: #f5f6f7; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend{ position: absolute; min-width: 100px; border: 1px solid rgb(205, 205, 205); zoom: 0.8; } rts-model-plot .legend-container,[data-is="rts-model-plot"] .legend-container{ padding: 5px; } rts-model-plot .label,[data-is="rts-model-plot"] .label{ height: 20px; padding: 5px; user-select: text; cursor: text; } rts-model-plot .legend-label,[data-is="rts-model-plot"] .legend-label{ padding-right: 5px; filter: brightness(100%); font-weight: bold; } rts-model-plot .legend-line,[data-is="rts-model-plot"] .legend-line{ min-width: 10px; display: inline-block; height: 5px; position: relative; top: -4px; } rts-model-plot *,[data-is="rts-model-plot"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.width = !!config.width ? config.width : "100%";
    config.height = !!config.height ? config.height : "400px";
    config.type = !!config.type ? config.type : "plain";
    config.title = !!config.title ? config.title : "Plot";

    const model = () => config.model;
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

    self.save_image = () => {
      const require_ = require;
      const fs = require_('fs');
      const {
        dialog
      } = require_("electron").remote;
      const node = self.root.querySelector(".plot-container");

      const sanitize = (n) => !n || n.toLowerCase().replace(/[\s\W]+/g, "-").replace(/\-+/g, "-").trim();

      var reader = new FileReader()

      dialog.showSaveDialog({
        title: "Save plot",
        defaultPath: sanitize(config.title) + '.png',
        filters: [{
          name: 'Image',
          extensions: ['png']
        }]
      }, function (file_path) {
        if (file_path) {
          domtoimage.toBlob(node).then((blob) => {
            reader.onload = () => {
              fs.writeFile(file_path, new Buffer(reader.result), {}, () => {});
            }
            reader.readAsArrayBuffer(blob);
          });
        }
      });
    };

    const acfPlotter = (e) => {
      const ctx = e.drawingContext;
      const p = e.points[0];
      const y_bottom = e.dygraph.toDomYCoord(0);
      const delta = Math.sqrt(1 / e.points.length) * 1.96;
      const y_0 = e.dygraph.toDomYCoord(delta);
      const y_1 = e.dygraph.toDomYCoord(-delta);
      const x_0 = e.dygraph.toDomXCoord(0);
      const x_1 = e.dygraph.toDomXCoord(e.points.length);

      ctx.fillStyle = lightenColor(e.color, 0.2);

      ctx.fillRect(x_0, y_0, x_1 - x_0, y_1 - y_0);

      ctx.beginPath();
      ctx.setLineDash([5, 5]);

      ctx.moveTo(x_0, y_0);
      ctx.lineTo(x_1, y_0);
      ctx.strokeStyle = darkenColor(e.color);
      ctx.stroke();
      ctx.setLineDash([]);

      barChartPlotter(e);

    }
    const barChartPlotter = (e) => {
      const ctx = e.drawingContext;
      const points = e.points;
      const y_bottom = e.dygraph.toDomYCoord(0);

      ctx.fillStyle = lightenColor(e.color);

      let min_sep = Infinity;
      for (let i = 1; i < points.length; i++) {
        const sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
      }
      const bar_width = Math.floor(2.0 / 3 * min_sep);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const center_x = p.canvasx;

        ctx.fillRect(center_x - bar_width / 2, p.canvasy,
          bar_width, y_bottom - p.canvasy);

        ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
          bar_width, y_bottom - p.canvasy);
      }
    };

    const lightenColor = (colorStr, alpha = 1) => {
      var color = Dygraph.toRGB_(colorStr);
      color.r = Math.floor((255 + color.r) / 2);
      color.g = Math.floor((255 + color.g) / 2);
      color.b = Math.floor((255 + color.b) / 2);
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    };

    const darkenColor = (colorStr) => {

      var color = Dygraph.toRGB_(colorStr);
      color.r = Math.floor((0 + color.r) / 2);
      color.g = Math.floor((0 + color.g) / 2);
      color.b = Math.floor((0 + color.b) / 2);
      return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    };

    const defaultLegendFormatter = (data) => {
      if (data.x == null) {
        data.x = "";
        data.xHTML = "";
      }
      let xLabel = "Time"
      try {
        xLabel = Object.keys(data.dygraph.setIndexByName_).filter((k, i) => data.dygraph.setIndexByName_[k] == 0)[0];
      } catch (e) {}
      try {
        if (data.xHTML.contains(" ")) {
          data.xHTML = moment(data.xHTML).format("MMM D YYYY");
        }
      } catch (e) {}
      let html = `
        <div class='legend-container'>
        <div class='legend-title'>
        </div>
        <div class='legend-values'>
          <div class='legend-time'>
            <span class='legend-label'>${xLabel}</span>
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
      let data = dygraphize(
        config.model.estimations.likelihood.change_points.map((i) => config.model.dates[i]),
        config.model.estimations.likelihood.loglikelihood
      );
      options.labels = ["Time", "Loglikelihood"];
      return [data, options]
    };

    graphic_category["--change-point-residuals"] = (before_or_after) => {
      var residual = config.model.estimations[before_or_after].autoregressive_structure.residual;
      let options = default_options();
      let data = dygraphize(
        config.model.estimations.likelihood.change_points.map((i) => config.model.dates[i]),
        residual
      );
      options.labels = ["Time", "Residual"];
      return [data, options]
    };

    graphic_category["--change-point-autocorrelation"] = (before_or_after) => {
      var acf = config.model.estimations[before_or_after].autoregressive_structure.autocorrelation_function;
      let options = default_options();
      let data = dygraphize(
        acf.autocorrelation.map((_, i) => i),
        acf.autocorrelation
      );
      options.plotter = acfPlotter;
      options.labels = ["Lag", "Autocorrelation"];
      return [data, options]
    };

    graphic_category["before-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
      "before_change")
    graphic_category["after-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
      "after_change")
    graphic_category["before-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
      "before_change")
    graphic_category["after-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
      "after_change")

    self.on("update", () => {
      self.graph = new Dygraph(
        self.root.querySelector(".plot-container"),
        ...graphic_category[config.type]()
      );
    });

    self.on("mount", () => {
      self.root.style.cssText += `width: ${config.width}; height: ${config.height}; display: block;`;
      self.update();
    });
});