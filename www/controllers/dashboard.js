//Declarando variables de la url
var api_usuarioDash;
var api_visitaDash;
var idDash;
var aliasDash;
var fotoDash;
var tipoDash;
var modoDash;
var correoDash;
var ip;
let params
document.addEventListener('DOMContentLoaded', function () {
    params = new URLSearchParams(location.search)
    // Se obtienen los datos localizados por medio de las variables.
    idDash = params.get('id');
    aliasDash = params.get('alias');
    fotoDash = params.get('foto');
    tipoDash = params.get('tipo');
    modoDash = params.get('modo');
    correoDash = params.get('correo');
    ip = params.get('ip');
    document.getElementById('txtModo').value = modoDash;
    //Imprimiendo el navbar
    isLogged(idDash,aliasDash,fotoDash,tipoDash,modoDash,ip,correoDash);
    //Poniendo mensaje de bienvenida al usuario
    document.getElementById('bienvenida').textContent = `¡Bienvenido ${aliasDash}!`;
    //Verificando si hay algún id
    if (idDash > 0) {
        api_visitaDash = `http://34.125.178.201/app/api/caseta/visitas.php?id=${idDash}&action=`;
        api_usuarioDash = `http://34.125.178.201/app/api/caseta/usuarios.php?id=${idDash}&action=`;
    } else {
        api_visitaDash = 'http://34.125.178.201/app/api/caseta/visitas.php?action=';
        api_usuarioDash = 'http://34.125.178.201/app/api/caseta/usuarios.php?action=';
    }
    //Cargando información de la pagina
    contadorVisitas();
    createSesionHistory();
    checkIfEmailIsValidated();
});

//Se verifica si el usuario ha validado su correo.
function checkIfEmailIsValidated() {
    fetch(api_usuarioDash + 'checkIfEmailIsValidated', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    if (response.dataset.verificado == '0') {
                        
                        document.getElementById('alerta-verificacion').classList.remove('d-none');
                    } else if (response.dataset.verificado == '1') {
                        
                        document.getElementById('alerta-verificacion').remove();
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
}

//Funcion para enviar un correo electrónico con el codigo de verificacion
function sendEmailCode(){
    fetch(api_usuarioDash + `sendEmailCode&correo=${correoDash}`, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    
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
}

//Función para completar el autotab 
function autotab(current, to, prev) {
    if (current.getAttribute &&
        current.value.length == current.getAttribute("maxlength")) {
        to.focus();
    } else {
        prev.focus();
    }
}

//Función para verificar el codigo
document.getElementById('verificarCodigo-form').addEventListener('submit', function (event) {
    //Se evita que se recargue la pagina
    var uno = document.getElementById('1a').value;
    var dos = document.getElementById('2a').value;
    var tres = document.getElementById('3a').value;
    var cuatro = document.getElementById('4a').value;
    var cinco = document.getElementById('5a').value;
    var seis = document.getElementById('6a').value;
    document.getElementById('codigoAuth').value = uno + dos + tres + cuatro + cinco + seis;

    event.preventDefault();
    fetch(api_usuarioDash + 'verifyCodeEmail', {
        method: 'post',
        body: new FormData(document.getElementById('verificarCodigo-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Mostramos mensaje de exito
                    closeModal('verificarCorreo');
                    sweetAlert(1, response.message, `../html/dashboard.html?id=${idDash}&alias=${aliasDash}&foto=${fotoDash}&tipo=${tipoDash}&modo=${modoDash}&ip=${ip}&correo=${correoDash}`);
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

function contadorVisitas(){
    fetch(api_visitaDash + 'contadorVisitas', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    document.getElementById('txtVisitas').textContent = response.dataset.visitas;
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
}

//Función para verificar la visita por medio del dui
document.getElementById('verificarDui-form').addEventListener('submit', function (event) {
    //Evento para evitar que recargue la pagina
    event.preventDefault();
    //Fetch para verificar por el dui
    fetch(api_visitaDash + 'checkVisitDui', {
        method:'post',
        body: new FormData(document.getElementById('verificarDui-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    document.getElementById('txtDui').value= "";
                    document.getElementById('txtDui').className= "form-control cajaTextoFormulario";
                    closeModal('verificarDui');
                    openModal('infoVisita');
                    fillInformation(response.dataset);
                } else {
                    sweetAlert(4, response.exception, null);
                    document.getElementById('txtDui').value= "";
                    document.getElementById('txtDui').className= "form-control cajaTextoFormulario";
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText)
        }
    })
    .catch(error => console.log(error))
})

//Función para verificar la visita por medio de la placa del visitante
document.getElementById('verificarPlaca-form').addEventListener('submit', function (event) {
    //Evento para evitar que recargue la pagina
    event.preventDefault();
    //Fetch para verificar por el dui
    fetch(api_visitaDash + 'checkVisitPlaca', {
        method:'post',
        body: new FormData(document.getElementById('verificarPlaca-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    document.getElementById('txtPlaca').value = "";
                    document.getElementById('txtPlaca').className= "form-control cajaTextoFormulario";
                    closeModal('verificarPlaca');
                    openModal('infoVisita');
                   fillInformation(response.dataset);
                } else {
                    sweetAlert(4, response.exception, null);
                    document.getElementById('txtPlaca').value = "";
                    document.getElementById('txtPlaca').className= "form-control cajaTextoFormulario";
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText)
        }
    })
    .catch(error => console.log(error))
})

//Función para llenar los datos en el modal 
function fillInformation(dataset){
    document.getElementById('txtVisita').value = dataset.idvisita;
    document.getElementById('txtFrecuente').value = dataset.visitarecurrente;
    document.getElementById('lblResidente').textContent = dataset.residente;
    document.getElementById('lblFecha').textContent =dataset.fecha;
    document.getElementById('lblVisitante').textContent = dataset.visitante;
    document.getElementById('lblCasa').textContent =dataset.numerocasa;
    document.getElementById('lblObservacion').textContent =dataset.observacion;
}

//Función para que se confirme la visita
document.getElementById('info-form').addEventListener('submit', function (event) {
    //Evento para evitar que recargue la pagina
    event.preventDefault();
    //Fetch para finalizar la visita
    fetch(api_visitaDash + 'finishVisit', {
        method:'post',
        body: new FormData(document.getElementById('info-form'))
    }).then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica la respuesta de la api
                if (response.status) {
                    sweetAlert(1, response.message, closeModal('infoVisita'));
                    document.getElementById('txtVisita').value = "";
                    document.getElementById('lblResidente').textContent = "";
                    document.getElementById('lblFecha').textContent ="";
                    document.getElementById('lblVisitante').textContent = "";
                    document.getElementById('lblCasa').textContent ="";
                    document.getElementById('lblObservacion').textContent ="";
                    contadorVisitas();
                }  else if (response.error) {
                    sweetAlert(1,response.message,closeModal('infoVisita'))
                } else {
                    sweetAlert(4, response.exception, null);
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText)
        }
    })
    .catch(error => console.log(error))
})



function createSesionHistory(){
    fetch(api_usuarioDash + `createSesionHistory&ip=${params.get('ip')}&region=${params.get('region')}&sistema=${params.get('sistema')}`, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //console.log(response.message);
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
}

//Función para abrir formulario de visitas
function openVisitas(){
    window.location.href = `../html/visitas.html?id=${idDash}&alias=${aliasDash}&foto=${fotoDash}&tipo=${tipoDash}&modo=${modoDash}&ip=${ip}&correo=${correoDash}`;
}

// Apartado para poner las mascaras a los imput de DUI y telefono
$(document).ready(function(){
    $("#txtDui").mask("00000000-0");
});