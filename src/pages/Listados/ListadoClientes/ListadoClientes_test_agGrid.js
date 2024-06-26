import React, { useState, useEffect, useMemo, useRef } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill } from "react-icons/bs";
import "../TablasStyles.css";
import InsertarClientes from "../../../templates/forms/Insertar/InsertarClientes";
import EditarCliente from "../../../templates/forms/Editar/EditarCliente";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";
import { FormControl, Select, MenuItem } from "@mui/material";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import TopAlertsError from "../../../templates/alerts/TopAlerts";

export default function ListadoClientes_test_agGrid() {
  const [cliente, setCliente] = useState([""]);
  const [isActiveInsertCliente, setIsActiveInsertCliente] = useState(false);
  const [isActiveEditCliente, setIsActiveEditCliente] = useState(false);
  const [idCliente, setidCliente] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "cliente";
  const [listPais, setlistPais] = useState([""]);

  const nuevoNombreCliente = "Ingrese un nuevo nombre";
  const nuevoDireccionCliente = "Ingrese una nueva dirección";

  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }

  const gridRef = useRef();

  const columnDefs = [
    // { headerName: "ID", field: "idCliente" },
    { headerName: "Cliente", field: "nomCliente", editable: true },
    { headerName: "Dirección", field: "direccionCliente", editable: true },
    {
      headerName: "País",
      field: "nomPais",
      cellStyle: { padding: "0", verticalAlign: "center", display: "flex" },
      cellRenderer: function (params) {
        return (
          <select
            onChange={(e) => {
              params.data.idCliente === null
                ? insertarCliente({ ...params, idPais: e.target.value })
                : editarCliente({ ...params, idPais: e.target.value });
            }}
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={params.data.idPais || ""}
            // className="ag-theme-material"
            className="select-hover-ag-grid"
            style={{ width: "100%", border: "none" }}
          >
            <option value="" disabled>
              Selecciona una nacionalidad
            </option>
            {listPais.map((item) => (
              <option
                key={item.idPais}
                selected={params.data.idPais === item.idPais ? true : false}
                value={item.idPais}
              >
                {item.nomPais}
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
            <Link to={`/listadoServicios/${params.data.idCliente}`}>
              <Button
                data-title="Servicios relacionados"
                id="OperationBtns"
                style={{ color: "black" }}
              >
                <BsFillKeyFill id="icons" />
              </Button>
            </Link>
            <Button
              data-title="Desactivar cliente"
              id="OperationBtns"
              onClick={() => desactivar(params.data.idCliente)}
              style={{ color: "black" }}
            >
              <BsFillTrashFill id="icons" />
            </Button>
          </div>
        );
      },
    },
  ];

  const rowData = cliente.map((cliente) => ({
    ...cliente,
  }));

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitGridWidth",
    };
  }, []);

  
  function editarCliente(params) {
    if (
      params.data.nomCliente === null ||
      params.data.direccionCliente === null ||
      params.idPais === ""
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
      location.reload();
    } else {
      var data = {
        usuarioModificacion: userData.usuario,
        idCliente: params.data.idCliente,
        nomCliente: params.data.nomCliente,
        idPais: params.idPais,
        direccionCliente: params.data.direccionCliente,
      };

      var url = "pages/editar/editarCliente.php";
      var operationUrl = "editarCliente";

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        console.log(datos);
        actualizarRegistros(datos);
      });
    }
  }

  function actualizarRegistros(registro) {
    console.log(registro);
    const nuevosRegistros = cliente.map((item) => {
      return item.idCliente === registro.idCliente ? registro : item;
    });

    setCliente(nuevosRegistros );
    gridRef.current.api.redrawRows();
  }



  const addNewRow = () => {
    console.log("clicked");
    const newRow = {
      idCliente: null,
      nomCliente: nuevoNombreCliente,
      direccionCliente: nuevoDireccionCliente,
      idPais: null,
      nomPais: null,
    }; // Crea una nueva fila vacía
    setCliente([newRow, ...cliente]); // Agrega la nueva fila al estado
    setTimeout(() => {
      gridRef.current.api.ensureIndexVisible(1); // Asegura que la nueva fila sea visible
    }, 0);
  };

  function insertarCliente(params) {
    const url = "pages/insertar/insertarCliente.php";
    const operationUrl = "insertarCliente";
    var data = {
      usuarioCreacion: userData.usuario,
      nomCliente: params.data.nomCliente,
      direccionCliente: params.data.direccionCliente,
      idPais: params.idPais,
    };
    console.log(data);

    if (
      params.data.nomCliente === null ||
      params.data.direccionCliente === null ||
      params.idPais === ""
    ) {
      TopAlerts(
        "02",
        "Todos los campos deben estar completos, una vez llenos, utiliza tecla ENTER para guardar los cambios"
      );
    } else {
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
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

  useEffect(
    function () {
      obtenerPais();
      handleChangePaginador();
    },
    [num_boton, cantidadPorPagina]
  );

  //PAGINADOR ---------------------

  function handleChangePaginador() {
    var url = "pages/listados/listadoClientes.php";
    var operationUrl = "listadoClientes";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setCliente(datos.datos);
    });
  }

  //PAGINADOR ---------------------

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de clientes</h1>
          <h6 style={{ color: "gray" }}>
            Factory Devops {"->"} Listado de clientes
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
          </div>

          <InsertarClientes
            isActiveCliente={isActiveInsertCliente}
            cambiarEstado={setIsActiveInsertCliente}
            cliente={cliente}
          ></InsertarClientes>

          <EditarCliente
            isActiveEditCliente={isActiveEditCliente}
            cambiarEstado={setIsActiveEditCliente}
            idCliente={idCliente}
            setCliente={setCliente}
            cliente={cliente}
            nombreTabla={nombreTabla}
          ></EditarCliente>

          <div className="ag-theme-alpine" style={{ height: "400px" }}>
            <br></br>
            <br></br>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              autoSizeStrategy={autoSizeStrategy}
              ref={gridRef}
              rowSelection="single"
              editType="fullRow"
              getRowId={(params) => params.data.idCliente}
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
                params.data.idCliente === null
                  ? insertarCliente(params)
                  : editarCliente(params);
              }}
              // onCellValueChanged={(params) => {
              //   setParamsCells(params);
              // }}
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
