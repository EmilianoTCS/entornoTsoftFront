import React, { useState, useEffect } from "react";
import "../ListadoMotivoEstandar.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarMotivoEstandar({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    nombreMotivo: "",
    tipo: "",
    descripcion: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoTipoMotivos: [""],
  });

  const obtenerConfDatos = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "OI",
      subTipoConfDato: "TIPO_MOTIVO",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList({
        listadoTipoMotivos: response,
      });
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/oi_insertarMotivoEstandar.php";
    const operationUrl = "oi_insertarMotivoEstandar";
    var data = {
      nombreMotivo: datos.nombreMotivo,
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      isActive: datos.isActive,
      usuarioCreacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerConfDatos();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear motivo estándar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Ingrese el nombre del motivo:{" "}
              </label>
              <input
                type="text"
                className="form-control"
                required
                maxLength={100}
                onChange={(e) => {
                  setDatos((prev) => ({
                    ...prev,
                    nombreMotivo: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Seleccione el tipo de motivo:{" "}
              </label>
              <select
                required
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    tipo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoTipoMotivos.map((valor) => (
                  <option value={valor.datoVisible}>{valor.datoVisible}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Descripción (opcional): </label>
              <textarea
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    descripcion: target.value,
                  }))
                }
                maxLength={400}
                rows={5}
                style={{ fontSize: "10pt" }}
              ></textarea>
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
}
