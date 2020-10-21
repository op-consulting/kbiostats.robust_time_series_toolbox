riot.tag2('rts-configuration-panel', '<div class="container-fluid p-0 h-100"> <ul class="headers" data-role="tabs" data-expand="true"> <li class="active"><a href="#config-panel-blank">Default</a></li> <li><a class="date-settings-button" href="#date-settings">Date settings</a></li> <li><a class="change-point-settings-button" href="#change-point-settings">Change-point settings</a></li> </ul> <div class="h-100" style="background-color: #f5f6f7;"> <div id="config-panel-blank" class="h-100 w-100 tab"> </div> <div id="date-settings" class="h-100 tab"> <rts-configuration-date-panel ref="date"></rts-configuration-date-panel> </div> <div id="change-point-settings" class="h-100 tab"> <rts-configuration-changepoint-panel ref="changepoint"></rts-configuration-changepoint-panel> </div> </div> </div>', 'rts-configuration-panel ul.tabs-list.headers,[data-is="rts-configuration-panel"] ul.tabs-list.headers{ display: none!important; } rts-configuration-panel .input.calendar-picker,[data-is="rts-configuration-panel"] .input.calendar-picker{ left: 0; } rts-configuration-panel input[data-validate],[data-is="rts-configuration-panel"] input[data-validate],rts-configuration-panel .input,[data-is="rts-configuration-panel"] .input{ zoom: 0.8; } rts-configuration-panel .input.calendar-picker .calendar,[data-is="rts-configuration-panel"] .input.calendar-picker .calendar{ top: 100% !important; bottom: unset !important; z-index: 500000 !important; } rts-configuration-panel *,[data-is="rts-configuration-panel"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; } rts-configuration-panel .tab form,[data-is="rts-configuration-panel"] .tab form{ padding: 6px; padding-top: 10px; } rts-configuration-panel .tabs-list,[data-is="rts-configuration-panel"] .tabs-list{ text-align: center; }', '', function(opts) {


        const self = this;
        const config = opts;
        config.unit_names = !!config.unit_names ? config.unit_names : ["Unit A", "Unit 2", "Other unit", "D"];

        const open_this_panel = () => {
            if(self.parent && self.parent.show_config_panel)
                self.parent.show_config_panel();
        };

        self.view_date_settings = () => {
            open_this_panel();
            self.root.querySelector(".date-settings-button").click();
        };

        self.view_change_point_settings = () => {
            open_this_panel();
            self.root.querySelector(".change-point-settings-button").click();
        };

        self.on("mount", () => {
        });
});