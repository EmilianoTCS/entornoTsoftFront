import React, { useState } from "react";

import "../insertar/Insertar.css";
import SendDataService from "../../../services/SendDataService";

import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NumericFormat } from "react-number-format";

const EditarMesAcop = ({ isActiveFormulario, cambiarEstado, mesesAcop }) => {
  // ----------------------CONSTANTES----------------------------

  const [presupuestosCambiados, setPresupuestosCambiados] = useState(mesesAcop);

  const show = isActiveFormulario;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  const section1Plantilla = {
    backgroundColor: "#ededed",
    padding: "5px 5px 0 5px",
    borderRadius: "10px",
    margin: "auto",
  };
console.log(mesesAcop)
  // ----------------------FUNCIONES----------------------------

  // función que se encarga de enviar los datos al servidor
  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarMesesAcop.php";
    const operationUrl = "ihh_editarMesesAcop";
    const data = {
      presupuestosCambiados: presupuestosCambiados.filter(
        (item) => item !== ""
      ),
      usuarioModificacion: userData.usuario, // filtra los elementos vacíos
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      cambiarEstado(false);
    });
  }

  // Función para dividir el array en partes iguales
  const dividirArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Convierte el formato YYYYMM a MES AÑO
  function convertirFecha(fechaString) {
    // Extraer el año y el mes del string
    const anio = fechaString.slice(0, 4);
    const mesNumero = fechaString.slice(4);

    // Convertir el mes a nombre
    const meses = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];
    const mesNombre = meses[parseInt(mesNumero) - 1];

    // Formatear la fecha en el formato deseado
    const fechaFormateada = mesNombre + " " + anio;

    return fechaFormateada;
  }

  // Formato de moneda
  const formatCurrency = (value) => {
    const number = parseFloat(value.replace(/[^\d,-]/g, "").replace(",", "."));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  function transformarValor(valor) {
    // Eliminar el signo de moneda
    let valorSinMoneda = valor.replace("$", "");

    // Reemplazar el punto (.) por nada y la coma (,) por un punto (.)
    let valorFormateado = valorSinMoneda.replace(/\./g, "").replace(",", ".");

    // Convertir la cadena resultante a un número
    let valorNumerico = parseFloat(valorFormateado);

    return valorNumerico.toFixed(2);
  }
  // obtiene los nuevos valores ingresados en el text box para compararlos y reemplazarlos en caso de ser necesario
  const handleInputChange = (values, id) => {
    const { value } = values;
    // Guardar cambios en presupuestosCambiados
    guardaResp(id, {
      idacopmes: id,
      presupuestoMensual: parseFloat(value),
    });
  };

  // Función para almacenar los cambios en los presupuestos y luego almacenarlos para ser enviados al servidor
  function guardaResp(idRegistro, nuevoPresupuestoMensual) {
    const nuevosPresupuestos = presupuestosCambiados.map((item) => {
      if (item.idacopmes === idRegistro) {
        return {
          ...item,
          presupuestoMensual: nuevoPresupuestoMensual.presupuestoMensual,
        };
      }
      return item;
    });

    const itemId = presupuestosCambiados.findIndex(
      (item) => item.idacopmes === idRegistro
    );

    if (itemId === -1) {
      console.warn(`Registro con id ${idRegistro} no encontrado.`);
    }

    setPresupuestosCambiados(nuevosPresupuestos);
  }

  const sumTotalPresMensual = () => {
    let total = 0;
    presupuestosCambiados.forEach((item) => {
      total += parseFloat(item.presupuestoMensual);
    });
    return total.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const sumTotalDifPres = (presupuestoTotal, totalPresupuestoMensual) => {
    let total = 0;
    total =
      parseFloat(presupuestoTotal) -
      transformarValor(totalPresupuestoMensual)

    total = total.toFixed(2);
    const number = total.toString();
    return formatCurrency(number.replace(".", ","));
  };
  // ----------------------RENDER----------------------------

  const columnas = dividirArray(
    presupuestosCambiados,
    Math.ceil(mesesAcop.length / 3)
  );
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Ajuste manual de presupuestos mensuales</h3>
            <p>ACOP {mesesAcop[0].nomAcop}</p>
            <p>
              Ingrese los presupuestos mensuales en dólares de cada mes
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {columnas.map((columna, colIndex) => (
                <div key={colIndex} style={{ flex: 1, margin: "0 10px" }}>
                  {columna.map((item) => (
                    <div key={item.idacopmes} style={{ marginBottom: "10px" }}>
                      <label htmlFor={`input-${item.idacopmes}`}>
                        {convertirFecha(item.mes)} (USD)
                      </label>
                      <NumericFormat
                        placeholder="Escriba un nuevo valor ajustado para el presupuesto mensual"
                        // style={{ width: "100%" }}
                        className="form-control"
                        name="input_presupuestoMensual"
                        id="input_presupuestoMensual"
                        value={item.presupuestoMensual || ""}
                        thousandSeparator={"."}
                        prefix={"$"}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onValueChange={(e) =>
                          handleInputChange(e, item.idacopmes)
                        }
                        decimalSeparator=","
                        required
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <section style={section1Plantilla}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: "auto",
                }}
              >
                <p>
                  Total presupuesto proyecto:{" "}
                  <b>
                    {parseFloat(mesesAcop[0].presupuestoTotalPesos).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </b>
                </p>
                <p>
                  Total presupuesto mensual: <b>{sumTotalPresMensual()}</b>
                </p>
                <p>
                  Diferencia total:{" "}
                  <b
                    style={
                        parseFloat(mesesAcop[0].presupuestoTotalPesos) -
                        transformarValor(sumTotalPresMensual()) >=
                      0
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    {sumTotalDifPres(
                      mesesAcop[0].presupuestoTotalPesos,
                      sumTotalPresMensual()
                    )}
                  </b>
                </p>
              </div>
            </section>
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
};
export default EditarMesAcop;
