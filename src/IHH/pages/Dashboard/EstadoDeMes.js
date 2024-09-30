import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card } from "react-bootstrap";

export default function EstadoDeMes({
  idProyecto,
  datosMes,
  tipoImpugnacion,
  estadoProyecto,
  colores,
}) {
  const [detalleMensual, setDetalleMensual] = useState([]);

  function convertirFecha(fechaString) {
    if (fechaString) {
      const anio = fechaString.slice(0, 4);
      const mesNumero = fechaString.slice(4);
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
      return `${mesNombre} ${anio}`;
    }
    return "";
  }
  function agruparDatosPorEmpleado(datos) {
    const agrupados = {};

    datos.forEach((item) => {
      const idEmpleado = item.idEmpleado;

      // Si el empleado ya existe en el objeto agrupado
      if (agrupados[idEmpleado]) {
        agrupados[idEmpleado].cantHorasPeriodo =
          parseInt(agrupados[idEmpleado].cantHorasPeriodo) +
          parseInt(item.cantHorasPeriodo);

        agrupados[idEmpleado].cantHorasExtra =
          parseInt(agrupados[idEmpleado].cantHorasExtra) +
          parseInt(item.cantHorasExtra);

        // Si el tipo es "MISCELÁNEO", agrega las horas a horasMiscelaneo
        if (item.nomTipoElemento === "MISCELÁNEO") {
          agrupados[idEmpleado].horasMiscelaneo = parseInt(
            item.cantHorasPeriodo
          );
        }
      } else {
        // Si es la primera vez que se encuentra el idEmpleado
        agrupados[idEmpleado] = { ...item };

        // Si el tipo es "MISCELÁNEO", inicializa horasMiscelaneo
        if (item.nomTipoElemento === "MISCELÁNEO") {
          agrupados[idEmpleado].horasMiscelaneo = parseInt(
            item.cantHorasPeriodo
          );
        } else {
          agrupados[idEmpleado].horasMiscelaneo = 0;
        }
      }
    });

    // Convertir el objeto agrupado en un array
    return Object.values(agrupados);
  }

  function obtenerDetalleMensual() {
    var url = "pages/listados/ihh_listadoDetalleMensualProyecto.php";
    var operationUrl = "ihh_listadoDetalleMensualProyecto";
    var data = { idProyecto: idProyecto, mes: datosMes.mes };
    SendDataService(url, operationUrl, data).then((response) => {
      // console.log("ori", response);
      const { datosTabla } = response;
      // agruparDatosPorEmpleado(datosTabla);
      // console.log("proc", agruparDatosPorEmpleado(datosTabla));

      setDetalleMensual(agruparDatosPorEmpleado(datosTabla));
    });
  }

  useEffect(() => {
    if (datosMes) {
      obtenerDetalleMensual();
    }
  }, [datosMes]);

  function Circulos() {
    const presupuestoMensual = parseFloat(datosMes.presupuestoMensual) || 0;
    const presupuestoAcumulado = parseFloat(datosMes.presupuestoAcumulado) || 0;
    const costoMensual = parseFloat(datosMes.costoMensual) || 0;

    return (
      <>
        {/* proyectado */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "850px",
            margin: "auto",
            gap: "10px",
          }}
        >
          {/* ppto */}
          <div>
            <CircularProgressbarWithChildren
              value={presupuestoMensual > 0 ? presupuestoMensual : 0}
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `${colores.ppto[0].datoVisible}`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Presupuesto</strong>
                <br />
                <strong>mensual</strong>
                <br />

                <strong style={{ fontSize: "18pt" }}>
                  {presupuestoMensual.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
          {/* costo */}
          <div>
            <CircularProgressbarWithChildren
              value={costoMensual > 0 ? costoMensual : 0}
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `${colores.costo[0].datoVisible}`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Costo</strong>
                <br />
                <strong>mensual</strong>
                <br />

                <strong style={{ fontSize: "18pt" }}>
                  {costoMensual.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <div>
            <CircularProgressbarWithChildren
              value={
                (costoMensual * 100) / presupuestoMensual > 0
                  ? (costoMensual * 100) / presupuestoMensual
                  : 0
              }
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `#3e98c7`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Porcentaje ppto</strong>
                <br />
                <strong>utilizado</strong>
                <br />

                <strong style={{ fontSize: "19pt" }}>
                  {((costoMensual * 100) / presupuestoMensual).toFixed(2) + "%"}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <div>
            <CircularProgressbarWithChildren
              value={presupuestoMensual > 0 ? presupuestoMensual : 0}
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `#3e98c7`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Cantidad</strong>
                <br />
                <strong>Colab</strong>
                <br />

                <strong style={{ fontSize: "18pt" }}>
                  {datosMes.cantColaboradores}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <br></br>
        {/* acumulado */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "400px",
            margin: "auto",
            gap: "10px",
          }}
        >
          {/* ppto */}
          <div>
            <CircularProgressbarWithChildren
              value={presupuestoAcumulado > 0 ? presupuestoAcumulado : 0}
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `${colores.ppto[0].datoVisible}`,
                strokeLinecap: "butt",
                trailColor: `${colores.ppto[0].datoVisible}`,
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Presup mensual</strong>
                <br />
                <strong>acumulado</strong>
                <br />

                <strong style={{ fontSize: "17pt" }}>
                  {presupuestoAcumulado.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
          {/* costo
          <div>
            <CircularProgressbarWithChildren
              value={costoMensual > 0 ? costoMensual : 0}
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `${colores.costo[0].datoVisible}`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center" }}>
                <strong>Costo</strong>
                <br />
                <strong>mensual</strong>
                <br />

                <strong style={{ fontSize: "18pt" }}>
                  {costoMensual.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div> */}
          {/* porc presupuesto */}
          <div>
            <CircularProgressbarWithChildren
              value={
                (costoMensual * 100) / presupuestoAcumulado > 0
                  ? (costoMensual * 100) / presupuestoAcumulado
                  : 0
              }
              maxValue={100}
              background
              strokeWidth={10}
              styles={buildStyles({
                pathColor: `#3e98c7`,
                strokeLinecap: "butt",
                trailColor: "#E5E7E9",
                backgroundColor: "white",
              })}
            >
              <div style={{ fontSize: 17, textAlign: "center", width:"100px" }}>
                <strong >% Presup acumulado</strong>
                <br />
                <strong>utilizado</strong>
                <br />

                <strong style={{ fontSize: "17pt" }}>
                  {((costoMensual * 100) / presupuestoAcumulado).toFixed(2) +
                    "%"}
                </strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </>
    );
  }

  function ResumenMes() {
    if (tipoImpugnacion === "TODOS") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "stretch", // Alinea las tarjetas a la altura máxima
            marginTop: "10px",
          }}
        >
          {detalleMensual &&
            detalleMensual.map((item) => (
              <Card
                key={item.idImpugnacionEmp}
                style={{
                  width: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Body
                  style={{
                    padding: "10px",
                    margin: "auto",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h4
                      style={{
                        marginTop: "-15px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.nomEmpleado.toString().length <= 15 ? (
                        <>
                          {item.nomEmpleado}
                          <br></br>
                          <br></br>
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>
                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      ) : (
                        <>
                          {item.nomEmpleado}
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>

                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      )}
                    </h4>

                    <table
                      style={{
                        width: "100%",
                        margin: "auto",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Valor HH:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(item.valorHH).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "260px",
                            }}
                          >
                            <b>Horas impugnadas:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.cantHorasPeriodo}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Horas extras:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.cantHorasExtra}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            _________________________________________
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "70%",
                            }}
                          >
                            <b>Costo oper:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                              width: "30%",
                              fontWeight: "700",
                            }}
                          >
                            {parseFloat(
                              item.cantHorasPeriodo * item.valorHH +
                                item.cantHorasExtra * item.valorHH * 1.5
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                        <br></br>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "70%",
                            }}
                          >
                            <b>Horas misceláneo:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                              width: "30%",
                              fontWeight: "700",
                            }}
                          >
                            {item.horasMiscelaneo ? item.horasMiscelaneo : "0"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "70%",
                            }}
                          >
                            <b>Costo misceláneo:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                              width: "30%",
                              fontWeight: "700",
                            }}
                          >
                            {item.horasMiscelaneo
                              ? parseFloat(
                                  item.horasMiscelaneo * item.valorHH
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                              : "$0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    } else if (tipoImpugnacion === "OPERATIVO") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "stretch", // Alinea las tarjetas a la altura máxima
            marginTop: "10px",
          }}
        >
          {detalleMensual &&
            detalleMensual.map((item) => (
              <Card
                key={item.idImpugnacionEmp}
                style={{
                  width: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Body
                  style={{
                    padding: "10px",
                    margin: "auto",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h4
                      style={{
                        marginTop: "-15px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.nomEmpleado.toString().length <= 15 ? (
                        <>
                          {item.nomEmpleado}
                          <br></br>
                          <br></br>
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>
                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      ) : (
                        <>
                          {item.nomEmpleado}
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>

                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      )}
                    </h4>

                    <table
                      style={{
                        width: "100%",
                        margin: "auto",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Valor HH:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(item.valorHH).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "260px",
                            }}
                          >
                            <b>Horas impugnadas:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.cantHorasPeriodo}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Horas extras:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.cantHorasExtra}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            _________________________________________
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "70%",
                            }}
                          >
                            <b>Costo operativo:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                              width: "30%",
                              fontWeight: "700",
                            }}
                          >
                            {parseFloat(
                              item.cantHorasPeriodo * item.valorHH +
                                item.cantHorasExtra * item.valorHH * 1.5
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "stretch", // Alinea las tarjetas a la altura máxima
            marginTop: "10px",
          }}
        >
          {detalleMensual &&
            detalleMensual.map((item) => (
              <Card
                key={item.idImpugnacionEmp}
                style={{
                  width: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Body
                  style={{
                    padding: "10px",
                    margin: "auto",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h4
                      style={{
                        marginTop: "-15px",
                        marginBottom: "10px",
                      }}
                    >
                      {item.nomEmpleado.toString().length <= 15 ? (
                        <>
                          {item.nomEmpleado}
                          <br></br>
                          <br></br>
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>
                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      ) : (
                        <>
                          {item.nomEmpleado}
                          <p style={{ fontSize: "10pt" }}>{item.nomCargo}</p>

                          {item.monetizado === "1" ? (
                            <p style={{ fontSize: "10pt" }}>Monetizado</p>
                          ) : (
                            <p style={{ fontSize: "10pt" }}>No monetizado</p>
                          )}
                        </>
                      )}
                    </h4>

                    <table
                      style={{
                        width: "100%",
                        margin: "auto",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Valor HH:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(item.valorHH).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "260px",
                            }}
                          >
                            <b>Horas misceláneo:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.horasMiscelaneo ? item.horasMiscelaneo : "0"}
                          </td>
                        </tr>
                        {/* <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                            }}
                          >
                            <b>Horas extras:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                            }}
                          >
                            {item.cantHorasExtra}
                          </td>
                        </tr> */}
                        <tr>
                          <td colSpan={2}>
                            _________________________________________
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "left",
                              width: "70%",
                            }}
                          >
                            <b>Costo misceláneo:</b>
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "right",
                              width: "30%",
                              fontWeight: "700",
                            }}
                          >
                            {item.horasMiscelaneo
                              ? parseFloat(
                                  item.horasMiscelaneo * item.valorHH
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                              : "$0"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "white",
        width: "1000px",
        margin: "auto",
        borderRadius: "20px",
        padding: "20px",
      }}
    >
      <h2>Detalle {convertirFecha(datosMes.mes)}</h2>
      <h3>{datosMes.nomProyecto}</h3>

      <table
        style={{ width: "60%", margin: "auto", borderCollapse: "collapse" }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "10px", textAlign: "left" }}>
              <td style={{ width: "150px" }}>
                <b>Fecha inicio proy:</b>
              </td>
              <td>{datosMes.fechaIniProy}</td>
            </td>
            <td style={{ padding: "10px", textAlign: "left" }}>
              <td style={{ width: "150px" }}>
                <b>Fecha fin proy:</b>
              </td>
              <td>{datosMes.fechaFinProy}</td>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "10px", textAlign: "left" }}>
              <td style={{ width: "150px" }}>
                <b>Tipo impugnación:</b>
              </td>
              <td>{tipoImpugnacion}</td>
            </td>
            <td style={{ padding: "10px", textAlign: "left" }}>
              <td style={{ width: "150px" }}>
                <b>Estado proyecto:</b>{" "}
              </td>
              <td>{estadoProyecto}</td>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      {Circulos()}
      <br />
      <h4>Resumen por colaborador</h4>

      {detalleMensual.length > 1 ? (
        ResumenMes()
      ) : (
        <Card style={{ width: "400px", margin: "auto", marginTop: "10px" }}>
          <Card.Title>
            No se han realizado impugnaciones para este mes
          </Card.Title>
        </Card>
      )}
      <br></br>

      <br />
    </div>
  );
}
