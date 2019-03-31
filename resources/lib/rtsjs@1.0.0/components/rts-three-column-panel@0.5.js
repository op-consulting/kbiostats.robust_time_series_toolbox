riot.tag2('rts-three-column-panel', '<div data-role="splitter" class="h-100" data-split-sizes="25, 50, 25" data-gutter-size="8"> <div class="d-flex flex-justify-center flex-align-center outline-panel"> <rts-outline-panel class="h-100 w-100" ref="outlinepanel"></rts-outline-panel> </div> <div class="d-flex flex-justify-center flex-align-center main-viewport h-100 w-100"> <div class="plot_container" ref="plot_container"> </div> </div> <div class="d-flex flex-justify-center flex-align-center outline-panel"> <rts-configuration-panel class="h-100 w-100" ref="configpanel"></rts-configuration-panel> </div> </div>', 'rts-three-column-panel .main-viewport,[data-is="rts-three-column-panel"] .main-viewport{ overflow: auto !important; display: block !important; padding: 10px; } rts-three-column-panel .outline-panel.hidden-panel,[data-is="rts-three-column-panel"] .outline-panel.hidden-panel{ width: 1px !important; max-width: 1px !important; min-width: 1px !important; transition: 600ms linear width; } rts-three-column-panel .outline-panel,[data-is="rts-three-column-panel"] .outline-panel{ min-width: 100px !important; transition: 600ms linear width; } rts-three-column-panel .main-viewport>*,[data-is="rts-three-column-panel"] .main-viewport>*{ min-width: 500px; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar .hidden{ display: none; } rts-three-column-panel .main-viewport .apexcharts-canvas .apexcharts-toolbar,[data-is="rts-three-column-panel"] .main-viewport .apexcharts-canvas .apexcharts-toolbar{ font-family: unset; font-size: 40pt; }', '', function(opts) {


        const self = this;
        const config = opts;

        self.on("mount", () => {
            setTimeout(() => {
                let last_position = null;
                Array.from(document.querySelectorAll(".gutter")).forEach((element) => {
                    element.addEventListener("mousedown", (e) => {
                        let {
                            screenX,
                            screenY,
                            clientX,
                            clientY
                        } = e;
                        element.__last_position = {
                            screenX,
                            screenY,
                            clientX,
                            clientY
                        };
                    });
                });
                Array.from(document.querySelectorAll(".gutter")).forEach((element) => {
                    element.addEventListener("mouseup", (e) => {
                        let {
                            screenX,
                            screenY,
                            clientX,
                            clientY
                        } = e;
                        let last_position = element.__last_position;
                        if (last_position.screenX == screenX && last_position.screenY ==
                            screenY &&
                            last_position.clientX == clientX && last_position.clientY ==
                            clientY) {
                            console.log(111, element.previousSibling);
                            if(element.previousElementSibling.classList.contains("outline-panel")){
                                element.previousElementSibling.classList.toggle("hidden-panel");
                            }else if(element.nextElementSibling.classList.contains("outline-panel")){
                                element.nextElementSibling.classList.toggle("hidden-panel");
                            }
                        }
                    });
                });
            }, 300);
        });
});