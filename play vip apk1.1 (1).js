

// Crear contenedor para los controles personalizados
var customControls = document.createElement('div');
customControls.classList.add('vjs-custom-controls');

var topControls = document.createElement('div');
topControls.classList.add('vjs-top-controls');

// Aquí puedes añadir más lógica para configurar los controles personalizados

// Controles de Seek y Play/Pause
var seekBackButton = document.createElement('button');
seekBackButton.classList.add('vjs-custom-button', 'vjs-seek-back');
seekBackButton.innerHTML = '<span class="material-icons">replay_10</span>';
topControls.appendChild(seekBackButton);

var playPauseButton = document.createElement('button');
playPauseButton.classList.add('vjs-custom-button', 'vjs-play-pause');
playPauseButton.innerHTML = '<span class="material-icons">pause</span>'; // Mostrar pausa inicialmente
topControls.appendChild(playPauseButton);

var seekForwardButton = document.createElement('button');
seekForwardButton.classList.add('vjs-custom-button', 'vjs-seek-forward');
seekForwardButton.innerHTML = '<span class="material-icons">forward_10</span>';
topControls.appendChild(seekForwardButton);

// Botón de Cast
var castButton = document.createElement('button');
castButton.classList.add('vjs-custom-button', 'vjs-cast');
castButton.innerHTML = '<span class="material-icons" style="font-size: 30px;">cast</span>'; // Reducir el tamaño del ícono
castButton.style.position = 'absolute'; // Posicionar en la parte superior derecha
castButton.style.top = '-90px';
castButton.style.right = '10px';
castButton.style.padding = '5px'; // Reducir el espacio interno del botón
castButton.style.borderRadius = '50%'; // Hacerlo circular si deseas
topControls.appendChild(castButton);

customControls.appendChild(topControls);

// Controles de Reiniciar y Next (debajo de los controles anteriores)
var bottomControls = document.createElement('div');
bottomControls.classList.add('vjs-bottom-controls');

var restartButton = document.createElement('button');
restartButton.classList.add('vjs-custom-button', 'vjs-restart');
restartButton.innerHTML = '<span class="material-icons">skip_previous</span> Reiniciar';
bottomControls.appendChild(restartButton);

customControls.appendChild(bottomControls);

// Agregar los controles personalizados al reproductor
player.el().appendChild(customControls);

// Función para manejar la transmisión con Web Video Caster
function transmitWithWebVideoCaster() {
    // Obtener la URL del video en reproducción desde el reproductor
    var videoUrl = player.currentSrc(); // Enlace del video actualmente en reproducción

    if (!videoUrl) {
        alert('No se puede obtener el enlace del video actual.');
        return;
    }

    // Crear el enlace seguro con el esquema de Web Video Caster
    var secureURL = encodeURIComponent(videoUrl) + "&secure_uri=true";
    var wvcUrl = `wvc-x-callback://open?url=${secureURL}`;

    // Redirigir al enlace generado
    window.location.href = wvcUrl;

    // Si no funciona, redirigir al usuario al mercado para descargar Web Video Caster
    setTimeout(function() {
        window.location.href = "market://launch?id=com.instantbits.cast.webvideo";
    }, ); // Esperar 1 segundo antes de redirigir al mercado

    // Intentar abrir la aplicación Web Video Caster
    var timeout = setTimeout(function () {
        // Si no se pudo abrir la app, redirigir al usuario a la tienda de aplicaciones
        var isAndroid = /android/i.test(navigator.userAgent);
        var isIOS = /iphone|ipod|ipad/i.test(navigator.userAgent);

        if (isAndroid) {
            // Redirigir a Google Play Store (Android)
            window.location.href = 'market://launch?id=com.instantbits.cast.webvideo';
        } else if (isIOS) {
            // Redirigir a la App Store (iOS)
            window.location.href = 'https://apps.apple.com/us/app/web-video-caster/id1047520391';
        }
    }, ); // Esperar 2 segundos para ver si se puede abrir la app

    // Limpiar el tiempo de espera si la app se abre
    clearTimeout(timeout);
}

// Asociar el evento de clic al botón de "Cast"
castButton.addEventListener('click', transmitWithWebVideoCaster);


// Controles de Reiniciar y Next (debajo de los controles anteriores)
var bottomControls = document.createElement('div');
bottomControls.classList.add('vjs-bottom-controls');

var restartButton = document.createElement('button');
restartButton.classList.add('vjs-custom-button', 'vjs-restart');
restartButton.innerHTML = '<span class="material-icons">skip_previous</span> Reiniciar';
bottomControls.appendChild(restartButton);



customControls.appendChild(bottomControls);

// Agregar los controles al reproductor
player.el().appendChild(customControls);

// Lógica de visibilidad de controles
let hideControlsTimeout;

function showControls() {
    player.controlBar.el().style.opacity = '1';
    customControls.style.opacity = '1';
    clearTimeout(hideControlsTimeout);
}

function hideControls() {
    if (!player.paused()) {
        player.controlBar.el().style.opacity = '0';
        customControls.style.opacity = '0';
    }
}

function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

player.el().addEventListener(isMobileDevice() ? 'touchstart' : 'mousemove', () => {
    showControls();
    hideControlsTimeout = setTimeout(hideControls, 5000); // Ocultar controles después de 2 segundos
});

player.on('pause', () => {
    showControls();
    clearTimeout(hideControlsTimeout);
});

player.on('play', () => {
    playPauseButton.innerHTML = '<span class="material-icons">pause</span>';
    hideControlsTimeout = setTimeout(hideControls, 2000); // Ocultar controles después de 2 segundos
});

player.on('pause', () => {
    playPauseButton.innerHTML = '<span class="material-icons">play_arrow</span>';
});

// Botones personalizados
seekBackButton.addEventListener('click', function () {
    var currentTime = player.currentTime();
    player.currentTime(Math.max(0, currentTime - 10));
});

playPauseButton.addEventListener('click', function () {
    if (player.paused()) {
        player.play();
        playPauseButton.innerHTML = '<span class="material-icons">pause</span>';
    } else {
        player.pause();
        playPauseButton.innerHTML = '<span class="material-icons">play_arrow</span>';
    }
});

seekForwardButton.addEventListener('click', function () {
    var currentTime = player.currentTime();
    player.currentTime(currentTime + 10);
});

restartButton.addEventListener('click', function () {
    player.currentTime(0); // Reiniciar el video
    player.play(); // Reproducir desde el principio
});




// Comportamiento de pantalla completa y pausa
player.on('play', () => {
    if (!player.isFullscreen()) {
        player.requestFullscreen();
    }
});

player.on('fullscreenchange', () => {
    var playerContainer = document.getElementById('player-container');

    if (!player.isFullscreen()) {
        player.pause(); // Pausa el video

        // Oculta completamente el contenedor del reproductor
        playerContainer.style.visibility = 'hidden';
        playerContainer.style.height = '0';
        playerContainer.style.display = 'none'; // Ocultar completamente
    }
});


// Restringir reproducción/pausa a controles personalizados
player.el().addEventListener('click', (e) => {
    if (!isMobileDevice()) {
        e.stopPropagation();
    }
});

  


  // Función para manejar el progreso del video
  function manageVideoProgress(player) {
    const videoKey = `videoProgress_${player.currentSrc()}`; // Clave única para el progreso basado en la URL del video

    // Restaurar el progreso guardado
    const savedTime = localStorage.getItem(videoKey);
    if (savedTime) {
      player.ready(() => {
        player.currentTime(parseFloat(savedTime));
      });
    }

    // Guardar el progreso cada vez que cambie el tiempo de reproducción
    player.on("timeupdate", () => {
      const currentTime = player.currentTime();
      localStorage.setItem(videoKey, currentTime);
    });

    // Limpiar el progreso al finalizar el video
    player.on("ended", () => {
      localStorage.removeItem(videoKey);
    });
  }

  // Inicializar la función para manejar el progreso del video
  manageVideoProgress(player);

