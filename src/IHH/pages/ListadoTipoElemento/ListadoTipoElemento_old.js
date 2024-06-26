import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import InsertarTipoElemento from "../../forms/insertar/InsertarTipoElemento";
import EditarTipoElemento from "../../forms/editar/EditarTipoElemento";

export default function IHH_ListadoTipoElemento() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);

  const nombreTabla = "ihhtipoelemento";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarTipoElemento: false,
    insertarTipoElemento: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    tipoElemento: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoTipoElemento.php";
    var operationUrl = "ihh_listadoTipoElemento";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };

    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ tipoElemento: datos.datos });
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
        editarTipoElemento: true,
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
          <h1 id="TitlesPages">Listado de tipos de elementos</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarTipoElemento: true,
                }));
              }}
            >
              Crear nuevo tipo de elemento
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

          <InsertarTipoElemento
            isActive={isActiveBooleans.insertarTipoElemento}
            cambiarEstado={setIsActiveBooleans}
          />

          <EditarTipoElemento
            isActive={isActiveBooleans.editarTipoElemento}
            cambiarEstado={setIsActiveBooleans}
            idRegistro={idRegistro}
            nombreTabla={nombreTabla}
          />

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.tipoElemento.map((elemento) => (
                <tr key={elemento.idTipoElemento}>
                  <td>{elemento.idTipoElemento}</td>
                  <td>{elemento.nomTipoElemento}</td>
                  <td>{elemento.descripcion}</td>

                  <td>
                    <button
                      data-title="Editar tipo de elemento"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(elemento.idTipoElemento, "editar")
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
                      data-title="Desactivar tipo de elemento"
                      onClick={() =>
                        desactivar(elemento.idTipoElemento, "desactivar")
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
