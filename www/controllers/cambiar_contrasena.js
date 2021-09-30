//Constante para la ruta API
const API_USUARIO = '../../app/api/caseta/usuarios.php?action=';

//Método para cambiar la contraseña
document.getElementById('primeruso-form').addEventListener('submit', function (event) {
    //Evento para que no recargue la pagina
    event.preventDefault();

    //Verificando las credenciales del usuario
    fetch(API_USUARIO + 'changePassword', {
        method: 'post',
        body: new FormData(document.getElementById('primeruso-form'))
    }).then(request => {
        //Verificando si la petición fue correcta
        if (request.ok) {
            request.json().then(response => {
                //Verificando si la respuesta es satisfactoria de lo contrario se muestra la excepción
                if (response.status) {
                    sweetAlert(1, response.message, 'dashboard.php');
                } else {
                    sweetAlert(2, response.exception, clearPassword('txtContrasena'));
                    clearPassword('txtConfirmarContra')
                }
            })
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
})