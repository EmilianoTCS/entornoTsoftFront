import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Card } from "react-bootstrap";
// import "../../../Edd/pages/Smileys/"
export default function DetalleRamoDashboard({
  paramsFechaIni,
  paramsFechaFin,
  estadoCurso,
  ramo,
  setIsActiveDetalleRamo,
}) {
  const [datosRamo, setDatosRamo] = useState([]);
  const [coloresCaras, setColoresCaras] = useState({
    aprobacion: [],
    asistencia: [],
    participacion: [],
  });
  const obtenerDatosEmpleado = () => {
    var url = "pages/listados/AF_listadoDetalleRamo.php";
    var operationUrl = "AF_listadoDetalleRamo";
    const data = {
      idRamo: ramo.idRamo,
    };

    SendDataService(url, operationUrl, data).then((response) => {
      if (response.length === 0) {
        TopAlertsError("01", "No se han encontrado datos con estos parámetros");
        setIsActiveDetalleRamo(false);
      } else {
        setDatosRamo(response);
        console.log(response);

        // setListDatosEmpleadoRamo(response);
      }
    });
  };

  const obtenerConfigColorAF = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF_CARAS_DASHBOARD",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const coloresAprobacion = response
        .filter(
          (item) =>
            item.subTipoConfDato === "RANGO_COLOR_RAMOS_APROBACION_COLAB"
        )
        .sort((a, b) => a.orden - b.orden);

      const coloresAsistencia = response
        .filter(
          (item) =>
            item.subTipoConfDato === "RANGO_COLOR_RAMOS_ASISTENCIA_COLAB"
        )
        .sort((a, b) => a.orden - b.orden);

      const coloresParticipacion = response
        .filter(
          (item) =>
            item.subTipoConfDato === "RANGO_COLOR_RAMOS_PARTICIPACION_COLAB"
        )
        .sort((a, b) => a.orden - b.orden);

      setColoresCaras({
        asistencia: coloresAsistencia,
        aprobacion: coloresAprobacion,
        participacion: coloresParticipacion,
      });
    });
  };

  function agruparPorExamen(data) {
    return data
    .filter((item) => item.nomExamen !== null)
    .reduce((acc, curr) => {
      const examenExistente = acc.find(
        (examen) => examen.nomExamen === curr.nomExamen
      );

      if (examenExistente) {
        // Si el examen ya existe, se suman los valores
        examenExistente.cantAprobados += parseInt(curr.cantAprobados);
        examenExistente.cantReprobados += parseInt(curr.cantReprobados);
        examenExistente.cantExamenes += parseInt(curr.cantExamenes);
      } else {
        // Si es un examen nuevo, se agrega al array de resultado
        acc.push({
          nomExamen: curr.nomExamen,
          cantAprobados: parseInt(curr.cantAprobados),
          cantReprobados: parseInt(curr.cantReprobados),
          cantExamenes: parseInt(curr.cantExamenes),
        });
      }

      return acc;
    }, []);
  }

  function resumenRamo() {
    const cantColab = datosRamo.length;
    let porcAsistencia = datosRamo.reduce(
      (total, cursos) => total + parseFloat(cursos.porcAsistencia),
      0
    );
    let cantSesiones = datosRamo.reduce(
      (total, cursos) => total + parseFloat(cursos.cantSesiones),
      0
    );
    let cantSesionesTerminadas = datosRamo.reduce(
      (total, cursos) => total + parseFloat(cursos.cantSesionesTerminadas),
      0
    );
    // let cantExamenesReprobados = datosRamo.reduce(
    //   (total, cursos) =>
    //     total + parseFloat(cursos.cantReprobados),
    //   0
    // );
    // let cantExamenesAprobados = datosRamo.reduce(
    //   (total, cursos) =>
    //     total + parseFloat(cursos.cantAprobados),
    //   0
    // );
    // let cantExamenesTerminados = cantExamenesAprobados + cantExamenesReprobados
    let cantExamenes = datosRamo.reduce(
      (total, cursos) => total + parseFloat(cursos.cantExamenes),
      0
    );
    // porcAsistencia = porcAsistencia / datosRamo.length;
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            width: "90%",
            margin: "auto",
            justifyContent: "space-around",
          }}
        >
          <Card style={{ width: "250px" }}>
            <Card.Title>
              Total <br></br>colaboradores
            </Card.Title>
            <Card.Body>
              <h1>{cantColab}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "250px" }}>
            <Card.Title>% Asistencia</Card.Title>
            <br></br>
            <Card.Body>
              <h1>{(porcAsistencia / cantColab).toFixed(2)}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "250px" }}>
            <Card.Title>
              Cantidad sesiones<br></br> terminadas
            </Card.Title>
            <Card.Body>
              <h1>{cantSesionesTerminadas + "/" + cantSesiones}</h1>
            </Card.Body>
          </Card>
          <Card style={{ width: "250px" }}>
            <Card.Title>
              Exámenes <br></br>terminados
            </Card.Title>
            <Card.Body>
              <h1>
                {cantExamenes}
              </h1>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }

  function obtenerColorCara(valor, array) {
    if (array) {
      let color = "";

      array.map((item) => {
        if (eval(valor + item.datoNoVisible)) {
          color = (
            <img
              id="faceStyleReferenteTodas"
              src={require(`../../../Edd/pages/Smileys/${item.datoVisible}.png`)}
            ></img>
          );
        }
      });

      return color;
    }
  }

  function detalleColaboradores() {
    if (datosRamo && coloresCaras) {
      return (
        <>
          <h4>Detalle por colaborador</h4>
          <br></br>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
              gap: "10px", // Espacio entre las tarjetas
              margin: "auto", // Centra el grid en la página
              justifyContent: "center", // Centra las tarjetas horizontalmente
              alignItems: "center", // Alinea las tarjetas verticalmente
              width: "60px",
            }}
          >
            {datosRamo.map((item) => (
              <Card style={{ width: "280px" }}>
                {item.nomEmpleado.toString().lenght > 16 ? (
                  <Card.Title style={{ fontSize: "18pt" }}>
                    {item.nomEmpleado}
                  </Card.Title>
                ) : (
                  <Card.Title style={{ fontSize: "18pt" }}>
                    {item.nomEmpleado} <br></br>
                  </Card.Title>
                )}

                <Card.Body>
                  <table style={{ width: "100%", margin: "auto" }}>
                    <tr>
                      <td style={{ width: "60px" }}>
                        <div
                          style={{
                            width: "10px",
                            margin: "auto",
                          }}
                        >
                          {obtenerColorCara(
                            item.porcAprobacion,
                            coloresCaras.aprobacion
                          )}
                        </div>
                      </td>
                      <td style={{ width: "200px", textAlign: "left" }}>
                        <b>{item.porcAprobacion}% Aprobación</b>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "60px" }}>
                        <div
                          style={{
                            width: "10px",
                            margin: "auto",
                          }}
                        >
                          {obtenerColorCara(
                            item.porcAsistencia,
                            coloresCaras.asistencia
                          )}
                        </div>
                      </td>
                      <td style={{ width: "200px", textAlign: "left" }}>
                        {item.porcAsistencia}% Asistencia
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "60px" }}>
                        <div
                          style={{
                            width: "10px",
                            margin: "auto",
                          }}
                        >
                          {obtenerColorCara(
                            item.porcParticipacion,
                            coloresCaras.participacion
                          )}
                        </div>
                      </td>
                      <td style={{ width: "200px", textAlign: "left" }}>
                        {item.porcParticipacion}% Participación
                      </td>
                    </tr>
                  </table>
                  <br></br>
                  {parseFloat(item.porcAprobacion) >
                  parseFloat(item.aux_porcDesaprobadoRamo) ? (
                    <h5 style={{ margin: "auto", width: "120px" }}>Aprobado</h5>
                  ) : (
                    <h5 style={{ margin: "auto", width: "120px" }}>
                      Reprobado
                    </h5>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      );
    }
  }

  function resumenPorcentajesAprobacion() {
    const resultadoAgrupado = agruparPorExamen(datosRamo);

    const cantAprobados = resultadoAgrupado.reduce(
      (total, cursos) => total + parseFloat(cursos.cantAprobados),
      0
    );
    const cantExamenes = resultadoAgrupado.reduce(
      (total, cursos) => total + parseFloat(cursos.cantExamenes),
      0
    );

    const porcAprobGeneral = ((cantAprobados * 100) / cantExamenes).toFixed(2);
    return (
      <>
        <h5>Aprobación por examen</h5>
        <br></br>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: "30px",
            margin: "auto",
            width: "82%",
          }}
        >
          {/* progress bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <table>
              {resultadoAgrupado &&
                resultadoAgrupado.map((item) => (
                  <tr>
                    <td style={{ width: "300px", textAlign: "left" }}>
                      <table>
                        <tr>
                          <td>{item.nomExamen}</td>
                        </tr>
                        <tr>
                          <td>
                            {parseFloat(
                              (item.cantAprobados * 100) / item.cantExamenes
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {item.cantAprobados} &nbsp;
                            {parseFloat(item.cantAprobados) === 1
                              ? "Aprobado"
                              : "Aprobados"}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td>
                      <div>
                        <ProgressBar
                          striped
                          now={parseFloat(
                            (item.cantAprobados * 100) / item.cantExamenes
                          ).toFixed(2)}
                          max={100}
                          style={{ height: "50px", width: "250px" }}
                        >
                          <div
                            style={{
                              width: `${parseFloat(
                                (item.cantAprobados * 100) / item.cantExamenes
                              ).toFixed(2)}%`,
                              height: "100%",
                              backgroundColor: "lightblue",
                            }}
                          />
                        </ProgressBar>
                      </div>
                    </td>
                  </tr>
                ))}

              <br></br>
            </table>
          </div>
          {/* card porc gral  */}
          <div style={{ margin: "auto", width: "220px", padding: "10px" }}>
            <Card>
              <Card.Title>Promedio aprobación del ramo</Card.Title>
              <Card.Body style={{ fontSize: "35pt" }}>
                {porcAprobGeneral}%
              </Card.Body>
            </Card>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    obtenerDatosEmpleado();
    obtenerConfigColorAF();
  }, [ramo]);

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
        {" "}
        <h3>Detalle del ramo</h3>
        <h3>{ramo.nomRamo}</h3>
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
        {resumenRamo()}
        <br></br>
        <br></br>
        {resumenPorcentajesAprobacion()}
        <br></br>
        {detalleColaboradores()}
      </section>
    </>
  );
}
