import React, { useState, useEffect, useMemo, useRef } from "react";
import { Navigate, Link } from "react-router-dom";

import { FaDownload } from "react-icons/fa";
import SendDataService from "../../../services/SendDataService";
import DownloadFilesService from "../../../services/DownloadFilesService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import Spinner from "../../../templates/spinner/spinner";
import { MdDashboard } from "react-icons/md";
import { FaUpload } from "react-icons/fa";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../WordWrap.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import SubirArchivo from "./FormularioSubirArchivo";
import { FaMoneyBill } from "react-icons/fa6";

import ExportCSV from "../../../templates/exports/exportCSV";
import getDataService from "../../../services/GetDataService";

export default function ListadoClientes_test_agGrid() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [idProyecto, setidProyecto] = useState("");
  const [idProyectoSelect, setidProyectoSelect] = useState("");
  const [loadedData, setLoadedData] = useState(false);
  const [isActiveSubirArchivo, setIsActiveSubirArchivo] = useState(false);
  const [idRegistro, setIdRegistro] = useState(0);

  const nombreTabla = "ihhacop";

  const nuevoPresupuestoTotal = "Ingrese un nuevo presupuesto total";
  const nuevoCantTotalMeses = "Ingrese una nueva cantidad total de meses";

  const [filtrados, setFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

  var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const [nombreArchivoCSV, setNombreArchivoCSV] = useState("");

  const [mainList, setMainList] = useState({
    proyectos: [""],
  });
  const [auxList, setAuxList] = useState({
    proyectos: [""],
  });
  const [configDatos, setConfigDatos] = useState([]);
  const [todosDatosIHH, setTodosDatosIHH] = useState([]);

  const [num_boton, setNumBoton] = useState(1);

  // obtener datos

  /**
   * The function `obtenerDatos` sends a request to a specified URL with data parameters, processes the
   * response data, and updates state variables accordingly.
   */
  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idProyecto: idProyecto,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ proyectos: datos.datos });
      setNombreArchivoCSV("listado_acops:" + date);
      setLoadedData(true);
      obtenerRegistrosVencidos(datos.datos);
    });
  };
  /**
   * The function `obtenerProyecto` fetches a list of projects from a specified URL using a data service
   * and updates the state with the retrieved data.
   */
  const obtenerProyecto = () => {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setAuxList({ proyectos: data });
    });
  };
  /**
   * The function `obtenerConfigDatos` sends a request to a PHP file to retrieve configuration data
   * related to budget states.
   */
  const obtenerConfigDatos = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "IHH",
      subTipoConfDato: "ESTADO_PRESUPUESTO",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setConfigDatos(data);
    });
  };

  const obtenerTodosDatosIHH = () => {
    var url = "pages/listados/ihh_listadoTodaInfoIHH.php";
    var operationUrl = "ihh_listadoTodaInfoIHH";
    getDataService(url, operationUrl).then((response) => {
      setTodosDatosIHH(response);
    });
  };
  /**
   * The function "obtenerRegistrosVencidos" filters records based on whether their expiration month and
   * year match the current month and year.
   * @param registros - The function `obtenerRegistrosVencidos` takes an array of `registros` as input.
   * These `registros` represent records or entries with a `fechaFinProy` property that indicates the
   * expiration date of the record.
   * @returns The function `obtenerRegistrosVencidos` is filtering the `registros` array to find records
   * that have a `fechaFinProy` property with a date that matches the current month and year. It then
   * sets the filtered records into a variable `registrosVencidos` and calls a function `setFiltrados`
   * with the filtered records as an argument. The function does
   */

  function obtenerRegistrosVencidos(registros) {
    // Obtener la fecha actual
    var fechaActual = new Date();
    var anioActual = fechaActual.getFullYear(); // Obtener el año actual
    var mesActual = fechaActual.getMonth(); // Obtener el mes actual (0-11)

    // Filtrar los registros cuyo mes de vencimiento coincide con el mes actual
    var registrosVencidos = registros.filter(function (registro) {
      if (registro.fechaFinProy) {
        var partesFecha = registro.fechaFinProy.split("-");
        var mesVencimiento = parseInt(partesFecha[1], 10) - 1; // Convertir el mes a un número entero (los meses en JavaScript son indexados desde 0)
        var anioVencimiento = parseInt(partesFecha[2], 10);
        return mesVencimiento === mesActual && anioVencimiento === anioActual;
      } else {
        return false; // Ignorar registros sin fecha de vencimiento
      }
    });

    setFiltrados(registrosVencidos);
  }
  /**
   * The function `colorEstadoPresupuesto` takes parameters and returns an array of div elements with
   * specific styling based on certain conditions.
   * @param params - It looks like the code snippet you provided is a JavaScript function called
   * `colorEstadoPresupuesto` that takes in a parameter `params`. However, the content of the `params`
   * object is missing in your message. Could you please provide the content of the `params` object so
   * that I can
   * @returns The function `colorEstadoPresupuesto` is returning an array of `<div>` elements with
   * specific styling based on the conditions met in the `configDatos` mapping.
   */
  function colorEstadoPresupuesto(params) {
    var result = [];
    if (configDatos) {
      configDatos.map((item) => {
        if (eval(params.data.saldoRestante + item.datoNoVisible)) {
          result.push(
            <div
              style={{
                width: "20px",
                backgroundColor: item.datoVisible,
                padding: "10px",
                borderRadius: "50%",
                margin: "10px auto",
              }}
            ></div>
          );
        }
      });
      return result;
    }
  }
  // Función para formatear valores numéricos como moneda
  const formatCurrency = (value) => {
    // Expresión regular para dividir la cadena en parte no numérica y parte numérica
    const match = value.match(/^([^0-9-]*)([0-9-]+)$/);

    // Si no hay coincidencias válidas, retornar la cadena original
    if (!match) return value;

    // Partes no numéricas y numéricas de la cadena
    const nonNumericPart = match[1];
    const numericPart = match[2];

    // Remover caracteres que no sean dígitos o el signo negativo
    const number = parseInt(numericPart.replace(/[^\d-]/g, ""), 10);

    // Si el valor no es un número válido, retornar la cadena original
    if (isNaN(number)) return value;

    // Usar Intl.NumberFormat para formatear el número como moneda chilena
    const formattedNumber = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);

    // Retornar la concatenación de la parte no numérica y la parte numérica formateada
    return nonNumericPart + " " + formattedNumber;
  };
  /**
   * The function `LeyendaColores` returns a JSX element displaying color legend for monthly balance
   * data.
   * @returns The function `LeyendaColores` is returning a JSX element, specifically a `div` element with
   * a width of 450px, containing multiple nested `div` elements generated dynamically based on the
   * `configDatos` array. Each nested `div` element represents a color legend item with a colored circle
   * and a text description.
   */
  function LeyendaColores() {
    return (
      <div
        style={{
          width: "400px",
          // backgroundColor: "gray",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          border: "1px solid rgba(0,0,0, 0.3)",
          borderRadius: "20px",
          gap: "10px"
        }}
      >
        {configDatos.map((item) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              width: "130px",
            }}
          >
            <div
              style={{
                width: "20px",
                backgroundColor: item.datoVisible,
                padding: "12px",
                borderRadius: "100%",
                margin: "10px auto",
              }}
            ></div>
            <p style={{ fontSize: "10pt" }}>
              Saldo mensual {formatCurrency(item.datoNoVisible)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  //----- definiciones data grid

  /* The above code is written in JavaScript and it seems to be using the useRef hook from React. The
 useRef hook is used to create a reference to a DOM element or a value that persists across renders.
 In this case, it is creating a reference called gridRef. */
  const gridRef = useRef();

  /* The above code is defining a set of column definitions for an ag-Grid component in a JavaScript
 application. Each column definition specifies the header name, field name, cell styles, cell
 renderer functions, editable status, width, value getters, and other configurations for displaying
 data in the grid. */
  const columnDefs = [
    {
      headerName: "Proyecto",
      field: "nomProyecto",
      colId: "columnaProyecto", // Asignar un ID único a la columna "Total"
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idAcop === null
                ? setidProyectoSelect(e.target.value)
                : // ? insertarAcop({
                  //     ...params,
                  //     idProyecto: e.target.value,
                  //     field: "nomProyecto",
                  //   })

                  editarAcop({
                    ...params,
                    idProyecto: e.target.value,
                    field: "nomProyecto",
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={params.data.idProyecto || idProyectoSelect || ""}
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un proyecto
            </option>
            {auxList.proyectos.map((item) => (
              <option
                key={item.idEDDProyecto}
                selected={
                  params.data.idProyecto === item.idEDDProyecto
                    ? true
                    : idProyectoSelect === item.idEDDProyecto
                    ? true
                    : false
                }
                value={item.idEDDProyecto}
              >
                {item.nomProyecto}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Fecha inicio" + "\n" + "Proyecto",
      field: "fechaIniProy",
      colId: "columnaFechaIni", // Asignar un ID único a la columna "Total"
      editable: false,
      width: 120,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Fecha fin" + "\n" + "Proyecto",
      field: "fechaFinProy",
      colId: "columnaFechaFin", // Asignar un ID único a la columna "Total"
      editable: false,
      width: 110,
      cellStyle: { textAlign: "right" },
      valueGetter: function (params) {
        if (params.data.fechaFinProy === null) {
          return "Indefinida";
        } else {
          return params.data.fechaFinProy;
        }
      },
    },
    {
      headerName: "Presupuesto total",
      field: "presupuestoTotal",
      editable: true,
      colId: "columnaPtotal", // Asignar un ID único a la columna "Total"
      width: 130,
      cellStyle: { textAlign: "right" },
      // valueSetter: (params) => {
      //   return parseFloat(params.data.presupuestoTotal);
      // },
      valueGetter: function (params) {
        if (isNaN(params.data.presupuestoTotal)) {
          return "Cargando...";
        } else {
          return parseFloat(params.data.presupuestoTotal).toLocaleString(
            "es-CL",
            {
              style: "currency",
              currency: "CLP",
            }
          );
        }
      },
    },
    {
      headerName: "Cant. total\n meses",
      field: "mesesRevisados",
      editable: false,
      colId: "columnatotalMeses", // Asignar un ID único a la columna "Total"
      width: 120,
      cellStyle: { textAlign: "right" },
    },
    // {
    //   headerName: "Cant. total\n meses",
    //   field: "cantTotalMeses",
    //   editable: true,
    //   width: 100,
    //   cellStyle: { textAlign: "right" },
    // },
    {
      headerName: "Presupuesto \n mensual",
      field: "presupuestoMen",
      editable: false,
      colId: "columnaPMensual", // Asignar un ID único a la columna "Total"
      cellStyle: { textAlign: "right" },
      width: 130,
      valueGetter: function (params) {
        return parseFloat(params.data.presupuestoMen).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });
      },
    },
    {
      headerName: "Proyecto actualizado mes en curso",
      field: "mesesActualRevisado",
      editable: false,
      cellStyle: { textAlign: "right" },
      colId: "columnaActMesCurso", // Asignar un ID único a la columna "Total"
      width: 180,
      valueGetter: function (params) {
        if (params.data.mesesActualRevisado === "1") {
          return "SÍ";
        } else {
          return "NO";
        }
      },
    },
    {
      headerName: "Estado actual \n presupuesto",
      width: 130,
      colId: "columnaEstadoPresupuesto", // Asignar un ID único a la columna "Total"
      cellRenderer: function (params) {
        return colorEstadoPresupuesto(params);
      },
    },
    // {
    //   headerName: "Valor UF",
    //   field: "valorUF",
    //   editable: false,
    //   width: 100,
    //   cellStyle: { textAlign: "right" },
    //   valueFormatter: (params) => {
    //     return formatNumber(params.value);
    //   },
    // },

    {
      headerName: "Operaciones",
      cellRenderer: function (params) {
        return (
          <div style={{ color: "black" }}>
            <Link to={`/listadoEddProyecto/${params.data.idProyecto}`}>
              <Button
                data-title="Proyecto relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <MdDashboard id="icons" />
              </Button>
            </Link>
            <Link to={`/ihh/detalleProyectos/${params.data.idProyecto}`}>
              <Button
                data-title="Detalle de movimientos mensuales"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <FaMoneyBill id="icons" />
              </Button>
            </Link>
            <Button
              id="OperationBtns"
              onClick={() => {
                setIdRegistro(params.data.idAcop);
                setIsActiveSubirArchivo(true);
              }}
              style={{ color: "black" }}
            >
              <FaUpload id="icons" />
            </Button>

            <DownloadFilesService
              idRegistro={params.data.idAcop}
              nomTabla={"ihh_listadoAcop"}
              baseURL={
                "http://localhost/entornoTsoft/pages/gestorArchivos/seleccionarDocumento.php"
              }
            >
              <FaDownload id="icons" style={{ color: "black" }} />
            </DownloadFilesService>
            <Button
              data-title="Desactivar acop de proyecto"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idAcop)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];
  var gridOptions = {
    // otras configuraciones de AG Grid...
    localeText: {
      noRowsToShow: "No hay filas para mostrar",
    },
    paginationPageSize: cantidadPorPagina,
  };

  /* The above code is creating a new array of objects based on a condition. If `filtroActivo` is true,
it will map over the `filtrados` array and create a new object for each element in the array by
spreading the properties of each `proyecto` object. If `filtroActivo` is false, it will map over the
`mainList.proyectos` array and create a new object for each element in the array by spreading the
properties of each `proyecto` object. The resulting array is stored in the `rowData` variable. */
  const rowData = filtroActivo
    ? filtrados.map((proyecto) => ({
        ...proyecto,
      }))
    : mainList.proyectos.map((proyecto) => ({
        ...proyecto,
      }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  function transformarPresupuesto(presupuestoString) {
    // Eliminar todos los caracteres que no sean dígitos, puntos o signos de menos
    var presupuestoNumerico = parseFloat(
      presupuestoString.replace(/[^\d,-]/g, "")
    );
    return presupuestoNumerico;
  }

  //----------------------- Operaciones

  function editarAcop(params) {
    if (
      params.data.idProyecto === null ||
      params.data.presupuestoTotal === null ||
      params.cantTotalMeses === ""
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
      // location.reload();
    } else {
      if (params.field === "nomProyecto") {
        var data = {
          idAcop: params.data.idAcop,
          idProyecto: params.idProyecto,
          presupuestoTotal: transformarPresupuesto(
            params.data.presupuestoTotal
          ),
          cantTotalMeses: params.data.cantTotalMeses,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      } else {
        var data = {
          idAcop: params.data.idAcop,
          idProyecto: params.data.idProyecto,
          presupuestoTotal: transformarPresupuesto(
            params.data.presupuestoTotal
          ),
          cantTotalMeses: params.data.cantTotalMeses,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      }
      const url = "pages/editar/ihh_editarAcop.php";
      const operationUrl = "ihh_editarAcop";

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  /**
   * The function `actualizarRegistros` updates a specific record in the `mainList` by replacing it with
   * a new record and then redraws the rows in a grid.
   * @param registro - The `registro` parameter is an object that represents a record or entry that needs
   * to be updated in the `mainList.proyectos` array. It is used to find the matching record in the array
   * based on the `idAcop` property and then update that record with the new values provided in
   */
  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.proyectos.map((item) => {
      return item.idAcop === registro.idAcop ? registro : item;
    });
    setMainList({ proyectos: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  /**
   * The `addNewRow` function adds a new row with specified values to a list of projects and ensures the
   * new row is visible in the grid.
   */
  const addNewRow = () => {
    const newRow = {
      idAcop: null,
      presupuestoTotal: nuevoPresupuestoTotal,
      cantTotalMeses: nuevoCantTotalMeses,
      valorUF: "",
    }; // Crea una nueva fila vacía
    setMainList({ proyectos: [newRow, ...mainList.proyectos] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarAcop(params) {
    const url = "pages/insertar/ihh_insertarAcop.php";
    const operationUrl = "ihh_insertarAcop";
    var data = {
      idProyecto: idProyectoSelect,
      presupuestoTotal: params.data.presupuestoTotal,
      cantTotalMeses: params.data.cantTotalMeses,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (
      idProyectoSelect === null ||
      params.data.presupuestoTotal === null ||
      params.data.presupuestoTotal === nuevoPresupuestoTotal ||
      params.data.cantTotalMeses === nuevoCantTotalMeses ||
      params.data.cantTotalMeses === null
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
        setidProyectoSelect(null);
      });
    }
  }

  function desactivar(ID) {
    ConfirmAlert().then((response) => {
      if (response === true) {
        var url = "pages/cambiarEstado/cambiarEstado.php";
        var operationUrl = "cambiarEstado";
        var data = {
          idRegistro: ID,
          usuarioModificacion: userData.usuario,
          nombreTabla: nombreTabla,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          TopAlerts("successEdited");
        });
      }
    });
  }

  //-------------- useEffect y render

  useEffect(
    function () {
      obtenerProyecto();
      obtenerDatos();
      obtenerConfigDatos();
      obtenerTodosDatosIHH();
    },
    [num_boton, idProyecto, cantidadPorPagina, filtroActivo]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de ACOPS de proyectos</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de ACOPS de proyectos
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={addNewRow}>
              Agregar Nueva Fila
            </Button>

            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadRegistros">
                Cantidad registros:{" "}
              </label>
              <select
                value={cantidadPorPagina || ""}
                className="form-control"
                name="input_CantidadRegistros"
                id="input_CantidadRegistros"
                onChange={({ target }) => {
                  setcantidadPorPagina(target.value);
                  setNumBoton(1);
                  setLoadedData(false);
                }}
                required
              >
                <option hidden value="">
                  {cantidadPorPagina}
                </option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadR">Proyectos activos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidProyecto(target.value);
                  setNumBoton(1);
                  setLoadedData(false);
                }}
              >
                <option value="">Todos</option>
                {auxList.proyectos.map((valor) => (
                  <option value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="form-group"
              id="btn2"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "1px solid rgba(0,0,0, 0.3)",
                borderRadius: "20px",
                padding: "10px",
              }}
            >
              <label>Mostrar proyectos a finalizar:</label>{" "}
              <input
                type="checkbox"
                onChange={() => {
                  setFiltroActivo(!filtroActivo);
                }}
              ></input>
            </div>
            <div
              style={{ marginTop: "12px", marginLeft: "30px", width: "120px" }}
            >
              <ExportCSV
                inputData={mainList.proyectos}
                nomTabla={nombreArchivoCSV}
              />
            </div>
          </div>

          {loadedData ? (
            <>
              <br />
              <div className="ag-theme-quartz" style={{ height: "300px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <LeyendaColores />
                  <div
                    style={{
                      marginLeft: "30px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      border: "1px solid rgba(0,0,0, 0.3)",
                      borderRadius: "20px",
                      padding: "15px",
                      width: "220px",
                    }}
                  >
                    <label>Exportar todos los datos</label>
                    <ExportCSV
                      inputData={todosDatosIHH}
                      nomTabla={"det_Ppto:" + date}
                    />
                  </div>
                </div>

                <br></br>
                {/* <p style={{ color: "gray", fontSize: "10pt" }}>
                  La UF (Unidad de Fomento) se actualiza diariamente si el
                  proyecto sigue activo. En caso contrario, tomará el valor del
                  último día de actividad del mismo. <br />
                  Se agrega valor UF para conversión a pesos chilenos (CLP).
                </p> */}

                <SubirArchivo
                  cambiarEstado={setIsActiveSubirArchivo}
                  idRegistro={idRegistro}
                  isActive={isActiveSubirArchivo}
                />

                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  gridOptions={gridOptions}
                  autoSizeStrategy={autoSizeStrategy}
                  ref={gridRef}
                  rowSelection="single"
                  editType="fullRow"
                  getRowId={(params) => params.data.idAcop}
                  suppressRowClickSelection={true}
                  suppressCellSelection={true}
                  onCellClicked={(params) => {
                    if (
                      params.colDef.field === "nomPais" &&
                      params.data.nomCliente === nuevoNombreCliente &&
                      params.data.direccionCliente === nuevoDireccionCliente
                    ) {
                      alert(
                        "Ingresa primero los datos tipo texto y luego confirma los cambios usando la tecla ENTER."
                      );
                    }
                  }}
                  onRowValueChanged={(params) => {
                    params.data.idAcop === null
                      ? insertarAcop(params)
                      : editarAcop(params);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <br />
              <br />
              <Spinner />
            </>
          )}
        </div>
        <br></br>
        <br></br>

        <Paginador
          paginas={cantidadPaginas}
          cambiarNumero={setNumBoton}
          num_boton={num_boton}
        ></Paginador>
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
