'use strict';


var BootstrapModal = (function($, Logger, ScreenHelper) {
    var module = {};

    var settings = {
        moduleName: 'BootstrapModal',
        debug: true
    };

    var scrollbarId = 'bootstrapModalScrollbar';
    var ui = {
        scrollbar: '#' + scrollbarId
    };

    var logger;

    var manager = [];

    function init() {
        $(document).ready(function() {
            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
            }

            // заглушка для скроллбара
            if (!ui.scrollbar.length) {
                var $d = $('<div id="' + scrollbarId + '"></div>');
                $('body').append($d);
                $d.css({
                    position: 'fixed',
                    top: 0,
                    right: 9999,
                    width: 0,
                    backgroundColor: '#8b688f',
                    height: '100%',
                    zIndex: 1350
                });
                ui.scrollbar = $d;
            }
        });
    }

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        init();
    };

    /**
     * Комплексная инициализаиця модального окна.
     * @param {object} модальное окно.
     * @param {object} триггеры (элементы, при клике на которые открывается модальное окно).
     * @param {object|null} фиксированные элементы страницы.
     * @param {object|null} элементы страницы, позиционированные справа.
     */
    module.register = function($modal, $triggers, $fullWidthElements, $positionedElements) {
        $fullWidthElements = $fullWidthElements || [];
        $positionedElements = $positionedElements || [];

        $modal.modal({
            show: false
        });

        $triggers.click(function(evt) {
            evt.preventDefault();
            $modal.modal('show');
        });

        if ($fullWidthElements.length || $positionedElements.length) {  // fix background scrolling
            $modal.on('show.bs.modal', function() {
                logger.log('fix background scrolling on modal open');

                // определение ширины скроллбара
                var bodyWidth = $('body').width();
                var scrollbarWidth = ScreenHelper.getScrollbarWidth();

                logger.log('bodyWidth = ' + bodyWidth + '; scrollbarWidth = ' + scrollbarWidth);

                $('body').css('marginRight', scrollbarWidth);
                ui.scrollbar.css({
                    width: scrollbarWidth,
                    right: 0
                });

                if ($positionedElements.length) {
                    $positionedElements.each(function() {
                        $(this).css('right', parseFloat($(this).css('right'), 10) + scrollbarWidth);
                        console.log($(this).css('right'));
                    });
                }

                if ($fullWidthElements.length) {
                    $fullWidthElements.css('width', bodyWidth);
                }
            });

            $modal.on('hidden.bs.modal', function() {
                logger.log('fix background scrolling on modal close');

                // определение ширины скроллбара
                var scrollbarWidth = ScreenHelper.getScrollbarWidth();

                $('body').css('marginRight', 0);
                ui.scrollbar.css('right', 99999);

                if ($positionedElements.length) {
                    $positionedElements.each(function() {
                        $(this).css('right', parseFloat($(this).css('right'), 10) - scrollbarWidth);
                    });
                }

                if ($fullWidthElements.length) {
                    $fullWidthElements.css('width', '100%');
                }
            });
        }

        manager.push($modal);
        return $modal;
    };

    return module;
}(jQuery, Logger, ScreenHelper));
