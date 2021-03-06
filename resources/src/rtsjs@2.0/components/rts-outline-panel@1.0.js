riot.tag2('rts-outline-panel', '<div class="container-fluid p-0 h-100"> <ul class="headers" data-role="tabs" data-expand="true"> <li class="active"><a class="outline-blank-button" href="#outline-panel-blank">Default</a></li> <li><a class="unit-name-button" href="#outline-units">Unit names</a></li> <li><a class="plot-type-button" href="#outline-plots">Type of plots</a></li> </ul> <div class="h-100" style="background-color: #f5f6f7;"> <div id="outline-panel-blank" class="h-100 w-100 tab"> </div> <div id="outline-plots" class="h-100"> <rts-outline-plots-panel ref="plots" title="{opts.plot_title}"></rts-outline-plots-panel> </div> <div id="outline-units" class="h-100"> <rts-outline-units-panel ref="units" unit_names="{opts.unit_names}" title="{opts.unit_title}"></rts-outline-units-panel> </div> </div> </div>', 'rts-outline-panel ul.tabs-list.headers,[data-is="rts-outline-panel"] ul.tabs-list.headers{ display: none !important; } rts-outline-panel .panel-title,[data-is="rts-outline-panel"] .panel-title{ background-color: rgba(58, 139, 199, 1); color: white; padding: 5px 5px; font-size: 12px; } rts-outline-panel *,[data-is="rts-outline-panel"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; }', '', function(opts) {


        const self = this;
        const config = opts;
        config.unit_names = !!config.unit_names ? config.unit_names : [];
        config.unit_title = !!config.unit_title ? config.unit_title : "Units";
        config.plot_title = !!config.plot_title ? config.plot_title : "Type of plots";

        const open_this_panel = () => {
            if(self.parent && self.parent.show_left_panel)
                self.parent.show_left_panel();
        };

        self.view_blank = () => {
            open_this_panel();
            self.set_blank();
        };

        self.set_blank = () => {
            self.root.querySelector(".outline-blank-button").click();
        };

        self.view_list_unit_names = () => {
            open_this_panel();
            self.root.querySelector(".unit-name-button").click();
        };

        self.view_list_plot_types = () => {
            open_this_panel();
            self.root.querySelector(".plot-type-button").click();
        };

        self.on("mount", () => {});
});