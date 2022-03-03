# trainings.sunfox.ee
Веб-приложение для составления планов тренировок в спортивных секциях.

Подойдет для начинащих тренеров и волонтеров, организующих разнообразные тренировки.

## Технические особенности
Веб-приложение работает на базе PHP-фреймфорка Fat-Free Framework, используется дизайн-фреймворк Bootstrap.

Технические требования:
* PHP 5.6
* MySQL 5.5

Лучше всего запускать веб-приложение на базе конфигурации nginx + PHP-FPM.

## Установка
Подключитесь к своему серверу по протоколу SSH и выполните следующие команды:

```bash
git clone https://github.com/Viruviking/trainings.git /var/www/[директория сайта]
cd /var/www/[директория сайта]
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '906a84df04cea2aa72f40b5f787e49f22d4c2f19492ac310e8cba5b96ac8b64115ac402c8cd292b8a03482574915d1a8') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
php composer.phar install
mkdir tmp
chown -R www-data:www-data tmp/
```

## База данных
Подключение к БД MySQL настраивается в файле /config.php, пожалуйста укажите данные для подключения в соответсвии с рекомендациями.

Для развертывания базы данных выполните следующий код SQL:

```mysql
SET NAMES utf8;
SET time_zone = '+00:00';

CREATE DATABASE `sfx_train` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `sfx_train`;

DROP TABLE IF EXISTS `ex_categories`;
CREATE TABLE `ex_categories` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `title` varchar(55) CHARACTER SET utf16 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `ex_exercises`;
CREATE TABLE `ex_exercises` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `category_id` smallint(6) NOT NULL,
  `title` varchar(55) NOT NULL,
  `description` varchar(512) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `plans`;
CREATE TABLE `plans` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_planned` date DEFAULT NULL,
  `date_locked` date DEFAULT NULL,
  `content` varchar(512) DEFAULT NULL,
  `content_intro` varchar(512) DEFAULT NULL,
  `comments` varchar(512) DEFAULT NULL,
  `quicklink` varchar(10) DEFAULT NULL,
  `locked` tinyint(1) DEFAULT 0,
  `locked_title` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
```
Внимание! База данных не содержит материалов (категорий упражнений и данных в них).