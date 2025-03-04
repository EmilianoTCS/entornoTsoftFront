import React, { useState, useEffect } from "react";
import "../ListadoMotivoEstandar.css";

import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarMotivoEstandar({
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
    idMotivo: "",
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
  const Validaciones = () => {
    if (datos.nombreMotivo.trim() === "") {
      TopAlertsError("01", "El nombre del motivo no puede estar vacío");
      return true;
    }
    if (datos.tipo.trim() === "") {
      TopAlertsError("02", "El tipo de motivo no puede estar vacío");
      return true;
    } else {
      return false;
    }
  };
  function SendData(e) {
    e.preventDefault();
    if (Validaciones()) {
      return;
    }
    const url = "pages/editar/oi_editarMotivoEstandar.php";
    const operationUrl = "oi_editarMotivoEstandar";
    var data = {
      idMotivo: datos.idMotivo,
      nombreMotivo: datos.nombreMotivo,
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      isActive: 1,
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
      if (datosFila) {
        setDatos({
          idMotivo: datosFila.idMotivo,
          nombreMotivo: datosFila.nombreMotivo,
          tipo: datosFila.tipo,
          descripcion: datosFila.descripcion,
        });
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar motivo estándar</Modal.Title>
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
                value={datos.nombreMotivo || ""}
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
                value={datos.tipo || ""}
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
                  <option
                    selected={datos.tipo === valor.datoVisible}
                    value={valor.datoVisible}
                  >
                    {valor.datoVisible}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Descripción (opcional): </label>
              <textarea
                className="form-control"
                value={datos.descripcion || ""}
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
