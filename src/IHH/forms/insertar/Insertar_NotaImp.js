import React, { useState } from "react";
import "./Insertar.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";

export default function Insertar_NotaImp({
  isActive,
  cambiarEstado,
  Registro,
  datosMain,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const [datos, setDatos] = useState();

  function SendData(e) {
    e.preventDefault();

    datosMain.map((item) => {
      if (item.idRandom === datos.idRandom) {
        item.nota = datos.nota;
      }
    });

    cambiarEstado(false);
  }

  useEffect(
    function () {
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
            <h3>Ingreso de nota de impugnación</h3>
            <p>Colaborador: {Registro.nomEmpleado}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_notaImp">
                Ingrese la nota de impugnación:
              </label>
              <textarea
                style={{ textTransform: "uppercase" }}
                className="form-control"
                name="input_notaImp"
                id="input_notaImp"
                maxLength={200}
                value={datos ? datos.nota : ""}
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nota: target.value,
                  }))
                }
                required
              />
            </div>

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
