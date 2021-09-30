<?php
    require_once('../../helpers/database.php');
    require_once('../../helpers/validator.php');
    require_once('../../models/visitas.php');

    if (isset($_GET['action'])) {
        //Reanudando la sesion
        session_start();

        //Objeto para instanciar la clase
        $visitas = new Visitas();

        //Arreglo para guardar respuestas de la API
        $result = array('status'=>0, 'error'=>0, 'message'=>null, 'exception'=>null);

        //Acciones a ejecutar permitidas con la sesion iniciada
        if (isset($_SESSION['idusuario_caseta'])) {
            switch($_GET['action']){
                //Caso para contar las visitas activas
                case 'contadorVisitas':
                    if ($result['dataset'] = $visitas->contadorVisitas()) {
                        $result['status'] = 1;
                        $result['message'] = 'Visitas encontradas';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                    break;
                //Caso para verificar visita por dui
                case 'checkVisitDui':
                    $_POST = $visitas->validateForm($_POST);
                    if ($visitas->setDui($_POST['txtDui'])) {
                        if ($result['dataset'] = $visitas->checkVisitDui()) {
                            $result['status'] = 1;
                        } else {
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No se ha encontrado ninguna visita activa con este DUI.';
                            }
                        }
                    } else {
                        $result['exception'] = 'El dui ingresado no es válido.';
                    }
                    break;
                //Caso para verificar visitas por tabla
                case 'checkVisitPlaca':
                    $_POST = $visitas->validateForm($_POST);
                    if ($visitas->setPlaca($_POST['txtPlaca'])) {
                        if ($result['dataset'] = $visitas->checkVisitPlaca()) {
                            $result['status'] = 1;
                        } else {
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No se ha encontrado ninguna visita activa con esta placa.';
                            }
                        }
                    } else {
                        $result['exception'] = 'El placa ingresada no es válida.';
                    }
                    break;
                //Caso para finalizar visita
                case 'finishVisit':
                    $_POST = $visitas->validateForm($_POST);
                    if ($visitas->setIdVisita($_POST['txtVisita'])) {
                        if ($result['dataset'] = $visitas->updateVisita()) {
                            $result['status'] = 1;
                            $result['message'] = 'Se ha confirmado la visita correctamente.';
                        } else {
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No se ha confirmado la visita correctamente.';
                            }
                        }
                    } else {
                        $result['exception'] = 'Hubo un problema al seleccionar la visita.';
                    }
                    break;
                //Caso para leer todas las visitas
                case 'readAll':
                    if ($result['dataset'] = $visitas->readAllVisitas()) {
                        $result['status'] = 1;
                        $result['message'] = 'Se ha encontrado al menos una visita.';
                    } else {
                        if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'No existen visitas registradas.';
                        }
                    }
                    break;
                //Caso para realizar busquedas
                case 'search':
                    $_POST = $visitas->validateForm($_POST);
                    if($_POST['search'] != ''){
                        if($result['dataset'] = $visitas->searchRowsVisitas($_POST['search'])){
                            $result['status'] = 1;
                            $row = count($result['dataset']);
                            if($row > 0){
                                $result['message'] = 'Se han encontrado '.$row .' coincidencias';
                            } else{
                                $result['message'] = 'Se ha encontrado una coincidencia.';
                            }
                        } else{
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No hay coincidencias.';
                            }
                        }
                    } else {
                        $result['exception'] = 'Campo vacio';
                    }
                    break;
                //Caso para leer un dato en especifico
                case 'readOne':
                    $_POST = $visitas->validateForm($_POST);
                    if ($visitas->setIdVisita($_POST['txtVisita'])) {
                        if ($result['dataset'] = $visitas->readOneVisitas()) {
                            $result['status'] = 1;
                        } else {
                            if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No se ha encontrado ninguna visita registrado.';
                            }
                        }
                    } else {
                        $result['exception'] = 'Hubo problemas al seleccionar el registro.';
                    }
                    break;
            }
            // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
            header('content-type: application/json; charset=utf-8');
            // Se imprime el resultado en formato JSON y se retorna al controlador.
            print(json_encode($result));
        }
        //Si la sesion no esta iniciada, entonces:
        else{
            print(json_encode('Acceso denegado. Por favor iniciar sesión'));
        }
    }
    else{
        print(json_encode('El recurso no esta disponible'));
    }
?>