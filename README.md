Skel_scss_bootstrap3_va01 static project
========================================


Deploy
------

Установка зависимостей (npm packages, bower packages)

    $ npm install

Экспорт проекта в папку *./output*, запуск watch

    $ npm run dev

Запуск сервера для разработки

    $ npm run http-server

    http://127.0.0.1:8081/

Сборка проекта в продакшен

    $ npm run build


Структура проекта
-----------------

* /node_modules - папка, куда устанавливаются пакеты nodejs
    * ...
* /output - папка, куда происходит выгрузка проекта
    * ...
* /web - папка, где ведётся разработка
    * /bower_components - папка, куда устанавливаются пакеты bower
        * /respond - полифил для ie9
        * /jquery
        * /bootstrap-sass - https://github.com/twbs/bootstrap-sass
        * /font-awesome - http://fontawesome.io/
        * /normalize.scss - полезно иметь для проектов без Bootstrap
        * /slick-carousel - карусель http://kenwheeler.github.io/slick/
        * /prism - подсветка кода http://prismjs.com/
    * /css/ - папка со стилями, которые не требуют препроцессинга
        * sys.css - стили для системных страниц (напр. для web/legacy.html)
    * /font - папка со шрифтами
        * /custom-font - кастомный иконочный шрифт 
        * ...
    * /img - папка с изображениями проекта
        * favicon.jpg - фавиконка
        * /layout - стили для основного шаблона
        * /pieces - маленкие картинки встречающиеся по всему проекту
        * /page1 - картинки для страницы page1
        * ...
    * /js - папка со скриптами
        * /app - папка с кастомными скриптами
            * 0page.js - кастомный js-модуль - библиотечка полезных простых функций-утилит
            * page-layout.js - кастомный js-модуль - модуль подключаемый на большинстве шаблонов проекта
            * page-template.js - шаблон кастомного js-модуля с перерисовкой
            * page1.js - кастомный js-модуль
            * ...
        * logger.js - логгирование
        * screen-helper.js - модуль для работы с экраном
        * bootstrap-modal.js - модуль для регистрации и компенсации скролла при открытии модальных окон
        * utils.js - модуль для работы с css
    * /scss - стили, требующие препроцесинга
        * /utils - все переменные и помощники scss
            * _animations.scss - анимации
            * _variables.scss - все глобальные переменные + переменные для сторонних модулей
            * _mixins.scss - все примеси
            * _functions.scss - все функции
            * _placeholders.scss - все помощники 
        * /core - стили для базовых 
            * _base.scss - основные элементы HTML
            * _typography.scss - типографика
            * _grid.scss - сетка
            * _utilities.scss - простые классы-помощники — утилиты
            * _widgets.scss - более сложные составные виджеты-компоненты
        * /components - стили для кастомизации сторонних модулей
            * _bootstrap.scss - кастомизация bootstrap
            * _slick.scss - кастомизация slick
            * _prism.scss - кастомизация prism
            * ...
        * /layout - компоненты основного шаблона — крупные конструктивные части общие для всех страниц!
            * _layout.scss
        * /pages - стили особые для отдельных страниц
            * _sandbox.scss - стили для страниц песочниц
            * _page1.scss - страница
            * ...
        * main.scss - импорт стилевых зависимостей
    * /tmpl - папка с шаблонами
        * /pages - папка с шаблонами для выгрузки
            * legacy.html - системная страница
            * tmpl_page.html - шаблонная страница (не участвует в выгрузке)
            * sandbow_page.html - страница-посочница (не участвует в выгрузке)
            * css_guideline.html - гайд по стилю написания scss
            * page1.html - страница 1
            * ...
        * base.html - базовый шаблон проекта
        * data.json - файл с переменными для шаблонов
    * /video - папка с видео проекта
        /page1 - видео для страницы page1
        * ...
* .bowerrc - файл локальной конфигурации bower
* bower.json - конфигурация bower-пакета
* Gruntfile.js - конфигурация сборщика проекта Grunt
* package.json - конфигурация npm-пакета
* README.md - файл документации по проекту


Концепции использования
-----------------------

* Cтраница может использовать несколько js-модулей одновременно.

* Несколько страниц могут использовать один и тот же модуль.


Nginx config example
--------------------

    server {
        listen *:80;
        server_name project.lo;

        root /path/to/project;

        index index.html;
        autoindex on;

        access_log /var/log/nginx/project.access.log;
        error_log /var/log/nginx/project.error.log;

        set_real_ip_from 127.0.0.1;
        real_ip_header X-Forwarded-For;

        location = /favicon.ico {
            log_not_found off;
            access_log off;
        }

        location ~* ^.+\.(html|css|less|js|txt|xml|ttf|svg|eot|woff|zip|tgz|gz|rar|bz2|doc|xls|exe|pdf|ppt|tar|wav|mp3|ogg|rtf)$ {
            access_log off;
            expires 1y;
        }

        location ~* ^.+\.(jpg|jpeg|gif|png|ico|bmp|swf|flv)$ {
            access_log off;
            expires 1y;
            add_header Cache-Control public;
        }
    }
