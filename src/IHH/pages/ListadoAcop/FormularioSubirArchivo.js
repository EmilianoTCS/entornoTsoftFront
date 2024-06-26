import React, { useState, useEffect } from "react";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import SendFilesService from "../../../services/SendFilesService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../forms/insertar/Insertar.css";
export default function SubirArchivo({ isActive, cambiarEstado, idRegistro }) {
  const handleClose = () => cambiarEstado(false);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [archivoAcop, setArchivoAcop] = useState("");

  const show = isActive;

  function SubirArchivo(e) {
    e.preventDefault();
    var data = {
      idRegistro: idRegistro,
      nomTabla: "ihh_listadoAcop",
      descripcion: "ihh_listadoAcop",
      isActive: "1",
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      // "/pages/gestorArchivos/insertarExcelAcop.php",
      "/pages/gestorArchivos/cargaArchivos.php",
      archivoAcop,
      data
    ).then((response) => {
      // const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      // TopAlertsError(OUT_CODRESULT, OUT_MJERESULT)
      console.log(response);
    });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Subir archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SubirArchivo}>
            <input
              type="file"
              id="fileInput"
              name="fileInput"
              onChange={(e) => {
                setArchivoAcop(e.target.files[0]);
              }}
            />
            <br />
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
}
