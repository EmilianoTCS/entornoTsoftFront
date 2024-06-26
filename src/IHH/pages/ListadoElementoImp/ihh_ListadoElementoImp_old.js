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

import InsertarElementoImp from "../../forms/insertar/insertarElementoImp";
import EditarElementoImp from "../../forms/editar/EditarElementoImp";

export default function IHH_ListadoElementoImp() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [idTipoElemento, setidTipoElemento] = useState("");
  const nombreTabla = "ihhelementoimp";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarElementoImp: false,
    insertarElementoImp: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    elementos: [""],
  });
  const [auxList, setAuxList] = useState({
    tipoElementos: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerTipoElementos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      console.log(data);
      setAuxList({ tipoElementos: data });
    });
  };
  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoElementoImp.php";
    var operationUrl = "ihh_listadoElementoImp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idTipoElemento: idTipoElemento,
    };

    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ elementos: datos.datos });
    });
  };

  const activarFormulario = (idRegistro, nomOperacion) => {
    setIdRegistro(idRegistro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarElementoImp: true,
      }));
    }
  };
  useEffect(
    function () {
      obtenerDatos();
      obtenerTipoElementos();
    },
    [idTipoElemento, num_boton,cantidadPorPagina]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de Elementos de impugnación</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarElementoImp: true,
                }));
              }}
            >
              Crear elemento impugnación
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

          <InsertarElementoImp
            isActive={isActiveBooleans.insertarElementoImp}
            cambiarEstado={setIsActiveBooleans}
          />

          <EditarElementoImp
            isActive={isActiveBooleans.editarElementoImp}
            cambiarEstado={setIsActiveBooleans}
            idRegistro={idRegistro}
            nombreTabla={nombreTabla}
          />

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de elemento</th>
                <th>Nombre del elemento</th>
                <th>Descripción</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.elementos.map((elemento) => (
                <tr key={elemento.idElementoImp}>
                  <td>{elemento.idElementoImp}</td>
                  <td>{elemento.nomTipoElemento}</td>
                  <td>{elemento.nomElemento}</td>
                  <td>{elemento.descripcion}</td>

                  <td>
                    <button
                      data-title="Editar elemento"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(elemento.idElementoImp, "editar")
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
                      data-title="Desactivar acop"
                      onClick={() =>
                        desactivar(elemento.idElementoImp, "desactivar")
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
