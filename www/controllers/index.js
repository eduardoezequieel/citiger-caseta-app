//Constante para la ruta API
const API_USUARIO = '../../app/api/caseta/usuarios.php?action=';

//Método para manejador de eventos cuando la pagina haya cargado
document.addEventListener('DOMContentLoaded', function () {
    //Metodo para activar todos los usuarios que ya cumplieron las 24 horas
    checkBlockUsers();
    //Verificando si hay usuarios registrados 
    fetch(API_USUARIO + 'readAll')
        .then(request => {
            //Se verifica si la petición fue correcta
            if (request.ok) {
                request.json().then(response => {
                    //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                    if (!response.status) {
                        sweetAlert(3, response.exception, null);
                    } else {
                        //Verificando si hay una sesión iniciada
                        fetch(API_USUARIO + 'validateSession')
                            .then(request => {
                                //Se verifica si la petición fue correcta
                                if (request.ok) {
                                    request.json().then(response => {
                                        //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                                        if (response.status) {
                                            window.location.href = 'dashboard.php';
                                        } else {
                                        }
                                    })
                                } else {
                                    console.log(request.status + ' ' + request.statusText);
                                }
                            }).catch(error => console.log(error))
                    }
                })
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        }).catch(error => console.log(error));

        getOS();
        
        document.getElementById('txtLoc').value='No disponible';
        document.getElementById('txtIP').value='No disponible';

})

//Método para iniciar sesion
document.getElementById('login-form').addEventListener('submit', function (event) {
    //Evento para que no recargue la pagina
    event.preventDefault();

    //Verificando las credenciales del usuario
    fetch(API_USUARIO + 'logIn', {
        method: 'post',
        body: new FormData(document.getElementById('login-form'))
    }).then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    if (response.auth) {
                        sendVerificationCodeAuth();
                        openModal('verificarCodigoAuth')
                    } else {
                        sweetAlert(1, response.message, 'dashboard.php');
                    }
                } else {
                    if (response.error) {
                        document.getElementById('txtBitacoraPassword').value = response.dataset.idbitacora;
                        openModal('obligatorioContrasena');
                    } else {
                        sweetAlert(2, response.exception, clearPassword('txtContrasenia'));
                    }
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
});

//Enviar código de verificación
function sendVerificationCodeAuth(){
    fetch(API_USUARIO + 'sendVerificationCode')
        .then(request => {
            //Se verifica si la petición fue correcta
            if (request.ok) {
                request.json().then(response => {
                    //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                    if (response.status) {
                        console.log('Correo enviado.');
                    } else {
                        //Verificando si hay una sesión iniciada
                        console.log(response.exception);
                    }
                })
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        }).catch(error => console.log(error));
}

//Función para verificar el codigo
document.getElementById('checkCodeAuth-form').addEventListener('submit', function (event) {
    //Se evita que se recargue la pagina
    var uno = document.getElementById('1a').value;
    var dos = document.getElementById('2a').value;
    var tres = document.getElementById('3a').value;
    var cuatro = document.getElementById('4a').value;
    var cinco = document.getElementById('5a').value;
    var seis = document.getElementById('6a').value;
    document.getElementById('codigoAuth').value = uno + dos + tres + cuatro + cinco + seis;
    console.log(document.getElementById('codigoAuth').value);

    event.preventDefault();
    fetch(API_USUARIO + 'verifyCodeAuth', {
        method: 'post',
        body: new FormData(document.getElementById('checkCodeAuth-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Mostramos mensaje de exito
                    closeModal('verificarCodigoAuth');
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

function checkBlockUsers() {
    //Verificando si hay usuarios bloqueados que ya cumplieron su penalización
    fetch(API_USUARIO + 'checkBlockUsers').then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    response.dataset.map(function (row) {
                        document.getElementById('txtId').value = row.idusuario;
                        document.getElementById('txtBitacora').value = row.idbitacora;
                        //Activando los usuarios que ya cumplieron con su penalización
                        fetch(API_USUARIO + 'activateBlockUsers', {
                            method: 'post',
                            body: new FormData(document.getElementById('login-form'))
                        }).then(request => {
                            //Verificando si la petición fue correcta
                            if (request.ok) {
                                request.json().then(response => {
                                    //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                                    if (response.status) {
                                    }
                                })
                            } else {
                                console.log(request.status + ' ' + request.statusText);
                            }
                        }).catch(error => console.log(error));
                    })
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
}

//Actualizando contraseña por obligación después de 90 días
document.getElementById('90password-form').addEventListener('submit', function (event) {
    event.preventDefault();
    //Verificando las credenciales del usuario
    fetch(API_USUARIO + 'changePassword', {
        method: 'post',
        body: new FormData(document.getElementById('90password-form'))
    }).then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    sweetAlert(1, response.message, 'dashboard.php');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
})

//Función para mostrar o ocultar contraseñas
function showHidePassword3(checkbox, pass1, pass2, pass3) {
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



//Función para enviar el email
document.getElementById('checkMail-form').addEventListener('submit', function (event) {
    //Se evita que se recargue la pagina
    const boton = document.getElementById('btnVerificar');
    boton.disabled = true;

    event.preventDefault();
    fetch(API_USUARIO + 'sendMail', {
        method: 'post',
        body: new FormData(document.getElementById('checkMail-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                document.getElementById('txtCorreoRecu').disabled = true;

                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {

                    closeModal('recuperarContraseña');
                    openModal('verificarCodigoRecuperacion');
                    const boton = document.getElementById('btnVerificar');
                    boton.disabled = false;
                    document.getElementById('txtCorreoRecu').disabled = false;





                } else {
                    sweetAlert(4, response.exception, null);
                    const boton = document.getElementById('btnVerificar');
                    boton.disabled = false;
                    document.getElementById('txtCorreoRecu').disabled = false;


                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
});


//Función para enviar el email
document.getElementById('checkCode-form').addEventListener('submit', function (event) {
    //Se evita que se recargue la pagina
    var uno = document.getElementById('1').value;
    var dos = document.getElementById('2').value;
    var tres = document.getElementById('3').value;
    var cuatro = document.getElementById('4').value;
    var cinco = document.getElementById('5').value;
    var seis = document.getElementById('6').value;
    document.getElementById('codigo').value = uno + dos + tres + cuatro + cinco + seis;

    event.preventDefault();
    fetch(API_USUARIO + 'verifyCode', {
        method: 'post',
        body: new FormData(document.getElementById('checkCode-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Mostramos mensaje de exito

                    closeModal('verificarCodigoRecuperacion');
                    openModal('cambiarContraseña');



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

//Función para mostrar o ocultar contraseñas
function showHidePassword2(checkbox, pass1, pass2) {
    var check = document.getElementById(checkbox);
    var password1 = document.getElementById(pass1);
    var password2 = document.getElementById(pass2);
    //Verificando el estado del check
    if (check.checked == true) {
        password1.type = 'text';
        password2.type = 'text';
    } else {
        password1.type = 'password';
        password2.type = 'password';
    }
}

//Función para cambiar clave
document.getElementById('update-form').addEventListener('submit', function (event) {
    //Se evita que se recargue la pagina
    event.preventDefault();
    if (document.getElementById("txtContrasenia1").value == '') {
        sweetAlert(3, 'Ingrese su nueva contraseña', null);
    } else {
        // Validamos que el campo de clave no este vacio
        if (document.getElementById("txtContrasenia2").value == '') {
            sweetAlert(3, 'Ingrese la confirmación de la contraseña', null);
        } else {
            if (document.getElementById("txtContrasenia1").value != document.getElementById("txtContrasenia2").value) {
                sweetAlert(3, 'Las claves ingresadas deben ser iguales', null);
            } else {
                // Realizamos peticion a la API de clientes con el caso changePass y method post para dar acceso al valor de los campos del form
                fetch(API_USUARIO + 'changePass', {
                    method: 'post',
                    body: new FormData(document.getElementById('update-form'))
                }).then(function (request) {
                    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                    if (request.ok) {
                        request.json().then(function (response) {
                            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                            if (response.status) {
                                // En caso de iniciar sesion correctamente mostrar mensaje y redirigir al menu
                                closeModal('cambiarContraseña');
                                sweetAlert(1, response.message, null);


                            } else {
                                sweetAlert(3, response.exception, null);
                            }
                        });
                    } else {
                        console.log(request.status + ' ' + request.statusText);
                    }
                }).catch(function (error) {
                    console.log(error);
                });

            }

        }
    }
});

function autotab(current, to, prev) {
    if (current.getAttribute &&
        current.value.length == current.getAttribute("maxlength")) {
        to.focus()

    } else {
        prev.focus()


    }


}


function getOS()
{
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    console.log(OSName);
    document.getElementById('txtOS').value=OSName;


    
    fetch("https://ipinfo.io/json?token=ad64e8ae6d2ca9").then(
        (response) => response.json()
      ).then(
        (jsonResponse) =>
        (document.getElementById('txtLoc').value=jsonResponse.region,
        document.getElementById('txtIP').value=jsonResponse.ip)
        
      )

}