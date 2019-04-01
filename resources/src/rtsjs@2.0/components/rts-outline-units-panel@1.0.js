riot.tag2('rts-outline-units-panel', '<div class="panel-title"> {opts.title} </div> <div class="container-sidenav"> <ul class="sidenav-counter sidenav-counter-expand-fs h-100 w-100 list-mini-plots"> <li each="{name, index in opts.unit_names}"> <a href="#" onclick="{_trigger_event(index + 1)}"> <span class="icon"><svg class="{⁗unit-⁗ + (index + 1) + ⁗ unit-miniplot⁗}"></svg></span> <span class="title">UNIT {(index + 1)}</span> <span class="counter">{name}</span> </a> </li> <li each="{name, index in opts.unit_names}"> <a href="#" onclick="{_trigger_event(index + 1)}"> <span class="icon"><svg class="{⁗unit-⁗ + (index + 1) + ⁗ unit-miniplot⁗}"></svg></span> <span class="title">UNIT {(index + 1)}</span> <span class="counter">{name}</span> </a> </li> </ul> </div>', 'rts-outline-units-panel .unit-miniplot,[data-is="rts-outline-units-panel"] .unit-miniplot{ zoom: 0.35; margin-top: -4px; } rts-outline-units-panel *,[data-is="rts-outline-units-panel"] *{ -webkit-user-drag: none !important; user-select: none; cursor: default; } rts-outline-units-panel .container-sidenav,[data-is="rts-outline-units-panel"] .container-sidenav{ height: 100%; overflow: auto; display: grid; } rts-outline-units-panel .container-sidenav > ul,[data-is="rts-outline-units-panel"] .container-sidenav > ul{ padding-bottom: 30px; background: inherit; } rts-outline-units-panel .container-sidenav,[data-is="rts-outline-units-panel"] .container-sidenav{ background: white; border-right: 1px solid #dadbdc; border-left: 1px solid #dadbdc; } rts-outline-units-panel .panel-title,[data-is="rts-outline-units-panel"] .panel-title{ background: #f5f6f7; color: #000000; border: 1px solid #dadbdc; border-top: none; }', '', function(opts) {


        const self = this;
        const config = opts;
        config.title = !!config.title ? config.title : "";
        config.unit_names = !!config.unit_names ? config.unit_names : [""];

        self._trigger_event = (index) => {
            return () => self.trigger('app:request:current:unit:allplots', {unitindex: index});
        };

        self.on("mount", () => {

        });
});