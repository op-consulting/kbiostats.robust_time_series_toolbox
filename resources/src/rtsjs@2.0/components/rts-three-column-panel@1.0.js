riot.tag2('example-annot', '<div> <h2>Hairlines Demo</h2> <p>Click the chart to add a hairline. Drag the hairline to move it.</p> <p>Click a point to add an editable annotation. Drag it to move it up/down.</p> <div id="hairline-template" class="hairline-info" style="display:none"> <button class="hairline-kill-button">Kill</button> <div class="hairline-legend"></div> </div> <div id="annotation-template" class="annotation-info" style="display:none"> </div> <div id="annotation-editable-template" class="annotation-info" style="display:none"> <button class="annotation-kill-button">Delete</button> <button class="annotation-update">Change</button> <button class="annotation-cancel">Cancel</button><br> <input dg-ann-field="text" type="text" size="30"> </div> <div id="demodiv"></div> <div id="status"></div> <div id="controls"> <input type="checkbox" id="update" checked="true"><label for="update"> Update</label> <button id="add-button">Add a Hairline</button> <button id="remove-button">Remove a Hairline</button> <button id="reset-button">Reset Hairlines</button> <br> Hairline mode: <input type="radio" name="hairline-mode" id="hairline-interpolated" checked="true"> <label for="hairline-interpolated"> Interpolated</label> <input type="radio" name="hairline-mode" id="hairline-closest"> <label for="hairline-closest"> Closest</label> <p>Learn more about the <a href="https://docs.google.com/document/d/1OHNE8BNNmMtFlRQ969DACIYIJ9VVJ7w3dSPRJDEeIew/edit">Hairlines/Super-annotations plugins and their APIs</a>.</p> </div> </div>', 'example-annot #demodiv,[data-is="example-annot"] #demodiv{ position: absolute; left: 10px; right: 200px; height: 400px; display: inline-block; } example-annot #status,[data-is="example-annot"] #status{ position: absolute; right: 10px; width: 180px; height: 400px; display: inline-block; } example-annot #controls,[data-is="example-annot"] #controls{ position: absolute; left: 10px; margin-top: 420px; } example-annot .hairline-info,[data-is="example-annot"] .hairline-info{ border: 1px solid black; border-top-right-radius: 5px; border-bottom-right-radius: 5px; display: table; min-width: 100px; z-index: 10; padding: 3px; background: white; font-size: 14px; cursor: move; } example-annot .dygraph-hairline,[data-is="example-annot"] .dygraph-hairline{ cursor: move; } example-annot .dygraph-hairline.selected div,[data-is="example-annot"] .dygraph-hairline.selected div{ left: 2px !important; width: 2px !important; } example-annot .hairline-info.selected,[data-is="example-annot"] .hairline-info.selected{ border: 2px solid black; padding: 2px; } example-annot .annotation-info,[data-is="example-annot"] .annotation-info{ background: white; border-width: 1px; border-style: solid; padding: 4px; display: table; box-shadow: 0 0 4px gray; cursor: move; min-width: 120px; } example-annot .annotation-info.editable,[data-is="example-annot"] .annotation-info.editable{ min-width: 180px; } example-annot .dygraph-annotation-line,[data-is="example-annot"] .dygraph-annotation-line{ box-shadow: 0 0 4px gray; }', '', function(opts) {
    this.on("mount", () => {
      jQuery(document).on('keyup', '.annotation-info input', function(e) {
      var jQueryannotationDiv = jQuery(this).parent('.annotation-info');
      if (e.keyCode == 13 || e.keyCode == 10) {  // enter
        jQueryannotationDiv.find('.annotation-update').click();
      } else if (e.keyCode == 27) {  // escape
        jQueryannotationDiv.find('.annotation-cancel').click();
      }
    })
    .on('dblclick', '.annotation-info', function(e) {
      if (e.target.tagName == 'INPUT') return;
      jQuery(this).find('.annotation-cancel').click();
    });

      var last_t = 0;
      var data = [];
      var fn = function(t) {
        return Math.sin(Math.PI/180 * t * 4);
      };
      for (; last_t < 200; last_t++) {
        data.push([last_t, fn(last_t)]);
      }

      hairlines = new Dygraph.Plugins.Hairlines({
        divFiller: function(div, data) {
          // This behavior is identical to what you'd get if you didn't set
          // this option. It illustrates how to write a 'divFiller'.
          var html = Dygraph.Plugins.Legend.generateLegendHTML(
              data.dygraph, data.hairline.xval, data.points, 10);
          jQuery('.hairline-legend', div).html(html);
          jQuery(div).data({xval: data.hairline.xval});  // see .hover() below.
        }
      });
      annotations = new Dygraph.Plugins.SuperAnnotations({
        defaultAnnotationProperties: {
          'text': 'Annotation Description'
        }
      });
      g = new Dygraph(
              document.getElementById("demodiv"),
              data,
              {
                labelsDiv: document.getElementById('status'),
                labelsSeparateLines: true,
                legend: 'always',
                labels: [ 'Time', 'Value' ],

                axes: {
                  x: {
                    valueFormatter: function(val) {
                      return val.toFixed(2);
                    }
                  },
                  y: {
                    pixelsPerLabel: 50
                  }
                },

                // Set the plug-ins in the options.
                plugins : [
                  annotations,
                  hairlines
                ]
              }
          );

      var shouldUpdate = true;
      var update = function() {
        if (!shouldUpdate) return;
        data.push([last_t, fn(last_t)]);
        last_t++;
        data.splice(0, 1);
        g.updateOptions({file: data});
      };
      window.setInterval(update, 1000);

      // Control handlers
      jQuery('#update').on('change', function() {
        shouldUpdate = jQuery(this).is(':checked');
      });

      jQuery('#add-button').on('click', function(e) {
        var h = hairlines.get();
        h.push({xval: 137});
        hairlines.set(h);
      });
      jQuery('#remove-button').on('click', function(e) {
        var h = hairlines.get();
        if (h.length > 0) {
          var idx = Math.floor(h.length / 2);
          h.splice(idx, 1);
        }
        hairlines.set(h);
      });
      jQuery('#reset-button').on('click', function(e) {
        setDefaultState();
      });
      function setHairlineModeRadio() {
        var hs = hairlines.get();
        if (hs.length) {
          var interpolated = hs[0].interpolated;
          jQuery('#hairline-interpolated').prop('checked', interpolated);
          jQuery('#hairline-closest').prop('checked', !interpolated);
        }
      }
      jQuery('[name=hairline-mode]').change(function() {
        var interpolated = jQuery('#hairline-interpolated').is(':checked');
        var hs = hairlines.get();
        for (var i = 0; i < hs.length; i++) {
          hs[i].interpolated = interpolated;
        }
        hairlines.set(hs);
      });

      // Persistence
      function loadFromStorage() {
        hairlines.set(JSON.parse(localStorage.getItem('hairlines')));
        annotations.set(JSON.parse(localStorage.getItem('annotations')));
        setHairlineModeRadio();
      }
      jQuery(hairlines).on('hairlinesChanged', function(e) {
        localStorage.setItem('hairlines', JSON.stringify(hairlines.get()));
        setHairlineModeRadio();
      });
      jQuery(annotations).on('annotationsChanged', function(e) {
        localStorage.setItem('annotations', JSON.stringify(annotations.get()));
      });
      function setDefaultState() {
        // triggers 'hairlinesChanged' and 'annotationsChanged' events, above.
        hairlines.set([{xval: 55}]);
        annotations.set([{
          xval: 67,
          series: 'Value',
          text: 'Bottom'
        },
        {
          xval: 137,
          series: 'Value',
          text: 'Fast Change'
        }]);
      }

      if (!localStorage.getItem('hairlines') ||
          !localStorage.getItem('annotations')) {
        setDefaultState();
      } else {
        loadFromStorage();
      }

      // Set focus on text box when you edit an annotation.
      jQuery(annotations).on('beganEditAnnotation', function(e, a) {
        jQuery('input[type=text]', a.infoDiv).focus();
      });

      // Select/Deselect hairlines on click.
      jQuery(document).on('click', '.hairline-info', function() {
        console.log('click');
        var xval = jQuery(this).data('xval');
        var hs = hairlines.get();
        for (var i = 0; i < hs.length; i++) {
          if (hs[i].xval == xval) {
            hs[i].selected = !hs[i].selected;
          }
        }
        hairlines.set(hs);
      });

      // Demonstration of how to use various other event listeners
      jQuery(hairlines).on({
        'hairlineMoved': function(e, data) {
          // console.log('hairline moved from', data.oldXVal, ' to ', data.newXVal);
        },
        'hairlineCreated': function(e, data) {
          console.log('hairline created at ', data.xval);
        },
        'hairlineDeleted': function(e, data) {
          console.log('hairline deleted at ', data.xval);
        }
      });
      jQuery(annotations).on({
        'annotationCreated': function(e, data) {
          console.log('annotation created at ', data.series, data.xval);
        },
        'annotationMoved': function(e, data) {
          console.log('annotation moved from ', data.oldYFrac, ' to ', data.newYFrac);
        },
        'annotationDeleted': function(e, data) {
          console.log('annotation deleted at ', data.series, data.xval);
        },
        'annotationEdited': function(e, data) {
          console.log('edited annotation at ', data.series, data.xval);
        },
        'cancelEditAnnotation': function(e, data) {
          console.log('edit canceled on annotation at ', data.series, data.xval);
        }
      });
    })
      // TODO(danvk): demonstrate other annotations API methods.
});

riot.tag2('rts-three-column-panel', '<div class="split-parent h-100 w-100"> <div class="outlinepanel-container panel-container h-100"> <rts-outline-panel class="h-100 w-100" ref="outlinepanel"></rts-outline-panel> <rts-configuration-panel class="h-100 w-100" ref="configpanel"></rts-configuration-panel> </div> <div class="plotpanel-container panel-container h-100"> <div class="welcome-splash w-100 main-panel-container"> <img class="icon" src="../resources/images/app/app.png"> <div class="title"> Robust Time Series Toolbox </div> <div class="research-group"> KAUST Biostatistics group </div> <div> To start choose a dataset (in CSV format) and select the model parameters. </div> </div> <div class="plot-container main-panel-container paper-style hidden"> <rts-plot-collection ref="plot_collection"></rts-plot-collection> </div> <div class="content-container main-panel-container paper-style hidden"> <rts-data-summary ref="data_summary"></rts-data-summary> </div> <div class="paper-model-1 paper-pdf w-100 h-100 main-panel-container hidden"> <iframe class="w-100 h-100" src="./lib/pdf.js@2.0/adapted/web/viewer.html?file=../../../../../model/1707.01861.pdf#zoom=page-width&"></iframe> </div> <div class="report-container main-panel-container paper-style hidden"> <rts-report ref="full_data_report"></rts-report> </div> </div> <div class="configpanel-container panel-container h-100"> </div> </div>', 'rts-three-column-panel .welcome-splash.hidden,[data-is="rts-three-column-panel"] .welcome-splash.hidden{ display: none; } rts-three-column-panel .welcome-splash,[data-is="rts-three-column-panel"] .welcome-splash{ text-align: center; margin-top: 50px; font-size: 12pt; font-weight: 200; } rts-three-column-panel .welcome-splash .icon,[data-is="rts-three-column-panel"] .welcome-splash .icon{ max-width: 250px; opacity: 0.5; } rts-three-column-panel .welcome-splash .title,[data-is="rts-three-column-panel"] .welcome-splash .title{ font-size: 18pt; font-weight: 200; } rts-three-column-panel .welcome-splash .research-group,[data-is="rts-three-column-panel"] .welcome-splash .research-group{ font-size: 12pt; font-weight: normal; margin-bottom: 30px; } rts-three-column-panel .plot_container [class^=\'apexcharts\'],[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\']{ cursor: default !important; } rts-three-column-panel .plot_container .apexcharts-menu.open,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open{ background-color: #dadbdc; background-color: #f5f6f7; border: 1px solid rgba(0, 0, 0, 0.2); } rts-three-column-panel .plot_container .apexcharts-menu.open .apexcharts-menu-item,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open .apexcharts-menu-item{ margin: 1px; border: 1px solid transparent; } rts-three-column-panel .plot_container .apexcharts-menu.open .apexcharts-menu-item:hover,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open .apexcharts-menu-item:hover{ background-color: rgba(164, 206, 249, 0.2); border: 1px solid #a4cef9; } rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected{ border: none; box-shadow: none !important; } rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected::before,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected::before,rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected::after,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected::after{ display: none; } rts-three-column-panel .outlinepanel-container,[data-is="rts-three-column-panel"] .outlinepanel-container{ overflow: hidden; } rts-three-column-panel .panel-container,[data-is="rts-three-column-panel"] .panel-container{ transitio1n: 10ms linear width; min-width: 0px !important; overflow-x: hidden; } rts-three-column-panel .panel-container.hidden,[data-is="rts-three-column-panel"] .panel-container.hidden{ } rts-three-column-panel .panel-container,[data-is="rts-three-column-panel"] .panel-container{ } rts-three-column-panel .plotpanel-container,[data-is="rts-three-column-panel"] .plotpanel-container{ overflow: auto; height: 100% !important; } rts-three-column-panel .hidden,[data-is="rts-three-column-panel"] .hidden{ display: none; } rts-three-column-panel .content-container,[data-is="rts-three-column-panel"] .content-container{} rts-three-column-panel .paper-style,[data-is="rts-three-column-panel"] .paper-style{ background-color: white; border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; min-width: 700px !important; width: 80%; position: relative; margin: 15px auto; margin-bottom: 40px; padding: 30px; } rts-three-column-panel .main-viewport,[data-is="rts-three-column-panel"] .main-viewport{ overflow: auto !important; display: block !important; padding: 10px; } rts-three-column-panel .outline-panel.hidden-panel,[data-is="rts-three-column-panel"] .outline-panel.hidden-panel{ width: 1px !important; max-width: 1px !important; min-width: 1px !important; transition: 600ms linear width; } rts-three-column-panel .outline-panel,[data-is="rts-three-column-panel"] .outline-panel{ min-width: 100px !important; transition: 600ms linear width; } rts-three-column-panel .main-viewport>*,[data-is="rts-three-column-panel"] .main-viewport>*{ min-width: 500px; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden{ display: none; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar{ font-family: unset; font-size: 40pt; } rts-three-column-panel .split-parent,[data-is="rts-three-column-panel"] .split-parent{ display: flex; } rts-three-column-panel .gutter,[data-is="rts-three-column-panel"] .gutter{ background-color: #dadbdc; cursor: ew-resize; background: white; border: 1px solid #dadbdc; } rts-three-column-panel .gutter.gutter-horizontal .gutter-close,[data-is="rts-three-column-panel"] .gutter.gutter-horizontal .gutter-close{ background-color: rgba(58, 139, 199, 1) !important; } rts-three-column-panel .gutter.gutter-horizontal.gutter-2,[data-is="rts-three-column-panel"] .gutter.gutter-horizontal.gutter-2{ display: none; } rts-three-column-panel .plotpanel-container.panel-container,[data-is="rts-three-column-panel"] .plotpanel-container.panel-container{ margin-left: 5px; } rts-three-column-panel .outlinepanel-container [ref="outlinepanel"],[data-is="rts-three-column-panel"] .outlinepanel-container [ref="outlinepanel"],rts-three-column-panel .outlinepanel-container [ref="configpanel"],[data-is="rts-three-column-panel"] .outlinepanel-container [ref="configpanel"]{ position: absolute; top: 0; left: 0; }', '', function(opts) {


    const self = this;
    const config = opts;

    let splitter;

    const create_splitter = (ratio_width) => {
      const PO = self.root.querySelector(".outlinepanel-container");
      const PP = self.root.querySelector(".plotpanel-container");
      const PC = self.root.querySelector(".configpanel-container");
      const containers = [PO, PP, PC];

      ratio_width[1] += ratio_width[2];
      ratio_width[2] = 0;

      splitter = Split(containers, {
        sizes: ratio_width,
        minSize: [250, 250, 250].map((c, i) => Math.abs(ratio_width[i] - 0) < 1e-3 ? 0 : c),
        expanedToMin: true,
        gutter: function (index, direction) {
          let gutter = document.createElement('div')
          gutter.className = 'gutter gutter-' + direction + ' gutter-' + index
          gutter.style.height = '100%'
          let gutter_close = document.createElement('div')
          gutter_close.className = 'gutter-close'
          gutter_close.style.cssText = `
                        height: 10%;
                        width: 200%;
                        background-color: rgba(0, 0, 0, 0.5);
                        position: absolute;
                        top: 45%;
                        right: 0px;
                        cursor: cell;
                    `;
          gutter.appendChild(gutter_close);
          gutter_close.onclick = (index == 1) ? self.toggle_outline_panel : self
            .toggle_config_panel;
          return gutter
        },
        gutterSize: 4.5,
      });
    };
    const update_panel_widths = (index, action) => {
      action = !!action ? action : "show-hide";
      if (index == 1) return;
      const PO = self.root.querySelector(".outlinepanel-container");
      const PP = self.root.querySelector(".plotpanel-container");
      const PC = self.root.querySelector(".configpanel-container");
      const containers = [PO, PP, PC];
      let widths = containers.map((e) => e.clientWidth);
      const total_width = widths.reduce((a, b) => a + b)
      if (widths[index] > 0 && action.contains("hide")) {
        widths[1] += widths[index];
        widths[index] = 0;
      } else if (action.contains("show")) {
        widths[1] -= 150;
        widths[index] = 150;
      }
      const ratio_width = widths.map((e) => e * 100.0 / total_width);
      splitter.destroy();
      create_splitter(ratio_width);
      window.dispatchEvent(new Event('resize'));
    };
    const panel_visibility = (selector, action) => {
      self.root.querySelector(selector).classList[action]("hidden");

    };
    self.close_outline_panel = () => {
      panel_visibility('[ref="outlinepanel"]', "add")
      panel_visibility('[ref="configpanel"]', "add")

    };
    self.show_outline_panel = () => {
      panel_visibility('[ref="outlinepanel"]', "remove")
      panel_visibility('[ref="configpanel"]', "add")

    };
    self.close_config_panel = () => {
      panel_visibility('[ref="outlinepanel"]', "add")
      panel_visibility('[ref="configpanel"]', "add")

    };
    self.show_config_panel = () => {
      panel_visibility('[ref="configpanel"]', "remove")
      panel_visibility('[ref="outlinepanel"]', "add")

    };
    self.toggle_config_panel = () => {
      update_panel_widths(2);
      throw new Error("Not implemented")
    };
    self.toggle_outline_panel = () => {
      update_panel_widths(0);
      throw new Error("Not implemented")
    };
    self.change_unit_names = (unit_names) => {
      self.refs.outlinepanel.opts.unit_names = unit_names;
      self.refs.outlinepanel.update();
    };
    self.change_summary_models = (models) => {
      self.refs.data_summary.opts.models = models;
      self.refs.data_summary.update();
    };
    self.change_report_models = (models) => {
      self.refs.full_data_report.opts.models = models;
      self.refs.full_data_report.update();
    };
    self.change_title_unit_choose = (title = "Units") => {
      self.refs.outlinepanel.opts.unit_title = title;
      self.refs.outlinepanel.update();
    };
    self.change_title_plot_choose = (title = "Plots") => {
      self.refs.outlinepanel.opts.plot_title = title;
      self.refs.outlinepanel.update();
    };
    self.show_main_panel = (selector) => {
      Array.from(self.root.querySelectorAll(".main-panel-container")).forEach(el => el.classList.add("hidden"));
      self.root.querySelector(selector).classList.remove("hidden");
    };

    self.show_filtered_plots = (unitindex, unitname, plot_types) => {

      self.show_main_panel(".plot-container");
      self.refs.plot_collection.update()
      self.refs.plot_collection.opts.plots = plot_types.map((plot_type) => ({
        index: unitindex - 1,
        type: plot_type,
        title: null,
        subtitle: `Unit: '${unitname}'`,
      }));
      self.refs.plot_collection.update()
    };
    self.show_main_container = () => {
      self.show_main_panel(".content-container");
    };
    self.show_paper_model_1 = () => {
      self.show_main_panel(".paper-model-1");
      iframe = self.root.querySelector(".paper-model-1 iframe").contentWindow.PDFViewerApplication.pdfViewer
        .scrollPageIntoView({
          pageNumber: 1,
          destArray: [null, {
            name: "XYZ"
          }, null, null, 'page-width'],
          allowNegativeOffset: true
        });

    };

    self.show_full_report = () => {
      self.show_main_panel(".report-container");
      self.refs.full_data_report.update();
    };

    self.save_full_report_as_docx = () => {
      self.show_main_panel(".report-container");
      self.refs.full_data_report.update();
      self.refs.full_data_report.save_as_docx();
    };

    self.save_full_report_as_pdf = () => {
      self.show_main_panel(".report-container");
      self.refs.full_data_report.update();
      console.error("Not implemented!");
    };

    self.on("mount", () => {
      create_splitter([15, 70, 15]);
    });
});