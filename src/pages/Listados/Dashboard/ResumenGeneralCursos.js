import React, { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DetalleCursoDashboard from "./DetalleCursoDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ResumenGeneralCursos({
  datosCursos,
  paramsFechaIni,
  paramsFechaFin,
  colores,
  estadoCurso,
}) {
  const [curso, setCurso] = useState({
    nomCurso: "",
    idCurso: "",
  });
  const [isActiveDetalleCurso, setIsActiveDetalleCurso] = useState(false);

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    if (isActiveDetalleCurso) {
      componenteRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActiveDetalleCurso]);

  function obtenerColorCara(valor, array) {
    if (array) {
      let color = "";
      array.map((item) => {
        if (eval(valor + item.datoNoVisible)) {
          color = item.datoVisible;
        }
      });

      return color;
    }
  }

  function transformarFecha(fecha) {
    // Separar la fecha por el guión "-"
    const [anio, mes, dia] = fecha.split("-");

    // Retornar la fecha en el formato dd-mm-yyyy
    return `${dia}-${mes}-${anio}`;
  }

  paramsFechaIni = transformarFecha(paramsFechaIni);
  paramsFechaFin = transformarFecha(paramsFechaFin);

  function resumenGeneral() {
    const cantColab = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantColaboradores),
      0
    );
    const cantCursosTerminados = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantCursosTerminados),
      0
    );
    const cantCursos = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantInscripciones),
      0
    );
    const porcCursosTerminados = (
      (cantCursosTerminados * 100) /
      cantCursos
    ).toFixed(2);

    const cantDesertores = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantDesertores),
      0
    );
    const porcDesertores = ((cantDesertores * 100) / cantColab).toFixed(2);
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "auto",
            width: "95%",
            gap: "10px",
          }}
        >
          <Card style={{ width: "200px" }}>
            <Card.Title>Total colaboradores</Card.Title>
            <Card.Body>
              <h1>{cantColab}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "200px" }}>
            <Card.Title>Cantidad cursos terminados</Card.Title>
            <Card.Body>
              <h1>{cantCursosTerminados + "/" + cantCursos}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "200px" }}>
            <Card.Title>% Cursos terminados</Card.Title>
            <Card.Body>
              <h1>{porcCursosTerminados}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "200px" }}>
            <Card.Title>Cantidad desertores</Card.Title>
            <Card.Body>
              <h1>{cantDesertores}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "200px" }}>
            <Card.Title>% Desertores </Card.Title>
            <br></br>
            <Card.Body>
              <h1>{porcDesertores}</h1>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }

  function handlerClickBarras(item) {
    setIsActiveDetalleCurso(false); // reinicio el estado del booleano
    setCurso({
      nomCurso: item.nomCurso,
      idCurso: item.idCurso,
    });
    setIsActiveDetalleCurso(true);
  }
  function GraficoAprobacionCursos() {
    const labels = datosCursos.map((curso) => {
      const words = curso.nomCurso.split(" ");

      // Si el nombre del curso tiene más de 3 palabras, agrupar cada dos palabras
      let label;
      if (words.length > 3) {
        label = [];
        for (let i = 0; i < words.length; i += 2) {
          label.push(words.slice(i, i + 2).join(" "));
        }
      } else {
        // Si el nombre es corto, mantenerlo tal cual
        label = [curso.nomCurso];
      }

      // Agregar el porcentaje de aprobación al último elemento del array
      label.push(
        `${curso.cantAprobados}/${curso.cantColaboradores} Aprobado(s)`
      );
      label.push(`${curso.porcAprobacionGeneral}%`);

      return label;
    });

  

    const dataAprobacion = {
      data: datosCursos.map((curso) => parseFloat(curso.porcAprobacionGeneral)),
      colores: datosCursos.map((curso) =>
        obtenerColorCara(parseFloat(curso.porcAprobacionGeneral), colores.coloresGral)
      ),
    };


    // Datos para Chart.js
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Porcentaje de Aprobación",
          data: dataAprobacion.data,
          backgroundColor: dataAprobacion.colores,
          borderColor: dataAprobacion.colores,
          borderWidth: 1,
        },
      ],
    };

    const options = {
      indexAxis: "y", // Barras horizontales
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false, // Desactivar el tooltip
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const cursoSeleccionado = datosCursos[index];
          handlerClickBarras(cursoSeleccionado);
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100, // El porcentaje máximo es 100
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },
    };

    return (
      <div>
        <h5>Aprobación por curso</h5>
        <p style={{ fontSize: "10pt" }} data-html2canvas-ignore="true">
          (click para mas información)
        </p>
        <Bar data={data} options={options} />
      </div>
    );
  }

  function graficos() {
    const cantColab = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantColaboradores),
      0
    );
    const cantAprobados = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantAprobados),
      0
    );
    const cantDesaprobados = datosCursos.reduce(
      (total, cursos) => total + parseFloat(cursos.cantDesaprobados),
      0
    );
    const porcAprobados = ((cantAprobados * 100) / cantColab).toFixed(2);
    const porcDesaprobados = ((cantDesaprobados * 100) / cantColab).toFixed(2);

    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            // gridTemplateColumns: "repeat(2, 1fr)",
            gap: "50px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            width: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              textAlign: "left",
            }}
          >
            <h5>Resumen general colaboradores</h5>
            {/* aprob general */}
            {/* <div>
              <p style={{ margin: "2px" }}>Promedio de aprobación</p>
              <p style={{ margin: "2px" }}>{porcAprobados}%</p>
              <ProgressBar
                striped
                now={porcAprobados}
                style={{ height: "20px" }}
              >
                <div
                  style={{
                    width: `${porcAprobados}%`,
                    height: "100%",
                    backgroundColor: colores.aprobGral[0].datoVisible,
                  }}
                />
              </ProgressBar>
            </div>
            <br></br> */}

            {/* cant aprobados */}
            <div>
              <p style={{ margin: "2px" }}>
                Cantidad de aprobados: {cantAprobados}
              </p>
              <p style={{ margin: "2px" }}>{porcAprobados}%</p>
              <ProgressBar striped now={cantColab} style={{ height: "20px" }}>
                <div
                  style={{
                    width: `${porcAprobados}%`,
                    height: "100%",
                    backgroundColor: colores.aprobados[0].datoVisible,
                  }}
                />
              </ProgressBar>
            </div>
            <br></br>
            {/* cant desaprobados */}
            <div>
              <p style={{ margin: "2px" }}>
                Cantidad de reprobados: {cantDesaprobados}
              </p>
              <p style={{ margin: "2px" }}>{porcDesaprobados}%</p>
              <ProgressBar
                striped
                now={porcDesaprobados}
                style={{ height: "20px" }}
              >
                <div
                  style={{
                    width: `${porcDesaprobados}%`,
                    height: "100%",
                    backgroundColor: colores.desaprobados[0].datoVisible,
                  }}
                />
              </ProgressBar>
            </div>
          </div>
          {/* barchart */}
          <div style={{ width: "600px" }}>{GraficoAprobacionCursos()}</div>
        </div>
      </>
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
        <h3>Resumen general de cursos</h3>
        <table
          style={{ width: "85%", margin: "auto", borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha inicio:</b>
                </td>
                <td>{paramsFechaIni}</td>
              </td>
              <td>|</td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha fin:</b>
                </td>
                <td>{paramsFechaFin}</td>
              </td>
              <td>|</td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Estado curso:</b>
                </td>
                <td>{estadoCurso}</td>
              </td>
            </tr>
          </tbody>
        </table>
        <br></br>
        {resumenGeneral()}
        <br></br>
        <br></br>
        {graficos()}
      </section>
      <br></br>
      <br></br>
      <div ref={componenteRef}>
        {isActiveDetalleCurso && (
          <DetalleCursoDashboard
            curso={curso}
            paramsFechaFin={paramsFechaFin}
            paramsFechaIni={paramsFechaIni}
            estadoCurso={estadoCurso}
          ></DetalleCursoDashboard>
        )}
      </div>
    </>
  );
}
