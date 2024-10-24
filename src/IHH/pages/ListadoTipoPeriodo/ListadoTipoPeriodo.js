import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import Spinner from "../../../templates/spinner/spinner";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../WordWrap.css";

export default function IHH_ListadoTipoPeriodo() {
  const [, params] = useRoute("/ihh/listadoTipoPeriodo/:idTipoPeriodo");
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [loadedData, setLoadedData] = useState(false);

  const nombreTabla = "ihhtipoperiodo";
  const nuevoTipoElemento = "Ingrese un nuevo nombre";
  const nuevaDescripcion = "Ingrese una nueva descripción (opcional)";
  const nuevoDias = "Ingrese una nueva cantidad de días";

  const [mainList, setMainList] = useState({
    tipoPeriodo: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoPeriodo: [""],
  });
  const [filters, setFilters] = useState({
    idTipoPeriodo: params.idTipoPeriodo,
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoTipoPeriodo.php";
    var operationUrl = "ihh_listadoTipoPeriodo";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoPeriodo: filters.idTipoPeriodo,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ tipoPeriodo: datos.datos });
      setLoadedData(true);
    });
  };

  const obtenerTipoPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList({ tipoPeriodo: data });
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Nombre tipo de período",
      field: "nomTipoPeriodo",
      editable: true,
      width: 200,
      colId: "nomTipoPeriodo",
    },
    {
      headerName: "Días",
      field: "dias",
      editable: true,
      width: 80,
      // cellClass: "cellStyleNumber",
      colId: "dias",
    },
    {
      headerName: "Descripción",
      field: "descripcion",
      editable: true,
      width: 600,
      wrapText: true,
      autoHeight: true,
      colId: "descripcion",
    },
    {
      headerName: "Operaciones",
      colId: "Operaciones",
      cellRenderer: function (params) {
        return (
          <div style={{ color: "black" }}>
            <Button
              data-title="Desactivar tipo de periodo"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idTipoPeriodo)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.tipoPeriodo.map((tipoPeriodo) => ({
    ...tipoPeriodo,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function editarTipoPeriodo(params) {
    const errores = validaciones(params);
    if (!errores) {
      var data = {
        idTipoPeriodo: params.data.idTipoPeriodo,
        nomTipoPeriodo: params.data.nomTipoPeriodo,
        dias: params.data.dias,
        descripcion: params.data.descripcion,
        isActive: 1,
        usuarioCreacion: userData.usuario,
      };
      const url = "pages/editar/ihh_editarTipoPeriodo.php";
      const operationUrl = "ihh_editarTipoPeriodo";

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.tipoPeriodo.map((item) => {
      return item.idTipoPeriodo === registro.idTipoPeriodo ? registro : item;
    });
    setMainList({ tipoPeriodo: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idTipoPeriodo: null,
      nomTipoElemento: nuevoTipoElemento,
      dias: nuevoDias,
      descripcion: nuevaDescripcion,
    }; // Crea una nueva fila vacía
    setMainList({ tipoPeriodo: [newRow, ...mainList.tipoPeriodo] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function validaciones(params) {
    console.log(params);

    const regexNumeros = /^[0-9]+$/;

    // Validación para evitar letras en días
    if (!regexNumeros.test(params.data.dias)) {
      TopAlertsError(
        "1",
        "Los días no pueden contener letras ni caracteres especiales"
      );
      return true;
    }

    return false;
  }

  function insertarTipoPeriodo(params) {
    const url = "pages/insertar/ihh_insertarTipoPeriodo.php";
    const operationUrl = "ihh_insertarTipoPeriodo";
    var data = {
      nomTipoPeriodo: params.data.nomTipoPeriodo,
      dias: params.data.dias,
      descripcion:
        params.data.descripcion === nuevaDescripcion
          ? ""
          : params.data.descripcion,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (params.data.nomTipoPeriodo === null || params.data.dias === null) {
      TopAlertsError(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      const errores = validaciones(params);
      if (!errores) {
        SendDataService(url, operationUrl, data).then((response) => {
          console.log(response);

          const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
          actualizarRegistros(datos);
        });
      }
    }
  }

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarTipoPeriodo.php";
        var operationUrl = "ihh_desactivarTipoPeriodo";
        var data = {
          idTipoPeriodo: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
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
    },
    [num_boton, cantidadPorPagina, loadedData, filters.idTipoPeriodo]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <a id="btnAtras" href="/ihh/listadoPeriodo/0">
            Volver
          </a>
          <h1 id="TitlesPages">Listado de tipos de períodos</h1>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Listado de tipos de períodos
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
                  <option
                    value={valor.idTipoPeriodo}
                    selected={
                      valor.idTipoPeriodo === filters.idTipoPeriodo
                        ? true
                        : false
                    }
                  >
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
                  getRowId={(params) => params.data.idTipoPeriodo}
                  suppressRowClickSelection={true}
                  suppressCellSelection={true}
                  onRowValueChanged={(params) => {
                    params.data.idTipoPeriodo === null
                      ? insertarTipoPeriodo(params)
                      : editarTipoPeriodo(params);
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
