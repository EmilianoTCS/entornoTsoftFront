import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import "./MesesAcop.css";
import SendDataService from "../../../services/SendDataService";
import Header from "../../../templates/Header/Header";
import "../../../Edd/pages/Listados/TablasStyles.css";
import EditarMesAcopIndividual from "../../forms/editar/EditarMesAcopIndividual";
import { RiEditBoxFill } from "react-icons/ri";
import ConfirmAlert from "../../../templates/alerts/ConfirmAlert";
import EditarMesAcop from "../../forms/editar/EditarMesAcop";
import { BsFillTrashFill } from "react-icons/bs";
import TopAlertsError from "../../../templates/alerts/TopAlerts";

export default function IHH_ListadoMesesAcop() {
  const { idAcop } = useParams();

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [AuxIdAcop, setIdAcop] = useState(idAcop);

  const [mainList, setMainList] = useState({
    mesesAcops: [""],
  });

  const [auxList, setAuxList] = useState({
    listadoAcops: [""],
  });

  const [datosMesesAcop, setDatosMesesAcop] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);
  const [Registro, setRegistro] = useState("");
  const [isActiveBooleans, setIsActiveBooleans] = useState({
    editarAcopMes: false,
    insertarAcopMes: false,
  });

  const obtenerDatos = () => {
    var url = "pages/listados/ihh_listadoMesesAcop.php";
    var operationUrl = "ihh_listadoMesesAcop";
    var data = {
      idAcop: AuxIdAcop,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setMainList({ mesesAcops: response });
    });
  };
  const obtenerAcops = () => {
    var url = "pages/listados/ihh_listadoAcop.php";
    var operationUrl = "ihh_listadoAcop";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999999999,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { paginador, ...datos } = response;
      setAuxList({ listadoAcops: datos.datos });
    });
  };

  function convertirFecha(fechaString) {
    if (fechaString) {
      // Extraer el año y el mes del string
      const anio = fechaString.slice(0, 4);
      const mesNumero = fechaString.slice(4);

      // Convertir el mes a nombre
      const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const mesNombre = meses[parseInt(mesNumero) - 1];

      // Formatear la fecha en el formato deseado
      const fechaFormateada = mesNombre + " " + anio;

      return fechaFormateada;
    }
  }

  const activarFormulario = (Registro, nomOperacion) => {
    setRegistro(Registro);
    if (nomOperacion === "editar") {
      setIsActiveBooleans((prevDatos) => ({
        ...prevDatos,
        editarAcopMes: true,
      }));
    }
  };

  function desactivar(ID) {
    let text = "Esta acción no se puede deshacer";
    ConfirmAlert(text).then((response) => {
      if (response === true) {
        var url = "pages/desactivar/ihh_desactivarMesAcopIndividual.php";
        var operationUrl = "ihh_desactivarMesAcopIndividual";
        var data = {
          idAcopMes: ID,
          usuarioModificacion: userData.usuario,
        };
        SendDataService(url, operationUrl, data).then((response) => {
          const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
          TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);

          if (datos.idacopmes && !isActiveFormularioPresupuesto) {
            setisActiveFormularioPresupuesto(true);
            setDatosMesesAcop(response);
          }
        });
      }
    });
  }

  useEffect(
    function () {
      obtenerDatos();
      obtenerAcops();
    },
    [AuxIdAcop]
  );

  return userData.statusConected || userData !== null ? (
    <>
      <EditarMesAcopIndividual
        isActive={isActiveBooleans.editarAcopMes}
        cambiarEstado={setIsActiveBooleans}
        Registro={Registro}
      />

      {isActiveFormularioPresupuesto ? (
        <EditarMesAcop
          cambiarEstado={setisActiveFormularioPresupuesto}
          mesesAcop={datosMesesAcop}
          isActiveFormulario={isActiveFormularioPresupuesto}
        />
      ) : null}

      <Header></Header>
      <br></br>
      <br></br>
      <div id="fondoTabla">
        <div id="containerTablas">
          <h1 id="TitlesPages">Listado de meses de ACOP</h1>
          <br></br>

          <div className="cl_slct_acop">
            <div className="form-group" id="btn2">
              <label htmlFor="input_CantidadRegistros">
                <b>Seleccione un ACOP:</b>
              </label>
              <select
                value={AuxIdAcop || ""}
                className="form-control"
                name="input_listadoAcops"
                id="input_listadoAcops"
                onChange={({ target }) => {
                  setIdAcop(target.value);
                }}
                required
              >
                <option value="" disabled>
                  Selecciona un ACOP
                </option>
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

          {/* resumen acop */}
          <div className="div_list_mes_acop_info_acop">
            <b>
              Presupuesto total:&nbsp;
              {parseFloat(
                mainList.mesesAcops[0].presupuestoTotalUSD
              ).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              &nbsp;(USD)
            </b>
            <b>
              Presupuesto total:&nbsp;
              {parseFloat(
                mainList.mesesAcops[0].presupuestoTotalPesos
              ).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{" "}
              &nbsp;(CLP)
            </b>
          </div>

          <div className="div_list_mes_acop_info_acop">
            <b>Fecha Inicio: {mainList.mesesAcops[0].fechaIni}</b>
            <b>Fecha Fin: {mainList.mesesAcops[0].fechaFin}</b>
            <b>
              Valor USD ACOP:&nbsp;
              {parseFloat(mainList.mesesAcops[0].valorUSD).toLocaleString(
                "es-CL",
                {
                  style: "currency",
                  currency: "CLP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }
              )}
              &nbsp; (CLP)
            </b>
          </div>

          <Table id="mainTable" hover responsive>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Pres. Mensual (USD)</th>
                <th>Pres. Mensual (CLP)</th>
                <th>Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {mainList.mesesAcops.map((item) => (
                <tr key={item.idAcopMes}>
                  <td>{convertirFecha(item.mes)}</td>
                  <td className="td_num_right_text">
                    {parseFloat(item.presupuestoMensualUSD).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>
                  <td className="td_num_right_text">
                    {parseFloat(item.presupuestoMensualPesos).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }
                    )}
                  </td>

                  <td>
                    <button
                      data-title="Editar acop"
                      id="OperationBtns"
                      onClick={() => activarFormulario(item, "editar")}
                    >
                      <RiEditBoxFill id="icons" />
                    </button>

                    <button
                      data-title="Desactivar acop"
                      onClick={() => desactivar(item.idAcopMes)}
                      id="OperationBtns"
                    >
                      <BsFillTrashFill id="icons" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
