function slickSlides(url) {
    console.log(url)
    if (url.match('youtube')) {
        return (
            '<div class="item">' +
            '<iframe width="100%" src="' + url + '"></iframe>' +
            '</div>'
        )
    } else {
        return (
            '<div class="item">' +
            '<img src="' + url + '" alt="" class="carousel-img img-fluid">' +
            '</div>'
        )
    }
}

function card(data) {
    return (
        '<div class="game_list_outer_container_h">' +
        '<div class="game_list_item_h">' +
        '<div class="game_list_item_wrap_h">' +
        '<div class="game_list_pic">' +
        '<a href="details.html?game=' + data.codeName + '">' +
        '<img src="' + data.appCover + '" alt="">' +
        '<span><i>' + data.age + '</i></span>' +
        '</a>' +
        '</div>' +
        '<div class="game_list_container">' +
        '<div class="game_container_wrapper">' +
        '<div class="game_icon_container">' +
        '<a href="details.html?game=' + data.codeName + '">' +
        '<img src="' + data.appIcon + '" alt="">' +
        '</a>' +
        '</div>' +
        '<div class="game_desc_container">' +
        '<h3><a href="details.html?game=' + data.codeName + '">' + data.appName + '</a></h3>' +
        '<p>' + data.shortDescription + '</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="game_button_container">' +
        '<a href="' + data.linkToGooglePlay + '">' +
        '<img src="assets/images/store_google.svg" alt="">' +
        '</a>' +
        '<a href="' + data.linkToAppStore + '">' +
        '<img src="assets/images/store_apple.svg" alt="">' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    )
}

var first, picked = [];
var randomProperty = function(obj) {
    var keys = Object.keys(obj);
    var pick;
    do {
        pick = keys.length * Math.random() << 0;
    } while (pick == first || picked[0] == pick);
    first = pick;
    picked.push(pick);
    return obj[keys[pick]];
};

var params = location.search.slice(1).split('&');
var query = {};
params.map(function(param) {
    var temp = param.split('=');
    query[temp[0]] = temp[1];
});

var games;
$.get('games.json').done(function(data) {
    games = data;

    $('#banner').attr('src', games[query.game].appBanner);
    $('.app_details_body img.img-fluid').attr('src', games[query.game].appDetailIcon);
    $('#appName').text(games[query.game].appName);
    $('#category').text(games[query.game].category);
    $('#description').html(games[query.game].description);
    $('.store_google').attr('href', games[query.game].linkToGooglePlay);
    $('.store_apple').attr('href', games[query.game].linkToAppStore);

    $('#sc-slider').empty();
    var screenshots = games[query.game].screenshots;
    screenshots.map(function(img) {
        return $('#sc-slider').append(slickSlides(img))
    });

    $('#feat').empty();
    for (var i = 0; i < 3; i++) {
        $('#feat').append(card(randomProperty(games)));
    }

    $(window).on('load', function() {
        $('.sc-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: true,
            centerMode: true,
            variableWidth: true,
            centerPadding: true,
            infinite: true,
            focusOnSelect: true,
            cssEase: 'linear',
            touchMove: true,
            prevArrow: '<button id="slick-prevv" class="slick-prevv"><svg xmlns="http://www.w3.org/2000/svg"\n' +
                '\txmlns:xlink="http://www.w3.org/1999/xlink"\n' +
                '\twidth="39px" height="61px" viewBox="0 0 39 61">\n' +
                '<path fillRule="evenodd" d="M 36.29 47.01C 36.29 47.01 19.69 30.5 19.69 30.5 19.69 30.5 36.29 13.99 36.29 13.99 39.42 10.88 39.44 5.81 36.32 2.68 33.21-0.45 28.14-0.47 25.01 2.65 25.01 2.65 2.7 24.83 2.7 24.83 1.19 26.33 0.34 28.36 0.34 30.5 0.34 32.64 1.19 34.67 2.7 36.17 2.7 36.17 25.01 58.35 25.01 58.35 28.14 61.47 33.21 61.45 36.32 58.32 39.44 55.19 39.42 50.12 36.29 47.01 36.29 47.01 36.29 47.01 36.29 47.01Z" fill="rgb(255,175,3)"/></svg></button>',
            nextArrow: '<button id="slick-prevv" class="slick-nextt"><svg xmlns="http://www.w3.org/2000/svg"\n' +
                '\txmlns:xlink="http://www.w3.org/1999/xlink"\n' +
                '\twidth="39px" height="61px" viewBox="0 0 39 61">\n' +
                '<path fillRule="evenodd" d="M 13.99 58.35C 13.99 58.35 36.3 36.17 36.3 36.17 37.81 34.67 38.66 32.64 38.66 30.5 38.66 28.36 37.81 26.33 36.3 24.83 36.3 24.83 13.99 2.65 13.99 2.65 10.86-0.47 5.79-0.45 2.68 2.68-0.44 5.81-0.42 10.88 2.71 13.99 2.71 13.99 19.31 30.5 19.31 30.5 19.31 30.5 2.71 47.01 2.71 47.01-0.42 50.12-0.44 55.19 2.68 58.32 5.79 61.45 10.86 61.47 13.99 58.35 13.99 58.35 13.99 58.35 13.99 58.35Z" fill="rgb(255,175,3)"/></svg></button>'
        });
    })
});