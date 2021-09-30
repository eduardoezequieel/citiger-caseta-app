const API_USUARIOS = '../../app/api/caseta/usuarios.php?action=';
document.addEventListener('DOMContentLoaded', function () {

    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let today = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let day = ('0' + today.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = today.getFullYear() - 18;
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let date = `${year}-${month}-${day}`;
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('txtFechaNacimiento').setAttribute('max', date);
    document.getElementById('txtFechaNacimiento').setAttribute('value', date);
    readRows3(API_USUARIOS);


    fetch(API_USUARIOS + 'readProfile2', {
        method: 'get',
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.

                    previewSavePicture('divFoto', response.dataset.foto, 1);
                    document.getElementById('nombres').textContent = (response.dataset.nombres);
                    document.getElementById('lblNombres').textContent = (response.dataset.nombre);
                    document.getElementById('lblApellidos').textContent = (response.dataset.apellido);
                    document.getElementById('lblDUI').textContent = (response.dataset.dui);
                    document.getElementById('lblGenero').textContent = (response.dataset.genero);
                    document.getElementById('lblTelFijo').textContent = (response.dataset.telefonofijo);
                    document.getElementById('lblTelCelular').textContent = (response.dataset.telefonocelular);
                    document.getElementById('lblFechaNac').textContent = (response.dataset.fechanacimiento);
                    document.getElementById('lblUser').textContent = (response.dataset.username);
                    document.getElementById('lblCorreo').textContent = (response.dataset.correo);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });

    fetch(API_USUARIOS + 'getAuthMode', {
        method: 'get',
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('lblAuth').textContent = response.dataset.autenticacion;
                    document.getElementById('switchValue').value = response.dataset.autenticacion;
                    if (response.dataset.autenticacion == 'Si') {
                        document.getElementById('cbDobleAuth').setAttribute('checked', true);
                    } else {
        
                    }
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });

});

//Al accionar el evento submit del formulario para cambiar contraseña
document.getElementById('password-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch 
    fetch(API_USUARIOS + 'updatePassword', {
        method: 'post',
        body: new FormData(document.getElementById('password-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    closeModal('administrarContrasena');
                    sweetAlert(1, response.message, 'ajustes_cuenta.php');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
})

//Función para mostrar contraseña
function showHidePassword2(checkbox, pass1, pass2, pass3) {
    var check = document.getElementById(checkbox);
    var password1 = document.getElementById(pass1);
    var password2 = document.getElementById(pass2);
    var password3 = document.getElementById(pass3);
    //Verificando el estado del check
    if (check.checked == true) {
        password1.type = 'text';
        password2.type = 'text';
        password3.type = 'text';
    } else {
        password1.type = 'password';
        password2.type = 'password';
        password3.type = 'password';
    }
}

function readDataOnModal() {
    // Se abre la caja de dialogo (modal) que contiene el formulario para editar perfil, ubicado en el archivo de las

    fetch(API_USUARIOS + 'readProfile2', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
                    document.getElementById('txtApellidos').value = response.dataset.apellido;
                    document.getElementById('txtNombres').value = response.dataset.nombre;
                    document.getElementById('txtTelefonoFijo').value = response.dataset.telefonofijo;
                    document.getElementById('txtTelefonomovil').value = response.dataset.telefonocelular;
                    document.getElementById('cbGenero').value = response.dataset.genero;
                    document.getElementById('txtFechaNacimiento').value = response.dataset.fechanacimiento;
                    document.getElementById('txtDUI').value = response.dataset.dui;
                    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Se cargan los registros de sesiones fallidas
function readFailedSessions(){
    fetch(API_USUARIOS + 'readFailedSessions', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                fillTable(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function fillTable(dataset){
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        if (row.accion == 'Intento Fallido') {
            content += `
            <tr>
                <!-- Fotografia-->
                <th scope="row">
                    <div class="row paddingTh2 ">
                        <div class="col-12">
                            <i class="fas fa-times icono11"></i>
                        </div>
                    </div>
                </th>
            `
        } else if(row.accion == 'Bloqueo'){
            content += `
            <tr>
                <!-- Fotografia-->
                <th scope="row">
                    <div class="row paddingTh2 ">
                        <div class="col-12">
                            <i class="fas fa-ban icono22"></i>
                        </div>
                    </div>
                </th>
            `   
        }
        content += `
            <!-- Datos-->
            <td>${row.fecha}</td>
            <td>${row.hora.substring(0,8)}</td>
            <td>${row.accion}</td>
        </tr>
        `; 
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de editar perfil.
document.getElementById('admin-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    fetch(API_USUARIOS + 'editProfile', {
        method: 'post',
        body: new FormData(document.getElementById('admin-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {

                    // Se muestra un mensaje y se direcciona a la página web de bienvenida para actualizar el nombre del usuario en el menú.
                    sweetAlert(1, response.message, 'ajustes_cuenta.php');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});


//Metodo para usar un boton diferente de examinar
botonExaminar('btnAgregarFoto', 'archivo_usuario');

//Metodo para crear una previsualizacion del archivo a cargar en la base de datos
previewPicture('archivo_usuario', 'divFoto');

function botonExaminar(idBoton, idInputExaminar) {
    document.getElementById(idBoton).addEventListener('click', function (event) {
        //Se evita recargar la pagina
        event.preventDefault();

        //Se hace click al input invisible
        document.getElementById(idInputExaminar).click();
    });
}

function previewPicture(idInputExaminar, idDivFoto) {
    document.getElementById(idInputExaminar).onchange = function (e) {

        //variable creada para obtener la URL del archivo a cargar
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        //Se ejecuta al obtener una URL
        reader.onload = function () {
            //Parte de la pagina web en donde se incrustara la imagen
            let preview = document.getElementById(idDivFoto);

            //Se crea el elemento IMG que contendra la preview
            image = document.createElement('img');

            //Se le asigna la ruta al elemento creado
            image.src = reader.result;

            //Se aplican las respectivas clases para que la preview aparezca estilizada
            image.className = 'fit-images rounded-circle fotoPrimerUso';

            //Se quita lo que este dentro del div (en caso de que exista otra imagen)
            preview.innerHTML = ' ';

            //Se agrega el elemento recien creado
            preview.append(image);
        }
    }
}


document.getElementById('archivo_usuario').addEventListener('change', function () {
    //Presionando el boton invisible
    document.getElementById('btnUpload').click();
})


document.getElementById('img-form').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch(API_USUARIOS + 'updateFoto', {
        method: 'post',
        body: new FormData(document.getElementById('img-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se muestra un mensaje y se direcciona a la página web de bienvenida para actualizar los datos en el menú.
                    window.location.href = 'ajustes_cuenta.php';
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });

});

//Al accionar el evento submit del formulario
document.getElementById('auth-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //fetch
    fetch(API_USUARIOS + 'updateAuthMode', {
        method: 'post',
        body: new FormData(document.getElementById('auth-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    closeModal('administrarAuth');
                    if (document.getElementById('switchValue').value == 'Si') {
                        sweetAlert(1, 'Usted ha activado el factor de autenticación en dos pasos. Notará los cambios la proxima vez que inicié sesión.', 'ajustes_cuenta.php');
                    } else {
                        sweetAlert(1, 'Usted ha desactivado el factor de autenticación en dos pasos. Notará los cambios la proxima vez que inicié sesión.', 'ajustes_cuenta.php');
                    }
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Al mover el switch
function changeInputValue(input){
    //Asignamos el valor al input invisible
    if (document.getElementById(input).value == 'No') {
        document.getElementById(input).value = 'Si';
    } else {
        document.getElementById(input).value = 'No';
    }
}


function readRows3(api) {
    fetch(api + 'readDevices', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                fillTable4(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable4(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <div class="row animate__animated animate__zoomIn mb-4">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <div class="informacionPersonal">
                    <div class="d-flex mt-2">
                        <div class=" ml-4 mr-5 justify-content-end align-items-center d-flex">
                            <i class="fas fa-desktop icono6"></i>
                        </div>
                        <div class="row w-100">
                            <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12">
                                <h1 class="tituloInformacion">Sistema:</h1>
                                <h2 class="informacion">${row.sistema}</h2>

                                <h1 class="tituloInformacion">Localización:</h1>
                                <h2 class="informacion">${row.region}</h2>
                            </div>
                            <div class="col-xl-6 col-md-12 col-sm-12 col-xs-12">
                                <h1 class="tituloInformacion">Fecha:</h1>
                                <h2 class="informacion">${row.fecha.substring(0,10)}</h2>

                                <h1 class="tituloInformacion">Hora:</h1>
                                <h2 class="informacion">${row.fecha.substring(11,16)}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('dispositivo').innerHTML = content;
}

//Al hacer click en el boton que abre el modal para abrir la contraseña
document.getElementById('btnModalContraseña').addEventListener('click',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //Verificamos si el usuario tiene validado su correo
    fetch(API_USUARIOS + 'checkIfEmailIsValidated', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    if (response.dataset.verificado == '0') {
                        sweetAlert(2, 'Usted no ha verificado su correo electrónico.', null);
                    } else {
                        openModal('administrarContrasena')
                    }
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Al hacer click en el boton que abre el modal para abrir la contraseña
document.getElementById('btnModalAdministrarAuth').addEventListener('click',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //Verificamos si el usuario tiene validado su correo
    fetch(API_USUARIOS + 'checkIfEmailIsValidated', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    if (response.dataset.verificado == '0') {
                        sweetAlert(2, 'Usted no ha verificado su correo electrónico.', null);
                    } else {
                        openModal('administrarAuth')
                    }
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Al accionar el formulario email-form
document.getElementById('email-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
     //Verificamos si el usuario tiene validado su correo
     fetch(API_USUARIOS + 'actualizarCorreo', {
        method: 'post',
        body: new FormData(document.getElementById('email-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    closeModal('administrarEmail');
                    sweetAlert(1, response.message, 'dashboard.php');
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Al accionar el formulario username-form
document.getElementById('username-form').addEventListener('submit',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
     //Verificamos si el usuario tiene validado su correo
     fetch(API_USUARIOS + 'updateUser', {
        method: 'post',
        body: new FormData(document.getElementById('username-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    closeModal('administrarUsuario');
                    sweetAlert(1, response.message, 'ajustes_cuenta.php');
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

//Al hacer click en el boton que abre el modal para editar el usuario
document.getElementById('btnAdministrarUsuarioModal').addEventListener('click',function(event){
    //Evitamos recargar la pagina
    event.preventDefault();
    //Verificamos si el usuario tiene validado su correo
    fetch(API_USUARIOS + 'checkIfEmailIsValidated', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    if (response.dataset.verificado == '0') {
                        sweetAlert(2, 'Usted no ha verificado su correo electrónico.', null);
                    } else {
                        openModal('administrarUsuario')
                    }
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});

$(document).ready(function(){
    $("#txtDUI").mask("00000000-0");
    $("#txtTelefonoFijo").mask("0000-0000");
    $("#txtTelefonomovil").mask("0000-0000");
});