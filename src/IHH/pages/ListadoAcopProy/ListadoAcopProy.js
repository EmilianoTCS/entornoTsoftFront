import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";

import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import Paginador from "../../../templates/Paginador/Paginador";
import "../../../Edd/pages/Listados/TablasStyles.css";
import { RiEditBoxFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import InsertarAcopProy from "../../forms/insertar/InsertarAcopProy";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import EditarAcopProy from "../../forms/editar/EditarAcopProy";
import "./listadoAcopProy.css";
export default function IHH_ListadoAcopProy() {
  const { idProyecto, idAcop } = useParams();
  const [auxIdProyecto, setAuxIdProyecto] = useState(idProyecto);
  const [auxIdAcop, setAuxIdAcop] = useState(idAcop);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [cantidadPorPagina, setcantidadPorPagina] = useState(10);
  const [cantidadPaginas, setCantidadPaginas] = useState([]);
  const nombreTabla = "ihhacop";

  const style = {
    margin: "0 auto",
  };
  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarAcopProy: false,
    insertarAcopProy: false,
  });

  const [Registro, setRegistro] = useState(0);

  const [mainList, setMainList] = useState({
    acopproy: [""],
  });
  const [auxList, setAuxList] = useState({
    listadoAcops: [""],
    listadoProyectos: [""],
  });
  const [num_boton, setNumBoton] = useState(1);

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoAcopProy.php";
    var operationUrl = "ihh_listadoAcopProy";
    var data = {
      idProyecto: auxIdProyecto,
      idAcop: auxIdAcop,
      num_boton: num_boton,
      cantidadPorPagina: cantidadPorPagina,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setCantidadPaginas(paginador.cantPaginas);
      setMainList({ acopproy: datos.datos });
    });
  };

  // obtiene el listado de acops
  const obtenerAcops = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999999999,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoAcops: datos.datos,
      }));
    });
  };

  //Devuelve un listado de proyectos
  const obtenerProyectos = () => {
    var url = "pages/listados/listadoEddProyecto.php";
    var operationUrl = "listadoEddProyecto";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 99999999999999,
      idServicio: 0,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoProyectos: datos.datos,
      }));
    });
  };

  const activarFormulario = (Registro, nomOperacion) => {
    setRegistro(Registro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarAcopProy: true,
      }));
    }
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarAcopProy.php";
        var operationUrl = "ihh_desactivarAcopProy";
        var data = {
          idAcopProy: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        });
      }
    });
  }

  useEffect(
    function () {
      obtenerDatos();
      obtenerAcops();
      obtenerProyectos();
    },
    [num_boton, cantidadPorPagina, auxIdAcop, auxIdProyecto]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de asociaciones PROYECTOS - ACOPS</h1>
          <br></br>

          <div id="selectPaginador">
            <Button
              id="btn"
              style={{ whiteSpace: "nowrap", width: "230px" }}
              onClick={() => {
                setIsActiveBooleans((prevDatos) => ({
                  ...prevDatos,
                  insertarAcopProy: true,
                }));
              }}
            >
              Asociar PROYECTO - ACOP
            </Button>

            <InsertarAcopProy
              isActive={isActiveBooleans.insertarAcopProy}
              cambiarEstado={setIsActiveBooleans}
            />
            <EditarAcopProy
              Registro={Registro}
              isActive={isActiveBooleans.editarAcopProy}
              cambiarEstado={setIsActiveBooleans}
            />

            <div
              className="form-group"
              id="btn2"
              style={{ whiteSpace: "nowrap", width: "230px" }}
            >
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

            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="lbl_select_acop">Seleccione un ACOP:</label>
                <select
                  value={auxIdAcop || ""}
                  className="form-control"
                  name="input_listadoAcops"
                  id="input_listadoAcops"
                  onChange={({ target }) => {
                    setAuxIdAcop(target.value);
                  }}
                  required
                >
                  {/* <option value="" disabled hidden>
                    Selecciona un ACOP
                  </option> */}
                  <option value="0">Todos</option>
                  {auxList.listadoAcops.map((item) => (
                    <option
                      key={item.idAcop}
                      selected={idAcop === item.idAcop ? true : false}
                      value={item.idAcop}
                    >
                      {item.nomAcop}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cl_slct_acop">
              <div className="form-group" id="btn2">
                <label htmlFor="input_CantidadRegistros">
                  Seleccione un proyecto:
                </label>
                <select
                  value={auxIdProyecto || ""}
                  className="form-control"
                  name="input_listadoAcops"
                  id="input_listadoAcops"
                  onChange={({ target }) => {
                    setAuxIdProyecto(target.value);
                  }}
                  required
                >
                  <option value="0">Todos</option>
                  {auxList.listadoProyectos.map((item) => (
                    <option
                      key={item.idEDDProyecto}
                      selected={
                        auxIdProyecto === item.idEDDProyecto ? true : false
                      }
                      value={item.idEDDProyecto}
                    >
                      {item.nomProyecto}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Nombre Proyecto</th>
                <th>Nombre ACOP</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.acopproy.map((item) => (
                <tr key={item.idacopproy}>
                  <td>{item.nomProyecto}</td>
                  <td>{item.nomAcop}</td>

                  <td>
                    <button
                      data-title="Editar asociación"
                      id="OperationBtns"
                      onClick={() => activarFormulario(item, "editar")}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>

                    <button
                      data-title="Desactivar asociación"
                      onClick={() => desactivar(item.idacopproy, "desactivar")}
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
