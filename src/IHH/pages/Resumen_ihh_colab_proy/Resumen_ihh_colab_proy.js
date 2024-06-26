import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import { Button, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import "./styles_res_ihh_colab_proy.css";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import { useRoute } from "wouter";

export default function Resumen_ihh_colab_proy() {
  const [, params] = useRoute(
    "/ihh/Resumen_ihh_colab_proy/:idColaborador/:idProyecto/:fechaInicio/:fechaFin"
  );

  console.log(params);
  const [listadoColaboradores, setListadoColaboradores] = useState([]);
  // const [listadoDatosResumen, setListadoDatosResumen] = useState([
  //   {"mes":"202401","nomProyecto":"TDM SECURITY","cantHH":"40","cantHHEE":"2","cantColab":"3"},
  //   {"mes":"202401","nomProyecto":"BCH TEST","cantHH":"35","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202401","nomProyecto":"FROMSOFTWARE","cantHH":"50","cantHHEE":"2","cantColab":"3"},
  //   {"mes":"202401","nomProyecto":"NINTENDO","cantHH":"43","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202402","nomProyecto":"NINTENDO","cantHH":"100","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202402","nomProyecto":"TDM SECURITY","cantHH":"60","cantHHEE":"3","cantColab":"3"},
  //   {"mes":"202403","nomProyecto":"TDM SECURITY","cantHH":"80","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202403","nomProyecto":"FROMSOFTWARE","cantHH":"80","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202404","nomProyecto":"MAT LAM TAM","cantHH":"80","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202405","nomProyecto":"TDM SECURITY","cantHH":"496","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202405","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202406","nomProyecto":"SUB-EX","cantHH":"138","cantHHEE":"0","cantColab":"3"},
  //   {"mes":"202406","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202407","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202408","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202409","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202410","nomProyecto":"MAT LAM TAM","cantHH":"168","cantHHEE":"0","cantColab":"1"},
  //   {"mes":"202411","nomProyecto":"FASTFIX","cantHH":"336","cantHHEE":"0","cantColab":"2"},
  //   {"mes":"202412","nomProyecto":"FASTFIX","cantHH":"336","cantHHEE":"0","cantColab":"2"},
  //   {"mes":"202404","nomProyecto":"TDM SECURITY","cantHH":"80","cantHHEE":"0","cantColab":"3"},
  // ]);
  const [listadoDatosResumen, setListadoDatosResumen] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(params.fechaInicio);
  const [fechaFin, setFechaFin] = useState(params.fechaFin);
  const [idColaborador, setIdColaborador] = useState(params.idColaborador);
  const [nombreColaborador, setNombreColaborador] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [listadoProyectos, setListadoProyectos] = useState([]);
  const [idProyecto, setIdProyecto] = useState(params.idProyecto);
  const [nombreProyecto, setNombreProyecto] = useState(null);

  // Obtiene el listado de colaboradores para alimentar el data list
  function obtenerColaboradores() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListadoColaboradores(response);
      // Busca el nombre del colaborador basado en el ID
      const colaborador = response.find(
        (item) => item.idEmpleado === params.idColaborador
      );
      if (colaborador) {
        setNombreColaborador(colaborador.nomEmpleado);
      }
    });
  }

  function obtenerProyectos() {
    const url = "pages/auxiliares/listadoProyectosActivosForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListadoProyectos(response);
      // Busca el nombre del proyecto basado en el ID
      const proyecto = response.find(
        (item) => item.idEDDProyecto === params.idProyecto
      );
      if (proyecto) {
        setNombreProyecto(proyecto.nomProyecto);
      }
    });
  }


  //Verifica que los parámetros enviados para la búsqueda sean válidos
  function validarFiltros(data) {
    let errores = false;
    if (!data.fechaInicio || !data.fechaFin) {
      errores = true;
      TopAlertsError(
        "01",
        "Las fechas de inicio y fin no pueden estar vacías."
      );
    } else if (new Date(data.fechaInicio) > new Date(data.fechaFin)) {
      errores = true;
      TopAlertsError(
        "02",
        "La fecha de inicio no puede ser mayor a la fecha de fin."
      );
    } else if (!data.idColaborador) {
      TopAlertsError("03", "El colaborador no puede estar vacío.");
      errores = true;
    }
    return errores;
  }

  // Envía los datos al servidor y capta la respuesta
  function SendData() {
    const url = "pages/listados/ihh_listado_resumen_colab_mes.php";
    const operationUrl = "ihh_listado_resumen_colab_mes";
    const data = {
      idColaborador: idColaborador,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      idProyecto: idProyecto,
    };
    if (!validarFiltros(data)) {
      SendDataService(url, operationUrl, data).then((response) => {
        setListadoDatosResumen(response);
      });
    }
  }

  //Convierte el formato YYYYMM a MES AÑO
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
      const fechaFormateada = mesNombre + " " + anio;
      return fechaFormateada;
    }
  }

  useEffect(() => {
    obtenerColaboradores();
    obtenerProyectos();
    SendData();
  }, []);

  const groupedData = listadoDatosResumen.reduce((acc, item) => {
    const proyecto = item.nomProyecto;
    const mes = convertirFecha(item.mes);
    if (!acc[proyecto]) {
      acc[proyecto] = [];
    }
    acc[proyecto].push({
      mes,
      cantHH: item.cantHH,
      cantHHEE: item.cantHHEE,
      cantColab: item.cantColab,
    });
    return acc;
  }, {});

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <Header />
        <br />
        <section className="containerTitulo_ihh_res_colab_mes">
          <h2>Resumen de carga de horas por colaborador y proyecto</h2>
        </section>
        <br />
        <section>
          <div className="cl_container_filtros_res_ihh_colab_mes">
            <div className="container_inputs_filtros">
              <label>Nombre colaborador</label>
              <input
                list="colaboradores"
                className="input_colaborador"
                placeholder="Busca un colaborador TSOFT"
                defaultValue={nombreColaborador || ""}
                onChange={(event) => {
                  const selectedNombre = event.target.value;
                  const selectedEmpleado = listadoColaboradores.find(
                    (item) => item.nomEmpleado === selectedNombre
                  );
                  if (selectedEmpleado) {
                    setNombreColaborador(selectedEmpleado.nomEmpleado);
                    setIdColaborador(selectedEmpleado.idEmpleado);
                  }
                }}
              ></input>
              <datalist id="colaboradores">
                {listadoColaboradores.map((item) => (
                  <option
                    key={item.idEmpleado}
                    value={item.nomEmpleado}
                  ></option>
                ))}
              </datalist>
            </div>
            {/* proyectos */}
            <div className="container_inputs_filtros">
              <label>Nombre proyecto (opcional)</label>
              <input
                list="listProyectosActivos"
                className="input_proyectos"
                defaultValue={nombreProyecto || ""}
                placeholder="Busca un proyecto"
                onChange={(event) => {
                  const selectedNombre = event.target.value;
                  if (selectedNombre === "Todos") {
                    setIdProyecto(null);
                  } else {
                    const selectedProyecto = listadoProyectos.find(
                      (item) => item.nomProyecto === selectedNombre
                    );
                    if (selectedProyecto) {
                      setIdProyecto(selectedProyecto.idEDDProyecto);
                      setNombreProyecto(selectedProyecto.nomProyecto);
                    }
                  }
                }}
              ></input>

              <datalist id="listProyectosActivos">
                <option key={null} value={"Todos"}></option>
                {listadoProyectos.map((item) => (
                  <option
                    key={item.idEDDProyecto}
                    value={item.nomProyecto}
                  ></option>
                ))}
              </datalist>
            </div>
            <div>
              <label>Fecha inicio desde:</label>
              <input
                className="form-control"
                type="date"
                value={fechaInicio || ""}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label>Fecha fin desde:</label>
              <input
                className="form-control"
                type="date"
                value={fechaFin || ""}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="container_btn_buscar">
              <Button className="btn_buscar" onClick={() => SendData()}>
                Buscar
              </Button>
              <br />
            </div>
          </div>
        </section>
        <br />
        <section className="sctn_res_ihh_colab_mes">
          <Table hover responsive className="tbl_res_ihh_colab_mes">
            <thead>
              <tr>
                <th className="th_nomProyecto">Nombre proyecto</th>
                <th className="th_mes">Mes</th>
                <th className="th_num">Cant HH acumuladas</th>
                <th className="th_num">Cant HHEE acumuladas</th>
                {/* <th className="th_operaciones">Operaciones</th> */}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((proyecto, index) => {
                const meses = groupedData[proyecto];
                return meses.map((item, i) => (
                  <tr key={index + "-" + i}>
                    {i === 0 && (
                      <td className="td_nomProyecto" rowSpan={meses.length}>
                        {proyecto}
                      </td>
                    )}
                    <td className="td_mes">{item.mes}</td>
                    <td className="td_num_right_text">{item.cantHH}</td>
                    <td className="td_num_right_text">{item.cantHHEE}</td>
                    {/* <td className="td_operaciones">
                      <Link>
                        <Button
                          data-title="Detalle de movimientos mensuales"
                          id="OperationBtns"
                          style={{ color: "black" }}
                        >
                          link
                        </Button>
                      </Link>
                    </td> */}
                  </tr>
                ));
              })}
            </tbody>
          </Table>
          <br />
        </section>
      </>
    ) : (
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login" />
  );
}
