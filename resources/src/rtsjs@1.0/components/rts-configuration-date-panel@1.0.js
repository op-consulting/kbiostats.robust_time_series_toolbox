riot.tag2('rts-configuration-date-panel', '<div class="panel-title"> Date settings </div> <form> <div class="form-group"> <label><span class="icon"><i class="ms-Icon ms-Icon--GroupedAscending"></i></span> From</label> <input type="text" data-role="calendarpicker" data-format="%d %B %Y" ref="start_input"> </div> <div class="form-group"> <label><span class="icon"><i class="ms-Icon ms-Icon--GroupedDescending"></i></span> To</label> <input type="text" data-role="calendarpicker" data-format="%d %B %Y" ref="end_input"> </div> </form>', 'rts-configuration-date-panel .panel-title,[data-is="rts-configuration-date-panel"] .panel-title{ background-color: rgba(58, 139, 199, 1); color: white; padding: 5px 5px; font-size: 12px; } rts-configuration-date-panel .input.calendar-picker .calendar *,[data-is="rts-configuration-date-panel"] .input.calendar-picker .calendar *{ cursor: default!important; }', '', function(opts) {


        const self = this;
        const config = opts;

        const create_event_on_calendar_inputs = () => {
            const input_dates = ["start_input", "end_input"];
            const event_names = ["start", "end"];
            input_dates.forEach((input_date, k) => {

                self.refs[input_date].onchange = self._trigger_event(event_names[k], () => jQuery(self.refs[
                    input_date]).data("calendarpicker").val());
            });
        };

        self._trigger_event = (name, _value) => {
            return () => self.trigger('app:request:change:model:date:' + name.toLowerCase(), {
                date: _value()
            });
        };

        self.on("mount", () => {
            create_event_on_calendar_inputs();
        });
});