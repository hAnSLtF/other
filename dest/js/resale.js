(function() {
    $('body').on('click', '.next', function () {
        var that = this;
        $(that).parents('li').next().show();
        $(that).parents('li').hide();
        if ($(that).hasClass('direct')) {
            $(that).parents('li').next().addClass('active');
        } else {
            setTimeout(function () {
                $(that).parents('li').next().addClass('active');
            }, 1);
        }
        $(that).parents('li').find('.dialog').removeClass('active');
    });
    $('body').on('click', '.back', function () {
        var index = $('ul li:visible').index();
        $('ul li').eq(index - 1).show();
        $('ul li:visible').eq(-1).removeClass('active');
        setTimeout(function () {
            $('ul li:visible').eq(-1).hide();
        }, 500);
    });
    $('body').on('click', '.choose', function () {
        $(this).parents('li').find('.dialog').addClass('active');
    });
    $('body').on('click', '.dialog .close', function () {
        $(this).parents('.dialog').removeClass('active');
    });
})();