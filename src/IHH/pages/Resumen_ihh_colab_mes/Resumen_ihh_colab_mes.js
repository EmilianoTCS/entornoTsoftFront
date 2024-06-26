import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import { Button, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import "./styles_res_ihh_colab_mes.css";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import { useRoute } from "wouter";

export default function Resumen_ihh_colab_mes() {
  const [, params] = useRoute(
    "/ihh/Resumen_ihh_colab_mes/:idColaborador/:idProyecto/:fechaInicio/:fechaFin"
  );
  const [listadoColaboradores, setListadoColaboradores] = useState([]);
  const [listadoDatosResumen, setListadoDatosResumen] = useState([]);
  const [listadoProyectos, setListadoProyectos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(params.fechaInicio);
  const [fechaFin, setFechaFin] = useState(params.fechaFin);
  const [idColaborador, setIdColaborador] = useState(params.idColaborador);
  const [nombreColaborador, setNombreColaborador] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
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
        console.log(response);
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

  // Agrupa los proyectos de acuerdo al mes
  const groupedData = listadoDatosResumen.reduce((acc, item) => {
    const mes = convertirFecha(item.mes);
    if (!acc[mes]) {
      acc[mes] = [];
    }
    acc[mes].push(item);
    return acc;
  }, {});

  // ordena los proyectos alfabéticamente
  Object.keys(groupedData).forEach((mes) => {
    groupedData[mes].sort((a, b) => a.nomProyecto.localeCompare(b.nomProyecto));
  });

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <Header />
        <br />
        <section className="containerTitulo_ihh_res_colab_mes">
          <h2>Resumen de carga de horas por colaborador y mes</h2>
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
                <th className="th_mes">Mes</th>
                <th className="th_nomProyecto">Nombre proyecto</th>
                <th className="th_num">Cant HH acumuladas</th>
                <th className="th_num">Cant HHEE acumuladas</th>
                {/* <th className="th_operaciones">Operaciones</th> */}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((mes, index) => {
                const projects = groupedData[mes];
                return projects.map((item, i) => (
                  <tr key={index + "-" + i}>
                    {i === 0 && (
                      <td className="td_mes" rowSpan={projects.length}>
                        {mes}
                      </td>
                    )}
                    <td className="td_nomProyecto">{item.nomProyecto}</td>
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
