import React, { useState } from "react";

import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";

import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const EditarPresupuestosMensuales = ({
  isActiveFormulario,
  cambiarEstado,
  resumenProyectos,
}) => {
  // ----------------------CONSTANTES----------------------------
  // const datos = [
  //   {
  //     idresumenperproy: "187",
  //     mes: "202406",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "188",
  //     mes: "202407",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "189",
  //     mes: "202408",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "190",
  //     mes: "202409",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "191",
  //     mes: "202410",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "192",
  //     mes: "202411",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "193",
  //     mes: "202412",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  //   {
  //     idresumenperproy: "194",
  //     mes: "202501",
  //     presupuestoMensual: "62500000",
  //     presupuestoAcumulado: null,
  //     costoMensual: null,
  //     saldoMensual: null,
  //     saldoPresupuesto: null,
  //     idProyecto: "48",
  //     valorUfPesos: null,
  //     isActive: "1",
  //     usuarioCreacion: "admin_emiliano",
  //     fechaCreacion: "2024-06-12 12:15:12",
  //     usuarioModificacion: "admin_emiliano",
  //     fechaModificacion: "2024-06-12 12:15:12",
  //     nomProyecto: "BCH PRUEBA",
  //     presupuestoTotal: "500000000",
  //   },
  // ];
  // resumenProyectos = datos;
  const datos = resumenProyectos;
  const [presupuestosCambiados, setPresupuestosCambiados] =
    useState(resumenProyectos);

  const show = isActiveFormulario;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  const section1Plantilla = {
    backgroundColor: "#ededed",
    padding: "5px 5px 0 5px",
    borderRadius: "10px",
    margin: "auto",
  };

  // ----------------------FUNCIONES----------------------------
  // Calcula el total de presupuestos mensuales sin haberse formateado ni redondeado
  function sumtotal() {
    let total = 0;
    resumenProyectos.map((item) => {
      total += parseFloat(item.presupuestoMensualUSD);
    });
    return total;
  }
  // Calcula el total de presupuestos mensuales redondeados
  function sumtotalRedondeado() {
    let total = 0;
    datos.map((item) => {
      total += Math.round(item.presupuestoMensualUSD);
    });
    return total;
  }
  //Obtengo la diferencia entre el total redondeando y el original, luego sobre escribo el array original restandole al último mes la diferencia
  let diferencia = sumtotalRedondeado() - sumtotal();
  datos.map((item, index) => {
    if (index === datos.length - 1) {
      item.presupuestoMensualUSD =
        parseFloat(Math.round(item.presupuestoMensualUSD)) -
        Math.round(diferencia);
    } else {
      item.presupuestoMensualUSD = parseFloat(
        Math.round(item.presupuestoMensualUSD)
      );
    }
  });
  // setPresupuestosCambiados(datos);
  // función que se encarga de enviar los datos al servidor
  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarResumenPeriodo.php";
    const operationUrl = "ihh_editarResumenPeriodo";
    const data = {
      presupuestosCambiados: presupuestosCambiados.filter(
        (item) => item !== ""
      ),
      usuarioModificacion: userData.usuario, // filtra los elementos vacíos
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
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
    // Remover caracteres que no sean dígitos o el signo negativo
    const number = parseInt(value.replace(/[^\d-]/g, ""), 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Inicializamos los valores en el estado
  const [values, setValues] = useState(
    datos.map((dato) => ({
      ...dato,
      formatted: formatCurrency(dato.presupuestoMensualUSD.toString()),
    }))
  );

  // obtiene los nuevos valores ingresados en el text box para compararlos y reemplazarlos en caso de ser necesario
  const handleInputChange = (e, id) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, "");
    setValues((prevValues) =>
      prevValues.map((item) => {
        if (item.idresumenperproy === id) {
          return {
            ...item,
            presupuestoMensualUSD: cleanedValue,
            formatted: formatCurrency(cleanedValue),
          };
        }
        return item;
      })
    );
    // Guardar cambios en presupuestosCambiados
    guardaResp(id, {
      idresumenperproy: id,
      presupuestoMensualUSD: value.replace(/\D/g, ""),
    });
  };

  // Función para almacenar los cambios en los presupuestos y luego almacenarlos para ser enviados al servidor
  function guardaResp(idRegistro, nuevoPresupuestoMensualUSD) {
    const nuevosPresupuestos = presupuestosCambiados.map((item) => {
      if (item.idresumenperproy === idRegistro) {
        return {
          ...item,
          presupuestoMensualUSD:
            nuevoPresupuestoMensualUSD.presupuestoMensualUSD,
        };
      }
      return item;
    });

    const itemId = presupuestosCambiados.findIndex(
      (item) => item.idresumenperproy === idRegistro
    );

    if (itemId === -1) {
      console.warn(`Registro con id ${idRegistro} no encontrado.`);
    }

    setPresupuestosCambiados(nuevosPresupuestos);
  }

  const sumTotalPresMensual = () => {
    let total = 0;
    values.forEach((item) => {
      const presupuesto = item.presupuestoMensualUSD.toString();
      // Verificar si el presupuesto es una cadena de texto antes de procesarlo
      if (typeof presupuesto === "string") {
        // Remover caracteres que no sean dígitos o el signo negativo
        const valueWithoutNonDigits = presupuesto.replace(/[^\d-]/g, "");
        // Convertir a número y sumar al total
        total += parseInt(valueWithoutNonDigits);
      }
    });

    // Formatear el total a moneda
    const formattedTotal = formatCurrency(total.toString());

    return formattedTotal;
  };

  const sumTotalDifPres = (presupuestoTotal, totalPresupuestoMensual) => {
    let total = 0;
    total =
      parseInt(presupuestoTotal.replace(/\D/g, "")) -
      parseInt(totalPresupuestoMensual.replace(/\D/g, ""));

    return formatCurrency(total.toString());
  };
  // ----------------------RENDER----------------------------

  const columnas = dividirArray(values, Math.ceil(resumenProyectos.length / 3));
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
            <h3>{values[0].nomProyecto}</h3>
            <p>
              Ingrese los presupuestos mensuales en dólares de cada mes según
              ACOP
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {columnas.map((columna, colIndex) => (
                <div key={colIndex} style={{ flex: 1, margin: "0 10px" }}>
                  {columna.map((item) => (
                    <div
                      key={item.idresumenperproy}
                      style={{ marginBottom: "10px" }}
                    >
                      <label htmlFor={`input-${item.idresumenperproy}`}>
                        {convertirFecha(item.mes)} ($USD)
                      </label>
                      <input
                        type="text"
                        id={`input-${item.idresumenperproy}`}
                        placeholder="Ingrese valor"
                        style={{ width: "100%" }}
                        value={item.formatted}
                        onChange={(e) =>
                          handleInputChange(e, item.idresumenperproy)
                        }
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
                  <b>{formatCurrency(resumenProyectos[0].presupuestoTotal)}</b>
                </p>
                <p>
                  Total presupuesto mensual: <b>{sumTotalPresMensual()}</b>
                </p>
                <p>
                  Diferencia total:{" "}
                  <b
                    style={
                      parseInt(resumenProyectos[0].presupuestoTotal) -
                        parseInt(sumTotalPresMensual().replace(/\D/g, "")) >=
                      0
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    {sumTotalDifPres(
                      formatCurrency(resumenProyectos[0].presupuestoTotal),
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
export default EditarPresupuestosMensuales;
