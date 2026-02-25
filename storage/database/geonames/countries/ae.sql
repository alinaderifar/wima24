/* =========================================
   SAFE PERFORMANCE OPTIMIZATION
   No Laravel code change required
========================================= */


/* ========= SUBADMIN1 ========= */

ALTER TABLE `__PREFIX__subadmin1`
    ADD INDEX idx_country_active (country_code, active),
    ADD INDEX idx_code (code),
    ADD INDEX idx_active (active);


/* ========= SUBADMIN2 ========= */

ALTER TABLE `__PREFIX__subadmin2`
    ADD INDEX idx_country_active (country_code, active),
    ADD INDEX idx_subadmin1_code (subadmin1_code),
    ADD INDEX idx_code (code),
    ADD INDEX idx_active (active);


/* ========= CITIES ========= */

ALTER TABLE `__PREFIX__cities`
    ADD INDEX idx_country_active (country_code, active),
    ADD INDEX idx_subadmin1_active (subadmin1_code, active),
    ADD INDEX idx_population (population),
    ADD INDEX idx_feature (feature_class, feature_code),
    ADD INDEX idx_time_zone (time_zone),
    ADD INDEX idx_created_at (created_at);


/* ========= OPTIMIZER REFRESH ========= */

ANALYZE TABLE `__PREFIX__subadmin1`;
ANALYZE TABLE `__PREFIX__subadmin2`;
ANALYZE TABLE `__PREFIX__cities`;
