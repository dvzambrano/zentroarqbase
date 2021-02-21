-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 08-11-2014 a las 02:58:13
-- Versión del servidor: 5.5.16
-- Versión de PHP: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `sgarqbase`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_forgot_password`
--

CREATE TABLE IF NOT EXISTS `sf_guard_forgot_password` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `unique_key` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_group`
--

CREATE TABLE IF NOT EXISTS `sf_guard_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `sf_guard_group`
--

INSERT INTO `sf_guard_group` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrador(a)', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 'advanced', 'Avanzado(a)', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(3, 'basic', 'Usuario(a)', '2014-10-15 12:33:16', '2014-10-15 12:33:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_group_permission`
--

CREATE TABLE IF NOT EXISTS `sf_guard_group_permission` (
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `permission_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`group_id`,`permission_id`),
  KEY `sf_guard_group_permission_permission_id_sf_guard_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sf_guard_group_permission`
--

INSERT INTO `sf_guard_group_permission` (`group_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 2, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 3, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 4, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 5, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 6, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(1, 7, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 1, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 2, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 3, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 4, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(3, 1, '2014-10-15 12:33:16', '2014-10-15 12:33:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_login_attempt`
--

CREATE TABLE IF NOT EXISTS `sf_guard_login_attempt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(15) DEFAULT NULL,
  `host_name` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_permission`
--

CREATE TABLE IF NOT EXISTS `sf_guard_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Volcado de datos para la tabla `sf_guard_permission`
--

INSERT INTO `sf_guard_permission` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'manageconfiguration', 'Administrar configuracion global', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 'managemodule', 'Administrar módulos', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(3, 'manageuser', 'Administrar usuarios', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(4, 'managelog', 'Administrar trazas', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(5, 'managefiles', 'Administrar archivos', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(6, 'managecharts', 'Administrar graficos', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(7, 'managecalendar', 'Administrar calendario', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(8, 'manageuseradd', 'Administrar usuarios (adicionar)', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(9, 'manageuseredit', 'Administrar usuarios (editar)', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(10, 'manageuserdelete', 'Administrar usuarios (eliminar)', '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(11, 'managemoduleadd', 'Administrar módulos (adicionar)', '2014-10-15 12:33:17', '2014-10-15 12:33:17'),
(12, 'managemoduleedit', 'Administrar módulos (editar)', '2014-10-15 12:33:17', '2014-10-15 12:33:17'),
(13, 'managemoduledelete', 'Administrar módulos (eliminar)', '2014-10-15 12:33:17', '2014-10-15 12:33:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_remember_key`
--

CREATE TABLE IF NOT EXISTS `sf_guard_remember_key` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `remember_key` varchar(32) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_user`
--

CREATE TABLE IF NOT EXISTS `sf_guard_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `username` varchar(128) NOT NULL,
  `algorithm` varchar(128) NOT NULL DEFAULT 'sha1',
  `salt` varchar(128) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_super_admin` tinyint(1) DEFAULT '0',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `is_active_idx_idx` (`is_active`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `sf_guard_user`
--

INSERT INTO `sf_guard_user` (`id`, `first_name`, `last_name`, `email_address`, `username`, `algorithm`, `salt`, `password`, `is_active`, `is_super_admin`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'Daniel', 'Velazquez Zamora', 'admin@domain.com', 'admin', 'sha1', '53d7b70a08bcfc7a2a03402cf1fa12d9', 'eda1843bc07c9e8fd84e0053cea6f30f7b4a6241', 1, 1, '2014-11-07 09:52:10', '2014-10-15 12:33:16', '2014-11-07 09:52:10'),
(2, 'Dannys', 'Avila Gonzalez', 'advanced@domain.com', 'advanced', 'sha1', 'e2d81765b4af434fb373aeb9939eee7b', 'd785953b449c67b74466805f89b8829f2d1d4f5f', 1, 0, NULL, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(3, 'Maira', 'Perez Ramos', 'basic@domain.com', 'basic', 'sha1', '56ea8470cc4c5d3f64eba43c3b7d6aec', '5c6ae49d876f80f0b999f1bc44565c7c01611147', 1, 0, NULL, '2014-10-15 12:33:16', '2014-10-15 12:33:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_user_group`
--

CREATE TABLE IF NOT EXISTS `sf_guard_user_group` (
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `group_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `sf_guard_user_group_group_id_sf_guard_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sf_guard_user_group`
--

INSERT INTO `sf_guard_user_group` (`user_id`, `group_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(2, 2, '2014-10-15 12:33:16', '2014-10-15 12:33:16'),
(3, 3, '2014-10-15 12:33:16', '2014-10-15 12:33:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_user_password`
--

CREATE TABLE IF NOT EXISTS `sf_guard_user_password` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `algorithm` varchar(128) NOT NULL DEFAULT 'sha1',
  `salt` varchar(128) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sf_guard_user_permission`
--

CREATE TABLE IF NOT EXISTS `sf_guard_user_permission` (
  `user_id` bigint(20) NOT NULL DEFAULT '0',
  `permission_id` bigint(20) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`permission_id`),
  KEY `sf_guard_user_permission_permission_id_sf_guard_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_calendar`
--

CREATE TABLE IF NOT EXISTS `sgab_calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `comment` text,
  `color` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Volcado de datos para la tabla `sgab_calendar`
--

INSERT INTO `sgab_calendar` (`id`, `code`, `name`, `comment`, `color`) VALUES
(1, '09476c3cf5f13e5c36d0e812f7364d88', 'Trabajo', NULL, 6),
(2, 'e41ee28e036aab0388bea90110a2ec74', 'Casa', NULL, 15),
(3, '17d311bb72096d252c26b3b926786211', 'Escuela', NULL, 26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_entityuserrelation`
--

CREATE TABLE IF NOT EXISTS `sgab_entityuserrelation` (
  `entity_id` bigint(20) NOT NULL DEFAULT '0',
  `sf_guard_user_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`entity_id`,`sf_guard_user_id`),
  KEY `sgab_entityuserrelation_sf_guard_user_id_sf_guard_user_id` (`sf_guard_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_event`
--

CREATE TABLE IF NOT EXISTS `sgab_event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `comment` text,
  `allday` tinyint(1) DEFAULT '0',
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `calendarid` bigint(20) DEFAULT NULL,
  `reminderid` bigint(20) DEFAULT NULL,
  `location` text,
  `link` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `calendarid_idx` (`calendarid`),
  KEY `reminderid_idx` (`reminderid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Volcado de datos para la tabla `sgab_event`
--

INSERT INTO `sgab_event` (`id`, `code`, `name`, `comment`, `allday`, `start`, `end`, `calendarid`, `reminderid`, `location`, `link`) VALUES
(1, '0d57c220a3ef147e1cf35430e303a603', 'Vacaciones', 'Tiempo de diversion...', 0, '2014-09-24 14:00:00', '2014-10-05 15:00:00', 2, 1, NULL, NULL),
(2, '40336cf3edc079a4f64446dffa121fdb', 'Almuerzo con Dcita', 'Debo estar una hora antes en el restaurant', 0, '2014-10-15 11:30:00', '2014-10-15 13:00:00', 1, 1, NULL, NULL),
(3, '9ff0c2c742ef6eff9ebb0a8160898008', 'Pagar la electricidad', NULL, 0, '2014-10-15 15:00:00', '2014-10-15 15:00:00', 1, NULL, NULL, NULL),
(4, 'd61915029953cccd22cc4df817b398c8', 'Cumpleaños de Mayra', 'Hay q comprar un regalo', 1, '2014-10-15 00:00:00', '2014-10-15 00:00:00', 2, NULL, NULL, NULL),
(5, 'bdbcb6692ff90ceeb50a26847d306f2f', 'Hacer ejercicios', NULL, 1, '2014-10-03 00:00:00', '2014-10-24 23:59:59', 1, NULL, NULL, NULL),
(6, 'e141a4c2bd74aa2c4efd27d07541c718', 'Pelarme', NULL, 0, '2014-10-15 09:00:00', '2014-10-15 09:30:00', 2, NULL, NULL, NULL),
(7, '4cbf1a8c26a033b0331597a48c3187a1', 'Consejo de direccion', NULL, 0, '2014-10-13 13:00:00', '2014-10-13 18:00:00', 1, NULL, NULL, NULL),
(8, '43568a3b57377c8866c644f3707a12aa', 'Noche de peliculas', NULL, 0, '2014-10-17 19:00:00', '2014-10-17 23:00:00', 2, NULL, NULL, NULL),
(9, '3ff2953c341b75df009234886ae7019f', 'Forum nacional', NULL, 0, '2014-10-23 08:00:00', '2014-10-28 16:00:00', 3, NULL, 'Ciudad de la Habana', 'www.forum.cuba.cu');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_example`
--

CREATE TABLE IF NOT EXISTS `sgab_example` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `nick` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `comment` text,
  `path` text,
  `parentid` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `parentid_idx` (`parentid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=72 ;

--
-- Volcado de datos para la tabla `sgab_example`
--

INSERT INTO `sgab_example` (`id`, `code`, `nick`, `name`, `comment`, `path`, `parentid`) VALUES
(1, '95b566d250acee63bf6a12f3e807a5bd', 'Elemento padre', 'Elemento padre con hijos', 'Elemento padre', NULL, NULL),
(2, 'd432e93eacfdaf3b3d18914506c2321d', 'Elemento padre', 'Elemento padre sin hijos', 'Elemento padre', NULL, NULL),
(3, 'c4ca4238a0b923820dcc509a6f75849b', ' c4ca4', ' c4ca4', ' ', NULL, 1),
(4, 'c81e728d9d4c2f636f067f89cc14862c', ' c8', ' c8', ' ', NULL, 1),
(5, 'eccbc87e4b5ce2fe28308fd9f2a7baf3', ' eccb eccbc8', ' eccb eccbc8', ' ', NULL, 1),
(6, 'a87ff679a2f3e71d9181a67b7542122c', ' a8 a87ff', ' a8 a87ff', ' ', NULL, 1),
(7, 'e4da3b7fbbce2345d7772b0674a318d5', ' e4da e4da e4da3b', ' e4da e4da e4da3b', ' ', NULL, 1),
(8, '1679091c5a880faf6fb5e6087eb1b2dc', ' 167', ' 167', ' ', NULL, 1),
(9, '8f14e45fceea167a5a36dedd4bea2543', ' 8f', ' 8f', ' ', NULL, 1),
(10, 'c9f0f895fb98ab9159f51fd0297e236d', ' c9f0f c9 c9f0 c9f0f8', ' c9f0f c9 c9f0 c9f0f8', ' ', NULL, 1),
(11, '45c48cce2e2d7fbdea1afc51c7c6ad26', ' 45c', ' 45c', ' ', NULL, 1),
(12, 'd3d9446802a44259755d38e6d163e820', ' d3d9 d3d d3d d3d9', ' d3d9 d3d d3d d3d9', ' ', NULL, 1),
(13, '6512bd43d9caa6e02c990b0a82652dca', ' 6512b', ' 6512b', ' ', NULL, 1),
(14, 'c20ad4d76fe97759aa27a0c99bff6710', ' c20ad4', ' c20ad4', ' ', NULL, 1),
(15, 'c51ce410c124a10e0db5e4b97fc2af39', ' c51ce c51c', ' c51ce c51c', ' ', NULL, 1),
(16, 'aab3238922bcc25a6f606eb525ffdc56', ' aab32 aa aab323', ' aab32 aa aab323', ' ', NULL, 1),
(17, '9bf31c7ff062936a96d3c8bd1f8f2ff3', ' 9bf31c 9bf 9b', ' 9bf31c 9bf 9b', ' ', NULL, 1),
(18, 'c74d97b01eae257e44aa9d5bade97baf', ' c74', ' c74', ' ', NULL, 1),
(19, '70efdf2ec9b086079795c442636b55fb', ' 70ef 70efd 70 70', ' 70ef 70efd 70 70', ' ', NULL, 1),
(20, '6f4922f45568161a8cdf4ad2299f6d23', ' 6f 6f492', ' 6f 6f492', ' ', NULL, 1),
(21, '1f0e3dad99908345f7439f8ffabdffc4', ' 1f0 1f0e3d 1f', ' 1f0 1f0e3d 1f', ' ', NULL, 1),
(22, '98f13708210194c475687be6106a3b84', ' 98f137 98 98f13', ' 98f137 98 98f13', ' ', NULL, 1),
(23, '3c59dc048e8850243be8079a5c74d079', ' 3c59dc 3c', ' 3c59dc 3c', ' ', NULL, 1),
(24, 'b6d767d2f8ed5d21a44b0e5886680cb9', ' b6 b6d7 b6', ' b6 b6d7 b6', ' ', NULL, 1),
(25, '37693cfc748049e45d87b8c7d8b9aacd', ' 37693c 37693c', ' 37693c 37693c', ' ', NULL, 1),
(26, '1ff1de774005f8da13f42943881c655f', ' 1f 1ff1 1ff1d 1f', ' 1f 1ff1 1ff1d 1f', ' ', NULL, 1),
(27, '8e296a067a37563370ded05f5a3bf3ec', ' 8e', ' 8e', ' ', NULL, 1),
(28, '4e732ced3463d06de0ca9a15b6153677', ' 4e73 4e 4e732c 4e73', ' 4e73 4e 4e732c 4e73', ' ', NULL, 1),
(29, '02e74f10e0327ad868d138f2b4fdd6f0', ' 02e7 02', ' 02e7 02', ' ', NULL, 1),
(30, '33e75ff09dd601bbe69f351039152189', ' 33e75 33e7 33e 33e75f', ' 33e75 33e7 33e 33e75f', ' ', NULL, 1),
(31, '6ea9ab1baa0efb9e19094440c317e21b', ' 6ea 6ea', ' 6ea 6ea', ' ', NULL, 1),
(32, '34173cb38f07f89ddbebc2ac9128303f', ' 341 34173c 34173c', ' 341 34173c 34173c', ' ', NULL, 1),
(33, 'c16a5320fa475530d9583c34fd356ef5', ' c16a53 c16 c16a', ' c16a53 c16 c16a', ' ', NULL, 1),
(34, '6364d3f0f495b6ab9dcf8d3b5c6e0b01', ' 636 636 6364d3', ' 636 636 6364d3', ' ', NULL, 1),
(35, '182be0c5cdcd5072bb1864cdee4d3d6e', ' 182b 182be0 18 182be0 182be0', ' 182b 182be0 18 182be0 182be0', ' ', NULL, 1),
(36, 'e369853df766fa44e1ed0ff613f563bd', ' e369 e3698', ' e369 e3698', ' ', NULL, 1),
(37, 'f899139df5e1059396431415e770c6dd', ' f8991 f899', ' f8991 f899', ' ', NULL, NULL),
(38, '38b3eff8baf56627478ec76a704e9b52', ' 38b3e 38b3e 38b3 38b3 38b', ' 38b3e 38b3e 38b3 38b3 38b', ' ', NULL, NULL),
(39, 'ec8956637a99787bd197eacd77acce5e', ' ec8956 ec ec89', ' ec8956 ec ec89', ' ', NULL, NULL),
(40, '6974ce5ac660610b44d9b9fed0ff9548', ' 69 6974 697', ' 69 6974 697', ' ', NULL, NULL),
(41, 'c9e1074f5b3f9fc8ea15d152add07294', ' c9 c9e c9e1 c9', ' c9 c9e c9e1 c9', ' ', NULL, NULL),
(42, '65b9eea6e1cc6bb9f0cd2a47751a186f', ' 65b9ee', ' 65b9ee', ' ', NULL, NULL),
(43, 'f0935e4cd5920aa6c7c996a5ee53a70f', ' f0935e f093', ' f0935e f093', ' ', NULL, NULL),
(44, 'a97da629b098b75c294dffdc3e463904', ' a97d a9 a97', ' a97d a9 a97', ' ', NULL, NULL),
(45, 'a3c65c2974270fd093ee8a9bf8ae7d0b', ' a3c6 a3c', ' a3c6 a3c', ' ', NULL, NULL),
(46, '2723d092b63885e0d7c260cc007e8b9d', ' 27', ' 27', ' ', NULL, NULL),
(47, '5f93f983524def3dca464469d2cf9f3e', ' 5f93 5f9 5f93f9 5f93f9', ' 5f93 5f9 5f93f9 5f93f9', ' ', NULL, NULL),
(48, '698d51a19d8a121ce581499d7b701668', ' 69 698d5 69', ' 69 698d5 69', ' ', NULL, NULL),
(49, '7f6ffaa6bb0b408017b62254211691b5', ' 7f 7f6ffa 7f6ff', ' 7f 7f6ffa 7f6ff', ' ', NULL, NULL),
(50, '73278a4a86960eeb576a8fd4c9ec6997', ' 73278 732', ' 73278 732', ' ', NULL, NULL),
(51, '5fd0b37cd7dbbb00f97ba6ce92bf5add', ' 5f 5fd', ' 5f 5fd', ' ', NULL, NULL),
(52, '2b44928ae11fb9384c4cf38708677c48', ' 2b4492 2b 2b', ' 2b4492 2b 2b', ' ', NULL, NULL),
(53, 'c45147dee729311ef5b5c3003946c48f', ' c45', ' c45', ' ', NULL, NULL),
(54, 'eb160de1de89d9058fcb0b968dbbbd68', ' eb16 eb160 eb', ' eb16 eb160 eb', ' ', NULL, NULL),
(55, '5ef059938ba799aaa845e1c2e8a762bd', ' 5ef0 5e 5ef05 5ef0', ' 5ef0 5e 5ef05 5ef0', ' ', NULL, NULL),
(56, '07e1cd7dca89a1678042477183b7ac3f', ' 07e1c 07e1 07e1c', ' 07e1c 07e1 07e1c', ' ', NULL, NULL),
(57, 'da4fb5c6e93e74d3df8527599fa62642', ' da4', ' da4', ' ', NULL, NULL),
(58, '4c56ff4ce4aaf9573aa5dff913df997a', ' 4c 4c5', ' 4c 4c5', ' ', NULL, NULL),
(59, 'a0a080f42e6f13b3a2df133f073095dd', ' a0a080 a0', ' a0a080 a0', ' ', NULL, NULL),
(60, '202cb962ac59075b964b07152d234b70', ' 202cb9 202c 202cb9 202c', ' 202cb9 202c 202cb9 202c', ' ', NULL, NULL),
(61, 'c8ffe9a587b126f152ed3d89a146b445', ' c8', ' c8', ' ', NULL, NULL),
(62, '3def184ad8f4755ff269862ea77393dd', ' 3def18', ' 3def18', ' ', NULL, NULL),
(63, '069059b7ef840f0c74a814ec9237b6ec', ' 06905 06905 0690 06 069059', ' 06905 06905 0690 06 069059', ' ', NULL, NULL),
(64, 'ec5decca5ed3d6b8079e2e7e7bacc9f2', ' ec5de ec5dec ec5d ec5d', ' ec5de ec5dec ec5d ec5d', ' ', NULL, NULL),
(65, '76dc611d6ebaafc66cc0879c71b5db5c', ' 76dc6 76 76dc6 76 76dc 76dc', ' 76dc6 76 76dc6 76 76dc 76dc', ' ', NULL, NULL),
(66, 'd1f491a404d6854880943e5c3cd9ca25', ' d1f49 d1f d1f49 d1f49', ' d1f49 d1f d1f49 d1f49', ' ', NULL, NULL),
(67, '9b8619251a19057cff70779273e95aa6', ' 9b 9b861', ' 9b 9b861', ' ', NULL, NULL),
(68, '1afa34a7f984eeabdbb0a7d494132ee5', ' 1afa34', ' 1afa34', ' ', NULL, NULL),
(69, '65ded5353c5ee48d0b7d48c591b8f430', ' 65ded5 65d 65ded', ' 65ded5 65d 65ded', ' ', NULL, NULL),
(70, '9fc3d7152ba9336a670e36d0ed79bc43', ' 9f 9fc3 9fc3d7', ' 9f 9fc3 9fc3d7', ' ', NULL, NULL),
(71, '02522a2b2726fb0a03bb19f2d8d9524d', ' 02522 0252 02522a', ' 02522 0252 02522a', ' ', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_metadata`
--

CREATE TABLE IF NOT EXISTS `sgab_metadata` (
  `name` varchar(50) NOT NULL DEFAULT '',
  `comment` text,
  `value` text,
  `category` text,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sgab_metadata`
--

INSERT INTO `sgab_metadata` (`name`, `comment`, `value`, `category`) VALUES
('app_authldapencode', 'Establece si es necesario codificar en UTF-8 los resultados obtenidos desde el LDAP', '1', 'LDAP'),
('app_authldapfilterdn', 'Establece la ubicación de los usuarios en el LDAP', 'OU=Unit,DC=domain,DC=com', 'LDAP'),
('app_authldaprootdn', 'Establece la ubicación del usuario de búsqueda en el LDAP', 'CN=Users,DC=domain,DC=com', 'LDAP'),
('app_authldapsearchinguser', 'Establece el usuario usado para realizar la conexión con el LDAP', 'administrador', 'LDAP'),
('app_authldapsearchinguserpass', 'Establece la contraseña del usuario usado para realizar la conexión con el LDAP', 'C0ntrasenna', 'LDAP'),
('app_authldapserver', 'Permite definir el Nombre o Dirección IP del servidor LDAP', '192.168.3.22', 'LDAP'),
('app_authmode', 'Establece el tipo de autenticación a usar en el sistema: "local" (sin comillas) para usar la base de datos, "ldap" (sin comillas) para usar un directorio activo y "mixed" (sin comillas) para combinar ambos métodos', 'local', 'Sistema'),
('app_businessmail', 'Permite definir la cuenta de correo que será utilizada para la realización de las transferencias de pago mediante PayPal y para el envío de las notificaciones generadas por el sistema.', 'dvz@domain.com', 'Sistema'),
('app_defaultlanguaje', 'Define el idioma en que por defecto se cargarán las interfaces del sistema aun cuando pueden ser variadas localmente mediante el uso de la Barra superior.', 'es-Es', 'Sistema'),
('app_elementsongrid', 'Establece la cantidad de elementos a mostrar en una página de interfaz tabular correspondiente al área de trabajo. De esta forma el sistema se encarga de generar la paginación que entre otras cosas permite elevar el rendimiento de las consultas realizadas a las bases de datos.', '20', 'Tablas de datos'),
('app_fileintegrity', 'Establece la suma de chequeo de integridad de los archivos del sistema', 'e0e4bd94e17192523d851e210fffea8c', 'Sistema'),
('app_lockaccountfor', 'Permite definir el tiempo en segundos por el que se bloquea a los usuarios que superan el máximo de intentos fallidos de autenticación', '300', 'Seguridad'),
('app_mailencryption', 'Establece el Tipo de Encriptado utilizado por el servidor de correo: ~, ssl, tls', '~', 'Correo'),
('app_mailhost', 'Establece el Nombre o la Dirección IP del servidor de correo', '10.0.0.1', 'Correo'),
('app_mailhostport', 'Establece el Puerto por el que escucha el servidor de correo', '25', 'Correo'),
('app_mailpassword', 'Establece el la Contraseña del usuario de correo utilizado para enviar las notificaciones', 'noresponder', 'Correo'),
('app_mailusername', 'Establece el Usuario de correo utilizado para enviar las notificaciones', 'noresponder@domain.com', 'Correo'),
('app_name', 'Permite variar el nombre del sistema mostrado el banner superior', 'Zentro&reg; SGArqBase', 'Sistema'),
('app_sendsystememails', 'Permite definir si el sistema enviará notificaciones por correo o no', '1', 'Sistema'),
('app_showgridtitle', 'Permite personalizar las vistas de las interfaces de gestión usando o no los títulos en las tablas.', '1', 'Tablas de datos'),
('app_showmessageonformloadfailed', 'Permite establecer si el sistema mostrará mensajes de notificación cuando NO se hayan cargado datos a un formulario satisfactoriamente', '1', 'Notificaciones'),
('app_showmessageonformloadsuccessful', 'Permite establecer si el sistema mostrará mensajes de notificación cuando se hayan cargado datos a un formulario satisfactoriamente', '', 'Notificaciones'),
('app_showmessageonmoduleloadsuccessful', 'Permite establecer si el sistema mostrará mensajes de notificación cuando se active un módulo satisfactoriamente', '1', 'Notificaciones'),
('app_showmessageonstoreloadfailed', 'Permite establecer si el sistema mostrará mensajes de notificación cuando NO se hayan cargado satisfactoriamente las fuentes de datos', '1', 'Notificaciones'),
('app_showmessageonstoreloadsuccessful', 'Permite establecer si el sistema mostrará mensajes de notificación cuando se hayan cargado satisfactoriamente las fuentes de datos', '', 'Notificaciones'),
('app_unsuccessfulloginattempts', 'Permite definir la cantidad de intentos de autenticación fallidos antes de bloquear el acceso al usuario', '3', 'Seguridad'),
('app_uploadimagedestination', 'Permite definir el lugar donde se desean guardar las imagenes de usuarios del sistema. ("file" como archivos y "db" en la base de datos)', 'file', 'Sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_module`
--

CREATE TABLE IF NOT EXISTS `sgab_module` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `nick` varchar(130) NOT NULL,
  `icon` varchar(130) DEFAULT NULL,
  `comment` text,
  `attributes` text,
  `relations` text,
  `module_id` bigint(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_multientity` tinyint(1) DEFAULT '0',
  `is_multientidable` tinyint(1) DEFAULT '0',
  `is_base` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `module_id_idx` (`module_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Volcado de datos para la tabla `sgab_module`
--

INSERT INTO `sgab_module` (`id`, `code`, `name`, `nick`, `icon`, `comment`, `attributes`, `relations`, `module_id`, `is_active`, `is_multientity`, `is_multientidable`, `is_base`) VALUES
(1, 'e7af0863035207943f53f63d68f6f170', 'Gráficos', 'Chart', 'wtop-charts.png', 'Generador de gráficos del sistema', NULL, NULL, NULL, 1, 0, 0, 1),
(2, 'a6d080f2730d57c1da1e777002102139', 'Calendario', 'Calendar', 'wtop-calendars.png', 'Visor de eventos del sistema', '[{"name":"Nombre","nick":"name","type":"string","restriction":"","nulleable":false},{"name":"Descripción","nick":"comment","type":"string","restriction":"","nulleable":false}]', NULL, NULL, 1, 0, 0, 1),
(3, 'a7c68a28d40f282bae2ee54b5abcb65a', 'Recordatorios', 'Reminder', 'wtop-reminders.png', 'Gestión de recordatorios del sistema', '[{"name":"Nombre","nick":"name","type":"string","restriction":"","nulleable":false},{"name":"Descripción","nick":"comment","type":"string","restriction":"","nulleable":false},{"name":"Valor","nick":"value","type":"int","restriction":"","nulleable":false},{"name":"Periodo","nick":"period","type":"int","restriction":"","nulleable":false}]', NULL, NULL, 1, 0, 0, 1),
(4, '0abc28bcb832a6bbd1c673309cbad21a', 'Usuarios', 'User', 'wtop-users.png', 'Gestión de usuarios del sistema', NULL, NULL, NULL, 1, 0, 0, 1),
(5, 'f77828c55becd4d2013f22bfbf5ccf94', 'Configuración', 'Metadata', 'wtop-config.png', 'Configuraci&oacute;n general del sistema', NULL, NULL, NULL, 1, 0, 0, 1),
(6, 'bf2d27ca3e7f635e06ac60a586240083', 'Trazas', 'Log', 'wtop-logs.png', 'Auditoría de trazas del sistema', NULL, NULL, NULL, 1, 0, 0, 1),
(7, 'a95374dafe28f54b7ce7729f8378c819', 'Módulos', 'Module', 'wtop-modules.png', 'Gestión de módulos del sistema', '[{"name":"Código","nick":"code","type":"string","restriction":"","nulleable":false},{"name":"Nombre","nick":"name","type":"string","restriction":"","nulleable":false},{"name":"Alias","nick":"nick","type":"string","restriction":"","nulleable":false},{"name":"Descripción","nick":"comment","type":"string","restriction":"","nulleable":false},{"name":"Ícono","nick":"icon","type":"string","restriction":"","nulleable":true}]', NULL, NULL, 1, 0, 0, 1),
(8, '566e353f89a32c0ff6d3f1374a7d54d1', 'Explorador', 'Explorer', 'wtop-explorer.png', 'Gestión de archivos y carpetas del sistema', '[{"name":"Nombre","nick":"name","type":"string","restriction":"","nulleable":false},{"name":"Fecha de modificación","nick":"lastmod","type":"string","restriction":"","nulleable":false},{"name":"Tamaño","nick":"size","type":"string","restriction":"","nulleable":false}]', NULL, NULL, 1, 0, 0, 1),
(9, 'c1040df776abc0ae02848d77852ed5ba', 'Ejemplos', 'Example', 'book_open.png', 'Demostración de uso de componentes y metodos', '[{"ispk":true,"name":"Código","nick":"code","type":"string","restriction":"50","nulleable":false},{"isak":true,"name":"Nombre","nick":"name","type":"string","restriction":"130","nulleable":false},{"name":"Alias","nick":"nick","type":"string","restriction":"50","nulleable":false},{"name":"Descripción","nick":"comment","type":"string","restriction":"","nulleable":true},{"name":"Padre","nick":"parent","type":"integer","restriction":"","nulleable":true}]', '[{"attributeid":"parent","attribute":"Padre","typeid":"onetomany","type":"Uno a muchos","moduleid":"Example","module":"Árbol paginado"}]', NULL, 1, 0, 0, 1),
(10, '3614f7b8bf42dbb37b040c9387ddc1f0', 'Prueba', 'Testing', 'key.png', 'Módulo de prueba para multientidad', '[{"ispk":true,"name":"Código","nick":"code","type":"string","restriction":"50","nulleable":false},{"isak":true,"name":"Nombre","nick":"name","type":"string","restriction":"130","nulleable":false},{"name":"Alias","nick":"nick","type":"string","restriction":"50","nulleable":false},{"name":"Descripción","nick":"comment","type":"string","restriction":"","nulleable":true},{"name":"Padre","nick":"parentid","type":"integer","restriction":"","nulleable":true}]', '[{"attributeid":"parentid","attribute":"Padre","typeid":"onetomany","type":"Uno a muchos","moduleid":"Testing","module":"Prueba"}]', NULL, 1, 1, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_moduledependencyrelation`
--

CREATE TABLE IF NOT EXISTS `sgab_moduledependencyrelation` (
  `module_id` bigint(20) NOT NULL DEFAULT '0',
  `dependency_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`module_id`,`dependency_id`),
  KEY `sgab_moduledependencyrelation_dependency_id_sgab_module_id` (`dependency_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sgab_moduledependencyrelation`
--

INSERT INTO `sgab_moduledependencyrelation` (`module_id`, `dependency_id`) VALUES
(2, 3),
(3, 4),
(7, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_modulepermission`
--

CREATE TABLE IF NOT EXISTS `sgab_modulepermission` (
  `module_id` bigint(20) NOT NULL DEFAULT '0',
  `permission_id` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`module_id`,`permission_id`),
  KEY `sgab_modulepermission_permission_id_sf_guard_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sgab_modulepermission`
--

INSERT INTO `sgab_modulepermission` (`module_id`, `permission_id`) VALUES
(5, 1),
(9, 1),
(10, 1),
(7, 2),
(4, 3),
(6, 4),
(8, 5),
(1, 6),
(2, 7),
(3, 7),
(4, 8),
(4, 9),
(4, 10),
(7, 11),
(7, 12),
(7, 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_person`
--

CREATE TABLE IF NOT EXISTS `sgab_person` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `cellphone` varchar(50) DEFAULT NULL,
  `address` text,
  `comment` text,
  `picture` text,
  `profile` text,
  `sf_guard_user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `sf_guard_user_id_idx` (`sf_guard_user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `sgab_person`
--

INSERT INTO `sgab_person` (`id`, `code`, `phone`, `cellphone`, `address`, `comment`, `picture`, `profile`, `sf_guard_user_id`) VALUES
(1, '81092719101', NULL, NULL, NULL, NULL, '../uploads/avatars/cutemale.png', '{"theme":"gray","customcolor":"[{\\"calendar\\":1,\\"color\\":\\"F88015\\"},{\\"calendar\\":2,\\"color\\":\\"9D3283\\"},{\\"calendar\\":3,\\"color\\":\\"2951B9\\"}]","entity":{"id":"*","name":""}}', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_reminder`
--

CREATE TABLE IF NOT EXISTS `sgab_reminder` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `comment` text,
  `value` bigint(20) DEFAULT NULL,
  `period` bigint(20) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Volcado de datos para la tabla `sgab_reminder`
--

INSERT INTO `sgab_reminder` (`id`, `code`, `name`, `comment`, `value`, `period`) VALUES
(1, '756a6b48859d658ec3677872a53fc934', 'Al inicio', 'Avisar en el momento de inicio del evento', 0, 1),
(2, '9be1b75865373d2ea6c48ce39d5041de', '5 minutos', 'Avisar cinco minutos antes del inicio del evento', 5, 1),
(3, '0eba28b497bd9a2719838c64fa2da75a', '15 minutos', 'Avisar quince minutos antes del inicio del evento', 15, 1),
(4, 'af50f6844262a64524344ed43e4e57ab', '30 minutos', 'Avisar media hora antes del inicio del evento', 30, 1),
(5, '6528b3bfd5e926a2146ff8237c759a07', '1 hora', 'Avisar una hora antes del inicio del evento', 1, 2),
(6, '28e3e9a4319d4e0ae062a0e79fba6eca', '2 horas', 'Avisar dos horas antes del inicio del evento', 2, 2),
(7, '734856e2910d50a0ff28d267659c87c0', '12 horas', 'Avisar doce horas antes del inicio del evento', 12, 2),
(8, '97174f95fec450fb8a789f8a3c6cfb4d', '1 dia', 'Avisar un dia antes del inicio del evento', 1, 3),
(9, '47945f7637940feee7369351aeac3aed', '2 dias', 'Avisar dos dias antes del inicio del evento', 2, 3),
(10, 'dab3c7d8a981b8a30f2f0ffe96584f80', '1 semana', 'Avisar una semana antes del inicio del evento', 1, 4),
(11, 'd46ee87531f388b6a745fca5bdc86c44', '2 semanas', 'Avisar dos semanas antes del inicio del evento', 2, 4),
(12, 'b6c87ba0a8df385e1f3831a40ea6951a', '1 mes', 'Avisar un mes antes del inicio del evento', 1, 5),
(13, 'bede15262f936e48f8a6a5aeddddd2ce', '1 año', 'Avisar un año antes del inicio del evento', 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sgab_testing`
--

CREATE TABLE IF NOT EXISTS `sgab_testing` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parentid` bigint(20) DEFAULT NULL,
  `comment` text,
  `nick` varchar(50) NOT NULL,
  `name` varchar(130) NOT NULL,
  `code` varchar(50) NOT NULL,
  `path` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `parentid_idx` (`parentid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Volcado de datos para la tabla `sgab_testing`
--

INSERT INTO `sgab_testing` (`id`, `parentid`, `comment`, `nick`, `name`, `code`, `path`) VALUES
(1, NULL, NULL, '', 'Unidad 1', 'abfe9cfd4a505d80d4165a5312b53203', NULL),
(2, NULL, NULL, '', 'Unidad 2', '1a15cb3ea23267ea0f0e03cad70293a8', NULL);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `sf_guard_forgot_password`
--
ALTER TABLE `sf_guard_forgot_password`
  ADD CONSTRAINT `sf_guard_forgot_password_user_id_sf_guard_user_id` FOREIGN KEY (`user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sf_guard_group_permission`
--
ALTER TABLE `sf_guard_group_permission`
  ADD CONSTRAINT `sf_guard_group_permission_group_id_sf_guard_group_id` FOREIGN KEY (`group_id`) REFERENCES `sf_guard_group` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sf_guard_group_permission_permission_id_sf_guard_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `sf_guard_permission` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sf_guard_remember_key`
--
ALTER TABLE `sf_guard_remember_key`
  ADD CONSTRAINT `sf_guard_remember_key_user_id_sf_guard_user_id` FOREIGN KEY (`user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sf_guard_user_group`
--
ALTER TABLE `sf_guard_user_group`
  ADD CONSTRAINT `sf_guard_user_group_group_id_sf_guard_group_id` FOREIGN KEY (`group_id`) REFERENCES `sf_guard_group` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sf_guard_user_group_user_id_sf_guard_user_id` FOREIGN KEY (`user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sf_guard_user_password`
--
ALTER TABLE `sf_guard_user_password`
  ADD CONSTRAINT `sf_guard_user_password_user_id_sf_guard_user_id` FOREIGN KEY (`user_id`) REFERENCES `sf_guard_user` (`id`);

--
-- Filtros para la tabla `sf_guard_user_permission`
--
ALTER TABLE `sf_guard_user_permission`
  ADD CONSTRAINT `sf_guard_user_permission_permission_id_sf_guard_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `sf_guard_permission` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sf_guard_user_permission_user_id_sf_guard_user_id` FOREIGN KEY (`user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_entityuserrelation`
--
ALTER TABLE `sgab_entityuserrelation`
  ADD CONSTRAINT `sgab_entityuserrelation_sf_guard_user_id_sf_guard_user_id` FOREIGN KEY (`sf_guard_user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_event`
--
ALTER TABLE `sgab_event`
  ADD CONSTRAINT `sgab_event_calendarid_sgab_calendar_id` FOREIGN KEY (`calendarid`) REFERENCES `sgab_calendar` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sgab_event_reminderid_sgab_reminder_id` FOREIGN KEY (`reminderid`) REFERENCES `sgab_reminder` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_example`
--
ALTER TABLE `sgab_example`
  ADD CONSTRAINT `sgab_example_parentid_sgab_example_id` FOREIGN KEY (`parentid`) REFERENCES `sgab_example` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_module`
--
ALTER TABLE `sgab_module`
  ADD CONSTRAINT `sgab_module_module_id_sgab_module_id` FOREIGN KEY (`module_id`) REFERENCES `sgab_module` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_moduledependencyrelation`
--
ALTER TABLE `sgab_moduledependencyrelation`
  ADD CONSTRAINT `sgab_moduledependencyrelation_dependency_id_sgab_module_id` FOREIGN KEY (`dependency_id`) REFERENCES `sgab_module` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sgab_moduledependencyrelation_module_id_sgab_module_id` FOREIGN KEY (`module_id`) REFERENCES `sgab_module` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_modulepermission`
--
ALTER TABLE `sgab_modulepermission`
  ADD CONSTRAINT `sgab_modulepermission_module_id_sgab_module_id` FOREIGN KEY (`module_id`) REFERENCES `sgab_module` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sgab_modulepermission_permission_id_sf_guard_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `sf_guard_permission` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_person`
--
ALTER TABLE `sgab_person`
  ADD CONSTRAINT `sgab_person_sf_guard_user_id_sf_guard_user_id` FOREIGN KEY (`sf_guard_user_id`) REFERENCES `sf_guard_user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sgab_testing`
--
ALTER TABLE `sgab_testing`
  ADD CONSTRAINT `sgab_testing_parentid_sgab_testing_id` FOREIGN KEY (`parentid`) REFERENCES `sgab_testing` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
