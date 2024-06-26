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
import InsertarNotaImpugnacion from "../../forms/insertar/insertarNotaImpugnacion";
import EditarNotaImpugnacion from "../../forms/editar/EditarNotaImpugnacion";

export default function IHH_ListadoNotaImpugnacion() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [filters, setFilters] = useState({
    idImpugnacionEmp: "",
  });
  const nombreTabla = "ihhnotaimpugnacion";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarNotaImpugnacion: false,
    insertarNotaImpugnacion: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

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
    });
  };

  const activarFormulario = (idRegistro, nomOperacion) => {
    setIdRegistro(idRegistro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarNotaImpugnacion: true,
      }));
    }
  };

  useEffect(
    function () {
      obtenerDatos();
      obtenerImpugnacionEmp();
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
          <h1 id="TitlesPages">Listado de notas de impugnación</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarNotaImpugnacion: true,
                }));
              }}
            >
              Crear nota de impugnación
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
                  <option value={valor.idImpugnacionEmp}>
                    {valor.nomImpugnacionEmp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InsertarNotaImpugnacion
            isActive={isActiveBooleans.insertarNotaImpugnacion}
            cambiarEstado={setIsActiveBooleans}
          />

          <EditarNotaImpugnacion
            isActive={isActiveBooleans.editarNotaImpugnacion}
            cambiarEstado={setIsActiveBooleans}
            idRegistro={idRegistro}
            nombreTabla={nombreTabla}
          />
          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nota</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.notaImpugnacion.map((notaImp) => (
                <tr key={notaImp.idNotaImpugnacion}>
                  <td>{notaImp.idNotaImpugnacion}</td>
                  <td>{notaImp.nota}</td>
                  <td>
                    <button
                      data-title="Editar nota"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(notaImp.idNotaImpugnacion, "editar")
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
                      data-title="Desactivar nota"
                      onClick={() =>
                        desactivar(notaImp.idNotaImpugnacion, "desactivar")
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
