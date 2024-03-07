import React, { useState, useEffect, useMemo } from "react";
// import { Container, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
// import { BsFillTrashFill } from "react-icons/bs";
// import { RiEditBoxFill } from "react-icons/ri";
// import { BsFillKeyFill } from "react-icons/bs";
import "../TablasStyles.css";
import InsertarClientes from "../../../templates/forms/Insertar/InsertarClientes";
import EditarCliente from "../../../templates/forms/Editar/EditarCliente";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function ListadoClientes_test_mui_datagrid() {
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
  const [loadedData, setLoadedData] = useState(false);

  const apiRef = useGridApiRef();

  function insertarCliente() {
    setIsActiveInsertCliente(!isActiveInsertCliente);
  }

  function editarCliente(params) {
    var url = "pages/editar/editarCliente.php";
    var operationUrl = "editarCliente";
    var data = {
      usuarioModificacion: userData.usuario,
      idCliente: params.data.idCliente,
      nomCliente: params.data.nomCliente,
      direccionCliente: params.data.direccionCliente,
    };
    // console.log(data);

    // SendDataService(url, operationUrl, data).then((response) => {
    //   const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
    //   TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
    //   // actualizarCliente(datos);
    // });
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
  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }
  useEffect(
    function () {
      obtenerPais();
      handleChangePaginador();
    },
    [num_boton, cantidadPorPagina, loadedData]
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
      setLoadedData(true);
    });
  }

  //PAGINADOR ---------------------

  const MyDataGrid = () => {
    if (loadedData) {
      function getRowId(row) {
        console.log(row.idCliente);
        return row.idCliente;
      }

      //   const handleEditChange = (newValues) => {
      //     // console.log(newValues);
      //     // const { field, row, newValue } = newValues;
      //     // if (field === "nomPais") {
      //     //   const { nomCliente, direccionCliente, idPais, idCliente } = row;
      //     //   var data = {
      //     //     nomCliente: nomCliente,
      //     //     direccionCliente: direccionCliente,
      //     //     idPais: newValue,
      //     //     idCliente: idCliente,
      //     //   };
      //     // } else {
      //     //   const { nomCliente, direccionCliente, idPais, idCliente } = newValues;
      //     //   var data = {
      //     //     nomCliente: nomCliente,
      //     //     direccionCliente: direccionCliente,
      //     //     idPais: idPais,
      //     //     idCliente: idCliente,
      //     //   };
      //     // }
      //   };
      const handleEditChange = (newRow) => {
        var auxVar = "";
        const updatedRow = { ...newRow, isNew: false };
        console.log(updatedRow);
        auxVar = cliente.map((row) =>
          row.idCliente === newRow.idCliente ? updatedRow : row
        );
        return updatedRow;
      };
      //   console.log("json", cliente);

      const columns = [
        { field: "idCliente", headerName: "ID", width: 90 },
        {
          field: "nomCliente",
          headerName: "Nombre",
          width: 200,
          editable: true,
        },
        {
          field: "direccionCliente",
          headerName: "Apellido",
          width: 200,
          editable: true,
          renderCell: (params) => (
              <Select
                onChange={(e) =>
                  handleEditChange([{ ...params, newValue: e.target.value }][0])
                }
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={params.row.idPais || ""}
              >
                <MenuItem value="" disabled>
                  Selecciona una nacionalidad
                </MenuItem>
                {listPais.map((item) => (
                  <MenuItem
                    key={item.idPais}
                    selected={params.row.idPais === item.idPais ? true : false}
                    value={item.idPais}
                  >
                    {item.nomPais}
                  </MenuItem>
                ))}
              </Select>
          ),
        },
        {
          field: "nomPais",
          headerName: "Nacionalidad",
          width: 200,
          editable: true,
          renderCell: (params) => (
            <FormControl>
              <Select
                onChange={(e) =>
                  handleEditChange([{ ...params, newValue: e.target.value }][0])
                }
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={params.row.idPais || ""}
                style={{ width: "200px" }}
              >
                <MenuItem value="" disabled>
                  Selecciona una nacionalidad
                </MenuItem>
                {listPais.map((item) => (
                  <MenuItem
                    key={item.idPais}
                    selected={params.row.idPais === item.idPais ? true : false}
                    value={item.idPais}
                  >
                    {item.nomPais}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ),
        },
      ];

      return (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={cliente}
            editMode="cell"
            columns={columns}
            // getRowId={(row) =>
            //   row && row.idCliente ? row.idCliente : "idCliente"
            // }
            getRowId={getRowId}
            pageSize={10}
            processRowUpdate={(newRow, oldRow) => {
              handleEditChange(newRow);
            }}
            onProcessRowUpdateError={(error) => {
              console.log(error);
            }}
          />
        </div>
      );
    }
  };

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
            <Button id="btn" onClick={insertarCliente}>
              Crear Cliente
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

          <div>
            <MyDataGrid />
          </div>

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
