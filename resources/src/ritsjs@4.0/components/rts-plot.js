riot.tag2('rts-plot', '<div class="simple-plot w-100 h-100"> <div data-role="appbar" class="pos-relative z-dropdown"> <button id="" class="button" title="Zoom in" onclick="{zoomin}"> <span class="mif-zoom-in"></span> </button> <button id="" class="button" title="Zoom out" onclick="{zoomout}"> <span class="mif-zoom-out"></span> </button> <button id="" class="button" title="Zoom reset" onclick="{zoomreset}"> <span class="mif-home"></span> </button> </div> <div class="plot-container"></div> </div>', 'rts-plot .app-bar button,[data-is="rts-plot"] .app-bar button{ height: 34px !important; width: 34px !important; padding: 0; cursor: default; } rts-plot .app-bar,[data-is="rts-plot"] .app-bar{ text-align: left; display: block; min-height: 25px; height: 42px; padding: 3px; background: #f5f6f7; } rts-plot .simple-plot,[data-is="rts-plot"] .simple-plot{ border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-plot .plot-container,[data-is="rts-plot"] .plot-container{ padding-top: 10px; height: calc(100% - 70px); width: calc(100% - 30px); left: 0; } rts-plot .dygraph-legend,[data-is="rts-plot"] .dygraph-legend,rts-plot .dygraph-legend .legend-time,[data-is="rts-plot"] .dygraph-legend .legend-time{ background: rgb(237, 237, 237); } rts-plot .dygraph-legend .legend-values,[data-is="rts-plot"] .dygraph-legend .legend-values{ background: #f5f6f7; } rts-plot .dygraph-legend,[data-is="rts-plot"] .dygraph-legend{ position: absolute; width: 100px; border: 1px solid rgb(205, 205, 205); zoom: 0.8; } rts-plot .legend-container,[data-is="rts-plot"] .legend-container{ padding: 5px; } rts-plot .label,[data-is="rts-plot"] .label{ height: 20px; padding: 5px; user-select: text; cursor: text; } rts-plot .legend-label,[data-is="rts-plot"] .legend-label{ padding-right: 5px; filter: brightness(100%); font-weight: bold; } rts-plot .legend-line,[data-is="rts-plot"] .legend-line{ min-width: 10px; display: inline-block; height: 5px; position: relative; top: -4px; } rts-plot *,[data-is="rts-plot"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.width = !!config.width ? config.width : "100%";
    config.height = !!config.height ? config.height : "400px";

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
      var x0 = r[0] + delta, x1 = r[1] - delta;
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

      if(i<50) {
        gdata += i + "," + Math.random() + "," + "\n";
      }else{
        gdata += i + "," + "," + 0.5 * Math.random() + "\n";
      }
    }

    const legendFormatter = (data) => {
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

    self.on("mount", () => {
      self.root.style.cssText += `width: ${config.width}; height: ${config.height}; display: block;`
      self.graph = new Dygraph(
        self.root.querySelector(".plot-container"),
        gdata, {
          fillGraph: true,
          fillAlpha: 0.5,
          colors: ["#0074ce", "#6fce00"],
          series: {
            Y2: {
              fillAlpha: 0.4
            }
          },

          legend: 'follow',

          legendFormatter: legendFormatter,
        }
      );
    });
});