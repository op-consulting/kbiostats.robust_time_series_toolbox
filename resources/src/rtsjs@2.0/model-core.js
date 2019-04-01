
class Stats{
    static autocorrelationAtLag(y, lag){
        let y_avg = y.mean();
        let n = y.shape[0];
        let acf2 = y.slice([lag, n]).subtract(y_avg).multiply(
            y.slice([0, n - lag]).subtract(y_avg)
        ).mean() / Math.sqrt(
            y.subtract(y_avg).pow(2).mean() * 
            y.slice([0, n - lag]).subtract(y_avg).pow(2).mean()
        );

        //let res_1 = y.slice([lag, n]).subtract(y.slice([lag, n]).mean());
        //let res_2 = y.slice([0, n - lag]).subtract(y.slice([0, n - lag]).mean());
        //let acf = res_1.multiply(res_2).mean() / Math.sqrt(
        //    res_1.pow(2).mean() * res_2.pow(2).mean()
        //);
        return acf2;
    }
    
    static autocorrelationFunction(y, lag_0, lag_1){
        lag_0 = Math.max(0, lag_0);
        lag_1 = Math.min(lag_1, y.shape[0] - 1);
        let acf = np.zeros(lag_1 - lag_0 + 1);
        for (let k = lag_0; k <= lag_1; k++) {
            acf.set(k, Stats.autocorrelationAtLag(y, k));
        }
        return acf;
    }

    static histogram(y, bins){
        let ticks_histogram = np.arange(bins + 1).multiply((1e-10 + y.max() - y.min())/(bins));
        let x_histogram = np.arange(bins).add(0.5).multiply((1e-10 + y.max() - y.min())/(bins));
        let y_histogram = np.round(y.subtract(y.min()).multiply((bins - 1) / (1e-10 + y.max() - y.min())));
        return {x: x_histogram, y: y_histogram, bins: ticks_histogram}
    }
    
    static linearRegression(y, x){
        let n = y.shape[0];
        if(typeof x == "undefined"){ x = np.arange(n); }
        let x_avg = x.mean();
        let y_avg = y.mean();
        
        //Slow, but easy to debug
        let slope = y.subtract(y_avg).multiply(x.subtract(x_avg)).sum() / x.subtract(x_avg).pow(2).sum();
        let intercept = y_avg - slope * x_avg;
        
        let y_est = x.multiply(slope).add(intercept);
        let R = y.subtract(y_est);
        let sse = R.pow(2).sum();
        let sigma2_ols = sse/(n - 2);
        //Variance estimation considering an AR(1) process. Pag. 15-16
        let phi = R.slice([1, n]).subtract(R.slice([1, n]).mean()).multiply(
            R.slice([0, n - 1]).subtract(R.slice([0, n - 1]).mean())
        ).sum() / R.slice([1, n]).subtract(R.slice([1, n]).mean()).pow(2).sum();
        let W = R.subtract(np.concatenate([[0], R.slice([0, n-1])]).multiply(phi));
        // W was not defined for t == 0:
        //  let sigma2 = W.slice([1, n]).subtract(W.slice([1, n-1]).mean()).subtract(
        //      W.slice([0, n-1]).subtract(W.slice([0, n-2]).mean()).multiply(phi)
        //  ).pow(2).mean();
        let sigma2 = W.slice([2, n]).subtract(W.slice([2, n-1]).mean()).subtract(
            W.slice([1, n-1]).subtract(W.slice([1, n-2]).mean()).multiply(phi)
        ).pow(2).sum() / (n - 2);
        //let acf = Stats.autocorrelationFunction(y, 0, 10);
        //let acf_R = Stats.autocorrelationFunction(R, 0, 10);
        //let acf_W = Stats.autocorrelationFunction(W, 0, 10);
        // Uncertainty measurements
        let sum_x2 = x.multiply(x).sum();
        let sum_x = x.sum();
        let var_intercept = sigma2_ols * sum_x2 / (n * sum_x2 - sum_x * sum_x);
        let var_slope = sigma2_ols * n / (n * sum_x2 - sum_x * sum_x);
        //https://stats.stackexchange.com/questions/180741/how-to-understand-t-value-in-rs-lm
        let t_score_intercept = intercept / Math.sqrt(var_intercept);
        let t_score_slope = slope / Math.sqrt(var_slope);
        let p_score_intercept = 2 - 2 * st.studentt.cdf(Math.abs(t_score_intercept), n-2);
        let p_score_slope = 2 - 2 * st.studentt.cdf(Math.abs(t_score_slope), n-2);
        
        return {
            slope: {
                estimate: slope,
                variance: var_slope,
                t_score: t_score_slope,
                p_score: p_score_slope,
            },
            intercept: {
                estimate: intercept,
                variance: var_intercept,
                t_score: t_score_intercept,
                p_score: p_score_intercept,
            },
            white_noise: {
                estimate: sigma2,
                variance: sigma2, //TODO
                //t_score: t_score_intercept,
                //p_score: p_score_intercept,
            },
            variance_error: sigma2_ols,// * (n - 2) / n,
            residuals: {
                estimates: R,
                residuals: W,
                autoregressive_parameter: phi,
                variance: sigma2,//
            }
        }
    }

    static differenceBetweenParameters(linearRegressionBefore, linearRegressionAfter){
        let parameters = ["slope", "intercept"]
        let results = {}
        const n_a = linearRegressionBefore.residuals.estimates.shape[0];
        const n_b = linearRegressionAfter.residuals.estimates.shape[0];
        for (let k = 0; k < parameters.length; k++) {
            const parameter = parameters[k];
            const parameter_a = linearRegressionBefore[parameter];
            const parameter_b = linearRegressionAfter[parameter];
            let difference = parameter_b.estimate - parameter_a.estimate;
            let var_difference = parameter_b.variance + parameter_a.variance;
            let df = n_a + n_b - 4;
            results[parameter] = {
                estimate: difference,
                variance: var_difference,
                confidence_interval: {
                    upper_bound: difference + Math.sqrt(var_difference) * st.studentt.inv(0.975, df),
                    lower_bound: difference - Math.sqrt(var_difference) * st.studentt.inv(0.975, df),
                }
            }
        }
        //TODO: Verify for intercept
        //TODO: Implement for sigma2 (White noise variance)
        //TODO: Implement for phi
        results["phi"] = {
            estimate: 0,
            variance: 1,
            confidence_interval: {
                upper_bound: 1.1,
                lower_bound: 0.1,
            }
        }
        results["white_noise"] = {
            estimate: 0,
            variance: 1,
            confidence_interval: {
                upper_bound: 1.1,
                lower_bound: 0.1,
            }
        }
        return results;
    }
}

class Model{
    constructor(parameters, data_source, unit_name){
        this.parameters = parameters
        this.unit_name = unit_name
        this.data_source = data_source
        this.__loglikelihood_info = null;
    }

    get logLikelihoodInfo(){
        if(this.__loglikelihood_info == null){
            this.__loglikelihood_info = this.calculateLogLikelihoodInfo();
        }
        return this.__loglikelihood_info;
    }

    calculateLogLikelihoodInfo(){
        // Nomenclature in the paper: pag 7
        let Y = np.array(this.data_source.valuesOfUnit(this.unit_name));
        let T = Y.shape[0];
        let t_star = this.parameters.theoretical_executive_time_point;
        let m = this.parameters.candidate_before_tet;
        let k = this.parameters.candidate_after_tet;
        let linear_reg_before = Stats.linearRegression(Y.slice([0, t_star]))
        let beta_1=linear_reg_before.slope.estimate, beta_0=linear_reg_before.intercept.estimate, sigma2_1=linear_reg_before.residuals.variance;
        let linear_reg_after = Stats.linearRegression(Y.slice([t_star, T]), np.arange(t_star, T))
        let beta_1_B=linear_reg_after.slope.estimate, beta_0_B=linear_reg_after.intercept.estimate, sigma2_2=linear_reg_after.residuals.variance;
        let delta = beta_1_B - beta_1;
        let epsilon = beta_0_B - beta_0;
        //
        let LL = np.zeros(m + k + 1).tolist();
        let t_L = np.arange(t_star - m, t_star + k + 1);
        //
        let LL_max = -1e100, q_max = null;
        for (let q = t_star - m; q < t_star + k + 1; q++) {
            let i = q - t_star + m;
            let t_1 = np.arange(0, q);
            let t_2 = np.arange(q, T);
            LL[i] = ( (- 0.5 * q + 0.5) * Math.log(2 * Math.PI * sigma2_1)
                   + ( - Y.slice([0, q]).subtract(t_1.multiply(beta_1).add(beta_0)).pow(2).sum() / (2 * sigma2_1) )
                   + (-0.5 * T + 0.5 * q - 0.5) * Math.log(2 * Math.PI * sigma2_2)
                   + ( - Y.slice([q, T]).subtract(t_2.multiply(beta_1_B).add(beta_0_B)).pow(2).sum() / (2 * sigma2_2) ));
            if(LL[i] >= LL_max){
                LL_max = LL[i];
                q_max = q;
            }
        }
        LL = np.array(LL);
        let {Y_est, linear_reg_before_max, linear_reg_after_max, linear_reg_differences} = this.createRegressionLinesAfterChange(q_max);
        return {
            time_index: t_L,
            loglikelihood: LL,
            max_time: q_max,
            max_index_in_LL: q_max - t_star + m,
            linear_reg_before_max: linear_reg_before_max,
            linear_reg_after_max: linear_reg_after_max,
            linear_reg_differences: linear_reg_differences,
            values_estimated: Y_est,
        };
    }

    createRegressionLinesAfterChange(q_max){
        let Y = np.array(this.data_source.valuesOfUnit(this.unit_name));
        let T = Y.shape[0];
        let t_bef_max = np.arange(0, q_max);
        let t_aft_max = np.arange(q_max, T);
        let linear_reg_before_max = Stats.linearRegression(Y.slice([0, q_max]), t_bef_max);
        let linear_reg_after_max = Stats.linearRegression(Y.slice([q_max, T]), t_aft_max);
        let Y_est = np.concatenate([
            t_bef_max.multiply(linear_reg_before_max.slope.estimate).add(linear_reg_before_max.intercept.estimate),
            t_aft_max.multiply(linear_reg_after_max.slope.estimate).add(linear_reg_after_max.intercept.estimate),
        ]);
        let linear_reg_differences = Stats.differenceBetweenParameters(linear_reg_before_max, linear_reg_after_max);
        return {Y_est, linear_reg_before_max, linear_reg_after_max, linear_reg_differences};
    }

}

exports.Stats = Stats;
exports.Model = Model;


