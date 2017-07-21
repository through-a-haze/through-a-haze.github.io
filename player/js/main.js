'use strict';

(function createPlayer() {
    var playerWrapper = document.getElementsByTagName('gold-player')[0];

    if (!playerWrapper) return;

    var videojsOptions = {
        controls: false,
        autoplay: true,
        preload: 'auto',
        width: 234,
        height: 176
    };
    var playPauseButton = createButton('play-pause-button', playPause);
    var nextButton = createButton('next-button', nextVideo);
    var prevButton = createButton('prev-button', prevVideo);
    var muteButton = createButton('mute-button', mute);
    var videojsPlayer;
    var playlist;
    var people;

    getData(playerWrapper.dataset.from, parseData);

    function setPlaylist(playlist) {
        videojsPlayer.playlist(playlist);
        videojsPlayer.playlist.autoadvance(0);
        videojsPlayer.playlist.repeat(true);
    };

    function playPause() {
        if (videojsPlayer.paused()) {
            videojsPlayer.play()
            this.className = '';
        } else {
            videojsPlayer.pause();
            this.className = 'paused';
        }
    };

    function mute() {
        if (videojsPlayer.muted()) {
            videojsPlayer.muted(false)
            this.className = '';
        } else {
            videojsPlayer.muted(true);
            this.className = 'muted';
        }
    };

    function nextVideo() {
        videojsPlayer.playlist.next() || videojsPlayer.playlist.first();
    };

    function prevVideo() {
        if (videojsPlayer.currentTime() > 1) {
            videojsPlayer.currentTime(0);
            return;
        }

        videojsPlayer.playlist.previous() || videojsPlayer.playlist.last();
    };

    function initVideojs() {
        var videojsPlayer = videojs('videojs-player', videojsOptions);
        videojsPlayer.on('playlistitem', function() {
            var currentItem = videojsPlayer.playlist.currentItem();

            changeTitle(people[currentItem]);
        });

        return videojsPlayer;
    };

    function createPlayerWrapper() {
        playerWrapper.appendChild(createTitle());
        playerWrapper.appendChild(createVideoJsPlayer());
        playerWrapper.appendChild(prevButton);
        playerWrapper.appendChild(playPauseButton);
        playerWrapper.appendChild(nextButton);
        playerWrapper.appendChild(muteButton);

        videojsPlayer = initVideojs();
        setPlaylist(playlist);
    };

    function createVideoJsPlayer() {
        var element = document.createElement('video');
        element.id = 'videojs-player';
        element.className = 'video-js';

        return element;
    };

    function createButton(btn, onclickEvent) {
        var button = document.createElement('div');
        button.id = 'videojs-' + btn;
        button.onclick = onclickEvent;

        return button;
    };

    function createTitle() {
        var elementWrapper = document.createElement('div');
        var repNameElement = document.createElement('div');
        var repManagerElement = document.createElement('div');
        
        elementWrapper.id = 'videojs-title';
        repNameElement.id = 'videojs-repname';
        repManagerElement.id = 'videojs-repmanager';

        elementWrapper.appendChild(repNameElement);
        elementWrapper.appendChild(repManagerElement);

        return elementWrapper;
    };

    function changeTitle(person) {
        var repNameElement = document.getElementById('videojs-repname');
        var repManagerElement = document.getElementById('videojs-repmanager');

        repNameElement.innerText = person.fullName;
        repManagerElement.innerText = 'Team: ' + person.managerName;
    }

    function getData(fileName, cb) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", fileName, true);

        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    cb(JSON.parse(xhr.responseText));
                } else {
                    console.error(xhr.statusText);
                    alert('GoldPlayer can\'t get the data from: ' + fileName + '\nThe reason is: ' + xhr.statusText);
                }
            }
        };

        xhr.onerror = function(e) {
            console.error(xhr.statusText);
        };

        xhr.send(null);
    };

    function parseData(data) {
        playlist = makePlaylist(data);
        people = makePeople(data);

        createPlayerWrapper();
    };

    function makePlaylist(data) {
        var playlist = [];
        var videoSrc;
        var src;

        for (var i = 0; i < data.length; i++) {
            src = makeSource();
            src.sources[0].src = data[i].video;

            playlist.push(src);
        }

        function makeSource() {
            var sourceTemplate = {
                sources: [{
                    src: '',
                    type: 'video/mp4'
                }]
            };

            return sourceTemplate;
        }

        return playlist;
    };

    function makePeople(data) {
        var people = [];
        var person;

        for (var i = 0; i < data.length; i++) {
            person = makePerson();
            person.fullName = data[i].repFirstName + ' ' + data[i].repLastName + ',';
            person.managerName = data[i].repManager;

            people.push(person);
        }

        function makePerson() {
            return person = {};
        }

        return people;
    };
}());
