import React, { useState } from "react";
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
  
    // Sumar los valores totales para cada categoría
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
  
    // Datos y etiquetas del gráfico acumulado
    const labels = [
      [
        "Presupuesto Total",
        totalPptoOperativo.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
        }),
        "100%",
      ],
      [
        "Costo Total",
        totalCostoTotal.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
        }),
        ((totalCostoTotal * 100) / totalPptoOperativo).toFixed(2) + "%",
      ],
      [
        "Saldo Presupuesto",
        totalSaldoPresupuesto.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
        }),
        ((totalSaldoPresupuesto * 100) / totalPptoOperativo).toFixed(2) + "%",
      ],
    ];
    const data = [totalPptoOperativo, totalCostoTotal, totalSaldoPresupuesto];
  
    // Configuración del gráfico
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
          ], // Colores para cada barra
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false, // Para ajustar la altura del gráfico
      indexAxis: "y", // Barras horizontales
      plugins: {
        legend: {
          display: false, // No mostrar la leyenda
        },
        tooltip: {
          enabled: false, // Deshabilitar tooltips
        },
      },
      hover: {
        mode: null, // Deshabilitar hover
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
  
    // Renderizar el gráfico
    return (
      <div
        style={{
          width: "60%", // Ajustar el ancho del contenedor
          height: "300px", // Ajustar la altura del gráfico
          margin: "auto", // Centrar el gráfico
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    );
  }
  

    function ResumenProyectos() {
      const handleCardClick = (item) => {
        setDatosProyecto({
          nomProyecto: item.nomProyecto,
          idEDDProyecto: item.idEDDProyecto,
          pptoOperativo: item.pptoOperativo,
          saldoPresupuesto: item.saldoPresupuesto,
          costoTotal: item.costoTotal,
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

                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Ppto -{" "}
                      {ppto.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      - (100%)
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

                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Costo -{" "}
                      {costo.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      - ({verificarValor(porcentajeCosto)}%)
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

                  <div style={{ width: "100%", marginBottom: "5px" }}>
                    <p>
                      Saldo -{" "}
                      {saldo.toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      - ({verificarValor(porcentajeSaldo)}%)
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
        <EstadoProyecto
          datosProyecto={datosProyecto}
          paramsFechaFin={paramsFechaFin}
          paramsFechaIni={paramsFechaIni}
          tipoImpugnacion={tipoImpugnacion}
          estadoProyecto={estadoProyecto}
          colores={colores}
        />
      )}
    </>
  );
}
