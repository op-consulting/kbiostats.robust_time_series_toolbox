riot.tag2('rts-configuration-changepoint-panel', '<div class="panel-title"> Change point settings </div> <form data-role="validator" action="javascript:" data-interactive-check="true"> <div class="form-group"> <label><span class="icon"><i class="ms-Icon ms-Icon--GroupedAscending"></i></span>Theoretical change point</label> <input type="text" data-role="calendarpicker" data-format="%d %B %Y" ref="change_point"> </div> <div class="form-group hidden"> <label><span class="icon"><i class="ms-Icon ms-Icon--GroupedAscending"></i></span>Days before the change point</label> <input type="text" data-validate="required integer min=0" placeholder="" value="30" ref="days_before"> <span class="invalid_feedback"> It must be a valid number greater than 0! </span> </div> <div class="form-group hidden"> <label><span class="icon"><i class="ms-Icon ms-Icon--GroupedAscending"></i></span>Days after the change point</label> <input type="text" data-validate="required integer min=0" placeholder="" value="30" ref="days_after"> <span class="invalid_feedback"> It must be a valid number greater than 0! </span> </div> </form>', 'rts-configuration-changepoint-panel .panel-title,[data-is="rts-configuration-changepoint-panel"] .panel-title{ background-color: rgba(58, 139, 199, 1); color: white; padding: 5px 5px; font-size: 12px; } rts-configuration-changepoint-panel .input.calendar-picker .calendar *,[data-is="rts-configuration-changepoint-panel"] .input.calendar-picker .calendar *{ cursor: default !important; } rts-configuration-changepoint-panel .form-group.hidden,[data-is="rts-configuration-changepoint-panel"] .form-group.hidden{ display: none; }', '', function(opts) {


        const self = this;
        const config = opts;

        self.change_point_defined = false;
        const input_date = "change_point";
        const before_date = "days_before";
        const after_date = "days_after";

        const create_event_on_calendar_inputs = () => {
            self.refs[after_date].onchange = __trigger_event;
            self.refs[before_date].onchange = __trigger_event;
            self.refs[input_date].onchange = () => {
                Array.from(self.root.querySelectorAll(".form-group")).forEach((el) => el.classList.remove("hidden"));
                __trigger_event();
            };
        };

        const __trigger_event = () => {
            const reference = moment(self.refs[input_date].value).toDate();
            const start = moment(self.refs[input_date].value).toDate().addDays(-Number.parseInt(self.refs[before_date].value));
            const end = moment(self.refs[input_date].value).toDate().addDays(Number.parseInt(self.refs[after_date].value));
            self.trigger('app:request:change:model:changepoint', {
                reference,
                start,
                end
            });
        };
        self.on("mount", () => {
            create_event_on_calendar_inputs();
        });
});