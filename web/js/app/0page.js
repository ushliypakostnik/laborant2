'use strict';


var Page = (function($, ScreenHelper) {
    var module = {};

    // Перемотка до елемента
    module.scrollToBlock = function($el, offsetTop) {
        $('body, html').animate({
            scrollTop: $el.offset().top - offsetTop
        }, getAnimationSpeed());
    }

    // Скорость анимации
    function getAnimationSpeed() {
        return 150;
    }
    module.getAnimationSpeed = getAnimationSpeed;

    // Координата элемента по оси X
    module.getElCoordsLeft = function($el) {
        return ScreenHelper.getCoords($el.get(0)).left;
    }

    // Отступ от края экрана до края контейнера
    module.getContainerPosition = function($el) {
        return ScreenHelper.getCoords($el.get(0)).left + parseFloat($el.css('padding-left'), 10);
    }

    // Разное количество блоков в ряду на больших и маленьких мобилах
    module.redrawRowOnMobile = function($el) {
        if (document.documentElement.clientWidth < ScreenHelper.screenSM - ScreenHelper.getScrollbarWidth()
            && document.documentElement.clientWidth >= ScreenHelper.screenXS - ScreenHelper.getScrollbarWidth()) {
            $el.removeClass('col-xs-6');
            $el.addClass('col-xs-4');
        } else {
            $el.removeClass('col-xs-4');
            $el.addClass('col-xs-6');
        }
    }

    return module;
}(jQuery, ScreenHelper));
