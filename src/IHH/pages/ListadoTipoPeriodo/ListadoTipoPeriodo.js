import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import InsertarTipoPeriodo from "../../forms/insertar/InsertarTipoPeriodo";
import EditarTipoPeriodo from "../../forms/editar/EditarTipoPeriodo";


export default function IHH_ListadoTipoPeriodo() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const nombreTabla = "ihhtipoperiodo";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarTipoPeriodo: false,
    insertarTipoPeriodo: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    tipoPeriodo: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoTipoPeriodo.php";
    var operationUrl = "ihh_listadoTipoPeriodo";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ tipoPeriodo: datos.datos });
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
        editarTipoPeriodo: true,
      }));
    }
  };

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is being used to fetch data and update the component's state. */
  useEffect(
    function () {
      obtenerDatos();
    },
    [num_boton, cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de tipos de períodos</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarTipoPeriodo: true,
                }));
              }}
            >
              Crear nuevo tipo de período
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

          <InsertarTipoPeriodo 
          isActive={isActiveBooleans.insertarTipoPeriodo}
          cambiarEstado={setIsActiveBooleans}
          />
          <EditarTipoPeriodo
          isActive={isActiveBooleans.editarTipoPeriodo}
          cambiarEstado={setIsActiveBooleans}
          idRegistro={idRegistro}
          nombreTabla={nombreTabla}
          />


          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Días</th>
                <th>Descripción</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.tipoPeriodo.map((periodo) => (
                <tr key={periodo.idTipoPeriodo}>
                  <td>{periodo.idTipoPeriodo}</td>
                  <td>{periodo.nomTipoPeriodo}</td>
                  <td>{periodo.dias}</td>
                  <td>{periodo.descripcion}</td>

                  <td>
                    <button
                      data-title="Editar tipo de período"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(periodo.idTipoPeriodo, "editar")
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
                      data-title="Desactivar tipo de período"
                      onClick={() =>
                        desactivar(periodo.idTipoPeriodo, "desactivar")
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
