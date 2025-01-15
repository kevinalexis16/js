  // Crear secciones dinámicamente
  temporadas.forEach(temporada => {
    const seccion = document.createElement('div');
    seccion.className = 'codigo';
    seccion.id = temporada.id;

    const contenedor = document.createElement('div');
    contenedor.className = 'contenedor';

    temporada.episodios.forEach(ep => {
      const link = document.createElement('a');
      link.href = `${baseLink}${ep.video}&titulo=${encodeURIComponent(ep.titulo)}&poster=${encodeURIComponent(ep.poster)}&temporada=${temporada.id}`;
      link.className = 'recuadro';
      link.innerHTML = `
        <img class="imagen" src="${ep.poster}" onerror="this.onerror=null;this.src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKDDgO2rryw9kgdZiA5OhxXMptjvSpObaQ3dFK376E1TptRyUG_gFYvJ799-Pp1fqnQ-TrvJyNUqLrVN1IYvVrjD1wW6TVWDTHKJR38LJD73dssCwMNtTnVvWNnR7YRsxmmFh5rHkhvnUr5W7GeRuuLKsF0xRk2jUswyuwsQbAExOTD-wEOivyNRkMjY7e/s1080/WhatsApp%20Image%202025-01-09%20at%203.51.09%20AM.jpeg';" alt="Imagen">
        <p class="texto-blancto texto-negritra">${ep.texto}</p>
        <div class="pequeno-recuadro">${ep.numero}</div>
        <div class="visto">
          <input type="checkbox" store="${ep.store}" onclick="stopPropagation(event)">
          <h2><span>NO</span> VISTO</h2>
        </div>
      `;
      link.addEventListener('click', () => {
        localStorage.setItem('ultimaTemporada', temporada.id);
      });
      contenedor.appendChild(link);
    });

    seccion.appendChild(contenedor);
    contenedorPrincipal.appendChild(seccion);
  });

  // Mostrar la última temporada visitada
  function mostrarUltimaTemporada() {
    const ultimaTemporada = localStorage.getItem('ultimaTemporada') || 'codigo1';
    temporadas.forEach(temporada => {
      const seccion = document.getElementById(temporada.id);
      seccion.style.display = temporada.id === ultimaTemporada ? 'block' : 'none';
    });
  }

  // Inicialización
  mostrarUltimaTemporada();
