CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(500) NOT NULL,
  `setting_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`, `setting_type`) VALUES
('theme_mode', 'light', 'theme'),
('primary_color', '#00589C', 'theme'),
('secondary_color', '#50E3C2', 'theme'),
('accent_color', '#1891C3', 'theme'),
('font_family', 'Inter, sans-serif', 'theme');
