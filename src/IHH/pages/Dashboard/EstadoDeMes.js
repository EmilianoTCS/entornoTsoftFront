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
  const [isLoadedData, setIsLoadedData] = useState(false);

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
      const { datosTabla } = response;
      setDetalleMensual(agruparDatosPorEmpleado(datosTabla));
      setIsLoadedData(true);
    });
  }

  useEffect(() => {
    if (datosMes) {
      obtenerDetalleMensual();
    }
  }, [datosMes]);

  function Circulos() {
    if (tipoImpugnacion === "TODOS") {
      let presupuestoMensual = parseFloat(datosMes.presupuestoMensual) || 0;
      let presupuestoAcumulado = parseFloat(datosMes.presupuestoAcumulado) || 0;
      let costoMensual = parseFloat(datosMes.costoMensual) || 0;
      let presupuestoMensualMiscelaneo =
        parseFloat(datosMes.presupuestoMensualMiscelaneo) || 0;
      let presupuestoAcumuladoMiscelaneo =
        parseFloat(datosMes.presupuestoAcumuladoMiscelaneo) || 0;
      let costoMensualMiscelaneo =
        parseFloat(datosMes.costoMensualMiscelaneo) || 0;
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              justifyContent: "center",
              gap: "10px",
              width: "90%",
            }}
          >
            {/* operativos: */}
            <section
              style={{
                border: "2px solid rgba(199, 199, 199, 0.7)",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <h5 style={{ margin: "auto" }}>Operativo</h5>
              <br></br>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)", // Define dos columnas
                  gap: "15px", // Espacio entre las tarjetas
                  margin: "auto", // Centrar el grid
                  justifyContent: "center",
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
                      <strong>Ppto</strong>
                      <br />
                      <strong style={{ fontSize: "17pt" }}>
                        {presupuestoMensual.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                      </strong>{" "}
                      <br></br>
                      <strong>100%</strong>
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

                      <strong style={{ fontSize: "17pt" }}>
                        {costoMensual > 0
                          ? costoMensual.toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })
                          : "S/I"}
                      </strong>
                      <br />
                      <strong>
                        {costoMensual > 0
                          ? ((costoMensual * 100) / presupuestoMensual).toFixed(
                              2
                            ) + "%"
                          : "0.00%"}
                      </strong>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>

                {/* ppto acumulado */}
                <div
                  style={{ gridColumn: "span 2", width: "50%", margin: "auto" }}
                >
                  <CircularProgressbarWithChildren
                    value={presupuestoAcumulado > 0 ? presupuestoAcumulado : 0}
                    maxValue={100}
                    background
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: `${colores.ppto_acu[0].datoVisible}`,
                      strokeLinecap: "butt",
                      trailColor: `${colores.ppto_acu[0].datoVisible}`,
                      backgroundColor: "white",
                    })}
                  >
                    <div style={{ fontSize: 17, textAlign: "center" }}>
                      <strong>Ppto acumulado</strong>
                      <br />

                      <strong style={{ fontSize: "17pt" }}>
                        {presupuestoAcumulado.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                      </strong>
                      <br></br>
                      <strong>100%</strong>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
              </div>
            </section>

            {/* miscelaneos */}
            <section
              style={{
                border: "2px solid rgba(199, 199, 199, 0.7)",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <h5 style={{ margin: "auto" }}>Misceláneo</h5>
              <br></br>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)", // Define dos columnas
                  gap: "20px", // Espacio entre las tarjetas
                  margin: "auto", // Centrar el grid
                  // width: "40%",
                }}
              >
                {/* ppto */}
                <div>
                  <CircularProgressbarWithChildren
                    value={
                      presupuestoMensualMiscelaneo > 0
                        ? presupuestoMensualMiscelaneo
                        : 0
                    }
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
                      <strong>Ppto</strong>
                      <br />
                      <strong style={{ fontSize: "17pt" }}>
                        {presupuestoMensualMiscelaneo.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                      </strong>{" "}
                      <br />
                      <strong>100%</strong>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
                {/* costo */}
                <div>
                  <CircularProgressbarWithChildren
                    value={
                      costoMensualMiscelaneo > 0 ? costoMensualMiscelaneo : 0
                    }
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
                      <strong style={{ fontSize: "17pt" }}>
                        {costoMensualMiscelaneo > 0
                          ? costoMensualMiscelaneo.toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })
                          : "S/I"}
                      </strong>
                      <br></br>
                      <strong>
                        {costoMensualMiscelaneo > 0
                          ? (
                              (costoMensualMiscelaneo * 100) /
                              presupuestoMensualMiscelaneo
                            ).toFixed(2) + "%"
                          : "0.00%"}
                      </strong>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>

                {/* ppto Acu*/}
                <div
                  style={{ gridColumn: "span 2", width: "50%", margin: "auto" }}
                >
                  <CircularProgressbarWithChildren
                    value={
                      presupuestoAcumuladoMiscelaneo > 0
                        ? presupuestoAcumuladoMiscelaneo
                        : 0
                    }
                    maxValue={100}
                    background
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: `${colores.ppto_acu[0].datoVisible}`,
                      strokeLinecap: "butt",
                      trailColor: `${colores.ppto_acu[0].datoVisible}`,
                      backgroundColor: "white",
                    })}
                  >
                    <div style={{ fontSize: 17, textAlign: "center" }}>
                      <strong>Ppto acumulado</strong>
                      <br />

                      <strong style={{ fontSize: "17pt" }}>
                        {presupuestoAcumuladoMiscelaneo.toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}
                      </strong>
                      <br />
                      <strong>100%</strong>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>
              </div>
            </section>
          </div>
          <br></br>

          {/* colab */}
          <section
            style={{
              border: "2px solid rgba(199, 199, 199, 0.7)",
              padding: "5px",
              borderRadius: "10px",
              width: "46%",
              margin: "auto",
            }}
          >
            <h5 style={{ margin: "auto" }}>Colaboradores</h5>
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "auto",
                gap: "15px",
              }}
            >
              {/* cant colab */}
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
                    <strong style={{ fontSize: "17pt" }}>
                      {datosMes.cantColaboradores}
                    </strong>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
              {/* detalle colab */}
              <div>
                <CircularProgressbarWithChildren
                  value={100}
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
                    <br></br>
                    <strong>Monetizados {datosMes.cantMonetizados}</strong>
                    <br></br>
                    <strong>No monetizados {datosMes.cantNoMonetizados}</strong>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>
          </section>
        </>
      );
    } else {
      let presupuestoMensual = 0;
      let presupuestoAcumulado = 0;
      let costoMensual = 0;
      if (tipoImpugnacion === "OPERATIVO") {
        presupuestoMensual = parseFloat(datosMes.presupuestoMensual) || 0;
        presupuestoAcumulado = parseFloat(datosMes.presupuestoAcumulado) || 0;
        costoMensual = parseFloat(datosMes.costoMensual) || 0;
      } else if (tipoImpugnacion === "MISCELANEO") {
        presupuestoMensual =
          parseFloat(datosMes.presupuestoMensualMiscelaneo) || 0;
        presupuestoAcumulado =
          parseFloat(datosMes.presupuestoAcumuladoMiscelaneo) || 0;
        costoMensual = parseFloat(datosMes.costoMensualMiscelaneo) || 0;
      }
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
                  <strong>Ppto</strong>
                  <br />
                  {/* <strong>del mes</strong>
                  <br /> */}

                  <strong style={{ fontSize: "18pt" }}>
                    {presupuestoMensual.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </strong>
                  <br></br>
                  <strong>100%</strong>
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
                  <strong style={{ fontSize: "18pt" }}>
                    {costoMensual > 0
                      ? costoMensual.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })
                      : "S/I"}
                  </strong>
                  <br />
                  <strong>
                    {costoMensual > 0
                      ? ((costoMensual * 100) / presupuestoMensual).toFixed(2) +
                        "%"
                      : "0.00%"}
                  </strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>

            {/* saldo */}
            <div>
              <CircularProgressbarWithChildren
                value={
                  (100 - (costoMensual * 100) / presupuestoMensual).toFixed(2) >
                  0
                    ? (100 - (costoMensual * 100) / presupuestoMensual).toFixed(
                        2
                      )
                    : 0
                }
                maxValue={100}
                background
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: `${colores.saldo[0].datoVisible}`,
                  strokeLinecap: "butt",
                  trailColor: "#E5E7E9",
                  backgroundColor: "white",
                })}
              >
                <div
                  style={{
                    fontSize: 17,
                    textAlign: "center",
                    color:
                      presupuestoMensual - costoMensual < 0 ? "red" : "black", // Cambia el color del texto
                  }}
                >
                  <strong>Saldo</strong>
                  <br />
                  <strong style={{ fontSize: "18pt" }}>
                    {(presupuestoMensual - costoMensual).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                      }
                    )}
                  </strong>
                  <br />
                  <strong>
                    {(100 - (costoMensual * 100) / presupuestoMensual).toFixed(
                      2
                    ) + "%"}
                  </strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>

            {/* cant colab */}
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
                  <strong>Colaboradores</strong>
                  <br />

                  <strong style={{ fontSize: "18pt" }}>
                    {datosMes.cantColaboradores
                      ? datosMes.cantColaboradores
                      : 0}
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
              width: "850px",
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
                  pathColor: `${colores.ppto_acu[0].datoVisible}`,
                  strokeLinecap: "butt",
                  trailColor: `${colores.ppto_acu[0].datoVisible}`,
                  backgroundColor: "white",
                })}
              >
                <div style={{ fontSize: 17, textAlign: "center" }}>
                  <strong>Ppto acumulado</strong>
                  <br />
                  {/* <strong>acumulado</strong>
                  <br></br> */}

                  <strong style={{ fontSize: "17pt" }}>
                    {presupuestoAcumulado.toLocaleString("es-CL", {
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
                value={
                  presupuestoAcumulado > 0
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
                <div
                  style={{ fontSize: 17, textAlign: "center", width: "140px" }}
                >
                  <strong>Costo acumulado</strong>
                  <br />
                  <strong style={{ fontSize: "17pt" }}>
                    {costoMensual > 0
                      ? costoMensual.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })
                      : "S/I"}
                  </strong>
                  <br />
                  <strong>
                    {presupuestoAcumulado > 0
                      ? ((costoMensual * 100) / presupuestoAcumulado).toFixed(
                          2
                        ) + "%"
                      : "0.00%"}
                  </strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>

            {/* saldo acumulado */}
            <div>
              <CircularProgressbarWithChildren
                value={
                  (100 - (costoMensual * 100) / presupuestoAcumulado).toFixed(
                    2
                  ) > 0
                    ? (
                        100 -
                        (costoMensual * 100) / presupuestoAcumulado
                      ).toFixed(2)
                    : 0
                }
                maxValue={100}
                background
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: `${colores.saldo[0].datoVisible}`,
                  strokeLinecap: "butt",
                  trailColor: "#E5E7E9",
                  backgroundColor: "white",
                })}
              >
                <div
                  style={{
                    fontSize: 17,
                    textAlign: "center",
                    color:
                      presupuestoAcumulado - costoMensual < 0 ? "red" : "black", // Cambia el color del texto
                  }}
                >
                  <strong>Saldo acumulado</strong>
                  <br />
                  <strong style={{ fontSize: "18pt" }}>
                    {(presupuestoAcumulado - costoMensual).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                      }
                    )}
                  </strong>
                  <br />
                  <strong>
                    {(
                      100 -
                      (costoMensual * 100) / presupuestoAcumulado
                    ).toFixed(2) + "%"}
                  </strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>

            {/* detalle colab */}
            <div>
              <CircularProgressbarWithChildren
                value={100}
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
                  <br></br>
                  <strong>
                    Monetizado:{" "}
                    {datosMes.cantMonetizados ? datosMes.cantMonetizados : 0}
                  </strong>
                  <br></br>
                  <strong>
                    No monetizado:{" "}
                    {datosMes.cantNoMonetizados
                      ? datosMes.cantNoMonetizados
                      : 0}
                  </strong>

                  {/* <br />
                <strong>Colab</strong>
                <br /> */}

                  {/* <strong style={{ fontSize: "18pt" }}>
                  {datosMes.cantColaboradores}
                </strong> */}
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </>
      );
    }
  }

  function ResumenMes() {
    if (isLoadedData) {
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
                              {parseFloat(item.valorHH).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              )}
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
                              {item.horasMiscelaneo
                                ? item.horasMiscelaneo
                                : "0"}
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
            {isLoadedData &&
              detalleMensual.length > 0 &&
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
                        {item.nomEmpleado &&
                        item.nomEmpleado.toString().length <= 15 ? (
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
                              {parseFloat(item.valorHH).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              )}
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
                        {item.nomEmpleado.toString().length <= 18 ? (
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
                              {parseFloat(item.valorHH).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }
                              )}
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
                              {item.horasMiscelaneo
                                ? item.horasMiscelaneo
                                : "0"}
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

      {detalleMensual.length > 0 && detalleMensual[0].idImpugnacionEmp ? (
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
