<?php
session_start(); //funcion predefinidia para iniciar sesion

include "db.php"; //le decimos al sistema que incluya el contenido del archivo de conexion

$action = $_GET['action'] ??'';

///////////////////////////////////////////////////
///////////  LOGIN ///////////////////////////////
////////////////////////////////////////////////
if($action == "login"){
    $usuario = $_POST['usuario'];//capturamos el nombre de usuario
    $clave = $_POST['clave']; // capturamos la contraseña del usuario
    $sql = "SELECT * FROM usuarios_login WHERE usuario='$usuario' and clave='$clave'";
    //la consulta se debe de realizar con letras mayusculas a excepcion de las palabras propias de sql 
    
    //esta es la consulta que realiza la comparacion con la tabla donde se almacenan los datos
    
    $result = $conn->query($sql); //se ejecuta la consulta y se obtienen los datos para almacenar en la variable result que es de tipo arreglo u objeto

    if($result -> num_rows >0){
        $_SESSION['usuario'] = $usuario;
        header("Location: index.html");
        //echo $_SESSION['usuario'];
        //echo "Bienvenidos";
    }
    else 
    {
        echo "Usuario o contraseña incorrectos";
    }
}

//////////////////////////////////////////////////////////
////////////// LOGOUT ///////////////////////////////////
////////////////////////////////////////////////////////
if($action == "logout"){
    session_destroy();
    header("Location: login.html");
}
?>