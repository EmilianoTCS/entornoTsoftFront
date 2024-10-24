import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { BsFillTrashFill } from "react-icons/bs";
import Spinner from "../../../templates/spinner/spinner";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../WordWrap.css";

export default function IHH_ListadoTipoElemento() {
  const [, params] = useRoute("/ihh/listadoTipoElemento/:idTipoElemento");
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const [loadedData, setLoadedData] = useState(false);
  const [idTipoElemento, setidTipoElemento] = useState(params.idTipoElemento);
  const nombreTabla = "ihhtipoelemento";

  const nuevoTipoElemento = "Ingrese un nuevo nombre";
  const nuevaDescripcion = "Ingrese una nueva descripción (opcional)";

  const [mainList, setMainList] = useState({
    tipoElemento: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoElementos: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoTipoElemento.php";
    var operationUrl = "ihh_listadoTipoElemento";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoElemento: idTipoElemento,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ tipoElemento: datos.datos });
      setLoadedData(true);
    });
  };
  const obtenerTipoElementos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      console.log(data);
      setAuxList({ tipoElementos: data });
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Nombre tipo de elemento",
      field: "nomTipoElemento",
      editable: true,
      width: 300,
      colId: "nomTipoElemento",
    },
    {
      headerName: "Descripción",
      field: "descripcion",
      editable: true,
      wrapText: true,
      autoHeight: true,
      width: 600,
      colId: "descripcion",
    },
    {
      headerName: "Operaciones",
      width: 120,
      colId: "Operaciones",
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
              data-title="Desactivar tipo de elemento"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idTipoElemento)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.tipoElemento.map((tipoElemento) => ({
    ...tipoElemento,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function editarTipoElemento(params) {
    if (params.data.nomTipoElemento === null) {
      TopAlertsError(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
      location.reload();
    } else {
      var data = {
        idTipoElemento: params.data.idTipoElemento,
        nomTipoElemento: params.data.nomTipoElemento,
        descripcion: params.data.descripcion,
        isActive: 1,
        usuarioCreacion: userData.usuario,
      };
      const url = "pages/editar/ihh_editarTipoElemento.php";
      const operationUrl = "ihh_editarTipoElemento";

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    const nuevosRegistros = mainList.tipoElemento.map((item) => {
      return item.idTipoElemento === registro.idTipoElemento ? registro : item;
    });
    setMainList({ tipoElemento: nuevosRegistros });
    gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idTipoElemento: null,
      nomTipoElemento: nuevoTipoElemento,
      descripcion: nuevaDescripcion,
    }; // Crea una nueva fila vacía
    setMainList({ tipoElemento: [newRow, ...mainList.tipoElemento] }); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarTipoElemento(params) {
    const url = "pages/insertar/ihh_insertarTipoElemento.php";
    const operationUrl = "ihh_insertarTipoElemento";
    var data = {
      nomTipoElemento: params.data.nomTipoElemento,
      descripcion:
        params.data.descripcion === nuevaDescripcion
          ? ""
          : params.data.descripcion,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    if (params.data.nomTipoElemento === null) {
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
        var url = "pages/desactivar/ihh_desactivarTipoElementoImp.php";
        var operationUrl = "ihh_desactivarTipoElementoImp";
        var data = {
          idTipoElemento: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }

  //-------------- useEffect y render

  useEffect(
    function () {
      obtenerDatos();
      obtenerTipoElementos();
    },
    [num_boton, cantidadPorPagina, loadedData, idTipoElemento]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <a id="btnAtras" href="/ihh/listadoElementoImp/0">
            Volver
          </a>
          <h1 id="TitlesPages">Listado de tipos de elementos</h1>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Listado de tipos de elementos
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
              <label htmlFor="input_tipoElementos">Tipo de elementos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidTipoElemento(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.tipoElementos.map((valor) => (
                  <option value={valor.idTipoElemento}>
                    {valor.nomTipoElemento}
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
                  getRowId={(params) => params.data.idTipoElemento}
                  suppressRowClickSelection={true}
                  suppressCellSelection={true}
                  onRowValueChanged={(params) => {
                    params.data.idTipoElemento === null
                      ? insertarTipoElemento(params)
                      : editarTipoElemento(params);
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
