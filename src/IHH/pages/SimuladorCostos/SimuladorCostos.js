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
import Insertar_HHEE from "../../forms/insertar/Insertar_HHEE";
import Insertar_NotaImp from "../../forms/insertar/Insertar_NotaImp";
export default function SimuladorCostos() {
  const [, params] = useRoute("/ihh/simuladorCostos/:idProyecto/:mes");

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  // listados
  const [listEmpleado, setListEmpleado] = useState([]);
  const [listElemento, setListElemento] = useState([]);
  const [listDetalleMensual, setListDetalleMensual] = useState([]);
  const [listElementoEliminado, setListElementoEliminado] = useState([]);
  const [listValorHH, setListValorHH] = useState([]);
  const [listAcops, setListAcops] = useState();
  const [datosResumen, setDatosResumen] = useState([]);
  // booleans
  const [loadedData, setLoadedData] = useState(false);
  const [isActiveFormularioHHEE, setIsActiveFormularioHHEE] = useState("");
  const [isActiveFormularioNota, setIsActiveFormularioNota] = useState("");
  // variables
  const [nomEmpleado, setNomEmpleado] = useState("");
  const [idEmpleado, setIdEmpleado] = useState("");
  const [nomElemento, setNomElemento] = useState("");
  const [nomTipoElemento, setNomTipoElemento] = useState("");
  const [idElemento, setIdElemento] = useState("");
  const [nomProyecto, setNomProyecto] = useState("");
  const [mes, setMes] = useState(params.mes);

  const [DatosRegistro, setDatosRegistro] = useState("");

  /**
   * The function `obtenerEmpleados` fetches a list of employees from a specified URL and sets the
   * retrieved data to a list of employees.
   */
  function obtenerEmpleados() {
    var url = "pages/auxiliares/listadoEmpleadoForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListEmpleado(response);
    });
  }
  /**
   * The function `obtenerElementos` retrieves a list of elements from a specified URL using a data
   * service and sets the list of elements in the response.
   */
  function obtenerElementos() {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListElemento(response);
    });
  }
  /**
   * The function `obtenerValorHH` sends a request to retrieve a list of values for human hours from a
   * specified URL and sets the response data to a variable.
   */
  function obtenerValorHH() {
    var url = "pages/auxiliares/ihh_listadoValorHH.php";
    var operationUrl = "listados";
    var data = { idProyecto: params.idProyecto, mes: params.mes };
    SendDataService(url, operationUrl, data).then((response) => {
      setListValorHH(response);
    });
  }
  /**
   * The function `obtenerDetalleMensual` retrieves monthly project details from a specified URL and
   * updates the data accordingly.
   */

  const obtenerAcops = () => {
    var url = "pages/auxiliares/ihh_listadoAcopForms.php";
    var operationUrl = "listados";
    getDataService(url, operationUrl).then((data) => {
      setListAcops(data);
    });
  };

  var gridOptions = {
    // otras configuraciones de AG Grid...
    localeText: {
      noRowsToShow: "No hay filas para mostrar",
    },
  };

  function obtenerDetalleMensual() {
    var url = "pages/listados/ihh_listadoDetalleMensualProyecto.php";
    var operationUrl = "ihh_listadoDetalleMensualProyecto";
    var data = { idProyecto: params.idProyecto, mes: params.mes };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);

      const { datosResumen, datosTabla } = response;
      setNomProyecto(datosResumen[0].nomProyecto);
      setMes(datosResumen[0].mes);
      datosTabla[0].idImpugnacionEmp !== null
        ? setListDetalleMensual(datosTabla)
        : setListDetalleMensual([]);
      setDatosResumen(datosResumen);

      setLoadedData(true);
    });
  }

  //----- definiciones data grid
  /* The above code is using the `map` method to create a new array `rowData` by iterating over each
element in the `listDetalleMensual` array. For each element, it is creating a new object using the
spread syntax (`{ ...row }`) to copy all the properties of the current element into a new object.
This effectively creates a shallow copy of each element in the `listDetalleMensual` array and stores
it in the `rowData` array. */
  const rowData = listDetalleMensual.map((row) => ({ ...row }));
  const gridRef = useRef();

  /* The above code is defining a set of column definitions for a grid or table component in a web
 application. Each column definition specifies the header name, field name from the data source,
 whether it is editable, cell styles, width, and additional properties like value calculation and
 custom cell rendering. */
  const columnDefs = [
    {
      headerName: "Colaborador",
      field: "nomEmpleado",
      editable: false,
    },
    {
      headerName: "Elemento",
      field: "nomElemento",
      editable: false,
    },
    {
      headerName: "Cant. HH",
      field: "cantHorasPeriodo",
      editable: true,
      cellStyle: { textAlign: "right" },
      width: 70,
    },
    {
      headerName: "Cant. HHEE",
      field: "cantHorasExtra",
      editable: false,
      cellStyle: { textAlign: "right" },
      width: 70,
    },
    {
      headerName: "Tipo HHEE",
      field: "tipoHHEE",
      editable: false,
      cellStyle: { textAlign: "right" },
      width: 70,
      valueGetter: function (params) {
        const elemento = listElemento.find(
          (item) => item.idElementoImp === params.data.tipoHHEE
        );

        return elemento && elemento.nomElemento;
      },
    },
    {
      headerName: "Nro ACOP",
      field: "numAcop",
      editable: false,
      cellStyle: { textAlign: "right" },
      width: 70,
      valueGetter: function (params) {
        return params.data.numAcop ? params.data.numAcop : 0;
      },
    },
    {
      headerName: "Valor HH",
      field: "valorHH",
      editable: true,
      cellStyle: { textAlign: "right" },
      width: 70,
    },
    {
      headerName: "Total",
      cellStyle: { textAlign: "right" },
      headerClass: "headerTextRight",
      width: 100,
      colId: "totalColumn",
      valueGetter: function (params) {
        return parseFloat(
          params.data.cantHorasPeriodo * params.data.valorHH +
            params.data.cantHorasExtra * params.data.valorHH * 1.5
        ).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });
      },
    },
    {
      headerName: "Nota",
      field: "nota",
      editable: false,
      cellStyle: { textAlign: "right" },
      width: 65,
      valueGetter: function (params) {
        if (params.data.nota) {
          return "SÍ";
        } else {
          return "NO";
        }
      },
    },
    {
      headerName: "Operaciones",
      width: 300,
      colId: "operaciones",
      cellRenderer: function (params) {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                backgroundColor: "#e10b1c",
                border: "none",
                fontSize: "10pt",
              }}
              disabled={
                params.data.nomTipoElemento === "MISCELÁNEO" ? true : false
              }
              onClick={() => {
                setDatosRegistro(params.data);
                setIsActiveFormularioHHEE(true);
              }}
            >
              Agregar HHEE
            </Button>
            <Button
              style={{
                backgroundColor: "#e10b1c",
                border: "none",
                fontSize: "10pt",
              }}
              onClick={() => {
                setDatosRegistro(params.data);
                setIsActiveFormularioNota(true);
              }}
            >
              Agregar Nota
            </Button>
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
          </div>
        );
      },
    },
  ];

  /**
   * The function encontrarValorHH takes an employee ID as input and returns the corresponding hourly
   * rate value from a list of employee objects.
   * @param idEmpleado - The `idEmpleado` parameter is the identifier of the employee for whom you want
   * to find the value per hour (valorHH). The function `encontrarValorHH` takes this employee ID as
   * input and returns the corresponding value per hour for that employee.
   * @returns The function `encontrarValorHH` is returning the value of `valorHH` for the employee with
   * the specified `idEmpleado`.
   */
  function encontrarValorHH(idEmpleado) {
    const valorHH = listValorHH.filter(
      (empleado) => empleado.idEmpleado === idEmpleado
    );
    return valorHH[0].valorHH;
  }

  /**
   * The `addNewRow` function generates a new row object with specific properties and adds it to a list
   * of monthly details.
   */
  const addNewRow = () => {
    const newRow = {
      idRandom: generateUniqueId(),
      nomEmpleado: nomEmpleado,
      idPeriodo: 1,
      nomElemento: nomElemento,
      idEmpleado: idEmpleado,
      idElemento: idElemento,
      idAcop: datosResumen[0].idAcop,
      numAcop: 0,
      tipoHHEE: null,
      cantHorasPeriodo: 0,
      cantHorasExtra: 0,
      valorHH: encontrarValorHH(idEmpleado),
      idImpugnacionEmp: null,
      Total: 0,
      nomTipoElemento: nomTipoElemento,
      nota: "",
      idNotaImpugnacion: null,
    };

    if (listDetalleMensual === "") {
      setListDetalleMensual([newRow]);
    } else {
      setListDetalleMensual([...listDetalleMensual, newRow]);
    }
  };

  /**
   * The function `generateUniqueId` returns a unique identifier using the `uuidv4` function.
   * @returns A unique identifier generated using the `uuidv4` function.
   */
  const generateUniqueId = () => {
    return uuidv4();
  };

  /**
   * The `removerElemento` function removes an element from a list based on a specific condition and
   * updates the list accordingly.
   * @param item - The `item` parameter in the `removerElemento` function seems to represent the
   * identifier of an element that needs to be removed from the `listDetalleMensual` array. The function
   * first checks if there is an element in the array with the `idRandom` matching the provided `item
   */
  const removerElemento = (item) => {
    listDetalleMensual.map((element) => {
      if (element.idRandom === item) {
        setListElementoEliminado([...listElementoEliminado, element]);
      }
    });

    const newArray = listDetalleMensual.filter(
      (element) => element.idRandom !== item
    );
    setListDetalleMensual(newArray);
    gridRef.current.api.updateGridOptions({ rowData: listDetalleMensual });
  };

  //Complementarias para frontend
  /**
   * The function `sumTotal` calculates the total sum based on specific data values in a grid.
   * @returns The `sumTotal` function is returning the total sum of values calculated based on the data
   * in the grid rows. The total sum is calculated by multiplying the number of hours in a period by the
   * hourly rate, adding the product of extra hours and the hourly rate for each row in the grid.
   */
  function sumTotal() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listDetalleMensual });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        // console.log(node.data);
        if (node.data.nomTipoElemento !== "MISCELÁNEO") {
          const totalValue =
            node.data.cantHorasPeriodo * node.data.valorHH +
            node.data.cantHorasExtra * node.data.valorHH * 1.5;

          totalSum += totalValue;
        }
      });
    }
    return totalSum;
  }

  function sumTotalMiscelaneo() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listDetalleMensual });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        // console.log(node.data);

        if (node.data.nomTipoElemento === "MISCELÁNEO") {
          const totalValue =
            node.data.cantHorasPeriodo * node.data.valorHH +
            node.data.cantHorasExtra * node.data.valorHH * 1.5;

          totalSum += totalValue;
        }
      });
    }
    return totalSum;
  }
  function sumTotalHoras() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listDetalleMensual });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        if (node.data.nomTipoElemento !== "MISCELÁNEO") {
          const totalHoras =
            parseInt(node.data.cantHorasPeriodo) +
            parseInt(node.data.cantHorasExtra);

          totalSum += totalHoras;
        }
      });
    }
    return totalSum;
  }

  function sumTotalHorasMiscelaneo() {
    let totalSum = 0;
    if (gridRef.current) {
      gridRef.current.api.updateGridOptions({ rowData: listDetalleMensual });
      gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
        if (node.data.nomTipoElemento === "MISCELÁNEO") {
          const totalHoras =
            parseInt(node.data.cantHorasPeriodo) +
            parseInt(node.data.cantHorasExtra);

          totalSum += totalHoras;
        }
      });
    }
    return totalSum;
  }

  /**
   * The function `convertirFecha` takes a date string in the format "YYYYMM" and converts it into a
   * formatted date string with the month in Spanish and the year.
   * @param fechaString - The `convertirFecha` function takes a `fechaString` parameter, which is
   * expected to be a string representing a date in the format "YYYYMM".
   * @returns The function `convertirFecha` takes a string representing a date in the format "YYYYMM"
   * and converts it into a formatted date string in the format "MONTH YEAR". The function extracts the
   * year and month from the input string, converts the month number to its corresponding name, and then
   * formats the date accordingly. The formatted date string is then returned by the function.
   */
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

  /**
   * The ErrorMessage function checks if the monthly budget is being exceeded and displays an alert
   * message if it is.
   * @returns The ErrorMessage component is returning an Alert component with a variant of "danger" and a
   * message stating "El presupuesto mensual está siendo excedido."
   */
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
  /**
   * The function `SendData` sends data to a specified URL using `SendDataService` and handles the
   * response by displaying an alert message.
   */
  function SendData() {
    var URL = "pages/insertar/ihh_validarImpugnacionEmp.php";
    var operationUrl = "ihh_validarImpugnacionEmp";
    var data = {
      nuevasImpugnaciones: listDetalleMensual,
      elementosEliminados: listElementoEliminado,
      datosResumen: {
        costoMensual: sumTotal(),
        saldoMensual: datosResumen[0].presupuestoAcumulado - sumTotal(),
        saldoPresupuesto: datosResumen[0].presupuestoTotal - sumTotal(),
        idresumenperproy: datosResumen[0].idresumenperproy,
      },
      usuarioCreacion: userData.usuario,
      isActive: 1,
    };
    console.log(data);

    SendDataService(URL, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerEmpleados();
      obtenerElementos();
      obtenerDetalleMensual();
      obtenerValorHH();
      obtenerAcops();
    },
    [loadedData]
  );

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        {loadedData ? (
          <>
            <Insertar_HHEE
              isActive={isActiveFormularioHHEE}
              cambiarEstado={setIsActiveFormularioHHEE}
              Registro={DatosRegistro}
              datosMain={listDetalleMensual}
            />
            <Insertar_NotaImp
              isActive={isActiveFormularioNota}
              cambiarEstado={setIsActiveFormularioNota}
              Registro={DatosRegistro}
              datosMain={listDetalleMensual}
            />

            <Header></Header>
            <br />
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "30px",
                width: "1100px",
                margin: "auto",
              }}
            >
              {/* titulos */}
              <h2
                style={{
                  margin: "-10px auto",
                  width: "800px",
                  textAlign: "center",
                }}
              >
                Proyecto <br></br>
                {nomProyecto}
              </h2>
              <h4>
                {convertirFecha(mes)} - Días laborables:{" "}
                {datosResumen[0].diasLaborables} (
                {datosResumen[0].diasLaborables * 8} horas)
              </h4>
              <br></br>
              {/* selectores */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "800px",
                  margin: "auto",
                }}
              >
                <div>
                  <input
                    style={{ width: "350px", margin: "auto" }}
                    list="colaboradores"
                    name="buscadorColaboradores"
                    placeholder="Busca un colaborador TSOFT"
                    defaultValue={nomElemento || ""}
                    onChange={(event) => {
                      setNomEmpleado(event.target.value);
                      const selectedNombre = event.target.value; // Obtén el nombre del empleado seleccionado
                      const selectedEmpleado = listEmpleado.find(
                        (item) => item.nomEmpleado === selectedNombre
                      );
                      if (selectedEmpleado) {
                        setIdEmpleado(selectedEmpleado.idEmpleado);
                      }
                    }}
                  ></input>

                  <datalist id="colaboradores">
                    {listEmpleado.map((item) => (
                      <option
                        key={item.idEmpleado}
                        value={item.nomEmpleado} // Almacena el nombre del empleado como value
                      ></option>
                    ))}
                  </datalist>
                </div>
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
                        setNomTipoElemento(selectedElemento.nomTipoElemento);
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
                      const actualizado = listDetalleMensual.map((item) => {
                        return item.idRandom === params.data.idRandom
                          ? params.data
                          : item;
                      });
                      setListDetalleMensual(actualizado);
                    }}
                  />
                </div>

                {/* SUM COSTO TOTAL Y GUARDAR CAMBIOS       */}
                <div
                  style={{ fontSize: "14pt", width: "900px", margin: "auto" }}
                >
                  <p style={{ marginLeft: "450px", marginTop: "10px" }}>
                    Costo mensual total (proy + misc):&nbsp;
                    <b>
                      {sumTotal() + sumTotalMiscelaneo()
                        ? (sumTotal() + sumTotalMiscelaneo()).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "$0"}
                    </b>
                  </p>
                </div>

                {/* container resumen y boton guardar cambios */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "10px",
                  }}
                >
                  {/* RESUMEN PROYECTO */}
                  <div
                    style={{
                      backgroundColor: "lightgray",
                      padding: "20px",
                      borderRadius: "10px",
                      width: "550px",
                      height: "auto",
                    }}
                  >
                    <b style={{ fontSize: "17pt" }}>Resumen proyecto</b>
                    <table>
                      <tbody>
                        {/* p total */}
                        <tr>
                          <th style={{ width: "450px" }}>Presup total:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {parseFloat(
                                datosResumen[0].presupuestoTotal
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}
                            </b>
                          </th>
                        </tr>
                        {/* saldo proy */}
                        <tr>
                          <th>Saldo:</th>
                          <th style={{ textAlign: "right" }}>
                            <b
                              style={
                                datosResumen[0].saldoPresupuesto - sumTotal() <
                                0
                                  ? { color: "red " }
                                  : { color: "green" }
                              }
                            >
                              {datosResumen[0].saldoPresupuesto - sumTotal()
                                ? (
                                    datosResumen[0].saldoPresupuesto -
                                    sumTotal()
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        <br />
                        {/* ppto mensual proy */}
                        <tr>
                          <th>Presup mensual:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {parseFloat(
                                datosResumen[0].presupuestoAcumulado
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}
                            </b>
                          </th>
                        </tr>
                        {/* costo men */}
                        <tr>
                          <th>Costo mensual:</th>
                          <th style={{ textAlign: "right" }}>
                            <b style={{ color: "red" }}>
                              {sumTotal()
                                ? sumTotal().toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        {/* saldo mes */}
                        <tr>
                          <th>Saldo mes:</th>
                          <th style={{ textAlign: "right" }}>
                            <b
                              style={
                                datosResumen[0].presupuestoAcumulado -
                                  sumTotal() <
                                0
                                  ? { color: "red " }
                                  : { color: "green" }
                              }
                            >
                              {datosResumen[0].presupuestoAcumulado - sumTotal()
                                ? (
                                    datosResumen[0].presupuestoAcumulado -
                                    sumTotal()
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        {/* cant horas totales */}
                        <tr>
                          <th>Cant total horas mes:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>{sumTotalHoras() ? sumTotalHoras() : "0"}</b>
                          </th>
                        </tr>
                        {/* cant Colab */}
                        <tr>
                          <th>Cant colab:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {listDetalleMensual
                                ? listDetalleMensual.length
                                : "0"}
                            </b>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* RESUMEN MISCELANEO */}
                  <div
                    style={{
                      backgroundColor: "lightgray",
                      padding: "20px",
                      borderRadius: "10px",
                      width: "600px",
                    }}
                  >
                    <b style={{ fontSize: "17pt" }}>Resumen misceláneos</b>
                    <table>
                      <tbody>
                        <tr>
                          <th style={{ width: "450px" }}>
                            Presup total:
                          </th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {isNaN(
                                parseFloat(
                                  datosResumen[0].presupuestoTotalMiscelaneo
                                )
                              )
                                ? (0).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : parseFloat(
                                    datosResumen[0].presupuestoTotalMiscelaneo
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })}
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Saldo:</th>
                          <th style={{ textAlign: "right" }}>
                            <b
                              style={
                                datosResumen[0].saldoPresupuestoMiscelaneo -
                                  sumTotalMiscelaneo() <
                                0
                                  ? { color: "red " }
                                  : { color: "green" }
                              }
                            >
                              {datosResumen[0].saldoPresupuestoMiscelaneo -
                              sumTotalMiscelaneo()
                                ? (
                                    datosResumen[0].saldoPresupuestoMiscelaneo -
                                    sumTotalMiscelaneo()
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        <br />
                        <tr>
                          <th>Presup mensual:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {isNaN(
                                datosResumen[0].presupuestoAcumuladoMiscelaneo
                              ) ||
                              !datosResumen[0].presupuestoAcumuladoMiscelaneo
                                ? (0).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : parseFloat(
                                    datosResumen[0]
                                      .presupuestoAcumuladoMiscelaneo
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })}
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Costo mensual:</th>
                          <th style={{ textAlign: "right" }}>
                            <b style={{ color: "red" }}>
                              {sumTotalMiscelaneo()
                                ? sumTotalMiscelaneo().toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Saldo mes misc:</th>
                          <th style={{ textAlign: "right" }}>
                            <b
                              style={
                                datosResumen[0].presupuestoAcumuladoMiscelaneo -
                                  sumTotalMiscelaneo() <
                                0
                                  ? { color: "red " }
                                  : { color: "green" }
                              }
                            >
                              {datosResumen[0].presupuestoAcumuladoMiscelaneo -
                              sumTotalMiscelaneo()
                                ? (
                                    datosResumen[0]
                                      .presupuestoAcumuladoMiscelaneo -
                                    sumTotalMiscelaneo()
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })
                                : "$0"}
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Cant total horas mes:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {sumTotalHorasMiscelaneo()
                                ? sumTotalHorasMiscelaneo()
                                : "0"}
                            </b>
                          </th>
                        </tr>
                        <tr>
                          <th>Cant colab:</th>
                          <th style={{ textAlign: "right" }}>
                            <b>
                              {listDetalleMensual
                                ? listDetalleMensual.length
                                : "0"}
                            </b>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* boton guardar cambios */}
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
                    <ErrorMessage />
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
