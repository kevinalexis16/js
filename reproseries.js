// Configuración de video.js con controles personalizados
var player = videojs('player', {
  controlBar: {
        playToggle: false, // Eliminar el control de Play
        volumePanel: false,
        fullscreenToggle: false,
        pipToggle: false,
        progressControl: true,
        remainingTimeDisplay: true,
        currentTimeDisplay: true,
    },
    userActions: {
        doubleClick: false, // Desactivar doble clic para pantalla completa
        hotkeys: false // Desactivar hotkeys para reproducción
    }
});


// Eventos para oscurecer temporalmente al tocar
player.el().addEventListener('touchstart', () => {
    showOverlay();
    hideOverlayTimeout = setTimeout(() => {
        if (!player.paused()) hideOverlay();
    }, 2000); // Oscurecer temporalmente durante 2 segundos
});

// Mantener la pantalla oscura al pausar
player.on('pause', () => {
    showOverlay();
});

// Volver a la normalidad al reproducir
player.on('play', () => {
    hideOverlay();
});


const customControls = document.createElement('div');
customControls.classList.add('vjs-custom-controls');

const topControls = document.createElement('div');
topControls.classList.add('vjs-top-controls');

// Crear el botón de cast
const castButton = document.createElement('button');
castButton.classList.add('vjs-custom-button', 'vjs-cast');
castButton.innerHTML = '<span class="material-icons">cast</span>'; // Icono de cast

// Agregar el botón de cast al contenedor de controles superior
topControls.appendChild(castButton);

// Función para obtener la URL del episodio actual
function getCurrentEpisodeUrl() {
    const currentEpisode = playlist.seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
    return currentEpisode.video_url;
}


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




// Contenedor para los controles (topControls ya existe)
topControls.appendChild(castButton);



// Controles de Seek y Play/Pause
const seekBackButton = document.createElement('button');
seekBackButton.classList.add('vjs-custom-button', 'vjs-seek-back');
seekBackButton.innerHTML = '<span class="material-icons">replay_10</span>';
topControls.appendChild(seekBackButton);

const playPauseButton = document.createElement('button');
playPauseButton.classList.add('vjs-custom-button', 'vjs-play-pause');
playPauseButton.innerHTML = '<span class="material-icons">pause</span>'; // Mostrar pausa inicialmente
topControls.appendChild(playPauseButton);

const seekForwardButton = document.createElement('button');
seekForwardButton.classList.add('vjs-custom-button', 'vjs-seek-forward');
seekForwardButton.innerHTML = '<span class="material-icons">forward_10</span>';
topControls.appendChild(seekForwardButton);

customControls.appendChild(topControls);



// Controles de Reiniciar y Next (debajo de los controles anteriores)
const bottomControls = document.createElement('div');
bottomControls.classList.add('vjs-bottom-controls');

// Botón de Reiniciar
const restartButton = document.createElement('button');
restartButton.classList.add('vjs-custom-button', 'vjs-restart');
restartButton.innerHTML = '<span class="material-icons">skip_previous</span> Reiniciar';
bottomControls.appendChild(restartButton);

/// Botón de Siguiente
const nextButton = document.createElement('button');
nextButton.classList.add('vjs-custom-button', 'vjs-next');
nextButton.innerHTML = '<span class="material-icons">skip_next</span> Siguiente';

// Lógica para cambiar al siguiente episodio
nextButton.addEventListener('click', () => {
    const currentEpisodeIndex = player.currentEpisodeIndex || 0; // Índice del episodio actual
    const currentSeason = playlist.seasons[0]; // Por ahora, asumimos la primera temporada

    if (currentSeason && currentSeason.episodes[currentEpisodeIndex + 1]) {
        // Actualizar el índice del episodio actual
        const newEpisodeIndex = currentEpisodeIndex + 1;
        player.currentEpisodeIndex = newEpisodeIndex;

        // Cambiar la fuente del video al siguiente episodio
        const nextEpisode = currentSeason.episodes[newEpisodeIndex];
        player.src(nextEpisode.video_url);


  
  
   // Mostrar una notificación personalizada
    let notificacion = document.querySelector('.notificacion');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        document.body.appendChild(notificacion);
    }
    notificacion.textContent = 'No hay más episodios disponibles.';
    notificacion.style.display = 'block';
    setTimeout(() => {
        notificacion.style.display = 'none';
    }, 3000);
}
});

bottomControls.appendChild(nextButton);

customControls.appendChild(bottomControls);

// Agregar los controles al reproductor
player.el().appendChild(customControls);

// Función para obtener el enlace de descarga del episodio actual
function getCurrentDownloadLink() {
    const currentEpisodeIndex = player.currentEpisodeIndex || 0; // Índice del episodio actual
    const currentSeason = playlist.seasons[0]; // Por ahora, asumimos la primera temporada
    if (currentSeason && currentSeason.episodes[currentEpisodeIndex]) {
        return currentSeason.episodes[currentEpisodeIndex].download_link;
    }
    return null;
}

// Lógica de visibilidad de controles
let hideControlsTimeout;


// Función para mostrar los controles y el título
function showControls() {
    player.controlBar.el().style.opacity = '1';
    customControls.style.opacity = '1';
    titleElement.style.opacity = '1'; // Mostrar el título
    clearTimeout(hideControlsTimeout);
}

// Función para ocultar los controles y el título
function hideControls() {
    if (!player.paused()) {
        player.controlBar.el().style.opacity = '0';
        customControls.style.opacity = '0';
        titleElement.style.opacity = '0'; // Ocultar el título
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
    const currentTime = player.currentTime();
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
    const currentTime = player.currentTime();
    player.currentTime(currentTime + 10);
});

restartButton.addEventListener('click', function () {
    player.currentTime(0); // Reiniciar el video
    player.play(); // Reproducir desde el principio
});

nextButton.addEventListener('click', function () {
    // Verificar si hay un siguiente episodio
    if (currentEpisodeIndex < playlist.seasons[currentSeasonIndex].episodes.length - 1) {
        // Si hay un siguiente episodio, avanzamos al siguiente episodio
        currentEpisodeIndex++;
        const nextEpisode = playlist.seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
        player.src({ type: 'video/mp4', src: nextEpisode.video_url });
        player.play();
        updateTitle(nextEpisode); // Actualizar el título con el nuevo episodio
    } else if (currentSeasonIndex < playlist.seasons.length - 1) {
        // Si no hay más episodios en la temporada actual, avanzamos a la siguiente temporada
        currentSeasonIndex++;
        currentEpisodeIndex = 0; // Comenzamos desde el primer episodio de la nueva temporada
        const nextSeason = playlist.seasons[currentSeasonIndex];
        updateSeasonButton(nextSeason.season_title); // Actualizamos el título de la temporada
        loadEpisodes(nextSeason); // Cargamos los episodios de la siguiente temporada
        const nextEpisode = nextSeason.episodes[currentEpisodeIndex];
        player.src({ type: 'video/mp4', src: nextEpisode.video_url });
        player.play();
        updateTitle(nextEpisode); // Actualizar el título con el nuevo episodio
    }
});


// Comportamiento de pantalla completa y pausa
player.on('play', () => {
    if (!player.isFullscreen()) {
        player.requestFullscreen();
    }
});

player.on('fullscreenchange', () => {
    if (!player.isFullscreen()) {
        player.pause();
    }
});

// Restringir reproducción/pausa a controles personalizados
player.el().addEventListener('click', (e) => {
    if (!isMobileDevice()) {
        e.stopPropagation();
    }
});

const style = document.createElement('style');
style.innerHTML = `
.vjs-custom-controls{display:flex;flex-direction:column;justify-content:center;align-items:center;position:absolute;bottom:10px;width:100%;z-index:10}.vjs-top-controls{display:flex;justify-content:center;align-items:center;margin-bottom:10px;gap:30px}.vjs-top-controls .vjs-custom-button{background-color:rgba(0,0,0,0,);color:#fff;border:none;font-size:60px;padding:20px;margin:0 15px;border-radius:50%;cursor:pointer;transition:transform 0.2s}.vjs-top-controls .vjs-custom-button:hover{transform:scale(1.1)}.vjs-top-controls .material-icons{font-size:60px}.vjs-bottom-controls{display:flex;justify-content:center;align-items:center;position:absolute;bottom:-90px;width:100%;gap:50px}.vjs-bottom-controls .vjs-custom-button{background-color:rgba(0,0,0,0,);color:#fff;border:none;font-size:10px;padding:8px;margin:0 10px;border-radius:50%;cursor:pointer;transition:transform 0.2s}.vjs-bottom-controls .vjs-custom-button:hover{transform:scale(1.1)}.vjs-bottom-controls .material-icons{font-size:20px}.vjs-restart,.vjs-next{font-size:10px;margin-left:8px}.vjs-title{position:absolute;top:10px;left:50%;transform:translateX(-50%);font-size:24px;color:#fff;font-weight:700;text-shadow:2px 2px 4px rgb(0 0 0 / .7);z-index:9999}
`;
document.head.appendChild(style);

// Variables para gestionar el índice de episodio y temporada
var currentEpisodeIndex = 0; // Índice del episodio actual
var currentSeasonIndex = 0; // Índice de la temporada actual

// Crear el contenedor para el título, solo una vez
var titleElement = document.createElement('div');
titleElement.classList.add('vjs-title');
document.querySelector('.video-js').appendChild(titleElement);  // Asegúrate de agregarlo al reproductor

// Función para actualizar el título del episodio
function updateTitle(episode) {
    const titleElement = document.querySelector('.vjs-title');
    if (titleElement) {
        titleElement.textContent = episode.title; // Asigna el título del episodio actual
    }
}

// Al cargar un episodio, actualizar el título
function playEpisode(episode) {
    player.src({ type: 'video/mp4', src: episode.video_url });
    player.play();
    updateTitle(episode); // Actualiza el título al cambiar el episodio
}

// Lógica para cambiar de episodio cuando termine el actual
player.on('ended', function() {
    const currentSeason = playlist.seasons[currentSeasonIndex];
    if (currentEpisodeIndex < currentSeason.episodes.length - 1) {
        currentEpisodeIndex++;
        const nextEpisode = currentSeason.episodes[currentEpisodeIndex];
        playEpisode(nextEpisode); // Cambia el video y actualiza el título
    } else if (currentSeasonIndex < playlist.seasons.length - 1) {
        currentSeasonIndex++;
        currentEpisodeIndex = 0;
        const nextSeason = playlist.seasons[currentSeasonIndex];
        playEpisode(nextSeason.episodes[currentEpisodeIndex]); // Cambia de temporada
    }
});

// Inicializar el reproductor con el primer episodio
document.addEventListener('DOMContentLoaded', () => {
    const firstEpisode = playlist.seasons[currentSeasonIndex].episodes[currentEpisodeIndex];
    // playEpisode(firstEpisode); // Eliminar esta línea para evitar que se reproduzca automáticamente
});


// Función para cargar los episodios de la siguiente temporada (opcional)
function loadEpisodes(season) {
  // Puedes agregar aquí la lógica para cargar los episodios de la siguiente temporada
}

// Llamar a esta función cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
  autoPlayNextEpisode(); // Habilitar la reproducción automática del siguiente episodio
});

// Inicializar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadSeasons(); // Cargar temporadas en la lista
    renderEpisodes(playlist.seasons[0]); // Cargar episodios de la primera temporada
    updateSeasonButton(playlist.seasons[0].season_title); // Botón con la primera temporada
    autoPlayNextEpisode(); // Habilitar reproducción automática
});

      // Elementos de la página
var overlay = document.getElementById('overlay');
var floatingWindow = document.getElementById('floating-window');
var seasonButton = document.getElementById('season-button');
var playlistContainer = document.getElementById('playlist');
var playerContainer = document.getElementById('player-container');
var seasonList = document.getElementById('season-list');
var sortButton = document.getElementById('sort-button');
var currentSeasonIndex = 0;
var sortOrder = 'newest'; // Orden inicial de episodios

// Función para mostrar la ventana flotante y la capa oscura
function openFloatingWindow() {
    floatingWindow.classList.add('visible');
    overlay.classList.add('visible');
    console.log("Overlay y ventana flotante activados");
}

// Función para cerrar la ventana flotante y ocultar la capa oscura
function closeFloatingWindow() {
    floatingWindow.classList.remove('visible');
    overlay.classList.remove('visible');
    console.log("Overlay y ventana flotante desactivados");
}

// Abrir ventana flotante al hacer clic en el botón 'Temporada'
seasonButton.addEventListener('click', openFloatingWindow);

// Cerrar ventana flotante al hacer clic en el overlay
overlay.addEventListener('click', closeFloatingWindow);

// Cargar temporadas
function loadSeasons() {
    seasonList.innerHTML = '';
    playlist.seasons.forEach(function(season, index) {
        var li = document.createElement('li');
        li.textContent = season.season_title;
        li.addEventListener('click', function() {
            loadEpisodes(index); // Cargar episodios de la temporada seleccionada
            updateSeasonButtonText(season.season_title); // Actualizar texto del botón
            closeFloatingWindow();
        });
        seasonList.appendChild(li);
    });
}

// Actualizar el texto del botón de "Temporadas" manteniendo el ícono
function updateSeasonButtonText(seasonTitle) {
    seasonButton.innerHTML = `<span>${seasonTitle}</span> <i class="fa fa-chevron-down"></i>`;
}

// Cargar episodios
function loadEpisodes(seasonIndex) {
    currentSeasonIndex = seasonIndex; // Actualizar el índice de la temporada actual
    playlistContainer.innerHTML = '';
    var episodes = playlist.seasons[seasonIndex].episodes;

    // Ordenar episodios según el orden actual (Nuevos o Antiguos)
    if (sortOrder === 'oldest') {
        episodes = [...episodes].reverse(); // Invertir el orden para mostrar los más antiguos primero
    }

    episodes.forEach(function(episode, index) {
        var episodeDiv = document.createElement('div');
        episodeDiv.className = 'episode';

        // Imagen del episodio
        var img = document.createElement('img');
        img.src = episode.image;

        // Información del episodio
        var info = document.createElement('div');
        info.className = 'episode-info';

        var title = document.createElement('h3');
        title.textContent = episode.title;
        info.appendChild(title);

      // Recuadro con temporada y episodio
var pequeñoRecuadro = document.createElement('div');
pequeñoRecuadro.className = 'pequeno-recuadro';
pequeñoRecuadro.textContent = `S${seasonIndex + 1}:E${index + 1}`;
info.appendChild(pequeñoRecuadro);

// Div de Visto/No Visto
var vistoDiv = document.createElement('div');
vistoDiv.className = 'visto';

var checkbox = document.createElement('input');
checkbox.type = 'checkbox';

// Recuperar el estado del episodio desde localStorage (si existe)
var watchedStatus = localStorage.getItem(`episode_${seasonIndex + 1}_${index + 1}`);
checkbox.checked = watchedStatus === 'true'; // Si está guardado como 'true', marcar como visto

// Crear el h2 y el span solo una vez
var h2 = document.createElement('h2');
var statusText = document.createElement('span');
statusText.textContent = checkbox.checked ? 'VISTO' : 'NO VISTO';
h2.appendChild(statusText);
vistoDiv.appendChild(h2);

// Agregar el checkbox y el texto de estado
vistoDiv.appendChild(checkbox);

checkbox.addEventListener('change', function() {
    var statusText = vistoDiv.querySelector('h2 span');
    if (checkbox.checked) {
        statusText.textContent = 'VISTO';
        // Guardar el estado como 'true' en localStorage
        localStorage.setItem(`episode_${seasonIndex + 1}_${index + 1}`, 'true');
    } else {
        statusText.textContent = 'NO VISTO';
        // Guardar el estado como 'false' en localStorage
        localStorage.setItem(`episode_${seasonIndex + 1}_${index + 1}`, 'false');
    }
});

// Switch para Visto/No Visto
var switchDiv = document.createElement('div');
switchDiv.className = 'switch-container';

var switchSlider = document.createElement('label');
switchSlider.className = 'switch';

var slider = document.createElement('span');
slider.className = 'slider';

// Agregar input checkbox dentro del switch
switchSlider.appendChild(checkbox);
switchSlider.appendChild(slider);

// Prevenir propagación del evento al hacer clic en el switch
switchSlider.addEventListener('click', function(event) {
    event.stopPropagation();
});

// Agregar elementos al contenedor del switch
switchDiv.appendChild(vistoDiv);
switchDiv.appendChild(switchSlider);

// Agregar contenido a la interfaz
episodeDiv.appendChild(img);
episodeDiv.appendChild(info);
episodeDiv.appendChild(switchDiv);

// Reproducir video al hacer clic en el episodio
episodeDiv.addEventListener('click', function() {
    // Mostrar el reproductor
    playerContainer.style.display = 'block';

    // Reemplazar el src del reproductor con la URL del episodio seleccionado
    player.src({ src: episode.video_url, type: 'video/mp4' });

    // Reproducir el episodio
    player.play();
});


        playlistContainer.appendChild(episodeDiv);
    });
}

// Cambiar el orden de los episodios
function toggleSortOrder() {
    if (sortOrder === 'newest') {
        sortOrder = 'oldest';
        sortButton.innerHTML = 'Antiguos <i class="fas fa-arrow-down-short-wide"></i>'; // Actualizar texto del botón
    } else {
        sortOrder = 'newest';
        sortButton.innerHTML = 'Nuevos <i class="fas fa-arrow-up-short-wide"></i>'; // Actualizar texto del botón
    }

    // Recargar los episodios con el nuevo orden
    loadEpisodes(currentSeasonIndex);
}

// Abrir ventana flotante
function openFloatingWindow() {
    floatingWindow.classList.add('visible');
    loadSeasons();
}

// Cerrar ventana flotante
function closeFloatingWindow() {
    floatingWindow.classList.remove('visible');
}

// Event listeners
seasonButton.addEventListener('click', openFloatingWindow);
sortButton.addEventListener('click', toggleSortOrder);

// Cargar episodios de la primera temporada por defecto y configurar texto inicial
loadEpisodes(0);
updateSeasonButtonText(playlist.seasons[0].season_title);

// Evento para ocultar el reproductor cuando salga de pantalla completa
document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        // Ocultar el reproductor cuando se sale de pantalla completa
        playerContainer.style.display = 'none';
    }
});