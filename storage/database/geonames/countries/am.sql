/*!40000 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- جدول subadmin1
INSERT INTO `__PREFIX__subadmin1` (`code`, `country_code`, `name`, `active`) VALUES
('AM.01','AM','{"en":"Aragatsotn"}',1),
('AM.02','AM','{"en":"Ararat"}',1),
('AM.03','AM','{"en":"Armavir"}',1),
('AM.04','AM','{"en":"Gegharkunik"}',1),
('AM.05','AM','{"en":"Kotayk"}',1),
('AM.06','AM','{"en":"Lori"}',1),
('AM.07','AM','{"en":"Shirak"}',1),
('AM.08','AM','{"en":"Syunik"}',1),
('AM.09','AM','{"en":"Tavush"}',1),
('AM.10','AM','{"en":"Vayots Dzor"}',1),
('AM.11','AM','{"en":"Yerevan"}',1);

-- جدول subadmin2
INSERT INTO `__PREFIX__subadmin2` (`code`, `country_code`, `subadmin1_code`, `name`, `active`) VALUES
('AM.01.7874001','AM','AM.01','{"en":"Achtarak"}',1),
('AM.04.616436','AM','AM.04','{"en":"Martuni"}',1),
('AM.08.174761','AM','AM.08','{"en":"Sisian"}',1),
('AM.10.174959','AM','AM.10','{"en":"Vayk\'i Shrjan"}',1),
('AM.11.616200','AM','AM.11','{"en":"Spandaryanskiy Rayon"}',1),
('AM.11.616205','AM','AM.11','{"en":"Arabkir"}',1),
('AM.11.616233','AM','AM.11','{"en":"Shaumyanskiy Rayon"}',1),
('AM.11.616323','AM','AM.11','{"en":"Ordzhonikidzevskiy Rayon"}',1),
('AM.11.616485','AM','AM.11','{"en":"Leninskiy Rayon"}',1),
('AM.11.616624','AM','AM.11','{"en":"Imeni Dvadtsati Shesti Komissarov Rayon"}',1);

-- جدول cities
INSERT INTO `__PREFIX__cities` (`country_code`, `name`, `longitude`, `latitude`, `feature_class`, `feature_code`, `subadmin1_code`, `subadmin2_code`, `population`, `time_zone`, `active`, `created_at`, `updated_at`) VALUES
('AM','{"en":"Yeghegnadzor"}',45.33,39.76,'P','PPLA','AM.10',NULL,8200,'Asia/Yerevan',1,'2016-10-06 23:00:00','2016-10-06 23:00:00'),
('AM','{"en":"Vedi"}',44.73,39.91,'P','PPL','AM.02',NULL,12192,'Asia/Yerevan',1,'2016-02-05 23:00:00','2016-02-05 23:00:00'),
('AM','{"en":"Vayk’"}',45.47,39.69,'P','PPL','AM.10',NULL,5419,'Asia/Yerevan',1,'2020-06-09 23:00:00','2020-06-09 23:00:00'),
('AM','{"en":"Kapan"}',46.41,39.21,'P','PPLA','AM.08',NULL,33160,'Asia/Yerevan',1,'2016-10-06 23:00:00','2016-10-06 23:00:00'),
('AM','{"en":"Goris"}',46.34,39.51,'P','PPL','AM.08',NULL,20379,'Asia/Yerevan',1,'2018-03-11 23:00:00','2018-03-11 23:00:00'),
('AM','{"en":"Hats’avan"}',45.97,39.46,'P','PPL','AM.08',NULL,15208,'Asia/Yerevan',1,'2020-06-09 23:00:00','2020-06-09 23:00:00'),
('AM','{"en":"Artashat"}',44.54,39.96,'P','PPLA','AM.02',NULL,20562,'Asia/Yerevan',1,'2016-10-06 23:00:00','2016-10-06 23:00:00'),
('AM','{"en":"Ararat"}',44.71,39.83,'P','PPL','AM.02',NULL,28832,'Asia/Yerevan',1,'2016-02-05 23:00:00','2016-02-05 23:00:00'),
('AM','{"en":"Yerevan"}',44.51,40.18,'P','PPLC','AM.11',NULL,1093485,'Asia/Yerevan',1,'2019-09-04 23:00:00','2019-09-04 23:00:00');
-- ادامه تمام شهرها را به همین سبک اضافه کنید

/*!40000 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
