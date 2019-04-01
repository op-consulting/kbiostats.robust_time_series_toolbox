riot.tag2('rts-plot', '<div class="simple-plot w-100 h-100"> <div data-role="appbar" class="pos-relative z-dropdown"> <button id="print" class="button pageDown" title="Print"> <span class="mif-printer"></span> </button> </div> <div class="plot-container"></div> </div>', 'rts-plot .app-bar button,[data-is="rts-plot"] .app-bar button{ height: 34px !important; width: 34px !important; padding: 0; cursor: default; } rts-plot .app-bar,[data-is="rts-plot"] .app-bar{ text-align: left; display: block; min-height: 25px; height: 42px; padding: 3px; background: #f5f6f7; } rts-plot .simple-plot,[data-is="rts-plot"] .simple-plot{ border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-plot .plot-container,[data-is="rts-plot"] .plot-container{ padding-top: 10px; height: calc(100% - 70px); width: calc(100% - 30px); left: 0; } rts-plot .dygraph-legend,[data-is="rts-plot"] .dygraph-legend,rts-plot .dygraph-legend .legend-time,[data-is="rts-plot"] .dygraph-legend .legend-time{ background: rgb(237, 237, 237); } rts-plot .dygraph-legend .legend-values,[data-is="rts-plot"] .dygraph-legend .legend-values{ background: #f5f6f7; } rts-plot .dygraph-legend,[data-is="rts-plot"] .dygraph-legend{ position: absolute; width: 100px; border: 1px solid rgb(205, 205, 205); zoom: 0.8; } rts-plot .legend-container,[data-is="rts-plot"] .legend-container{ padding: 5px; } rts-plot .label,[data-is="rts-plot"] .label{ height: 20px; padding: 5px; user-select: text; cursor: text; } rts-plot .legend-label,[data-is="rts-plot"] .legend-label{ padding-right: 5px; filter: brightness(100%); font-weight: bold; } rts-plot *,[data-is="rts-plot"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; }', '', function(opts) {


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

    var gdata = "X,Y1,Y2\n";
    for (var i = 0; i < 100; i++) {

      gdata += i + "," + Math.random() + "," + 0.5 * Math.random() + "\n";
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
            <span class='legend-label' style='color:${series.color}; '>${series.labelHTML}</span>
            <span class='legend-value'>${series.yHTML}</span>
          </div>
        `
      });
      return html + "</div></div>";
    }

    self.on("mount", () => {
      self.root.style.cssText += `width: ${config.width}; height: ${config.height}; display: block;`
      var g3 = new Dygraph(
        self.root.querySelector(".plot-container"),
        gdata, {
          fillGraph: true,
          fillAlpha: 0.9,
          series: {
            Y2: {
              fillAlpha: 0.1
            }
          },

          legend: 'follow',
          legendFormatter: legendFormatter,
        }
      );
    });
});