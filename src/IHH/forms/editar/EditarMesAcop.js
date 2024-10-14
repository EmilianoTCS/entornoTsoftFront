import React, { useState } from "react";

import "../insertar/Insertar.css";
import SendDataService from "../../../services/SendDataService";

import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NumericFormat } from "react-number-format";
import Card from "react-bootstrap/Card";
import { useEffect } from "react";

const EditarMesAcop = ({ isActiveFormulario, cambiarEstado, mesesAcop }) => {
  // ----------------------CONSTANTES----------------------------

  const [presupuestosCambiados, setPresupuestosCambiados] = useState(mesesAcop);
  const [diasNoLaborables, setDiasNoLaborables] = useState([]);

  const show = isActiveFormulario;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  const section1Plantilla = {
    backgroundColor: "#ededed",
    padding: "5px 5px 0 5px",
    borderRadius: "10px",
    margin: "auto",
    textAlign: "center",
    fontSize: "12p",
    fontWeight: "600",
  };
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

    console.log("data", data);
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);

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
  const handleInputChange = (values, id, nomPresupuesto) => {
    const { value } = values;

    if (nomPresupuesto === "observaciones") {
      guardaResp(
        id,
        {
          idacopmes: id,
          observaciones: value,
        },
        nomPresupuesto
      );
    } else if (nomPresupuesto === "operacional") {
      guardaResp(
        id,
        {
          idacopmes: id,
          presupuestoMensual: parseFloat(value),
        },
        nomPresupuesto
      );
    } else {
      guardaResp(
        id,
        {
          idacopmes: id,
          presupuestoMensualMiscelaneo: parseFloat(value),
        },
        nomPresupuesto
      );
    }
  };

  // Función para almacenar los cambios en los presupuestos y luego almacenarlos para ser enviados al servidor
  function guardaResp(idRegistro, nuevoPresupuestoMensual, nomPresupuesto) {
    let nuevosPresupuestos = [];

    if (nomPresupuesto === "operacional") {
      nuevosPresupuestos = presupuestosCambiados.map((item) => {
        if (item.idacopmes === idRegistro) {
          return {
            ...item,
            presupuestoMensual: nuevoPresupuestoMensual.presupuestoMensual,
          };
        }
        return item;
      });
    } else if (nomPresupuesto === "miscelaneo") {
      nuevosPresupuestos = presupuestosCambiados.map((item) => {
        if (item.idacopmes === idRegistro) {
          return {
            ...item,
            presupuestoMensualMiscelaneo:
              nuevoPresupuestoMensual.presupuestoMensualMiscelaneo,
          };
        }
        return item;
      });
    } else if (nomPresupuesto === "observaciones") {
      nuevosPresupuestos = presupuestosCambiados.map((item) => {
        if (item.idacopmes === idRegistro) {
          return {
            ...item,
            observaciones: nuevoPresupuestoMensual.observaciones,
          };
        }
        return item;
      });
    }

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
      parseFloat(presupuestoTotal) - transformarValor(totalPresupuestoMensual);

    total = total.toFixed(2);
    const number = total.toString();
    return formatCurrency(number.replace(".", ","));
  };

  const sumTotalPresMiscelaneo = () => {
    let total = 0;
    presupuestosCambiados.forEach((item) => {
      total += parseFloat(item.presupuestoMensualMiscelaneo);
    });
    return total.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calcularDiasPorMes = (fechaInicio, fechaFin) => {
    const [anoInicio, mesInicio, diaInicio] = fechaInicio
      .split("-")
      .map(Number);
    const [anoFin, mesFin, diaFin] = fechaFin.split("-").map(Number);

    const diasPorMes = [];

    const obtenerDiasDelMes = (año, mes) => {
      // Meses de 1 a 12, así que le restamos 1 para la indexación
      return new Date(año, mes, 0).getDate();
    };

    let año = anoInicio;
    let mes = mesInicio;

    while (año < anoFin || (año === anoFin && mes <= mesFin)) {
      const diasDelMes = obtenerDiasDelMes(año, mes);
      let diasMes = 0;

      if (año === anoInicio && mes === mesInicio) {
        // Días desde la fecha de inicio hasta el final del mes
        diasMes = diasDelMes - diaInicio + 1;
      } else if (año === anoFin && mes === mesFin) {
        // Días desde el inicio del mes hasta la fecha de fin
        diasMes = diaFin;
      } else {
        // Días completos del mes
        diasMes = diasDelMes;
      }

      // Formatear el mes en formato YYYYMM
      const formattedMonth = `${año}${String(mes).padStart(2, "0")}`;

      diasPorMes.push({
        mes: formattedMonth,
        dias: diasMes,
      });

      // Avanzar al siguiente mes
      mes++;
      if (mes > 12) {
        mes = 1;
        año++;
      }
    }

    return diasPorMes;
  };

  const obtenerDiasNoLaborables = () => {
    var url = "pages/auxiliares/ihh_listadoDiasNoLaborablesForms.php";
    var operationUrl = "listados";
    const data = {
      fechaIni: mesesAcop[0].fechaIni,
      fechaFin: mesesAcop[0].fechaFin,
    };
    SendDataService(url, operationUrl, data).then((res) => {
      setDiasNoLaborables(res);
    });
  };

  useEffect(() => {
    
    if (mesesAcop) {
      // console.log("mesesAcopAntes", mesesAcop);
      const totalPresupuestoMensual = mesesAcop.reduce(
        (acc, item) => acc + parseFloat(item.presupuestoMensual),
        0
      );
      const totalPresupuestoMiscelaneo = mesesAcop.reduce(
        (acc, item) => acc + parseFloat(item.presupuestoMensualMiscelaneo),
        0
      );

      const diferenciaPresupuestal =
        parseFloat(mesesAcop[0].presupuestoHH) - totalPresupuestoMensual;

      const diferenciaMiscelanea =
        parseFloat(mesesAcop[0].presupuestoMiscelaneo) -
        totalPresupuestoMiscelaneo;

      const nuevosMesesAcop = [...mesesAcop];
      const ultimoIndice = nuevosMesesAcop.length - 1;

      nuevosMesesAcop[ultimoIndice] = {
        ...nuevosMesesAcop[ultimoIndice],
        presupuestoMensual:
          parseFloat(nuevosMesesAcop[ultimoIndice].presupuestoMensual) +
          diferenciaPresupuestal,
        presupuestoMensualMiscelaneo:
          parseFloat(
            nuevosMesesAcop[ultimoIndice].presupuestoMensualMiscelaneo
          ) + diferenciaMiscelanea,
      };

      setPresupuestosCambiados(nuevosMesesAcop);
      // console.log("mesesAcopDesp", nuevosMesesAcop);

      obtenerDiasNoLaborables();
    }
  }, [mesesAcop]);

  // Ejemplo de uso con fechas desde el JSON
  const diasPorMes = calcularDiasPorMes(
    mesesAcop[0].fechaIni,
    mesesAcop[0].fechaFin
  );

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
            <p>
              <b>ACOP</b>: {mesesAcop[0].nomAcop} <br />
              <b>Fecha inicio</b>: {mesesAcop[0].fechaIniFormat} &nbsp;{" "}
              <b>Fecha término:</b> {mesesAcop[0].fechaFinFormat}
            </p>
            <p>Ingrese los presupuestos mensuales en dólares de cada mes</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {columnas.map((columna, colIndex) => (
                <div key={colIndex} style={{ flex: 1, margin: "0 10px" }}>
                  {columna.map((item) => {
                    const diasNoLab = diasNoLaborables.find(
                      (dnl) => dnl.mes === item.mes
                    );
                    const diasMes = diasPorMes.find(
                      (dpm) => dpm.mes === item.mes
                    );

                    const diasFinales =
                      diasMes && diasNoLab
                        ? diasMes.dias - parseInt(diasNoLab.cantDias)
                        : null;

                    return (
                      <Card key={item.idacopmes} style={{ maxWidth: "350px" }}>
                        <Card.Header as="h1" style={{ fontSize: "15pt"}}>
                          {convertirFecha(item.mes)} (USD)
                          <p>
                            Días laborables: {diasFinales} ({diasFinales * 8}{" "}
                            horas)
                          </p>
                        </Card.Header>
                        <Card.Body>
                          <div>
                            <label htmlFor={`input-${item.idacopmes}`}>
                              Ingrese el presupuesto operacional
                            </label>
                            <NumericFormat
                              placeholder="Escriba un nuevo valor ajustado para el presupuesto mensual"
                              className="form-control"
                              name="input_presupuestoMensual"
                              id="input_presupuestoMensual"
                              value={item.presupuestoMensual || ""}
                              thousandSeparator={"."}
                              prefix={"$"}
                              decimalScale={2}
                              fixedDecimalScale={true}
                              onValueChange={(e) =>
                                handleInputChange(
                                  e,
                                  item.idacopmes,
                                  "operacional"
                                )
                              }
                              decimalSeparator=","
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor={`input-${item.idacopmes}`}>
                              Ingrese el presupuesto para misceláneo
                            </label>
                            <NumericFormat
                              className="form-control"
                              name="input_presupuestoMensual"
                              id="input_presupuestoMensual"
                              value={item.presupuestoMensualMiscelaneo || ""}
                              thousandSeparator={"."}
                              prefix={"$"}
                              decimalScale={2}
                              fixedDecimalScale={true}
                              onValueChange={(e) =>
                                handleInputChange(
                                  e,
                                  item.idacopmes,
                                  "miscelaneo"
                                )
                              }
                              decimalSeparator=","
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor={`input-${item.idacopmes}`}>
                              Ingrese una observación (opcional)
                            </label>
                            <textarea
                              className="form-control"
                              name="input_observaciones"
                              id="input_observaciones"
                              value={item.observaciones || ""}
                              maxLength={300}
                              onChange={(e) =>
                                handleInputChange(
                                  { value: e.target.value },
                                  item.idacopmes,
                                  "observaciones"
                                )
                              }
                            />
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
            <br></br>
            <section style={section1Plantilla}>
              <header style={{ fontSize: "15pt" }}>
                Presupuesto operacional proyecto (USD)
              </header>
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: "auto",
                }}
              >
                <p>
                  Total presupuesto:{" "}
                  <b>
                    {parseFloat(mesesAcop[0].presupuestoHH).toLocaleString(
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
                  Total presupuesto mensual acumulado:{" "}
                  <b>{sumTotalPresMensual()}</b>
                </p>
                <p>
                  Diferencia total:{" "}
                  <b
                    style={
                      parseFloat(mesesAcop[0].presupuestoHH) -
                        transformarValor(sumTotalPresMensual()) >=
                      0
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    {sumTotalDifPres(
                      mesesAcop[0].presupuestoHH,
                      sumTotalPresMensual()
                    )}
                  </b>
                </p>
              </div>
            </section>
            <br></br>
            <section style={section1Plantilla}>
              <header style={{ fontSize: "15pt" }}>
                Presupuesto misceláneo (USD)
              </header>
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  margin: "auto",
                }}
              >
                <p>
                  Total presupuesto:{" "}
                  <b>
                    {parseFloat(
                      mesesAcop[0].presupuestoMiscelaneo
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </b>
                </p>
                <p>
                  Total presupuesto mensual acumulado:{" "}
                  <b>{sumTotalPresMiscelaneo()}</b>
                </p>
                <p>
                  Diferencia total:{" "}
                  <b
                    style={
                      parseFloat(mesesAcop[0].presupuestoMiscelaneo) -
                        transformarValor(sumTotalPresMiscelaneo()) >=
                      0
                        ? { color: "green" }
                        : { color: "red" }
                    }
                  >
                    {sumTotalDifPres(
                      mesesAcop[0].presupuestoMiscelaneo,
                      sumTotalPresMiscelaneo()
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
