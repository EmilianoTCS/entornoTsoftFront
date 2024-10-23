import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import {
  BsFillTrashFill,
  BsFillKeyFill,
  BsPeopleFill,
  BsBookmarksFill,
  BsCalendar2CheckFill,
  BsFillDiagram3Fill,
  BsFillChatDotsFill,
} from "react-icons/bs";
import getDataService from "../../../services/GetDataService";

import TopAlerts from "../../../templates/alerts/TopAlerts";
import "../WordWrap.css";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function IHH_ListadoImpugnacionEmp() {

  // Permite cargar las horas de un empleado hacia un proyecto


  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [filters, setFilters] = useState({
    idEmpleado: "",
    idElemento: "",
    idPeriodo: "",
    idAcop: "",
  });
  const [selectInputs, setSelectInputs] = useState({
    idEmpleado: null,
    idElemento: null,
    idPeriodo: null,
  });
  const nombreTabla = "ihhimpugnacionemp";

  const [mainList, setMainList] = useState({
    impugnacionEmp: [""],
  });
  const [auxList, setAuxList] = useState({
    empleados: [""],
    elementos: [""],
    periodos: [""],
    acops: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        empleados: data,
      }));
    });
  };
  const obtenerElementos = () => {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        elementos: data,
      }));
    });
  };
  const obtenerPeriodo = () => {
    var url = "pages/auxiliares/ihh_listadoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        periodos: data,
      }));
    });
  };
  const obtenerAcops = () => {
    var url = "pages/auxiliares/ihh_listadoAcopForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        acops: data,
      }));
    });
  };

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoImpugnacionEmp.php";
    var operationUrl = "ihh_listadoImpugnacionEmp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEmpleado: filters.idEmpleado,
      idElemento: filters.idElemento,
      idPeriodo: filters.idPeriodo,
      idAcop: filters.idAcop,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      console.log(data);
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ impugnacionEmp: datos.datos });
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Nombre empleado",
      field: "nomEmpleado",
      colId: "nomEmpleado",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idEmpleado === null
                ? setSelectInputs({ ...datos, idEmpleado: e.target.value })
                : // insertarImpugnacionEmp({
                  //     ...params,
                  //     idEmpleado: e.target.value,
                  //   })
                  editarImpugnacionEmp({
                    ...params,
                    idEmpleado: e.target.value,
                    field: "nomEmpleado",
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={
              params.data.idEmpleado || selectInputs.idEmpleado || ""
            }
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un tipo de empleado
            </option>
            {auxList.empleados.map((item) => (
              <option
                key={item.idEmpleado}
                selected={
                  params.data.idEmpleado === item.idEmpleado ? true : false
                }
                value={item.idEmpleado}
              >
                {item.nomEmpleado}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Nombre elemento",
      field: "nomElemento",
      colId: "nomElemento",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idElemento === null
                ? selectInputs({ ...datos, idElemento: e.target.value })
                : // insertarImpugnacionEmp({
                  //     ...params,
                  //     idElemento: e.target.value,
                  //   })
                  editarImpugnacionEmp({
                    ...params,
                    idElemento: e.target.value,
                    field: "nomElemento",
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={
              params.data.idElemento || selectInputs.idElemento || ""
            }
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un elemento
            </option>
            {auxList.elementos.map((item) => (
              <option
                key={item.idElementoImp}
                selected={
                  params.data.idElemento === item.idElementoImp ? true : false
                }
                value={item.idElementoImp}
              >
                {item.nomElemento}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Nombre período",
      field: "nomPeriodo",
      colId: "nomPeriodo",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      width: 150,
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idPeriodo === null
                ? setSelectInputs({ ...datos, idPeriodo: e.target.value })
                : // insertarImpugnacionEmp({
                  //     ...params,
                  //     idPeriodo: e.target.value,
                  //   })
                  editarImpugnacionEmp({
                    ...params,
                    idPeriodo: e.target.value,
                    field: "nomPeriodo",
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={params.data.idPeriodo || selectInputs.idPeriodo || ""}
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un periodo
            </option>
            {auxList.periodos.map((item) => (
              <option
                key={item.idPeriodo}
                selected={
                  params.data.idPeriodo === item.idPeriodo ? true : false
                }
                value={item.idPeriodo}
              >
                {item.nomPeriodo}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Cant. horas \n período",
      field: "cantHorasPeriodo",
      cellClass: "cellStyleNumber",
      editable: true,
      width: 120,
      colId: "cantHorasPeriodo",
    },
    {
      headerName: "Cant. horas extra",
      field: "cantHorasExtra",
      cellClass: "cellStyleNumber",
      editable: true,
      width: 120,
      colId: "cantHorasExtra",
    },
    {
      headerName: "Proyecto asociado (ACOP)",
      field: "nomProyecto",
      cellClass: "cellStyleText",
      width: 150,
      colId: "nomProyecto",
    },
    {
      headerName: "Valor HH",
      field: "valorHH",
      cellClass: "cellStyleText",
      width: 150,
      colId: "valorHH",
    },
    {
      headerName: "Operaciones",
      autoHeight: true,
      wrapText: true,
      width: 350,
      cellClass: "operaciones",
      colId: "operaciones",
      cellRenderer: function (params) {
        return (
          <div className="containerOperations">
            <Link to={`/listadoEmpleados/${params.data.idEmpleado}`}>
              <Button
                data-title="Empleado relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsPeopleFill id="icons" />
              </Button>
            </Link>
            <Link to={`/ihh/listadoElementoImp/${params.data.idElemento}`}>
              <Button
                data-title="Elemento relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsBookmarksFill id="icons" />
              </Button>
            </Link>
            <Link to={`/ihh/listadoPeriodo/${params.data.idPeriodo}`}>
              <Button
                data-title="Periodo relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsCalendar2CheckFill id="icons" />
              </Button>
            </Link>
            <Link to={`/listadoEddProyecto/${params.data.idProyecto}`}>
              <Button
                data-title="Proyecto relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsFillDiagram3Fill id="icons" />
              </Button>
            </Link>
            <Link
              to={`/ihh/listadoNotaImpugnacion/${params.data.idImpugnacionEmp}`}
            >
              <Button
                data-title="Notas relacionadas"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsFillChatDotsFill id="icons" />
              </Button>
            </Link>
            <Button
              data-title="Desactivar impugnacion"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idImpugnacionEmp)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.impugnacionEmp.map((elemento) => ({
    ...elemento,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function editarImpugnacionEmp(params) {
    if (
      params.data.idEmpleado === null ||
      params.data.idElemento === null ||
      params.data.idPeriodo === null ||
      params.data.cantHorasPeriodo === null ||
      params.data.cantHorasExtra === null
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
      location.reload();
    } else {
      switch (params.field) {
        case "nomEmpleado":
          var data = {
            idImpugnacionEmp: params.data.idImpugnacionEmp,
            idEmpleado: params.idEmpleado,
            idElemento: params.data.idElemento,
            idPeriodo: params.data.idPeriodo,
            idAcop: params.data.idAcop,
            cantHorasPeriodo: params.data.cantHorasPeriodo,
            cantHorasExtra: params.data.cantHorasExtra,
            factor: params.data.factor,
            isActive: 1,
            usuarioCreacion: userData.usuario,
          };
          break;
        case "nomElemento":
          var data = {
            idImpugnacionEmp: params.data.idImpugnacionEmp,
            idEmpleado: params.data.idEmpleado,
            idElemento: params.idElemento,
            idPeriodo: params.data.idPeriodo,
            idAcop: params.data.idAcop,
            cantHorasPeriodo: params.data.cantHorasPeriodo,
            cantHorasExtra: params.data.cantHorasExtra,
            factor: params.data.factor,
            isActive: 1,
            usuarioCreacion: userData.usuario,
          };
          break;
        case "nomPeriodo":
          var data = {
            idImpugnacionEmp: params.data.idImpugnacionEmp,
            idEmpleado: params.data.idEmpleado,
            idElemento: params.data.idElemento,
            idPeriodo: params.idPeriodo,
            idAcop: params.data.idAcop,
            cantHorasPeriodo: params.data.cantHorasPeriodo,
            cantHorasExtra: params.data.cantHorasExtra,
            factor: params.data.factor,
            isActive: 1,
            usuarioCreacion: userData.usuario,
          };
          break;
        default:
          break;
      }
      const url = "pages/editar/ihh_editarImpugnacionEmp.php";
      const operationUrl = "ihh_editarImpugnacionEmp";
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.impugnacionEmp.map((item) => {
      return item.idImpugnacionEmp === registro.idImpugnacionEmp
        ? registro
        : item;
    });

    setMainList({ impugnacionEmp: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idImpugnacionEmp: null,
      cantHorasPeriodo: 0,
      cantHorasExtra: 0,
    }; // Crea una nueva fila vacía
    setMainList({ impugnacionEmp: [newRow, ...mainList.impugnacionEmp] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarImpugnacionEmp(params) {
    const url = "pages/insertar/ihh_insertarElementoImp.php";
    const operationUrl = "ihh_insertarElementoImp";
    var data = {
      idEmpleado: selectInputs.idElemento,
      idElemento: selectInputs.idElemento,
      idPeriodo: selectInputs.idPeriodo,
      idAcop: params.data.idAcop,
      cantHorasExtra: params.data.cantHorasExtra,
      cantHorasPeriodo: params.data.cantHorasPeriodo,
      factor: params.data.factor,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (
      selectInputs.idEmpleado === null &&
      selectInputs.idElemento === null &&
      selectInputs.idPeriodo === null &&
      idAcop === null &&
      params.data.cantHorasExtra=== null &&
      params.data.cantHorasPeriodo === null &&
      params.data.factor === null
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {

      console.log(data);
      // SendDataService(url, operationUrl, data).then((response) => {
      //   const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      //   TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      //   actualizarRegistros(datos);
      //   location.reload();
      // });
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
      obtenerDatos();
      obtenerEmpleados();
      obtenerElementos();
      obtenerPeriodo();
      obtenerAcops();
    },
    [filters, num_boton, cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">
            Listado de impugnaciones de horas de empleados
          </h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de impugnaciones de horas de empleados
          </h6>
          <br></br>

          <div id="selectPaginador">
            <Button id="btn" onClick={addNewRow}>
              Agregar Nueva Fila
            </Button>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Empleados">Empleado: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idEmpleado: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.empleados.map((valor) => (
                  <option value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Elementos">Elementos: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idElemento: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.elementos.map((valor) => (
                  <option value={valor.idElementoImp}>
                    {valor.nomElemento}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Periodo">Período: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idPeriodo: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.periodos.map((valor) => (
                  <option value={valor.idPeriodo}>{valor.nomPeriodo}</option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Acop">Proyecto: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idAcop: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.acops.map((valor) => (
                  <option value={valor.idAcop}>{valor.nomProyecto}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="ag-theme-quartz"
            style={{ height: "400px", position: "relative" }}
          >
            <br></br>
            <br></br>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              className="tabla"
              autoSizeStrategy={autoSizeStrategy}
              ref={gridRef}
              rowSelection="single"
              editType="fullRow"
              getRowId={(params) => params.data.idImpugnacionEmp}
              suppressRowClickSelection={true}
              suppressCellSelection={true}
              onRowValueChanged={(params) => {
                params.data.idImpugnacionEmp === null
                  ? insertarImpugnacionEmp(params)
                  : editarImpugnacionEmp(params);
              }}
            />
          </div>
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
