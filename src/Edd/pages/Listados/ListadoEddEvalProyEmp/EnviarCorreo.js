import React, { useState, useEffect } from "react";

import "../ListadoEddEvalProyEmp/Insertar.css";
import SendDataService from "../../../../services/SendDataService";
import getDataService from "../../../../services/GetDataService";

import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EnviarCorreo = ({
    isActiveEDDEnviarCorreo,
    cambiarEstado,
    EDDEnviarCorreo,
}) => {
    // ----------------------CONSTANTES----------------------------
    const contactoCorreoEnviar = [];

    const listEDDEnviarCorreo = EDDEnviarCorreo;
    const [idProyecto, setidProyecto] = useState("");

    const [idEDDContactos, setidEDDContactos] = useState("");
    const [listEDDContactos, setlistEDDContactos] = useState([""]);
    const [idEDDEvaluacion, setidEDDEvaluacion] = useState("");
    const [listEDDEvaluacion, setlistEDDEvaluacion] = useState([""]);

    const show = isActiveEDDEnviarCorreo;

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    const handleClose = () => cambiarEstado(false);

    // ----------------------FUNCIONES----------------------------



    function SendDataEmail(e) {
        // e.preventDefault();
        const url = "pages/scripts/emailEDD.php";
        const operationUrl = "emailEDD";
        var data = {
            usuarioCreacion: userData.usuario,
            cargoEnProy: cargoEnProy,
            tipoConfDato: tipoConfDato,
            subTipoConfDato: subTipoConfDato,
            listContactos: contactoCorreoEnviar,
            isActive: true,
        };
        console.log(data);
        SendDataService(url, operationUrl, data).then((response) => {
            TopAlerts("successCreated");
        });
    }

    function obtenerContactos() {
        const url = "pages/auxiliares/listadoContactosProy.php";
        const operationUrl = "listadoContactosProy";
        var data = {
            idProyecto: 3,
        };
        SendDataService(url, operationUrl, data).then((response) => {
            setlistEDDContactos(response)
        });
    }



    function obtenerEvaluacion() {
        const url = "pages/auxiliares/listadoEddEvaluacion.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistEDDEvaluacion(response)

        );
    }


    useEffect(function () {
        obtenerEvaluacion();
        obtenerContactos();

    }, []);


    // ----------------------RENDER----------------------------
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Enviar Correo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={SendDataEmail}>
                        <div className="form-group">
                            <label htmlFor="input_Evaluacion">Evaluación: </label>
                            <select
                                required
                                className="form-control"
                                name="input_Evaluacion"
                                id="input_Evaluacion"
                                placeholder="Seleccione la evaluación"
                            // onChange={({ target }) => setidEDDEvaluacion(target.value)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {listEDDEvaluacion.map((valor) => (
                                    <option value={valor.idEDDEvaluacion}>
                                        {valor.nomEvaluacion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input_proyemp">Contactos: </label>
                            <select
                                required
                                className="form-control"
                                name="input_proyemp"
                                id="input_proyemp"
                                placeholder="Seleccione la Proyecto + Evaluado"
                            // onChange={({ target }) => setidEDDProyEmpEvaluado(target.value)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {listEDDContactos.map((valor) => (
                                    <option value={valor.correoContacto1}>{valor.nomContacto}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input_TipRESP">Cargo: </label>
                            <select
                                required
                                className="form-control"
                                name="input_TipRESP"
                                id="input_TipRESP"
                                // onChange={({ target }) => setnomRespPreg(target.value)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                <option value='Colaborador'>
                                   Colaborador
                                </option>
                                <option value='Referente'>
                                    Referente
                                </option>
                            
                            </select>
                        </div>
                        <Button
                            variant="secondary"
                            type="submit"
                            id="btn_registrar"
                            value="Registrar"
                        >
                            Registrar
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default EnviarCorreo;
