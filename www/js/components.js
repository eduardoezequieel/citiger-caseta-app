/*
*   Este archivo es de uso general en todas las páginas web. Se importa en las plantillas del pie del documento.
*/

/*
*   Función para obtener todos los registros disponibles en los mantenimientos de tablas (operación read).
*
*   Parámetros: api (ruta del servidor para obtener los datos).
*
*   Retorno: ninguno.
*/
//Constante para la ruta API
const API_USUARIO2 = '../../app/api/dashboard/usuarios.php?action=';
const API_RESIDENTES = '../../app/api/residente/index.php?action=';


document.addEventListener('DOMContentLoaded',function(){
    loadPage();
})

function loadPage(){
    var modo = document.getElementById('txtModo').value;
    if (modo == 'light') {
        //Modo claro
        //Se cambian los colores de las variables declaradas en el archivo estilos.css
        document.documentElement.style.setProperty('--color-fondo', '#ffffff');
        document.documentElement.style.setProperty('--color-fondo-opaco', '#F1F4F9');
        document.documentElement.style.setProperty('--color-tipografia-titulos', '#1C1C1C');
        document.documentElement.style.setProperty('--color-tipografia', '#1C1C1C');
        document.documentElement.style.setProperty('--bordes-inputs', '#999999');
        document.documentElement.style.setProperty('--color-citiger', '#5496F5');
        document.documentElement.style.setProperty('--color-citiger-hover', '#4174c2');
        document.documentElement.style.setProperty('--color-rojo', 'rgb(255, 207, 207)');
        document.documentElement.style.setProperty('--color-rojo-hover', 'rgb(255, 72, 72)');
        document.documentElement.style.setProperty('--color-verde', 'rgb(213, 255, 228)');
        document.documentElement.style.setProperty('--color-verde-hover', 'rgb(63, 209, 63)');
        document.documentElement.style.setProperty('--color-amarillo', 'rgb(255, 246, 186)');
        document.documentElement.style.setProperty('--color-amarillo-hover', 'rgb(112, 98, 2)');
        document.documentElement.style.setProperty('--color-citiger-claro', '#c5dcff');

        //Se cambia la imagen del boton de inicio para que coincida con el modo
        document.getElementById('imgDashboard').src = '../../resources/img/CitigerWhiteLogo2.png';
        document.getElementById('imgDashboard2').src = '../../resources/img/CitigerWhiteLogo2.png';

        //Se ocultan/muestran los botones indicados para cambiar de modo posteriormente
        document.getElementById('lightMode').className = 'd-none';
        document.getElementById('darkMode').className = 'btn fas fa-moon botonesPerfil';

        document.getElementById('lightMode2').className = 'd-none';
        document.getElementById('darkMode2').className = 'btn fas fa-moon botonesPerfil';
      
    } else if (modo == 'dark') {
        //Modo oscuro
        //Se cambian los colores de las variables declaradas en el archivo estilos.css
        document.documentElement.style.setProperty('--color-fondo', '#090909');
        document.documentElement.style.setProperty('--color-fondo-opaco', '#121212');
        document.documentElement.style.setProperty('--color-tipografia-titulos', '#e6e6e6');
        document.documentElement.style.setProperty('--color-tipografia', '#ffffff');
        document.documentElement.style.setProperty('--bordes-inputs', '#3f3f3f');
        document.documentElement.style.setProperty('--color-citiger', '#5496F5');   
        document.documentElement.style.setProperty('--color-citiger-hover', '#4174c2');
        document.documentElement.style.setProperty('--color-rojo', 'rgb(46, 10, 10)');
        document.documentElement.style.setProperty('--color-rojo-hover', 'rgb(255, 72, 72)');
        document.documentElement.style.setProperty('--color-verde', 'rgb(14, 61, 14)');
        document.documentElement.style.setProperty('--color-verde-hover', 'rgb(63, 209, 63)');
        document.documentElement.style.setProperty('--color-amarillo', 'rgb(41, 36, 3)');
        document.documentElement.style.setProperty('--color-amarillo-hover', 'rgb(255, 221, 0)');
        document.documentElement.style.setProperty('--color-citiger-claro', '#0b1d35');

        //Se cambia la imagen del boton de inicio para que coincida con el modo
        document.getElementById('imgDashboard').src = '../../resources/img/citigerDarkLogo2.png';
        document.getElementById('imgDashboard2').src = '../../resources/img/citigerDarkLogo2.png';

        document.getElementById('lightMode').className = 'btn fas fa-sun botonesPerfil';
        document.getElementById('darkMode').className = 'd-none';

        document.getElementById('lightMode2').className = 'btn fas fa-sun botonesPerfil';
        document.getElementById('darkMode2').className = 'd-none';
    } else {
        console.log('error');
    }
};

function lightMode(){
    //Modo claro
    setLightValue();
    sweetAlert(1, 'Modo claro activado correctamente.','dashboard.php');
}

function darkMode(){
    //Modo oscuro
    setDarkValue();
    sweetAlert(1, 'Modo oscuro activado correctamente.','dashboard.php');
}

function setDarkValue(){ 
    fetch(API_USUARIO2 + 'setDarkMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    console.log('modo oscuro');
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

function setLightValue(){ 
    fetch(API_USUARIO2 + 'setLightMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    console.log('modo claro');
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}


//Funciones para cambiar entre modo oscuro y claro en los residentes
function lightMode2(){
    //Modo claro
    setLightValue2();
    sweetAlert(1, 'Modo claro activado correctamente.', 'dashboard.php');
}

function darkMode2(){
    //Modo oscuro
    setDarkValue2();
    sweetAlert(1, 'Modo oscuro activado correctamente.', 'dashboard.php');
}

function setDarkValue2(){ 
    fetch(API_RESIDENTES + 'setDarkMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

function setLightValue2(){ 
    fetch(API_RESIDENTES + 'setLightMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

//Funciones para cambiar entre modo oscuro y claro en los residentes
function lightMode3(){
    //Modo claro
    setLightValue3();
    sweetAlert(1, 'Modo claro activado correctamente.', 'dashboard.php');
}

function darkMode3(){
    //Modo oscuro
    setDarkValue3();
    sweetAlert(1, 'Modo oscuro activado correctamente.', 'dashboard.php');
}

function setDarkValue3(){ 
    fetch('../../app/api/caseta/usuarios.php?action=setDarkMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    console.log('modo oscuro');
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

function setLightValue3(){ 
    fetch('../../app/api/caseta/usuarios.php?action=setLightMode')
    .then(request => {
        //Se verifica si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Se verifica si la respuesta no es correcta para redireccionar al primer uso
                if (response.status) {
                    console.log('modo claro');
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error))
}

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
            image.className = 'rounded-circle fotografiaPerfil';
            //Se quita lo que este dentro del div (en caso de que exista otra imagen)
            preview.innerHTML = ' ';
            //Se agrega el elemento recien creado
            preview.append(image);
        }
    }
}

function previewSavePicture(idDivFoto, name, foto) {
    let ruta;
    switch (foto) {
        case 1:
            ruta = '../../resources/img/dashboard_img/usuarios_fotos/';
            break;
        case 2:
            ruta = '../../resources/img/dashboard_img/empleados_fotos/'
            break;
        case 3:
            ruta = '../../resources/img/dashboard_img/residentes_fotos/';
            break;
        case 4:
            ruta = '../../resources/img/dashboard_img/materiales_fotos/';
            break;
        case 5:
                ruta = '../../resources/img/dashboard_img/espacios_fotos/';
                break;
        default:
            break;
    }
    if (foto == 0) {
        //Parte de la pagina web en donde se incrustara la imagen
        let preview = document.getElementById(idDivFoto);

        image = document.createElement('img');

        image.style.width = '130px';

        image.style.height = '130px';

        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'fit-images rounded-circle';

        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';

        //Se agrega el elemento recien creado
        preview.append(image);
    } else {
        //Parte de la pagina web en donde se incrustara la imagen
        let preview = document.getElementById(idDivFoto);

        image = document.createElement('img');

        //Se le asigna la ruta al elemento creado
        image.src = ruta + name;

        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'fit-images rounded-circle fotoPrimerUso';

        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';

        //Se agrega el elemento recien creado
        preview.append(image);
    } if (foto == 4) {

        let preview = document.getElementById(idDivFoto);

        image = document.createElement('img');

        //Se le asigna la ruta al elemento creado
        image.src = ruta + name;

        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'img-fluid fit-images fotoMaterial2';

        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';

        //Se agrega el elemento recien creado
        preview.append(image);
    }

    if (foto == 5) {
        //Parte de la pagina web en donde se incrustara la imagen
        let preview = document.getElementById(idDivFoto);

        image = document.createElement('img');

        //Se le asigna la ruta al elemento creado
        image.src = ruta + name;

        //Se aplican las respectivas clases para que la preview aparezca estilizada
        image.className = 'fit-images fotoEspacioModal';

        //Se quita lo que este dentro del div (en caso de que exista otra imagen)
        preview.innerHTML = ' ';

        //Se agrega el elemento recien creado
        preview.append(image);
    }
}



function restartSearch(btn, api) {
    document.getElementById(btn).addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('search').value = '';
        readRows(api);
    })
}

function readRows2(api) {
    fetch(api + 'readProfile', {
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


function readRows(api) {
    fetch(api + 'readAll', {
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

/*Sidebar responsive*/
$(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });
});

/*
*   Función para obtener los resultados de una búsqueda en los mantenimientos de tablas (operación search).
*
*   Parámetros: api (ruta del servidor para obtener los datos) y form (identificador del formulario de búsqueda).
*
*   Retorno: ninguno.
*/
function searchRows(api, form) {
    fetch(api + 'search', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista.
                    fillTable(response.dataset);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                    console.log("error");
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}



/*
*   Función para crear o actualizar un registro en los mantenimientos de tablas (operación create y update).
*
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
*
*   Retorno: ninguno.
*/
function saveRow(api, action, form, modal) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
                    readRows(api);
                    sweetAlert(1, response.message, closeModal(modal));
                    clearForm(form);
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

//Función para redireccionar según permisos
function checkPermissions(pagina){
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('txtPagina', pagina);
    //Verificando las credenciales del usuario
    fetch('../../app/api/dashboard/usuarios.php?action=checkPermissionsPerPage',{
        method: 'post',
        body: data
    }).then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (!response.status) {
                    window.location.href = '../../resources/error/403.html';
                } else {
                    return true;
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
}

//Función para enseñar graficas y contadores
function showCharts(){
    //Verificando las credenciales del usuario
    fetch('../../app/api/dashboard/usuarios.php?action=checkUserLoggedPermissions').then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    document.getElementById('data-table2').className = 'd-none'
                    document.getElementById('titulo_tabla').className = 'd-none'
                    //Verificando que solo el admin pueda ver la bitacora
                    if(response.tipo == 'Administrador'){
                        //Carga la bitacora de usuarios
                        readRows(API_DASHBOARD);
                        document.getElementById('titulo_tabla').className = 'row my-4'
                        document.getElementById('data-table2').className = 'table table-borderless citigerTable'
                    }
                    document.getElementById('tarjeta_denuncia').className = 'd-none'
                    document.getElementById('tarjeta_visita').className = 'd-none'
                    document.getElementById('tarjeta_aportacion').className = 'd-none'
                    
                    response.dataset.map(function(row){
                        //Verificar los permisos permitidos
                        if(row.permitido == 1) {
                            //Verificar los permisos
                            switch(row.permiso){
                                case 'Alquileres':
                                    graficaAreaEspacios(1);
                                    graficaLineasEspacioUsos(1);
                                    break;
                                case 'Aportaciones':
                                    document.getElementById('tarjeta_aportacion').className = 'col-xl-4 col-md-4 col-sm-12 col-xs-12 margenTarjetas';
                                    graficaPastelAportaciones();
                                    contadorAportacion();
                                    break;
                                case 'Denuncias':
                                    document.getElementById('tarjeta_denuncia').className = 'col-xl-4 col-md-4 col-sm-12 col-xs-12 margenTarjetas';
                                    contadorDenuncias();
                                    graficaPastelDenuncia(1);
                                    break;
                                case 'Materiales':
                                    graficaDonaProductos(1);
                                    graficaLineaHistorialInventario(1);
                                    break;
                                case 'Usuarios':
                                    break;
                                case 'Visitas':
                                    document.getElementById('tarjeta_visita').className = 'col-xl-4 col-md-4 col-sm-12 col-xs-12 margenTarjetas';
                                    graficaLineaVisitas(1);
                                    contadorVisitas();
                                    graficaBarrasResidente(1);
                                    break;
                            }
                        } else {
                            //Verificar los permisos
                            switch(row.permiso){
                                case 'Alquileres':
                                    graficaAreaEspacios(0);
                                    document.getElementById('mensaje2').textContent = 'Información no disponible.';
                                    document.getElementById('graficaEspacioVeces').className = 'd-none';
                                    document.getElementById('noEspacioVeces').className = 'd-flex flex-column justify-content-center align-items-center'; 
                                    break;
                                case 'Aportaciones':
                                    document.getElementById('graficaAportaciones').className = 'd-none';
                                    document.getElementById('noAportaciones').className = 'd-flex flex-column justify-content-center align-items-center';
                                    document.getElementById('mensaje1').textContent = 'Información no disponible.';
                                    break;
                                case 'Denuncias':
                                    graficaPastelDenuncia(0);
                                    break;
                                case 'Materiales':
                                    graficaDonaProductos(0);
                                    document.getElementById('graficaInventario').className = 'd-none';
                                    document.getElementById('noInventario').className = 'd-flex flex-column justify-content-center align-items-center';
                                    document.getElementById('mensaje4').textContent = 'Información no disponible.';
                                    break;
                                case 'Usuarios':
                                    break;
                                case 'Visitas':
                                    graficaLineaVisitas(0);
                                    document.getElementById('graficaResidente').className = 'd-none';
                                    document.getElementById('noVisitasResidente').className = 'd-flex flex-column justify-content-center align-items-center';
                                    document.getElementById('mensaje3').textContent = 'Información no disponible.';
                                    break;
                            }
                        }
                    })
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
}

function saveRowBoolean(api, action, form, modal) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    sweetAlert(1, response.message, null);
                    checkSavePhoto(api, modal);
                   
                    clearForm(form);
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

function checkSavePhoto(api, modal) {
    swal({
        title: 'Información',
        text: '¿Desea agregar imágenes a el registro?',
        icon: 'info',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(api + 'readLast', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            closeModal(modal)
                            document.getElementById('idEspacio1').value = response.id;
                            document.getElementById('adminImagen').click();
                        } else {
                            sweetAlert(2, response.exception, null);
                            console.log(response.status + ' ' + response.statusText);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            }).catch(function (error) {
                console.log(error);
            });
        } else {
            closeModal(modal);
            // Se cargan nuevamente las filas en la tabla de la vista después de agregar o modificar un registro.
            readRows(api);
        }
    });
}

function savePhoto(api,action, form) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro.
                    readRows(api);
                    sweetAlert(1, response.message, null);
                    previewSavePicture('divFotografia', 'default.png', 5);
                } else {
                    sweetAlert(2, response.exception, null);
                    console.log(response.status + ' ' + response.statusText);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function readRowsImage(api,form) {
    fetch(api + 'readImageSpace', {
        method: 'post',
        body: new FormData(document.getElementById(form))
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
                fillTableImage(data);
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

/*
*   Función para eliminar un registro seleccionado en los mantenimientos de tablas (operación delete). Requiere el archivo sweetalert.min.js para funcionar.
*
*   Parámetros: api (ruta del servidor para enviar los datos) y data (objeto con los datos del registro a eliminar).
*
*   Retorno: ninguno.
*/
function confirmDelete(api, data) {
    swal({
        title: 'Advertencia',
        text: '¿Desea eliminar el registro?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(api + 'delete', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro.
                            readRows(api);
                            sweetAlert(1, response.message, null);
                        } else {
                            sweetAlert(2, response.exception, null);
                            console.log(response.status + ' ' + response.statusText);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
}

/*
*   Función para manejar los mensajes de notificación al usuario. Requiere el archivo sweetalert.min.js para funcionar.
*
*   Parámetros: type (tipo de mensaje), text (texto a mostrar) y url (ubicación a direccionar al cerrar el mensaje).
*
*   Retorno: ninguno.
*/

function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    // Si existe una ruta definida, se muestra el mensaje y se direcciona a dicha ubicación, de lo contrario solo se muestra el mensaje.
    if (url) {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        }).then(function () {
            location.href = url
        });
    } else {
        swal({
            title: title,
            text: text,
            icon: icon,
            button: 'Aceptar',
            closeOnClickOutside: false,
            closeOnEsc: false
        });
    }
}

/*
*   Función para cargar las opciones en un select de formulario.
*
*   Parámetros: endpoint (ruta del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado).
*
*   Retorno: ninguno.
*/
function fillSelect(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content += '<option disabled selected>Seleccionar...</option>';
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += '<option>Sin opciones.</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

function fillSelect2(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content += '<option disabled selected>Seleccionar...</option>';
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[0];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += '<option>Sin opciones.</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        console.log(error);
    });
}

//Función para abrir cualquier modal
function openModal(form) {
    $(document.getElementById(form)).modal('show');
}

//Función para cerrar cualquier modal
function closeModal(form) {
    $(document.getElementById(form)).modal('hide');
}

//Función para limpiar los campos del formulario
function clearForm(form) {
    document.getElementById(form).reset();
    var formulario = document.getElementById(form);
    for (let field of formulario) {
        field.classList.remove("error");
        field.classList.remove("success");
    }
}

//Función para resetear botones
function resetButtons(buttons, inicio){
    for (let i = inicio; i < buttons.length; i++) {
        if (i != inicio) {
            buttons[i].className = 'd-none';
        } else {
            buttons[i].className = 'btn btnAgregarFormulario mr-2';
        }
    }
}

//Función para resetear botones
function resetButtonsSpace(buttons, inicio,inicio2){
    document.getElementById('')
}

/*
*   Función para suspender un registro en los mantenimientos de tablas (operación update).
*
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
*
*   Retorno: ninguno.
*/
function suspendRow(api, form, modal) {
    swal({
        title: 'Advertencia',
        text: '¿Desea suspender el registro?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(value => {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(api + 'suspendRow', {
                method: 'post',
                body: new FormData(document.getElementById(form))
            }).then(request => {
                //Se la verifica si la petición fue correcta de lo contrario muestra un mensaje de error en consola
                if (request.ok) {
                    request.json().then(response => {
                        //Se verifica si la respuesta fue satisfactoria, de lo contrario se muestra la excepción
                        if (response.status) {
                            readRows(api);
                            sweetAlert(1, response.message, closeModal(modal));
                            clearForm(form);
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    })
                } else {
                    console.log(response.status + ' ' + response.exception);
                }
            }).catch(error => console.log(error));
        }
    });
}

/*
*   Función para activar un registro en los mantenimientos de tablas (operación update).
*
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
*
*   Retorno: ninguno.
*/
function activateRow(api, form, modal) {
    swal({
        title: 'Advertencia',
        text: '¿Desea activar el registro?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(value => {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value) {
            fetch(api + 'activateRow', {
                method: 'post',
                body: new FormData(document.getElementById(form))
            }).then(request => {
                //Se la verifica si la petición fue correcta de lo contrario muestra un mensaje de error en consola
                if (request.ok) {
                    request.json().then(response => {
                        //Se verifica si la respuesta fue satisfactoria, de lo contrario se muestra la excepción
                        if (response.status) {
                            readRows(api);
                            sweetAlert(1, response.message, closeModal(modal));
                            clearForm(form);
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    })
                } else {
                    console.log(response.status + ' ' + response.exception);
                }
            }).catch(error => console.log(error));
        }
    });
}

/*
*   Función para filtrar los registros por su estado (select).
*
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y action (acción que se va a ejecutar).
*
*   Retorno: ninguno.
*/
function filter(api, action, form) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(request => {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(response => {
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

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOut() {
    swal({
        title: 'Advertencia',
        text: '¿Quiere cerrar la sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch('../../app/api/dashboard/usuarios.php?action=logOut', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.php');
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
    });
}

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión del residente.
function logOut2() {
    swal({
        title: 'Advertencia',
        text: '¿Quiere cerrar la sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch('../../app/api/residente/index.php?action=logOut', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.php');
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
    });
}

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión del residente.
function logOut3() {
    swal({
        title: 'Advertencia',
        text: '¿Quiere cerrar la sesión?',
        icon: 'warning',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para hacer la petición de cerrar sesión, de lo contrario se muestra un mensaje.
        if (value) {
            fetch('../../app/api/caseta/usuarios.php?action=logOut', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'index.php');
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
    });
}

function checkInputLetras(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");

        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }

}

function checkContrasena(i){
    document.getElementById(i).classList.remove("success");
    document.getElementById(i).classList.add("error");
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

    if (document.getElementById(i).value.match(regex)) {
        document.getElementById(i).classList.remove("error");
        document.getElementById(i).classList.add("success");
    } else {
        document.getElementById(i).classList.remove("sucess");
        document.getElementById(i).classList.add("error");
    }
}

function checkCorreo(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");
        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }
}

//Función para mostrar contraseña
function showHidePassword(checkbox, pass) {
    var check = document.getElementById(checkbox);
    var password = document.getElementById(pass);
    //Verificando el estado del check
    if (check.checked == true) {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
}


function checkInput(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");
    }

}

//Método para verificar telefono
function checkTelefono(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/[0-9-]+$/i.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");
        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }

}

function checkAlfanumerico(i){
    document.getElementById(i).classList.remove("success");
    document.getElementById(i).classList.add("error");
    var regex = /^[a-z0-9.]+$/i;

    if (document.getElementById(i).value.match(regex)) {
        document.getElementById(i).classList.remove("error");
        document.getElementById(i).classList.add("success");
    } else {
        document.getElementById(i).classList.remove("sucess");
        document.getElementById(i).classList.add("error");
    }
}

//Método para verificar el dui
function checkDui(input) {
    var field = document.getElementById(input);
    if (field.value.trim() === "") {
        field.classList.remove("success");
        field.classList.add("error");
    } else {
        field.classList.remove("error");
        field.classList.add("success");

        if (/(^\d{8})-(\d$)/.test(field.value)) {
            field.classList.remove("error");
            field.classList.add("success");
        } else {
            field.classList.remove("success");
            field.classList.add("error");
        }
    }
}

//Función para limpiar contraseña
function clearPassword(clave) {
    var contra = document.getElementById(clave);
    contra.value = '';
    contra.classList.remove("error");
    contra.classList.remove("success");
}

function readRows2(api, form) {
    fetch(api + 'readAllParam', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        if (request.ok) {
            request.json().then(function (response) {
                if (response.status) {
                    fillTableParam(response.dataset);
                } else {
                    DeleteTable();
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

//Funcion para generar numeros aleatorios
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // Mientras queden elementos a mezclar...
    while (0 !== currentIndex) {
  
      // Seleccionar un elemento sin mezclar...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // E intercambiarlo con el elemento actual
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

//Arreglos globales para colores de graficas en base a la paleta de colores del sistema
var coloresDefaultLight = ['rgb(84, 148, 245)',
                            'rgb(117, 172, 255)', 
                            'rgb(143, 187, 255)', 
                            'rgb(36, 123, 255)', 
                            'rgb(146, 183, 240)',
                            'rgb(107, 135, 179)'];

var coloresDefaultDark = ['rgb(84, 148, 245)',
                            'rgb(56, 123, 224)',
                            'rgb(79, 123, 189)',
                            'rgb(8, 82, 194)',
                            'rgb(17, 68, 145)', 
                            'rgb(189, 215, 255)'];

var posiciones = [0,1,2,3,4,5];
//Metodos para graficas

/*
*   Función para generar una gráfica de lineas. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: 
    id (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), Variable (Para indicar que se esta evaluando), 
    mensaje (El mensaje que se antepone en el tooltip) y titulo (titulo de la gráfica).
*
*   Retorno: ninguno.
*/
function lineGraph(id, xAxis, yAxis, variable, mensaje, titulo, colorFuente){
    //Revolvemos los datos del arreglo posiciones
    posiciones = shuffle(posiciones);
    //Creamos una arreglo que guardara colores en base al numero de datos enviados.
    var colores = [];
    //Evaluamos el modo del sistema (claro u oscuro) para elegir una paleta de colores para las graficas
    if (colorFuente == 'rgb(0,0,0)') {
        //Modo claro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultLight[posiciones[index]];
        }
    } else if (colorFuente == 'rgb(255,255,255)') {
        //Modo oscuro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultDark[posiciones[index]];
        }
    }
    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        //Se indica el tipo de grafica
        type: 'line',
        //Asignamos la data para la grafica y demás personalización.
        data: data = {
            labels: xAxis,
            datasets: [{
                label: variable,
                data: yAxis,
                fill: false,
                borderColor: colores[0],
                tension: 0
              }]
        },
        //Opciones adicionales
        options:{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colorFuente,
                        padding: 10,
                        font: {
                            family: "'Quicksand', sans-serif",
                            size: 14,
                            weight: 700
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colorFuente,
                        padding: 10,
                        font: {
                            family: "'Quicksand', sans-serif",
                            size: 12,
                            weight: 700
                        }
                    }
                }
            },
            plugins:{
                //Titulo
                title:{
                    display: true,
                    text: titulo,
                    color: colorFuente,
                    font: {
                        family: "'Quicksand', sans-serif",
                        size: 14
                    }
                },
                //Personalizando el tooltip
                tooltip:{
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return mensaje + value;    

                            }
                    }
                },
                //Personalizando la fuente
                legend: {
                    display: false,
                    labels: {
                        color: colorFuente,
                        font: {
                            family: "'Quicksand', sans-serif",
                            weight: 700,
                            size: 14
                        }
                    }
                }
            }
        }
    });
    
}

/*
*   Función para generar una gráfica de pastel. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: 
    id (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), Variable (Para indicar que se esta evaluando), 
    mensaje (El mensaje que se antepone en el tooltip) y titulo (titulo de la gráfica).
*
*   Retorno: ninguno.
*/

function pieGraph(id, xAxis, yAxis, variable, colorFondo, colorFuente){
    //Revolvemos los datos del arreglo posiciones
    posiciones = shuffle(posiciones);
    //Creamos una arreglo que guardara colores en base al numero de datos enviados.
    var colores = [];
    //Evaluamos el modo del sistema (claro u oscuro) para elegir una paleta de colores para las graficas
    if (colorFuente == 'rgb(0,0,0)') {
        //Modo claro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultLight[posiciones[index]];
        }
    } else if (colorFuente == 'rgb(255,255,255)') {
        //Modo oscuro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultDark[posiciones[index]];
        }
    }
    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        //Se indica el tipo de grafica
        type: 'pie',
        //Asignamos la data para la grafica y demás personalización.
        data: data = {
            labels: xAxis,
            datasets: [{
                data: yAxis,
                backgroundColor: colores,
                borderColor: colorFondo,
                borderWidth: 5,
                hoverOffset: 4
              }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: variable,
                    color: colorFuente,
                        font: {
                            family: "'Quicksand', sans-serif",
                            weight: 700,
                            size: 14
                        }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem){
                            var label = myChart.data.labels[tooltipItem.dataIndex];
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return label+ ': ' + value + '%'; 
                        }
                    }
                },
                //Personalizando la fuente
                legend: {
                    display: false,
                    labels: {
                        
                    }
                }
            }
        }
        
    });
}

/*
*   Función para generar una gráfica de dona. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: 
    id (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), Variable (Para indicar que se esta evaluando), 
    mensaje (El mensaje que se antepone en el tooltip) y titulo (titulo de la gráfica).
*
*   Retorno: ninguno.
*/

function doughnutGraph(id, xAxis, yAxis, variable, colorFondo, colorFuente){
    //Revolvemos los datos del arreglo posiciones
    posiciones = shuffle(posiciones);
    //Creamos una arreglo que guardara colores en base al numero de datos enviados.
    var colores = [];
    //Evaluamos el modo del sistema (claro u oscuro) para elegir una paleta de colores para las graficas
    if (colorFuente == 'rgb(0,0,0)') {
        //Modo claro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultLight[posiciones[index]];
        }
    } else if (colorFuente == 'rgb(255,255,255)') {
        //Modo oscuro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultDark[posiciones[index]];
        }
    }
    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        //Se indica el tipo de grafica
        type: 'doughnut',
        //Asignamos la data para la grafica y demás personalización.
        data: data = {
            labels: xAxis,
            datasets: [{
                data: yAxis,
                backgroundColor: colores,
                borderColor: colorFondo,
                borderWidth: 5,
                hoverOffset: 4
              }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: variable,
                    color: colorFuente,
                        font: {
                            family: "'Quicksand', sans-serif",
                            weight: 700,
                            size: 14
                        }
                },
                //Personalizando la fuente
                legend: {
                    display: false,
                    labels: {
                        
                    }
                }
            }
        }
        
    });
}

/*
*   Función para generar una gráfica de area. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: 
    id (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), Variable (Para indicar que se esta evaluando), 
    mensaje (El mensaje que se antepone en el tooltip) y titulo (titulo de la gráfica).
*
*   Retorno: ninguno.
*/

function polarAreaGraph(id, xAxis, yAxis, variable, colorFondo, colorFuente){
    //Revolvemos los datos del arreglo posiciones
    posiciones = shuffle(posiciones);
    //Creamos una arreglo que guardara colores en base al numero de datos enviados.
    var colores = [];
    //Evaluamos el modo del sistema (claro u oscuro) para elegir una paleta de colores para las graficas
    if (colorFuente == 'rgb(0,0,0)') {
        //Modo claro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultLight[posiciones[index]];
        }
    } else if (colorFuente == 'rgb(255,255,255)') {
        //Modo oscuro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultDark[posiciones[index]];
        }
    }
    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        //Se indica el tipo de grafica
        type: 'polarArea',
        //Asignamos la data para la grafica y demás personalización.
        data: data = {
            labels: xAxis,
            datasets: [{
                label: variable,
                data: yAxis,
                backgroundColor: colores,
                borderColor: colorFondo
              }]
        },
        options: {
            scales: {
                r: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: variable,
                    color: colorFuente,
                        font: {
                            family: "'Quicksand', sans-serif",
                            weight: 700,
                            size: 14
                        }
                },
                //Personalizando la fuente
                legend: {
                    display: false,

                }
            }
        }
        
    });
}

/*
*   Función para generar una gráfica de barras. Requiere el archivo chart.js para funcionar.
*
*   Parámetros: 
    id (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), Variable (Para indicar que se esta evaluando), 
    mensaje (El mensaje que se antepone en el tooltip) y titulo (titulo de la gráfica).
*
*   Retorno: ninguno.
*/

function barGraph(id, xAxis, yAxis, titulo, colorFondo, colorFuente, mensaje){
    //Revolvemos los datos del arreglo posiciones
    posiciones = shuffle(posiciones);
    //Creamos una arreglo que guardara colores en base al numero de datos enviados.
    var colores = [];
    //Evaluamos el modo del sistema (claro u oscuro) para elegir una paleta de colores para las graficas
    if (colorFuente == 'rgb(0,0,0)') {
        //Modo claro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultLight[posiciones[index]];
        }
    } else if (colorFuente == 'rgb(255,255,255)') {
        //Modo oscuro
        //Recorremos los valores obtenidos para ingresar colores de forma aleatoria al arreglo
        for (let index = 0; index < yAxis.length; index++) {
            colores[index] = coloresDefaultDark[posiciones[index]];
        }
    }

    //Se obtiene el canvas
    var ctx = document.getElementById(id).getContext('2d');
    //Chart js
    var myChart = new Chart (ctx, {
        //Se indica el tipo de grafica
        type: 'bar',
        //Asignamos la data para la grafica y demás personalización.
        data: data = {
            labels: xAxis,
            datasets: [{
                data: yAxis,
                backgroundColor: colores,
                borderColor: colorFondo,
                borderWidth: 1
              }]
        },
        //Opciones adicionales
        options:{
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colorFuente,
                        padding: 10,
                        font: {
                            family: "'Quicksand', sans-serif",
                            size: 14,
                            weight: 700
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colorFuente,
                        padding: 10,
                        font: {
                            family: "'Quicksand', sans-serif",
                            size: 12,
                            weight: 700
                        }
                    }
                }
            },
            plugins:{
                //Titulo
                title:{
                    display: true,
                    text: titulo,
                    color: colorFuente,
                    font: {
                        family: "'Quicksand', sans-serif",
                        size: 14
                    }
                },
                //Personalizando el tooltip
                tooltip:{
                    displayColors: false,
                    callbacks: {
                        //De tooltipItem obtenemos el index seleccionado al momento de hacer hover para darle formato.
                        label: function(tooltipItem) {
                            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                            return mensaje + value;    

                            }
                    }
                },
                //Personalizando la fuente
                legend: {
                    display: false,
                    labels: {
                        color: colorFuente,
                        font: {
                            family: "'Quicksand', sans-serif",
                            weight: 700,
                            size: 14
                        }
                    }
                }
            }
        }
        
    });

}