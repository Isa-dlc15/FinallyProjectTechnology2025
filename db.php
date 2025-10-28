<?php
    $host = "localhost"; //servidor local
    $user = "desarrollo344"; //Usuario de MySQL
    $pass = "344desarrollo"; //contrasena de usuario de base de datos
    $db = "crud_usuarios"; //nombre de la base de datos

    //creamos la conexion a nuestra base de datos
    $conn = new mysqli($host, $user, $pass, $db);

    if($conn -> connect_error){
        die("Error de conexión: ".$conn->connect_error);
    }else{
        // echo "Conexion exitosa";
        //die("Conexion exitosa");
    }
?>