import React, { useState } from "react";
import "./Insertar.css";

import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import SendFilesService from "../../../services/SendFilesService";

export default function InsertarAcopDoc({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listadoAcops, setListadoAcops] = useState([]);
  const [idAcop, setIdAcop] = useState([]);
  const [archivoAcop, setArchivoAcop] = useState([]);

  const obtenerAcops = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999999999,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setListadoAcops(datos.datos);
    });
  };

  function validaciones() {
    if (idAcop < 1) {
      TopAlertsError("01", "El ACOP no puede estar vacío");
      return true;
    } else if (archivoAcop === "") {
      TopAlertsError("01", "El ACOP no puede estar vacío");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      var data = {
        idAcop: idAcop,
        usuarioCreacion: userData.usuario,
      };
      SendFilesService(
        "/pages/insertar/ihh_insertarAcopDoc.php",
        archivoAcop,
        data
      ).then((response) => {
        console.log(response);
        
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      });
    }
  }

  useEffect(() => {
    obtenerAcops();
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Mantenedor de documentos de ACOP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="selectorAcops">Seleccione un ACOP:</label>
              <input
                className="form-control"
                list="acops"
                name="selectorAcops"
                placeholder="Seleccione un ACOP"
                onChange={(event) => {
                  const acop = event.target.value; // Obtén el nombre del acop seleccionado
                  const selectedAcop = listadoAcops.find(
                    (item) => item.nomAcop === acop
                  );
                  if (selectedAcop) {
                    setIdAcop(selectedAcop.idAcop);
                  }
                }}
              ></input>
              <datalist id="acops">
                {listadoAcops.map((item) => (
                  <option key={item.idAcop} value={item.nomAcop}></option>
                ))}
              </datalist>
            </div>
            <br></br>
            <div>
              <label htmlFor="fileInput">Seleccione un archivo:</label>
              <input
                className="form-control"
                type="file"
                id="fileInput"
                name="fileInput"
                onChange={(e) => {
                  setArchivoAcop(e.target.files[0]);
                }}
              />
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
