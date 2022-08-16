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

var games;

$.get('games.json').done(function(data) {
    games = data;
    $('#app_container').empty();
    for (var i in games) {
        $('#app_container').append(card(games[i]))
    }
});