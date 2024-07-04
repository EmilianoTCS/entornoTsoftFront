import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Header from "../../../templates/Header/Header";
import { useRoute } from "wouter";
import ExportCSV from "../../../templates/exports/exportCSV";
import SendDataService from "../../../services/SendDataService";
import { MdAccessTimeFilled } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import EditarDetalleResumen from "../../forms/editar/EditarDetalleResumen";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";

export default function DetalleProyectos() {
  const [, params] = useRoute("/ihh/detalleProyectos/:idProyecto");
  const [idProyecto, setidProyecto] = useState(params.idProyecto);
  const [listDetalle, setListDetalle] = useState([""]);
  const [loadedData, setLoadedData] = useState(false);
  const [auxSaldoPresupuesto, setAuxSaldoPresupuesto] = useState(0);
  const [datosParaEditar, setDatosParaEditar] = useState("");
  const [isActiveEditarResumen, setIsActiveEditarResumen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const now = new Date();

  var date = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const [nombreArchivoCSV, setNombreArchivoCSV] = useState("");
  const nombreTabla = "list_det_proy";

  var styleH2 = {
    margin: "auto auto auto 25%",
    backgroundColor: "white",
    padding: "5px 10px 5px 10px",
    textAlign: "center",
    width: "500px",
    borderRadius: "10px",
  };
  var styleH3 = {
    float: "right",
    backgroundColor: "white",
    padding: "0 5px 0 5px",
    width: "220px",
    fontSize: "13pt",
    borderRadius: "10px",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  var styleDivTitle = {
    display: "flex",
    flexDirection: "row",
  };
  var mainContainerDiv = {
    width: "1300px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center ",
  };

  /**
   * The function "obtenerDatos" retrieves data from a specified URL, filters elements with a non-null
   * "saldoPresupuesto" property, and sets certain values based on the retrieved data.
   */
  function obtenerDatos() {
    const url = "pages/listados/ihh_listadoDetalleProyecto.php";
    const operationUrl = "ihh_listadoDetalleProyecto";
    var data = {
      idProyecto: idProyecto,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setListDetalle(response);
      console.log(response);
      // Filtrar los elementos con "saldoPresupuesto" no nulo
      const saldoPresupuestoNoNulo = response.filter(
        (elemento) => elemento.saldoPresupuestoUSD !== null
      );

      if (saldoPresupuestoNoNulo.length > 0) {
        var ultimoSaldoPresupuesto =
          saldoPresupuestoNoNulo[saldoPresupuestoNoNulo.length - 1]
            .saldoPresupuestoUSD;
      } else {
        var ultimoSaldoPresupuesto = response[0].presupuestoTotal;
      }
      // Obtener el último saldoPresupuesto no nulo

      setAuxSaldoPresupuesto(ultimoSaldoPresupuesto);

      setNombreArchivoCSV(
        "list_det_proy_" + response[0].nomProyecto.substr(0, 10) + "_" + date
      );
      setLoadedData(true);
    });
  }

  useEffect(
    function () {
      obtenerDatos();
    },
    [loadedData, idProyecto]
  );

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

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <EditarDetalleResumen
          isActive={isActiveEditarResumen}
          cambiarEstado={setIsActiveEditarResumen}
          mes={datosParaEditar.mes}
          presupuestoMensual={datosParaEditar.presupuestoMensual}
          idResumenPerProy={datosParaEditar.idResumenPerProy}
        />
        <Header></Header>
        <br></br>
        <div style={mainContainerDiv}>
          <div style={styleDivTitle}>
            <h2 style={styleH2}>Detalle de costos de proyectos</h2>
            <h3 style={styleH3}>
              Fecha actual: {now.toLocaleDateString("es-CL")}
            </h3>
          </div>

          {/* resumen proyecto */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              margin: "20px auto",
              backgroundColor: "white",
              padding: "0 20px 0 20px",
              borderRadius: "10px",
              width: "750px",
            }}
          >
            <table
              style={{
                backgroundColor: "white",
                padding: "0 20px 0 20px",
                borderRadius: "10px",
                width: "350px",
                fontSize: "15pt",
              }}
            >
              <td>
                <tr>
                  <th style={{ width: "200px" }}>Fecha inicio:</th>
                  <th style={{ textAlign: "right" }}>
                    <b>{listDetalle[0].fechaIniProy}</b>
                  </th>
                </tr>
                <tr>
                  <th>Fecha término: </th>
                  <th style={{ textAlign: "right" }}>
                    <b>{listDetalle[0].fechaFinProy}</b>
                  </th>
                </tr>
              </td>
            </table>
            <table
              style={{
                backgroundColor: "white",
                padding: "0 20px 0 20px",
                borderRadius: "10px",
                width: "350px",
                fontSize: "15pt",
              }}
            >
              <td>
                <tr>
                  <th style={{ width: "200px" }}>Presupuesto total:</th>
                  <th style={{ textAlign: "right" }}>
                    <b>
                      {parseFloat(
                        listDetalle[0].presupuestoTotal
                      ).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                      (USD)
                    </b>
                  </th>
                </tr>
                <tr>
                  <th>Saldo a la fecha:</th>
                  <th style={{ textAlign: "right" }}>
                    <b>
                      <text
                        style={
                          parseFloat(auxSaldoPresupuesto) > 0
                            ? { color: "green" }
                            : { color: "red" }
                        }
                      >
                        {parseFloat(auxSaldoPresupuesto)
                          ? parseFloat(auxSaldoPresupuesto).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            ) + "(USD)"
                          : "No definido"}
                      </text>
                    </b>
                  </th>
                </tr>
              </td>
            </table>
          </div>
          {/* tabla con datos */}
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h3>
                Movimiento mensual - Proyecto: {listDetalle[0].nomProyecto}
              </h3>
              <ExportCSV inputData={listDetalle} nomTabla={nombreArchivoCSV} />
            </div>
            <br></br>

            <Table striped hover responsive>
              <thead>
                <th>Mes</th>
                <th>Pres. mensual proyectado (USD)</th>
                <th>Pres. mensual proyectado (CLP)</th>
                <th>Pres. mensual acumulado (USD)</th>
                <th>Pres. mensual acumulado (CLP)</th>
                <th>Costo mensual (USD)</th>
                <th>Costo mensual (CLP)</th>
                <th>Saldo mes (USD)</th>
                <th>Saldo mes (CLP)</th>
                <th>Saldo presupuesto (USD)</th>
                <th>Saldo presupuesto (CLP)</th>
                <th>Operaciones</th>
              </thead>
              <tbody>
                {listDetalle.map((item) => (
                  <tr>
                    <td style={{ width: "150px" }}>
                      {convertirFecha(item.mes)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {parseFloat(item.presupuestoMensualUSD).toLocaleString(
                        "es-CL",
                        {
                          style: "currency",
                          currency: "CLP",
                        }
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {parseFloat(item.presupuestoMensualPesos).toLocaleString(
                        "es-CL",
                        {
                          style: "currency",
                          currency: "CLP",
                        }
                      )}
                    </td>
                    <td style={{ textAlign: "right", width: "120px" }}>
                      {item.presupuestoAcumuladoUSD
                        ? parseFloat(
                            item.presupuestoAcumuladoUSD
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                        : 0}
                    </td>
                    <td style={{ textAlign: "right", width: "120px" }}>
                      {item.presupuestoAcumuladoPesos
                        ? parseFloat(
                            item.presupuestoAcumuladoPesos
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                        : 0}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {parseFloat(item.costoMensualUSD)
                        ? parseFloat(item.costoMensualUSD).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {parseFloat(item.costoMensualPesos)
                        ? parseFloat(item.costoMensualPesos).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td
                      style={
                        parseFloat(item.saldoMensualUSD) < 0
                          ? { textAlign: "right", color: "red" }
                          : { textAlign: "right", color: "green" }
                      }
                    >
                      {parseFloat(item.saldoMensualUSD)
                        ? parseFloat(item.saldoMensualUSD).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td
                      style={
                        parseFloat(item.saldoMensualPesos) < 0
                          ? { textAlign: "right", color: "red" }
                          : { textAlign: "right", color: "green" }
                      }
                    >
                      {parseFloat(item.saldoMensualPesos)
                        ? parseFloat(item.saldoMensualPesos).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td
                      style={
                        parseFloat(item.saldoPresupuestoUSD) < 0
                          ? { textAlign: "right", color: "red" }
                          : { textAlign: "right", color: "green" }
                      }
                    >
                      {parseFloat(item.saldoPresupuestoUSD)
                        ? parseFloat(item.saldoPresupuestoUSD).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td
                      style={
                        parseFloat(item.saldoPresupuestoPesos) < 0
                          ? { textAlign: "right", color: "red" }
                          : { textAlign: "right", color: "green" }
                      }
                    >
                      {parseFloat(item.saldoPresupuestoPesos)
                        ? parseFloat(item.saldoPresupuestoPesos).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                            }
                          )
                        : "No definido"}
                    </td>
                    <td>
                      <Link
                        to={`/ihh/simuladorCostos/${idProyecto}/${item.mes}/${item.idAcop}`}
                      >
                        <Button
                          data-title="Detalle de movimientos mensuales"
                          id="OperationBtns"
                          style={{ color: "black" }}
                        >
                          <MdAccessTimeFilled id="icons" />
                        </Button>
                      </Link>
                      <button
                        data-title="Editar resumen"
                        id="OperationBtns"
                        onClick={() => {
                          setDatosParaEditar({
                            presupuestoMensual: item.presupuestoMensual,
                            mes: item.mes,
                            idResumenPerProy: item.idResumenPerProy,
                          });
                          setIsActiveEditarResumen(true);
                        }}
                      >
                        <RiEditBoxFill id="icons" />
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
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
