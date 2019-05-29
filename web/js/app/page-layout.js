'use strict';


var DesignLayout = (function($, Logger, Page, ScreenHelper, BootstrapModal, Utils) {
    var module = {};

    var settings = {
        moduleName: 'DesignLayout',
        debug: true
    };

    var ui = {
        // main blocks
        body: 'body',
        page: '.page',
        mainContent: '.page__content',
        fixedHeader: '.page__header',

        // overlays
        overlayBody: '.page__overlay',

        //panel
        panel: '.page__panel',
        // buttons for panelz
        panelOpen: '#panelOpen',
        panelClose: '#panelClose',

        // modals registration 
        fullWidthElements: '.page__content, .fixed-header',
        positionedElements: '',

        accordions: '.accordion'
    };

    var logger;

    var useCSS3Animation;
    var animationDurationMS = Page.getAnimationSpeed();
    var animationDuration = animationDurationMS / 1000;

    var DOMready = false;
    var windowLoad = false;

    function ieVersion() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        if (msie > 0) {
            return parseInt (ua.substring(msie + 5, ua.indexOf('.', msie)));
        }
        return 0;
    };

    function checkScroll() {
        var scroll;
        if (!(ieVersion && ieVersion)) {
            scroll = $(window).scrollTop();
        } else {
            scroll = document.documentElement.scrollTop;
        }

        if (document.documentElement.clientWidth < ScreenHelper.screenSM - ScreenHelper.getScrollbarWidth()) {
            if (scroll > 100) {
                ui.body.addClass('header-fixed');
            } else {
                ui.body.removeClass('header-fixed');
            }
        } else {
            if (scroll > 50) {
                ui.body.addClass('header-fixed');
            } else {
                ui.body.removeClass('header-fixed');
            }
        }
    }

    // set overlay height
    function setOverlayHeight() {
        if (ui.body.height() > document.documentElement.clientHeight) {
            ui.overlayBody.css({
                display: 'block',
                height: ui.body.height()
            });
        } else {
            ui.overlayBody.css({
                display: 'block',
                height: document.documentElement.clientHeight
            });
        }
    }

    // left menu open
    function openPanel() {
        ui.body.addClass('panel-open');

        setOverlayHeight();

        ui.fixedHeader.css({'z-index': '1150'});

        setPanelTransition(animationDuration);

        if (useCSS3Animation) {
            ui.overlayBody.css({opacity: 1});
            Utils.css3(ui.panel, {'%stransform': 'translate(-300px, 0px)'});
        } else {
            ui.overlayBody.animate({opacity: 1}, {duration: animationDurationMS, queue: false});
            ui.panel.animate({right: '0px'}, {duration: animationDurationMS, queue: false});
        }

    }

    // left menu close
    function closePanel() {
        ui.body.removeClass('panel-open');

        setPanelTransition(animationDuration);

        if (useCSS3Animation) {
            ui.overlayBody.css({opacity: 0});
            window.setTimeout(function() {
                ui.overlayBody.hide();
                ui.fixedHeader.css({'z-index': ''});
            }, animationDurationMS);
            Utils.css3(ui.panel, {'%stransform': 'translate(0px, 0px)'});
        } else {
            ui.overlayBody.animate({
                opacity: 0
            }, {
                duration: animationDurationMS,
                queue: false,
                complete: function() {
                    ui.overlayBody.hide();
                    ui.fixedHeader.css({'z-index': ''});
                }
            });
            ui.panel.animate({right: '-300px'}, {duration: animationDurationMS, queue: false});
        }
    }


    // Проверка панели если требуется
    function checkPanel() {

        if (ui.body.hasClass('panel-open')) {

            setPanelTransition(0);

            if (useCSS3Animation) {
                ui.overlayBody.css({opacity: 0}).hide();
                Utils.css3(ui.panel, {'%stransform': 'translate(0px, 0px)'});
            } else {
                ui.panel.css({right: '0'});
                ui.overlayBody.css('opacity', 0).hide();
            }
            ui.fixedHeader.css({'z-index': ''});

            ui.body.removeClass('panel-open');
        }
    }

    function setPanelTransition(duration) {
        if (useCSS3Animation) {
            Utils.css3(ui.panel, {'%stransition': '%stransform ' + duration + 's'});
            Utils.css3(ui.overlayBody, {'%stransition': 'opacity ' + duration + 's'});
        }
    }

    // Основной пересчёт/перерисовка
    function redraw() {
        logger.log('redraw');

        // Проверка скролла
        checkScroll();
        // Проверка панели если требуется
        checkPanel();
    }

    function init() {
        $(document).ready(function() {
            logger.log('event: DOM ready');
            DOMready = true;

            // prepare jquery ui objects
            for (var pr in ui) {
                ui[pr] = $(ui[pr]);
            }

            if ($('#slider').length) {
                var swiper = new Swiper('#slider', {
                  slidesPerView: 1,
                  centeredSlides: true,
                  loop: true,
                  pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                      return '<span class="' + className + ' bullet-' + (index + 1) + '"><div class="image"></div></span>';
                    },
                  },
                  navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  },
                  autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                  },
                  breakpoints: {
                  }
                });
            }

            var eq, eqprev;

            $('.header__menu > li > a').mouseenter(function (e) {
                e.preventDefault();
                $(this).tab('show');

                $('.header__right').mouseleave(function (e) {
                    $('.menu__content > .content__pane').eq(eq).addClass('fade-off');
                    window.setTimeout(function() {
                        $('.menu__content > .content__pane').removeClass('fade-off');
                        $('.header__menu').children().removeClass('active');
                        $('.menu__content > .content__pane').removeClass('active in');
                    }, Page.getAnimationSpeed());
                });
            });

            $('.panelright__trigger').click(function (e) {
                e.preventDefault();
                $(this).parent().siblings().removeClass('open');
                $(this).parent().toggleClass('open');
            });

            $('.header__menu > li > a').on('shown.bs.tab', function (e) {
                e.preventDefault();
                eqprev = $(e.relatedTarget).parent().index();
                eq = $(e.target).parent().index();
            });

            $('.menu_inner > li > a').mouseenter(function (e) {
                $(this).tab('show');
            });

            $('.menu__open').click(function (e) {
                e.preventDefault();
                var that = $(this);
                $(this).siblings('.panelmenu__inner').toggleClass('open');
                if ($(this).siblings('.panelmenu__inner').hasClass('open')) {
                    $(this).siblings('.panelmenu__inner').show(Page.getAnimationSpeed());
                    $(this).removeClass('rotate0');
                    $(this).addClass('rotate180');
                    window.setTimeout(function() {
                        that.siblings('.panelmenu__inner').find('.menu__open').addClass('on');
                    }, Page.getAnimationSpeed());
                } else {
                    $(this).siblings('.panelmenu__inner').hide(Page.getAnimationSpeed());
                    $(this).removeClass('rotate180');
                    $(this).addClass('rotate0');
                    that.siblings('.panelmenu__inner').find('.menu__open').removeClass('on');
                }
            });

            // Второй вариант скриптов для контроля панелей
            $(document).on('click', function(evt) {

                var $triggerOnPanel = $(evt.target).closest('.page__panel');
                var $triggerOnPanelLink = $(evt.target).closest('.page__panel nav ul > li a');
                var $triggerOpenPanel = $(evt.target).closest('#panelOpen');
                var $triggerClosePanel = $(evt.target).closest('#panelClose');

                if (ui.body.hasClass('panel-open')) {

                    if (!$triggerOnPanelLink) {
                        evt.preventDefault();
                    }

                    if (!$triggerOnPanel.length || $triggerClosePanel.length) {
                        evt.preventDefault();
                        closePanel();
                    }

                } else {

                    if ($triggerOpenPanel.length) {
                        evt.preventDefault();
                        openPanel();
                    }
                }
            });

            ui.accordions.children('.accordion__title').click(function (e) {
                e.preventDefault();
                $(this).parent().toggleClass('accordion--open');
            });

            // init module
            BootstrapModal.init({
                debug: debug
            });

            // modals registration

            // modal template
            BootstrapModal.register($('#modal-template'), $('.modal-template-trigger'),
                                    $(ui.fullWidthElements), $(ui.positionedElements));

            redraw();
        });

        $(window).load(function() {
            logger.log('event: window load');
            windowLoad = true;

            redraw();

            window.setTimeout(function() {
                redraw();
            }, 0);
        });

        $(window).scroll(function() {
            logger.log('event: window scroll');

            // теоретически событие может наступить до того, как будет готова DOM модель,
            // поэтому, чтобы избежать ошибок, используем здесь $(ui.el) вместо ui.el
            if (windowLoad) {
                checkScroll();
            }
        });

        $(window).resize(function() {
            logger.log('event: window resize');

            if (DOMready 
                && ui.body.hasClass('panel-open')) {
                setOverlayHeight();
            }

            if (DOMready) {
                redraw();
            }
        });
    }

    module.init = function(_settings) {
        _settings = _settings || {};

        for (var pr in _settings) {
            settings[pr] = _settings[pr];
        }

        logger = new Logger(settings);

        useCSS3Animation = Utils.supportsCSSProp('transition') 
                           && Utils.supportsCSSProp('transform');

        init();

        logger.log('init');
    };

    return module;
}(jQuery, Logger, Page, ScreenHelper, BootstrapModal, Utils));
