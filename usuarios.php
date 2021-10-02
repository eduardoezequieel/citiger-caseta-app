<?php
require_once('../../helpers/database.php');
require_once('../../helpers/validator.php');
require_once('../../models/usuarios.php');
require_once('../../helpers/mail.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../../../libraries/phpmailer65/src/Exception.php';
require '../../../libraries/phpmailer65/src/PHPMailer.php';
require '../../../libraries/phpmailer65/src/SMTP.php';

//Creando instancia para mandar correo
$mail = new PHPMailer(true);
header("Access-Control-Allow-Origin: *", false);
//Verificando si existe alguna acción
if (isset($_GET['action'])) {
    //Se crea una sesion o se reanuda la actual
    session_start();
    //Instanciando clases
    $usuarios = new Usuarios;
    $correo = new Correo;

    //Array para respuesta de la API
    $result = array('status' => 0, 
                    'recaptcha' => 0, 
                    'error' => 0,
                    'auth' => 0, 
                    'message' => null, 
                    'exception' => null);
    //Verificando si hay una sesion iniciada
    if (isset($_GET['id'])) {
        //Se compara la acción a realizar cuando la sesion está iniciada
        switch ($_GET['action']) {
            //Caso para verificar si el residente posee su correo electronico verificado.
            case 'checkIfEmailIsValidated':
                if ($usuarios->setId($_GET['id'])) {
                    if ($result['dataset'] = $usuarios->checkIfEmailIsValidated()) {
                        $result['status'] = 1;
                    } else {
                        if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'No sabemos si esta validado o no.';
                        }
                    }
                } else {
                    $result['exception'] = 'Id invalido.';
                }
                break;
            //Enviar código de verificación para verificar correo electronico
            case 'sendEmailCode':
                // Generamos el codigo de seguridad 
                $code = rand(999999, 111111);
                if ($correo->setCorreo($_GET['correo'])) {
                    // Ejecutamos funcion para obtener el usuario del correo ingresado\
                    $correo->obtenerUsuario($_SESSION['correo_caseta']);
                    try {

                        //Ajustes del servidor
                        $mail->SMTPDebug = 0;
                        $mail->isSMTP();
                        $mail->Host       = 'smtp.gmail.com';
                        $mail->SMTPAuth   = true;
                        $mail->Username   = 'citigersystem@gmail.com';
                        $mail->Password   = 'citiger123';
                        $mail->SMTPSecure = 'tls';
                        $mail->Port       = 587;
                        $mail->CharSet    = 'UTF-8';


                        //Receptores
                        $mail->setFrom('citigersystem@gmail.com', 'Citiger Support');
                        $mail->addAddress($correo->getCorreo());

                        //Contenido
                        $mail->isHTML(true);
                        $mail->Subject = 'Código de Verificación';
                        $mail->Body    = 'Hola ' . $_SESSION['usuario'] . ', tu código de seguridad para la verificación de correo electrónico es: <b>' . $code . '</b>';

                        if ($mail->send()) {
                            $result['status'] = 1;
                            $result['message'] = 'Código enviado correctamente, ' . $_SESSION['usuario'] . ' ';
                            $correo->actualizarCodigo('usuario', $code);
                        }
                    } catch (Exception $e) {
                        $result['exception'] = $mail->ErrorInfo;
                    }
                } else {
                    $result['exception'] = 'Correo incorrecto.';
                }
                break;

            //Caso para verificar el código y poder verificar el correo electronico.
            case 'verifyCodeEmail':
                //Seteando la variable de sesión a utilizar
                $_SESSION['idusuario_caseta'] = $_GET['id'];
                $_POST = $usuarios->validateForm($_POST);
                // Validmos el formato del mensaje que se enviara en el correo
                if ($correo->setCodigo($_POST['codigoAuth'])) {
                    // Ejecutamos la funcion para validar el codigo de seguridad
                    if ($correo->validarCodigo('usuario',$_SESSION['idusuario_caseta'])) {
                        $result['status'] = 1;
                        $correo->cleanCode($_SESSION['idusuario_caseta']);
                        $correo->validateUsuario($_SESSION['idusuario_caseta']);
                        // Colocamos el mensaje de exito 
                        $result['message'] = 'Correo verificado correctamente.';
                    } else {
                        // En caso que el correo no se envie mostramos el error
                        $result['exception'] = 'El código ingresado no es correcto.';
                    }
                } else {
                    $result['exception'] = 'Mensaje incorrecto';
                }
                //Destruyendo las variables de usuario
                session_destroy();
                break;
            //Caso para cargar los historiales de sesión fallidos de un usuario
            case 'readFailedSessions':
                if ($usuarios->setId($_GET['id'])) {
                    if ($result['dataset'] = $usuarios->readFailedSessions()) {
                        $result['status'] = 1;
                    } else {
                        if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'No se han encontrado registros de sesiones fallídas.';
                        }
                    }
                } else {
                    $result['exception'] = 'Id invalido.';
                }
                break;
            //Obtener el modo de autenticación de un usuario
            case 'getAuthMode':
                if ($usuarios->setId($_GET['id'])) {
                    if ($result['dataset'] = $usuarios->getAuthMode()) {
                        $result['status'] = 1;
                    } else {
                        if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'Este usuario no tiene ninguna preferencia.';
                        }
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                break;
            //Caso para actualizar la preferencia del modo de autenticacion del usuario
            case 'updateAuthMode':
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->checkPassword($_POST['txtContrasenaActualAuth'])) {
                        if ($_POST['switchValue'] == 'Si' || $_POST['switchValue'] == 'No') {
                            if ($validado = $usuarios->checkIfEmailIsValidated()) {
                                if ($validado['verificado'] == '1') {
                                    if ($usuarios->updateAuthMode($_POST['switchValue'])) {
                                        $result['status'] = 1;
                                        $result['message'] = 'Exito.';
                                    } else {
                                        $result['exception'] = Database::getException();
                                    }
                                } else {
                                    $result['exception'] = 'Usted no ha verificado su correo electrónico, hacker :)';
                                }
                            } else {
                                if (Database::getException()) {
                                    $result['exception'] = Database::getException();
                                } else {
                                    $result['exception'] = 'No sabemos si esta verificado o no.';
                                }
                            }
                        } else {
                            $result['exception'] = 'Valor incorrecto.';
                        }
                    } else {
                        $result['exception'] = 'Contraseña incorrecta.';
                    }
                } else {
                    $result['exception'] = 'Sesión invalida.';
                }
                break;
            //Caso para actualizar el correo electronico actual
            case 'actualizarCorreo':
                $_POST = $usuarios->validateForm($_POST);
                if ($_POST['txtNuevoCorreo'] == $_POST['txtConfirmarCorreo']) {
                    if ($usuarios->setCorreo($_POST['txtNuevoCorreo'])) {
                        if ($usuarios->setId($_GET['id'])) {
                            if ($usuarios->checkPassword($_POST['txtPassword'])) {
                                if ($usuarios->changeEmail()) {
                                    if ($usuarios->emailNotValidated()) {
                                        $result['correo_caseta'] = $usuarios->getCorreo();
                                        $result['status'] = 1;
                                        $result['message'] = 'Correo actualizado correctamente. Por favor asegurate de verificarlo.';
                                    } else {
                                        $result['exception'] = Database::getException();
                                    }
                                } else {
                                    $result['exception'] = Database::getException();
                                }
                            } else {
                                $result['exception'] = 'Contraseña incorrecta.';
                            }
                        } else {
                            $result['exception'] = 'Id incorrecto.';
                        }
                    } else {
                        $result['exception'] = 'Ingrese un correo electrónico valido.';
                    }       
                } else {
                    $result['exception'] = 'Los correos electrónicos no coinciden.';
                }
                break;

            //Caso para actualizar el nombre de usuario
            case 'updateUser':
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->checkPassword($_POST['txtPassword2'])) {
                        if ($usuarios->setUsername($_POST['txtNuevoUsuario'])) {
                            if ($_POST['txtNuevoUsuario'] == $_POST['txtConfirmarUsuario']) {
                                if ($verificacion = $usuarios->checkIfEmailIsValidated()) {
                                    if ($verificacion['verificado'] == '1') {
                                        if ($usuarios->updateUser()) {
                                            $_SESSION['usuario_caseta'] = $usuarios->getUsername();
                                            $result['status'] = 1;
                                            $result['message'] = 'Usuario actualizado correctamente.';
                                        } else {
                                            $result['exception'] = Database::getException();
                                        }
                                    } else {
                                        $result['exception'] = 'Usted no ha verificado su correo, hacker :)';
                                    }
                                } else {
                                    if (Database::getException()) {
                                        $result['exception'] = Database::getException();
                                    } else {
                                        $result['exception'] = 'No sabemos si esta verificado o no.';
                                    }
                                }
                            } else {
                                $result['exception'] = 'Los usuarios no coinciden.';
                            }
                        } else {
                            $result['exception'] = 'Ingrese un usuario valido.';
                        }
                    } else {
                        $result['exception'] = 'Contraseña incorrecta.';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                break;
            //Caso para leer todos los datos de la tabla
            case 'readAll':
                if ($result['dataset'] = $usuarios->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Se ha encontrado al menos un usuario';
                } else {
                    if (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No existen usuarios registrados. Ingrese el primer usuario';
                    }
                }
                break;
            //Caso para cerrar la sesión
            case 'logOut':
                unset($_GET['id']);
                $result['status'] = 1;
                $result['message'] = 'Sesión eliminada correctamente';
                break;
            //Redirige al dashboard
            case 'validateSession':
                $result['status'] = 1;
                break;
            case 'setLightMode':
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->setLightMode()) {
                        $result['status'] = 1;
                        $result['message'] = 'Modo claro activado correctamente.';
                        $result['modo_caseta'] = 'light';
                    } else {
                        $result['exception'] = 'Ocurrio un problema-';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                
                break;
            case 'setDarkMode':
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->setDarkMode()) {
                        $result['status'] = 1;
                        $result['message'] = 'Modo oscuro activado correctamente.';
                        $result['modo_caseta'] = 'dark';
                    } else {
                        $result['exception'] = 'Ocurrio un problema-';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                break;
            case 'readProfile2':
                if ($usuarios->setId($_GET['id'])) {
                    if ($result['dataset'] = $usuarios->readProfile2()) {
                        $result['status'] = 1;
                    } else {
                        if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'Usuario inexistente';
                        }
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                
                break;
            case 'editProfile':
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->setDui($_POST['txtDUI'])) {
                    if ($usuarios->setTelefonoFijo($_POST['txtTelefonoFijo'])) {
                        if ($usuarios->setTelefonoCelular($_POST['txtTelefonomovil'])) {
                            if ($usuarios->setNacimiento($_POST['txtFechaNacimiento'])) {
                                if ($usuarios->setNombres($_POST['txtNombres'])) {
                                    if ($usuarios->setApellidos($_POST['txtApellidos'])) {
                                        if (isset($_POST['cbGenero'])) {
                                            if ($usuarios->setGenero($_POST['cbGenero'])) {
                                                if ($usuarios->setId($_GET['id'])) {
                                                    if ($usuarios->updateInfo()) {
                                                        $result['status'] = 1;
                                                        $result['message'] = 'Perfil modificado correctamente';
                                                    } else {
                                                        $result['exception'] = Database::getException();
                                                    }
                                                } else {
                                                    $result['exception'] = 'Id incorrecto.';
                                                }
                                            } else {
                                                $result['exception'] = 'Seleccione una opción';
                                            }
                                        } else {
                                            $result['exception'] = 'Correo incorrecto';
                                        }
                                    } else {
                                        $result['exception'] = 'Apellido invalido';
                                    }
                                } else {
                                    $result['exception'] = 'Nombre invalido';
                                }
                            } else {
                                $result['exception'] = 'Fecha invalida';
                            }
                        } else {
                            $result['exception'] = 'Telefono invalido';
                        }
                    } else {
                        $result['exception'] = 'Telefono invalido';
                    }
                } else {
                    $result['exception'] = 'DUI invalido';
                }
                break;
            case 'updateFoto':
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->setFoto($_FILES['archivo_usuario'])) {
                        if ($data = $usuarios->readProfile2()) {
                            if ($usuarios->updateFoto2($data['foto'])) {
                                $result['status'] = 1;
                                $result['foto'] = $usuarios->getFoto();
                                if ($usuarios->saveFile($_FILES['archivo_usuario'], $usuarios->getRuta(), $usuarios->getFoto())) {
                                    $result['message'] = 'Foto modificada correctamente';
                                } else {
                                    $result['exception'] = 'Foto no actualiza';
                                }
                            } else {
                                $result['exception'] = Database::getException();
                            }
                        } else {
                            $result['exception'] = $usuarios->getImageError();
                        }
                    }else{
                        $result['exception'] = 'Usuario inválido';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                
                break;
            //Caso para actualizar la contraseña (Dentro del sistema)
            case 'updatePassword':
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->setId($_GET['id'])) {
                    if ($usuarios->checkPassword($_POST['txtContrasenaActual'])) {
                        if ($_POST['txtNuevaContrasena'] == $_POST['txtConfirmarContrasena']) {
                            if ($_POST['txtNuevaContrasena'] != $_POST['txtContrasenaActual'] ||
                                $_POST['txtConfirmarContrasena'] != $_POST['txtContrasenaActual']) {
                                if ($usuarios->setContrasenia($_POST['txtNuevaContrasena'])) {
                                    if ($validado = $usuarios->checkIfEmailIsValidated()) {
                                        if ($validado['verificado'] == '1') {
                                            if ($usuarios->changePassword()) {
                                                $result['status'] = 1;
                                                $result['message'] = 'Contraseña actualizada correctamente.';
                                            } else {
                                                $result['exception'] = Database::getException();
                                            }
                                        } else {
                                            $result['exception'] = 'Usted no ha verificado su correo electrónico, hacker :)';
                                        }
                                    } else {
                                        if (Database::getException()) {
                                            $result['exception'] = Database::getException();
                                        } else {
                                            $result['exception'] = 'No sabemos si esta validado o no.';
                                        }
                                    }
                                } else {
                                    $result['exception'] = 'Su contraseña no cumple con los requisitos especificados.';
                                }
                            } else {
                                $result['exception'] = 'Su nueva contraseña no puede ser igual a la actual.';
                            }
                        } else {
                            $result['exception'] = 'Las contraseñas no coinciden.';
                        }
                    } else {
                        $result['exception'] = 'La contraseña ingresada es incorrecta.';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                break;
            //Caso para actualizar la contraseña
            case 'changePassword':
                $_POST = $usuarios->validateForm($_POST);
                if ($_POST['txtContrasena'] == $_POST['txtConfirmarContra']) {
                    if ($_POST['txtContrasena'] != 'newUser') {
                        if ($usuarios->setContrasenia($_POST['txtContrasena'])) {
                            if ($usuarios->changePassword()) {
                                $result['status'] = 1;
                                $result['message'] = 'Se ha actualizado la contraseña correctamente.';
                            } else {
                                if (Database::getException()) {
                                    $result['exception'] = Database::getException();
                                } else {
                                    $result['exception'] = 'No se ha actualizado la contraseña correctamente.';
                                }
                            }
                        } else {
                            $result['exception'] = 'La contraseña no es válida.';
                        }
                    } else {
                        $result['exception'] = 'La contraseña no puede ser igual a la contraseña por defecto.';
                    }
                } else {
                    $result['exception'] = 'Las contraseñas no coinciden.';
                }
                break;
                case 'createSesionHistory':
                    //Seteando la variable de sesión a utilizar
                    $_SESSION['idusuario_caseta'] = $_GET['id'];
                    $_SESSION['ipusuario_caseta'] = $_GET['ip'];
                    if ($usuarios->checkDevices2()) {
                        $result['status'] = 1;
                        $result['message'] = 'Sesión ya registrada en la base de datos.';
                    } else {
                        if ($usuarios->historialUsuario2()) {
                            $result['status'] = 1;
                            $result['message'] = 'Sesión registrada correctamente.';
                        } else {
                            $result['exception'] = Database::getException();
                        }
                    }
                    //Destruyendo variables de sesión
                    session_destroy();
                    break;
                    case 'readDevices':
                        //Seteando la variable de sesión a utilizar
                        $_SESSION['idusuario_caseta'] = $_GET['id'];
                        // Ejecutamos la funcion del modelo
                        if ($result['dataset'] = $usuarios->getSesionHistory2()) {
                            $result['status'] = 1;
                        } else {
                            // Se ejecuta si existe algun error en la base de datos 
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No hay dispositivos registrados';
                            }
                        }
                        //Destruyendo variables de sesión
                        session_destroy();
                        break;
                //Caso de default del switch
            default:
                $result['exception'] = 'La acción no está disponible dentro de la sesión';
        }
    } else {
        //Se compara la acción a realizar cuando la sesion está iniciada
        switch ($_GET['action']) {
                //Caso para leer todos los datos de la tabla
            case 'readAll':
                if ($result['dataset'] = $usuarios->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Se ha encontrado al menos un usuario.';
                } else {
                    if (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No existen usuarios registrados. Ingrese el primer usuario.';
                    }
                }
                break;
            //Caso para iniciar sesion
            case 'logIn':
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->checkUser($_POST['txtCorreo'])) {
                    if ($usuarios->checkUserType(1)) {
                        if ($usuarios->checkEstado()) {
                            if ($usuarios->checkPassword($_POST['txtContrasenia'])) {  
                                $_SESSION['idusuario_caseta'] = $usuarios->getId();
                                $result['idusuario_caseta'] = $usuarios->getId();
                                $result['usuario_caseta'] = $usuarios->getUsername();
                                $result['foto_caseta'] = $usuarios->getFoto();
                                $result['tipousuario_caseta'] = $usuarios->getIdTipoUsuario();
                                $result['modo_caseta'] = $usuarios->getModo();
                                $result['correo_caseta'] = $usuarios->getCorreo();
                                $result['ipusuario_caseta'] = $_POST['txtIP'];
                                $result['regionusuario_caseta'] = $_POST['txtLoc'];
                                $result['sistemausuario_caseta'] = $_POST['txtOS'];
                                //Se reinicia el conteo de intentos fallidos
                                if ($usuarios->increaseIntentos(0)){
                                    if ($result['dataset'] = $usuarios->checkLastPasswordUpdate()) {
                                        $result['error'] = 1;
                                        $result['message'] = 'Se ha detectado que debes actualizar
                                                                tu contraseña por seguridad.';
                                        $result['idusuario_caseta_tmp'] = $_SESSION['idusuario_caseta'];
                                        unset($_SESSION['idusuario_caseta']);
                                    } else {
                                        if ($autenticacion = $usuarios->getAuthMode()) {
                                            if ($autenticacion['autenticacion'] == 'Si') {
                                                $result['auth'] = 1;
                                                $result['status'] = 1;
                                                $_SESSION['idcaseta_temp'] = $usuarios->getId();
                                                unset($_SESSION['idusuario_caseta']);
                                            } else {
                                                $result['status'] = 1;
                                                $result['message'] = 'Sesión iniciada correctamente.';
                                                //Array para guardar los datos del usuario
                                                $sesion_usuario = array('status' => 0, 
                                                'id' => $usuarios->getId(), 
                                                'username' => $usuarios->getUsername(),
                                                'foto' => $usuarios->getFoto(), 
                                                'tipousuario' => $usuarios->getIdTipoUsuario(), 
                                                'modo' => $usuarios->getModo(),
                                                'correo' => $usuarios->getCorreo(),
                                                'ip' => $usuarios->$_POST['txtIP'],
                                                'region' => $usuarios->$_POST['txtLoc'],
                                                'sistema' => $usuarios->$_POST['txtOS']);
                                                $result['dataset'] = $sesion_usuario;
                                                session_destroy();
                                            }
                                            
                                        } else {
                                            if (Database::getException()) {
                                                $result['exception'] = Database::getException();
                                            } else {
                                                $result['exception'] = 'El usuario no posee ninguna preferencia.';
                                            }
                                            
                                        }
                                    }
                                }
                            } else {
                                //Se verifica los intentos que tiene guardado el usuario
                                if ($data = $usuarios->checkIntentos()){
                                    //Se evalúa si ya el usuario ya realizó dos intentos
                                    if ($data['intentos'] < 2) {
                                        //Se aumenta la cantidad de intentos
                                        if ($usuarios->increaseIntentos($data['intentos']+1)) {
                                            $result['exception'] = 'La contraseña ingresada es incorrecta';
                                            $usuarios->registerActionOut('Intento Fallido','Intento Fallido N° '.$data['intentos']+1.);
                                        }
                                    } else {
                                        //Se bloquea el usuario
                                        if ($usuarios->suspend()) {
                                            $result['exception'] = 'Has superado el máximo de intentos, el usuario se ha bloquedo
                                                                    por 24 horas.';
                                            $usuarios->registerActionOut('Bloqueo','Intento N° 3. Usuario bloqueado por intentos fallidos');
                                        }
                                    }
                                }
                            }
                        } else {
                            $result['exception'] = 'El usuario está inactivo. Contacte con el administrador.';
                        }
                    } else {
                        $result['exception'] = 'El usuario no tiene los permisos necesarios para acceder.';
                    }
                } else {
                    $result['exception'] = 'El correo ingresado es incorrecto.';
                }
                session_destroy();
                
                break;
            //Enviar código de verificación
            case 'sendVerificationCode':
                //Seteando la variable de sesión a utilizar
                $_SESSION['correo_caseta'] = $_GET['correo'];
                $_SESSION['usuario'] = $_GET['alias'];
                // Generamos el codigo de seguridad 
                $code = rand(999999, 111111);
                if ($correo->setCorreo($_SESSION['correo_caseta'])) {
                    // Ejecutamos funcion para obtener el usuario del correo ingresado\
                    $correo->obtenerUsuario($_SESSION['correo_caseta']);
                    try {

                        //Ajustes del servidor
                        $mail->SMTPDebug = 0;
                        $mail->isSMTP();
                        $mail->Host       = 'smtp.gmail.com';
                        $mail->SMTPAuth   = true;
                        $mail->Username   = 'citigersystem@gmail.com';
                        $mail->Password   = 'citiger123';
                        $mail->SMTPSecure = 'tls';
                        $mail->Port       = 587;
                        $mail->CharSet    = 'UTF-8';


                        //Receptores
                        $mail->setFrom('citigersystem@gmail.com', 'Citiger Support');
                        $mail->addAddress($correo->getCorreo());

                        //Contenido
                        $mail->isHTML(true);
                        $mail->Subject = 'Código de Verificación';
                        $mail->Body    = 'Hola ' . $_SESSION['usuario'] . ', tu código de seguridad para el factor de doble autenticación es: <b>' . $code . '</b>';

                        if ($mail->send()) {
                            $result['status'] = 1;
                            $result['message'] = 'Código enviado correctamente, ' . $_SESSION['usuario'] . ' ';
                            $correo->actualizarCodigo('usuario', $code);
                        }
                    } catch (Exception $e) {
                        $result['exception'] = $mail->ErrorInfo;
                    }
                } else {
                    $result['exception'] = 'Correo incorrecto.';
                }
                session_destroy();
                break;
            //Caso para verificar el código con el factor de autenticación en dos pasos.
            case 'verifyCodeAuth':
                //Seteando la variable de sesión a utilizar
                $_SESSION['idcaseta_temp'] = $_GET['id_tmp'];
                $_POST = $usuarios->validateForm($_POST);
                // Validmos el formato del mensaje que se enviara en el correo
                if ($correo->setCodigo($_POST['codigoAuth'])) {
                    // Ejecutamos la funcion para validar el codigo de seguridad
                    if ($correo->validarCodigo('usuario',$_SESSION['idcaseta_temp'])) {
                        $_SESSION['idusuario_caseta'] = $_SESSION['idcaseta_temp'];
                        unset($_SESSION['idcaseta_temp']);
                        $result['status'] = 1;
                        $correo->cleanCode($_SESSION['idusuario_caseta']);
                        // Colocamos el mensaje de exito 
                        $result['message'] = 'Sesión iniciada correctamente.';
                    } else {
                        // En caso que el correo no se envie mostramos el error
                        $result['exception'] = 'El código ingresado no es correcto.';
                    }
                } else {
                    $result['exception'] = 'Mensaje incorrecto';
                }
                //Destruyendo las variables de sesión;
                session_destroy();
                break;
            //Caso para verificar si hay usuarios que desbloquear
            case 'checkBlockUsers':
                if ($result['dataset'] = $usuarios->checkBlockUsers()) {
                    $result['status'] = 1;
                } 
                break;
            //Caso para activar los usuarios que ya cumplieron con su tiempo de penalización
            case 'activateBlockUsers':
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->setId($_POST['txtId'])) {
                    if ($usuarios->setIdBitacora($_POST['txtBitacora'])){
                        if ($usuarios->activar()) {
                            if ($usuarios->updateBitacoraOut('Bloqueo (Cumplido)')) {
                                if ($usuarios->increaseIntentos(0)){
                                    $result['status'] = 1;
                                }
                            }
                        }
                    } 
                }
                break;
            //Caso para cambiar la contraseña obligatorio
            case 'changePassword':
                //Seteando la variable de sesión a utilizar
                $_SESSION['idcaseta_temp'] = $_GET['id_tmp'];
                $_POST = $usuarios->validateForm($_POST);
                if ($usuarios->setId($_SESSION['idusuario_caseta_tmp'])) {
                    if ($usuarios->checkPassword($_POST['txtContrasenaActual1'])) {
                        if ($_POST['txtNuevaContrasena1'] == $_POST['txtConfirmarContrasena1']) {
                            if ($_POST['txtNuevaContrasena1'] != $_POST['txtContrasenaActual1'] ||
                                $_POST['txtConfirmarContrasena1'] != $_POST['txtContrasenaActual1']) {
                                if ($usuarios->setContrasenia($_POST['txtNuevaContrasena1'])) {
                                    if ($usuarios->changePassword()) {
                                        $usuarios->setIdBitacora($_POST['txtBitacoraPassword']);
                                        if ($usuarios->updateBitacoraOut('Cambio de clave')) {
                                            $result['status'] = 1;
                                            $result['message'] = 'Contraseña actualizada correctamente.';
                                            $_SESSION['idusuario_caseta'] =$_SESSION['idusuario_caseta_tmp'];
                                            unset($_SESSION['idusuario_caseta_tmp']);
                                        } else {
                                            $result['exception'] = 'Hubo un error al registrar la bitacora';
                                        }
                                    } else {
                                        $result['exception'] = Database::getException();
                                    }
                                } else {
                                    $result['exception'] = 'Su contraseña no cumple con los requisitos especificados.';
                                }
                            } else {
                                $result['exception'] = 'Su nueva contraseña no puede ser igual a la actual.';
                            }
                        } else {
                            $result['exception'] = 'Las contraseñas no coinciden.';
                        }
                    } else {
                        $result['exception'] = 'La contraseña ingresada es incorrecta.';
                    }
                } else {
                    $result['exception'] = 'Id incorrecto.';
                }
                //Destruyendo las variables de sesión;
                session_destroy();
                break;
                case 'sendMail':

                    $_POST = $usuarios->validateForm($_POST);
                    // Generamos el codigo de seguridad 
                    $code = rand(999999, 111111);
                    if ($correo->setCorreo($_POST['txtCorreoRecu'])) {
                        if ($correo->validarCorreo('usuario')) {
    
                            // Ejecutamos funcion para obtener el usuario del correo ingresado\
                            $result['mail'] = $correo->getCorreo();
    
                            $result['dataset'] = $correo->obtenerUsuario($result['mail']);
    
    
                            try {
    
                                //Ajustes del servidor
                                $mail->SMTPDebug = 0;
                                $mail->isSMTP();
                                $mail->Host       = 'smtp.gmail.com';
                                $mail->SMTPAuth   = true;
                                $mail->Username   = 'citigersystem@gmail.com';
                                $mail->Password   = 'citiger123';
                                $mail->SMTPSecure = 'tls';
                                $mail->Port       = 587;
                                $mail->CharSet = 'UTF-8';
    
    
                                //Receptores
                                $mail->setFrom('citigersystem@gmail.com', 'Citiger Support');
                                $mail->addAddress($correo->getCorreo());
    
                                //Contenido
                                $mail->isHTML(true);
                                $mail->Subject = 'Recuperación de contraseña';
                                $mail->Body    = 'Hola ' . $_SESSION['usuario'] . ', hemos enviado este correo para que recuperes tu contraseña, tu código de seguridad es: <b>' . $code . '</b>';
    
                                if ($mail->send()) {
                                    $result['status'] = 1;
                                    $result['message'] = 'Código enviado correctamente, ' . $_SESSION['usuario'] . ' ';
                                    $correo->actualizarCodigo('usuario', $code);
                                }
                            } catch (Exception $e) {
                                $result['exception'] = $mail->ErrorInfo;
                            }
                        } else {
    
                            $result['exception'] = 'El correo ingresado no está registrado';
                        }
                    } else {
    
                        $result['exception'] = 'Correo incorrecto';
                    }
                    //Destruyendo las variables de sesión;
                    session_destroy();
                    break;
    
                case 'verifyCode':
                    //Seteando la variable de sesión a utilizar
                    $_SESSION['idusuario'] = $_GET['id_tmp'];
                    $_POST = $usuarios->validateForm($_POST);
                    // Validmos el formato del mensaje que se enviara en el correo
                    if ($correo->setCodigo($_POST['codigo'])) {
                        // Ejecutamos la funcion para validar el codigo de seguridad
                        if ($correo->validarCodigo('usuario',$_SESSION['idusuario'])) {
                            $result['status'] = 1;
                            // Colocamos el mensaje de exito 
                            $result['message'] = 'El código ingresado es correcto';
                        } else {
                            // En caso que el correo no se envie mostramos el error
                            $result['exception'] = 'El código ingresado no es correcto';
                        }
                    } else {
                        $result['exception'] = 'Mensaje incorrecto';
                    }
                    //Destruyendo las variables de sesión;
                    session_destroy();
                    break;

                    case 'changePass':
                        //Seteando la variable de sesión a utilizar
                        $_SESSION['idusuario'] = $_GET['id_tmp'];
                        // Obtenemos el form con los inputs para obtener los datos
                        $_POST = $usuarios->validateForm($_POST);
                        if ($usuarios->setId($_SESSION['idusuario'])) {
                            if ($usuarios->setContrasenia($_POST['txtContrasenia2'])) {
                                // Ejecutamos la funcion para actualizar al usuario
                                if ($usuarios->changePassword()) {
                                    $result['status'] = 1;
                                    $result['message'] = 'Clave actualizada correctamente';
                                    $correo->cleanCode($_SESSION['idusuario']);
                                    unset($_SESSION['idusuario']);
                                    unset($_SESSION['mail']);

                                } else {
                                    $result['exception'] = Database::getException();
                                }
                            } else {
                                $result['exception'] = $usuarios->getPasswordError();
                            }
                        } else {
                            $result['exception'] = 'Correo incorrecto';
                        }
                         //Destruyendo las variables de sesión;
                        session_destroy();
                        break;
            //Redirige al dashboard
            case 'validateSession':
                $result['error'] = 1;
                break;
            default:
                $result['exception'] = 'La acción no está disponible afuera de la sesión';
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
