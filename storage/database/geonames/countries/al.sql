-- غیر فعال کردن کلیدها برای سرعت
/*!40000 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- جدول subadmin1
INSERT INTO `__PREFIX__subadmin1` (`code`, `country_code`, `name`, `active`) VALUES
('AL.40','AL','{"en":"Berat"}',1),
('AL.41','AL','{"en":"Dibër"}',1),
('AL.42','AL','{"en":"Durrës"}',1),
('AL.43','AL','{"en":"Elbasan"}',1),
('AL.44','AL','{"en":"Fier"}',1),
('AL.45','AL','{"en":"Gjirokastër"}',1),
('AL.46','AL','{"en":"Korçë"}',1),
('AL.47','AL','{"en":"Kukës"}',1),
('AL.48','AL','{"en":"Lezhë"}',1),
('AL.49','AL','{"en":"Shkodër"}',1),
('AL.50','AL','{"en":"Tirana"}',1),
('AL.51','AL','{"en":"Vlorë"}',1);

-- جدول subadmin2
INSERT INTO `__PREFIX__subadmin2` (`code`, `country_code`, `subadmin1_code`, `name`, `active`) VALUES
('AL.40.01','AL','AL.40','{"en":"Rrethi i Beratit"}',1),
('AL.40.22','AL','AL.40','{"en":"Rrethi i Skraparit"}',1),
('AL.41.02','AL','AL.41','{"en":"Rrethi i Dibrës"}',1),
('AL.41.15','AL','AL.41','{"en":"Rrethi i Matit"}',1),
('AL.43.04','AL','AL.43','{"en":"Rrethi i Elbasanit"}',1),
('AL.43.07','AL','AL.43','{"en":"Rrethi i Gramshit"}',1),
('AL.45.06','AL','AL.45','{"en":"Rrethi i Gjirokastrës"}',1),
('AL.45.17','AL','AL.45','{"en":"Rrethi i Përmetit"}',1),
('AL.46.08','AL','AL.46','{"en":"Rrethi i Kolonjës"}',1),
('AL.46.09','AL','AL.46','{"en":"Rrethi i Korçës"}',1),
('AL.46.18','AL','AL.46','{"en":"Rrethi i Pogradecit"}',1),
('AL.47.11','AL','AL.47','{"en":"Rrethi i Kukësit"}',1),
('AL.47.26','AL','AL.47','{"en":"Rrethi i Tropojës"}',1),
('AL.49.19','AL','AL.49','{"en":"Rrethi i Pukës"}',1),
('AL.50.28','AL','AL.50','{"en":"Rrethi i Tiranës"}',1),
('AL.51.20','AL','AL.51','{"en":"Rrethi i Sarandës"}',1),
('AL.51.30','AL','AL.51','{"en":"Rrethi i Delvinës"}',1);

-- غیر فعال کردن کلیدها دوباره فعال شود
/*!40000 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
