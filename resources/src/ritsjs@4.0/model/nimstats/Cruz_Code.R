
## R-MITS code
## Author: Maricela Cruz
## Date: 4/9/2018

##################################################################################
## Preliminary Functions
##################################################################################

mvrnorm <- MASS::mvrnorm

# Design matrix
CreateX <- function(n, tau){
  # n is the number of observations, the rows of the design matric
  # tau is the change point, it is the first observation in the intervention phase
  x1 <- rep(1, n)
  x2 <- seq(1, n, by=1)
  a <- rep(0, tau -1) 
  b <- seq(tau, n, by =1)
  c <- rep(1, n - tau +1)
  x3 <- c(a, c)
  x4 <- c(a,b)
  Xmat <- c(t(x1), t(x2), t(x3), t(x4))
  Xmat <- matrix(Xmat, nrow= n, ncol=4, byrow=FALSE)
  colnames(Xmat) <- c("int", "time", "Iint", "Itime")
  return(Xmat)    
}


# Log likelihood
lnL <- function(Y, X, Beta, Sigma){
  ## minimize this function
  ## Sigma and X dictate whether this is for no change point or with change point
  Sig_I <- solve(Sigma)
  Const <- (-1/2) *((determinant(2*pi*Sigma, logarithm=TRUE)$modulus[1]))
  AD <- Y - crossprod(t(X), Beta)  # Y - X %*% Beta
  Exp <- (-1/2) * (t(AD) %*% (Sig_I %*% AD))
  return(Const + Exp)
}

# Variance-C0variance matrix of Y with no change point
Sig <- function(Phi, w_sig, n){
  # Provides Sigma for a no change point model
  Corr <- toeplitz(Phi^(0:(n -1)))
  Sigma <- (w_sig[1]^2/(1 - Phi[1]^2) ) * Corr
  return(Sigma)
}

# Variance-C0variance matrix of Y with a change point
Sig.CP <-function(Phi, sig, n, tau){
  # ***Creating covariance matrices for CP models, 
  # *** with a  block diagonal AR(1) structure.
  Corr1 <- toeplitz(Phi[1]^(0:((tau)-3)))
  Corr2 <- toeplitz(Phi[2]^(0:((n - tau +1))))
  Sigma1 <- (sig[1]^2/(1 - Phi[1]^2) ) * Corr1
  Sigma2 <- (sig[2]^2/(1 - Phi[2]^2) ) * Corr2
  Sigma <- matrix(rep(0, n^2), ncol=n)
  Sigma[ 1:(tau-2), 1:(tau-2)] <- Sigma1
  Sigma[ (tau-1):n, (tau-1):n] <- Sigma2
  return(Sigma)
}

# Estimating model parameters with no change point - needed in the Supremum Wald test
#    for the null hypothesis
ITS.Est.Core.0 <- function(Y, X, tol = 1e-14){
  # Estimation of model parameters
  # Assuming one overall AR structure
  # returns estimates of Beta, phi, and sigma_w
  n <- length(Y)
  X.1 <- X[-1, ]
  Y.1 <- Y[-1]
  B.gls <- solve(crossprod(X, X)) %*% crossprod(X, Y) 
  phi.est <- -.8
  phi.old <- .8
  sig.w <- 1
  
  while(dist(rbind(phi.est, phi.old)) > tol){
    phi.old <- phi.est
    
    R2 <- Y.1 - (X.1 %*% B.gls)
    r1 <- Y[1] - B.gls[1] - B.gls[2]*1  ###
    R1 <- c(r1, R2)[-n]
    
    m.R1 <- mean(R1)
    m.R2 <- mean(R2)
    
    denom.a <- (sum((R1 - m.R1)^2) + sum((R2 - m.R2)^2))/2
    phi.est <- sum((R2 - m.R2)*(R1 - m.R1))/denom.a
    
    var.w <- (1/(n-1)) * sum(((R2 - m.R2) - phi.est * (R1 - m.R1) )^2)
    sig.w <- sqrt(var.w)
    
    Sigma <- Sig(phi.est, sig.w, (n-1))
    Sigma_I <- solve(Sigma, tol = 1e-20)
    
    Need <- t(X.1) %*% Sigma_I
    Need1 <- solve((Need %*% X.1), tol=1e-20)
    Need2 <- Need %*% Y.1
    Beta.GLS <- Need1 %*% Need2
  }
  res <- matrix(c(Beta.GLS, phi.est, sig.w, lnL(Y.1, X.1, Beta.GLS, Sigma)), 
                nrow=1)
  colnames(res) <- c("Beta0", "Beta1", "phi", "sigma.w", 
                     "loglike")
  return(res)
}

# Estimating model parameters with a change point in both the mean and correlation 
#    structure 
#    used for the actual mean and correlation structure parameter estimates 
ITS.Est.Core2 <- function(Y, X, tau, tol = 1e-14){
  # Estimation of model parameters
  # Assuming one overall AR structure
  # returns estimates of Beta, phi, and sigma_w
  n <- length(Y)
  X.1 <- X[-1, ]
  Y.1 <- Y[-1]
  B.gls <- solve(crossprod(X, X)) %*% crossprod(X, Y) 
  phi.est <- c(-.8, -.8)
  phi.old <- c(.8, .8)
  sig.w <- c(1,1)
  
  while( dist(rbind(as.vector(phi.est), as.vector(phi.old))) > tol){
    
    phi.old <- phi.est
    
    R2 <- Y.1 - (X.1 %*% B.gls)
    r1 <- Y[1] - B.gls[1] - B.gls[2]*1  ###
    R1 <- c(r1, R2)[-n]
    
    R2.a <- R2[1:(tau-2)]
    R2.b <- R2[-(1:(tau-2))]
    m.R2a <- mean(R2.a)
    m.R2b <- mean(R2.b)
    
    R1.a <- R1[1:(tau-2)]
    R1.b <- R1[-(1:(tau-2))]
    m.R1a <- mean(R1.a)
    m.R1b <- mean(R1.b)
    
    denom.a <- (sum((R1.a - m.R1a)^2) + sum((R2.a - m.R2a)^2))/2
    denom.b <- (sum((R1.b - m.R1b)^2) + sum((R2.b - m.R2b)^2))/2
    
    phi.est <- c(sum((R2.a - m.R2a)*(R1.a - m.R1a))/denom.a, 
                 sum((R2.b - m.R2b)*(R1.b - m.R1b))/denom.b)
    
    var.w <- c((1/(tau-2))*sum(((R2.a - m.R2a) - phi.est[1]*(R1.a - m.R1a) )^2),
               (1/(n-tau-1))*sum(((R2.b - m.R2b) - phi.est[2]*(R1.b - m.R1b) )^2))
    sig.w <- sqrt(var.w)
    
    Sigma <- Sig.CP(phi.est, sig.w, (n-1), tau)
    Sigma_I <- solve(Sigma, tol = 1e-20)
    
    Need <- t(X.1) %*% Sigma_I
    Need1 <- solve((Need %*% X.1), tol=1e-20)
    Need2 <- Need %*% Y.1
    Beta.GLS <- Need1 %*% Need2
  }
  
  
  return(c(Beta.GLS, phi.est, sig.w, lnL(Y.1, X.1, Beta.GLS, Sigma)))
}

# Benjamini-Hochberg function
BH.func <- function(Pval.vec, m){
  #Pval.vec is an ordered vector of p-values. 
  #m is the number of total hypotheses tests
  # returns how many times we reject the null hypothesis out of the m tests
  BH <- ((1:m)/m)*0.05
  sig <- sum(Pval.vec < BH)
  if(sig == 0){
    res.p <- 0
  } else{
    ind <- which(Pval.vec <= BH)
    res.p <- max(ind)
  }
  return(res.p)
}

## function that provides the model estimates, CIs, and pvalues
Contrast_CI <- function( phi, sigma.w, beta, X, tau, cont){
  ## phi are the adjacent correlation, sigma.w the white noise 
  ## beta the vector of mean parameters, X is the design matrix
  ## tau, is the change point, cont is the desired contrast
  ## gives estimate, 95% CI, tvalue, and p-value for any linear contrast, for one model.
  coef <- cont %*% beta
  n <- dim(X)[1]
  
  # if phi and sigma two domensional:
  if(length(phi) < 2){
    Sigma.I <- solve(Sig(phi, sigma.w, n))
  } 
  if( length(phi) == 2){
    Sigma.I <- solve(Sig.CP(phi, sigma.w, n, tau))
  }
  
  B.VAR <- n * solve(t(X) %*% (Sigma.I  %*% X)) 
  # if phi and sigma are one dimensional:
  
  se <- sqrt(cont %*% B.VAR %*% cont)
  tvalue <- (coef) / se
  df <- n - 2 - length(coef)
  pvalue <- 2*(1-pt(abs(tvalue), df))
  
  ci95.lo <- coef - qt(.975, df) * se
  ci95.hi <- coef+ qt(.975, df) * se
  est <- coef
  
  rslt <- round( cbind( est, ci95.lo, ci95.hi, tvalue, pvalue ), 4 )
  colnames( rslt ) <- c("Estimate", "ci95.left", "ci95.right", "t value", "Pr(>|t|)")			
  
  return(rslt)
}

##################################################################################
## Model Fitting / Parameter Estimation 
##################################################################################

## Preliminary values/inputs
n <- 60        # T (length of the time series)
Tstar <- 31    # formal interevntion implementation time point 
J <- 3         # Number of units 
que <- 25:34    # set of possible change points 
l.que <- length(que)

################################################
# Example Data ; Generating data to provide an example of how to run the model
################
phi <- .6             ## true adjacent correlation used to generate data only
tau <- 31             ## true change point used to generate data only
sigma.w <- 3.381596   ## true white noise variance, used to generate data only
i.Sigma <- Sig(phi, sigma.w, n)
sigma <- sigma.w/(sqrt(1 - phi^2))

#Generation of true mean function parameters
set.seed(12345)
beta3 <- rnorm(J, 0, 3) 
beta4 <- rnorm(J, .2, .25) 
beta1 <- rnorm(J, 60, 5)       
beta2 <- rnorm(J, 0.5, 0.1)
Beta <- cbind(beta1, beta2, beta3, beta4)

X.0 <- cbind(rep(1, n), seq(1, n, 1))  # Design matrix with no change point
X <- CreateX(n, tau)                   # Design matrix with a change point
Y.e <- apply(Beta, 1, function(a) tcrossprod(X, t(a) ))
Error <- t(mvrnorm(J, mu=rep(0, (n)), Sigma = i.Sigma))
Y <- Y.e + Error     # The simulated response, what we will focus on modeling

################################
# Modeling
################################

Wald.k = matrix(rep(0, l.que), nrow=l.que)  ## Place Holders for the supremum Wald Statistic
C <- matrix(c(0, 0, 1, 0, 0,0,0,1), nrow=2, byrow=TRUE) ## contrast for the supremum Wald test

## Fitting the reduced model for the supremum Wald test
res2 <- apply(Y, 2, function(x) ITS.Est.Core.0(x, X.0))  ## Outputs sigma.w

## Place holders for the model (both mean and correlation) parameters in the following 
## grid search (over `que')
lnL.a <- rep(0, l.que)
Beta.a <- matrix(rep(0, l.que*8*J), nrow=8*J)   

## Grid search and simultaneous parameter estimation
for(q in que){
  X.q <- CreateX((n), q)
  X.q.1 <- X.q[ -1, ]
  res <- apply(Y, 2, function(x) ITS.Est.Core2(x, X.q, q))  
  lnL.a[(q- (que[1] -1))] <- sum(res[9, ])  ###
  Beta.a[ , (q-(que[1] -1))] <- as.vector(res[1:8, ])  ###
  
  Sigma.R <- apply( cbind(res2[3, ], res2[4, ]), 1, function(x) Sig(x[1], x[2], (n-1)))
  #Sig(res2[3], res2[4], (n-1))
  V.R <- apply(Sigma.R, 2, function(x) solve(((t(X.q.1) %*% solve(matrix(x, ncol=(n-1)))) %*% X.q.1)))
  W.mid.R <- apply( V.R, 2, function(x)  solve( ((C %*% matrix(x, ncol=4) ) %*% t(C)) ))
  W.1 <- apply(matrix(Beta.a[ , (q-(que[1] -1))], ncol=J)[1:4, ], 2, function(x) (C %*% x))
  Wald <- 0
  for(j in 1:J){
    Wald <- Wald + ( t(W.1[ ,j]) %*% matrix(W.mid.R[ ,j], ncol=2)) %*% W.1[ ,j]
    #print(Wald)
  }
  Wald.k[(q-(que[1] -1)), 1] <- Wald 
}

# maximizing over the set 'que'
best <- which(lnL.a == max(lnL.a))    ## fix! Ties...
Tau.F <- best + (que[1] - 1)
Beta.F <- matrix(Beta.a[ , best], ncol=J)
lnL.F <- lnL.a[best]

Pvalues.W <- pchisq(Wald.k, df=(2*J), lower.tail=FALSE)
Pvalues.W.sort <- sort(Pvalues.W)
Pval.W <- Pvalues.W.sort[1]  ## FINAL P-VALUE
Reject.W <- BH.func(Pvalues.W.sort, l.que)
BH <- ((1:l.que)/l.que)*0.05
cbind(Pvalues.W.sort, BH)  

Change.Point <- cbind(Tau.F, round(Pval.W, 4), BH[1])
colnames(Change.Point) <- c("Estimate", "P-value", "B-H Pval Cut-off")
rownames(Beta.F) <- c("Pre Int", "Pre-Slope", "CIL (anchored at Tau)", "CIS", "Pre Phi", "Post Phi",
                      "Pre Y SD", "Post Y SD")
colnames(Beta.F) <- c("Unit 1", "Unit 2", "Unit 3")

X.tau <- CreateX(n, Tau.F)
CIL <- apply(Beta.F, 2, function(x) Contrast_CI(x[5:6], x[7:8], x[1:4], X.tau, Tau.F, c(0,0,-1,-Tau.F)))[-4, ]
CIS <- apply(Beta.F, 2, function(x) Contrast_CI(x[5:6], x[7:8], x[1:4], X.tau, Tau.F, c(0,0,0,1)))[-4, ]
Pre.Int <- apply(Beta.F, 2, function(x) Contrast_CI(x[5:6], x[7:8], x[1:4], X.tau, Tau.F, c(1,0,0,0)))[-4, ]
Pre.Slope <- apply(Beta.F, 2, function(x) Contrast_CI(x[5:6], x[7:8], x[1:4], X.tau, Tau.F, c(0,1,0,0)))[-4, ]

rownames(CIL) <- rownames(CIS) <- rownames(Int.Pre) <- rownames(Slope.Pre) <- c("Estimate", "ci95.left", "ci95.right", "Pr(>|t|)")	
colnames(CIL) <- colnames(CIS) <- colnames(Int.Pre) <- colnames(Slope.Pre) <- c("Unit 1", "Unit 2", "Unit 3")

##############
## Results

Change.Point
Beta.F
Pre.Int
Pre.Slope
CIL
CIS
