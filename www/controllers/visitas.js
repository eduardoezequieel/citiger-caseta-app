//Declarando variables de la url
var api_visitaVi;
var idVi;
var aliasVi;
var fotoVi;
var tipoVi;
var modoVi;
var correoVi;
var ipVi;

document.addEventListener('DOMContentLoaded', function () {
    let params = new URLSearchParams(location.search)
    // Se obtienen los datos localizados por medio de las variables.
    idVi = params.get('id');
    aliasVi = params.get('alias');
    fotoVi = params.get('foto');
    tipoVi = params.get('tipo');
    modoVi = params.get('modo');
    correoVi = params.get('correo');
    ip = params.get('ip');
    document.getElementById('txtModo').value = modoVi;
    //Imprimiendo el navbar
    isLogged(idVi,aliasVi,fotoVi,tipoVi,modoVi,ipVi,correoVi);
    //Verificando si hay algún id
    if (idVi > 0) {
        api_visitaVi = `http://34.125.88.216/app/api/caseta/visitas.php?id=${idVi}&action=`;
    } else {
        api_visitaVi = 'http://34.125.88.216/app/api/caseta/visitas.php?action=';
    }
    //Cargando info de la pagina
    readRows(api_visitaVi);
})

function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr class="animate__animated animate__fadeIn">
                <!-- Fotografia-->
                <th scope="row">
                    <div class="row paddingTh">
                        <div class="col-12">
                            <img src="http://34.125.88.216/resources/img/dashboard_img/residentes_fotos/${row.foto}" alt="#"
                                class="rounded-circle fit-images" width="30px" height="30px">
                        </div>
                    </div>
                </th>
                <td>${row.residente}</td>
                <td>${row.fecha}</td>
                <td>${row.visitante}</td>
                <td>${row.estadovisita}</td>
                <!-- Boton-->
                <th scope="row">
                    <div class="row paddingBotones">
                        <div class="col-12">
                            <a href="#" onclick="readDataOnModal(${row.idvisita}) "data-toggle="modal" data-target="#infoVisita" class="btn btnTabla mx-2"><i class="fas fa-eye"></i></a>
                        </div>
                    </div>
                </th>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;

    // Se inicializa la tabla con DataTable.
    $('#data-table').DataTable({
        retrieve: true,
        searching: false,
        language:
            {
                "decimal":        "",
                "emptyTable":     "No hay información disponible en la tabla.",
                "info":           "Mostrando _START_ de _END_ de _TOTAL_ registros.",
                "infoEmpty":      "Mostrando 0 de 0 de 0 registros",
                "infoFiltered":   "(filtered from _MAX_ total entries)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Mostrar _MENU_ registros",
                "loadingRecords": "Loading...",
                "processing":     "Processing...",
                "search":         "Search:",
                "zeroRecords":    "No matching records found",
                "paginate": {
                    "first":      "AAA",
                    "last":       "Ultimo",
                    "next":       "Siguiente",
                    "previous":   "Anterior"
                },
                "aria": {
                    "sortAscending":  ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            }
    });
}

//Reiniciando la busqueda
document.getElementById('btnReiniciar').addEventListener('click', function () {
    readRows(api_visitaVi);
    document.getElementById('search').value='';
});

//Buscando registros
document.getElementById('search-form').addEventListener('submit',function (event) {
    //Evitamos recargar la pagina
    event.preventDefault();
    //Llamamos la funcion
    searchRows(api_visitaVi, 'search-form');
})

function readDataOnModal(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('txtVisita', id);

    fetch(api_visitaVi + 'readOne', {
        method: 'post',
        body: data
    }).then(request => {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje indicando el problema.
        if (request.ok) {
            request.json().then(response => {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    document.getElementById('txtVisita').value = response.dataset.idvisita;
                    document.getElementById('lblResidente').textContent = response.dataset.residente;
                    document.getElementById('lblFecha').textContent =response.dataset.fecha;
                    document.getElementById('lblVisitante').textContent = response.dataset.visitante;
                    document.getElementById('lblCasa').textContent =response.dataset.numerocasa;
                    document.getElementById('lblObservacion').textContent =response.dataset.observacion;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(error => console.log(error));
}








