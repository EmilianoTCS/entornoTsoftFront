import React, { useState, useEffect } from "react";

import "../ListadoEddEvalProyEmp/Insertar.css";
import SendDataService from "../../../../services/SendDataService";
import getDataService from "../../../../services/GetDataService";
import Swal from "sweetalert2";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import { MultiSelect } from "react-multi-select-component";

const EnviarCorreo = ({
    isActiveEDDEnviarCorreo,
    cambiarEstado,
    EDDEnviarCorreo,
}) => {
    // ----------------------CONSTANTES----------------------------

    const [listContactosEnviar, setlistContactosEnviar] = useState([]);

    const listEDDEnviarCorreo = EDDEnviarCorreo;
    const [idProyecto, setidProyecto] = useState("");

    const [idEDDContactos, setidEDDContactos] = useState("");
    const [listEDDContactos, setlistEDDContactos] = useState([""]);
    const [idEDDProyecto, setidEDDProyecto] = useState("");
    const [listEDDProyecto, setlistEDDProyecto] = useState([""]);

    const show = isActiveEDDEnviarCorreo;

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;


    const handleContactosChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => {
            const selectedContact = listEDDContactos.find((contact) => contact.correoContacto1 === option.value);
            return {
                nomContacto: selectedContact ? selectedContact.nomContacto : '',
                correoContacto: option.value,
                correoContacto2: selectedContact ? selectedContact.correoContacto2 : '',
            };
        });
        setlistContactosEnviar(selectedOptions);
    };
    // ----------------------FUNCIONES----------------------------
    function ConfirmAlertEnvio() {
        Swal.fire({
            html: `
            <p>Los correos han sido enviados</p>
            `,
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Continuar",
        }).then((result) => {
            if (result.isConfirmed) {
                <></>
            }
        });
    }

    function SendDataEmail(e) {
        e.preventDefault();
        const url = "pages/scripts/emailEDD.php";
        const operationUrl = "emailEDD";
        var data = {
            usuarioCreacion: userData.usuario,
            idProyecto: idEDDProyecto,
            cargoEnProy: 'Referente',
            tipoConfDato: "EMAIL",
            subTipoConfDato: "REFERENTES_GRAL",
            listContactos: listContactosEnviar,
            isActive: true,
        };

        handleClose();
        ConfirmAlertEnvio();

        SendDataService(url, operationUrl, data).then((response) => {

            setlistEDDContactos([]);
        });
    }

    const handleClose = () => {
        setidProyecto("");
        setlistEDDContactos([]);
        cambiarEstado(false);
    };

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
                    <Modal.Title>Envío correo de evaluaciones a <strong>Referentes</strong></Modal.Title>
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
                                onChange={({ target }) => {setidEDDProyecto(target.value);  obtenerContactos(target.value);}}
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
                            <label htmlFor="contactos">Seleccione uno o más contactos (Utilice tecla Ctrl): </label>
                            <select
                                className="form-control"
                                name="contactos"
                                id="contactos"
                                multiple
                                onChange={(e) => handleContactosChange(e)}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {listEDDContactos.map((valor) => (
                                    <option value={valor.correoContacto1}>{valor.nomContacto}</option>
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
