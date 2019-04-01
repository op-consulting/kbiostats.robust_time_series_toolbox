
riot.tag2('window-decorator', '<div class="window main-window"> <div class="window-caption"> <virtual if="{platform==\'OSX\'}"> <div class="buttons win-buttons mac-side"> </div> </virtual> <div class="buttons left-side"> <yield from="left-title"></yield> </div> <span class="title"> <yield from="title"></yield> </span> <div class="buttons right-side"> <yield from="right-title"></yield> </div> <virtual if="{platform!=\'OSX\'}"> <div class="buttons win-buttons win-side"> <span class="btn-min win-min"></span> <span class="btn-max win-max"></span> <span class="btn-close win-close"></span> </div> </virtual> </div> <yield from="menu-bar"></yield> <div class="window-content"> <yield from="content"></yield> </div> </div>', 'window-decorator .main-window,[data-is="window-decorator"] .main-window{ border: none !important; background: transparent; height: 100%; } window-decorator .main-window span,[data-is="window-decorator"] .main-window span,window-decorator .main-window div,[data-is="window-decorator"] .main-window div,window-decorator .main-window,[data-is="window-decorator"] .main-window{ font-family: \'Segoe UI\', \'Segoe UI Web (West European)\', "Noto Sans"; } window-decorator [class^="ms-Icon"],[data-is="window-decorator"] [class^="ms-Icon"]{ font-family: \'FabricMDL2Icons\' !important; } window-decorator .main-window .window-content,[data-is="window-decorator"] .main-window .window-content{ background-color: rgb(237, 237, 237); border: none !important; border-left: rgba(255, 255, 255, 0.5) solid 1px !important; border-right: rgba(255, 255, 255, 0.5) solid 1px !important; border-bottom: rgba(255, 255, 255, 0.5) solid 1px !important; bottom: 0; left: 0; right: 0; height: -webkit-fill-available; } window-decorator .main-window .window-caption .mac-side,[data-is="window-decorator"] .main-window .window-caption .mac-side{ opacity: 0; } window-decorator .main-window.unmaximized .window-caption .mac-side,[data-is="window-decorator"] .main-window.unmaximized .window-caption .mac-side{ width: 105px !important; } window-decorator .main-window.maximized .window-caption .mac-side,[data-is="window-decorator"] .main-window.maximized .window-caption .mac-side{ width: 5px !important; } window-decorator .main-window .window-caption .title,[data-is="window-decorator"] .main-window .window-caption .title{ text-align: center; } window-decorator .main-window .window-caption .title div,[data-is="window-decorator"] .main-window .window-caption .title div,window-decorator .main-window .window-caption .title span,[data-is="window-decorator"] .main-window .window-caption .title span{ display: inline-block; display: inline-flex; } window-decorator .main-window .window-caption .side,[data-is="window-decorator"] .main-window .window-caption .side{ display: inline-block; display: inline-flex; } window-decorator .main-window .window-caption .side>div,[data-is="window-decorator"] .main-window .window-caption .side>div,window-decorator .main-window .window-caption .side>input,[data-is="window-decorator"] .main-window .window-caption .side>input,window-decorator .main-window .window-caption .side>span,[data-is="window-decorator"] .main-window .window-caption .side>span{ display: inline-block; display: inline-flex; } window-decorator .main-window .window-caption,[data-is="window-decorator"] .main-window .window-caption{ -webkit-user-select: none; -webkit-app-region: drag; background: transparent; min-height: 36px; } window-decorator .main-window .window-caption *,[data-is="window-decorator"] .main-window .window-caption *{ cursor: default !important; } window-decorator .main-window,[data-is="window-decorator"] .main-window,window-decorator .main-window .window-caption .buttons *[class|=btn],[data-is="window-decorator"] .main-window .window-caption .buttons *[class|=btn],window-decorator .main-window .window-caption *,[data-is="window-decorator"] .main-window .window-caption *{ font-size: 12px; } window-decorator .main-window .window-caption .buttons *,[data-is="window-decorator"] .main-window .window-caption .buttons *{ -webkit-app-region: no-drag; background-color: transparent; transition: 600ms linear background-color; } window-decorator .main-window .window-caption .buttons *[class|=btn]:hover,[data-is="window-decorator"] .main-window .window-caption .buttons *[class|=btn]:hover{ background-color: rgba(180, 180, 180, 0.5); transition: 600ms linear background-color; color: #ffffff; } window-decorator .main-window .window-caption .buttons .btn-custom::before,[data-is="window-decorator"] .main-window .window-caption .buttons .btn-custom::before{ top: -0.15rem; position: relative; } window-decorator .main-window .window-caption .buttons .btn-custom:hover,[data-is="window-decorator"] .main-window .window-caption .buttons .btn-custom:hover{ color: #ffffff !important; } window-decorator .main-window .window-caption .buttons .btn-close:hover,[data-is="window-decorator"] .main-window .window-caption .buttons .btn-close:hover{ background-color: rgba(199, 80, 80, 1); color: #ffffff; transition: 600ms linear background-color; } window-decorator *::-webkit-scrollbar-track,[data-is="window-decorator"] *::-webkit-scrollbar-track{ -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); border-radius: 10px; background-color: rgba(245, 245, 245, 0.7); } window-decorator *::-webkit-scrollbar,[data-is="window-decorator"] *::-webkit-scrollbar{ width: 6px; height: 6px; background-color: rgba(245, 245, 245, 0.7); } window-decorator *::-webkit-scrollbar-thumb,[data-is="window-decorator"] *::-webkit-scrollbar-thumb{ border-radius: 10px; -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1); background-color: rgba(85, 85, 85, 0.5); }', '', function(opts) {

    const require_ = require;

    function electronIsInstalled() {
      try {
        require_("electron");
        return true;
      } catch (error) {}
      return false;
    }

    function platform() {
      if (self.electronIsInstalled) {
        const remote = require_('electron').remote;
        const platform = remote.process.platform;
        if (platform.indexOf("darwin") >= 0 || platform.indexOf("mac") >= 0) {
          return "OSX";
        } else if (platform.indexOf("win") >= 0) {
          return "WIN";
        } else {
          return "";
        }
      }
      return "";
    }

    const self = this;
    const config = opts;
    const self$ = jQuery(self.root);
    const reader = new FileReader();
    self.electronIsInstalled = electronIsInstalled();
    self.platform = platform();

    self.on("mount", () => {
      if (self.electronIsInstalled) {
        const remote = require_('electron').remote;
        const this_window = remote.getCurrentWindow();
        const current_fwin = self.root.querySelector(".main-window");
        const closeWindow = () => this_window.close()
        const toggleWindow = () => !this_window.isMaximized() ? this_window.maximize() : this_window.unmaximize();
        const minimizeWindow = () => this_window.minimize();

        this_window.on('maximize', function () {
          current_fwin.classList.remove("unmaximized");
          current_fwin.classList.remove("maximized");
          current_fwin.classList.add("maximized");
        });
        this_window.on('unmaximize', function () {
          current_fwin.classList.remove("unmaximized");
          current_fwin.classList.remove("maximized");
          current_fwin.classList.add("unmaximized");
        });
        this_window.on('enter-full-screen', function () {
          current_fwin.classList.remove("unmaximized");
          current_fwin.classList.remove("maximized");
          current_fwin.classList.add("maximized");
        });
        this_window.on('leave-full-screen', function () {
          current_fwin.classList.remove("unmaximized");
          current_fwin.classList.remove("maximized");
          current_fwin.classList.add("unmaximized");
        });
        self.root.querySelector(".main-window").classList.add(((!this_window.isMaximized()) ? "un" : "") +
          "maximized");

        if (self.platform != "OSX") {
          self.root.querySelector(".main-window .win-close").addEventListener("click", () => this_window
            .close());
          self.root.querySelector(".main-window .win-max").addEventListener("click", toggleWindow);
          self.root.querySelector(".main-window .win-min").addEventListener("click", () => this_window
            .minimize());
        }
      }
      document.body.classList.remove("hidden");
    });
});