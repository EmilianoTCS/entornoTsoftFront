import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./ResumenDashboardIHH.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import EstadoProyecto from "./EstadoProyecto";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EstadoGeneralProy({
  datosProyectos, // Un array con los datos de todos los proyectos
  paramsFechaIni,
  paramsFechaFin,
  tipoImpugnacion,
  estadoProyecto,
  colores,
}) {
  const [isActiveEstadoProyecto, setIsActiveEstadoProyecto] = useState(false);
  const [datosProyecto, setDatosProyecto] = useState({
    nomProyecto: "",
    idEDDProyecto: "",
    pptoOperativo: "",
    saldoPresupuesto: "",
    costoTotal: "",
    fechaIniProyecto: "",
    fechaFinProyecto: "",
    cantColaboradores: "",
    cantMonetizados: "",
    cantNoMonetizados: "",
  });

  paramsFechaIni = transformarFecha(paramsFechaIni);
  paramsFechaFin = transformarFecha(paramsFechaFin);

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    if (isActiveEstadoProyecto) {
      componenteRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActiveEstadoProyecto, datosProyecto]);

  function transformarFecha(fecha) {
    // Separar la fecha por el guión "-"
    const [anio, mes, dia] = fecha.split("-");

    // Retornar la fecha en el formato dd-mm-yyyy
    return `${dia}-${mes}-${anio}`;
  }
  // Función que genera el gráfico de barras horizontal acumulado
  function BarChart() {
    // Función auxiliar para manejar valores no numéricos
    const parseToFloat = (value) => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    };

    // Cálculo de valores para el gráfico operativo
    const calcularOperativo = () => {
      const totalPptoOperativo = datosProyectos.reduce(
        (total, proyecto) => total + parseToFloat(proyecto.pptoOperativo),
        0
      );
      const totalCostoTotal = datosProyectos.reduce(
        (total, proyecto) => total + parseToFloat(proyecto.costoTotal),
        0
      );
      const totalSaldoPresupuesto = datosProyectos.reduce(
        (total, proyecto) => total + parseToFloat(proyecto.saldoPresupuesto),
        0
      );

      const labels = [
        [
          "Ppto Total",
          totalPptoOperativo.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
          }),
          "100%",
        ],
        totalCostoTotal !== 0
          ? [
              "Costo Total",
              totalCostoTotal.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
              }),
              ((totalCostoTotal * 100) / totalPptoOperativo).toFixed(2) + "%",
            ]
          : ["Costo Total", "S/I"],
        [
          "Saldo Ppto",
          totalSaldoPresupuesto.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
          }),
          ((totalSaldoPresupuesto * 100) / totalPptoOperativo).toFixed(2) + "%",
        ],
      ];

      const data = [totalPptoOperativo, totalCostoTotal, totalSaldoPresupuesto];
      return { labels, data };
    };

    // Cálculo de valores para el gráfico misceláneo
    const calcularMiscelaneo = () => {
      const totalPptoMiscelaneo = datosProyectos.reduce(
        (total, proyecto) => total + parseToFloat(proyecto.pptoMiscelaneo),
        0
      );
      const totalCostoTotalMiscelaneo = datosProyectos.reduce(
        (total, proyecto) =>
          total + parseToFloat(proyecto.costoTotalMiscelaneo),
        0
      );
      const totalSaldoPresupuestoMiscelaneo = datosProyectos.reduce(
        (total, proyecto) =>
          total + parseToFloat(proyecto.saldoPresupuestoMiscelaneo),
        0
      );

      const labels = [
        [
          "Ppto Total",
          totalPptoMiscelaneo.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
          }),
          "100%",
        ],
        totalCostoTotalMiscelaneo !== 0
          ? [
              "Costo Total",
              totalCostoTotalMiscelaneo.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
              }),
              ((totalCostoTotalMiscelaneo * 100) / totalPptoMiscelaneo).toFixed(
                2
              ) + "%",
            ]
          : ["Costo Total", "S/I"],
        [
          "Saldo Ppto",
          totalSaldoPresupuestoMiscelaneo.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
            minimumFractionDigits: 0,
          }),
          (
            (totalSaldoPresupuestoMiscelaneo * 100) /
            totalPptoMiscelaneo
          ).toFixed(2) + "%",
        ],
      ];

      const data = [
        totalPptoMiscelaneo,
        totalCostoTotalMiscelaneo,
        totalSaldoPresupuestoMiscelaneo,
      ];
      return { labels, data };
    };

    // Configuración de los gráficos
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y", // Barras horizontales
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      hover: {
        mode: null,
      },
      scales: {
        x: {
          ticks: {
            callback: (value) => {
              return value.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
              });
            },
          },
        },
      },
    };

    // Si es operativo
    if (tipoImpugnacion === "OPERATIVO") {
      const { labels, data } = calcularOperativo();

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Totales",
            data: data,
            backgroundColor: [
              colores.ppto[0].datoVisible,
              colores.costo[0].datoVisible,
              colores.saldo[0].datoVisible,
            ],
          },
        ],
      };

      return (
        <div
          style={{
            width: "60%",
            height: "300px",
            margin: "auto",
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      );
    }
    // Si es misceláneo
    else if (tipoImpugnacion === "MISCELANEO") {
      const { labels, data } = calcularMiscelaneo();

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Totales",
            data: data,
            backgroundColor: [
              colores.ppto[0].datoVisible,
              colores.costo[0].datoVisible,
              colores.saldo[0].datoVisible,
            ],
          },
        ],
      };

      return (
        <div
          style={{
            width: "60%",
            height: "300px",
            margin: "auto",
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      );
    }
    // Si no es ni OPERATIVO ni MISCELANEO, renderizar ambos gráficos
    else {
      const operativoData = calcularOperativo();
      const miscelaneoData = calcularMiscelaneo();

      const operativoChartData = {
        labels: operativoData.labels,
        datasets: [
          {
            label: "Operativo Totales",
            data: operativoData.data,
            backgroundColor: [
              colores.ppto[0].datoVisible,
              colores.costo[0].datoVisible,
              colores.saldo[0].datoVisible,
            ],
          },
        ],
      };

      const miscelaneoChartData = {
        labels: miscelaneoData.labels,
        datasets: [
          {
            label: "Misceláneo Totales",
            data: miscelaneoData.data,
            backgroundColor: [
              colores.ppto[0].datoVisible,
              colores.costo[0].datoVisible,
              colores.saldo[0].datoVisible,
            ],
          },
        ],
      };

      return (
        <div>
          <br></br>
          <div
            style={{
              width: "60%",
              height: "300px",
              margin: "auto",
            }}
          >
            <h5>Operativo</h5>
            <Bar data={operativoChartData} options={chartOptions} />
          </div>
          <div
            style={{
              width: "60%",
              height: "300px",
              margin: "auto",
              marginTop: "50px", // Añadir espacio entre gráficos
            }}
          >
            <br></br>
            <h5>Misceláneo</h5>
            <Bar data={miscelaneoChartData} options={chartOptions} />
          </div>
          <br></br>
        </div>
      );
    }
  }

  function ResumenProyectos() {
    const handleCardClick = (item) => {
      setDatosProyecto({
        nomProyecto: item.nomProyecto,
        idEDDProyecto: item.idEDDProyecto,
        pptoOperativo: item.pptoOperativo,
        saldoPresupuesto: item.saldoPresupuesto,
        costoTotal: item.costoTotal,
        pptoMiscelaneo: item.pptoMiscelaneo,
        saldoPresupuestoMiscelaneo: item.saldoPresupuestoMiscelaneo,
        costoTotalMiscelaneo: item.costoTotalMiscelaneo,
        fechaIniProyecto: item.fechaInicio,
        fechaFinProyecto: item.fechaFin,
        cantColaboradores: item.cantColaboradores,
        cantMonetizados: item.cantMonetizados,
        cantNoMonetizados: item.cantNoMonetizados,
      });
      setIsActiveEstadoProyecto(true);
    };

    const verificarValor = (valor) => {
      return isNaN(valor) ? 0 : valor;
    };

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
          gap: "10px", // Espacio entre las tarjetas
          margin: "auto", // Centra el grid en la página
          justifyContent: "center", // Centra las tarjetas horizontalmente
        }}
      >
        {datosProyectos.map((item) => {
          if (tipoImpugnacion === "OPERATIVO") {
            // Verifica si los valores son válidos
            const ppto = parseFloat(item.pptoOperativo) || 0;
            const costo = parseFloat(item.costoTotal) || 0;
            const saldo = parseFloat(item.saldoPresupuesto) || 0;

            const porcentajeCosto = isNaN((costo / ppto) * 100)
              ? 0
              : ((costo / ppto) * 100).toFixed(2);
            const porcentajeSaldo = isNaN((saldo / ppto) * 100)
              ? 0
              : ((saldo / ppto) * 100).toFixed(2);

            return (
              <Card
                key={item.idEDDProyecto}
                className="card-hover"
                style={{
                  width: "320px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title
                  style={{
                    textAlign: "center",
                    paddingTop: "10px",
                    width: "310px",
                  }}
                >
                  {item.nomProyecto.toString().length <= 25 ? (
                    <>
                      {item.nomProyecto}
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <>{item.nomProyecto}</>
                  )}
                </Card.Title>
                <Card.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    marginTop: "-10px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      fontSize: "10pt",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <text>Fecha Ini: {item.fechaInicio}</text>
                    <text>Fecha Fin: {item.fechaFin}</text>
                  </div>

                  {/* ppto */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Ppto:{" "}
                      {ppto.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      <br></br>100%
                    </p>
                    <ProgressBar striped now={100} style={{ height: "15px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: colores.ppto[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>
                  <br></br>

                  {/* costo */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Costo:{" "}
                      {costo === 0 ? (
                        <>
                          S/I
                          <br />
                          0.00%
                        </>
                      ) : (
                        <>
                          {costo.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}{" "}
                          <br />
                          {verificarValor(porcentajeCosto)}%
                        </>
                      )}
                    </p>
                    <ProgressBar
                      striped
                      now={verificarValor(porcentajeCosto)}
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(porcentajeCosto)}%`,
                          height: "100%",
                          backgroundColor: colores.costo[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>
                  <br></br>

                  {/* saldo */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p
                      style={{
                        color: costo > ppto ? "red" : "black",
                      }}
                    >
                      Saldo:{" "}
                      {saldo.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      <br></br>
                      {verificarValor(porcentajeSaldo)}%
                    </p>
                    <ProgressBar
                      striped
                      now={verificarValor(porcentajeSaldo)}
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(porcentajeSaldo)}%`,
                          height: "100%",
                          backgroundColor: colores.saldo[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>
                </Card.Body>
              </Card>
            );
          } else if (tipoImpugnacion === "MISCELANEO") {
            // Verifica si los valores son válidos
            const ppto = parseFloat(item.pptoMiscelaneo) || 0;
            const costo = parseFloat(item.costoTotalMiscelaneo) || 0;
            const saldo = parseFloat(item.saldoPresupuestoMiscelaneo) || 0;

            const porcentajeCosto = isNaN((costo / ppto) * 100)
              ? 0
              : ((costo / ppto) * 100).toFixed(2);
            const porcentajeSaldo = isNaN((saldo / ppto) * 100)
              ? 0
              : ((saldo / ppto) * 100).toFixed(2);

            return (
              <Card
                key={item.idEDDProyecto}
                className="card-hover"
                style={{
                  width: "320px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title
                  style={{
                    textAlign: "center",
                    paddingTop: "10px",
                    width: "310px",
                  }}
                >
                  {item.nomProyecto.toString().length <= 25 ? (
                    <>
                      {item.nomProyecto}
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <>{item.nomProyecto}</>
                  )}
                </Card.Title>
                <Card.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    marginTop: "-10px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      fontSize: "10pt",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <text>Fecha Ini: {item.fechaInicio}</text>
                    <text>Fecha Fin: {item.fechaFin}</text>
                  </div>

                  {/* ppto */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Ppto:{" "}
                      {ppto.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      <br></br>100%
                    </p>
                    <ProgressBar striped now={100} style={{ height: "15px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: colores.ppto[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>
                  <br></br>

                  {/* costo */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Costo:{" "}
                      {costo === 0 ? (
                        <>
                          S/I
                          <br />
                          0.00%
                        </>
                      ) : (
                        <>
                          {costo.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                          <br />
                          {verificarValor(porcentajeCosto)}%
                        </>
                      )}
                    </p>
                    <ProgressBar
                      striped
                      now={verificarValor(porcentajeCosto)}
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(porcentajeCosto)}%`,
                          height: "100%",
                          backgroundColor: colores.costo[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>

                  <br></br>

                  {/* saldo */}
                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p
                      style={{
                        color: costo > ppto ? "red" : "black",
                      }}
                    >
                      Saldo:{" "}
                      {saldo.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      <br></br>
                      {verificarValor(porcentajeSaldo)}%
                    </p>
                    <ProgressBar
                      striped
                      now={verificarValor(porcentajeSaldo)}
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(porcentajeSaldo)}%`,
                          height: "100%",
                          backgroundColor: colores.saldo[0].datoVisible,
                        }}
                      />
                    </ProgressBar>
                  </div>
                </Card.Body>
              </Card>
            );
          } else {
            // Verifica si los valores son válidos
            const ppto = parseFloat(item.pptoOperativo) || 0;
            const pptoMiscelaneo = parseFloat(item.pptoMiscelaneo) || 0;
            const costo = parseFloat(item.costoTotal) || 0;
            const costoMiscelaneo = parseFloat(item.costoTotalMiscelaneo) || 0;
            const saldo = parseFloat(item.saldoPresupuesto) || 0;
            const saldoMiscelaneo =
              parseFloat(item.saldoPresupuestoMiscelaneo) || 0;

            // operativo
            const porcentajeCosto = isNaN((costo / ppto) * 100)
              ? 0
              : ((costo / ppto) * 100).toFixed(2);
            const porcentajeSaldo = isNaN((saldo / ppto) * 100)
              ? 0
              : ((saldo / ppto) * 100).toFixed(2);
            // miscelaneo

            const porcentajeCostoMiscelaneo = isNaN(
              (costoMiscelaneo / pptoMiscelaneo) * 100
            )
              ? 0
              : ((costoMiscelaneo / pptoMiscelaneo) * 100).toFixed(2);
            const porcentajeSaldoMiscelaneo = isNaN(
              (saldoMiscelaneo / pptoMiscelaneo) * 100
            )
              ? 0
              : ((saldoMiscelaneo / pptoMiscelaneo) * 100).toFixed(2);

            return (
              <Card
                key={item.idEDDProyecto}
                className="card-hover"
                style={{
                  width: "320px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title
                  style={{
                    textAlign: "center",
                    paddingTop: "10px",
                    width: "310px",
                  }}
                >
                  {item.nomProyecto.toString().length <= 25 ? (
                    <>
                      {item.nomProyecto}
                      <br></br>
                      <br></br>
                    </>
                  ) : (
                    <>{item.nomProyecto}</>
                  )}
                </Card.Title>
                <Card.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    marginTop: "-10px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      fontSize: "10pt",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <text>Fecha Ini: {item.fechaInicio}</text>
                    <text>Fecha Fin: {item.fechaFin}</text>
                  </div>
                  <h5>Operativo</h5>
                  <div style={{ width: "270px" }}>
                    {/* ppto */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p>
                        Ppto:{" "}
                        {ppto.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}{" "}
                        <br></br>
                        100%
                      </p>
                      <ProgressBar striped now={100} style={{ height: "15px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colores.ppto[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>
                    <br></br>
                    {/* costo */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p>
                        Costo:{" "}
                        {costo === 0 ? (
                          <>
                            S/I
                            <br />
                            0.00%
                          </>
                        ) : (
                          <>
                            {costo.toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}
                            <br />
                            {verificarValor(porcentajeCosto)}%
                          </>
                        )}
                      </p>
                      <ProgressBar
                        striped
                        now={costo === 0 ? 0 : verificarValor(porcentajeCosto)}
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(porcentajeCosto)}%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <br></br>
                    {/* saldo */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p
                        style={{
                          color: costo > ppto ? "red" : "black",
                        }}
                      >
                        Saldo:{" "}
                        {saldo.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                        <br></br>
                        {verificarValor(porcentajeSaldo)}%
                      </p>
                      <ProgressBar
                        striped
                        now={verificarValor(porcentajeSaldo)}
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(porcentajeSaldo)}%`,
                            height: "100%",
                            backgroundColor: colores.saldo[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>
                  </div>

                  <br></br>
                  <h5>Misceláneo</h5>
                  <div style={{ width: "270px" }}>
                    {/* ppto */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p>
                        Ppto:{" "}
                        {pptoMiscelaneo.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}{" "}
                        <br></br>
                        100%
                      </p>
                      <ProgressBar striped now={100} style={{ height: "15px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colores.ppto[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>
                    <br></br>

                    {/* costo */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p>
                        Costo:{" "}
                        {costoMiscelaneo === 0 ? (
                          <>
                            S/I
                            <br />
                            0.00%
                          </>
                        ) : (
                          <>
                            {costoMiscelaneo.toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br />
                            {verificarValor(porcentajeCostoMiscelaneo)}%
                          </>
                        )}
                      </p>
                      <ProgressBar
                        striped
                        now={
                          costoMiscelaneo === 0
                            ? 0
                            : verificarValor(porcentajeCostoMiscelaneo)
                        }
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(
                              porcentajeCostoMiscelaneo
                            )}%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <br></br>

                    {/* saldo */}
                    <div style={{ width: "100%", marginBottom: "5px" }}>
                      <p
                        style={{
                          color:
                            costoMiscelaneo > pptoMiscelaneo ? "red" : "black",
                        }}
                      >
                        Saldo:{" "}
                        {saldoMiscelaneo.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}{" "}
                        <br></br>
                        {verificarValor(porcentajeSaldoMiscelaneo)}%
                      </p>
                      <ProgressBar
                        striped
                        now={verificarValor(porcentajeSaldoMiscelaneo)}
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(
                              porcentajeSaldoMiscelaneo
                            )}%`,
                            height: "100%",
                            backgroundColor: colores.saldo[0].datoVisible,
                          }}
                        />
                      </ProgressBar>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          }
        })}
      </div>
    );
  }

  return (
    <>
      <section
        style={{
          backgroundColor: "white",
          width: "1000px",
          margin: "auto",
          textAlign: "center",
          borderRadius: "30px",
          padding: "20px",
        }}
      >
        <h3>
          Resumen general de proyectos <p>(en CLP)</p>
        </h3>
        <table
          style={{ width: "60%", margin: "auto", borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha inicio:</b>
                </td>
                <td>{paramsFechaIni}</td>
              </td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha fin:</b>
                </td>
                <td>{paramsFechaFin}</td>
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
            <tr>
              <td style={{ textAlign: "left" }}>S/I: Sin impugnación</td>
            </tr>
          </tbody>
        </table>
        <div style={{ width: "100%", margin: "auto" }}>{BarChart()}</div>
        <br></br>
        <br></br>
        <br></br>
        <h3>Detalle por proyecto</h3>
        {ResumenProyectos()}
        <br></br>
        <br></br>
        <br></br>
      </section>
      <br></br>
      {isActiveEstadoProyecto && (
        <div ref={componenteRef}>
          <EstadoProyecto
            datosProyecto={datosProyecto}
            paramsFechaFin={paramsFechaFin}
            paramsFechaIni={paramsFechaIni}
            tipoImpugnacion={tipoImpugnacion}
            estadoProyecto={estadoProyecto}
            colores={colores}
          />
        </div>
      )}
    </>
  );
}
