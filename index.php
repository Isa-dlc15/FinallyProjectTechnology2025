<?php
session_start();
if (!isset($_SESSION['usuario'])){
    header("Location: index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ventana de inicio</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
</head>
<body>
    <header>
        <img src="img/logo (1).png" alt="logo">
        <h1>TechLearn</h1>
                <div class="ventanas">
            <ul>
                <li><a href="Asistente/index.html">Asistente virtual</a></li>
                <li><a href="Juego de Mecanet/index.html">Juego de mecanet</a></li>
                <li><a href="Recordatorio/index.html">Recordatorios</a></li>
                <li><a href="Técnica Pomodoro/index.html">Técnica de Pomodoro</a></li>
            </ul>
        </div>
        <div class="cerrar-sesion">
            <a href="login.html"><i class="bi bi-person-badge"></i></a>
            <a href="login.html"><h2 style=" margin-right: 50px;">Cerrar sesión</h2></a>
        </div>
    </header>
    <div class="contenido">
        <p>✨ "Cada día es una nueva oportunidad para aprender y crecer. El conocimiento que adquieres hoy será la llave que abrirá las puertas de tu futuro. No tengas miedo de equivocarte, porque de cada error surge un aprendizaje valioso. Recuerda que estudiar no solo te acerca a tus metas académicas, sino también a tus sueños. ¡Aprovecha estas herramientas educativas y conviértete en la mejor versión de ti mismo!" 🚀📚</p>
        <img src="img/descarga (2).jpeg" alt="">
    </div>


    <footer class="parent">
        <div class="div1"><p>Creado por: <strong>Obed Isaías De León Carrillo</strong></p></div>
        <div class="div2">
            <p><b>Contacto:</b><br>
                <b>Número: </b> +502 5224-9118 <br>
                <b>Correo electrónico: </b> deleonisaias13@gmail.com
            </p>
        </div>
    </footer>

</body>
</html>
