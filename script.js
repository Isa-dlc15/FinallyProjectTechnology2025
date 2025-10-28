//para cargar la pagina y llamar a la funcion pra cargar todos los usuarios
document.addEventListener("DOMContentLoaded", cargarUsuarios);

///referncias que ejecuta al formulario a traves del id que se le asigno en la pagina index.php
const form = document.getElementById("formulariousuario");

//evento que se ejecuta cunado el usuario envia los datos del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault(); //Evitar que el formulario se recarque la pagina por defecto la cual es el login

  const id = document.getElementById("id").value; //campo oculto
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;

  //si hay un ID se trata de una actualizacion, o de una creacion
  const action = id ? "update" : "create";

  //crea objeto pra enviar los datos al servidor de BD
  const formData = new FormData();
  formData.append("id", id);
  formData.append("nombre", nombre);
  formData.append("email", email);

  //enviamos los datos al API
  fetch("api.php?action=" + action, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text()) ///llamado el mensaje de confirmacion
    .then((data) => {
      alert(data);
      form.reset();
      cargarUsuarios();
    });
});

// Función que carga todos los usuarios desde el servidor
function cargarUsuarios() {
  fetch("api.php?action=read") // Solicita al servidor todos los usuarios
    .then((res) => res.json()) // Espera una respuesta JSON (lista de usuarios)
    .then((data) => {
      let filas = ""; // Variable para acumular el HTML de las filas de la tabla

      // Itera sobre cada usuario y construye una fila HTML
      data.forEach((u) => {
        filas += `
          <tr>
              <td>${u.id}</td>
              <td>${u.nombre}</td>
              <td>${u.email}</td>
              <td>
                  <button onclick="editarUsuario(${u.id}, '${u.nombre}', '${u.email}')">Editar</button>
                  <button onclick="eliminarUsuario(${u.id})">Eliminar</button>
              </td>
          </tr> `;
      });

      // Inserta las filas generadas dentro del <tbody> con ID "listarusuarios"
      document.getElementById("listarusuarios").innerHTML = filas;
    });
}

//funcion que llena el formulario para editar los datos del usuario
function editarUsuario(id, nombre, email) {
  document.getElementById("id").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("email").value = email;
}

//Función eliminar, los usuarios de la tabla
function eliminarUsuario(id) {
  //este if ayuda a preguntarle al usuario si realmente desea eliminar la informacion
  if (confirm("¿Seguro que dea eliminar este usuario?")) {
    const formData = new FormData();
    formData.append("id", id);
    fetch("api.php?action=delete", { method: "POST", body: formData })
      .then((res) => res.text())
      .then((data) => {
        alert(data); //mostrar la respuesta del metodo solicitado
        cargarUsuarios(); //recargar a los usuarios para actulaizar
      });
  }
}

function cerrarsesion() {
  if (confirm("Seguro que desea cerrar sesión")) {
    window.location.href = "auth.php?action=logout";
  }
}
