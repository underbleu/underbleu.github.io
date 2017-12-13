$(document).ready(function () {
    var itemBox = $(".item-box");

    itemBox.on('mouseenter focusin', function () {
        $(this).find(".item-option").css({ "opacity": "1" });
        $(this).find(".item-price .curr-cost").css({ "z-index": "99", "color": "#fff" });
        $(this).find(".item-sale .curr-cost").css({ "z-index": "99", "color": "#ff3f2b" });
        $(this).find(".origin-cost").css({ "z-index": "99" });
        $(this).find(".item-heading span").css({ "color": "#fff" });
    });
    itemBox.on('mouseleave focusout', function () {
        $(this).find(".item-option").css({ "opacity": "0" });
        $(this).find(".curr-cost").css({ "z-index": "0", "color": "#181818" });
        $(this).find(".origin-cost").css({ "z-index": "0" });
        $(this).find(".item-heading span").css({ "color": "#181818" });
    });


    $('.btn-add-wishlist').on('click', function () {

        if ($(this).hasClass('added-wishlist')) {
            $(this).removeClass('added-wishlist')
                .siblings('span').text('Add to wishlist');
        } else if (!$(this).hasClass('added-wishlist')) {
            $(this).addClass('added-wishlist').siblings('span').text('Added');
        }
    });

});