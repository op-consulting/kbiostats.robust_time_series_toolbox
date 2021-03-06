riot.tag2('rts-three-column-panel', '<div class="split-parent h-100 w-100"> <div class="outlinepanel-container panel-container h-100"> <rts-outline-panel class="h-100 w-100" ref="outlinepanel"></rts-outline-panel> </div> <div class="plotpanel-container panel-container h-100"> <div class="welcome-splash w-100 main-panel-container"> <img class="icon" src="../resources/images/app/app.png"> <div class="title"> Robust Time Series Toolbox </div> <div class="research-group"> KAUST Biostatistics group </div> <div> To start choose a dataset (in CSV format) and select the model parameters. </div> </div> <div class="content-container main-panel-container hidden"> <rts-data-summary ref="data_summary"></rts-data-summary> <div class="plot_container" ref="plot_container"></div> </div> <div class="paper-model-1 paper-pdf w-100 h-100 main-panel-container hidden"> <iframe class="w-100 h-100" src="./lib/pdf.js@2.0/adapted/web/viewer.html?file=../../../../../model/1707.01861.pdf#zoom=page-width&"></iframe> </div> </div> <div class="configpanel-container panel-container h-100"> <rts-configuration-panel class="h-100 w-100" ref="configpanel"></rts-configuration-panel> </div> </div>', 'rts-three-column-panel .welcome-splash.hidden,[data-is="rts-three-column-panel"] .welcome-splash.hidden{ display: none; } rts-three-column-panel .welcome-splash,[data-is="rts-three-column-panel"] .welcome-splash{ text-align: center; margin-top: 50px; font-size: 12pt; font-weight: 200; } rts-three-column-panel .welcome-splash .icon,[data-is="rts-three-column-panel"] .welcome-splash .icon{ max-width: 250px; opacity: 0.5; } rts-three-column-panel .welcome-splash .title,[data-is="rts-three-column-panel"] .welcome-splash .title{ font-size: 18pt; font-weight: 200; } rts-three-column-panel .welcome-splash .research-group,[data-is="rts-three-column-panel"] .welcome-splash .research-group{ font-size: 12pt; font-weight: normal; margin-bottom: 30px; } rts-three-column-panel .plot_container [class^=\'apexcharts\'],[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\']{ cursor: default !important; } rts-three-column-panel .plot_container .apexcharts-menu.open,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open{ background-color: #dadbdc; background-color: #f5f6f7; border: 1px solid rgba(0, 0, 0, 0.2); } rts-three-column-panel .plot_container .apexcharts-menu.open .apexcharts-menu-item,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open .apexcharts-menu-item{ margin: 1px; border: 1px solid transparent; } rts-three-column-panel .plot_container .apexcharts-menu.open .apexcharts-menu-item:hover,[data-is="rts-three-column-panel"] .plot_container .apexcharts-menu.open .apexcharts-menu-item:hover{ background-color: rgba(164, 206, 249, 0.2); border: 1px solid #a4cef9; } rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected{ border: none; box-shadow: none !important; } rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected::before,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected::before,rts-three-column-panel .plot_container [class^=\'apexcharts\'].selected::after,[data-is="rts-three-column-panel"] .plot_container [class^=\'apexcharts\'].selected::after{ display: none; } rts-three-column-panel .panel-container,[data-is="rts-three-column-panel"] .panel-container{ transitio1n: 10ms linear width; min-width: 0px !important; overflow-x: hidden; } rts-three-column-panel .panel-container.hidden,[data-is="rts-three-column-panel"] .panel-container.hidden{ } rts-three-column-panel .panel-container,[data-is="rts-three-column-panel"] .panel-container{ } rts-three-column-panel .plotpanel-container,[data-is="rts-three-column-panel"] .plotpanel-container{ overflow: auto; height: 100% !important; } rts-three-column-panel .hidden,[data-is="rts-three-column-panel"] .hidden{ display: none; } rts-three-column-panel .content-container,[data-is="rts-three-column-panel"] .content-container{ width: 80%; min-width: 700px !important; margin: 15px auto; padding: 30px; background-color: white; border: 1px solid #bbbec2; box-shadow: 0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) !important; } rts-three-column-panel .main-viewport,[data-is="rts-three-column-panel"] .main-viewport{ overflow: auto !important; display: block !important; padding: 10px; } rts-three-column-panel .outline-panel.hidden-panel,[data-is="rts-three-column-panel"] .outline-panel.hidden-panel{ width: 1px !important; max-width: 1px !important; min-width: 1px !important; transition: 600ms linear width; } rts-three-column-panel .outline-panel,[data-is="rts-three-column-panel"] .outline-panel{ min-width: 100px !important; transition: 600ms linear width; } rts-three-column-panel .main-viewport>*,[data-is="rts-three-column-panel"] .main-viewport>*{ min-width: 500px; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden{ display: none; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar{ font-family: unset; font-size: 40pt; } rts-three-column-panel .split-parent,[data-is="rts-three-column-panel"] .split-parent{ display: flex; } rts-three-column-panel .gutter,[data-is="rts-three-column-panel"] .gutter{ background-color: #dadbdc; cursor: ew-resize; background: white; border: 1px solid #dadbdc; } rts-three-column-panel .gutter.gutter-horizontal .gutter-close,[data-is="rts-three-column-panel"] .gutter.gutter-horizontal .gutter-close{ background-color: rgba(58, 139, 199, 1)!important; }', '', function(opts) {


    const self = this;
    const config = opts;

    let splitter;

    const create_splitter = (ratio_width) => {
      const PO = self.root.querySelector(".outlinepanel-container");
      const PP = self.root.querySelector(".plotpanel-container");
      const PC = self.root.querySelector(".configpanel-container");
      const containers = [PO, PP, PC];
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
      setTimeout(update_panel_widths, 10);
    };
    self.close_outline_panel = () => {
      update_panel_widths(0, "hide");
    };
    self.show_outline_panel = () => {
      update_panel_widths(0, "show");
    };
    self.close_config_panel = () => {
      update_panel_widths(2, "hide");
    };
    self.show_config_panel = () => {
      update_panel_widths(2, "show");
    };
    self.toggle_config_panel = () => {
      update_panel_widths(2);
    };
    self.toggle_outline_panel = () => {
      update_panel_widths(0);
    };
    self.change_unit_names = (unit_names) => {
      self.refs.outlinepanel.opts.unit_names = unit_names;
      self.refs.outlinepanel.update();
    };
    self.change_summary_models = (models) => {
      self.refs.data_summary.opts.models = models;
      self.refs.data_summary.update();
    };
    self.change_title_unit_choose = (title = "Units") => {
      self.refs.outlinepanel.opts.unit_title = title;
      self.refs.outlinepanel.update();
    };
    self.change_title_plot_choose = (title = "Plots") => {
      self.refs.outlinepanel.opts.plot_title = title;
      self.refs.outlinepanel.update();
    };
    self.show_main_container = () => {
      Array.from(self.root.querySelectorAll(".main-panel-container")).forEach(el => el.classList.add("hidden"));
      self.root.querySelector(".content-container").classList.remove("hidden");
    };
    self.show_paper_model_1 = () => {
      Array.from(self.root.querySelectorAll(".main-panel-container")).forEach(el => el.classList.add("hidden"));
      self.root.querySelector(".paper-model-1").classList.remove("hidden");
      iframe = self.root.querySelector(".paper-model-1 iframe").contentWindow.PDFViewerApplication.pdfViewer
        .scrollPageIntoView({
          pageNumber: 1,
          destArray: [null, {
            name: "XYZ"
          }, null, null, 'page-width'],
          allowNegativeOffset: true
        });

    };

    self.on("mount", () => {
      create_splitter([15, 70, 15]);
    });
});