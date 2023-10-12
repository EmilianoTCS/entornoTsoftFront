import React, { useState, useEffect, useRef } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import Header from "../../../../templates/Header/Header";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill, BsFillTrashFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";

import { MdDashboard } from "react-icons/md";
import { SiSubstack } from "react-icons/si";
import { FaComments } from "react-icons/fa";
import { BiSolidSend } from "react-icons/bi";

import Select from 'react-select';

import "../TablasStyles.css";
import ConfirmAlert from "../../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Paginador from "../../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import "../ListadoCompProy/CompProy.css"

export default function ListadoCompProy() {

    // const [num_boton, setNumBoton] = useState(1);
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    // const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
    // const [cantidadPaginas, setCantidadPaginas] = useState([]);
    const nombreTabla = "eddevalproyemp";

    const [EDDCompProy, setEDDCompProy] = useState([""]);

    const [tipoComparacion, setTipoComparacion] = useState("");
    const [tipoCargo, setTipoCargo] = useState("");
    const [fechaIni, setFechaIni] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [idCliente, setidCliente] = useState("");
    const [listCliente, setlistCliente] = useState([""]);

    const [idProyecto, setidProyecto] = useState("");
    const [listProyecto, setlistProyecto] = useState([""]);

    const [idServicio, setidServicio] = useState("");
    const [listServicio, setlistServicio] = useState([""]);

    const [selectedClients, setSelectedClients] = useState([]);
    const selectedClientsString = selectedClients.join(',');


    const [selectedServicio, setSelectedServicio] = useState([]);
    const selectedServicioString = selectedServicio.join(',');

    const [selectedProyecto, setSelectedProyecto] = useState([]);
    const selectedProyString = selectedProyecto.join(',');


    function obtenerCliente() {
        const url = "pages/auxiliares/listadoClienteForms.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistCliente(response)
        );
    }

    function obtenerProyecto() {
        if (selectedServicio.length > 0) {
            const url = "pages/auxiliares/listadoProyectoForms.php";
            const operationUrl = "listados";
            var data = {
                idServicio: selectedServicioString,
            };
            SendDataService(url, operationUrl, data).then((data) => {
                setlistProyecto(data);
            });
        }
    }

    function obtenerServicio() {
        if (selectedClients.length > 0) {
            const url = "pages/auxiliares/listadoServicioForms.php";
            const operationUrl = "listados";
            var data = {
                idCliente: selectedClientsString,
            };
            SendDataService(url, operationUrl, data).then((data) => {
                setlistServicio(data);
            });
        }
    }

    // ELIMINAR
    function desactivar(ID) {
        ConfirmAlert().then((response) => {
            if (response === true) {
                var url = "pages/cambiarEstado/cambiarEstado.php";
                var operationUrl = "cambiarEstado";
                var data = {
                    idRegistro: ID,
                    usuarioModificacion: userData.usuario,
                    nombreTabla: nombreTabla,
                };
                SendDataService(url, operationUrl, data).then((response) => {
                    TopAlerts("successEdited");
                });
            }
        });
    }
    // FIN ELIMINAR

    useEffect(
        function () {
            SendData();
            obtenerCliente();
            obtenerProyecto();
            obtenerServicio();
        },
        [
            // num_boton,
            // cantidadPorPagina,
            selectedClientsString,
            selectedServicioString,
            selectedProyString
        ]
    );

    function SendData() {

        // Validación de fechas
        if (new Date(fechaFin) < new Date(fechaIni)) {
            console.log("La fechaFin debe ser mayor o igual a la fechaInicio.");
            return;
        }

        var url = "pages/listados/listadoCompetenciasGeneralEval.php";
        var operationUrl = "listadoCompetenciasGeneralEval";

        var data = {
            // num_boton: num_boton,
            // cantidadPorPagina: cantidadPorPagina,

            idCliente: selectedClientsString,
            idServicio: selectedServicioString,
            idProyecto: selectedProyString,
            tipoComparacion: tipoComparacion,
            tipoCargo: tipoCargo,
            fechaIni: fechaIni,
            fechaFin: fechaFin,
        }

        console.log('data', data);
        SendDataService(url, operationUrl, data).then((data) => {
            // const { paginador, ...datos } = data;
            // setCantidadPaginas(paginador.cantPaginas);
            setEDDCompProy(data)
        });
    }

    const buscarClick = () => {
    //   EXPRESION
            if (selectedServicioString === "" && selectedProyString === "") {
                if (selectedClients.length < 2 || /^,(.*)/.test(selectedClients)|| /.*,,.*/.test(selectedClients)) {
                    TopAlerts('AlMenosDosClientes')
                    return;
                }
            } else if (selectedProyString === "") {
                if (selectedServicio.length < 2 || /^,(.*)/.test(selectedServicio)|| /.*,,.*/.test(selectedServicio)) {
                    TopAlerts('AlMenosDosServicios')
                    return;
                }
            } else if (selectedProyecto.length < 2 || /^,(.*)/.test(selectedProyecto) || /.*,,.*/.test(selectedProyecto)) {
                TopAlerts('AlMenosDosProyectos')
                return;

            }

            SendData();

    };


    // Restablecer los valores
    const limpiarClick = () => {

        setSelectedClients([]);
        setSelectedServicio([]);
        setSelectedProyecto([]);np
        setidProyecto('0');
        setTipoComparacion("");
        setTipoCargo("");
        setFechaIni("");
        setFechaFin("");
    };
    const resetProjects = () => {
        setSelectedProyecto([]);
        setidProyecto('');
    };
    const resetServices = () => {
        setSelectedServicio([]);
    };
    // FINNN Restablecer los valores

    return userData.statusConected || userData !== null ? (
        <>
            <Header></Header>

            <br></br>
            <br></br>
            <div id="fondoTabla">
                <div id="containerTablas">
                    <a
                        type="submit"
                        id="btnAtras"
                        value="Registrar"
                        href="/home">Volver
                    </a>
                    <h1 id="TitlesPages">
                        Listado de comparación de proyectos
                    </h1>
                    <h6 style={{ color: "gray" }}>
                        Eval desempeño {"->"} Comparación de proyectos
                    </h6>
                    <br></br>

                    <table style={{ width: '100%' }}>
                        <tr>

                            <td style={{ width: '16em' }}>

                                <label htmlFor="input_CantidadR">Clientes: </label>
                                <select
                                    multiple
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={({ target }) => {
                                        const selectedOptions = Array.from(target.selectedOptions, option => option.value);
                                        setSelectedClients(selectedOptions);
                                        // setNumBoton(1);
                                        resetProjects();
                                        resetServices();
                                    }}
                                >
                                    <option disabled hidden>Clientes</option>
                                    <option value="">Ninguno</option>
                                    {listCliente.map((valor) => (
                                        <option
                                            selected={selectedClients.includes(valor.idCliente) ? "selected" : ""}
                                            value={valor.idCliente}
                                        >
                                            {valor.nomCliente}
                                        </option>
                                    ))}
                                </select>

                            </td>


                            <td id="espacioEntreOpciones" style={{ width: '16em' }}>

                                <label htmlFor="input_CantidadR">Servicios: </label>
                                <select
                                    multiple
                                    required
                                    type="text"
                                    className="form-control"

                                    onChange={({ target }) => {
                                        const selectedOptions = Array.from(target.selectedOptions, option => option.value);
                                        setSelectedServicio(selectedOptions);
                                        // setNumBoton(1);
                                        resetProjects();
                                    }}
                                >
                                    <option disabled hidden>Servicios</option>
                                    <option value="">Ninguno</option>
                                    {listServicio.map((valor) => (
                                        <option
                                            selected={selectedServicio.includes(valor.idServicio) ? "selected" : ""}

                                            value={valor.idServicio}
                                        >
                                            {valor.nomServicio}
                                        </option>
                                    ))}
                                </select>

                            </td>

                            <td id="espacioEntreOpciones" style={{ width: '16em' }}>

                                <label htmlFor="input_CantidadR">Proyectos:</label>

                                <select
                                    multiple
                                    required
                                    type="text"
                                    className="form-control"
                                    onChange={({ target }) => {
                                        const selectedOptions = Array.from(target.selectedOptions, option => option.value);
                                        setSelectedProyecto(selectedOptions);
                                    }}
                                >
                                    <option disabled hidden>Proyectos</option>
                                    <option value="">Ninguno</option>
                                    {listProyecto.map((valor) => (
                                        <option
                                            selected={selectedProyecto.includes(valor.idEDDProyecto) ? "selected" : ""}
                                            value={valor.idEDDProyecto}
                                        >
                                            {valor.nomProyecto}
                                        </option>
                                    ))}
                                </select>

                            </td>
                            <td id="espacioEntreOpciones">
                                <label>Fecha inicio:</label>
                                <br></br>
                                <input
                                    className="form-control"
                                    placeholder="Fecha inicio"
                                    type="date"
                                    value={fechaIni}
                                    onChange={(e) => setFechaIni(e.target.value)}
                                />
                            </td>
                            <td id="espacioEntreOpciones">
                                <span>Fecha fin:</span>
                                <br></br>
                                <input
                                    className="form-control"
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </td>

                            <td>
                                <option disabled></option>
                                <button data-title="Limpiar filtros" type="button" class="btn-General-Pag" onClick={limpiarClick}
                                >Limpiar</button>
                            </td>
                            {/* <td style={{ width: '12em' }} id='espacioEntreOpcionesCantReg'>

                                <label htmlFor="input_CantidadRegistros">
                                    Cant registros:
                                </label>
                                <select
                                    // value={cantidadPorPagina || ""}
                                    className="form-control"
                                    name="input_CantidadRegistros"
                                    id="input_CantidadRegistros"
                                    onChange={({ target }) => {
                                        setcantidadPorPagina(target.value);
                                        setNumBoton(1);
                                    }}
                                    required
                                >
                                    <option hidden value="">
                                        {cantidadPorPagina}
                                    </option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>

                            </td> */}
                        </tr>
                    </table>

                    <br></br>

                    <table style={{ width: '100%' }}>
                        <tr>
                            <td><div id="tableResumen">
                                <table>
                                    <td>
                                        <strong>Comparación por:</strong>
                                    </td>
                                    <td id="espacioEntreOpciones">
                                        <input
                                            type="radio"
                                            id="general"
                                            name="tipoComparacion"
                                            value="GENERAL"
                                            checked={tipoComparacion === "GENERAL"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="general">&nbsp;General</label></td>

                                    <td id="espacioEntreOpciones">
                                        <input
                                            type="radio"
                                            id="mes"
                                            name="tipoComparacion"
                                            value="MES"
                                            checked={tipoComparacion === "MES"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="mes">&nbsp;Mes</label></td>
                                    <td id="espacioEntreOpciones">
                                        <input
                                            type="radio"
                                            id="año"
                                            name="tipoComparacion"
                                            value="AÑO"
                                            checked={tipoComparacion === "AÑO"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="año">&nbsp;Año</label></td>

                                </table>
                            </div>
                            </td>


                            <td id="espacioEntreOpciones">
                                <div id="tableResumen">
                                    <table >
                                        <td><strong>Seleccionar por:</strong></td>
                                        <td id="espacioEntreOpciones">
                                            <input
                                                type="radio"
                                                id="referentes"
                                                name="tipoCargo"
                                                value="REFERENTE"
                                                checked={tipoCargo === "REFERENTE"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="referentes">&nbsp;Referente</label></td>
                                        <td id="espacioEntreOpciones">
                                            <input
                                                type="radio"
                                                id="colaborador"
                                                name="tipoCargo"
                                                value="COLABORADOR"
                                                checked={tipoCargo === "COLABORADOR"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="colaborador">&nbsp;Colaborador</label></td>

                                        <td id="espacioEntreOpciones">
                                            <input
                                                type="radio"
                                                id="ambos"
                                                name="tipoCargo"
                                                value="TODOS"
                                                checked={tipoCargo === "TODOS"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="ambos">&nbsp;Ambos</label></td>
                                    </table>
                                </div>
                            </td>
                            <td >
                                <button data-title="Buscar" type="button" class="btn-General-Pag"
                                    onClick={buscarClick} // Aquí se agrega el manejador de eventos
                                >Buscar</button>
                            </td>

                            <td >
                                <Link to='/DashboardCompProy'>
                                    <button data-title="Desplegar dashboard" type="button" class="btn-General-Pag"
                                    >Desplegar Dashboard</button></Link>
                            </td>
                        </tr>
                    </table>
                    <Table id="mainTable" hover responsive>
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>Cliente</th>
                                <th>Servicio</th>
                                <th>Proyecto</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th>% Total Referentes</th>
                                <th>% Total Colaboradores</th>
                                <th >Cant Referentes</th>
                                <th>Cant Colaboradores</th>
                                {/* <th>Operaciones</th> */}

                            </tr>
                        </thead>
                        <tbody>
                            {EDDCompProy.map((idEDDCompProy) => (
                                <tr key={idEDDCompProy.idCliente}>
                                    <td>{idEDDCompProy.nomCliente}</td>
                                    <td>{idEDDCompProy.nomServicio}</td>
                                    <td>{idEDDCompProy.nomProyecto}</td>
                                    <td>{idEDDCompProy.epeFechaIni}</td>
                                    <td>{idEDDCompProy.epeFechaFin}</td>
                                    <td>{idEDDCompProy.porcAprobRef}</td>
                                    <td>{idEDDCompProy.porcAprobColab}</td>
                                    <td>{idEDDCompProy.cantReferentes}</td>
                                    <td>{idEDDCompProy.cantColaboradores}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <Paginador
                        paginas={cantidadPaginas}
                        cambiarNumero={setNumBoton}
                        num_boton={num_boton}
                    ></Paginador> */}
                </div>
            </div >
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
