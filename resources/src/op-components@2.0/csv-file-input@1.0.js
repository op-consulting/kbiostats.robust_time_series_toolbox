
riot.tag2('csv-file-input', '<div class="ui action input"> <input type="text" class="fileinput" placeholder="{opts.placeholder}" readonly> <virtual if="{!this.electronIsInstalled}"> <input type="file" class="fileinput"> </virtual> <div class="ui icon button fileinput"> <i class="attach icon"></i> </div> </div>', 'csv-file-input .ui.action.input,[data-is="csv-file-input"] .ui.action.input{ width: 100%; } csv-file-input .ui.action.input input.fileinput[type="text"],[data-is="csv-file-input"] .ui.action.input input.fileinput[type="text"]{ width: 80%; } csv-file-input .ui.action.input input.fileinput[type="file"],[data-is="csv-file-input"] .ui.action.input input.fileinput[type="file"]{ width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1; }', '', function(opts) {


        const require_ = require;

        function electronIsInstalled() {
            try {
                require_("electron");
                return true;
            } catch (error) {}
            return false;
        }

        function errorHandler(evt) {
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    console.error('File Not Found!');
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    console.error('File is not readable');
                    break;
                case evt.target.error.ABORT_ERR:
                    break;
                default:
                    console.error('An error occurred reading this file.');
            }
        }

        function updateProgress(evt) {

            if (evt.lengthComputable) {
                const percentLoaded = Math.round((evt.loaded / evt.total) * 100);

                if (percentLoaded < 100) {

                }
            }
        }

        function handleFileSelect(evt, cbx) {

            reader.onerror = errorHandler;
            reader.onprogress = updateProgress;
            reader.onabort = function () {
                console.error('File read cancelled');
            };
            reader.onloadstart = function () {

            };
            reader.onload = function () {

            };
            reader.onloadend = function (evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    cbx(evt.target.result);
                }
            };

            reader.readAsBinaryString(evt.target.files[0]);
        }

        function default_file_filter() {
            return [{
                    name: 'Data source (.CSV)',
                    extensions: ['csv']
                },
                {
                    name: 'All Files',
                    extensions: ['*']
                }
            ];
        }

        function trigger_data(self, filename, data) {
            if (config.input_format == "CSV") {
                Papa.parse(data, {
                    keepEmptyRows: false,
                    skipEmptyLines: true,
                    complete: function (results) {
                        self.trigger("loaded-file", {
                            filename: filename,
                            content: results.data,
                            metadata: {
                                errors: results.errors,
                                file: results.meta
                            },
                        });
                    }
                });
            } else {
                self.trigger("loaded-file", {
                    filename: filename,
                    content: data,
                    metadata: {},
                });
            }
        }

        const self = this;
        const config = opts;
        const self$ = jQuery(self.root);
        const reader = new FileReader();
        self.electronIsInstalled = electronIsInstalled();
        config.file_filter = config.file_filter !== undefined ? config.file_filter : default_file_filter();
        config.placeholder = config.placeholder !== undefined ? config.placeholder : "Choose a file";
        config.load_content = config.load_content !== undefined ? config.load_content : true;
        config.input_format = config.input_format !== undefined ? config.input_format : "CSV";
        config.dialog_properties = config.dialog_properties !== undefined ? config.dialog_properties : ['openFile'];

        self.file_open = (filename, cb, ext_type = "") => {
            if (self.electronIsInstalled) {
                const fs = require_('fs');
                fs.readFile(filename, 'utf8', (err, data) => {
                    if (err) {
                        return console.error(err);
                    }
                    if (ext_type == "csv") {
                        Papa.parse(data, {
                            keepEmptyRows: false,
                            skipEmptyLines: true,
                            complete: function (results) {
                                cb(results.data);
                            }
                        });
                    } else {
                        cb(data);
                    }
                });
            }
        };
        self.on("mount", () => {
            self$.find("input.fileinput:text, .button.fileinput").on("click", function () {
                if (self.electronIsInstalled) {

                    const {
                        dialog
                    } = require_("electron").remote;
                    const fs = require_('fs');
                    const paths = dialog.showOpenDialog({
                        filters: config.file_filter,

                        properties: config.dialog_properties,
                    });
                    if (!paths) {
                        return;
                    }
                    self.trigger("obtained-file-names", paths);
                    if (config.load_content) {
                        fs.readFile(paths[0], 'utf8', (err, data) => {
                            if (err) {
                                return console.error(err);
                            }
                            trigger_data(self, paths[0], data);
                        });
                    }
                    const name = paths[0].match(/([^\/\\])+$/g)[0];
                    self$.find("input.fileinput:text").attr("value", name);

                } else {
                    jQuery(this).parent().find("input.fileinput:file").click();
                }
            });
            self$.find('input.fileinput:file', '.ui.action.input').on('change', (e) => {
                if (self.electronIsInstalled) {

                } else {
                    const name = e.target.files[0].name;

                    self.trigger("obtained-file-names", Array.from(e.target.files).map((x) => x.name));
                    if (config.load_content) {
                        handleFileSelect(e, (data) => {
                            trigger_data(self, name, data);
                        });
                    }
                    self$.find("input.fileinput:text").attr("value", name);
                }
            });
        });
});