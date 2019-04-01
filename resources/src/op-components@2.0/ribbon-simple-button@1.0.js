riot.tag2('ribbon-simple-button', '<button class="ribbon-button"> <span class="icon"> <div class="{icon_class}"></div> </span> <span class="caption">{opts.label}</span> </button>', 'ribbon-simple-button *,[data-is="ribbon-simple-button"] *{ user-select: none; } ribbon-simple-button .ribbon-button.disabled .icon,[data-is="ribbon-simple-button"] .ribbon-button.disabled .icon{ -webkit-filter: grayscale(1); filter: grayscale(1); } ribbon-simple-button .ribbon-button,[data-is="ribbon-simple-button"] .ribbon-button{ padding-left: 5px; padding-right: 5px; text-align: center; height: 100% !important; } ribbon-simple-button .ribbon-button .icon,[data-is="ribbon-simple-button"] .ribbon-button .icon{ display: inline-block; } ribbon-simple-button .ribbon-icon-button .icon+.caption,[data-is="ribbon-simple-button"] .ribbon-icon-button .icon+.caption,ribbon-simple-button .ribbon-icon-button .caption+.icon,[data-is="ribbon-simple-button"] .ribbon-icon-button .caption+.icon{ margin-bottom: 5px; }', '', function(opts) {


    const self = this;
    const config = opts;
    config.icon = config.icon !== undefined ? config.icon : "";
    config.iconpreffix = config.iconpreffix !== undefined ? config.iconpreffix : "";
    config.label = config.label !== undefined ? config.label : "";
    config.onclick = config.onclick !== undefined ? config.onclick : null;
    config.disabled = config.disabled !== undefined ? config.disabled : null;

    self.disabled = () =>
      self.root.querySelector("button").classList.contains("disabled");

    self.toggle = () => {
      self.root.querySelector("button").classList.toggle("disabled");
    };
    self.enable = () => {
      self.root.querySelector("button").classList.remove("disabled");
      self.root.querySelector("button").removeAttribute("disabled", "disabled");
    };
    self.disable = () => {
      self.root.querySelector("button").classList.add("disabled");
      self.root.querySelector("button").setAttribute("disabled", "disabled");
    };

    self.icon_class = config.icon.split(/\s+/g).map((_) => _[0] == "!" ? _.substr(1) : (config.iconpreffix + _)).join(
      " ")

    self.root.addEventListener("click", (e) => {
      if (self.disabled()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    });

    self.on("mount", () => {
      if (config.disabled) {
        self.disable();
      }
    });

});