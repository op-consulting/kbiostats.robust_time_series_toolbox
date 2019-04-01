riot.tag2('ribbon-tab-button', '<virtual> <virtual if="{!opts.type.contains(\'no-link\')}"> <li class="{opts._type}"> <a href="{opts.href}" class="{opts.linktype}">{opts.label}</a> </li> </virtual> <virtual if="{opts.type.contains(\'no-link\')}"> <div class="{opts._type}"> <span class="{opts.linktype}">{opts.label}</span> </div> </virtual> </virtual>', 'ribbon-tab-button .tab-link a,[data-is="ribbon-tab-button"] .tab-link a{ -webkit-user-drag: none !important; user-select: none; } ribbon-tab-button .tab-link,[data-is="ribbon-tab-button"] .tab-link{ height: 110% !important; color: white !important; background-color: transparent !important; border: transparent solid 1px !important; transition: 600ms linear background-color, 600ms linear border, 600ms linear color; user-select: none; } ribbon-tab-button .tab-link.static:hover,[data-is="ribbon-tab-button"] .tab-link.static:hover,ribbon-tab-button .tab-link:hover,[data-is="ribbon-tab-button"] .tab-link:hover{ background-color: rgba(255, 255, 255, 0.1) !important; border: rgba(218, 219, 220, 0.5) solid 1px !important; transition: 600ms linear background-color, 600ms linear border, 600ms linear color; } ribbon-tab-button .tab-link.active:hover,[data-is="ribbon-tab-button"] .tab-link.active:hover{ background-color: #f5f6f7 !important; } ribbon-tab-button .tab-link.active,[data-is="ribbon-tab-button"] .tab-link.active{ height: 110% !important; color: #111111 !important; background: #f5f6f7 !important; } ribbon-tab-button .tab-link.static,[data-is="ribbon-tab-button"] .tab-link.static{ background-color: rgba(0, 0, 0, 0.1) !important; } ribbon-tab-button .tab-link.placeright,[data-is="ribbon-tab-button"] .tab-link.placeright{ position: absolute; right: 0; top: 0; } ribbon-tab-button .tab-link.no-link span,[data-is="ribbon-tab-button"] .tab-link.no-link span{ padding: 0 10px; }', '', function(opts) {


        const self = this;
        const config = opts;
        config.type = config.type !== undefined ? config.type : "";
        config.linktype = config.linktype !== undefined ? config.linktype : "";
        config.label = config.label !== undefined ? config.label : "";
        config.href = config.href !== undefined ? config.href : "#";
        config.onclick = config.onclick !== undefined ? config.onclick : null;

        config._type = config.type + " tab-link";

        self.on("mount", () => {
            console.log(config.onclick)
        });
});
