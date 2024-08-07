import React, { useEffect, useState, useRef } from "react";
import Header from "../../../templates/Header/Header";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useRoute } from "wouter";

import { Button } from "react-bootstrap";
import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import Alert from "react-bootstrap/Alert";
import "./simuladorCostos.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Spinner from "../../../templates/spinner/spinner";
import TopAlertsError from "../../../templates/alerts/TopAlerts";

export default function ListadoImpEmpProy() {
  //   const [, params] = useRoute("/ihh/simuladorCostos/:idProyecto/:mes/:idAcop");

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  // listados
  const [listEmpleado, setListEmpleado] = useState([]);
  const [listElemento, setListElemento] = useState([]);
  const [listImpugnacionEmp, setListImpugnacionEmp] = useState([]);
  const [listElementoEliminado, setListElementoEliminado] = useState([]);
  const [listValorHH, setListValorHH] = useState([]);
  const [listProyectosActivos, setProyectosActivos] = useState([]);
  // booleans
  const [loadedData, setLoadedData] = useState(true);
  // variables
  const [nomEmpleado, setNomEmpleado] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [nomElemento, setNomElemento] = useState("");
  const [idElemento, setIdElemento] = useState("");
  const [nomProyecto, setNomProyecto] = useState("");
  const [idProyecto, setIdProyecto] = useState("");
  //   const [valorHHEmp, setValorHHEmp] = useState("");
  //   const [mes, setMes] = useState("");
  const [datosResumenProyecto, setDatosResumenProyecto] = useState({
    idResumenPerProy: null,
    costoMensual: null,
    saldoMensual: null,
    saldoPresupuesto: null,
    presupuestoAcumulado: null,
    idAcop: null,
  });

  //Devuelve la fecha actual en formato YYYYMM
  function fechaActual() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString(); // getMonth() devuelve un número de 0 a 11, por lo que sumamos 1
    if (month.length < 2) {
      month = "0" + month; // Añadir un 0 delante si el mes es menor a 10
    }

    var formattedDate = `${year}${month}`;
    return formattedDate;
  }
  //Devuelve el listado de empleados
  function obtenerEmpleados() {
    var url = "pages/auxiliares/listadoEmpleadoForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListEmpleado(response);
    });
  }
  //Devuelve un listado de elementos de impugnación
  function obtenerElementos() {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListElemento(response);
    });
  }
  //Devuelve un listado de proyectos que aún no están finalizados
  function obtenerProyectosActivos() {
    var url = "pages/auxiliares/listadoProyectosActivosForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setProyectosActivos(response);
    });
  }
  //Devuelve un listado de los valores HH de cada empleado en un proyecto
  function obtenerValorHH(idProyecto) {
    var url = "pages/auxiliares/ihh_listadoValorHH.php";
    var operationUrl = "listados";
    var data = { idProyecto: idProyecto, mes: fechaActual() };
    SendDataService(url, operationUrl, data).then((response) => {
      setListValorHH(response);
    });
  }
  //Devuelve un listado de todas las impugnaciones del empleado en un mes, mostrando los distintos proyectos y la cantidad de horas impugnadas
  function obtenerImpugnacionEmp(idEmpleado) {
    var url = "pages/listados/ihh_listadoImpEmp.php";
    var operationUrl = "ihh_listadoImpEmp";
    var data = { idEmpleado: idEmpleado, mes: fechaActual() };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      if (response[0].idImpugnacionEmp !== null) {
        setListImpugnacionEmp(response);
      }
      // setLoadedData(true);
    });
  }
  //Se encarga de obtener los diferentes datos de la tabla resumen buscando un proyecto y mes en específico
  function obtenerDatosResumenProyecto(idProyecto) {
    var url = "pages/listados/ihh_listadoDetalleMensualProyecto.php";
    var operationUrl = "ihh_listadoDetalleMensualProyecto";
    var data = { idProyecto: idProyecto, mes: fechaActual() };
    SendDataService(url, operationUrl, data).then((response) => {
      const { datosResumen } = response;
      console.log(datosResumen);
      setDatosResumenProyecto({
        idResumenPerProy: datosResumen[0].idresumenperproy,
        costoMensual: datosResumen[0].costoMensual,
        saldoMensual: datosResumen[0].saldoMensual,
        saldoPresupuesto: datosResumen[0].saldoPresupuesto,
        presupuestoAcumulado: datosResumen[0].presupuestoAcumulado,
        idAcop: datosResumen[0].idAcop,
      });
    });
  }

  //Establece parámetros de configuración para la tabla AG GRID.
  var gridOptions = {
    // otras configuraciones de AG Grid...
    localeText: {
      noRowsToShow: "No hay filas para mostrar",
    },
  };

  //rowData es el listado desde el que se va a alimentar la tabla para mostrar los registros
  const rowData = listImpugnacionEmp.map((row) => ({ ...row }));
  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Colaborador",
      field: "nomEmpleado",
      editable: false,
      width: 250,
      hide: true,
    },
    {
      headerName: "Proyecto",
      field: "nomProyecto",
      editable: false,
      width: 400,
    },
    {
      headerName: "Elemento",
      field: "nomElemento",
      editable: false,
      width: 400,
    },
    {
      headerName: "Cant. HH",
      field: "cantHorasPeriodo",
      editable: true,
      cellStyle: { textAlign: "right" },
      width: 100,
    },
    {
      headerName: "Cant. HHEE",
      field: "cantHorasExtra",
      editable: true,
      cellStyle: { textAlign: "right" },
      width: 100,
    },
    // {
    //   headerName: "Total",
    //   cellStyle: { textAlign: "right" },
    //   headerClass: "headerTextRight",
    //   width: 120,
    //   colId: "totalColumn", // Asignar un ID único a la columna "Total"
    //   valueGetter: function (params) {
    //     return parseFloat(
    //       params.data.cantHorasPeriodo * params.data.valorHH +
    //         params.data.cantHorasExtra * (params.data.valorHH * 1.5)
    //     ).toLocaleString("es-CL", {
    //       style: "currency",
    //       currency: "CLP",
    //     });
    //   },
    // },
    {
      headerName: "Operaciones",
      colId: "operaciones",
      width: 120,
      cellStyle: { padding: "0", justifyContent: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <Button
            style={{
              backgroundColor: "#e10b1c",
              border: "none",
              fontSize: "10pt",
            }}
            onClick={() => {
              removerElemento(params.data.idRandom);
            }}
          >
            Quitar
          </Button>
        );
      },
    },
  ];
  //Encuentra el valor HH del colaborador seleccionado
  function encontrarValorHH(idEmpleado) {
    const valorHH = listValorHH.filter(
      (empleado) => empleado.idEmpleado === idEmpleado
    );
    return valorHH[0].valorHH;
  }
  //Añade otra fila a la lista
  const addNewRow = () => {
    const newRow = {
      idRandom: generateUniqueId(),
      nomEmpleado: nomEmpleado,
      nomProyecto: nomProyecto,
      nomElemento: nomProyecto !== "MISCELÁNEO" ? "JORNADA NORMAL" : nomElemento,
      cantHorasPeriodo: 0,
      cantHorasExtra: 0,
      valorHH: encontrarValorHH(idEmpleado),
      idImpugnacionEmp: null,
      Total: 0,
    };

    if (listImpugnacionEmp === "") {
      setListImpugnacionEmp([newRow]);
    } else {
      setListImpugnacionEmp([...listImpugnacionEmp, newRow]);
    }
  };
  //genera IDS únicos para evitar errores
  const generateUniqueId = () => {
    return uuidv4();
  };
  //Almaceno aquellos registros que serán eliminados en un nuevo array para luego desactivarlos en la base de datos
  const removerElemento = (item) => {
    listImpugnacionEmp.map((element) => {
      if (element.idRandom === item) {
        setListElementoEliminado([...listElementoEliminado, element]);
      }
    });

    const newArray = listImpugnacionEmp.filter(
      (element) => element.idRandom !== item
    );
    setListImpugnacionEmp(newArray);
    gridRef.current.api.updateGridOptions({ rowData: listImpugnacionEmp });
  };

  //Complementarias para frontend

  function sumTotalHoras() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listImpugnacionEmp });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        totalSum += parseFloat(node.data.cantHorasPeriodo) || 0;
      });
    }
    return totalSum;
  }
  function sumTotalHorasEE() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listImpugnacionEmp });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        totalSum += parseFloat(node.data.cantHorasExtra) || 0;
      });
    }
    return totalSum;
  }
  function convertirFecha(fechaString) {
    // Extraer el año y el mes del string
    const anio = fechaString.slice(0, 4);
    const mesNumero = fechaString.slice(4);

    // Convertir el mes a nombre
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

    // Formatear la fecha en el formato deseado
    const fechaFormateada = mesNombre + " " + anio;

    return fechaFormateada;
  }
  // function sumTotalHoras() {
  //   let totalSum = 0;
  //   if (gridRef.current) {
  //     gridRef.current.api.updateGridOptions({ rowData: listImpugnacionEmp });
  //     gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
  //       const totalHoras =
  //         parseInt(node.data.cantHorasPeriodo) +
  //         parseInt(node.data.cantHorasExtra);

  //       totalSum += totalHoras;
  //     });
  //   }
  //   return totalSum;
  // }
  const ErrorMessage = () => {
    if (datosResumen[0].presupuestoAcumulado - sumTotal() < 0)
      return (
        <Alert variant="danger" style={{ fontSize: "12pt", width: "400px" }}>
          <Alert.Heading>
            El presupuesto mensual está siendo excedido.
          </Alert.Heading>
        </Alert>
      );
  };

  //Enviar datos
  function SendData() {
    const URL = "pages/insertar/ihh_insertarImpEmpProy.php";
    const operationUrl = "ihh_insertarImpEmpProy";

    const data = {
      nuevasImpugnaciones: listImpugnacionEmp,
      elementosEliminados: listElementoEliminado,
      mes: fechaActual(),
    };
    console.log(data);
    SendDataService(URL, operationUrl, data).then((response) => {
      // console.log(response);
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerEmpleados();
      obtenerElementos();
      obtenerProyectosActivos();
    },
    [loadedData, listImpugnacionEmp, nomProyecto]
  );

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        {loadedData ? (
          <>
            <Header></Header>
            <br />
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "30px",
                width: "1200px",
                margin: "auto",
              }}
            >
              {/* titulos */}
              <h2 style={{ margin: "auto auto", width: "650px" }}>
                Impugnación de horas - {convertirFecha(fechaActual())}
              </h2>
              <br></br>

              {/* selectores */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "1000px",
                  margin: "auto",
                  justifyContent: "center",
                }}
              >
                {/* colaboradores */}
                <div
                  style={{
                    margin: "auto",
                  }}
                >
                  <input
                    style={{ width: "782px" }}
                    list="colaboradores"
                    name="buscadorColaboradores"
                    placeholder="Busca un colaborador TSOFT"
                    defaultValue={nomEmpleado || ""}
                    onChange={(event) => {
                      setNomEmpleado(event.target.value);
                      setListImpugnacionEmp([]);

                      const selectedNombre = event.target.value; // Obtén el nombre del empleado seleccionado
                      const selectedEmpleado = listEmpleado.find(
                        (item) => item.nomEmpleado === selectedNombre
                      );
                      if (selectedEmpleado) {
                        obtenerImpugnacionEmp(selectedEmpleado.idEmpleado);
                        setIdEmpleado(selectedEmpleado.idEmpleado);
                      }
                    }}
                  ></input>
                  <datalist id="colaboradores">
                    {listEmpleado.map((item) => (
                      <option
                        key={item.idEmpleado} // Asegúrate de tener un key único para cada opción
                        value={item.nomEmpleado} // Almacena el nombre del empleado como value
                      ></option>
                    ))}
                  </datalist>
                </div>

                {/* proyectos y elementos miscelaneos */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    // width: "",
                    gap: "5px",
                    margin: "auto",
                  }}
                >
                  {/* proyectos */}
                  <div>
                    <input
                      style={{ width: "350px", margin: "auto" }}
                      list="listProyectosActivos"
                      name="buscadorProyectos"
                      placeholder="Busca un proyecto"
                      onChange={(event) => {
                        const selectedNombre = event.target.value;
                        const selectedProyecto = listProyectosActivos.find(
                          (item) => item.nomProyecto === selectedNombre
                        );
                        if (selectedProyecto) {
                          setIdProyecto(selectedProyecto.idEDDProyecto);
                          setNomProyecto(selectedProyecto.nomProyecto);
                          obtenerValorHH(selectedProyecto.idEDDProyecto);
                        }
                      }}
                    ></input>

                    <datalist id="listProyectosActivos">
                      {listProyectosActivos.map((item) => (
                        <option
                          key={item.idEDDProyecto}
                          value={item.nomProyecto}
                        ></option>
                      ))}
                    </datalist>
                  </div>

                  {/* elementos misc */}

                  {nomProyecto === "MISCELÁNEO" ? (
                    <div>
                      <input
                        style={{ width: "350px", margin: "auto" }}
                        list="elementos"
                        name="buscadorElementos"
                        placeholder="Busca un elemento misceláneo (opcional)"
                        onChange={(event) => {
                          const selectedNombre = event.target.value;
                          const selectedElemento = listElemento.find(
                            (item) => item.nomElemento === selectedNombre
                          );
                          if (selectedElemento) {
                            setIdElemento(selectedElemento.idElementoImp);
                            setNomElemento(selectedElemento.nomElemento);
                          }
                        }}
                      ></input>

                      <datalist id="elementos">
                        {listElemento.map((item) => (
                          <option
                            key={item.idElemento} // Asegúrate de tener un key único para cada opción
                            value={item.nomElemento} // Almacena el nombre del empleado como value
                          ></option>
                        ))}
                      </datalist>
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* btn agregar */}
                  <Button
                    style={{
                      backgroundColor: "#e10b1c",
                      border: "none",
                      fontSize: "10pt",
                    }}
                    onClick={() => {
                      if (nomEmpleado !== "") {
                        addNewRow();
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
              <br></br>

              <div>
                {/* Ag grid */}
                <div className="ag-theme-quartz" style={{ height: "300px" }}>
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    ref={gridRef}
                    rowSelection="multiple"
                    editType="fullRow"
                    gridOptions={gridOptions}
                    getRowId={(params) => params.data.idRandom}
                    suppressRowClickSelection={true}
                    suppressCellSelection={true}
                    onRowValueChanged={(params) => {
                      const actualizado = listImpugnacionEmp.map((item) => {
                        return item.idRandom === params.data.idRandom
                          ? params.data
                          : item;
                      });
                      setListImpugnacionEmp(actualizado);
                    }}
                  />
                </div>

                {/* SUM COSTO TOTAL Y GUARDAR CAMBIOS       */}
                <table
                  style={{
                    backgroundColor: "white",
                    padding: "0 20px 0 20px",
                    borderRadius: "10px",
                    width: "350px",
                    fontSize: "12pt",
                    marginLeft: "750px"
                  }}
                >
                  <td>
                    <tr>
                      <th style={{ width: "200px" }}>Cantidad HH totales:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>{sumTotalHoras()}</b>
                      </th>
                    </tr>
                    <tr>
                      <th>Cantidad HHEE totales: </th>
                      <th style={{ textAlign: "right" }}>
                        <b>{sumTotalHorasEE()}</b>
                      </th>
                    </tr>
                  </td>
                </table>


                {/* container resumen y boton guardar cambios */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "450px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#e10b1c",
                        border: "none",
                        width: "150px",
                      }}
                      onClick={() => {
                        SendData();
                      }}
                    >
                      {" "}
                      Guardar cambios
                    </Button>
                    <br />
                    {/* <ErrorMessage /> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </>
    ) : (
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
