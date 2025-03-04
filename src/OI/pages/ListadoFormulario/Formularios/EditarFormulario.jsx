import React, { useState, useEffect } from "react";
import "../ListadoFormulario.css";

import getDataService from "../../../../services/GetDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SendFilesService from "../../../../services/SendFilesService";

export default function EditarFormulario({
  isActive,
  cambiarEstado,
  datosFila,
}) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveEditar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idFormulario: "",
    nomFormulario: "",
    descFormulario: "",
    nombreLogo: "",
    logo: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const encontrarNombreArchivo = (base64File) => {
    console.log(base64File.name);
    // const regex = /filename:([^,]+\.csv)/;
    // const match = base64File.match(regex);
    // return match[0];
  };

  const Validaciones = () => {
    if (datos.nomFormulario === "") {
      TopAlertsError("01", "El nombre del formulario no puede estar vacío");
      return true;
    }
    if (datos.descFormulario === "") {
      TopAlertsError(
        "02",
        "La descripción del formulario no puede estar vacío"
      );
      return true;
    }
    if (datos.logo !== "" && datos.logo.size > 16 * 1024 * 1024) {
      // 16MB in bytes
      TopAlertsError("03", "El tamaño del logo no puede ser mayor a 16MB");
      return true;
    }
    return false;
  };
  function SendData(e) {
    e.preventDefault();
    if (Validaciones()) {
      return;
    }
    var data = {
      idFormulario: datos.idFormulario,
      nomFormulario: datos.nomFormulario,
      descFormulario: datos.descFormulario,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      "/pages/editar/oi_editarFormulario.php",
      datos.logo,
      data
    ).then((response) => {
      console.log(response);
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      if (datosFila) {
        setDatos({
          idFormulario: datosFila.idFormulario,
          nomFormulario: datosFila.nomFormulario,
          descFormulario: datosFila.descFormulario,
          logo: datosFila.logoFormulario,
          nombreLogo: datosFila.nombreLogo,
          isActive: datosFila.isActive,
          usuarioCreacion: userData.usuario,
        });
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar documento colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Ingrese el nombre del formulario:{" "}
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={datos.nomFormulario || ""}
                maxLength={100}
                onChange={(e) => {
                  setDatos((prev) => ({
                    ...prev,
                    nomFormulario: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Ingrese la descripción (opcional):
              </label>
              <textarea
                className="form-control"
                maxLength={500}
                rows={5}
                value={datos.descFormulario || ""}
                onChange={(e) => {
                  setDatos((prev) => ({
                    ...prev,
                    descFormulario: e.target.value,
                  }));
                }}
              />
            </div>

            <br></br>
            {datos.logo && (
              <div className="form-group">
                <label>Archivo actual:</label>
                <div className="border rounded p-2 mb-2 bg-light">
                  <span>{datos.nombreLogo}</span>
                </div>
              </div>
            )}

            <div>
              <label>Ingrese el logo del formulario (opcional):</label>
              <span style={{ fontSize: "10pt", opacity: "0.9" }}>
                Imagen menor a 16MB
              </span>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    logo: target.files[0],
                  }))
                }
              />
            </div>

            <br></br>
            <label style={{ fontSize: "11pt", opacity: "0.7" }}>
              Si no se han realizado cambios, cierre este formulario con el
              botón "X" o apriete la tecla "ESC"
            </label>

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
