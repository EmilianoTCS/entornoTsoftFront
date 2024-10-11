import React, { useState, useEffect, useRef } from "react";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import { Card, Table } from "react-bootstrap";
import Paginador from "../../../templates/Paginador/Paginador";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./DashboardAF.css";
import DetalleRamoDashboard from "./DetalleRamoDashboard";
export default function DetalleCursoDashboard({
  curso,
  paramsFechaIni,
  paramsFechaFin,
  estadoCurso,
}) {
  const [listDatosCurso, setListDatosCurso] = useState();
  const [listDatosEmpleadoRamo, setListDatosEmpleadoRamo] = useState();
  const [num_boton, setNumBoton] = useState(1);
  const cantidadPorPagina = 5;
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [isActiveDetalleRamo, setIsActiveDetalleRamo] = useState(false);
  const [ramo, setRamo] = useState([]);

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    componenteRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isActiveDetalleRamo, ramo]);

  function transformarFecha(fecha) {
    // Separar la fecha por el guión "-"
    const [dia, mes, anio] = fecha.split("-");

    // Retornar la fecha en el formato yyyy-mm-dd
    return `${anio}-${mes}-${dia}`;
  }
  const obtenerDatosProyectos = () => {
    var url = "pages/listados/AF_listado_resumenGralRamo.php";
    var operationUrl = "AF_listado_resumenGralRamo";
    const data = {
      idCurso: curso.idCurso,
      fechaInicio: transformarFecha(paramsFechaIni),
      fechaFin: transformarFecha(paramsFechaFin),
      estadoRamo: estadoCurso,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      if (response.length === 0) {
        TopAlertsError(
          "01",
          "No se han encontrado cursos con estos parámetros"
        );
      } else {
        setListDatosCurso(response);
        BarrasPorRamo();
      }
    });
  };

  const obtenerDatosEmpleadoRamo = () => {
    var url = "pages/listados/AF_listadoEmpleadoRamo.php";
    var operationUrl = "AF_listadoEmpleadoRamo";
    const data = {
      idCurso: curso.idCurso,
      cantidadPorPagina: cantidadPorPagina,
      num_boton: num_boton,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      if (response.length === 0) {
        TopAlertsError("01", "No se han encontrado datos con estos parámetros");
      } else {
        const { paginador, ...datos } = response;
        setCantidadPaginas(paginador.cantPaginas);
        setListDatosEmpleadoRamo(datos.datos);
      }
    });
  };

  function resumenGeneral() {
    if (listDatosCurso) {
      const cantColab = listDatosCurso.reduce(
        (total, cursos) => total + parseFloat(cursos.cantColaboradores),
        0
      );
      const cantRamosTerminados = listDatosCurso.reduce(
        (total, cursos) => total + parseFloat(cursos.cantRamosTerminados),
        0
      );
      const cantRamos = listDatosCurso.reduce(
        (total, cursos) => total + parseFloat(cursos.cantRamos),
        0
      );
      const porcRamosTerminados = (
        (cantRamosTerminados * 100) /
        cantRamos
      ).toFixed(2);

      const cantDesertores = listDatosCurso.reduce(
        (total, cursos) => total + parseFloat(cursos.cantDesertores),
        0
      );
      const cantAprobados = listDatosCurso.reduce(
        (total, cursos) => total + parseFloat(cursos.cantAprobados),
        0
      );
      const porcDesertores = ((cantDesertores * 100) / cantColab).toFixed(2);
      const porcAprobados = ((cantAprobados * 100) / cantColab).toFixed(2);
      return (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              width: "80%",
              gap: "10px",
            }}
          >
            <Card style={{ width: "200px" }}>
              <Card.Title>
                Total <br></br> colaboradores
              </Card.Title>
              <Card.Body>
                <h1>{cantColab}</h1>
              </Card.Body>
            </Card>{" "}
            <Card style={{ width: "200px" }}>
              <Card.Title>
                % Colaboradores <br></br> aprobados
              </Card.Title>
              <Card.Body>
                <h1>{porcAprobados}</h1>
              </Card.Body>
            </Card>
            <Card style={{ width: "200px" }}>
              <Card.Title>Cantidad ramos terminados</Card.Title>
              <Card.Body>
                <h1>{cantRamosTerminados + "/" + cantRamos}</h1>
              </Card.Body>
            </Card>
            <Card style={{ width: "200px" }}>
              <Card.Title>
                % Ramos <br></br> terminados
              </Card.Title>
              <Card.Body>
                <h1>{porcRamosTerminados}</h1>
              </Card.Body>
            </Card>
          </div>
        </>
      );
    }
  }

  function TablaDatosEmpleadoRamo() {
    if (listDatosEmpleadoRamo) {
      return (
        <>
          <h5>Detalle de colaboradores por ramo</h5>
          <br></br>
          <table>
            <thead>
              <th style={{ textAlign: "left", width: "250px" }}>
                Nombre colaborador
              </th>
              <th style={{ textAlign: "left", width: "250px" }}>Nombre ramo</th>
              <th style={{ textAlign: "right", width: "250px" }}>
                % Aprobación
              </th>
              <th style={{ textAlign: "right", width: "250px" }}>
                % Participación
              </th>
              <th style={{ textAlign: "right", width: "250px" }}>
                % Asistencia
              </th>
            </thead>
            <tbody>
              {listDatosEmpleadoRamo &&
                listDatosEmpleadoRamo.map((item) => (
                  <tr key={item.idCursoAlumnoRamo}>
                    <td style={{ textAlign: "left", width: "250px" }}>
                      {item.nomEmpleado}
                    </td>
                    <td style={{ textAlign: "left", width: "250px" }}>
                      {item.nomRamo}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.porcAprobacion}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.porcParticipacion}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.porcAsistencia}
                    </td>
                  </tr>
                ))}
            </tbody>
            <br></br>
          </table>

          <div style={{ marginTop: "-30px" }} data-html2canvas-ignore="true">
            <Paginador
              paginas={cantidadPaginas}
              cambiarNumero={setNumBoton}
              num_boton={num_boton}
            ></Paginador>
          </div>
        </>
      );
    }
  }

  function handlerClickBarras(item) {
    setRamo(item);
    setIsActiveDetalleRamo(true);
  }
  const verificarValor = (valor) => {
    return isNaN(valor) ? 0.0 : valor;
  };
  function BarrasPorRamo() {
    return (
      <>
        <h5>Asistencia y progreso general por ramo</h5>
        <p data-html2canvas-ignore="true">(Click para más información)</p>
        <br></br>
        {listDatosCurso &&
          listDatosCurso.map((item) => (
            <div>
              {/* // general */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "50px",
                  margin: "auto",
                  width: "90%",
                  justifyContent: "space-around",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                key={item.idRamo}
                onClick={() => handlerClickBarras(item)}
                className="div-hover"
              >
                {/* container barras */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  {/* barra 1 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "20px",
                      justifyContent: "space-between",
                      verticalAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        margin: "auto",
                        width: "160px",
                        textAlign: "left",
                      }}
                    >
                      <h6 style={{ margin: "auto" }}>
                        {item.porcAsistenciaGeneral}% Asistencia
                      </h6>
                    </div>
                    <ProgressBar
                      striped
                      now={item.porcAsistenciaGeneral}
                      max={100}
                      style={{ height: "30px", width: "300px" }}
                    >
                      <div
                        style={{
                          width: `${item.porcAsistenciaGeneral}%`,
                          height: "100%",
                          backgroundColor: "lightblue",
                        }}
                      />
                    </ProgressBar>
                  </div>

                  {/* barra 2 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                    }}
                  >
                    <div
                      style={{
                        margin: "auto",
                        width: "160px",
                        textAlign: "left",
                      }}
                    >
                      <h6 style={{ margin: "auto" }}>
                        {verificarValor(
                          parseFloat(
                            (item.cantSesionesRealizadas * 100) /
                              item.cantSesionesRamo
                          )
                        ).toFixed(2)}
                        % Terminado <br></br>
                        {item.cantSesionesRealizadas}/{item.cantSesionesRamo}{" "}
                        Sesiones
                      </h6>
                    </div>
                    <ProgressBar
                      striped
                      now={verificarValor(
                        parseFloat(
                          (item.cantSesionesRealizadas * 100) /
                            item.cantSesionesRamo
                        ).toFixed(2)
                      )}
                      style={{ height: "30px", width: "300px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(
                            parseFloat(
                              (item.cantSesionesRealizadas * 100) /
                                item.cantSesionesRamo
                            ).toFixed(2)
                          )}%`,
                          height: "100%",
                          backgroundColor: "lightsalmon",
                        }}
                      />
                    </ProgressBar>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "black",
                    width: "2px",
                    height: "110px",
                  }}
                ></div>
                <div>
                  <h4 style={{ margin: "0px 40px 30px 0px", width: "150px" }}>
                    {item.nomRamo}
                  </h4>
                </div>
              </div>
            </div>
          ))}
      </>
    );
  }

  useEffect(() => {
    obtenerDatosProyectos();
    obtenerDatosEmpleadoRamo();
    setIsActiveDetalleRamo(false);
  }, [curso]);

  useEffect(() => {
    BarrasPorRamo(); // Se ejecuta con la versión más reciente de 'listDatosCurso'
  }, [listDatosCurso]); // Se ejecuta cuando cambia 'listDatosCurso'

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
        <h3>Detalle del curso</h3>
        <h3>{curso.nomCurso}</h3>
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
        {/* <br></br>
        {TablaDatosEmpleadoRamo()} */}
        <br></br>
        {BarrasPorRamo()}
      </section>
      <br></br>
      <br></br>
      <div ref={componenteRef}>
        {isActiveDetalleRamo && (
          <DetalleRamoDashboard
            estadoCurso={estadoCurso}
            paramsFechaFin={paramsFechaFin}
            paramsFechaIni={paramsFechaIni}
            ramo={ramo}
            setIsActiveDetalleRamo={setIsActiveDetalleRamo}
          ></DetalleRamoDashboard>
        )}
      </div>
    </>
  );
}
