# Robust Interrupted Time Series Toolbox (RITS)

![Robust Interrupted Time Series Toolbox](/stats-model/screenshoots-tutorial/start.png "Robust Interrupted Time Series Toolbox")

RITS is a stand-alone, cross-platform, and user-friendly application to assess the impact of complex policy interventions.
RITS implements the **Robust Interrupted Time Series model** [[M1]](#user-content-RITS_paper),
the **Robust Multiple Interrupted Time Series model** and the **Supremum Wald Test** [[M2]](#user-content-MRITS_paper) to evaluate the presence and impact during a change-point caused by a change in a policy.

RITS analyzes interrupted time series (ITS) and estimates an intervention policy's effect through changes in level,
trend, or correlation structures that occur before and after a change-point.
Note that the time of intervention and the true change-point in the system could not be the same
(as described in [[M1]](#user-content-RITS_paper)) and RITS takes this difference into account.

RITS provides a flexible, seamless interface for the analysis of time series data with the aim of improving the focus on the interpretation of the outcome while reducing the complexity of the use of statistical models.

The user interface has been developed in JavaScript language programming, while the statistical model has been independently implemented in Nim language programming to ensure improved memory and speed efficiency.


**If you are already using this software, consider to [cite us](#citations).**

## Table of contents

* [Installing](#installing)
* [Getting started](#getting-started)
* [Example: COVID partial lockdown effect in Germany](#example-covid-partial-lockdown-effect-in-germany-november-2-2020) (November 2, 2020)
* [Compilation](#compilation)
* [Citations](#citations)
* [Credits](#credits)
* [License](#license)


## Installing

The easiest way to use RITS is to download the [latest release](https://github.com/biostatistics-kaust/kbiostats.robust_time_series_toolbox/releases). We are providing binaries for Windows x64, macOS, and GNU/Linux (in an AppImage format).

## Getting started

1. **Load the dataset**: RITS can process CSV tables. The input files should have three columns: the institute name, the date, and the registered value.
<!--![Load the dataset](/stats-model/screenshoots-tutorial/data-load.png "Load the dataset")-->

2. **Choose the date range**: The toolbox will start showing a plot of the time series recorded in the dataset. Sometimes, we will need a specific interval to analyze:  use the bars to choose the start and end dates of the processing.
![Choose the date range](/stats-model/screenshoots-tutorial/setting-date.png "Choose the date range")

3. **Choose the potential change-point's interval**: The statistical model requires an interval of theoretical (or potential) change-points. You can use the bars to select the range. Remember that longer intervals will require more time to process. Once you are sure of the intervals, press the `Model Dataset` button to start processing.
![Choose the potential change-point's interval](/stats-model/screenshoots-tutorial/setting-theoretical.png "Choose the potential change-point's interval")

4. **Data summary**: You will see a table in the top area with a brief summary of the processing results: the difference in the slope, levels, and correlations that appears in your data.
![Data summary](/stats-model/screenshoots-tutorial/summary-summary.png "Data summary")

5. **Relevant results**: Extending the data summary, in this table, you will see the difference between the estimated and your theoretical change-point proposal. Details about the slope, intercept, and correlations estimates are also generated.
![Relevant results](/stats-model/screenshoots-tutorial/summary-relevant.png "Relevant results")

6. **Explore the dataset**: fitted values and log-likelihood: Click on `Menu View>Estimated model` to see the time series differences between the fitted mean function with the raw data.
![Explore the dataset](/stats-model/screenshoots-tutorial/estimated-mean.png "Explore the dataset")
If you are wondering about the log-likelihood of the model, scroll down to see the plot. *Each graphic is can be zoomed-in and saved independently.*
![Explore the dataset](/stats-model/screenshoots-tutorial/estimated-loglik.png "Explore the dataset")

7. **Explore the dataset**: residuals and auto-correlation: Click on `Menu View>Residuals` to see the residuals of the fitted model (after and before the change-point)
![Explore the dataset](/stats-model/screenshoots-tutorial/estimated-res.png "Explore the dataset")
And their autocorrelation function to assess whether certain model assumptions have not been met.
![Explore the dataset](/stats-model/screenshoots-tutorial/estimated-acf.png "Explore the dataset")

8. **Read and save the report**: Click on `Menu Reports>Complete report`. The toolbox collects all results data of the model through tables and plots in this large sheet. Click on `DOCX report` to save it in the MS Word 2017 format.
**Note that due to the number of images, it could take a few seconds to load the first time.**
![Report changes](/stats-model/screenshoots-tutorial/report-changes.png "Report changes")
![Report stochastic parameters](/stats-model/screenshoots-tutorial/report-stochastic.png "Report stochastic parameters")
![Report SWT](/stats-model/screenshoots-tutorial/report-wald.png "Report SWT")

9. **Access to the documentation**: The model's theoretical description is also included in the toolbox. Click on `Menu Help>Model description` to read the paper and check its theoretical details.
![Documentation](/stats-model/screenshoots-tutorial/model-description.png "Documentation")

## Example: COVID partial lockdown effect in Germany (November 2, 2020)

As an example, we tested the RITS toolbox to assess the impact of a partial lock-down on the number of daily infected people in Germany. The intervention time (or theoretical change-point) was defined on November 2. We should note, however, that the measures were announced on October 28 [DW news](https://p.dw.com/p/3kXaz).

First, we load the date from the number of people infected from October 16 to November 27. All days in this interval were considered to be potential change points.

Let us take a look at the `Executive Summary` panel:
![Germany Summary](/stats-model/example-germany-covid/executive-summary.jpg "Germany Summary")

The four stars depict that the Supremum Wald Test was not rejected, and we can consider that there is a change (under the RITS model).

Now, check the `Detailed Summary` panel:
![Germany Summary](/stats-model/example-germany-covid/summary-germany.jpg "Germany Summary")

It can be seen that the estimated change-point was October 30, a few days before the start of the lock-down (an "anticipation effect" in the time series).

It should also be noted that the infection trend is declining, but there is a positive change in the level and the adjacent correlation.

Unfortunately, the interpretation of these values is outside the scope of this example. But, it shows the versatility of the RITS model and toolbox to provide a fast overview of policy effectiveness.

The data used in the example is located in [example-germany-covid/sample-germany.csv](/example-germany-covid/sample-germany.csv).


## Compilation

If you prefer to look at the code, modify something or run the source code on this repository, you will need to install and configure the following programs on your computer:

* [Git](https://git-scm.com/downloads).
* [Node.js (>14.0.0)](https://nodejs.org/) with npm (>6).
* [Nim language compiler (>1.0.0)](https://nim-lang.org/).

Once these main platforms are installed, run/test the source code is straightforward from your Bash-compatible command line:

	# Clone this repository
	git clone https://github.com/biostatistics-kaust/kbiostats.robust_time_series_toolbox
	# Go into the repository
	cd kbiostats.robust_time_series_toolbox/
        # Install an additional requirement
        npm install
        # Update changes (it can be skipped if no changes were made)
        npm run update-stats-model
        npm run update-ui
        npm run optimize-scripts
        # Start developer version
        npm run start
        # Build executables
        npm run build-windows
        npm run build-linux
        npm run build-mac #It will work only in macOS
        # Build executables for all platforms
        npm run pack

<a name="citation"></a>

## Citations

If you are using our software, please consider to cite us:

<a name="RITS_toolbox"></a>
* `[M3]` Cruz M., Pinto M., Gillen D., and Ombao H. RITS: A Toolbox for Assessing Complex Interventions via Interrupted Time Series Models. *Journal of Statistical Software*. *In submission*.

<a id="RITS_paper"></a>
* `[M2]` Cruz, M., Gillen, D. L., Bender, M., & Ombao, H. (2019). Assessing health care interventions via an interrupted time series model: study power and design considerations. *Statistics in medicine*, 38(10), 1734-1752.
[doi:10.1002/sim.8067](http://doi.org/10.1002/sim.8067)

<a name="MRITS_paper"></a>
* `[M1]` Cruz, M., Bender, M., & Ombao, H. (2017). A robust interrupted time series model for analyzing complex health care intervention data. *Statistics in medicine*, 36(29), 4660-4676.
[doi:10.1002/sim.7443](http://doi.org/10.1002/sim.7443)

## Credits

This project is handled by the [Biostatistics Research Group](https://cemse.kaust.edu.sa/biostats) at the King Abdullah University of Science and Technology. Development and research supported by OSR KAUST research grant to the KAUST Biostatistics research group.

## License

This software is open source licensed under a dual license [MIT](/LICENSE-MIT)/[GPL](/LICENSE-GPL).

