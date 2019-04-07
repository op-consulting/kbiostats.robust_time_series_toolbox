riot.tag2('rts-model-plot-change-point-marker', '<div class="change-point-markers w-100"> <virtual if="{opts.change_point_information}"> <div class="data-marker"> <div class="cp-estimated-value cp-marker cp-background" riot-style="{_date_style(0, true)}"> <div>Estimated</div> <div>{moment(opts.change_point_information.estimated.value).format(⁗MMM D YYYY⁗)}</div> </div> <div class="cp-estimated-value cp-marker" riot-style="{_date_style(0)}"> <div>Estimated</div> <div>{moment(opts.change_point_information.estimated.value).format(⁗MMM D YYYY⁗)}</div> </div> <div class="cp-theoretical-value cp-marker cp-background" riot-style="{_date_style(1, true)}"> <div>Theoretical</div> <div>{moment(opts.change_point_information.theoretical.value).format(⁗MMM D YYYY⁗)}</div> </div> <div class="cp-theoretical-value cp-marker" riot-style="{_date_style(1)}"> <div>Theoretical</div> <div>{moment(opts.change_point_information.theoretical.value).format(⁗MMM D YYYY⁗)}</div> </div> </div> </virtual>', 'rts-model-plot-change-point-marker .cp-marker,[data-is="rts-model-plot-change-point-marker"] .cp-marker{ padding: 1px 5px; text-align: center; } rts-model-plot-change-point-marker .cp-marker.cp-background,[data-is="rts-model-plot-change-point-marker"] .cp-marker.cp-background{ opacity: 0.3; } rts-model-plot-change-point-marker .cp-marker.cp-background div:nth-child(1),[data-is="rts-model-plot-change-point-marker"] .cp-marker.cp-background div:nth-child(1){ filter: brightness(40%); color: transparent; } rts-model-plot-change-point-marker .cp-marker div:nth-child(1),[data-is="rts-model-plot-change-point-marker"] .cp-marker div:nth-child(1){ font-weight: 200; filter: brightness(50%); } rts-model-plot-change-point-marker .cp-marker.cp-background div:nth-child(2),[data-is="rts-model-plot-change-point-marker"] .cp-marker.cp-background div:nth-child(2){ background-color: white; filter: none; } rts-model-plot-change-point-marker .cp-marker div:nth-child(2),[data-is="rts-model-plot-change-point-marker"] .cp-marker div:nth-child(2){ filter: brightness(80%); font-weight: 600; } rts-model-plot-change-point-marker .cp-marker p,[data-is="rts-model-plot-change-point-marker"] .cp-marker p{ font-weight: bold; } rts-model-plot-change-point-marker .cp-marker,[data-is="rts-model-plot-change-point-marker"] .cp-marker{ display: block; position: absolute; } rts-model-plot-change-point-marker .change-point-markers,[data-is="rts-model-plot-change-point-marker"] .change-point-markers{ overflow: hidden; height: 40px; }', '', function(opts) {


      const self = this;
      const config = opts;

      self._date_style = (index, background=false) => {
        const y = [
          opts.change_point_information.estimated.position,
          opts.change_point_information.theoretical.position,
        ];
        const c = [
          opts.change_point_information.estimated.color,
          opts.change_point_information.theoretical.color,
        ];
        let sy = [
          `color: ${c[0]};`+ (!background?"": `background-color: ${c[0]};`),
          `color: ${c[1]};`+ (!background?"": `background-color: ${c[1]};`),
        ];
        if (y[0] < y[1]) {
          sy[0] += `right: calc(100% - ${y[0]}px - 10px);`
          sy[1] += `left: calc(${y[1]}px + 10px);`
        } else {
          sy[0] += `left: calc(${y[0]}px + 10px);`
          sy[1] += `right: calc(100% - ${y[1]}px - 10px);`
        }
        return sy[index];
      };
});
riot.tag2('rts-model-plot-legend', '<div class="plot-labels w-100"> <virtual if="{opts.legend}"> <div class="data-series" each="{legend, idx in opts.legend}"> <div class="data-series-color" riot-style="{⁗background-color:⁗ + legend.color}"> </div> <div class="data-series-label" riot-style="{⁗color:⁗ + legend.color}"> {legend.label.replace(/\\[\\[/g, ⁗(⁗).replace(/\\]\\]/g, ⁗)⁗)} </div> </div> </virtual>', 'rts-model-plot-legend .data-series,[data-is="rts-model-plot-legend"] .data-series{ display: inline-flex; } rts-model-plot-legend .data-series-color,[data-is="rts-model-plot-legend"] .data-series-color{ display: inline-block; width: 18px; height: 5px; position: relative; top: 7px; margin-left: 15px; } rts-model-plot-legend .data-series-label,[data-is="rts-model-plot-legend"] .data-series-label{ margin-left: 3px; filter: brightness(90%); }', '', function(opts) {


      const self = this;
      const config = opts;

});

riot.tag2('rts-model-plot', '<div class="simple-plot w-100 h-100"> <virtual if="{opts.toolbar}"> <div data-role="appbar" class="pos-relative z-dropdown"> <button class="button" title="Zoom reset" onclick="{zoomreset}"> <span class="ms-Icon ms-Icon--Home"></span> </button> <button class="button" title="Zoom in" onclick="{zoomin}"> <span class="ms-Icon ms-Icon--ZoomIn"></span> </button> <button class="button" title="Zoom out" onclick="{zoomout}"> <span class="ms-Icon ms-Icon--ZoomOut"></span> </button> <button id="" class="button" title="Download image" onclick="{save_image}"> <span class="ms-Icon ms-Icon--Save"></span> </button> </div> </virtual> <div class="image-container"> <virtual if="{opts.header}"> <h4 class="text-light">{opts.title_}</h4> <h5 class="text-light" if="{opts.subtitle}">{opts.subtitle}</h5> </virtual> <div class="pre-plot-container"> <rts-model-plot-change-point-marker ref="change_point_marker"></rts-model-plot-change-point-marker> <div class="plot-container"></div> <rts-model-plot-legend ref="legend" riot-style="{(opts.legend?⁗⁗: ⁗display:none;⁗)}"></rts-model-plot-legend> </div> <img class="static-image hidden"> </div> </div>', 'rts-model-plot-legend { width: 100%; text-align: right; position: absolute; bottom: -35px; } rts-model-plot .app-bar button,[data-is="rts-model-plot"] .app-bar button{ height: 34px !important; width: 34px !important; padding: 0; cursor: default; } rts-model-plot .app-bar,[data-is="rts-model-plot"] .app-bar{ text-align: left; display: block; min-height: 25px; height: 42px; padding: 3px; background: #f5f6f7; } rts-model-plot .simple-plot,[data-is="rts-model-plot"] .simple-plot{ border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-model-plot .image-container,[data-is="rts-model-plot"] .image-container{ padding-top: 10px; height: calc(100% - 70px); width: calc(100% - 30px); left: 0; } rts-model-plot .pre-plot-container,[data-is="rts-model-plot"] .pre-plot-container{ width: 100%; height: inherit; } rts-model-plot .plot-container,[data-is="rts-model-plot"] .plot-container{ height: 100% !important; width: 100% !important; max-height: 100%; min-height: 100%; min-width: 100%; max-width: 100%; position: absolute; right: 10px; left: 10px; bottom: 10px; top: 10px; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend,rts-model-plot .dygraph-legend .legend-time,[data-is="rts-model-plot"] .dygraph-legend .legend-time{ background: rgb(237, 237, 237); } rts-model-plot .dygraph-legend .legend-values,[data-is="rts-model-plot"] .dygraph-legend .legend-values{ background: #f5f6f7; } rts-model-plot .dygraph-legend,[data-is="rts-model-plot"] .dygraph-legend{ position: absolute; min-width: 100px; border: 1px solid rgb(205, 205, 205); zoom: 0.95; } rts-model-plot .legend-container,[data-is="rts-model-plot"] .legend-container{ padding: 5px; } rts-model-plot .label,[data-is="rts-model-plot"] .label{ height: 20px; padding: 5px; user-select: text; cursor: text; } rts-model-plot .legend-label,[data-is="rts-model-plot"] .legend-label{ padding-right: 5px; filter: brightness(100%); font-weight: bold; } rts-model-plot .legend-line,[data-is="rts-model-plot"] .legend-line{ min-width: 10px; display: inline-block; height: 5px; position: relative; top: -4px; } rts-model-plot *,[data-is="rts-model-plot"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; } rts-model-plot .hidden,[data-is="rts-model-plot"] .hidden{ display: none; } rts-model-plot .static-image,[data-is="rts-model-plot"] .static-image{ }', '', function(opts) {


    const self = this;
    const config = opts;
    config.width = !!config.width ? config.width : "100%";
    config.height = !!config.height ? config.height : "400px";
    config.type = !!config.type ? config.type : "plain";
    config.toolbar = typeof config.toolbar == 'undefined' ? true : config.toolbar;
    config.legend = typeof config.legend == 'undefined' ? true : config.legend;
    config.header = typeof config.header == 'undefined' ? true : config.header;
    config.title = typeof config.title == 'undefined' ? null : config.title;
    config.static_version = typeof config.static_version == 'undefined' ? false : config.static_version;

    self.change_point_information = null;

    const model = () => config.model;

    self.view_blank = () => {
      self.root.querySelector(".outline-blank-button").click();
    };

    self.view_list_unit_names = () => {
      self.root.querySelector(".unit-name-button").click();
    };

    self.view_list_plot_types = () => {
      self.root.querySelector(".plot-type-button").click();
    };

    self._zoom = (factor = 0.8, e) => {
      var r = self.graph.xAxisRange();
      console.log(r);
      var delta = 0.5 * factor * (r[1] - r[0])
      var x0 = r[0] + delta,
        x1 = r[1] - delta;
      self.graph.updateOptions({
        dateWindow: [x0, x1]
      });
      e.preventUpdate = true;
    }

    self.zoomreset = () => {
      self.graph.updateOptions({
        dateWindow: null,
        valueRange: null
      });
    }
    const zoom_factor = 0.2
    self.zoomout = (e) => self._zoom(zoom_factor / (zoom_factor - 1), e)

    self.zoomin = (e) => self._zoom(zoom_factor, e)

    self.save_image = () => {
      const require_ = require;
      const fs = require_('fs');
      const {
        dialog
      } = require_("electron").remote;
      const node = self.root.querySelector(".image-container");

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
          domtoimage.toBlob(node, {scale: 2}).then((blob) => {
            reader.onload = () => {
              fs.writeFile(file_path, new Buffer(reader.result), {}, () => {});
            }
            reader.readAsArrayBuffer(blob);
          });
        }
      });
    };

    const switch_to_static_version = () => {
      let dynamic = self.root.querySelector(".pre-plot-container");
      let img = self.root.querySelector(".static-image");
      if (!dynamic || dynamic.clientWidth == 0) return;
      var {width, height} = dynamic.getClientRects()[0];
      const factor_to_export_word = 0.7;
      const default_factor_plot_height = 1.11;
      domtoimage.toPng(dynamic, {scale: 2})
        .then(function (dataUrl) {
          img.src = dataUrl;
          img.width = width * factor_to_export_word;
          img.height = height * factor_to_export_word * default_factor_plot_height;
          img.style.cssText = `zoom: ${1/factor_to_export_word}`;
          setTimeout(() => {
            img.classList.remove("hidden")
            dynamic.classList.add("hidden")
          }, 100);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    };

    const draw_vertical_line = (ctx, color, x_c, y_0, y_1, linedash = []) => {
      ctx.beginPath();
      ctx.setLineDash(linedash);
      ctx.strokeStyle = darkenColor(color);
      ctx.moveTo(x_c, y_0);
      ctx.lineTo(x_c, y_1);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const estimatedSeriesPlotter = (colors) => {
      const _ymax = Math.max(...config.model.y) * 2;
      const _ymin = -_ymax;

      const _xestimated = config.model.dates[config.model.estimations.likelihood.best_index];
      const _xtheoretical = config.model.dates[config.model.change_point.theoretical];
      return (e) => {
        const ymax = e.dygraph.toDomYCoord(_ymax);
        const ymin = e.dygraph.toDomYCoord(_ymin);
        const xestimated = e.dygraph.toDomXCoord(_xestimated);
        const xtheoretical = e.dygraph.toDomXCoord(_xtheoretical);
        Dygraph.Plotters.fillPlotter(e);
        Dygraph.Plotters.linePlotter(e);
        const ctx = e.drawingContext;
        draw_vertical_line(ctx, colors[0], xestimated, ymin, ymax, [5, 5]);
        draw_vertical_line(ctx, colors[1], xtheoretical, ymin, ymax, [5, 5]);
        self.change_point_information = {
          estimated: {
            value: _xestimated,
            position: xestimated,
            color: colors[0],
          },
          theoretical: {
            value: _xtheoretical,
            position: xtheoretical,
            color: colors[1],
          },
        }
        if (self.refs.change_point_marker) {
          self.refs.change_point_marker.opts.change_point_information = self.change_point_information;
          self.refs.change_point_marker.update();
        }
      };
    };

    const boxPlotter = (...data) => {
      const mean = (a, b) => a + b;
      const quantiles = (x) => st.quantiles(x, [0.25, 0.5, 0.75]);
      const _properties = (x, q1, q2, q3) => [Math.min(...x), q1 - 1.5 * (q3 - q1), q1, q2, q3, q1 + 1.5 * (q3 - q1),
        Math.max(...x)
      ]
      const properties = (x) => _properties(x, ...quantiles(x))

      const data_properties = data.map((d) => properties(d));

      const draw_box_plot = (e, index) => {
        const ctx = e.drawingContext;
        const delta = 0.25;
        const color = e.dygraph.getOption("colors")[index];
        let k = 0;
        const property_values = data_properties[index];
        const y_max = e.dygraph.toDomYCoord(property_values[k++]);
        let y_q0 = e.dygraph.toDomYCoord(property_values[k++]);
        const y_q1 = e.dygraph.toDomYCoord(property_values[k++]);
        const y_q2 = e.dygraph.toDomYCoord(property_values[k++]);
        const y_q3 = e.dygraph.toDomYCoord(property_values[k++]);
        let y_q4 = e.dygraph.toDomYCoord(property_values[k++]);
        const y_min = e.dygraph.toDomYCoord(property_values[k++]);

        y_q0 = y_min;
        y_q4 = y_max;

        const x_c = e.dygraph.toDomXCoord(index);
        const x_0 = e.dygraph.toDomXCoord(index - delta);
        const x_1 = e.dygraph.toDomXCoord(index + delta);

        const radius = 4;

        draw_vertical_line(ctx, color, x_c, y_q0, y_q4);

        ctx.fillStyle = lightenColor(color, 0.2);
        ctx.fillRect(x_0, y_q3, x_1 - x_0, -y_q3 + y_q1);
        ctx.strokeStyle = darkenColor(color, 0.8);
        ctx.strokeRect(x_0, y_q3, x_1 - x_0, -y_q3 + y_q1);

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = darkenColor(color);
        ctx.moveTo(x_0, y_q2);
        ctx.lineTo(x_1, y_q2);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x_0, y_q0);
        ctx.lineTo(x_1, y_q0);
        ctx.moveTo(x_0, y_q4);
        ctx.lineTo(x_1, y_q4);
        ctx.moveTo(x_c, y_max);
        ctx.stroke();

        ctx.fillStyle = darkenColor(color, 0.8);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(x_c, y_max, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x_c, y_min);
        ctx.arc(x_c, y_min, radius, 0, Math.PI * 2, true);
        ctx.fill();

      };
      return (e) => {
        for (let index = 0; index < e.points.length; index++) {
          draw_box_plot(e, index);
        }
      };
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

    const darkenColor = (colorStr, alpha = 1) => {

      var color = Dygraph.toRGB_(colorStr);
      color.r = Math.floor((0 + color.r) / 2);
      color.g = Math.floor((0 + color.g) / 2);
      color.b = Math.floor((0 + color.b) / 2);
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
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
          const r = data.xHTML;
          data.xHTML = moment(data.xHTML).format("MMM D YYYY");
          data.xHTML = (data.xHTML != "Invalid date") ? data.xHTML : r;
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
        const labelHTML = !series.labelHTML ? "" : series.labelHTML.replace(/\[\[[\w\s-\.]+\]\]/g, "")
        html += !series.yHTML ? "" : `
          <div class='series-${index + 1} ${series.isHighlighted?'highlighted':''}'>
            <span class="legend-line" style='background-color:${series.color};'></span>
            <span class='legend-label' style='color:${series.color}; '>${labelHTML}</span>
            <span class='legend-value'>${series.yHTML}</span>
          </div>
        `
      });
      return html + "</div></div>";
    }

    self.graph = null;

    const dygraphize = (x, y) => x.map((_x, i) => [_x, y[i]])
    const dygraphize_with_index = (...x) => x[0].map((_x, i) => [i, ...(x.map((o) => o[i]))])

    const default_options = () => ({
      fillGraph: true,
      fillAlpha: 0.5,
      colors: ["#0074ce", "#b76b68", "#39812e", "#6fce00"],
      legend: 'follow',
      legendFormatter: defaultLegendFormatter,
      axes: {
        x: {
          pixelsPerLabel: 80
        }
      },
    });

    const graphic_category = {};
    const default_titles = {};

    default_titles["plain"] = "Time series"
    graphic_category["plain"] = () => {
      let options = default_options();
      let data = dygraphize(config.model.dates, config.model.y);
      options.labels = ["Time", "Observed value"];
      return [data, options]
    };

    default_titles["estimation"] = "Estimated time series"
    graphic_category["estimation"] = () => {
      const change_point_index = config.model.estimations.likelihood.best_index;
      let period_model = config.model.estimations.after_change;
      let estimated_change_point = config.model.dates[change_point_index];
      let theoretical_change_point = config.model.dates[config.model.change_point.theoretical];

      let after_model = config.model.estimations.after_change.mean_structure;
      let before_model = config.model.estimations.before_change.mean_structure;
      let line_before = (t) => (t - change_point_index <= 0) ? (before_model.intercept + before_model.slope * t) :
        null;
      let line_after = (t) => (t - change_point_index < 0) ? null : (after_model.intercept + after_model.slope * t);

      let labels = ["Time", "Observed value", "Estimated value [[before change-point]]",
        "Estimated value [[after change-point]]"
      ];
      let options = default_options();
      options.series = {};
      options.series[labels[1]] = {
        fillAlpha: 0.3
      };
      options.series[labels[2]] = {
        fillAlpha: 0.5
      };
      options.series[labels[3]] = {
        fillAlpha: 0.5
      };
      let data = (x, d, y) => x.map((_x, idx) => [d[idx], y[idx], line_before(x[idx], y[idx]), line_after(x[idx], y[
        idx])]);
      data = data(config.model.x, config.model.dates, config.model.y);
      options.labels = labels;
      options.plotter = estimatedSeriesPlotter([options.colors[1], options.colors[0]]);
      return [data, options]
    };

    default_titles["loglikelihood"] = "Log-likelihood"
    graphic_category["loglikelihood"] = () => {
      let options = default_options();
      let data = dygraphize(
        config.model.estimations.likelihood.change_points.map((i) => config.model.dates[i]),
        config.model.estimations.likelihood.loglikelihood
      );
      options.labels = ["Time", "Loglikelihood"];
      return [data, options]
    };

    graphic_category["--change-point-residuals"] = (before_or_after, color_index) => {
      var residual = config.model.estimations[before_or_after].autoregressive_structure.residual;
      let options = default_options();
      let data = dygraphize(
        config.model.estimations.likelihood.change_points.map((i) => config.model.dates[i]),
        residual
      );
      options.colors = [options.colors[color_index + 1], ...options.colors];
      options.labels = ["Time", "Residual"];
      return [data, options]
    };

    graphic_category["--change-point-autocorrelation"] = (before_or_after, color_index) => {
      var acf = config.model.estimations[before_or_after].autoregressive_structure.autocorrelation_function;
      let options = default_options();
      let data = dygraphize(
        acf.autocorrelation.map((_, i) => i),
        acf.autocorrelation
      );
      options.colors = [options.colors[color_index + 1], ...options.colors];
      options.plotter = acfPlotter;
      options.labels = ["Lag", "Autocorrelation"];
      return [data, options]
    };

    default_titles["box-plot-residuals"] = "Box plot of the residuals"
    graphic_category["box-plot-residuals"] = () => {
      const messages = [
        'Before intervention',
        'After intervention',
      ];
      var pre_residual = config.model.estimations.before_change.autoregressive_structure.residual;
      var post_residual = config.model.estimations.after_change.autoregressive_structure.residual;
      let options = default_options();
      options.colors = [options.colors[1], options.colors[2], ...options.colors];

      let data = [
        [0, st.mean(pre_residual)],
        [1, st.mean(post_residual)],
      ]
      options.plotter = boxPlotter(pre_residual, post_residual);
      options.dateWindow = [-0.5, 1.5];
      options.valueRange = [Math.min(...[...pre_residual, ...post_residual]), Math.max(...[...pre_residual, ...
        post_residual
      ])];
      const delta = options.valueRange[1] - options.valueRange[0]
      options.valueRange[0] -= delta
      options.valueRange[1] += delta

      console.log(options.valueRange, "$$$$$$$$$$$")

      options.axes = {
        x: {},
        y: {}
      }

      options.axes.x.valueFormatter = (d) => d == 0 ? messages[0] : (d == 1 ? messages[1] : ".");

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

    default_titles["before-change-point-autocorrelation"] = "Autocorrelation function (before change-point)"
    graphic_category["before-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
      "before_change", 0)

    default_titles["after-change-point-autocorrelation"] = "Autocorrelation function (after change-point)"
    graphic_category["after-change-point-autocorrelation"] = () => graphic_category["--change-point-autocorrelation"](
      "after_change", 1)

    default_titles["before-change-point-residuals"] = "Residuals (before change-point)"
    graphic_category["before-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
      "before_change", 0)

    default_titles["after-change-point-residuals"] = "Residuals (after change-point)"
    graphic_category["after-change-point-residuals"] = () => graphic_category["--change-point-residuals"](
      "after_change", 1)

    self.on("update", () => {

      if (!opts.static_version || self.root.querySelectorAll(".static-image.hidden").length == 1) {
        self.graph = new Dygraph(
          self.root.querySelector(".plot-container"),
          ...graphic_category[config.type]()
        );
      }

      const types_with_no_legend = ["box-plot-residuals", ];
      if (!types_with_no_legend.contains(config.type) && self.refs.legend) {
        self.refs.legend.opts.legend = Object.keys(self.graph.colorsMap_).map((k, i) => ({
          "label": k,
          "color": self.graph.colorsMap_[k]
        }));
      }
      if (opts.static_version) {
        switch_to_static_version();
      }
    });

    self.on("mount", () => {
      config.title_ = config.title != null ? config.title : default_titles[config.type];
      self.root.style.cssText += `width: ${config.width}; height: ${config.height}; display: block;`;
      self.update();
    });
});