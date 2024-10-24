import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button, Tabs, Tab } from "react-bootstrap"; // Importar Tabs y Tab
import Table from "react-bootstrap/Table";
import Header from "../../../templates/Header/Header";
import { useRoute } from "wouter";
import ExportCSV from "../../../templates/exports/exportCSV";
import SendDataService from "../../../services/SendDataService";
import { MdAccessTimeFilled } from "react-icons/md";
import EditarDetalleResumen from "../../forms/editar/EditarDetalleResumen";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import "./ihh_detalleProyectos.css";
export default function DetalleProyectos() {
  const [, params] = useRoute("/ihh/detalleProyectos/:idProyecto");
  const [idProyecto, setidProyecto] = useState(params.idProyecto);
  const [listDetalle, setListDetalle] = useState([""]);
  const [loadedData, setLoadedData] = useState(false);
  const [auxSaldoPresupuesto, setAuxSaldoPresupuesto] = useState(0);
  const [auxSaldoPresupuestoMisc, setAuxSaldoPresupuestoMisc] = useState(0);
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
    margin: "auto",
    backgroundColor: "white",
    padding: "5px 10px 5px 10px",
    textAlign: "center",
    maxWidth: "800px",
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
        (elemento) => elemento.saldoPresupuesto !== null
      );

      if (saldoPresupuestoNoNulo.length > 0) {
        var ultimoSaldoPresupuesto =
          saldoPresupuestoNoNulo[saldoPresupuestoNoNulo.length - 1]
            .saldoPresupuesto;
      } else {
        var ultimoSaldoPresupuesto = response[0].presupuestoTotal;
      }

      if (saldoPresupuestoNoNulo.length > 0) {
        var ultimoSaldoPresupuestoMiscelaneo =
          saldoPresupuestoNoNulo[saldoPresupuestoNoNulo.length - 1]
            .saldoPresupuestoMiscelaneo;
      } else {
        var ultimoSaldoPresupuestoMiscelaneo =
          response[0].presupuestoTotalMiscelaneo;
      }
      // Obtener el último saldoPresupuesto no nulo

      setAuxSaldoPresupuesto(ultimoSaldoPresupuesto);
      setAuxSaldoPresupuestoMisc(ultimoSaldoPresupuestoMiscelaneo);

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
        <a
          id="btnAtras"
          style={{ display: "flex", float: "left", marginLeft: "100px" }}
          href="/listadoEddProyecto/0"
        >
          Volver
        </a>
        <h3 style={styleH3}>Fecha actual: {now.toLocaleDateString("es-CL")}</h3>
        <div style={mainContainerDiv}>
          <div style={styleDivTitle}>
            <h2 style={styleH2}>
              Detalle de costos de proyecto <br></br>
              {listDetalle[0].nomProyecto}
            </h2>
          </div>

          {/* resumen proyecto */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              margin: "20px auto",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "850px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }}>Fecha Inicio:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>{listDetalle[0].fechaIniProy}</b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }}>Fecha Término:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>{listDetalle[0].fechaFinProy}</b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }}>Presup Proyecto:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>
                          {parseFloat(
                            listDetalle[0].presupuestoTotal
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "200px" }}>Presup Misc:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>
                          {parseFloat(
                            listDetalle[0].presupuestoTotalMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "250px" }}>Saldo a la fecha Proy:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>
                          <span
                            style={{
                              color:
                                parseFloat(auxSaldoPresupuesto) > 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {parseFloat(auxSaldoPresupuesto)
                              ? parseFloat(auxSaldoPresupuesto).toLocaleString(
                                  "es-CL",
                                  {
                                    style: "currency",
                                    currency: "CLP",
                                  }
                                )
                              : "No definido"}
                          </span>
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "250px" }}>Saldo a la fecha Misc:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>
                          <span
                            style={{
                              color:
                                parseFloat(auxSaldoPresupuestoMisc) > 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {parseFloat(auxSaldoPresupuestoMisc)
                              ? parseFloat(
                                  auxSaldoPresupuestoMisc
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                              : "No definido"}
                          </span>
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "250px" }}> Rentab esperada:</th>
                      <th style={{ textAlign: "right" }}>
                        <b>
                          <span>
                            {parseFloat(listDetalle[0].porc_rentabilidad_reco)
                              ? parseFloat(
                                  listDetalle[0].porc_rentabilidad_reco
                                )
                              : "No definido"}
                            %
                          </span>
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ width: "45%" }}>
                <table
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                    fontSize: "15pt",
                  }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: "250px" }}> Rentab real:</th>
                      <th style={{ textAlign: "right" }}>
                        <b
                          style={
                            parseFloat(listDetalle[0].porc_rentabilidad_real) >=
                            parseFloat(listDetalle[0].porc_rentabilidad_reco)
                              ? { textAlign: "right", color: "green" }
                              : { textAlign: "right", color: "red" }
                          }
                        >
                          <span>
                            {parseFloat(listDetalle[0].porc_rentabilidad_real)
                              ? parseFloat(
                                  listDetalle[0].porc_rentabilidad_real
                                )
                              : "No definido"}
                            %
                          </span>
                        </b>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* tabla con datos */}

          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "30px",
            }}
          >
            <Tabs
              defaultActiveKey="resumen"
              id="detalle-proyecto-tabs"
              style={{
                fontSize: "14pt",
              }}
            >
              <Tab eventKey="resumen" title="Resumen proyecto">
                <br></br>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>Movimiento mensual en CLP</h3>
                  <ExportCSV
                    inputData={listDetalle}
                    nomTabla={nombreArchivoCSV}
                  />
                </div>
                <br></br>
                <Table striped hover responsive>
                  <thead>
                    <th>Mes</th>
                    <th style={{ textAlign: "right" }}>
                      Pres. mensual proyectado
                    </th>
                    <th style={{ textAlign: "right" }}>
                      Pres. mensual acumulado
                    </th>
                    <th style={{ textAlign: "right" }}>Costo mensual</th>
                    <th style={{ textAlign: "right" }}>Saldo mes</th>
                    <th style={{ textAlign: "right" }}>Saldo presupuesto</th>
                    <th style={{ textAlign: "center" }}>Operaciones</th>
                  </thead>
                  <tbody>
                    {listDetalle.map((item) => (
                      <tr>
                        <td style={{ width: "200px" }}>
                          {convertirFecha(item.mes)}
                        </td>
                        <td style={{ textAlign: "right", width: "150px" }}>
                          {parseFloat(item.presupuestoMensual).toLocaleString(
                            "es-CL",
                            {
                              style: "currency",
                              currency: "CLP",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>

                        <td style={{ textAlign: "right", width: "150px" }}>
                          {item.presupuestoAcumulado
                            ? parseFloat(
                                item.presupuestoAcumulado
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : 0}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          {parseFloat(item.costoMensual)
                            ? parseFloat(item.costoMensual).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                            : "No definido"}
                        </td>

                        <td
                          style={
                            parseFloat(item.saldoMensual) < 0
                              ? { textAlign: "right", color: "red" }
                              : { textAlign: "right", color: "green" }
                          }
                        >
                          {parseFloat(item.saldoMensual)
                            ? parseFloat(item.saldoMensual).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                            : "No definido"}
                        </td>

                        <td
                          style={
                            parseFloat(item.saldoPresupuesto) < 0
                              ? { textAlign: "right", color: "red" }
                              : { textAlign: "right", color: "green" }
                          }
                        >
                          {parseFloat(item.saldoPresupuesto)
                            ? parseFloat(item.saldoPresupuesto).toLocaleString(
                                "es-CL",
                                {
                                  style: "currency",
                                  currency: "CLP",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )
                            : "No definido"}
                        </td>

                        <td
                          style={{
                            width: "200px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                          }}
                        >
                          {/* <button
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
                      </button> */}
                          <Link
                            to={`/ihh/simuladorCostos/${idProyecto}/${item.mes}`}
                          >
                            <Button
                              data-title="Detalle de movimientos mensuales"
                              id="OperationBtns"
                              style={{ color: "black" }}
                            >
                              <MdAccessTimeFilled id="icons" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
              <Tab eventKey="miscelaneo" title="Resumen  misceláneos">
                <br></br>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>Movimiento mensual de misceláneos en CLP</h3>
                  <ExportCSV
                    inputData={listDetalle}
                    nomTabla={nombreArchivoCSV}
                  />
                </div>
                <br></br>
                <Table striped hover responsive>
                  <thead>
                    <th>Mes</th>
                    <th style={{ textAlign: "right" }}>
                      Pres. misceláneo proyectado
                    </th>
                    <th style={{ textAlign: "right" }}>
                      Pres. misceláneo acumulado
                    </th>
                    <th style={{ textAlign: "right" }}>
                      Costo mensual misceláneo
                    </th>
                    <th style={{ textAlign: "right" }}>Saldo mes misceláneo</th>
                    <th style={{ textAlign: "right" }}>
                      Saldo presupuesto misceláneo
                    </th>
                    <th style={{ textAlign: "center" }}>Operaciones</th>
                  </thead>
                  <tbody>
                    {listDetalle.map((item) => (
                      <tr>
                        <td style={{ width: "200px" }}>
                          {convertirFecha(item.mes)}
                        </td>
                        <td style={{ textAlign: "right", width: "150px" }}>
                          {parseFloat(item.presupuestoMensualMiscelaneo)
                            ? parseFloat(
                                item.presupuestoMensualMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "No definido"}
                        </td>

                        <td style={{ textAlign: "right", width: "150px" }}>
                          {item.presupuestoAcumuladoMiscelaneo
                            ? parseFloat(
                                item.presupuestoAcumuladoMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "No definido"}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          {parseFloat(item.costoMensualMiscelaneo)
                            ? parseFloat(
                                item.costoMensualMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "No definido"}
                        </td>

                        <td
                          style={
                            parseFloat(item.saldoMensualMiscelaneo) < 0
                              ? { textAlign: "right", color: "red" }
                              : { textAlign: "right", color: "green" }
                          }
                        >
                          {parseFloat(item.saldoMensualMiscelaneo)
                            ? parseFloat(
                                item.saldoMensualMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "No definido"}
                        </td>

                        <td
                          style={
                            parseFloat(item.saldoPresupuestoMiscelaneo) < 0
                              ? { textAlign: "right", color: "red" }
                              : { textAlign: "right", color: "green" }
                          }
                        >
                          {parseFloat(item.saldoPresupuestoMiscelaneo)
                            ? parseFloat(
                                item.saldoPresupuestoMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "No definido"}
                        </td>

                        <td
                          style={{
                            width: "200px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                          }}
                        >
                          {/* <button
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
                      </button> */}
                          <Link
                            to={`/ihh/simuladorCostos/${idProyecto}/${item.mes}`}
                          >
                            <Button
                              data-title="Detalle de movimientos mensuales"
                              id="OperationBtns"
                              style={{ color: "black" }}
                            >
                              <MdAccessTimeFilled id="icons" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
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
