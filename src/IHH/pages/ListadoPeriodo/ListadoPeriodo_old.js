import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import getDataService from "../../../services/GetDataService";


import InsertarPeriodo from "../../forms/insertar/InsertarPeriodo";
import EditarPeriodo from "../../forms/editar/EditarPeriodo";

export default function IHH_ListadoPeriodo() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [filters, setFilters] = useState({
    idTipoPeriodo: "",
  });
  const nombreTabla = "ihhperiodo";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarPeriodo: false,
    insertarPeriodo: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    periodos: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoPeriodo: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  /**
   * The function `obtenerTipoPeriodos` retrieves data from a specified URL and sets it as the value of
   * `tipoPeriodo` in the `AuxList` object.
   */
  const obtenerTipoPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      console.log(data);
      setAuxList({ tipoPeriodo: data });
    });
  };
  /**
   * The function "obtenerDatos" sends a request to a server to retrieve data and then updates the
   * state with the received data.
   */
  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoPeriodo.php";
    var operationUrl = "ihh_listadoPeriodo";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoPeriodo: filters.idTipoPeriodo,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ periodos: datos.datos });
    });
  };

  /**
   * The function `activarFormulario` takes in an `idRegistro` and `nomOperacion` as parameters, and
   * updates the state variables `idRegistro` and `isActiveBooleans.editarPeriodo` based on the values
   * passed in.
   * @param idRegistro - The id of the registration or record that needs to be activated in the form.
   * @param nomOperacion - The parameter "nomOperacion" is a string that represents the operation to be
   * performed. In this case, it is used to determine if the operation is "editar" (edit) or not.
   */
  const activarFormulario = (idRegistro, nomOperacion) => {
    setIdRegistro(idRegistro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarPeriodo: true,
      }));
    }
  };

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is being used to fetch data and update the component's state. */
  useEffect(
    function () {
      obtenerDatos();
      obtenerTipoPeriodos();
    },
    [filters, num_boton,cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de períodos</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarPeriodo: true,
                }));
              }}
            >
              Crear nuevo periodo
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
                  <option value={valor.idTipoPeriodo}>
                    {valor.nomTipoPeriodo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarPeriodo
            isActive={isActiveBooleans.insertarPeriodo}
            cambiarEstado={setIsActiveBooleans}
          />

          <EditarPeriodo
            isActive={isActiveBooleans.editarPeriodo}
            cambiarEstado={setIsActiveBooleans}
            idRegistro={idRegistro}
            nombreTabla={nombreTabla}
          />

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de período</th>
                <th>Tipo de período</th>
                <th>Descripción</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.periodos.map((periodo) => (
                <tr key={periodo.idPeriodo}>
                  <td>{periodo.idPeriodo}</td>
                  <td>{periodo.nomPeriodo}</td>
                  <td>{periodo.nomTipoPeriodo}</td>
                  <td>{periodo.descripcion}</td>

                  <td>
                    <button
                      data-title="Editar tipo de periodo"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(periodo.idPeriodo, "editar")
                      }
                    >
                      <RiEditBoxFill id="icons" />
                    </button>
                    {/* <Link to={`/listadoEDDProyEmp/${EDDProyecto.idEDDProyecto}`}>
                    <button
                      data-title="Proy. colaborador relacionados"
                      id="OperationBtns"
                    >
                      <AiFillProject id="icons" />
                    </button>
                  </Link> */}
                    <button
                      data-title="Desactivar tipo de periodo"
                      onClick={() =>
                        desactivar(periodo.idPeriodo, "desactivar")
                      }
                      id="OperationBtns"
                    >
                      <BsFillTrashFill id="icons" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
