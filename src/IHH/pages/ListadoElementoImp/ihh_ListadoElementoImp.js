import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { useRoute } from "wouter";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { BsFillTrashFill } from "react-icons/bs";
import getDataService from "../../../services/GetDataService";
import { MdDashboard } from "react-icons/md";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { v4 as uuidv4 } from "uuid";

export default function IHH_ListadoElementoImp() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [, params] = useRoute("/ihh/listadoElementoImp/:idElementoImp");
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [idTipoElemento, setidTipoElemento] = useState("");
  const [idTipoElementoSelect, setidTipoElementoSelect] = useState("");

  const [idElementoImp, setidElementoImp] = useState(params.idElementoImp);
  const nombreTabla = "ihhelementoimp";

  const nuevoNomTipoElemento = "";
  const nuevoNomElementoImp = "Ingrese una nuevo nombre al elemento";
  const nuevoDescripcion = "Ingrese una nueva descripción";

  const [mainList, setMainList] = useState({
    elementos: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoElementos: [""],
  });
  const [listElementosImp, setlistElementosImp] = useState([]);
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoElementoImp.php";
    var operationUrl = "ihh_listadoElementoImp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoElemento: idTipoElemento,
      idElementoImp: idElementoImp,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ elementos: datos.datos });
    });
  };
  const obtenerTipoElementos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList({ tipoElementos: data });
    });
  };
  const obtenerElementosImp = () => {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setlistElementosImp(data);
    });
  };

  //----- definiciones data grid

  const gridRef = useRef();

  const generateUniqueId = () => {
    return uuidv4();
  };
  const removerElemento = (item) => {
    const newArray = mainList.elementos.filter(
      (element) => element.idRandom !== item
    );
    // setListDetalleMensual(newArray);
    setMainList({ elementos: newArray });

    gridRef.current.api.updateGridOptions({ rowData: mainList.elementos });
  };

  const columnDefs = [
    {
      headerName: "Nombre del elemento",
      field: "nomElemento",
      editable: true,
      cellClass: "cellStyleText",
      colId: "nomElemento",
    },
    {
      headerName: "Tipo de elemento",
      field: "nomTipoElemento",
      colId: "nomTipoElemento",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idTipoElemento = e.target.value;
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={params.data.idTipoElemento || ""}
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona un tipo de elemento
            </option>
            {auxList.tipoElementos.map((item) => (
              <option
                key={item.idTipoElemento}
                selected={
                  params.data.idTipoElemento === item.idTipoElemento
                    ? true
                    : false
                }
                value={item.idTipoElemento}
              >
                {item.nomTipoElemento}
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
      width: 500,
      wrapText: true,
      autoHeight: true,
      colId: "descripcion",
    },
    {
      headerName: "Operaciones",
      colId: "operaciones",
      cellRenderer: function (params) {
        return (
          <div style={{ color: "black" }}>
            <Link to={`/ihh/listadoTipoElemento/${params.data.idTipoElemento}`}>
              <Button
                data-title="Tipo de elemento relacionado"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <MdDashboard id="icons" />
              </Button>
            </Link>
            <Button
              data-title="Desactivar elemento de impugnación"
              id="OperationBtns"
              onClick={() => desactivar(params)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = mainList.elementos.map((elemento) => ({
    ...elemento,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  //----------------------- Operaciones

  function validaciones(params) {
    if (params.data.nomElemento === "") {
      TopAlertsError("01", "El nombre del elemento no debe estar vacío");
      return true;
    } else if (parseInt(params.data.idTipoElemento) < 1) {
      TopAlertsError("02", "Seleccione un tipo de elemento válido");
      return true;
    } else {
      return false;
    }
  }

  const onCellKeyPress = (params) => {
    console.log(params);
    
    if (params.event.key === "Enter") {
      params.data.idElementoImp === null
        ? insertarElementoImp(params)
        : editarElementoImp(params);
    }
  };
  function editarElementoImp(params) {
    if (!validaciones(params)) {
      var data = {
        idElementoImp: params.data.idElementoImp,
        idTipoElemento: params.data.idTipoElemento,
        nomElemento: params.data.nomElemento,
        descripcion: params.data.descripcion,
        isActive: 1,
        usuarioCreacion: userData.usuario,
      };

      const url = "pages/editar/ihh_editarElementoImp.php";
      const operationUrl = "ihh_editarElementoImp";

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    console.log(registro);
    const nuevosRegistros = mainList.elementos.map((item) => {
      return item.idElementoImp === registro.idElementoImp ? registro : item;
    });

    setMainList({ elementos: nuevosRegistros });
    // gridRef.current.api.redrawRows();
  }

  const addNewRow = () => {
    const newRow = {
      idElementoImp: null,
      idTipoElemento: nuevoNomTipoElemento,
      nomElemento: nuevoNomElementoImp,
      descripcion: nuevoDescripcion,
      idRandom: generateUniqueId(),
    };
    setMainList({ elementos: [newRow, ...mainList.elementos] }); // Agrega la nueva fila al estado
  };

  function insertarElementoImp(params) {
    console.log("insert", params);
    
    if (!validaciones(params)) {
      const url = "pages/insertar/ihh_insertarElementoImp.php";
      const operationUrl = "ihh_insertarElementoImp";
      var data = {
        idTipoElemento: params.data.idTipoElemento,
        nomElemento: params.data.nomElemento,
        descripcion: params.data.descripcion,
        isActive: 1,
        usuarioCreacion: userData.usuario,
      };

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      });
    }
  }

  function desactivar(params) {
    if (params.data.idElementoImp) {
      let text = "Esta acción no se puede deshacer";
      ConfirmAlert(text).then((response) => {
        if (response === true) {
          var url = "pages/desactivar/ihh_desactivarElementoImp.php";
          var operationUrl = "ihh_desactivarElementoImp";
          var data = {
            idElemento: params.data.idElementoImp,
            usuarioModificacion: userData.usuario,
          };
          SendDataService(url, operationUrl, data).then((response) => {
            const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
            TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
          });
        }
      });
    }else{
      removerElemento(params.data.idRandom)
    }
  }
  //-------------- useEffect y render

  useEffect(
    function () {
      obtenerDatos();
      obtenerTipoElementos();
      obtenerElementosImp();
    },
    [
      idTipoElemento,
      num_boton,
      cantidadPorPagina,
      idTipoElemento,
      idElementoImp,
    ]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de elementos de impugnación</h1>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Listado de elementos de impugnación
          </h6>
          <br></br>

          <div id="selectPaginador">
            {/* <Button id="btn" onClick={insertarCliente}>
              Crear Cliente
            </Button> */}

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
              <label htmlFor="input_tipoElementos">Elementos: </label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => {
                  setidElementoImp(target.value);
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {listElementosImp.map((valor) => (
                  <option
                    selected={
                      idElementoImp === valor.idElementoImp ? true : false
                    }
                    value={valor.idElementoImp}
                  >
                    {valor.nomElemento}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ag-theme-quartz" style={{ height: "400px" }}>
            <br></br>
            <br></br>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              autoSizeStrategy={autoSizeStrategy}
              ref={gridRef}
              rowSelection="single"
              editType="fullRow"
              getRowId={(params) => params.data.idRandom}
              suppressRowClickSelection={true}
              suppressCellSelection={true}
              onCellKeyDown={onCellKeyPress}
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
