import React, { useState, useEffect } from "react";

import "../ListadoEddEvalProyEmp/Insertar.css";
import SendDataService from "../../../../services/SendDataService";
import getDataService from "../../../../services/GetDataService";

import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EnviarCorreoColab = ({
    isActiveEDDEnviarCorreoColab,
    cambiarEstado,
    EDDEnviarCorreoColab,
}) => {
    // ----------------------CONSTANTES----------------------------

    const listEDDEnviarCorreoColab = EDDEnviarCorreoColab;

    const [idProyecto, setidProyecto] = useState("");


    const [idEDDProyecto, setidEDDProyecto] = useState("");
    const [listEDDProyecto, setlistEDDProyecto] = useState([""]);

    const show = isActiveEDDEnviarCorreoColab;

    const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

    const handleClose = () => cambiarEstado(false);

    // ----------------------FUNCIONES----------------------------



    function SendDataEmail(e) {
        e.preventDefault();
        const url = "pages/scripts/emailEDD.php";
        const operationUrl = "emailEDD";
        var data = {
            usuarioCreacion: userData.usuario,
            idProyecto:idEDDProyecto,
            cargoEnProy: 'Colaborador',
            tipoConfDato: "EMAIL",
            subTipoConfDato: "REFERENTES_GRAL",
            listContactos: '',
            isActive: true,
        };
        console.log(data);
        SendDataService(url, operationUrl, data).then((response) => {
            // TopAlerts("successCreated");
            console.log(response);
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


    // ----------------------RENDER----------------------------
    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Envío correo de evaluaciones a <strong>Colaboradores</strong></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={SendDataEmail}>
                        <div className="form-group">
                            <label htmlFor="input_Evaluacion">Proyecto: </label>
                            <select
                                required
                                className="form-control"
                                name="input_Evaluacion"
                                id="input_Evaluacion"
                                placeholder="Seleccione la evaluación"
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
export default EnviarCorreoColab;
