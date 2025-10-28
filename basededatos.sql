create database crud_usuarios;

use crud_usuarios;

create table usuarios(
    id int auto_increment primary key,
    nombre varchar(100) not null,
    email varchar(100) not null unique
);

create table usuarios_login(
	id int auto_increment primary key,
    usuario varchar(50)not null unique,
    clave varchar(250) not null
);

 commit;

-------- Insertar
INSERT INTO `crud_usuarios`.`usuarios_login` (`usuario`, `clave`) VALUES ('admin', '12345');
INSERT INTO `crud_usuarios`.`usuarios_login` (`usuario`, `clave`) VALUES ('usuario', '12345');
INSERT INTO `crud_usuarios`.`usuarios_login` (`usuario`, `clave`) VALUES ('nelton', '12345');

-------- instertar con metodo de codificacion de clave MD5 de 32 caracteres
insert into usuarios_login (usuario, clave) values ('admin1', MD5('12345'))
UPDATE `crud_usuarios`.`usuarios_login` SET `clave` = '12345' WHERE (`id` = '4');


-------- insertar a tabla usuarios
INSERT INTO `crud_usuarios`.`usuarios` (`nombre`, `email`) VALUES ('Beder', 'beder@gmail.com');