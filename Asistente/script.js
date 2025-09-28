// Configuración - REEMPLAZA CON TU API KEY
const YOUTUBE_API_KEY = 'AIzaSyAVOnMucjoSlLVlK8sfGBsIy8LjzjcogN0';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const WIKIPEDIA_API_URL = 'https://es.wikipedia.org/api/rest_v1/page/summary/';

async function obtenerResumenWikipedia(consulta) {
    const url = `${WIKIPEDIA_API_URL}${encodeURIComponent(consulta)}`;
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        if (datos.extract) {
            return `${datos.extract} <br><br> Fuente: <a href="${datos.content_urls.desktop.page}" target="_blank">Ver más en Wikipedia</a>`;
        } else {
            return "No encontré información sobre eso.";
        }
    } catch (error) {
        return "Hubo un error al obtener la información de Wikipedia.";
    }
}

async function buscarVideoYouTube(consulta) {
    // Construir la URL correcta para búsqueda de videos
    const url = `${YOUTUBE_SEARCH_URL}?part=snippet&maxResults=3&q=${encodeURIComponent(consulta)}&type=video&key=${YOUTUBE_API_KEY}`;
    
    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        
        if (datos.items && datos.items.length > 0) {
            const videos = datos.items.map(video => {
                return {
                    videoId: video.id.videoId,
                    titulo: video.snippet.title,
                    canal: video.snippet.channelTitle,
                    descripcion: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.default.url
                };
            });
            
            return {
                encontrado: true,
                videos: videos
            };
        } else {
            return { 
                encontrado: false, 
                mensaje: "No encontré videos sobre ese tema. Intenta con otras palabras clave." 
            };
        }
    } catch (error) {
        console.error('Error en búsqueda de YouTube:', error);
        return { 
            encontrado: false, 
            mensaje: "Error al conectar con YouTube. Verifica tu API Key o intenta más tarde." 
        };
    }
}

function detectarIntencion(mensaje) {
    const mensajeMin = mensaje.toLowerCase();
    
    // Palabras clave para detectar búsqueda de videos
    const palabrasVideo = [
        'video', 'vídeo', 'ver video', 'mirar video', 'youtube', 
        'tutorial', 'cómo hacer', 'cómo se hace', 'demostración',
        'buscar video', 'encontrar video', 'mostrar video'
    ];
    
    return palabrasVideo.some(palabra => mensajeMin.includes(palabra));
}

function formatearRespuestaYouTube(videos) {
    let html = '<strong>Encontré estos videos:</strong><br><br>';
    
    videos.forEach((video, index) => {
        html += `
            <div class="video-result">
                <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
                    <img src="${video.thumbnail}" alt="${video.titulo}" style="float:left; margin-right:10px;">
                    <strong>${video.titulo}</strong><br>
                    <em>Canal: ${video.canal}</em>
                </a>
                <div style="clear:both; margin-bottom:15px;"></div>
            </div>
        `;
    });
    
    html += '<br><small>Haz clic en cualquier video para verlo en YouTube</small>';
    return html;
}

async function procesarMensaje(mensaje) {
    if (detectarIntencion(mensaje)) {
        // Buscar video en YouTube
        let consultaVideo = mensaje
            .replace(/ver video de|mirar video de|buscar video de|video de|vídeo de|en youtube/gi, '')
            .trim();
        
        if (consultaVideo === '') {
            consultaVideo = mensaje; // Si al limpiar queda vacío, usa el mensaje original
        }
        
        const resultadoVideo = await buscarVideoYouTube(consultaVideo);
        
        if (resultadoVideo.encontrado) {
            return formatearRespuestaYouTube(resultadoVideo.videos);
        } else {
            return resultadoVideo.mensaje;
        }
    } else {
        // Búsqueda en Wikipedia
        let consultaWiki = mensaje
            .replace("¿Qué significa ", "")
            .replace("¿Quién es ", "")
            .replace("¿Qué es ", "")
            .replace("?", "")
            .trim();
        
        return await obtenerResumenWikipedia(consultaWiki);
    }
}

async function enviarMensaje() {
    const campoEntrada = document.getElementById("entrada-usuario");
    const cajaChat = document.getElementById("caja-chat");
    const mensajeUsuario = campoEntrada.value.trim();
    
    if (mensajeUsuario === "") return;
    
    cajaChat.innerHTML += `<p><strong>Tú:</strong> ${mensajeUsuario}</p>`;
    campoEntrada.value = "";
    
    // Mostrar mensaje de carga
    cajaChat.innerHTML += `<p><strong>Asistente:</strong> Buscando información...</p>`;
    cajaChat.scrollTop = cajaChat.scrollHeight;
    
    setTimeout(async () => {
        // Remover mensaje de carga
        const ultimoMensaje = cajaChat.lastChild;
        if (ultimoMensaje.textContent.includes('Buscando información')) {
            cajaChat.removeChild(ultimoMensaje);
        }
        
        try {
            const respuestaBot = await procesarMensaje(mensajeUsuario);
            cajaChat.innerHTML += `<p><strong>Asistente:</strong> ${respuestaBot}</p>`;
        } catch (error) {
            cajaChat.innerHTML += `<p><strong>Asistente:</strong> Error al procesar tu solicitud. Intenta de nuevo.</p>`;
        }
        
        cajaChat.scrollTop = cajaChat.scrollHeight;
    }, 1000);
}

// Permitir enviar con Enter
document.getElementById('entrada-usuario').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});