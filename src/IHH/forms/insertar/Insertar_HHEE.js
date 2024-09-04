import React, { useState } from "react";
import "./Insertar.css";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import getDataService from "../../../services/GetDataService";

export default function Insertar_HHEE({
  isActive,
  cambiarEstado,
  Registro,
  datosMain,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const [datos, setDatos] = useState();
  const [listAcops, setListAcops] = useState();
  const [listElemento, setListElemento] = useState();

  const obtenerAcops = () => {
    var url = "pages/auxiliares/ihh_listadoAcopForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((data) => {
      setListAcops(data);
    });
  };

  function obtenerElementos() {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      const filtered = response.filter(
        (item) => item.nomTipoElemento === "HORAS EXTRA"
      );

      setListElemento(filtered);
    });
  }

  function SendData(e) {
    e.preventDefault();

    datosMain.map((item) => {
      if (item.idRandom === datos.idRandom) {
        item.numAcop = datos.numAcop;
        item.tipoHHEE = datos.tipoHHEE;
        item.cantHorasExtra = datos.cantHorasExtra;
      }
    });

    cambiarEstado(false);
  }

  useEffect(
    function () {
      obtenerElementos();
      obtenerAcops();
      if (Registro) {
        setDatos(Registro);
        console.log(datos);
      }
    },
    [Registro]
  );

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="m"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Ingreso de HHEE</h3>
            <p>Colaborador: {Registro.nomEmpleado}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreAcop">
                Ingrese la cantidad de HHEE:
              </label>
              <input
                style={{ textTransform: "uppercase" }}
                type="number"
                className="form-control"
                name="input_nombreAcop"
                id="input_nombreAcop"
                value={datos ? datos.cantHorasExtra : ""}
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    cantHorasExtra: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreAcop">
                Seleccione el tipo de hora extra:
              </label>
              <select
                required
                className="form-control"
                value={datos ? datos.tipoHHEE : ""}
                onChange={({ target }) => {
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    tipoHHEE: target.value,
                  }));
                }}
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listElemento &&
                  listElemento.map((valor) => (
                    <option
                      key={valor.idElementoImp}
                      value={valor.idElementoImp}
                      selected={
                        datos && datos.tipoHHEE === valor.idElementoImp
                          ? true
                          : false
                      }
                    >
                      {valor.nomElemento}
                    </option>
                  ))}
              </select>
            </div>
            {datos && datos.tipoHHEE === "33" ? (
              <div>
                <label htmlFor="input_nombreAcop">
                  Seleccione el ACOP relacionado:
                </label>
                <select
                  required
                  className="form-control"
                  value={datos ? datos.numAcop : ""}
                  onChange={({ target }) => {
                    setDatos((prevDatos) => ({
                      ...prevDatos,
                      numAcop: target.value,
                    }));
                  }}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  {listAcops &&
                    listAcops.map((valor) => (
                      <option
                        key={valor.idAcop}
                        value={valor.numAcop}
                        selected={
                          datos && datos.numAcop === valor.numAcop
                            ? true
                            : false
                        }
                      >
                        {valor.numAcop} - {valor.nomAcop}
                      </option>
                    ))}
                </select>
              </div>
            ) : null}

            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
            >
              Actualizar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
