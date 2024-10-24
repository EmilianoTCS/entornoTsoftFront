import React, { useState, useEffect, useMemo, useRef } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Spinner from "../../../templates/spinner/spinner";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import getDataService from "../../../services/GetDataService";
import InsertarNotaImpugnacion from "../../forms/insertar/insertarNotaImpugnacion";
import EditarNotaImpugnacion from "../../forms/editar/EditarNotaImpugnacion";

import TopAlerts from "../../../templates/alerts/TopAlerts";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function IHH_ListadoNotaImpugnacion() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [filters, setFilters] = useState({
    idImpugnacionEmp: "",
  });
  const nombreTabla = "ihhnotaimpugnacion";
  const [loadedData, setLoadedData] = useState(false);

  const nuevaNota = "Ingrese una nueva nota";
  const nuevoIdImpugnacion = 1;

  const [mainList, setMainList] = useState({
    notaImpugnacion: [""],
  });
  const [auxList, setAuxList] = useState({
    impugnacionEmp: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerImpugnacionEmp = () => {
    const url = "pages/auxiliares/ihh_listadoImpugnacionEmpForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((data) => {
      setAuxList({ impugnacionEmp: data });
    });
  };

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoNotaImpugnacion.php";
    var operationUrl = "ihh_listadoNotaImpugnacion";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idImpugnacionEmp: filters.idImpugnacionEmp,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ notaImpugnacion: datos.datos });
      setLoadedData(true);
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Nota impugnación",
      field: "nota",
      editable: true,
    },
    {
      headerName: "Impugnación - empleado",
      field: "idImpugnacionEmp",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idNotaImpugnacion === null
                ? insertarAcop({ ...params, idImpugnacionEmp: e.target.value })
                : editarAcop({
                    ...params,
                    field: "idImpugnacionEmp",
                    idImpugnacionEmp: e.target.value,
                  });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={params.data.idImpugnacionEmp || ""}
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona la relación impugnación - empleado
            </option>
            {auxList.impugnacionEmp.map((item) => (
              <option
                key={item.idImpugnacionEmp}
                selected={
                  params.data.idImpugnacionEmp === item.idImpugnacionEmp
                    ? true
                    : false
                }
                value={item.idImpugnacionEmp}
              >
                {item.nomImpugnacionEmp}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      headerName: "Operaciones",
      cellRenderer: function (params) {
        return (
          <div style={{ color: "black" }}>
            {/* <Button
              data-title="Editar cliente"
              id="OperationBtns"
              onClick={() => editarCliente(params.data.idCliente)}
              style={{color: "black"}}
            >
              <RiEditBoxFill id="icons" />
            </Button> */}
            {/* <Link to={`/listadoServicios/${params.data.idAcop}`}>
              <Button
                data-title="Servicios relacionados"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsFillKeyFill id="icons" />
              </Button>
            </Link> */}
            <Button
              data-title="Desactivar nota de impugnación"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idNotaImpugnacion)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.notaImpugnacion.map((nota) => ({
    ...nota,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function editarNotaImpugnacion(params) {
    if (params.data.nota === null || params.idImpugnacionEmp === null) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      if (params.field === "idImpugnacionEmp") {
        var data = {
          idNotaImpugnacion: params.data.idNotaImpugnacion,
          idImpugnacionEmp: params.idImpugnacionEmp,
          nota: params.data.nota,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      } else {
        var data = {
          idNotaImpugnacion: params.data.idNotaImpugnacion,
          idImpugnacionEmp: params.data.idImpugnacionEmp,
          nota: params.data.nota,
          isActive: 1,
          usuarioCreacion: userData.usuario,
        };
      }
      const url = "pages/editar/ihh_editarNotaImpugnacion.php";
      const operationUrl = "ihh_editarNotaImpugnacion";
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      });
    }
  }

  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.notaImpugnacion.map((item) => {
      return item.idNotaImpugnacion === registro.idNotaImpugnacion
        ? registro
        : item;
    });

    setMainList({ notaImpugnacion: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idNotaImpugnacion: null,
      idImpugnacionEmp: nuevoIdImpugnacion,
      nota: nuevaNota,
    }; // Crea una nueva fila vacía
    setMainList({ notaImpugnacion: [newRow, ...mainList.notaImpugnacion] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarNotaImpugnacion(params) {
    const url = "pages/insertar/ihh_insertarNotaImpugnacion.php";
    const operationUrl = "ihh_insertarNotaImpugnacion";
    var data = {
      idImpugnacionEmp: params.idImpugnacionEmp ?? 1,
      nota: params.data.nota,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (params.data.nota === null || params.idImpugnacionEmp === null) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
        // location.reload();
      });
    }
  }

  //-------------- useEffect y render

  useEffect(
    function () {
      obtenerDatos();
      obtenerImpugnacionEmp();
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
          <h1 id="TitlesPages">Listado de notas de impugnación</h1>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Listado de notas de impugnación
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
              <label htmlFor="input_Impugnacion">Impugnación: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idImpugnacionEmp: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.impugnacionEmp.map((valor) => (
                  <option
                    value={valor.idImpugnacionEmp}
                    selected={
                      filters.idImpugnacionEmp === valor.idImpugnacionEmp
                        ? true
                        : false
                    }
                  >
                    {valor.nomImpugnacionEmp}
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
                  getRowId={(params) => params.data.idNotaImpugnacion}
                  suppressRowClickSelection={true}
                  suppressCellSelection={true}
                  onRowValueChanged={(params) => {
                    params.data.idNotaImpugnacion === null
                      ? insertarNotaImpugnacion(params)
                      : editarNotaImpugnacion(params);
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
