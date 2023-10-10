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

    const [num_boton, setNumBoton] = useState(1);
    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
    const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
    const [cantidadPaginas, setCantidadPaginas] = useState([]);
    const nombreTabla = "eddevalproyemp";

    const [EDDCompProy, setEDDCompProy] = useState([""]);

    const [tipoComparacion, setTipoComparacion] = useState([""]);
    const [tipoCargo, setTipoCargo] = useState([""]);
    const [fechaIni, setFechaIni] = useState([""]);
    const [fechaFin, setFechaFin] = useState([""]);

    const [idCliente, setidCliente] = useState([""]);
    const [listCliente, setlistCliente] = useState([""]);

    const [idProyecto, setidProyecto] = useState([""]);
    const [listProyecto, setlistProyecto] = useState([""]);

    const [idServicio, setidServicio] = useState([""]);
    const [listServicio, setlistServicio] = useState([""]);


    function obtenerCliente() {
        const url = "pages/auxiliares/listadoClienteForms.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistCliente(response)
        );
    }

    function obtenerProyecto() {
        const url = "pages/auxiliares/listadoProyectoForms.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistProyecto(response)
        );
    }

    function obtenerServicio() {
        const url = "pages/auxiliares/listadoServicioForms.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistServicio(response)
        );
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
            num_boton,
            cantidadPorPagina,
        ]
    );

    function SendData() {
        var url = "pages/auxiliares/listadoCompetenciasGeneralEval.php";
        var operationUrl = "listados";

        if (userData.nomRol === 'alumno') {
            var data = {
                num_boton: num_boton,
                cantidadPorPagina: cantidadPorPagina,
                idCliente: idCliente,
                idServicio: idServicio,
                idProyecto: idProyecto,
                tipoComparacion: tipoComparacion,
                tipoCargo: tipoCargo,
                fechaIni: fechaIni,
                fechaFin: fechaFin,
            }
        } else
            var data = {
                num_boton: num_boton,
                cantidadPorPagina: cantidadPorPagina,
                idCliente: idCliente,
                idServicio: idServicio,
                idProyecto: idProyecto,
                tipoComparacion: tipoComparacion,
                tipoCargo: tipoCargo,
                fechaIni: fechaIni,
                fechaFin: fechaFin,
            };
        console.log('data',data);
        SendDataService(url, operationUrl, data).then((data) => {

            const { paginador, ...datos } = data;
            setCantidadPaginas(paginador.cantPaginas);
            setEDDCompProy(datos.datos)
            console.log('response',data);
        });
    }

    const limpiarClick = () => {
        // Restablecer los estados a su valor inicial (vacío o predeterminado)
        setidCliente("");
        setidProyecto("");
        setTipoComparacion("");
        setTipoCargo("");
        setFechaIni("");
        setFechaFin("");
      };
       //PAGINADOR ---------------------

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
                        href="/ListadoEddProyEmp/0">Volver
                    </a>
                    <h1 id="TitlesPages">
                        Listado de comparación de proyectos
                    </h1>
                    <h6 style={{ color: "gray" }}>
                        Eval desempeño {"->"} Comparación de proyectos
                    </h6>
                    <br></br>

                    <table style={{ marginRight: 'auto' }}>
                        <tr>
                            <td style={{ width: '7em' }}>
                                
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
                                
                            </td>
                            <td id="espacioEntreOpciones">
                               
                                    <label htmlFor="input_CantidadR">Clientes: </label>

                                    <select
                                        required
                                        type="text"
                                        className="form-control"
                                        onChange={({ target }) => {
                                            setidCliente(target.value);
                                            setNumBoton(1);
                                        }}
                                    >

                                        <option disabled hidden>Clientes</option>
                                        <option value="0">Todos</option>

                                        {listCliente.map((valor) => (
                                            <option
                                                selected={valor.idCliente === idCliente ? "selected" : ""}
                                                value={valor.idCliente}
                                            >
                                                {valor.nomCliente}
                                            </option>
                                        ))}
                                    </select>
                                
                            </td>
                        
                            <td id="espacioEntreOpciones">

                                    <label htmlFor="input_CantidadR">Proyectos:</label>

                                    <select
                                        required
                                        type="text"
                                        className="form-control"
                                        onChange={({ target }) => { setidProyecto(target.value); setNumBoton(1); }}
                                    >
                                        <option disabled hidden>Proyectos</option>
                                        <option value="0">Todos</option>
                                        {listProyecto.map((valor) => (
                                            <option
                                                selected={(valor.idProyecto === idProyecto ? "selected" : "")}
                                                value={valor.idProyecto}
                                            >
                                                {valor.nomProyecto}
                                            </option>
                                        ))}
                                    </select>
                               
                            </td>
                            <td id="espacioEntreOpciones">
                               
                                    <label htmlFor="input_CantidadR">Servicios: </label>
                                    <select
                                        required
                                        type="text"
                                        className="form-control"
                                        onChange={({ target }) => { setidServicio(target.value); setNumBoton(1); }}
                                    >
                                        <option disabled hidden>Servicios</option>
                                        <option value="0">Todos</option>
                                        {listServicio.map((valor) => (
                                            <option
                                                selected={(valor.idServicio === idServicio ? "selected" : "")}
                                                value={valor.idServicio}
                                            >
                                                {valor.nomServicio}
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
                        </tr>
                    </table>

                    <br></br>

                    <table style={{ marginRight: 'auto' }}>
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
                                            value="general"
                                            checked={tipoComparacion === "general"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="general">General</label></td>

                                    <td id="espacioEntreOpciones">
                                        <input
                                            type="radio"
                                            id="mes"
                                            name="tipoComparacion"
                                            value="mes"
                                            checked={tipoComparacion === "mes"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="mes">Mes</label></td>
                                    <td id="espacioEntreOpciones">
                                        <input
                                            type="radio"
                                            id="año"
                                            name="tipoComparacion"
                                            value="año"
                                            checked={tipoComparacion === "año"}
                                            onChange={(e) => setTipoComparacion(e.target.value)}
                                        />
                                        <label htmlFor="año">Año</label></td>

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
                                                value="referentes"
                                                checked={tipoCargo === "referentes"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="referentes">Referentes</label></td>
                                        <td id="espacioEntreOpciones">
                                            <input
                                                type="radio"
                                                id="colaborador"
                                                name="tipoCargo"
                                                value="colaborador"
                                                checked={tipoCargo === "colaborador"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="colaborador">Colaborador</label></td>

                                        <td id="espacioEntreOpciones">
                                            <input
                                                type="radio"
                                                id="ambos"
                                                name="tipoCargo"
                                                value="ambos"
                                                checked={tipoCargo === "ambos"}
                                                onChange={(e) => setTipoCargo(e.target.value)}
                                            />
                                            <label htmlFor="ambos">Ambos</label></td>
                                    </table>
                                </div>
                            </td>
                            <td >
                                <button data-title="Buscar" type="button" class="btn-General-Pag"
                                    onClick={SendData}
                                >Buscar</button>
                            </td>

                            <td>
                                <Link to='/DashboardCompProy'>
                                <button data-title="Desplegar dashboard"  type="button" class="btn-General-Pag" 
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
                                <th>Operaciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {EDDCompProy.map((idEDDCompProy) => (
                                <tr key={idEDDCompProy.nomCliente}>
                                    <td>{idEDDCompProy.nomServicio}</td>
                                    <td>{idEDDCompProy.nomProyecto}</td>
                                    <td>{idEDDCompProy.epeFechaIni}</td>
                                    <td>{idEDDCompProy.epeFechaFin}</td>
                                    <td>{idEDDCompProy.porcAprobComp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador
                        paginas={cantidadPaginas}
                        cambiarNumero={setNumBoton}
                        num_boton={num_boton}
                    ></Paginador>
                </div>
            </div >
        </>
    ) : (
        <Navigate to="/login"></Navigate>
    );
}
