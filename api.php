<?php
    include "db.php"; //nos sirve para importar a la conexion de la base de datos
    $action = $_GET['action'] ?? '';

    if($action == 'create')
    {
        $nombre =$_POST['nombre']; //guardamos el nombre que viene del textbox
        $email =$_POST['email']; //guardamos el email que viene del txtbox
        $sql = "INSERT INTO usuarios(nombre, email) VALUES ('$nombre','$email')";
        $conn->query($sql);
        echo "Usuario Agregado";
    }

    if($action == 'read')
    {
        $result = $conn->query("SELECT * FROM usuarios"); //consulta para leer los datos de la tabla usuarios
        $usuarios = []; //Arreglo vacio para almacenar a los usuarios
        while($row = $result->fetch_assoc()) //Recorrido y asignacion de del arreglo a cada fila
        {
            $usuarios[] = $row;
        }
        echo json_encode($usuarios);
    }

    
    if($action == 'update')
    {
        $id = $_POST['id'];
        $nombre= $_POST['nombre'];
        $email = $_POST['email'];
        $sql = "UPDATE usuarios SET nombre = '$nombre', email='$email' WHERE id=$id"; 
        $conn->query($sql);
        echo "Usuario Actualizado";
    }

    //esta accion elimina al usuario de la tabla
    if($action == 'delete')
    {
        $id = $_POST['id'];
        $sql = "DELETE FROM usuarios WHERE id=$id"; 
        $conn->query($sql);
        echo "Usuario Eliminado";
    }
?>