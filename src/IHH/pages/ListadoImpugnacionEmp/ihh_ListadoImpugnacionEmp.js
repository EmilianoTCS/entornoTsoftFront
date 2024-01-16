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

import InsertarImpugnacionEmp from "../../forms/insertar/insertarImpugnacionEmp";
import EditarImpugnacionEmp from "../../forms/editar/EditarImpugnacionEmp";

export default function IHH_ListadoImpugnacionEmp() {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const [filters, setFilters] = useState({
    idEmpleado: "",
    idElemento: "",
    idPeriodo: "",
    idAcop: "",
  });
  const nombreTabla = "ihhimpugnacionemp";

  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarImpugnacionEmp: false,
    insertarImpugnacionEmp: false,
  });

  const [idRegistro, setIdRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    impugnacionEmp: [""],
  });
  const [auxList, setAuxList] = useState({
    empleados: [""],
    elementos: [""],
    periodos: [""],
    acops: [""],
  });

  const [num_boton, setNumBoton] = useState(1);

  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        empleados: data,
      }));
    });
  };
  const obtenerElementos = () => {
    var url = "pages/auxiliares/ihh_listadoElementoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        elementos: data,
      }));
    });
  };
  const obtenerPeriodo = () => {
    var url = "pages/auxiliares/ihh_listadoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        periodos: data,
      }));
    });
  };
  const obtenerAcops = () => {
    var url = "pages/auxiliares/ihh_listadoAcopForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        acops: data,
      }));
    });
  };

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoImpugnacionEmp.php";
    var operationUrl = "ihh_listadoImpugnacionEmp";
    var data = {
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
      idEmpleado: filters.idEmpleado,
      idElemento: filters.idElemento,
      idPeriodo: filters.idPeriodo,
      idAcop: filters.idAcop,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      console.log(data);
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ impugnacionEmp: datos.datos });
    });
  };

  const activarFormulario = (idRegistro, nomOperacion) => {
    setIdRegistro(idRegistro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarImpugnacionEmp: true,
      }));
    }
  };
  useEffect(
    function () {
      obtenerDatos();
      obtenerEmpleados();
      obtenerElementos();
      obtenerPeriodo();
      obtenerAcops();
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
          <h1 id="TitlesPages">Listado de impugnación de empleados</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              onClick={() => {
                setIsActiveBooleans((prevInfo) => ({
                  ...prevInfo,
                  insertarImpugnacionEmp: true,
                }));
              }}
            >
              Crear impugnación de empleado
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
              <label htmlFor="input_Empleados">Empleado: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idEmpleado: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.empleados.map((valor) => (
                  <option value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Elementos">Elementos: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idElemento: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.elementos.map((valor) => (
                  <option value={valor.idElementoImp}>
                    {valor.nomElemento}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Periodo">Período: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idPeriodo: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.periodos.map((valor) => (
                  <option value={valor.idPeriodo}>{valor.nomPeriodo}</option>
                ))}
              </select>
            </div>
            <div className="form-group" id="btn2">
              <label htmlFor="input_Acop">Proyecto: </label>
              <select
                className="form-control"
                onChange={({ target }) => {
                  setFilters((prevDatos) => ({
                    ...prevDatos,
                    idAcop: target.value,
                  }));
                  setNumBoton(1);
                }}
              >
                <option value="">Todos</option>
                {auxList.acops.map((valor) => (
                  <option value={valor.idAcop}>{valor.nomProyecto}</option>
                ))}
              </select>
            </div>
          </div>

          <InsertarImpugnacionEmp
            isActive={isActiveBooleans.insertarImpugnacionEmp}
            cambiarEstado={setIsActiveBooleans}
          />

          <EditarImpugnacionEmp
            isActive={isActiveBooleans.editarImpugnacionEmp}
            cambiarEstado={setIsActiveBooleans}
            idRegistro={idRegistro}
            nombreTabla={nombreTabla}
          />

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre empleado</th>
                <th>Nombre elemento</th>
                <th>Cant. horas período</th>
                <th>Cant. horas extras</th>
                {/* <th>Factor</th> */}
                <th>Proyecto</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.impugnacionEmp.map((impEmp) => (
                <tr key={impEmp.idImpugnacionEmp}>
                  <td>{impEmp.idImpugnacionEmp}</td>
                  <td>{impEmp.nomEmpleado}</td>
                  <td>{impEmp.nomElemento}</td>
                  <td>{impEmp.cantHorasPeriodo}</td>
                  <td>{impEmp.cantHorasExtra}</td>
                  {/* <td>{impEmp.factor}</td> */}
                  <td>{impEmp.nomProyecto}</td>

                  <td>
                    <button
                      data-title="Editar impugnación"
                      id="OperationBtns"
                      onClick={() =>
                        activarFormulario(impEmp.idImpugnacionEmp, "editar")
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
                      data-title="Desactivar impugnación"
                      onClick={() =>
                        desactivar(impEmp.idImpugnacionEmp, "desactivar")
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
