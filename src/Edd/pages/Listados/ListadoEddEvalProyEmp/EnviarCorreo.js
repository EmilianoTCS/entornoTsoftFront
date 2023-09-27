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
    const [idEDDProyecto, setidEDDProyecto] = useState("");
    const [listEDDProyecto, setlistEDDProyecto] = useState([""]);


    const show = isActiveEDDEnviarCorreo;

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    const handleClose = () => cambiarEstado(false);

    // ----------------------FUNCIONES----------------------------



    function SendDataEmail(e) {
        e.preventDefault();
        const url = "pages/scripts/emailEDD.php";
        const operationUrl = "emailEDD";
        var data = {
            usuarioCreacion: userData.usuario,
            idProyecto:1,
            cargoEnProy: 'Referente',
            tipoConfDato: "EMAIL",
            subTipoConfDato: "REFERENTES_GRAL",
            listContactos: contactoCorreoEnviar,
            isActive: true,
        };
        console.log(data);
        SendDataService(url, operationUrl, data).then((response) => {
            // TopAlerts("successCreated");
        });
    }

    function obtenerContactos() {
        const url = "pages/auxiliares/listadoContactosProy.php";
        const operationUrl = "listadoContactosProy";
        var data = {
            idProyecto: idEDDProyecto,
        };
        SendDataService(url, operationUrl, data).then((response) => {
            setlistEDDContactos(response)
        });
    }

    function obtenerProyecto() {
        const url = "pages/auxiliares/listadoProyectoForms.php";
        const operationUrl = "listados";
        getDataService(url, operationUrl).then((response) =>
            setlistEDDProyecto(response)
        );
    }

    useEffect(function () {
        obtenerProyecto();
    }, []);

    useEffect(function () {
        if (idEDDProyecto) {
            obtenerContactos(idEDDProyecto);
        }
    }, [idEDDProyecto]);

    // ----------------------RENDER----------------------------
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Enviar correo referentes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={SendDataEmail}>
                        <div className="form-group">
                            <label htmlFor="Proyecto">Proyecto: </label>
                            <select
                                required
                                className="form-control"
                                name="Proyecto"
                                id="Proyecto"
                                placeholder="Seleccione el proyecto"
                                onChange={({ target }) => setidEDDProyecto(target.value)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {listEDDProyecto.map((valor) => (
                                    <option value={valor.idEDDProyecto}>
                                        {valor.nomProyecto}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contactos">Contactos: </label>
                            <select
                                required
                                className="form-control"
                                name="contactos"
                                id="contactos"
                                placeholder="Seleccione los contactos"
                                onChange={({ target }) => setidEDDContactos(target.value)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {listEDDContactos.map((valor) => (
                                    <option value={valor.correoContacto1}>{valor.nomContacto}{valor.correoContacto1}{valor.correoContacto2}</option>
                                ))}
                            </select>
                        </div>
                      
                        <Button
                            variant="secondary"
                            type="submit"
                            id="btn_registrar"
                            value="Registrar"
                        >
                            Enviar
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default EnviarCorreo;
