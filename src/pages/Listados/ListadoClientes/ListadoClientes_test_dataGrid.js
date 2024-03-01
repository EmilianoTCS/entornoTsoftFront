import React, { useState, useEffect } from "react";
import ReactDataGrid from "react-data-grid";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import { BsFillTrashFill } from "react-icons/bs";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillKeyFill } from "react-icons/bs";
import InsertarClientes from "../../../templates/forms/Insertar/InsertarClientes";
import EditarCliente from "../../../templates/forms/Editar/EditarCliente";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import TopAlerts from "../../../templates/alerts/TopAlerts";
import Paginador from "../../../templates/Paginador/Paginador";
import Button from "react-bootstrap/Button";
import "../BtnInsertar.css";

import "react-data-grid/lib/styles.css";

import DataGrid from "react-data-grid";

export default function ListadoClientes_test_dataGrid() {
  const [cliente, setCliente] = useState([]);
  const [isActiveInsertCliente, setIsActiveInsertCliente] = useState(false);
  const [isActiveEditCliente, setIsActiveEditCliente] = useState(false);
  const [idCliente, setidCliente] = useState(null);
  const [num_boton, setNumBoton] = useState(1);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "cliente";

  function insertarCliente() {
    setIsActiveInsertCliente(!isActiveInsertCliente);
  }

  function editarCliente(ID) {
    setIsActiveEditCliente(!isActiveEditCliente);
    setidCliente(ID);
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
      handleChangePaginador();
    },
    [num_boton, cantidadPorPagina]
  );

  // PAGINADOR ---------------------

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

  // PAGINADOR ---------------------

  const columns = [
    // { key: "idCliente", name: "ID" },
    { key: "nomCliente", name: "Cliente" },
    { key: "direccionCliente", name: "Dirección" },
    { key: "nomPais", name: "País" },
    {
      key: "operaciones",
      name: "Operaciones",
      formatter: ({ row }) => (
        <div>
          <Button
            data-title="Editar cliente"
            id="OperationBtns"
            onClick={() => editarCliente(row.idCliente)}
          >
            <RiEditBoxFill id="icons" />
          </Button>
          <Link to={`/listadoServicios/${row.idCliente}`}>
            <Button data-title="Servicios relacionados" id="OperationBtns">
              <BsFillKeyFill id="icons" />
            </Button>
          </Link>
          <Button
            data-title="Desactivar cliente"
            onClick={() => desactivar(row.idCliente)}
            id="OperationBtns"
          >
            <BsFillTrashFill id="icons" />
          </Button>
        </div>
      ),
    },
  ];

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

          <ReactDataGrid
            columns={columns}
            rows={cliente}
            minHeight={500}rowKeyGetter={rowKeyGetter}
          />

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
