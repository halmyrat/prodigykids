$(document).ready(function() {
    $('#carousel.det').css('margin-top', $('.navbar').outerHeight());
    $(window).on('resize', function() {
        $('#carousel.det').css('margin-top', $('.navbar').outerHeight());
    });
});

$(window).on('load', function() {

    var navbar = $('.navbar.index');
    var navimg = $('.index .navbar-brand').first();
    var navtext = $('.index .navbar-brand').last();
    var breadCrumb = $('.index .bread-crumb');

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top != 0 &&
            rect.bottom <= (window.innerHeight + rect.height || document.documentElement.clientHeight + rect.height)
        );
    }


    $(window).scroll(function() {
        if (scrollY > 200) {
            if (navbar.hasClass('home')) navbar.removeClass('home').addClass('details');
            if (navtext.hasClass('d-none')) navtext.removeClass('d-none');
            if (!navimg.hasClass('d-none')) navimg.addClass('d-none');
            if (breadCrumb.hasClass('d-none')) breadCrumb.removeClass('d-none');
        } else {
            if (!navbar.hasClass('home')) navbar.removeClass('details').addClass('home');
            if (!navtext.hasClass('d-none')) navtext.addClass('d-none');
            if (navimg.hasClass('d-none')) navimg.removeClass('d-none');
            if (!breadCrumb.hasClass('d-none')) breadCrumb.addClass('d-none');
        }
        $('.section').map(function(i, el) {
            if (isElementInViewport(el)) {
                $('.index .bread-crumb a.active').text($(el).find('h2').text());
            }
        })
    });


    $('.reviews .slick').slick({
        dots: true,
        infinite: true,
        centerMode: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 700,
        adaptiveHeight: true,
        nextArrow: document.getElementById('next'),
        prevArrow: document.getElementById('prev'),
        centerPadding: '10px'
    });
    $('.index .totop, .footer .totop').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });
    $(".index .navbar-nav .nav-item:not(.dropdown) a").click(function(e) {
        e.preventDefault();
        $('.navbar-toggler').click();
        var anchor = $(this).attr('href');
        var offset = $('.navbar').outerHeight();

        $('html, body').animate({
            scrollTop: $(anchor).offset().top - offset
        }, 1000);
    });
    $(".navbar-nav .nav-item>a").hover(function() {
        $('.nav-item').removeClass('active');
        $(this).closest('.nav-item').addClass('active');
        var anchor = $('.first').offset(),
            point = $(this).offset(),
            height = $(this).outerHeight(),
            width = $(this).outerWidth(),
            left = point.left - anchor.left + 10,
            top = point.top - anchor.top + 10;
        $('.focus').css({
            opacity: 1,
            left: left,
            top: top,
            height: height + 3,
            width: width
        })
    }, function() {
        $('.nav-item').removeClass('active');
        $('.focus').css({
            opacity: 0
        })
    });


    $('form#emailsender').submit(function(e) {
        e.preventDefault();
        $('#sendbtn').prop('disabled', true);
        $('#sendbtn').val('Sending...');

        var name = $("#nameofsender").val();
        var email = $("#emailofsender").val();
        var message = $("textarea#messageofsender").val();
        var form_data = new FormData();

        form_data.append('name', name);
        form_data.append('email', email);
        form_data.append('message', message);

        $.ajax({
            url: 'mail/upload.php',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function(php_script_response) {
                $('#myModal .modal-body p:first-child').removeClass('d-none');
                $('#myModal .modal-body p:last-child').addClass('d-none');
                $('#myModal .modal-footer button').removeClass('btn-danger')
                    .addClass('btn-success');
                $('#myModal').modal('show');
                $('#sendbtn').prop('disabled', false);
                $('#sendbtn').val('Send Message');
            },
            error: function(php_script_response) {
                $('#myModal .modal-body p:first-child').addClass('d-none');
                $('#myModal .modal-body p:last-child').removeClass('d-none');
                $('#myModal .modal-footer button').removeClass('btn-success')
                    .addClass('btn-danger');
                $('#myModal').modal('show');
                $('#sendbtn').prop('disabled', false);
                $('#sendbtn').val('Send Message');
            }
        });
    });

    $(document).on('click', '.js-videoPoster', function(e) {

        e.preventDefault();
        var poster = $(this);

        var wrapper = poster.closest('.js-videoWrapper');
        videoPlay(wrapper);
    });


    function videoPlay(wrapper) {
        var iframe = wrapper.find('.js-videoIframe');

        var src = iframe.data('src');

        wrapper.addClass('videoWrapperActive');

        iframe.attr('src', src);
    }



    // $(document).on('click','.js-videoPoster',function(e) {
    //
    //     e.preventDefault();
    //     var poster = $(this);
    //
    //     var wrapper = poster.closest('.js-videoWrapper');
    //     videoPlay(wrapper);
    // });
    //
    //
    // function videoPlay(wrapper) {
    //     var iframe = wrapper.find('.js-videoIframe');
    //
    //     var src = iframe.data('src');
    //
    //     wrapper.addClass('videoWrapperActive');
    //
    //     iframe.attr('src',src);
    // }


});