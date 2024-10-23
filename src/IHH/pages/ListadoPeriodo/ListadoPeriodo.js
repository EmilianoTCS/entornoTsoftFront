import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";

import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";

import Spinner from "../../../templates/spinner/spinner";

import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import "../../../Edd/pages/Listados/TablasStyles.css";
import "../WordWrap.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function IHH_ListadoPeriodo() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [loadedData, setLoadedData] = useState(false);
  const [idTipoPeriodoSelect, setidTipoPeriodoSelect] = useState("");
  const [listPeriodos, setListPeriodo] = useState([]);
  const [, params] = useRoute("/ihh/listadoPeriodo/:idPeriodo");

  const nuevaDescripcion = "Ingrese una nueva descripción (opcional)";
  const nuevoNomPeriodo = "Ingrese una nuevo nombre de periodo";
  const nuevoTipoPeriodo = "Ingrese una tipo de periodo";

  const [filters, setFilters] = useState({
    idTipoPeriodo: "",
    idPeriodo: params.idPeriodo,
  });
  const nombreTabla = "ihhperiodo";

  const [mainList, setMainList] = useState({
    periodos: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoPeriodo: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerTipoPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList({ tipoPeriodo: data });
    });
  };
  const obtenerPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setListPeriodo(data);
    });
  };

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoPeriodo.php";
    var operationUrl = "ihh_listadoPeriodo";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoPeriodo: filters.idTipoPeriodo,
      idPeriodo: filters.idPeriodo,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ periodos: datos.datos });
      setLoadedData(true);
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Nombre período",
      field: "nomPeriodo",
      editable: true,
      width: 200,
      cellClass: "cellStyleText",
    },
    {
      headerName: "Tipo período",
      field: "idTipoPeriodo",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idPeriodo === null
                ? setidTipoPeriodoSelect(e.target.value)
                : // insertarPeriodo({
                  //     ...params,
                  //     idTipoPeriodo: e.target.value,
                  //     field: "idTipoPeriodo",
                  //   })
                  editarPeriodo({
                    ...params,
                    idTipoPeriodo: e.target.value,
                    field: "idTipoPeriodo",
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={
              params.data.idTipoPeriodo || idTipoPeriodoSelect || ""
            }
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un tipo de periodo
            </option>
            {auxList.tipoPeriodo.map((item) => (
              <option
                key={item.idTipoPeriodo}
                selected={
                  params.data.idTipoPeriodo === item.idTipoPeriodo
                    ? true
                    : false
                }
                value={item.idTipoPeriodo}
              >
                {item.nomTipoPeriodo}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Descripción",
      field: "descripcion",
      editable: true,
      width: 600,
      wrapText: true,
      autoHeight: true,
    },

    {
      headerName: "Operaciones",
      colId: "operaciones",
      cellRenderer: function (params) {
        return (
          <div style={{ color: "black" }}>
            <Link to={`/ihh/listadoTipoPeriodo/${params.data.idTipoPeriodo}`}>
              <Button
                data-title="Tipo de periodo relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <MdDashboard id="icons" />
              </Button>
            </Link>
            <Button
              data-title="Desactivar periodo"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idPeriodo)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.periodos.map((periodo) => ({
    ...periodo,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function editarPeriodo(params) {
    if (params.data.idTipoPeriodo === null || params.data.nomPeriodo === null) {
      TopAlertsError(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      if (params.field === "idTipoPeriodo") {
        var data = {
          idPeriodo: params.data.idPeriodo,
          idTipoPeriodo: params.idTipoPeriodo,
          nomPeriodo: params.data.nomPeriodo,
          descripcion: params.data.descripcion,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      } else {
        var data = {
          idPeriodo: params.data.idPeriodo,
          idTipoPeriodo: params.data.idTipoPeriodo,
          nomPeriodo: params.data.nomPeriodo,
          descripcion: params.data.descripcion,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      }
      const url = "pages/editar/ihh_editarPeriodo.php";
      const operationUrl = "ihh_editarPeriodo";
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.periodos.map((item) => {
      return item.idPeriodo === registro.idPeriodo ? registro : item;
    });
    setMainList({ periodos: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idPeriodo: null,
      idTipoPeriodo: nuevoTipoPeriodo,
      nomPeriodo: nuevoNomPeriodo,
      descripcion: nuevaDescripcion,
    }; // Crea una nueva fila vacía
    setMainList({ periodos: [newRow, ...mainList.periodos] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarPeriodo(params) {
    const url = "pages/insertar/ihh_insertarPeriodo.php";
    const operationUrl = "ihh_insertarPeriodo";
    var data = {
      idTipoPeriodo: idTipoPeriodoSelect,
      nomPeriodo: params.data.nomPeriodo,
      descripcion: params.data.descripcion,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (
      params.data.nomPeriodo === null ||
      params.data.nomPeriodo === nuevoNomPeriodo ||
      params.idTipoPeriodo === null
    ) {
      TopAlertsError(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarPeriodo.php";
        var operationUrl = "ihh_desactivarPeriodo";
        var data = {
          idPeriodo: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT} = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }

  //-------------- useEffect y render

  useEffect(
    function () {
      obtenerDatos();
      obtenerTipoPeriodos();
      obtenerPeriodos();
    },
    [
      num_boton,
      cantidadPorPagina,
      loadedData,
      filters.idTipoPeriodo,
      filters.idPeriodo,
    ]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de períodos</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de períodos
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
              <label htmlFor="input_tipoElementos">Períodos: </label>
              <select
                required
                type="text"
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
                {listPeriodos.map((valor) => (
                  <option
                    value={valor.idPeriodo}
                    selected={
                      filters.idPeriodo === valor.idPeriodo ? true : false
                    }
                  >
                    {valor.nomPeriodo}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_tipoElementos">Tipo de períodos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idTipoPeriodo: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.tipoPeriodo.map((valor) => (
                  <option value={valor.idTipoPeriodo}>
                    {valor.nomTipoPeriodo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadedData ? (
            <>
              <br />
              <div className="ag-theme-quartz" style={{ height: "300px" }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  autoSizeStrategy={autoSizeStrategy}
                  ref={gridRef}
                  rowSelection="single"
                  editType="fullRow"
                  getRowId={(params) => params.data.idPeriodo}
                  suppressRowClickSelection={true}
                  suppressCellSelection={true}
                  onRowValueChanged={(params) => {
                    console.log(params);
                    params.data.idPeriodo === null
                      ? insertarPeriodo(params)
                      : editarPeriodo(params);
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
          <Paginador
            paginas={cantidadPaginas}
            cambiarNumero={setNumBoton}
            num_boton={num_boton}
          ></Paginador>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
