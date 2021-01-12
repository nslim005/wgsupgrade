/*global jQuery */
(function ($) {
    "use strict";

    jQuery(document).ready(function ($) {
        // Background Image JS
        var bgSelector = $(".bg-img");
        bgSelector.each(function (index, elem) {
            var element = $(elem),
                bgSource = element.data('bg');
            element.css('background-image', 'url(' + bgSource + ')');
        });

        // Header Search Box JS
        $(".btn-search").on('click', function () {
            $(".header-search-box").toggleClass('show');
            $(this).toggleClass('active');

            return false;
        });

        // Responsive Slicknav JS
        $('.main-menu').slicknav({
            appendTo: '.res-mobile-menu',
            closeOnClick: true,
            removeClasses: true,
            closedSymbol: '+',
            openedSymbol: '-'
        });

        // Off Canvas Menu JS
        var canvasWrapper = $(".off-canvas-wrapper");
        $(".btn-canvas-open").on('click', function () {
            canvasWrapper.addClass('active');
            $("body").addClass('fix');
        });
        $(".off-canvas-inner > .btn-close, .off-canvas-overlay").on('click', function () {
            canvasWrapper.removeClass('active');
            $("body").removeClass('fix');
        });

        // Slick Slider JS
        $(".ht-slick-slider").slick({
            infinite: false
        });


        // Latest Project Js
        var menuItem = $(".project-filter-menu li");

        menuItem.on('click', function () {
            menuItem.removeClass('active');
            $(this).addClass('active');

            var filterValue = $(this).attr('data-filter');
            $(".filter-content").isotope({
                filter: filterValue
            });
        });

        // Magnific Image Gallery
        var activeID = $(".btn-popup-img");
        activeID.each(function () {
            $(this).magnificPopup({
                type: 'image',
                closeBtnInside: false
            });
        });

        // Header Sticky JS
        $(".sticky-header").headroom({
            offset: 160
        });

        // Counter to up JS
        $(".counter-no").counterUp({
            delay: 10,
            time: 1000
        });

        // Nice Select
        $("select").niceSelect();

        // Tippy Tooltip JS
        tippy('.ht-tooltip', {
            inertia: true,
            animation: 'shift-away',
            arrow: true
        });

        //Checkout Page Checkbox Accordion
        $("#create_pwd").on("change", function () {
            $(".account-create").slideToggle("100");
        });

        $("#ship_to_different").on("change", function () {
            $(".ship-to-different").slideToggle("100");
        });


        // Product Quantity
        var proQty = $(".pro-qty");
        proQty.append('<a href="#" class="inc qty-btn">+</a>');
        proQty.append('<a href="#" class= "dec qty-btn">-</a>');
        $('.qty-btn').on('click', function (e) {
            e.preventDefault();
            var $button = $(this);
            var oldValue = $button.parent().find('input').val();
            if ($button.hasClass('inc')) {
                var newVal = parseFloat(oldValue) + 1;
            } else {
                // Don't allow decrementing below zero
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                } else {
                    newVal = 0;
                }
            }
            $button.parent().find('input').val(newVal);
        });

        //Price Range Slider JS
        var rangeSlider = $(".price-range"),
            amount = $("#amount"),
            minPrice = rangeSlider.data('min'),
            maxPrice = rangeSlider.data('max');
        rangeSlider.slider({
            range: true,
            min: minPrice,
            max: maxPrice,
            values: [minPrice, maxPrice],
            slide: function (event, ui) {
                amount.val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        amount.val(" $" + rangeSlider.slider("values", 0) +
            " - $" + rangeSlider.slider("values", 1));

        // Contact Map JS
        var map_id = $('#map_content');
        if (map_id.length > 0) {
            var $lat = map_id.data('lat'),
                $lng = map_id.data('lng'),
                $zoom = map_id.data('zoom'),
                $maptitle = map_id.data('maptitle'),
                $mapaddress = map_id.data('mapaddress'),
                mymap = L.map('map_content').setView([$lat, $lng], $zoom);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map',
                maxZoom: 18,
                id: 'mapbox.streets',
                scrollWheelZoom: false,
                accessToken: 'pk.eyJ1Ijoic2hha2lsYWhtbWVlZCIsImEiOiJjamk4anF6NDgwMGd5M3BwM2c4eHU5dmIzIn0.yBLGUAB8kV1I1yGGonxzzg'
            }).addTo(mymap);

            var marker = L.marker([$lat, $lng]).addTo(mymap);
            mymap.scrollWheelZoom.disable();
        }

        // Ajax Contact Form JS
        var form = $('#contact-form');
        var formMessages = $('.form-message');

        $(form).submit(function (e) {
            e.preventDefault();
            var formData = form.serialize();
            $.ajax({
                type: 'POST',
                url: form.attr('action'),
                data: formData
            }).done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('alert alert-danger');
                $(formMessages).addClass('alert alert-success fade show');

                // Set the message text.
                formMessages.html("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
                formMessages.append(response);

                // Clear the form.
                $('#contact-form input,#contact-form textarea').val('');
            }).fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('alert alert-success');
                $(formMessages).addClass('alert alert-danger fade show');

                // Set the message text.
                if (data.responseText !== '') {
                    formMessages.html("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
                    formMessages.append(data.responseText);
                } else {
                    $(formMessages).text('Oops! An error occurred and your message could not be sent.');
                }
            });
        });


    }); //End Ready Function

    jQuery(window).on('scroll', function () {

    }); // End Scroll Function

    jQuery(window).on('load', function () {
        // Project Masonry JS
        $(".filter-content,.masonry-grid").isotope();

        // Hover Aware Direction JS
        $(".hvr-dir-item").directionalHover({
            overlay: 'hvr-dir',
            speed: 300
        });

    }); // End Load Function
}(jQuery));