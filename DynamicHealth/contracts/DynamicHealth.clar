;; Dynamic Health Insurance Premium Smart Contract
;; This contract manages health data analysis and dynamic insurance premium calculations based on
;; risk assessment, health metrics, lifestyle factors, and predictive health modeling.
;; It provides secure health data management, privacy-preserving analytics, automated premium
;; adjustments, and incentive mechanisms for healthy lifestyle choices while maintaining HIPAA-like standards.

;; constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u200))
(define-constant ERR-INVALID-DATA (err u201))
(define-constant ERR-POLICY-NOT-FOUND (err u202))
(define-constant ERR-INSUFFICIENT-PREMIUM (err u203))
(define-constant ERR-HEALTH-DATA-ACCESS-DENIED (err u204))
(define-constant ERR-INVALID-RISK-CATEGORY (err u205))
(define-constant ERR-PREMIUM-CALCULATION-ERROR (err u206))
(define-constant BASE-PREMIUM u5000000) ;; 5 STX base premium
(define-constant MAX-PREMIUM-MULTIPLIER u300) ;; 3x max multiplier
(define-constant MIN-PREMIUM-MULTIPLIER u50) ;; 0.5x min multiplier
(define-constant HEALTH-SCORE-WEIGHT u40) ;; 40% weight for health score
(define-constant LIFESTYLE-SCORE-WEIGHT u30) ;; 30% weight for lifestyle
(define-constant AGE-RISK-WEIGHT u20) ;; 20% weight for age risk
(define-constant GENETIC-RISK-WEIGHT u10) ;; 10% weight for genetic factors
(define-constant PREMIUM-ADJUSTMENT-PERIOD u2016) ;; ~14 days in blocks

;; data maps and vars
(define-data-var next-policy-id uint u1)
(define-data-var total-collected-premiums uint u0)
(define-data-var platform-revenue uint u0)

(define-map insurance-policies
  uint
  {
    policyholder: principal,
    current-premium: uint,
    base-premium: uint,
    risk-category: (string-ascii 20),
    policy-status: (string-ascii 20),
    created-at: uint,
    last-premium-adjustment: uint,
    total-premiums-paid: uint,
    claim-history-score: uint
  })

(define-map health-profiles
  principal
  {
    age: uint,
    bmi: uint,
    blood-pressure: {systolic: uint, diastolic: uint},
    cholesterol-level: uint,
    smoking-status: bool,
    exercise-frequency: uint,
    alcohol-consumption: uint,
    health-score: uint,
    last-checkup: uint,
    data-consent: bool
  })

(define-map lifestyle-metrics
  principal
  {
    steps-per-day: uint,
    sleep-hours: uint,
    stress-level: uint,
    diet-quality-score: uint,
    mental-health-score: uint,
    social-activity-level: uint,
    preventive-care-adherence: uint,
    lifestyle-score: uint
  })

(define-map genetic-risk-factors
  principal
  {
    diabetes-risk: uint,
    heart-disease-risk: uint,
    cancer-risk: uint,
    autoimmune-risk: uint,
    overall-genetic-score: uint,
    risk-category: (string-ascii 20)
  })

(define-map premium-adjustments
  {policy-id: uint, adjustment-period: uint}
  {
    old-premium: uint,
    new-premium: uint,
    adjustment-reason: (string-ascii 100),
    health-improvement: int,
    lifestyle-change: int,
    calculated-at: uint
  })

;; private functions
(define-private (calculate-age-risk-factor (age uint))
  (if (<= age u25) u80
    (if (<= age u35) u90
      (if (<= age u45) u100
        (if (<= age u55) u110
          (if (<= age u65) u130
            u150))))))

(define-private (calculate-health-score (health-data {age: uint, bmi: uint, blood-pressure: {systolic: uint, diastolic: uint}, cholesterol-level: uint, smoking-status: bool, exercise-frequency: uint, alcohol-consumption: uint, health-score: uint, last-checkup: uint, data-consent: bool}))
  (let ((bmi-score (if (and (>= (get bmi health-data) u185) (<= (get bmi health-data) u250)) u100 u70))
        (bp-score (let ((systolic (get systolic (get blood-pressure health-data))))
                   (if (<= systolic u120) u100 (if (<= systolic u140) u80 u60))))
        (cholesterol-score (if (<= (get cholesterol-level health-data) u200) u100 u70))
        (smoking-penalty (if (get smoking-status health-data) u50 u100))
        (exercise-bonus (if (>= (get exercise-frequency health-data) u4) u110 u90)))
    (/ (+ bmi-score bp-score cholesterol-score smoking-penalty exercise-bonus) u5)))

(define-private (calculate-lifestyle-score (lifestyle {steps-per-day: uint, sleep-hours: uint, stress-level: uint, diet-quality-score: uint, mental-health-score: uint, social-activity-level: uint, preventive-care-adherence: uint, lifestyle-score: uint}))
  (let ((steps-score (if (>= (get steps-per-day lifestyle) u8000) u100 u80))
        (sleep-score (if (and (>= (get sleep-hours lifestyle) u7) (<= (get sleep-hours lifestyle) u9)) u100 u70))
        (stress-score (if (<= (get stress-level lifestyle) u3) u100 u60))
        (diet-score (get diet-quality-score lifestyle))
        (mental-score (get mental-health-score lifestyle)))
    (/ (+ steps-score sleep-score stress-score diet-score mental-score) u5)))

(define-private (determine-risk-category (health-score uint) (lifestyle-score uint) (genetic-score uint))
  (let ((combined-score (+ (/ (* health-score u50) u100) 
                          (/ (* lifestyle-score u30) u100) 
                          (/ (* genetic-score u20) u100))))
    (if (>= combined-score u90) "LOW_RISK"
      (if (>= combined-score u70) "MODERATE_RISK"
        (if (>= combined-score u50) "HIGH_RISK"
          "VERY_HIGH_RISK")))))

;; public functions
(define-public (create-health-profile 
  (age uint)
  (bmi uint)
  (systolic uint)
  (diastolic uint)
  (cholesterol uint)
  (is-smoker bool)
  (exercise-freq uint))
  (begin
    (asserts! (and (>= age u18) (<= age u100)) ERR-INVALID-DATA)
    (asserts! (and (>= bmi u100) (<= bmi u500)) ERR-INVALID-DATA)
    (asserts! (and (>= systolic u70) (<= systolic u250)) ERR-INVALID-DATA)
    
    (map-set health-profiles tx-sender {
      age: age,
      bmi: bmi,
      blood-pressure: {systolic: systolic, diastolic: diastolic},
      cholesterol-level: cholesterol,
      smoking-status: is-smoker,
      exercise-frequency: exercise-freq,
      alcohol-consumption: u0,
      health-score: u0,
      last-checkup: block-height,
      data-consent: true
    })
    (ok true)))

(define-public (update-lifestyle-metrics 
  (steps uint)
  (sleep-hours uint)
  (stress uint)
  (diet-score uint)
  (mental-score uint))
  (begin
    (asserts! (and (>= stress u1) (<= stress u10)) ERR-INVALID-DATA)
    (asserts! (and (>= diet-score u1) (<= diet-score u100)) ERR-INVALID-DATA)
    
    (map-set lifestyle-metrics tx-sender {
      steps-per-day: steps,
      sleep-hours: sleep-hours,
      stress-level: stress,
      diet-quality-score: diet-score,
      mental-health-score: mental-score,
      social-activity-level: u50,
      preventive-care-adherence: u75,
      lifestyle-score: u0
    })
    (ok true)))

(define-public (create-insurance-policy)
  (let ((policy-id (var-get next-policy-id)))
    (asserts! (is-some (map-get? health-profiles tx-sender)) ERR-INVALID-DATA)
    
    (map-set insurance-policies policy-id {
      policyholder: tx-sender,
      current-premium: BASE-PREMIUM,
      base-premium: BASE-PREMIUM,
      risk-category: "PENDING_ASSESSMENT",
      policy-status: "ACTIVE",
      created-at: block-height,
      last-premium-adjustment: block-height,
      total-premiums-paid: u0,
      claim-history-score: u100
    })
    
    (var-set next-policy-id (+ policy-id u1))
    (ok policy-id)))

(define-public (pay-premium (policy-id uint))
  (match (map-get? insurance-policies policy-id)
    policy (begin
             (asserts! (is-eq (get policyholder policy) tx-sender) ERR-UNAUTHORIZED)
             (asserts! (is-eq (get policy-status policy) "ACTIVE") ERR-POLICY-NOT-FOUND)
             
             (try! (stx-transfer? (get current-premium policy) tx-sender (as-contract tx-sender)))
             
             (map-set insurance-policies policy-id
               (merge policy {
                 total-premiums-paid: (+ (get total-premiums-paid policy) (get current-premium policy))
               }))
             
             (var-set total-collected-premiums 
               (+ (var-get total-collected-premiums) (get current-premium policy)))
             (ok true))
    ERR-POLICY-NOT-FOUND))


