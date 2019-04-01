
riot.tag2('time-series-range', '<div> <div id="chart-area"> </div> </div>', 'time-series-range #chart-area .apexcharts-gridline,[data-is="time-series-range"] #chart-area .apexcharts-gridline{ stroke: #e0e0e065; }', '', function(opts) {


        function sample_data() {
            return [...Array(100).keys()].map((x) => ({
                x: x,
                y: Math.sin(2 * Math.PI * 10 * x / 300)
            }));
        }

        const self = this;
        const config = opts;
        config.time_series_data = config.time_series_data !== undefined ? config.time_series_data : sample_data();
        config.range_start = config.range_start !== undefined ? config.range_start : 10;
        config.range_end = config.range_end !== undefined ? config.range_end : 20;

        let chart;
        self.update_series = (series, skip=1) => {
            series = series.filter((x, i) => i % skip == 0);
            config.time_series_data = series.map((x, i) => ({
                x: i,
                y: x
            }));
            chart.updateOptions({
                series: [{
                    name: 'EEG',
                    data: config.time_series_data
                }],
            });
        };

        self.update_chart = () => {
            chart.update();
        };

        self.move_selection_range = (start, end) => {
            chart.updateOptions({
                chart: {
                    selection: {
                        xaxis: {
                            min: start,
                            max: end
                        }
                    }
                }
            });
        };

        self.on("mount", () => {
            const options = {
                id: 'timeseries',
                chart: {
                    height: 200,
                    type: 'line',
                    background: 'transparent',
                    toolbar: {
                        show: false,
                        autoSelected: 'selection',
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: config.range_start,
                            max: config.range_end
                        },
                        fill: {
                            color: '#FFFFFF',
                            opacity: 0.4
                        },
                        stroke: {
                            width: 1,
                            color: '#FFFFFF',
                            opacity: 0.4
                        },
                    },
                },

                colors: ['#FFFFFF'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 2,
                    curve: 'smooth'
                },
                series: [{
                    name: 'EEG',
                    data: config.time_series_data
                }],
                fill: {

                    opacity: 0.3,
                    type: 'solid'
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left'
                },
                xaxis: {
                    type: 'numeric',
                    labels: {
                        show: false,
                    },
                },
                yaxis: {
                    labels: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                        borderType: 'solid',
                        color: '#FFFFFF',
                        width: 1,
                        offsetX: 0,
                        offsetY: 0
                    },
                },
                tooltip: {
                    enabled: !true,
                },
            };

            chart = new ApexCharts(
                self.root.querySelector("#chart-area"),
                options
            );

            chart.render();
        });
});
