const YOUTUBE_API_KEY = 'AIzaSyAVOnMucjoSlLVlK8sfGBsIy8LjzjcogN0';
const GOOGLE_SEARCH_API_KEY = 'AIzaSyDbzjXOy4-gHl6uCq96q76udf3ehn6nV8k';
const GOOGLE_SEARCH_ENGINE_ID = 'e76448d8b670b498e';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

// Función mejorada para limpiar consultas
function limpiarConsulta(consulta) {
    return consulta
        .trim()
        .replace(/^¿(Qué|Que|Quién|Quien|Cuál|Cual|Cuándo|Cuando|Dónde|Donde|Por qué|Porque)\s+es\s+/i, '')
        .replace(/^¿/i, '')
        .replace(/¿/g, '')
        .replace(/\?+$/g, '')
        .replace(/\s+/g, ' ')
}

// Función mejorada para obtener información relevante
async function obtenerResumenGoogle(consulta) {
    const consultaLimpia = limpiarConsulta(consulta);
    const url = `${GOOGLE_SEARCH_URL}?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(consultaLimpia)}`;
    
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        
        if (datos.items && datos.items.length > 0) {
            // Buscar el resultado más relevante
            let mejorResultado = null;
            
            for (let item of datos.items) {
                // Verificar que el título y snippet sean relevantes
                const titulo = item.title.toLowerCase();
                const snippet = item.snippet.toLowerCase();
                const palabrasConsulta = consultaLimpia.toLowerCase().split(' ');
                
                // Calcular relevancia
                let relevancia = 0;
                palabrasConsulta.forEach(palabra => {
                    if (titulo.includes(palabra) || snippet.includes(palabra)) {
                        relevancia++;
                    }
                });
                
                // Si tiene al menos 50% de relevancia, usamos este resultado
                if (relevancia >= palabrasConsulta.length * 0.5) {
                    mejorResultado = item;
                    break;
                }
            }
            
            // Si no encontramos resultado relevante, usar el primero pero con advertencia
            if (!mejorResultado) {
                mejorResultado = datos.items[0];
                return `No encontré información específica sobre "${consultaLimpia}". Aquí hay información relacionada:<br><br>
                        <strong>${mejorResultado.title}</strong><br>
                        ${mejorResultado.snippet}<br><br>
                        Fuente: <a href="${mejorResultado.link}" target="_blank">${mejorResultado.displayLink}</a>`;
            }
            
            return `<strong>${mejorResultado.title}</strong><br><br>
                    ${mejorResultado.snippet}<br><br>
                    Fuente: <a id="surces" href="${mejorResultado.link}" target="_blank">${mejorResultado.displayLink}</a>`;
        } else {
            return `No encontré información sobre "${consultaLimpia}". Intenta reformular tu pregunta.`;
        }
    } catch (error) {
        console.error('Error al obtener la información de Google:', error);
        return "Hubo un error al buscar información. Verifica tu conexión o intenta más tarde.";
    }
}

// Función mejorada para detectar intención
function detectarIntencion(mensaje) {
    const mensajeMin = mensaje.toLowerCase();
    
    const palabrasVideo = [
        'video', 'vídeo', 'ver video', 'mirar video', 'youtube', 
        'tutorial', 'cómo hacer', 'cómo se hace', 'demostración',
        'buscar video', 'encontrar video', 'mostrar video', 'ver en video'
    ];
    
    // Verificar si hay palabras de video Y no hay palabras de definición
    const palabrasDefinicion = ['qué es', 'que es', 'definición', 'significa', 'qué son', 'que son'];
    const esVideo = palabrasVideo.some(palabra => mensajeMin.includes(palabra));
    const esDefinicion = palabrasDefinicion.some(palabra => mensajeMin.includes(palabra));
    
    return esVideo && !esDefinicion;
}

// Función mejorada para procesar mensajes
async function procesarMensaje(mensaje) {
    if (detectarIntencion(mensaje)) {
        // Buscar video en YouTube
        let consultaVideo = mensaje
            .replace(/ver video de|mirar video de|buscar video de|video de|vídeo de|en youtube/gi, '')
            .trim();
        
        if (consultaVideo === '') {
            consultaVideo = mensaje;
        }
        
        const resultadoVideo = await buscarVideoYouTube(consultaVideo);
        
        if (resultadoVideo.encontrado) {
            return formatearRespuestaYouTube(resultadoVideo.videos);
        } else {
            return resultadoVideo.mensaje;
        }
    } else {
        // Búsqueda en Google para información general
        return await obtenerResumenGoogle(mensaje);
    }
}

// Tu función buscarVideoYouTube se mantiene igual
async function buscarVideoYouTube(consulta) {
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

function formatearRespuestaYouTube(videos) {
    let html = '<strong>Encontré estos videos:</strong><br><br>';
    
    videos.forEach((video, index) => {
        html += `
            <div class="video-result">
                <a style="color: #000;" href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
                    <img src="${video.thumbnail}" alt="${video.titulo}" style="float:left; margin-right:10px;">
                    <strong style="color: #000;">${video.titulo}</strong><br>
                    <em style="color: #000;">Canal: ${video.canal}</em>
                </a>
                <div style="clear:both; margin-bottom:15px;"></div>
            </div>
        `;
    });
    
    html += '<br><small>Haz clic en cualquier video para verlo en YouTube</small>';
    return html;
}

// Función enviarMensaje mejorada
async function enviarMensaje() {
    const campoEntrada = document.getElementById("entrada-usuario");
    const cajaChat = document.getElementById("caja-chat");
    const mensajeUsuario = campoEntrada.value.trim();
    
    if (mensajeUsuario === "") return;
    
    // Mostrar mensaje del usuario
    cajaChat.innerHTML += `<div class="mensaje-usuario"><strong>Tú:</strong> ${mensajeUsuario}</div>`;
    campoEntrada.value = "";
    cajaChat.scrollTop = cajaChat.scrollHeight;
    
    // Mostrar mensaje de carga
    const mensajeCarga = document.createElement('div');
    mensajeCarga.innerHTML = `<div class="mensaje-asistente"><strong>Asistente:</strong> Buscando información...</div>`;
    cajaChat.appendChild(mensajeCarga);
    cajaChat.scrollTop = cajaChat.scrollHeight;
    
    try {
        const respuestaBot = await procesarMensaje(mensajeUsuario);
        
        // Remover mensaje de carga
        cajaChat.removeChild(mensajeCarga);
        
        // Mostrar respuesta
        cajaChat.innerHTML += `<div class="mensaje-asistente"><strong>Asistente:</strong> ${respuestaBot}</div>`;
    } catch (error) {
        // Remover mensaje de carga
        cajaChat.removeChild(mensajeCarga);
        
        cajaChat.innerHTML += `<div class="mensaje-asistente"><strong>Asistente:</strong> Error al procesar tu solicitud. Intenta de nuevo.</div>`;
        console.error("Error:", error);
    }
    
    cajaChat.scrollTop = cajaChat.scrollHeight;
}

// Permitir enviar con Enter
document.getElementById('entrada-usuario').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});
