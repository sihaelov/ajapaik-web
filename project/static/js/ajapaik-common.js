var map,
    disableSave = true,
    streetPanorama,
    infoWindow,
    input,
    searchBox,
    getMap,
    firstResizeDone = false,
    saveLocation,
    saveLocationCallback,
    saveLocationButton,
    saveDirection = false,
    radianAngle,
    degreeAngle,
    azimuthListenerActive = false,
    azimuthLineEndPoint,
    marker,
    popoverShown = false,
    panoramaMarker,
    centerMarker,
    setCursorToPanorama,
    setCursorToAuto,
    bypass = false,
    mapOpts,
    clickedMapButton = false,
    streetViewOptions = {
        panControl: true,
        panControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: window.google.maps.ControlPosition.LEFT_CENTER
        },
        addressControl: false,
        linksControl: true,
        linksControlOptions: {
            position: window.google.maps.ControlPosition.BOTTOM_CENTER
        },
        enableCloseButton: true,
        visible: false
    },
    dottedAzimuthLineSymbol,
    dottedAzimuthLine,
    getQueryParameterByName,
    prepareFullscreen,
    firstDragDone = false,
    scoreboardShown = false,
    showScoreboard,
    hideScoreboard,
    updateLeaderboard,
    now,
    paneNow,
    lastTriggeredPane,
    gameMap,
    isPhotoview,
    gameRedirectURI,
    lastTriggeredWheeling,
    wheelEventFF,
    wheelEventNonFF,
    mapMousemoveListenerFunction,
    mapClickListenerFunction,
    mapIdleListenerFunction,
    mapDragstartListenerFunction,
    mapClickListenerActive = false,
    mapDragstartListenerActive = false,
    mapIdleListenerActive = false,
    mapMousemoveListenerActive = false,
    mapDragendListenerActive = false,
    mapClickListener,
    mapDragstartListener,
    mapGameIdleListener,
    mapMapviewIdleListener,
    mapMapviewClickListener,
    mapBoundsChangedListener,
    mapMousemoveListener,
    mapTypeChangedListener,
    mapDragListener,
    guessLocationStarted = false,
    mapPositionChangedListener,
    streetviewVisibleChangedListener,
    streetviewPanoChangedListener,
    streetviewCloseclickListener,
    mapPanoChangedListener,
    mapDisplayHeatmapWithEstimatedLocation,
    lockButton,
    mapDragendListenerFunction,
    markerLocked = true,
    mapMarkerDragListenerFunction,
    mapMarkerDragendListenerFunction,
    mapMarkerDragListener,
    mapMarkerDragendListener,
    mapMarkerPositionChangedListener,
    windowResizeListenerFunction,
    windowResizeListener,
    realMapElement,
    photoModalCurrentlyOpenPhotoId,
    currentlySelectedRephotoId,
    photoModalFullscreenImageUrl,
    photoModalFullscreenImageSize,
    photoModalRephotoFullscreenImageUrl,
    photoModalRephotoFullscreenImageSize,
    photoModalCurrentPhotoFlipStatus,
    userFlippedPhoto = false,
    photoModalRephotoArray,
    userClosedRephotoTools = false,
    fullscreenEnabled = false,
    heatmap,
    guessResponseReceived = false,
    gameHintUsed = false,
    currentPhotoDescription = false,
    heatmapEstimatedLocationMarker,
    userClosedTutorial = false,
    tutorialPanel,
    tutorialPanelSettings = {
        selector: '#ajapaik-map-container',
        position: 'center',
        controls: {
            buttons: 'closeonly',
            iconfont: 'bootstrap'
        },
        bootstrap: 'default',
        title: window.gettext('Tutorial'),
        draggable: {
            handle: '.jsPanel-hdr',
            containment: '#ajapaik-map-container'
        },
        size: 'auto',
        id: 'ajapaik-tutorial-js-panel'
    },
    comingBackFromGuessLocation = false,
    hideUnlockedAzimuth,
    showUnlockedAzimuth,
    mapviewGameButton,
    getGeolocation,
    myLocationButton,
    closeStreetviewButton,
    albumSelectionDiv,
    handleAlbumChange,
    refreshFacebookCommentsCount,
    originalClosestLink;


(function ($) {
    'use strict';
    albumSelectionDiv = $('#ajapaik-album-selection-menu');
    albumSelectionDiv.justifiedGallery({
        rowHeight: 270,
        margins: 5,
        captions: false,
        waitThumbnailsLoad: false
    });

    getMap = function (startPoint, startingZoom, isGameMap, mapType) {
        var latLng,
            zoomLevel,
            mapTypeIds;

        gameMap = isGameMap;

        if (!startPoint) {
            latLng = new window.google.maps.LatLng(59, 26);
            startingZoom = 8;
        } else {
            latLng = startPoint;
        }

        if (!startingZoom) {
            zoomLevel = 13;
        } else {
            zoomLevel = startingZoom;
        }

        streetPanorama = new window.google.maps.StreetViewPanorama(document.getElementById('ajapaik-map-canvas'), streetViewOptions);

        mapTypeIds = [];
        for (var type in window.google.maps.MapTypeId) {
            if (window.google.maps.MapTypeId.hasOwnProperty(type)) {
                mapTypeIds.push(window.google.maps.MapTypeId[type]);
            }

        }
        mapTypeIds.push('OSM');

        if (isGameMap) {
            mapOpts = {
                zoom: zoomLevel,
                scrollwheel: false,
                center: latLng,
                mapTypeControl: true,
                zoomControl: true,
                panControl: false,
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_CENTER
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: window.google.maps.ControlPosition.LEFT_CENTER
                },
                streetView: streetPanorama,
                mapTypeControlOptions: {
                    mapTypeIds: mapTypeIds,
                    position: window.google.maps.ControlPosition.BOTTOM_CENTER
                }
            };
        } else {
            mapOpts = {
                zoom: zoomLevel,
                scrollwheel: true,
                center: latLng,
                mapTypeControl: true,
                panControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_CENTER
                },
                streetViewControl: true,
                streetViewControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_CENTER
                },
                streetView: streetPanorama,
                mapTypeControlOptions: {
                    mapTypeIds: mapTypeIds,
                    position: window.google.maps.ControlPosition.BOTTOM_CENTER
                }
            };
        }

        var allowedMapTypes = {
            roadmap: window.google.maps.MapTypeId.ROADMAP,
            satellite: window.google.maps.MapTypeId.ROADMAP,
            OSM: 'OSM'
        };
        if (allowedMapTypes[mapType]) {
            mapOpts.mapTypeId = allowedMapTypes[mapType];
        } else {
            mapOpts.mapTypeId = allowedMapTypes.OSM;
        }

        map = new window.google.maps.Map(document.getElementById('ajapaik-map-canvas'), mapOpts);

        map.mapTypes.set('OSM', new window.google.maps.ImageMapType({
            getTileUrl: function (coord, zoom) {
                return 'http://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
            },
            tileSize: new window.google.maps.Size(256, 256),
            name: 'OpenStreetMap',
            maxZoom: 18
        }));

        lockButton = document.createElement('button');
        $(lockButton).addClass('btn').addClass('btn-default').addClass('ajapaik-marker-center-lock-button').prop('title', window.gettext('Toggle map center lock'));

        map.controls[window.google.maps.ControlPosition.LEFT_CENTER].push(lockButton);

        if (isGameMap) {
            input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
            map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
        } else {
            myLocationButton = document.createElement('button');
            $(myLocationButton).addClass('btn btn-default btn-xs').prop('id', 'ajapaik-mapview-my-location-button').prop('title', window.gettext('Go to my location')).html('<i class="glyphicon ajapaik-icon ajapaik-icon-my-location"></i>');
            map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(myLocationButton);
            input = /** @type {HTMLInputElement} */(document.getElementById('pac-input-mapview'));
            map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(input);
            if (window.albumId) {
                mapviewGameButton = document.createElement('button');
                $(mapviewGameButton).addClass('btn btn-success btn-lg ajapaik-mapview-game-button ajapaik-zero-border-radius').prop('title', window.gettext('Geotag pictures')).html(window.gettext('Geotag pictures'));
                map.controls[window.google.maps.ControlPosition.BOTTOM_RIGHT].push(mapviewGameButton);
            }
            closeStreetviewButton = document.createElement('button');
            $(closeStreetviewButton).addClass('btn btn-default').prop('id', 'ajapaik-mapview-close-streetview-button').html(window.gettext('Close'));
            streetPanorama.controls[window.google.maps.ControlPosition.BOTTOM_RIGHT].push(closeStreetviewButton);
        }


        searchBox = new window.google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));

        window.google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length === 0) {
                return;
            }
            map.setCenter(places[0].geometry.location);
        });

        window.google.maps.event.addListener(map, 'bounds_changed', function () {
            var bounds = map.getBounds();
            searchBox.setBounds(bounds);
            if (!firstResizeDone) {
                window.google.maps.event.trigger(map, 'resize');
                firstResizeDone = true;
            }
            if (window.toggleVisiblePaneElements) {
                paneNow = new Date().getTime();
                if (!lastTriggeredPane) {
                    lastTriggeredPane = paneNow - 500;
                    bypass = true;
                }
                if (paneNow - 500 > lastTriggeredPane || bypass) {
                    bypass = false;
                    lastTriggeredPane = paneNow;
                    window.toggleVisiblePaneElements();
                }
            }
        });

        if (isGameMap) {
            $('<div/>').addClass('center-marker').appendTo(map.getDiv()).click(function () {
                var that = $(this);
                if (!that.data('win')) {
                    that.data('win').bindTo('position', map, 'center');
                }
                that.data('win').open(map);
            });
        }

        streetviewVisibleChangedListener = window.google.maps.event.addListener(streetPanorama, 'visible_changed', function () {
            if (streetPanorama.getVisible()) {
                if (isGameMap) {
                    window._gaq.push(['_trackEvent', 'Game', 'Opened Street View']);
                } else {
                    window._gaq.push(['_trackEvent', 'Map', 'Opened Street View']);
                    $('#ajapaik-mapview-photo-panel').hide();
                }
                // Currently we are not displaying the save button when Street View is open
                saveLocationButton.hide();
                $('.ajapaik-close-streetview-button').show();
            } else {
                if (!guessLocationStarted) {
                    $('#ajapaik-mapview-photo-panel').show();
                }
                $('.ajapaik-close-streetview-button').hide();
                saveLocationButton.show();
            }
        });

        streetviewPanoChangedListener = window.google.maps.event.addListener(streetPanorama, 'pano_changed', function () {
            if (isGameMap) {
                window._gaq.push(['_trackEvent', 'Game', 'Street View Movement']);
            } else {
                window._gaq.push(['_trackEvent', 'Map', 'Street View Movement']);
            }
        });

        streetviewCloseclickListener = window.google.maps.event.addListener(streetPanorama, 'closeclick', function () {
            // Closing Street View from the X button must also show the save button again
            saveLocationButton.show();
        });

        mapTypeChangedListener = window.google.maps.event.addListener(map, 'maptypeid_changed', function () {
            if (isGameMap) {
                window._gaq.push(['_trackEvent', 'Game', 'Map type changed']);
            } else {
                window._gaq.push(['_trackEvent', 'Map', 'Map type changed']);
            }
            window.syncMapStateToURL();
        });
    };

    Math.getAzimuthBetweenMouseAndMarker = function (e, marker) {
        var x = e.latLng.lat() - marker.position.lat(),
            y = e.latLng.lng() - marker.position.lng();
        return Math.atan2(y, x);
    };

    Math.getAzimuthBetweenTwoMarkers = function (marker1, marker2) {
        if (marker1 && marker2) {
            var x = marker2.position.lat() - marker1.position.lat(),
                y = marker2.position.lng() - marker1.position.lng();
            return Math.atan2(y, x);
        }
        return false;
    };

    Math.getAzimuthBetweenTwoPoints = function (p1, p2) {
        if (p1 && p2) {
            var x = p2.lat() - p1.lat(),
                y = p2.lng() - p1.lng();
            return Math.degrees(Math.atan2(y, x));
        }
        return false;
    };

    Math.degrees = function (rad) {
        var ret = rad * (180 / Math.PI);
        if (ret < 0) {
            ret += 360;
        }
        return ret;
    };

    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    Math.simpleCalculateMapLineEndPoint = function (azimuth, startPoint, lineLength) {
        azimuth = Math.radians(azimuth);
        var newX = (Math.cos(azimuth) * lineLength) + startPoint.lat(),
            newY = (Math.sin(azimuth) * lineLength) + startPoint.lng();
        return new window.google.maps.LatLng(newX, newY);
    };

    Math.calculateMapLineEndPoint = function (bearing, startPoint, distance) {
        var earthRadius = 6371e3,
            angularDistance = distance / earthRadius,
            bearingRadians = Math.radians(bearing),
            startLatRadians = Math.radians(startPoint.lat()),
            startLonRadians = Math.radians(startPoint.lng()),
            endLatRadians = Math.asin(Math.sin(startLatRadians) * Math.cos(angularDistance) +
                Math.cos(startLatRadians) * Math.sin(angularDistance) * Math.cos(bearingRadians)),
            endLonRadians = startLonRadians + Math.atan2(Math.sin(bearingRadians) * Math.sin(angularDistance) *
                Math.cos(startLatRadians), Math.cos(angularDistance) - Math.sin(startLatRadians) *
                Math.sin(endLatRadians));

        return new window.google.maps.LatLng(Math.degrees(endLatRadians), Math.degrees(endLonRadians));
    };

    dottedAzimuthLineSymbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        strokeOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: 'red',
        scale: 0.75
    };

    dottedAzimuthLine = new window.google.maps.Polyline({
        geodesic: false,
        strokeOpacity: 0,
        icons: [
            {
                icon: dottedAzimuthLineSymbol,
                offset: '0',
                repeat: '7px'
            }
        ],
        visible: false,
        clickable: false
    });


    getQueryParameterByName = function (name) {
        var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    $('.full-box div').on('click', function (e) {
        e.preventDefault();
        if (window.BigScreen.enabled) {
            window.fullscreenEnabled = false;
            window.BigScreen.exit();
            if (window.lastScrollPosition) {
                $(window).scrollTop(window.lastScrollPosition);
            }
        }
    });

    $(document).on('click', '#ajapaik-full-screen-link', function (e) {
        e.preventDefault();
        window.lastScrollPosition = $(window).scrollTop();
        if (window.BigScreen.enabled) {
            window.BigScreen.request($('#ajapaik-fullscreen-image-container')[0]);
            window.fullscreenEnabled = true;
            /*TODO: Correct events*/
            window._gaq.push(['_trackEvent', '', 'Full-screen']);
        }
    });

    $(document).on('click', '#ajapaik-full-screen-link-guess-panel', function (e) {
        e.preventDefault();
        $('#ajapaik-full-screen-link').click();
    });

    $(document).on('click', '#ajapaik-full-screen-link-xs', function (e) {
        e.preventDefault();
        if (window.BigScreen.enabled) {
            window.BigScreen.request($('#ajapaik-fullscreen-image-container')[0]);
            window.fullscreenEnabled = true;
            window._gaq.push(['_trackEvent', '', 'Full-screen']);
        }
    });

    $(document).on('click', '#ajapaik-rephoto-full-screen-link', function (e) {
        e.preventDefault();
        if (window.BigScreen.enabled) {
            window.BigScreen.request($('#ajapaik-rephoto-fullscreen-image-container')[0]);
            window.fullscreenEnabled = true;
            window._gaq.push(['_trackEvent', '', 'Rephoto full-screen']);
        }
    });

    prepareFullscreen = function (width, height, customSelector) {
        if (!customSelector) {
            customSelector = '#ajapaik-full-screen-image';
        }
        var that = $(customSelector),
            aspectRatio = width / height,
            newWidth = parseInt(screen.height * aspectRatio, 10),
            newHeight = parseInt(screen.width / aspectRatio, 10);
        if (newWidth > screen.width) {
            newWidth = screen.width;
        } else {
            newHeight = screen.height;
        }
        that.css('margin-left', (screen.width - newWidth) / 2 + 'px');
        that.css('margin-top', (screen.height - newHeight) / 2 + 'px');
        that.css('width', newWidth);
        that.css('height', newHeight);
        that.css('opacity', 1);
    };

    getGeolocation = function getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(callback, window.geolocationError);
        }
    };

    showScoreboard = function () {
        $('.ajapaik-navbar').find('.score_container').slideDown();
        scoreboardShown = true;
    };

    hideScoreboard = function () {
        $('.ajapaik-navbar').find('.score_container').slideUp();
        scoreboardShown = false;
    };

    updateLeaderboard = function () {
        var target = $('.score_container');
        if (window.albumId) {
            target.find('.scoreboard').load(window.leaderboardUpdateURL + 'album/' + window.albumId);
        } else {
            target.find('.scoreboard').load(window.leaderboardUpdateURL);
        }
    };

    saveLocationCallback = function (resp) {
        var message = resp.feedback_message,
            hideFeedback = false,
            heatmapPoints,
            currentScore = 0,
            tagsWithAzimuth = 0,
            newEstimatedLocation,
            confidence = 0;
        if (resp.is_correct) {
            hideFeedback = false;
            if (gameMap) {
                window._gaq.push(['_trackEvent', 'Game', 'Correct coordinates']);
            } else {
                window._gaq.push(['_trackEvent', 'Map', 'Correct coordinates']);
            }
        } else if (resp.location_is_unclear) {
            if (gameMap) {
                window._gaq.push(['_trackEvent', 'Game', 'Coordinates uncertain']);
            } else {
                window._gaq.push(['_trackEvent', 'Map', 'Coordinates uncertain']);
            }
        } else if (!resp.is_correct) {
            hideFeedback = true;
            if (gameMap) {
                window._gaq.push(['_trackEvent', 'Game', 'Wrong coordinates']);
            } else {
                window._gaq.push(['_trackEvent', 'Map', 'Wrong coordinates']);
            }
        }
        if (resp.heatmap_points) {
            heatmapPoints = resp.heatmap_points;
        }
        if (resp.azimuth_tags) {
            tagsWithAzimuth = resp.azimuth_tags;
        }
        if (resp.current_score) {
            currentScore = resp.current_score;
        }
        if (resp.estimated_location) {
            newEstimatedLocation = resp.estimated_location;
        }
        if (resp.confidence) {
            confidence = resp.confidence;
        }
        window.handleGuessResponse({feedbackMessage: message, hideFeedback: hideFeedback,
            heatmapPoints: heatmapPoints, currentScore: currentScore, tagsWithAzimuth: tagsWithAzimuth,
            newEstimatedLocation: newEstimatedLocation, confidence: confidence});
    };

    saveLocation = function (marker, photoId, photoFlipStatus, hintUsed, userFlippedPhoto, degreeAngle, azimuthLineEndPoint, origin) {
        var mapTypeId = map.getMapTypeId(),
            lat = marker.getPosition().lat(),
            lon = marker.getPosition().lng();
        if (mapTypeId === 'roadmap') {
            mapTypeId = 0;
        } else if (mapTypeId === 'hybrid') {
            mapTypeId = 1;
        } else {
            mapTypeId = 2;
        }
        var data = {
                photo: photoId,
                hint_used: hintUsed,
                zoom_level: map.zoom,
                map_type: mapTypeId,
                type: 0,
                origin: origin,
                csrfmiddlewaretoken: window.docCookies.getItem('csrftoken')
            };
        if (lat && lon) {
            data.lat = lat;
            data.lon = lon;
        }
        if (degreeAngle && saveDirection) {
            data.azimuth = degreeAngle;
            data.azimuth_line_end_lat = azimuthLineEndPoint[0];
            data.azimuth_line_end_lon = azimuthLineEndPoint[1];
        } else {
            dottedAzimuthLine.setVisible(false);
        }
        if (userFlippedPhoto) {
            data.flip = photoFlipStatus;
        }
        $.ajax({
            url: window.saveLocationURL,
            data: data,
            method: 'POST',
            success: function (resp) {
                saveLocationCallback(resp);
            }
        });
    };
    //$(document).on('click', '#ajapaik-header-game-button', function (e) {
    //    e.preventDefault();
    //    if (window.isPhotoview && window.albumId && window.photoId) {
    //        window.location.href = '/game?album=' + window.albumId + '&photo=' + window.photoId;
    //    } else {
    //        if (!window.isGame && window.albumId) {
    //            window.location.href = '/game?album=' + window.albumId;
    //        }
    //    }
    //});
    $(document).on('click', '#ajapaik-mobile-game-label', function () {
        if (window.isPhotoview && window.albumId && window.photoId) {
            window.location.href = '/geotag?album=' + window.albumId + '&photo=' + window.photoId;
        } else {
            if (!window.isGame && window.albumId) {
                window.location.href = '/geotag?album=' + window.albumId;
            }
        }
    });
    $(document).on('click', '#ajapaik-mobile-grid-label', function () {
        if (!window.isFrontpage && window.albumId) {
            if (window.getQueryParameterByName('limitToAlbum') == 0 && window.lastMarkerSet) {
                window.location.href = '/photos?set=' + window.lastMarkerSet;
            } else {
                window.location.href = '/photos/' + window.albumId + '/1';
            }
        }
    });
    $(document).on('click', '#ajapaik-header-grid-button', function (e) {
        e.preventDefault();
        if (!window.isFrontpage) {
            if (window.isSelection) {
                window.history.go(-1);
            } else {
                var filterOff = window.getQueryParameterByName('limitToAlbum') == 0;
                // TODO: The photo set needs to be POSTed to be of any size
                if ((!window.albumId || filterOff) && window.lastMarkerSet && window.lastMarkerSet.length < 51) {
                    window.location.href = '/?photos=' + window.lastMarkerSet;
                } else if (window.albumId) {
                    window.location.href = '/?album=' + window.albumId;
                } else {
                    window.location.href = '/';
                }
            }
        }
    });
    var handleGeolocation = function (position) {
        $('#ajapaik-geolocation-error').hide();
        window.location.href = '/map?lat=' + position.coords.latitude + '&lng=' + position.coords.longitude + '&limitToAlbum=0&zoom=15';
    };
    window.geolocationError = function (error) {
        var targetElement = $('#ajapaik-geolocation-error-message');
        switch (error.code) {
            case error.PERMISSION_DENIED:
                targetElement.html(window.gettext('User denied the request for Geolocation.'));
                if (window.clickedMapButton) {
                    window.location.href = '/map/photo/' + window.lastGeotaggedPhotoId;
                }
                break;
            case error.POSITION_UNAVAILABLE:
                targetElement.html(window.gettext('Location information is unavailable.'));
                break;
            case error.TIMEOUT:
                targetElement.html(window.gettext('The request to get user location timed out.'));
                break;
            case error.UNKNOWN_ERROR:
                targetElement.html(window.gettext('An unknown error occurred.'));
                break;
        }
        $('#ajapaik-geolocation-error').show();
        window.setTimeout(function () {
            $('#ajapaik-geolocation-error').hide();
        }, 3000);
    };
    $(document).on('click', '#ajapaik-header-map-button', function (e) {
        e.preventDefault();
        if (window.isSelection) {
            window.history.go(-1);
        } else {
            if (window.albumId) {
                window.location.href = '/map?album=' + window.albumId;
            } else if (window.photoId) {
                window.location.href = '/map/photo/' + window.photoId;
            } else {
                window.clickedMapButton = true;
                if (window.navigator.geolocation) {
                    window.getGeolocation(handleGeolocation);
                }
            }
        }
    });
    $(document).on('click', '#ajapaik-mobile-map-label', function () {
        if (window.albumId) {
            window.location.href = '/map?album=' + window.albumId;
        } else {
            if (window.navigator.geolocation) {
                window.getGeolocation(handleGeolocation);
            }
        }
    });
    $(document).on('click', '#ajapaik-header-profile-button', function (e) {
        e.preventDefault();
        window.updateLeaderboard();
        if (scoreboardShown) {
            hideScoreboard();
        } else {
            showScoreboard();
        }
    });
    $(document).on('click', '#ajapaik-header-profile-button-hidden-xs', function (e) {
        e.preventDefault();
        window.updateLeaderboard();
        $('#ajapaik-header-profile-button').click();
    });
    // Firefox and Opera cannot handle modal taking over focus
    //$.fn.modal.Constructor.prototype.enforceFocus = function () {
    //    $.noop();
    //};
    // Our own custom zooming functions to fix the otherwise laggy zooming for mobile
    wheelEventFF = function (e) {
        now = new Date().getTime();
        if (!lastTriggeredWheeling) {
            lastTriggeredWheeling = now - 250;
        }
        if (now - 250 > lastTriggeredWheeling) {
            lastTriggeredWheeling = now;
            if (e.detail < 0) {
                map.setZoom(map.zoom + 1);
            } else {
                if (map.zoom > 14) {
                    map.setZoom(map.zoom - 1);
                }
            }
        }
    };
    wheelEventNonFF = function (e) {
        now = new Date().getTime();
        if (!lastTriggeredWheeling) {
            lastTriggeredWheeling = now - 100;
        }
        if (now - 100 > lastTriggeredWheeling) {
            lastTriggeredWheeling = now;
            if (e.wheelDelta > 0) {
                map.setZoom(map.zoom + 1);
            } else {
                if (map.zoom > 14) {
                    map.setZoom(map.zoom - 1);
                }
            }
        }
    };
    //refreshFacebookCommentsCount = function (ids) {
    //    var queryString = '',
    //        first = true;
    //    for (var i = 0, l = ids.length; i < l; i += 1) {
    //        if (first) {
    //            queryString += window.location.protocol + '//' + window.location.host + '/foto/' + ids[i] + '/';
    //            first = false;
    //        } else {
    //            queryString += ',' + window.location.protocol + '//' + window.location.host + '/foto/' + ids[i] + '/';
    //        }
    //    }
    //    $.get('http://graph.facebook.com/?ids=' + queryString, function(response) {
    //        window.handleCommentsCountResponse(response);
    //    });
    //};
    windowResizeListenerFunction = function () {
        if (markerLocked && !fullscreenEnabled && !guessResponseReceived) {
            mapMousemoveListener = window.google.maps.event.addListener(map, 'mousemove', mapMousemoveListenerFunction);
            mapMousemoveListenerActive = true;
            dottedAzimuthLine.setVisible(false);
            if (panoramaMarker) {
                panoramaMarker.setVisible(false);
            }
        }
    };
    mapMousemoveListenerFunction = function (e) {
        // The mouse is moving, therefore we haven't locked on a direction
        saveDirection = false;
        if (!disableSave) {
            saveLocationButton.removeAttr('disabled');
            saveLocationButton.removeClass('btn-default');
            saveLocationButton.addClass('btn-warning');
            saveLocationButton.text(window.gettext('Save location only'));
        }
        if (e && marker.position) {
            radianAngle = Math.getAzimuthBetweenMouseAndMarker(e, marker);
            degreeAngle = Math.degrees(radianAngle);
        }
        if (panoramaMarker) {
            panoramaMarker.setMap(null);
        }
        if (firstDragDone) {
            setCursorToPanorama();
        }
        if (marker.position) {
            if (!window.isMobile && firstDragDone) {
                dottedAzimuthLine.setPath([marker.position, Math.simpleCalculateMapLineEndPoint(degreeAngle, marker.position, 0.01)]);
                dottedAzimuthLine.setMap(map);
                dottedAzimuthLine.icons = [
                    {icon: dottedAzimuthLineSymbol, offset: '0', repeat: '7px'}
                ];
                dottedAzimuthLine.setVisible(true);
            } else {
                dottedAzimuthLine.setVisible(false);
            }
        }
    };
    mapClickListenerFunction = function (e) {
        if (infoWindow !== undefined) {
            centerMarker.show();
            infoWindow.close();
            infoWindow = undefined;
        }
        if (!firstDragDone && !guessResponseReceived) {
            window.alert(window.gettext('Drag the map so that the marker is where the photographer was standing. You can then set the direction of the view.'));
            return;
        }
        if (!window.guessResponseReceived) {
            radianAngle = Math.getAzimuthBetweenMouseAndMarker(e, marker);
            azimuthLineEndPoint = [e.latLng.lat(), e.latLng.lng()];
            degreeAngle = Math.degrees(radianAngle);
            if (window.isMobile) {
                dottedAzimuthLine.setPath([marker.position, Math.simpleCalculateMapLineEndPoint(degreeAngle, marker.position, 0.01)]);
                dottedAzimuthLine.setMap(map);
                dottedAzimuthLine.icons = [
                    {icon: dottedAzimuthLineSymbol, offset: '0', repeat: '7px'}
                ];
                dottedAzimuthLine.setVisible(true);
            }
            if (azimuthListenerActive) {
                mapMousemoveListenerActive = false;
                window.google.maps.event.clearListeners(map, 'mousemove');
                saveDirection = true;
                if (!disableSave) {
                    saveLocationButton.removeAttr('disabled');
                    saveLocationButton.removeClass('btn-default');
                    saveLocationButton.removeClass('btn-warning');
                    saveLocationButton.addClass('btn-success');
                    saveLocationButton.text(window.gettext('Save location and direction'));
                }
                dottedAzimuthLine.icons[0].repeat = '2px';
                if (marker.position && e.latLng) {
                    dottedAzimuthLine.setPath([marker.position, e.latLng]);
                    dottedAzimuthLine.setVisible(true);
                }
                if (panoramaMarker) {
                    panoramaMarker.setMap(null);
                }
                var markerImage = {
                    url: '/static/images/material-design-icons/ajapaik_custom_size_panorama.png',
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(18, 18),
                    scaledSize: new window.google.maps.Size(36, 36)
                };
                panoramaMarker = new window.google.maps.Marker({
                    map: map,
                    draggable: false,
                    position: e.latLng,
                    icon: markerImage
                });
                setCursorToAuto();
            } else {
                if (!mapMousemoveListenerActive) {
                    mapMousemoveListener = window.google.maps.event.addListener(map, 'mousemove', mapMousemoveListenerFunction);
                    mapMousemoveListenerActive = true;
                    window.google.maps.event.trigger(map, 'mousemove', e);
                }
            }
            azimuthListenerActive = !azimuthListenerActive;
        }
    };

    mapIdleListenerFunction = function () {
        if (firstDragDone) {
            if (markerLocked) {
                azimuthListenerActive = true;
                marker.setPosition(map.getCenter());
            }
            if (!mapMousemoveListenerActive && !saveDirection) {
                mapMousemoveListener = window.google.maps.event.addListener(map, 'mousemove', mapMousemoveListenerFunction);
                mapMousemoveListenerActive = true;
            }
        }
    };

    mapDragstartListenerFunction = function () {
        if (markerLocked) {
            centerMarker = $('.center-marker');
            saveDirection = false;
            if (panoramaMarker) {
                panoramaMarker.setMap(null);
            }
            setCursorToPanorama();
            dottedAzimuthLine.setVisible(false);
            if (infoWindow !== undefined) {
                centerMarker.show();
                infoWindow.close();
                infoWindow = undefined;
            }
            if (!disableSave) {
                saveLocationButton.removeAttr('disabled');
                saveLocationButton.removeClass('btn-default');
                saveLocationButton.addClass('btn-warning');
                saveLocationButton.text(window.gettext('Save location only'));
            }
            azimuthListenerActive = false;
            dottedAzimuthLine.setVisible(false);
            mapMousemoveListenerActive = false;
            window.google.maps.event.clearListeners(map, 'mousemove');
        }
    };

    mapDragendListenerFunction = function () {
        if (markerLocked) {
            marker.setPosition(map.getCenter());
        }
        firstDragDone = true;
        if (disableSave) {
            disableSave = false;
            saveLocationButton.removeAttr('disabled');
            saveLocationButton.removeClass('btn-default');
            saveLocationButton.addClass('btn-warning');
            saveLocationButton.text(window.gettext('Save location only'));
        }
    };

    mapMarkerDragListenerFunction = function () {
        radianAngle = Math.getAzimuthBetweenTwoMarkers(marker, panoramaMarker);
        degreeAngle = Math.degrees(radianAngle);
        if (saveDirection) {
            dottedAzimuthLine.setPath([marker.position, Math.simpleCalculateMapLineEndPoint(degreeAngle, panoramaMarker.position, 0.01)]);
            dottedAzimuthLine.icons = [
                {icon: dottedAzimuthLineSymbol, offset: '0', repeat: '7px'}
            ];
        } else {
            dottedAzimuthLine.setVisible(false);
        }
    };

    mapMarkerDragendListenerFunction = function () {
        if (saveDirection) {
            dottedAzimuthLine.setPath([marker.position, panoramaMarker.position]);
            dottedAzimuthLine.icons[0].repeat = '2px';
        } else {
            dottedAzimuthLine.setVisible(false);
        }
    };

    setCursorToPanorama = function () {
        map.setOptions({draggableCursor: 'url(/static/images/material-design-icons/ajapaik_custom_size_panorama.svg) 18 18, auto', draggingCursor: 'auto'});
    };

    setCursorToAuto = function () {
        map.setOptions({draggableCursor: 'auto', draggingCursor: 'auto'});
    };

    mapDisplayHeatmapWithEstimatedLocation = function (heatmapData) {
        var latLngBounds = new window.google.maps.LatLngBounds(),
            newLatLng,
            heatmapPoints = [],
            i;
        if (heatmapEstimatedLocationMarker) {
            heatmapEstimatedLocationMarker.setMap(null);
        }
        heatmapEstimatedLocationMarker = undefined;
        for (i = 0; i < heatmapData.heatmapPoints.length; i += 1) {
            newLatLng = new window.google.maps.LatLng(heatmapData.heatmapPoints[i][0], heatmapData.heatmapPoints[i][1]);
            heatmapPoints.push(newLatLng);
            latLngBounds.extend(newLatLng);
        }
        window.mapInfoPanelGeotagCountElement.html(heatmapData.heatmapPoints.length);
        window.mapInfoPanelAzimuthCountElement.html(heatmapData.tagsWithAzimuth);
        if (heatmapData.newEstimatedLocation && heatmapData.newEstimatedLocation[0] && heatmapData.newEstimatedLocation[1]) {
            heatmapEstimatedLocationMarker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(heatmapData.newEstimatedLocation[0], heatmapData.newEstimatedLocation[1]),
                map: window.map,
                title: window.gettext("Median guess"),
                draggable: false,
                icon: '/static/images/ajapaik_marker_35px_transparent.png'
            });
        }
        if (heatmapEstimatedLocationMarker) {
            window.map.setCenter(heatmapEstimatedLocationMarker.getPosition());
        } else {
            window.map.fitBounds(latLngBounds);
        }
        marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
        heatmapPoints = new window.google.maps.MVCArray(heatmapPoints);
        if (heatmap) {
            heatmap.setMap(null);
        }
        heatmap = new window.google.maps.visualization.HeatmapLayer({
            data: heatmapPoints
        });
        heatmap.setMap(window.map);
        heatmap.setOptions({radius: 50, dissipating: false});
    };

    $(document).on('click', '.ajapaik-marker-center-lock-button', function () {
        if (firstDragDone) {
            var t = $(this);
            window.centerMarker = $('.center-marker');
            if (t.hasClass('active')) {
                t.removeClass('active');
                window.centerMarker.show();
                window.marker.setVisible(false);
                window.marker.set('draggable', false);
                window.map.set('scrollwheel', false);
                window.realMapElement.addEventListener('mousewheel', window.wheelEventNonFF, true);
                window.realMapElement.addEventListener('DOMMouseScroll', window.wheelEventFF, true);
                window.google.maps.event.removeListener(mapMarkerDragListener);
                window.google.maps.event.removeListener(mapMarkerDragendListener);
                window.azimuthListenerActive = false;
                window.map.setCenter(window.marker.position);
                window.setCursorToPanorama();
                window.markerLocked = true;
            } else {
                t.addClass('active');
                window.centerMarker.hide();
                window.marker.setVisible(true);
                window.marker.setMap(map);
                window.marker.set('draggable', true);
                window.map.set('scrollwheel', true);
                window.realMapElement.removeEventListener('mousewheel', window.wheelEventNonFF, true);
                window.realMapElement.removeEventListener('DOMMouseScroll', window.wheelEventFF, true);
                mapMarkerDragListener = window.google.maps.event.addListener(window.marker, 'drag', window.mapMarkerDragListenerFunction);
                mapMarkerDragendListener = window.google.maps.event.addListener(window.marker, 'dragend', window.mapMarkerDragendListenerFunction);
                window.setCursorToAuto();
                window.markerLocked = false;
            }
        }
    });
    $(document).on('click', '.ajapaik-minimap-confirm-geotag-button', function () {
        var $this = $(this);
        if (!$this.hasClass('ajapaik-minimap-confirm-geotag-button-done')) {
            var photoId = $(this).data('id');
            $.post(window.confirmLocationURL, {
                photo: photoId,
                csrfmiddlewaretoken: window.docCookies.getItem('csrftoken')
            }, function (response) {
                $this.addClass('ajapaik-minimap-confirm-geotag-button-done');
                var statDiv = $('.ajapaik-minimap-geotagging-user-number');
                statDiv.empty().text(response.new_geotag_count);
                if (response.new_geotag_count > 1) {
                    statDiv.append('<div class="ajapaik-minimap-geotagging-user-multiple-people"></div>');
                } else {
                    statDiv.append('<div class="ajapaik-minimap-geotagging-user-single-person"></div>');
                }
            });
            if (window.isGame) {
                $('.ajapaik-game-next-photo-button')[0].click();
            }
            if (window.isFrontpage) {
                window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal confirm location click']);
            } else if (window.isMapview) {
                window._gaq.push(['_trackEvent', 'Map', 'Photo modal confirm location click']);
            } else if (window.isGame) {
                window._gaq.push(['_trackEvent', 'Game', 'Photo modal confirm location click']);
            }
        }
    });
    $(document).on('click', '.ajapaik-minimap-start-guess-CTA-button', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal CTA specify location click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Photo modal CTA specify location click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'Photo modal CTA specify location click']);
        }
        if (window.isGame) {
            $('.ajapaik-game-specify-location-button')[0].click();
        } else {
            window.startGuessLocation($(this).data('id'));
        }
    });
    window.showPhotoMapIfApplicable = function () {
        var arrowIcon = {
            path: 'M12 2l-7.5 18.29.71.71 6.79-3 6.79 3 .71-.71z',
            strokeColor: 'white',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: 'black',
            fillOpacity: 1,
            rotation: 0,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 12)
        },
        locationIcon = {
            path: 'M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            strokeColor: 'white',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: 'black',
            fillOpacity: 1,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 0)
        },
        currentIcon;
        var container = $('#ajapaik-modal-photo-container'),
            mapContainer = $('#ajapaik-photo-modal-map-container');
        if (!window.isMobile && mapContainer.length > 0 && (!photoModalRephotoArray
            || photoModalRephotoArray.length === 0 || window.userClosedRephotoTools)) {
            mapContainer.show().css('height', container.height());
            if (!window.photoModalPhotoLat && !window.photoModalPhotoLng) {
                $('#ajapaik-minimap-disabled-overlay').show();
            } else {
                $('#ajapaik-minimap-disabled-overlay').hide();
            }
            var center,
                minimapLargeCTAButton;
            if (!window.photoModalPhotoLat && !window.photoModalPhotoLng) {
                center = {
                    lat: 59.4372,
                    lng: 24.7453
                };
                minimapLargeCTAButton = document.createElement('button');
                $(minimapLargeCTAButton).addClass('ajapaik-minimap-start-guess-CTA-button');
            } else {
                center = {
                    lat: window.photoModalPhotoLat,
                    lng: window.photoModalPhotoLng
                };
                minimapLargeCTAButton = null;
                $('.ajapaik-minimap-start-guess-CTA-button').remove();
            }
            window.miniMap = new window.google.maps.Map(document.getElementById('ajapaik-photo-modal-map-canvas'), {
                center: center,
                zoom: 17,
                mapTypeControl: false,
                mapTypeId: 'OSM'
            });
            var minimapConfirmGeotagButton = document.createElement('button');
            $(minimapConfirmGeotagButton).addClass('btn').addClass('btn-default')
                .addClass('ajapaik-minimap-confirm-geotag-button')
                .prop('title', window.gettext('Confirm correct location'))
                .data('id', window.photoModalCurrentlyOpenPhotoId);
            if (window.photoModalUserHasConfirmedThisLocation) {
                $(minimapConfirmGeotagButton).addClass('ajapaik-minimap-confirm-geotag-button-done');
            }
            window.miniMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(minimapConfirmGeotagButton);
            var minimapStartGuessButton = document.createElement('button');
            $(minimapStartGuessButton).addClass('btn').addClass('btn-default')
                .addClass('ajapaik-minimap-start-guess-button')
                .prop('title', window.gettext('Submit your own location'));
            window.miniMap.controls[window.google.maps.ControlPosition.BOTTOM_RIGHT].push(minimapStartGuessButton);
            var minimapGeotaggingUserNumber = document.createElement('div');
            $(minimapGeotaggingUserNumber).addClass('ajapaik-minimap-geotagging-user-number')
                .prop('title', window.gettext('Geotagged by this many users')).text(window.photoModalGeotaggingUserCount);
            var minimapGeotaggingUserIcon = document.createElement('div');
            minimapGeotaggingUserNumber.appendChild(minimapGeotaggingUserIcon);
            if (window.photoModalGeotaggingUserCount < 2) {
                $(minimapGeotaggingUserIcon).addClass('ajapaik-minimap-geotagging-user-single-person');
            } else {
                $(minimapGeotaggingUserIcon).addClass('ajapaik-minimap-geotagging-user-multiple-people');
            }
            window.miniMap.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(minimapGeotaggingUserNumber);
            if (minimapLargeCTAButton) {
                $('.ajapaik-minimap-start-guess-CTA-button').remove();
                var mapCanvas = $('#ajapaik-photo-modal-map-canvas');
                $(minimapLargeCTAButton).css('margin-left', ((mapCanvas.width() / 2) - 35) + 'px')
                    .css('margin-top', ((mapCanvas.height() / 2) - 35) + 'px').attr('data-id', window.photoModalCurrentlyOpenPhotoId);
                mapContainer.append(minimapLargeCTAButton);
            }
            window.miniMap.mapTypes.set('OSM', new window.google.maps.ImageMapType({
                getTileUrl: function (coord, zoom) {
                    return 'http://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
                },
                tileSize: new window.google.maps.Size(256, 256),
                name: 'OpenStreetMap',
                maxZoom: 18
            }));
            if (window.photoModalPhotoAzimuth) {
                var start = new window.google.maps.LatLng(center.lat, center.lng);
                var geodesicEndPoint = Math.calculateMapLineEndPoint(window.photoModalPhotoAzimuth, start, 1000);
                var angle = Math.getAzimuthBetweenTwoPoints(start, geodesicEndPoint);
                var angleFix = window.photoModalPhotoAzimuth - angle;
                arrowIcon.rotation = window.photoModalPhotoAzimuth + angleFix;
                currentIcon = arrowIcon;
                window.minimapDottedAzimuthLine = new window.google.maps.Polyline({
                    geodesic: false,
                    strokeOpacity: 0,
                    icons: [
                        {
                            icon: dottedAzimuthLineSymbol,
                            offset: '0',
                            repeat: '7px'
                        }
                    ],
                    visible: true,
                    clickable: false,
                    map: miniMap
                });
                window.minimapDottedAzimuthLine.setPath([start, Math.simpleCalculateMapLineEndPoint(window.photoModalPhotoAzimuth, start, 0.01)]);
            } else {
                if (window.minimapDottedAzimuthLine) {
                    window.minimapDottedAzimuthLine.setVisible(false);
                }
                currentIcon = locationIcon;
            }
            if (window.photoModalPhotoLat && window.photoModalPhotoLng) {
                window.miniMapMarker = new window.google.maps.Marker({
                    position: center,
                    map: window.miniMap,
                    title: window.gettext('Current location'),
                    icon: currentIcon
                });
            }
            $('#ajapaik-modal-photo-container-container').removeClass('col-xs-12').addClass('col-xs-9');
        }
    };
    $(document).on('click', '.ajapaik-minimap-start-guess-button', function () {
        $('#ajapaik-photo-modal-specify-location').click();
    });
    $(document).on('click', '.ajapaik-show-tutorial-button', function () {
        if (!gameHintUsed && !popoverShown && currentPhotoDescription && !window.isMobile) {
            $('[data-toggle="popover"]').popover('show');
            popoverShown = true;
        } else if (!gameHintUsed && popoverShown && currentPhotoDescription) {
            $('[data-toggle="popover"]').popover('hide');
            popoverShown = false;
        }
        if (!tutorialPanel) {
            window.openTutorialPanel();
        } else {
            tutorialPanel.close();
            tutorialPanel = undefined;
        }
    });
    $(document).on('click', '.ajapaik-album-selection-item', function (e) {
        e.preventDefault();
        var $this = $(this);
        //window.previousAlbumId = window.albumId;
        window.albumId = $this.data('id');
        //window.albumName = $this.data('name');
        //window.currentAlbumPhotoCount = $this.data('photos');
        //$('#ajapaik-album-selection-navmenu').offcanvas('toggle');
        window.handleAlbumChange();
    });
    $(document).on('click', '#ajapaik-photo-modal-discuss', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal discuss click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Photo modal discuss click']);
        }
        var commentsSection = $('#ajapaik-comments-section');
        if (commentsSection.hasClass('hidden')) {
            commentsSection.removeClass('hidden');
            window.FB.XFBML.parse($('#ajapaik-rephoto-comments').get(0));
            window.FB.XFBML.parse($('#ajapaik-original-photo-comments').get(0));
        } else {
            commentsSection.addClass('hidden');
        }
    });
    $(document).on('click', '#ajapaik-feedback-link', function () {
        window._gaq.push(['_trackEvent', 'General', 'Feedback link click']);
    });
    $(document).on('click', '.ajapaik-photo-modal-rephoto-thumb', function () {
        var targetId = $(this).data('id'),
            infoDiv = $('#ajapaik-photo-modal-rephoto-info-column'),
            photoDiv = $('#ajapaik-modal-rephoto-container'),
            fullscreenDiv = $('#ajapaik-rephoto-full-screen-image');
        if (!targetId) {
            targetId = window.currentlySelectedRephotoId;
        }
        infoDiv.show();
        for (var i = 0; i < window.photoModalRephotoArray.length; i += 1) {
            if (window.photoModalRephotoArray[i]['id'] == targetId) {
                fullscreenDiv.prop('src', window.photoModalRephotoArray[i]['fullscreen_url']);
                window.prepareFullscreen(window.photoModalRephotoArray[i]['fullscreen_width'],
                        window.photoModalRephotoArray[i]['fullscreen_height'],
                        '#ajapaik-rephoto-full-screen-image');
                photoDiv.html(tmpl('ajapaik-photo-modal-rephoto-template', window.photoModalRephotoArray[i]));
                infoDiv.html(tmpl('ajapaik-photo-modal-rephoto-info-template', window.photoModalRephotoArray[i]));
                window.currentlySelectedRephotoId = targetId;
                var commentsDiv = $('#ajapaik-rephoto-comments');
                commentsDiv.find('.fb-comments').attr('data-href', window.photoModalRephotoArray[i].fb_url);
                window.FB.XFBML.parse();
                if (window.isFrontpage) {

                } else {
                    window.syncMapStateToURL();
                }
                break;
            }
        }
    });
    $(document).on('click', '#ajapaik-show-rephoto-selection-overlay-button', function () {
        $(this).hide();
        window.userClosedRephotoTools = false;
        var rephotoColumn = $('#ajapaik-photo-modal-rephoto-column'),
            rephotoInfoColumn = $('#ajapaik-photo-modal-rephoto-info-column'),
            originalPhotoInfoColumn = $('#ajapaik-photo-modal-original-photo-info-column'),
            rephotoDiv = $('#ajapaik-modal-rephoto-container');
        if (window.photoModalRephotoArray.length > 1) {
            $('#ajapaik-rephoto-selection').show();
            $('#ajapaik-photo-modal-original-photo-column').removeClass('col-xs-12').addClass('col-xs-5');
            rephotoInfoColumn.removeClass('col-xs-12').removeClass('col-xs-6').addClass('col-xs-5');
            originalPhotoInfoColumn.removeClass('col-xs-12').removeClass('col-xs-6').addClass('col-xs-5');
        } else {
            $('#ajapaik-photo-modal-original-photo-column').removeClass('col-xs-12').addClass('col-xs-6');
            rephotoColumn.removeClass('col-xs-5').addClass('col-xs-6');
            rephotoInfoColumn.removeClass('col-xs-12').removeClass('col-xs-5').addClass('col-xs-6');
            originalPhotoInfoColumn.removeClass('col-xs-12').removeClass('col-xs-5').addClass('col-xs-6');
        }
        rephotoInfoColumn.show();
        rephotoColumn.show();
        window.currentlySelectedRephotoId = window.photoModalRephotoArray[0]['id'];
        rephotoDiv.html(tmpl('ajapaik-photo-modal-rephoto-template', window.photoModalRephotoArray[0]));
        rephotoInfoColumn.html(tmpl('ajapaik-photo-modal-rephoto-info-template', window.photoModalRephotoArray[0]));
        $('#ajapaik-photo-modal-map-container').hide();
        $('#ajapaik-modal-photo-container-container').removeClass('col-xs-9').addClass('col-xs-12');
        if (window.isFrontpage) {

        } else {
           window.syncMapStateToURL();
        }
    });
    $(document).on('click', '#ajapaik-photo-modal-source', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Source link click']);
        }  else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Source link click']);
        }
    });
    $(document).on('click', '#ajapaik-photo-modal-rephoto-source', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Rephoto source link click']);
        }  else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Rephoto source link click']);
        }
    });
    $(document).on('click', '#ajapaik-close-rephoto-overlay-button', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#ajapaik-photo-modal-rephoto-column').hide();
        $('#ajapaik-rephoto-selection').hide();
        $('#ajapaik-show-rephoto-selection-overlay-button').show();
        $('#ajapaik-grab-link').find('input').prop('value', window.hostname + originalPhotoAbsoluteURL);
        $('#ajapaik-photo-modal-original-photo-column').removeClass('col-xs-5').removeClass('col-xs-6').addClass('col-xs-12');
        $('#ajapaik-photo-modal-original-photo-info-column').removeClass('col-xs-5').removeClass('col-xs-6').addClass('col-xs-12');
        $('#ajapaik-photo-modal-rephoto-info-column').hide();
        window.currentlySelectedRephotoId = false;
        if (window.isFrontpage || window.isPhotoview) {

        } else {
            window.syncMapStateToURL();
        }
        window.userClosedRephotoTools = true;
        if (window.showPhotoMapIfApplicable) {
            window.showPhotoMapIfApplicable();
        }
    });
    $(document).on('click', '#ajapaik-grab-link', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '#ajapaik-comment-tabs li', function () {
        window.FB.XFBML.parse($('#ajapaik-rephoto-comments').get(0));
        window.FB.XFBML.parse($('#ajapaik-original-photo-comments').get(0));
    });
    $(document).on('click', '.ajapaik-thumbnail-selection-icon', function (e) {
        e.stopPropagation();
        var $this = $(this),
            other = $(".ajapaik-frontpage-image-container[data-id='" + $this.data('id') +"']").find('.ajapaik-thumbnail-selection-icon');
        if ($this.hasClass('ajapaik-thumbnail-selection-icon-white')) {
            $this.removeClass('ajapaik-thumbnail-selection-icon-white');
        } else {
            $this.addClass('ajapaik-thumbnail-selection-icon-white');
        }
        if ($this.parent().attr('id') == 'ajapaik-modal-photo-container') {
            if (other) {
                if (other.hasClass('ajapaik-thumbnail-selection-icon-white')) {
                    other.removeClass('ajapaik-thumbnail-selection-icon-white');
                } else {
                    other.addClass('ajapaik-thumbnail-selection-icon-white');
                    other.show();
                }
            }
        }
        var data = {
            id: $this.data('id'),
            csrfmiddlewaretoken: window.docCookies.getItem('csrftoken')
        };
        $.post(window.photoSelectionURL, data, function (response) {
            var len = Object.keys(response).length,
                target = $('#ajapaik-header-selection-indicator');
            if (len > 0) {
                target.removeClass('hidden');
            } else {
                target.addClass('hidden');
            }
            target.find('span').html(len);
        });
    });
    window.openPhotoUploadModal = function () {
        if (window.photoModalCurrentlyOpenPhotoId) {
            $.ajax({
                cache: false,
                url: '/photo_upload_modal/' + window.photoModalCurrentlyOpenPhotoId + '/',
                success: function (result) {
                    var rephotoUploadModal = $('#ajapaik-rephoto-upload-modal');
                    rephotoUploadModal.data('bs.modal', null);
                    rephotoUploadModal.html(result).modal();
                }
            });
        }
    };
    $(document).on('mouseenter', '.ajapaik-frontpage-image', function () {
        $(this).parent().find('.ajapaik-thumbnail-selection-icon').show();
    });
    $(document).on('mouseout', '.ajapaik-frontpage-image', function () {
        var icon = $(this).parent().find('.ajapaik-thumbnail-selection-icon');
        if (!icon.hasClass('ajapaik-thumbnail-selection-icon-white')) {
            $(this).parent().find('.ajapaik-thumbnail-selection-icon').hide();
        }
    });
    $(document).on('mouseenter', '.ajapaik-thumbnail-selection-icon', function () {
        $(this).parent().find('.ajapaik-thumbnail-selection-icon').show();
    });
    $(document).on('mouseout', '.ajapaik-thumbnail-selection-icon', function () {
        var icon = $(this).parent().find('.ajapaik-thumbnail-selection-icon');
        if (!icon.hasClass('ajapaik-thumbnail-selection-icon-white')) {
            $(this).parent().find('.ajapaik-thumbnail-selection-icon').hide();
        }
    });
    $(document).on('click', '#ajapaik-photo-modal-add-rephoto', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal add rephoto click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Photo modal add rephoto click']);
        }
        window.openPhotoUploadModal();
    });
    window.loadPossibleParentAlbums = function (parentAlbum, currentAlbumId, customSelector) {
        var url = /curator_selectable_parent_albums/;
        if (currentAlbumId) {
            url += currentAlbumId + '/';
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                csrfmiddlewaretoken: window.docCookies.getItem('csrftoken')
            },
            success: function (response) {
                var targetDiv;
                if (customSelector) {
                    targetDiv = $(customSelector);
                } else {
                    targetDiv = $('#ajapaik-curator-change-album-parent');
                }
                targetDiv.empty();
                targetDiv.append(
                    tmpl(
                        'ajapaik-curator-my-album-select-option',
                        {id: -1, name: window.gettext('Not selected')}
                    )
                );
                for (var i = 0, l = response.length; i < l; i += 1) {
                    if (!response[i].open) {
                        targetDiv.append(tmpl('ajapaik-curator-my-album-select-option', response[i]));
                    }
                }
                targetDiv.append(tmpl('ajapaik-curator-my-album-select-separator', {}));
                for (i = 0, l = response.length; i < l; i += 1) {
                    if (response[i].open) {
                        targetDiv.append(tmpl('ajapaik-curator-my-album-select-option', response[i]));
                    }
                }
                if (parentAlbum) {
                    targetDiv.val(parentAlbum);
                }
                if (window.isCurator) {
                    window._gaq.push(['_trackEvent', 'Curator', 'Load parent albums success']);
                } else {
                    window._gaq.push(['_trackEvent', 'Selection', 'Load parent albums success']);
                }
            },
            error: function () {
                if (window.isCurator) {
                    window._gaq.push(['_trackEvent', 'Curator', 'Load parent albums error']);
                } else {
                    window._gaq.push(['_trackEvent', 'Selection', 'Load parent albums success']);
                }
            }
        });
    };
    window.loadSelectableAlbums = function () {
        $.ajax({
            type: 'POST',
            url: '/curator_selectable_albums/',
            data: {
                csrfmiddlewaretoken: window.docCookies.getItem('csrftoken')
            },
            success: function (response) {
                var targetDiv = $('#ajapaik-curator-album-select');
                targetDiv.empty();
                targetDiv.append(
                    tmpl(
                        'ajapaik-curator-my-album-select-option',
                        {id: -1, name: window.gettext('Not selected')}
                    )
                );
                for (var i = 0, l = response.length; i < l; i += 1) {
                    if (!response[i].open) {
                        targetDiv.append(tmpl('ajapaik-curator-my-album-select-option', response[i]));
                    }
                }
                targetDiv.append(tmpl('ajapaik-curator-my-album-select-separator', {}));
                for (i = 0, l = response.length; i < l; i += 1) {
                    if (response[i].open) {
                        targetDiv.append(tmpl('ajapaik-curator-my-album-select-option', response[i]));
                    }
                }
                if (window.isCurator) {
                    window._gaq.push(['_trackEvent', 'Curator', 'Load album selection success']);
                } else if (window.isSelection) {
                    window._gaq.push(['_trackEvent', 'Selection', 'Load album selection success']);
                }
            },
            error: function () {
                if (window.isCurator) {
                    window._gaq.push(['_trackEvent', 'Curator', 'Load album selection error']);
                } else if (window.isSelection) {
                    window._gaq.push(['_trackEvent', 'Selection', 'Load album selection error']);
                }
            }
        });
    };
    $(document).on('click', '#ajapaik-header-menu-button-hidden-xs', function () {
        $('#ajapaik-header-menu-button').click();
    });
    $(document).on('click', '#ajapaik-photo-modal-share', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal share click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Photo modal share click']);
        }
    });
    $(document).on('click', '#ajapaik-sift-pics-link', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Sift.pics link click']);
        } else if (window.isOrder) {
            window._gaq.push(['_trackEvent', 'Order', 'Sift.pics link click']);
        }
    });
    $(document).on('click', '#full_leaderboard', function (e) {
        e.preventDefault();
        var url = window.leaderboardFullURL;
        if (window.albumId) {
            url += 'album/' + window.albumId;
        }
        $.ajax({
            url: url,
            success: function (response) {
                var modalWindow = $('#ajapaik-full-leaderboard-modal');
                modalWindow.find('.scoreboard').html(response);
                modalWindow.find('.score_container').show();
                window.hideScoreboard();
                modalWindow.modal();
            }
        });
        window._gaq.push(['_trackEvent', '', 'Full leaderboard']);
    });
    $(document).on('click', '#ajapaik-info-window-leaderboard-link', function (e) {
        e.preventDefault();
        window.albumId = $(this).data('id');
        $('#full_leaderboard').click();
        window.albumId = null;
    });

    $(document).on('click', '#ajapaik-invert-rephoto-overlay-button', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var targetDiv = $('#ajapaik-modal-rephoto');
        if (targetDiv.hasClass('ajapaik-photo-bw')) {
            targetDiv.removeClass('ajapaik-photo-bw');
        } else {
            targetDiv.addClass('ajapaik-photo-bw');
        }
    });

    $(document).on('click', '#ajapaik-header-about-button', function (e) {
        var targetDiv = $('#ajapaik-general-info-modal');
        if (window.generalInfoModalURL) {
            $.ajax({
                url: window.generalInfoModalURL,
                success: function (resp) {
                    targetDiv.html(resp).modal();
                }
            });
        }
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'General info click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'General info click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Mapview', 'General info click']);
        }
    });

    $(document).on('click', '#ajapaik-mobile-about-button', function (e) {
        var targetDiv = $('#ajapaik-general-info-modal');
        if (window.generalInfoModalURL) {
            $.ajax({
                url: window.generalInfoModalURL,
                success: function (resp) {
                    targetDiv.html(resp).modal();
                }
            });
        }
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'General info click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'General info click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Mapview', 'General info click']);
        }
    });

    $(document).on('click', '.ajapaik-photo-modal-previous-button', function (e) {
        e.preventDefault();
        if (!$(this).hasClass('ajapaik-photo-modal-previous-button-disabled')) {
            var previousId = $('#ajapaik-frontpage-image-container-' + photoModalCurrentlyOpenPhotoId).prev().data('id');
            if (previousId && !window.nextPhotoLoading) {
                window.loadPhoto(previousId);
            }
            if (window.isFrontpage) {
                window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal previous']);
            } else if (window.isGame) {
                window._gaq.push(['_trackEvent', 'Game', 'Photo modal previous']);
            }
        } else {
            if (window.isFrontpage) {
                window.previousPageOnModalClose = true;
                window.closePhotoDrawer();
            }
        }
    });

    $(document).on('click', ".ajapaik-flip-photo-overlay-button", function () {
        var target = $("#ajapaik-modal-photo"),
            fullScreenImage = $('#ajapaik-full-screen-image');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        if (target.hasClass("ajapaik-photo-flipped")) {
            target.removeClass("ajapaik-photo-flipped");
        } else {
            target.addClass("ajapaik-photo-flipped");
        }
        if (fullScreenImage.hasClass("ajapaik-photo-flipped")) {
            fullScreenImage.removeClass("ajapaik-photo-flipped");
        } else {
            fullScreenImage.addClass("ajapaik-photo-flipped");
        }
        window.flipPhoto();
    });

    $(document).on('click', '.ajapaik-photo-modal-next-button', function () {
        if (!$(this).hasClass('ajapaik-photo-modal-next-button-disabled')) {
            var nextId = $('#ajapaik-frontpage-image-container-' + photoModalCurrentlyOpenPhotoId).next().data('id');
            if (nextId && !window.nextPhotoLoading) {
                window.loadPhoto(nextId);
            }
            if (window.isFrontpage) {
                window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal next']);
            } else if (window.isGame) {
                window._gaq.push(['_trackEvent', 'Game', 'Photo modal next']);
            }
        } else {
            if (window.isFrontpage) {
                window.nextPageOnModalClose = true;
                window.closePhotoDrawer();
            }
        }
    });

    $(document).on('click', '.ajapaik-photo-modal-album-link', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Album link click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Album link click']);
        }
    });

    $(document).on('click', '#ajapaik-photo-modal-specify-location', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Photo modal specify location click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Map', 'Photo modal specify location click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'Photo modal specify location click']);
        }
        window.startGuessLocation($(this).data('id'));
    });

    $(document).on('click', '#ajapaik-photo-modal-close-button', function (e) {
        e.preventDefault();
        window.closePhotoDrawer();
    });

    $(document).on('change', '#ajapaik-curator-create-new-album-checkbox', function () {
        var $this = $(this),
            creationFields = $('.ajapaik-curator-new-album-creation-field'),
            existingFields = $('.ajapaik-curator-add-to-existing-album-field');
        if ($this.is(':checked')) {
            creationFields.show();
            existingFields.hide();
        } else {
            creationFields.hide();
            existingFields.show();
        }
    });

    $(document).on('keyup', '#ajapaik-curator-album-filter', function () {
        var filter = $(this).val().toLowerCase();
        if (filter === "") {
            $('option').show();
        } else {
            $('#ajapaik-curator-album-select').find('option').each(function() {
                if ($(this).text().toLowerCase().indexOf(filter) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });

    $(document).on('hidden.bs.modal', '#ajapaik-choose-albums-modal', function () {
        $('#ajapaik-curator-album-filter').val(null);
    });

    // Chrome jumps up https://code.google.com/p/chromium/issues/detail?id=142427
    BigScreen.onexit = function() {
        if (window.lastScrollPosition) {
            setTimeout(function () {
                $(window).scrollTop(window.lastScrollPosition);
                window.lastScrollPosition = null;
            }, 500);
        }
    };

    $(document).on('click', '#ajapaik-mobile-about-label', function () {
        $('#ajapaik-mobile-about-button').click();
    });

    $(document).on('click', '#ajapaik-header-album-more', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var targetDiv = $('#ajapaik-info-modal');
        if (window.albumId && window.infoModalURL) {
            $.ajax({
                url: window.infoModalURL + window.albumId,
                data: {
                    linkToMap: window.linkToMap,
                    linkToGame: window.linkToGame,
                    linkToGallery: window.linkToGallery,
                    fbShareGame: window.fbShareGame,
                    fbShareMap: window.fbShareMap,
                    fbShareGallery: window.fbShareGallery
                },
                success: function (resp) {
                    targetDiv.html(resp);
                    targetDiv.modal().on('shown.bs.modal', function () {
                        window.FB.XFBML.parse($('#ajapaik-info-modal-like').get(0));
                    });
                }
            });
        }
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Album info click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'Album info click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Mapview', 'Album info click']);
        }
    });

    $(document).on('click', '.ajapaik-album-selection-album-more-button', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var targetDiv = $('#ajapaik-info-modal');
        if ($(this).data('id') && window.infoModalURL) {
            $.ajax({
                url: window.infoModalURL + $(this).data('id'),
                data: {
                    linkToMap: true,
                    linkToGame: true,
                    linkToGallery: true,
                    fbShareGallery: true
                },
                success: function (resp) {
                    targetDiv.html(resp);
                    targetDiv.modal().on('shown.bs.modal', function () {
                        window.FB.XFBML.parse($('#ajapaik-info-modal-like').get(0));
                    });
                }
            });
        }
        window._gaq.push(['_trackEvent', 'Gallery', 'Album caption info click']);
    });

    $(document).on('click', '.ajapaik-change-language-link', function (e) {
        e.preventDefault();
        $('#ajapaik-language').val($(this).attr('data-lang-code'));
        $('#ajapaik-change-language-form').submit();
    });

    $(document).on('click', '#ajapaik-filter-closest-link', function (e) {
        e.preventDefault();
        originalClosestLink = e.target.href;
        getGeolocation(window.handleGeolocation);
    });

    $(document).on('click', '.ajapaik-album-info-modal-album-link', function () {
        if (window.isFrontpage) {
            window._gaq.push(['_trackEvent', 'Gallery', 'Album info album link click']);
        } else if (window.isGame) {
            window._gaq.push(['_trackEvent', 'Game', 'Album info album link click']);
        } else if (window.isMapview) {
            window._gaq.push(['_trackEvent', 'Mapview', 'Album info album link click']);
        }
    });

    $(document).on('click', '.ajapaik-close-streetview-button', function () {
        map.getStreetView().setVisible(false);
    });

    $(document).on('click', '#ajapaik-mapview-close-streetview-button', function () {
        map.getStreetView().setVisible(false);
    });

    $(document).on('click', '#ajapaik-filtering-help', function (e) {
        e.stopPropagation();
        $('#ajapaik-filtering-tutorial-modal').modal();
    });

    hideUnlockedAzimuth = function () {
        if (!saveDirection) {
            dottedAzimuthLine.setVisible(false);
        }
    };

    showUnlockedAzimuth = function () {
        if (!saveDirection) {
            dottedAzimuthLine.setVisible(true);
        }
    };

    $(document).on('click', '#ajapaik-close-filtering-tutorial-modal', function (e) {
        e.stopPropagation();
        $('#ajapaik-filtering-tutorial-modal').modal('toggle');
    });

    $('#ajapaik-guess-panel-container').hover(hideUnlockedAzimuth, showUnlockedAzimuth);

    window.openTutorialPanel = function () {
        tutorialPanelSettings.content = $('#ajapaik-tutorial-js-panel-content').html();
        if (window.isMobile) {
            tutorialPanelSettings.resizable = false;
            tutorialPanelSettings.draggable = false;
        }
        tutorialPanel = $.jsPanel(tutorialPanelSettings);
    };

    $('body').on('jspanelclosed', function closeHandler(event, id) {
        if (id === 'ajapaik-tutorial-js-panel') {
            window.userClosedTutorial = true;
            tutorialPanel = undefined;
            window.docCookies.setItem('ajapaik_closed_tutorial', true, 'Fri, 31 Dec 9999 23:59:59 GMT', '/', 'ajapaik.ee', false);
            $('body').off('jspanelclosed', closeHandler);
        }
    });

    $(window).on('resize', function () {
        if (window.innerWidth > 768) {
            $('.navbar-collapse').removeClass('in');
        }
    });
    
}(jQuery));