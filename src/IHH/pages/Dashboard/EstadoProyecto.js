import React, { useState, useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./ResumenDashboardIHH.css";
import SendDataService from "../../../services/SendDataService";
import EstadoDeMes from "./EstadoDeMes";

export default function EstadoProyecto({
  datosProyecto,
  paramsFechaIni,
  paramsFechaFin,
  tipoImpugnacion,
  estadoProyecto,
  colores,
}) {
  const [listadoDetalle, setListadoDetalle] = useState([]);
  const [listadoDetalleAcop, setListadoDetalleAcop] = useState([]);

  const [datosMes, setDatosMes] = useState([]);
  const [isActiveDetalleMes, setIsActiveDetalleMes] = useState(false);

  const componenteRef = useRef(null); // Ref para el componente

  useEffect(() => {
    if (isActiveDetalleMes) {
      componenteRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActiveDetalleMes]);

  function obtenerDatosMeses() {
    const url = "pages/listados/ihh_listadoDetalleProyecto.php";
    const operationUrl = "ihh_listadoDetalleProyecto";
    var data = {
      idProyecto: datosProyecto.idEDDProyecto,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const meses = obtenerMesesEntreFechas(paramsFechaIni, paramsFechaFin);
      const filtrados = response.filter((datos) => meses.includes(datos.mes));
      setListadoDetalle(filtrados);
    });
  }
  function obtenerDatosAcops() {
    const url = "pages/listados/ihh_listado_detalleAcopDash.php";
    const operationUrl = "ihh_listado_detalleAcopDash";
    var data = {
      idProyecto: datosProyecto.idEDDProyecto,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setListadoDetalleAcop(response);
    });
  }
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

  //obtengo un array con los meses en formato yyyymm
  function obtenerMesesEntreFechas(fechaInicio, fechaFin) {
    // Convertir las fechas de dd-mm-yyyy a objetos Date correctamente
    let [diaIni, mesIni, anioIni] = fechaInicio.split("-").map(Number);
    let [diaFin, mesFin, anioFin] = fechaFin.split("-").map(Number);

    let fechaIni = new Date(anioIni, mesIni - 1, diaIni); // Crear la fecha de inicio
    let fechaFinProy = new Date(anioFin, mesFin - 1, diaFin); // Crear la fecha de fin
    let meses = [];

    // Iterar solo si la fecha de inicio es menor o igual a la de fin
    while (fechaIni <= fechaFinProy) {
      let year = fechaIni.getFullYear();
      let month = (fechaIni.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes con dos dígitos
      meses.push(`${year}${month}`);
      fechaIni.setMonth(fechaIni.getMonth() + 1); // Avanzar al siguiente mes

      // Verificar que la fecha sigue siendo válida (controlando el desbordamiento de meses)
      if (fechaIni.getDate() !== diaIni) {
        fechaIni.setDate(0); // Corregir el mes si se desborda (ej. 31 de algún mes)
      }
    }

    return meses;
  }

  function TablaAcops() {
    return (
      <>
        <Table hover responsive>
          <thead>
            <th>Nombre</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>Ppto gral</th>
            <th>Ppto total</th>
            <th>Ppto Operat</th>
            <th>Ppto Misc</th>
            <th>% Rentab</th>
          </thead>
          <tbody>
            {listadoDetalleAcop &&
              listadoDetalleAcop.map((item) => (
                <tr>
                  <td style={{ textAlign: "left", width: "250px" }}>
                    {item.nomAcop}
                  </td>
                  <td style={{ width: "100px" }}>{item.fechaInicio}</td>
                  <td style={{ width: "100px" }}>{item.fechaFin}</td>
                  <td style={{ width: "100px" }}>
                    {item.presupuestoGeneral
                      ? parseFloat(item.presupuestoGeneral).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )
                      : "S/I"}
                  </td>
                  <td>
                    {item.presupuestoTotal
                      ? parseFloat(item.presupuestoTotal).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )
                      : "No definido"}
                  </td>
                  <td>
                    {item.presupuestoHH
                      ? parseFloat(item.presupuestoHH).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })
                      : "No definido"}
                  </td>
                  <td>
                    {item.presupuestoMiscelaneo
                      ? parseFloat(item.presupuestoMiscelaneo).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )
                      : "No definido"}
                  </td>
                  <td>
                    {item.porcRentabilidad ? item.porcRentabilidad : "S/I"}
                  </td>
                </tr>
              ))}
          </tbody>
          <br></br>
        </Table>
      </>
    );
  }

  function cardResumen() {
    if (tipoImpugnacion === "OPERATIVO") {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // Define dos columnas
              gap: "20px", // Espacio entre las tarjetas
              margin: "auto", // Centrar el grid
            }}
          >
            {/* ppto */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Ppto total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {parseFloat(datosProyecto.pptoOperativo).toLocaleString(
                  "es-CL",
                  {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}
              </Card.Body>
            </Card>
            {/* saldo */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Saldo total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {datosProyecto.saldoPresupuesto
                  ? parseFloat(datosProyecto.saldoPresupuesto).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }
                    )
                  : parseFloat(datosProyecto.pptoOperativo).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }
                    )}
              </Card.Body>
            </Card>
            {/* costo */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Costo total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {parseFloat(datosProyecto.costoTotal) === 0 ? (
                  <>S/I</>
                ) : (
                  parseFloat(datosProyecto.costoTotal).toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                )}
              </Card.Body>
            </Card>

            {/* colab */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Total colaboradores
              </Card.Title>
              <Card.Body style={{ fontSize: "11pt", fontWeight: "600" }}>
                <table
                  style={{
                    margin: "auto",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        Monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantMonetizados
                          ? datosProyecto.cantMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        No monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantNoMonetizados
                          ? datosProyecto.cantNoMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        <b>Total:</b>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <b>
                          {datosProyecto.cantColaboradores
                            ? datosProyecto.cantColaboradores
                            : 0}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </div>
        </>
      );
    } else if (tipoImpugnacion === "MISCELANEO") {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // Define dos columnas
              gap: "20px", // Espacio entre las tarjetas
              margin: "auto", // Centrar el grid
            }}
          >
            {/* ppto */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Ppto total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {parseFloat(datosProyecto.pptoMiscelaneo).toLocaleString(
                  "es-CL",
                  {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )}
              </Card.Body>
            </Card>
            {/* saldo */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Saldo total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {datosProyecto.saldoPresupuestoMiscelaneo
                  ? parseFloat(
                      datosProyecto.saldoPresupuestoMiscelaneo
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  : parseFloat(datosProyecto.pptoMiscelaneo).toLocaleString(
                      "es-CL",
                      {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }
                    )}
              </Card.Body>
            </Card>
            {/* costo */}
            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Costo total proyecto
              </Card.Title>
              <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
                {parseFloat(datosProyecto.costoTotalMiscelaneo) === 0 ||
                isNaN(parseFloat(datosProyecto.costoTotalMiscelaneo)) ? (
                  <>S/I</>
                ) : (
                  parseFloat(datosProyecto.costoTotalMiscelaneo).toLocaleString(
                    "es-CL",
                    {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }
                  )
                )}
              </Card.Body>
            </Card>

            <Card style={{ width: "300px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Total colaboradores
              </Card.Title>
              <Card.Body style={{ fontSize: "11pt", fontWeight: "600" }}>
                <table
                  style={{
                    margin: "auto",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        Monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantMonetizados
                          ? datosProyecto.cantMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        No monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantNoMonetizados
                          ? datosProyecto.cantNoMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "140px", textAlign: "left" }}>
                        <b>Total:</b>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <b>
                          {datosProyecto.cantColaboradores
                            ? datosProyecto.cantColaboradores
                            : 0}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // Define dos columnas
              gap: "10px", // Espacio entre las tarjetas
              margin: "auto", // Centrar el grid
            }}
          >
            {/* operativo */}
            <Card style={{ width: "310px" }}>
              <Card.Title style={{ marginTop: "10px" }}>Operativo</Card.Title>
              <Card.Body style={{ fontSize: "14pt", fontWeight: "600" }}>
                <table style={{ margin: "auto" }}>
                <tr>
  <td style={{ width: "120px", textAlign: "left" }}>
    Costo proy:
  </td>
  <td style={{ width: "120px", textAlign: "right" }}>
    {parseFloat(datosProyecto.costoTotal) === 0 ? (
      <>
        S/I
        <br />
      </>
    ) : (
      parseFloat(datosProyecto.costoTotal).toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    )}
  </td>
</tr>

                  <tr>
                    <td style={{ width: "120px", textAlign: "left" }}>
                      Saldo proy:
                    </td>
                    <td style={{ width: "120px", textAlign: "right" }}>
                      {parseFloat(
                        datosProyecto.saldoPresupuesto
                      ).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "120px", textAlign: "left" }}>
                      <b>Ppto proy:</b>
                    </td>
                    <td style={{ width: "120px", textAlign: "right" }}>
                      <b>
                        {parseFloat(datosProyecto.pptoOperativo).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )}
                      </b>
                    </td>
                  </tr>
                </table>
              </Card.Body>
            </Card>
            {/* misc */}
            <Card style={{ width: "310px" }}>
              <Card.Title style={{ marginTop: "10px" }}>Misceláneo</Card.Title>
              <Card.Body style={{ fontSize: "14pt", fontWeight: "600" }}>
                <table style={{ margin: "auto" }}>
                  <tr>
                    <td style={{ width: "120px", textAlign: "left" }}>
                      Ppto proy:
                    </td>
                    <td style={{ width: "120px", textAlign: "right" }}>
                      {parseFloat(datosProyecto.pptoMiscelaneo).toLocaleString(
                        "es-CL",
                        {
                          style: "currency",
                          currency: "CLP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "120px", textAlign: "left" }}>
                      Costo proy:
                    </td>
                    <td style={{ width: "120px", textAlign: "right" }}>
                      {isNaN(parseFloat(datosProyecto.costoTotalMiscelaneo))
                        ? "S/I"
                        : parseFloat(
                            datosProyecto.costoTotalMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "120px", textAlign: "left" }}>
                      <b>Saldo proy:</b>
                    </td>
                    <td style={{ width: "120px", textAlign: "right" }}>
                      <b>
                        {parseFloat(
                          datosProyecto.saldoPresupuestoMiscelaneo
                        ).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </b>
                    </td>
                  </tr>
                </table>
              </Card.Body>
            </Card>
            {/* colab */}
            <Card style={{ width: "310px" }}>
              <Card.Title style={{ marginTop: "10px" }}>
                Total colaboradores
              </Card.Title>
              <Card.Body style={{ fontSize: "14pt", fontWeight: "600" }}>
                <table
                  style={{
                    margin: "auto",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "left", width: "160px" }}>
                        Monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantMonetizados
                          ? datosProyecto.cantMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", width: "160px" }}>
                        No monetizados:
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {datosProyecto.cantNoMonetizados
                          ? datosProyecto.cantNoMonetizados
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "left", width: "160px" }}>
                        <b>Total:</b>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <b>
                          {datosProyecto.cantColaboradores
                            ? datosProyecto.cantColaboradores
                            : 0}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </div>
        </>
      );
    }
  }

  const verificarValor = (valor) => {
    return isNaN(valor) ? 0 : valor;
  };

  function ResumenMes() {
    // Manejador de clic en la tarjeta
    const handleCardClick = (item) => {
      setDatosMes(item);
      setIsActiveDetalleMes(true);
    };

    if (tipoImpugnacion === "OPERATIVO") {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "center", // Alinea las tarjetas verticalmente
            width: "800px",
          }}
        >
          {listadoDetalle &&
            listadoDetalle.map((item) => (
              <Card
                key={item.id}
                className="card-hover"
                style={{
                  width: "320px",
                  minHeight: "290px",
                  margin: "auto",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title
                  style={{
                    textAlign: "center",
                    paddingTop: "10px",
                    fontSize: "16pt",
                  }}
                >
                  {convertirFecha(item.mes)}
                </Card.Title>
                <Card.Body>
                  {/* operativo */}
                  <h5>Proyectado</h5>
                  <div>
                    {/* ppto */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Ppto:{" "}
                        {parseFloat(item.presupuestoMensual).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}{" "}
                        <br></br>100%
                      </p>
                      <ProgressBar striped now={100} style={{ height: "15px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colores.ppto[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>
                    <br></br>

                    {/* costo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Costo:{" "}
                        {parseFloat(item.costoMensual) === 0 ||
                        isNaN(parseFloat(item.costoMensual)) ? (
                          <>
                            S/I
                            <br />
                            0.00%
                          </>
                        ) : (
                          <>
                            {verificarValor(
                              parseFloat(item.costoMensual)
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br />
                            {verificarValor(
                              (item.costoMensual * 100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            %
                          </>
                        )}
                      </p>
                      <ProgressBar
                        striped
                        now={
                          item.costoMensual === 0
                            ? 0
                            : verificarValor(
                                (item.costoMensual * 100) /
                                  item.presupuestoMensual
                              ).toFixed(2)
                        }
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${
                              item.costoMensual === 0
                                ? 0
                                : verificarValor(
                                    (item.costoMensual * 100) /
                                      item.presupuestoMensual
                                  ).toFixed(2)
                            }%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <br></br>

                    {/* saldo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      {isNaN(
                        parseFloat(item.presupuestoMensual - item.costoMensual)
                      ) ? (
                        <>
                          <p>
                            Saldo:{" "}
                            {parseFloat(item.presupuestoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}{" "}
                            <br></br>
                            100%
                          </p>
                          <ProgressBar
                            striped
                            now={100}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              color:
                                parseFloat(item.costoMensual) >
                                parseFloat(item.presupuestoMensual)
                                  ? "red"
                                  : "black",
                            }}
                          >
                            Saldo:{" "}
                            {parseFloat(
                              item.presupuestoMensual - item.costoMensual
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br></br>
                            {verificarValor(
                              ((item.presupuestoMensual - item.costoMensual) *
                                100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            %
                          </p>
                          <ProgressBar
                            striped
                            now={verificarValor(
                              ((item.presupuestoMensual - item.costoMensual) *
                                100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${verificarValor(
                                  ((item.presupuestoMensual -
                                    item.costoMensual) *
                                    100) /
                                    item.presupuestoMensual
                                ).toFixed(2)}%`,
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      )}
                    </div>

                    <br></br>
                  </div>
                  <h5>Acumulado</h5>
                  {/* misc */}
                  <div>
                    {/* ppto */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Ppto:{" "}
                        {parseFloat(item.presupuestoAcumulado).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}
                        <br></br>
                        100%
                      </p>
                      <ProgressBar striped now={100} style={{ height: "15px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colores.ppto_acu[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>
                    <br></br>

                    {/* costo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Costo:{" "}
                        {parseFloat(item.costoMensual) === 0 ||
                        isNaN(parseFloat(item.costoMensual)) ? (
                          <>
                            S/I
                            <br />
                            0.00%
                          </>
                        ) : (
                          <>
                            {verificarValor(
                              parseFloat(item.costoMensual)
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br />
                            {verificarValor(
                              (item.costoMensual * 100) /
                                item.presupuestoAcumulado
                            ).toFixed(2)}
                            %
                          </>
                        )}
                      </p>
                      <ProgressBar
                        striped
                        now={
                          item.costoMensual === 0
                            ? 0
                            : verificarValor(
                                (item.costoMensual * 100) /
                                  item.presupuestoAcumulado
                              ).toFixed(2)
                        }
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${
                              item.costoMensual === 0
                                ? 0
                                : verificarValor(
                                    (item.costoMensual * 100) /
                                      item.presupuestoAcumulado
                                  ).toFixed(2)
                            }%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <br></br>

                    {/* saldo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      {isNaN(parseFloat(item.saldoMensual)) ? (
                        <>
                          <p>
                            Saldo:{" "}
                            {parseFloat(
                              item.presupuestoMensualAcumulado
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}
                            <br></br>
                            100%
                          </p>
                          <ProgressBar
                            striped
                            now={100}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              color:
                                parseFloat(item.costoMensual) >
                                parseFloat(item.presupuestoAcumulado)
                                  ? "red"
                                  : "black",
                            }}
                          >
                            Saldo:{" "}
                            {parseFloat(item.saldoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}{" "}
                            <br></br>
                            {verificarValor(
                              (item.saldoMensual * 100) /
                                item.presupuestoAcumulado
                            ).toFixed(2)}
                            %
                          </p>
                          <ProgressBar
                            striped
                            now={verificarValor(
                              (item.saldoMensual * 100) /
                                item.presupuestoAcumulado
                            ).toFixed(2)}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${verificarValor(
                                  (item.saldoMensual * 100) /
                                    item.presupuestoAcumulado
                                ).toFixed(2)}%`,
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      )}
                    </div>
                  </div>
                  <br></br>
                  {/* cant colab */}
                  <table
                    style={{
                      width: "100%",
                      margin: "auto",
                      borderCollapse: "collapse",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantMonetizados ? item.cantMonetizados : "S/I"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant no monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantNoMonetizados
                            ? item.cantNoMonetizados
                            : "S/I"}
                        </td>
                      </tr>
                      {/* <tr>
                        <td colSpan={2}>
                          <b>-----------------------------------------</b>
                        </td>
                      </tr> */}
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant total colaboradores:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          <b>
                            {item.cantColaboradores
                              ? item.cantColaboradores
                              : "S/I"}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    } else if (tipoImpugnacion === "MISCELANEO") {
      //Miscelaneo
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "center", // Alinea las tarjetas verticalmente
            width: "800px",
          }}
        >
          {listadoDetalle &&
            listadoDetalle.map((item) => (
              <Card
                key={item.id}
                className="card-hover"
                style={{
                  width: "320px",
                  minHeight: "290px",
                  margin: "auto",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title style={{ textAlign: "center", paddingTop: "10px" }}>
                  {convertirFecha(item.mes)}
                </Card.Title>
                <Card.Body>
                  {/* ppto */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                      textAlign: "left",
                    }}
                  >
                    <p>
                      Ppto:{" "}
                      {parseFloat(
                        item.presupuestoMensualMiscelaneo
                      ).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                      <br></br>
                      100%
                    </p>
                    <ProgressBar striped now={100} style={{ height: "15px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: colores.ppto[0].datoVisible, // Color dinámico desde el objeto colores
                        }}
                      />
                    </ProgressBar>
                  </div>
                  <br></br>

                  {/* costo */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                      textAlign: "left",
                    }}
                  >
                    <p>
                      Costo:{" "}
                      {parseFloat(item.costoMensualMiscelaneo) === 0 ? (
                        <>
                          S/I
                          <br />
                          0.00%
                        </>
                      ) : (
                        <>
                          {verificarValor(
                            parseFloat(item.costoMensualMiscelaneo)
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}{" "}
                          <br />
                          {verificarValor(
                            (item.costoMensualMiscelaneo * 100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}
                          %
                        </>
                      )}
                    </p>
                    <ProgressBar
                      striped
                      now={
                        item.costoMensualMiscelaneo === 0
                          ? 0
                          : verificarValor(
                              (item.costoMensualMiscelaneo * 100) /
                                item.presupuestoMensualMiscelaneo
                            ).toFixed(2)
                      }
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${
                            item.costoMensualMiscelaneo === 0
                              ? 0
                              : verificarValor(
                                  (item.costoMensualMiscelaneo * 100) /
                                    item.presupuestoMensualMiscelaneo
                                ).toFixed(2)
                          }%`,
                          height: "100%",
                          backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                        }}
                      />
                    </ProgressBar>
                  </div>

                  <br></br>

                  {/* saldo */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                      textAlign: "left",
                    }}
                  >
                    {isNaN(parseFloat(item.costoMensualMiscelaneo)) ? (
                      <>
                        <p>
                          Saldo:{" "}
                          {parseFloat(
                            item.presupuestoMensualMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                          <br></br>
                          100%
                        </p>
                        <ProgressBar
                          striped
                          now={100}
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            color:
                              parseFloat(item.costoMensualMiscelaneo) >
                              parseFloat(item.presupuestoMensualMiscelaneo)
                                ? "red"
                                : "black",
                          }}
                        >
                          Saldo:{" "}
                          {parseFloat(
                            item.presupuestoMensualMiscelaneo -
                              item.costoMensualMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}{" "}
                          <br></br>
                          {verificarValor(
                            ((item.presupuestoMensualMiscelaneo -
                              item.costoMensualMiscelaneo) *
                              100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}
                          %
                        </p>
                        <ProgressBar
                          striped
                          now={verificarValor(
                            ((item.presupuestoMensualMiscelaneo -
                              item.costoMensualMiscelaneo) *
                              100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: `${verificarValor(
                                ((item.presupuestoMensualMiscelaneo -
                                  item.costoMensualMiscelaneo) *
                                  100) /
                                  item.presupuestoMensualMiscelaneo
                              ).toFixed(2)}%`,
                              height: "100%",
                              backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </>
                    )}
                  </div>

                  <br></br>

                  <h5>Acumulado</h5>
                  <div>
                    {/* ppto */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Ppto:{" "}
                        {parseFloat(
                          item.presupuestoAcumuladoMiscelaneo
                        ).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                        <br></br>
                        100%
                      </p>
                      <ProgressBar striped now={100} style={{ height: "15px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: colores.ppto_acu[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>
                    <br></br>

                    {/* costo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Costo:{" "}
                        {parseFloat(item.costoMensualMiscelaneo) === 0 ? (
                          <>
                            S/I
                            <br />
                            0.00%
                          </>
                        ) : (
                          <>
                            {verificarValor(
                              parseFloat(item.costoMensualMiscelaneo)
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br />
                            {verificarValor(
                              (item.costoMensualMiscelaneo * 100) /
                                item.presupuestoAcumuladoMiscelaneo
                            ).toFixed(2)}
                            %
                          </>
                        )}
                      </p>
                      <ProgressBar
                        striped
                        now={
                          parseFloat(item.costoMensualMiscelaneo) === 0
                            ? 0
                            : verificarValor(
                                (item.costoMensualMiscelaneo * 100) /
                                  item.presupuestoAcumuladoMiscelaneo
                              ).toFixed(2)
                        }
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${
                              parseFloat(item.costoMensualMiscelaneo) === 0
                                ? 0
                                : verificarValor(
                                    (item.costoMensualMiscelaneo * 100) /
                                      item.presupuestoAcumuladoMiscelaneo
                                  ).toFixed(2)
                            }%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>

                    <br></br>

                    {/* saldo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      {isNaN(parseFloat(item.saldoMensualMiscelaneo)) ? (
                        <>
                          <p
                            style={{
                              color:
                                parseFloat(item.costoMensualMiscelaneo) >
                                parseFloat(item.presupuestoAcumuladoMiscelaneo)
                                  ? "red"
                                  : "black",
                            }}
                          >
                            Saldo:{" "}
                            {parseFloat(
                              item.presupuestoAcumuladoMiscelaneo
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}
                            <br></br>
                            100%
                          </p>
                          <ProgressBar
                            striped
                            now={100}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              color:
                                parseFloat(item.costoMensualMiscelaneo) >
                                parseFloat(item.presupuestoAcumuladoMiscelaneo)
                                  ? "red"
                                  : "black",
                            }}
                          >
                            Saldo:{" "}
                            {parseFloat(
                              item.saldoMensualMiscelaneo
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            <br></br>
                            {verificarValor(
                              (item.saldoMensualMiscelaneo * 100) /
                                item.presupuestoAcumuladoMiscelaneo
                            ).toFixed(2)}
                            %
                          </p>
                          <ProgressBar
                            striped
                            now={verificarValor(
                              (item.saldoMensualMiscelaneo * 100) /
                                item.presupuestoAcumuladoMiscelaneo
                            ).toFixed(2)}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${verificarValor(
                                  (item.saldoMensualMiscelaneo * 100) /
                                    item.presupuestoAcumuladoMiscelaneo
                                ).toFixed(2)}%`,
                                height: "100%",
                                backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </>
                      )}
                    </div>
                  </div>
                  <br></br>
                  {/* cant colab */}
                  <table
                    style={{
                      width: "100%",
                      margin: "auto",
                      borderCollapse: "collapse",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantMonetizados ? item.cantMonetizados : "S/I"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant no monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantNoMonetizados
                            ? item.cantNoMonetizados
                            : "S/I"}
                        </td>
                      </tr>
                      {/* <tr>
                        <td colSpan={2}>
                          <b>-----------------------------------------</b>
                        </td>
                      </tr> */}
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant total colaboradores:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          <b>
                            {item.cantColaboradores
                              ? item.cantColaboradores
                              : "S/I"}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // Máximo 3 columnas
            gap: "10px", // Espacio entre las tarjetas
            margin: "auto", // Centra el grid en la página
            justifyContent: "center", // Centra las tarjetas horizontalmente
            alignItems: "center", // Alinea las tarjetas verticalmente
            width: "800px",
          }}
        >
          {listadoDetalle &&
            listadoDetalle.map((item) => (
              <Card
                key={item.id}
                className="card-hover"
                style={{
                  width: "485px",
                  minHeight: "290px",
                  margin: "auto",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(item)}
              >
                <Card.Title style={{ textAlign: "center", paddingTop: "10px" }}>
                  {convertirFecha(item.mes)}
                </Card.Title>
                <Card.Body>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    {/* Operativo */}
                    <div style={{ width: "230px" }}>
                      <h5>Operativo</h5>
                      {/* ppto */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        {parseFloat(item.presupuestoMensual)
                          .toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })
                          .toString().length <= 14 ? (
                          <p style={{ fontSize: "11pt" }}>
                            Ppto:{" "}
                            {parseFloat(item.presupuestoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}
                            <br></br>
                            100%
                            <br></br>
                            {/* <br></br> */}
                          </p>
                        ) : (
                          <p style={{ fontSize: "11pt" }}>
                            Ppto:{" "}
                            {parseFloat(item.presupuestoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}
                            <br></br>
                            100%
                          </p>
                        )}

                        <ProgressBar
                          striped
                          now={100}
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: colores.ppto[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </div>
                      <br></br>

                      {/* costo */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        <p style={{ fontSize: "11pt" }}>
                          Costo:{" "}
                          {parseFloat(item.costoMensual) === 0 ? (
                            <>
                              S/I
                              <br />
                              0.00%
                            </>
                          ) : (
                            <>
                              {verificarValor(
                                parseFloat(item.costoMensual)
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}{" "}
                              <br />
                              {verificarValor(
                                (item.costoMensual * 100) /
                                  item.presupuestoMensual
                              ).toFixed(2)}
                              %
                            </>
                          )}
                        </p>
                        <ProgressBar
                          striped
                          now={
                            item.costoMensual === 0
                              ? 0
                              : verificarValor(
                                  (item.costoMensual * 100) /
                                    item.presupuestoMensual
                                ).toFixed(2)
                          }
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: `${
                                item.costoMensual === 0
                                  ? 0
                                  : verificarValor(
                                      (item.costoMensual * 100) /
                                        item.presupuestoMensual
                                    ).toFixed(2)
                              }%`,
                              height: "100%",
                              backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </div>

                      <br></br>
                      {/* saldo */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        {isNaN(parseFloat(item.saldoMensual)) &&
                        isNaN(parseFloat(item.costoMensual)) ? (
                          <>
                            {parseFloat(item.presupuestoMensual)
                              .toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })
                              .toString().length <= 14 ? (
                              <p style={{ fontSize: "11pt" }}>
                                Saldo:{" "}
                                {parseFloat(
                                  item.presupuestoMensual
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}
                                <br></br>
                                100%
                                <br></br>
                              </p>
                            ) : (
                              <p style={{ fontSize: "11pt" }}>
                                Saldo:{" "}
                                {parseFloat(
                                  item.presupuestoMensual
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}
                                <br></br>
                                100%
                              </p>
                            )}
                            <ProgressBar
                              striped
                              now={100}
                              style={{ height: "15px" }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                }}
                              />
                            </ProgressBar>
                          </>
                        ) : (
                          <>
                            {parseFloat(
                              item.presupuestoMensual - item.costoMensual
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            }).toString.length < 14 ? (
                              <p
                                style={{
                                  fontSize: "11pt",
                                  color:
                                    parseFloat(item.costoMensual) >
                                    parseFloat(item.presupuestoMensual)
                                      ? "red"
                                      : "black",
                                }}
                              >
                                Saldo:{" "}
                                {parseFloat(
                                  item.presupuestoMensual - item.costoMensual
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}{" "}
                                <br></br>
                                {verificarValor(
                                  ((item.presupuestoMensual -
                                    item.costoMensual) *
                                    100) /
                                    item.presupuestoMensual
                                ).toFixed(2)}
                                %<br></br>
                              </p>
                            ) : (
                              <p
                                style={{
                                  fontSize: "11pt",
                                  color:
                                    parseFloat(item.costoMensual) >
                                    parseFloat(item.presupuestoMensual)
                                      ? "red"
                                      : "black",
                                }}
                              >
                                Saldo:{" "}
                                {parseFloat(
                                  item.presupuestoMensual - item.costoMensual
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}{" "}
                                <br></br>
                                {verificarValor(
                                  (item.presupuestoMensual -
                                    item.costoMensual * 100) /
                                    item.presupuestoMensual
                                ).toFixed(2)}
                                %
                              </p>
                            )}

                            <ProgressBar
                              striped
                              now={verificarValor(
                                ((item.presupuestoMensual - item.costoMensual) *
                                  100) /
                                  item.presupuestoMensual
                              ).toFixed(2)}
                              style={{ height: "15px" }}
                            >
                              <div
                                style={{
                                  width: `${verificarValor(
                                    ((item.presupuestoMensual -
                                      item.costoMensual) *
                                      100) /
                                      item.presupuestoMensual
                                  ).toFixed(2)}%`,
                                  height: "100%",
                                  backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                }}
                              />
                            </ProgressBar>
                          </>
                        )}
                      </div>

                      <br></br>

                      <h5>Acumulado</h5>
                      <div>
                        {/* ppto */}
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          {parseFloat(item.presupuestoAcumulado)
                            .toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })
                            .toString().length <= 14 ? (
                            <p style={{ fontSize: "11pt" }}>
                              Ppto:{" "}
                              {parseFloat(
                                item.presupuestoAcumulado
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}
                              <br></br>
                              100%
                              <br></br>
                            </p>
                          ) : (
                            <p style={{ fontSize: "11pt" }}>
                              Ppto:{" "}
                              {parseFloat(
                                item.presupuestoAcumulado
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}
                              <br></br>
                              100%
                            </p>
                          )}

                          <ProgressBar
                            striped
                            now={100}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: colores.ppto_acu[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </div>

                        <br></br>
                        {/* costo */}
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          <p style={{ fontSize: "11pt" }}>
                            Costo:{" "}
                            {parseFloat(item.costoMensual) === 0 ? (
                              <>
                                S/I
                                <br />
                                0.00%
                              </>
                            ) : (
                              <>
                                {verificarValor(
                                  parseFloat(item.costoMensual)
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}{" "}
                                <br />
                                {verificarValor(
                                  (item.costoMensual * 100) /
                                    item.presupuestoAcumulado
                                ).toFixed(2)}
                                %
                              </>
                            )}
                          </p>
                          <ProgressBar
                            striped
                            now={
                              item.costoMensual === 0
                                ? 0
                                : verificarValor(
                                    (item.costoMensual * 100) /
                                      item.presupuestoAcumulado
                                  ).toFixed(2)
                            }
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${
                                  item.costoMensual === 0
                                    ? 0
                                    : verificarValor(
                                        (item.costoMensual * 100) /
                                          item.presupuestoAcumulado
                                      ).toFixed(2)
                                }%`,
                                height: "100%",
                                backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </div>

                        {/* saldo */}
                        <br></br>
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          {isNaN(parseFloat(item.saldoMensual)) ? (
                            <>
                              {parseFloat(item.presupuestoAcumulado)
                                .toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                                .toString().length < 15 ? (
                                <p style={{ fontSize: "11pt" }}>
                                  Saldo:{" "}
                                  {parseFloat(
                                    item.presupuestoAcumulado
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })}
                                  <br></br>
                                  100%
                                  <br></br>
                                </p>
                              ) : (
                                <p style={{ fontSize: "11pt" }}>
                                  Saldo:{" "}
                                  {parseFloat(
                                    item.presupuestoAcumulado
                                  ).toLocaleString("es-CL", {
                                    style: "currency",
                                    currency: "CLP",
                                  })}
                                  <br></br>
                                  100%
                                </p>
                              )}

                              <ProgressBar
                                striped
                                now={100}
                                style={{ height: "15px" }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor:
                                      colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                  }}
                                />
                              </ProgressBar>
                            </>
                          ) : (
                            <>
                              {parseFloat(item.saldoMensual)
                                .toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })
                                .toString().length < 15 ? (
                                <p
                                  style={{
                                    fontSize: "11pt",
                                    color:
                                      parseFloat(item.costoMensual) >
                                      parseFloat(item.presupuestoAcumulado)
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  Saldo:{" "}
                                  {parseFloat(item.saldoMensual).toLocaleString(
                                    "es-CL",
                                    {
                                      style: "currency",
                                      currency: "CLP",
                                    }
                                  )}{" "}
                                  <br></br>
                                  {verificarValor(
                                    (item.saldoMensual * 100) /
                                      item.presupuestoAcumulado
                                  ).toFixed(2)}
                                  %<br></br>
                                </p>
                              ) : (
                                <p
                                  style={{
                                    fontSize: "11pt",
                                    color:
                                      parseFloat(item.costoMensual) >
                                      parseFloat(item.presupuestoAcumulado)
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  Saldo:{" "}
                                  {parseFloat(item.saldoMensual).toLocaleString(
                                    "es-CL",
                                    {
                                      style: "currency",
                                      currency: "CLP",
                                    }
                                  )}{" "}
                                  <br></br>
                                  {verificarValor(
                                    (item.saldoMensual * 100) /
                                      item.presupuestoAcumulado
                                  ).toFixed(2)}
                                  %
                                </p>
                              )}

                              <ProgressBar
                                striped
                                now={verificarValor(
                                  (item.saldoMensual * 100) /
                                    item.presupuestoAcumulado
                                ).toFixed(2)}
                                style={{ height: "15px" }}
                              >
                                <div
                                  style={{
                                    width: `${verificarValor(
                                      (item.saldoMensual * 100) /
                                        item.presupuestoAcumulado
                                    ).toFixed(2)}%`,
                                    height: "100%",
                                    backgroundColor:
                                      colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                  }}
                                />
                              </ProgressBar>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* miscelaneo */}
                    <div style={{ width: "230px" }}>
                      <h5>Misceláneo</h5>

                      {/* ppto */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        <p style={{ fontSize: "11pt" }}>
                          Ppto:{" "}
                          {parseFloat(
                            item.presupuestoMensualMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                          <br></br>
                          100%
                        </p>

                        <ProgressBar
                          striped
                          now={100}
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: colores.ppto[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </div>

                      <br></br>
                      {/* costo */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        <p style={{ fontSize: "11pt" }}>
                          Costo:{" "}
                          {parseFloat(item.costoMensualMiscelaneo) === 0 ? (
                            <>
                              S/I
                              <br />
                              0.00%
                            </>
                          ) : (
                            <>
                              {verificarValor(
                                parseFloat(item.costoMensualMiscelaneo)
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}{" "}
                              <br />
                              {verificarValor(
                                (item.costoMensualMiscelaneo * 100) /
                                  item.presupuestoMensualMiscelaneo
                              ).toFixed(2)}
                              %
                            </>
                          )}
                        </p>

                        <ProgressBar
                          striped
                          now={
                            item.costoMensualMiscelaneo === 0
                              ? 0
                              : verificarValor(
                                  (item.costoMensualMiscelaneo * 100) /
                                    item.presupuestoMensualMiscelaneo
                                ).toFixed(2)
                          }
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: `${
                                item.costoMensualMiscelaneo === 0
                                  ? 0
                                  : verificarValor(
                                      (item.costoMensualMiscelaneo * 100) /
                                        item.presupuestoMensualMiscelaneo
                                    ).toFixed(2)
                              }%`,
                              height: "100%",
                              backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                            }}
                          />
                        </ProgressBar>
                      </div>

                      <br></br>
                      {/* saldo */}
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                          textAlign: "left",
                        }}
                      >
                        {isNaN(parseFloat(item.costoMensualMiscelaneo)) ? (
                          <>
                            <p style={{ fontSize: "11pt" }}>
                              Saldo:{" "}
                              {parseFloat(
                                item.presupuestoMensualMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}
                              <br></br>
                              100%
                            </p>
                            <ProgressBar
                              striped
                              now={100}
                              style={{ height: "15px" }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                }}
                              />
                            </ProgressBar>
                          </>
                        ) : (
                          <>
                            <p
                              style={{
                                fontSize: "11pt",
                                color:
                                  parseFloat(item.costoMensualMiscelaneo) >
                                  parseFloat(item.presupuestoMensualMiscelaneo)
                                    ? "red"
                                    : "black",
                              }}
                            >
                              Saldo:{" "}
                              {parseFloat(
                                item.presupuestoMensualMiscelaneo -
                                  item.costoMensualMiscelaneo
                              ).toLocaleString("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              })}{" "}
                              <br></br>
                              {verificarValor(
                                ((item.presupuestoMensualMiscelaneo -
                                  item.costoMensualMiscelaneo) *
                                  100) /
                                  item.presupuestoMensualMiscelaneo
                              ).toFixed(2)}
                              %
                            </p>

                            <ProgressBar
                              striped
                              now={verificarValor(
                                ((item.presupuestoMensualMiscelaneo -
                                  item.costoMensualMiscelaneo) *
                                  100) /
                                  item.presupuestoMensualMiscelaneo
                              ).toFixed(2)}
                              style={{ height: "15px" }}
                            >
                              <div
                                style={{
                                  width: `${verificarValor(
                                    ((item.presupuestoMensualMiscelaneo -
                                      item.costoMensualMiscelaneo) *
                                      100) /
                                      item.presupuestoMensualMiscelaneo
                                  ).toFixed(2)}%`,
                                  height: "100%",
                                  backgroundColor: colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                }}
                              />
                            </ProgressBar>
                          </>
                        )}
                      </div>

                      <br></br>

                      <h5>Acumulado</h5>
                      <div>
                        {/* ppto */}
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          <p style={{ fontSize: "11pt" }}>
                            Ppto:{" "}
                            {parseFloat(
                              item.presupuestoAcumuladoMiscelaneo
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}
                            <br></br>
                            100%
                          </p>

                          <ProgressBar
                            striped
                            now={100}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: colores.ppto_acu[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </div>
                        <br></br>

                        {/* costo */}
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          <p style={{ fontSize: "11pt" }}>
                            Costo:{" "}
                            {parseFloat(item.costoMensualMiscelaneo) === 0 ? (
                              <>
                                S/I
                                <br />
                                0.00%
                              </>
                            ) : (
                              <>
                                {verificarValor(
                                  parseFloat(item.costoMensualMiscelaneo)
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}{" "}
                                <br />
                                {verificarValor(
                                  (item.costoMensualMiscelaneo * 100) /
                                    item.presupuestoAcumuladoMiscelaneo
                                ).toFixed(2)}
                                %
                              </>
                            )}
                          </p>

                          <ProgressBar
                            striped
                            now={
                              item.costoMensualMiscelaneo === 0
                                ? 0
                                : verificarValor(
                                    (item.costoMensualMiscelaneo * 100) /
                                      item.presupuestoAcumuladoMiscelaneo
                                  ).toFixed(2)
                            }
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${
                                  item.costoMensualMiscelaneo === 0
                                    ? 0
                                    : verificarValor(
                                        (item.costoMensualMiscelaneo * 100) /
                                          item.presupuestoAcumuladoMiscelaneo
                                      ).toFixed(2)
                                }%`,
                                height: "100%",
                                backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                              }}
                            />
                          </ProgressBar>
                        </div>

                        <br></br>
                        {/* saldo */}
                        <div
                          style={{
                            width: "100%",
                            marginBottom: "5px",
                            textAlign: "left",
                          }}
                        >
                          {isNaN(parseFloat(item.saldoMensualMiscelaneo)) ? (
                            <>
                              <p
                                style={{
                                  fontSize: "11pt",
                                  color:
                                    parseFloat(item.costoMensualMiscelaneo) >
                                    parseFloat(
                                      item.presupuestoAcumuladoMiscelaneo
                                    )
                                      ? "red"
                                      : "black",
                                }}
                              >
                                Saldo:{" "}
                                {parseFloat(
                                  item.presupuestoAcumuladoMiscelaneo
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}
                                <br></br>
                                100%
                              </p>
                              <ProgressBar
                                striped
                                now={100}
                                style={{ height: "15px" }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor:
                                      colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                  }}
                                />
                              </ProgressBar>
                            </>
                          ) : (
                            <>
                              <p style={{ fontSize: "11pt" }}>
                                Saldo:{" "}
                                {parseFloat(
                                  item.saldoMensualMiscelaneo
                                ).toLocaleString("es-CL", {
                                  style: "currency",
                                  currency: "CLP",
                                })}{" "}
                                <br></br>
                                {verificarValor(
                                  (item.saldoMensualMiscelaneo * 100) /
                                    item.presupuestoAcumuladoMiscelaneo
                                ).toFixed(2)}
                                %
                              </p>
                              <ProgressBar
                                striped
                                now={verificarValor(
                                  (item.saldoMensualMiscelaneo * 100) /
                                    item.presupuestoAcumuladoMiscelaneo
                                ).toFixed(2)}
                                style={{ height: "15px" }}
                              >
                                <div
                                  style={{
                                    width: `${verificarValor(
                                      (item.saldoMensualMiscelaneo * 100) /
                                        item.presupuestoAcumuladoMiscelaneo
                                    ).toFixed(2)}%`,
                                    height: "100%",
                                    backgroundColor:
                                      colores.saldo[0].datoVisible, // Color dinámico desde el objeto colores
                                  }}
                                />
                              </ProgressBar>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <br></br>
                  {/* cant colab */}
                  <table
                    style={{
                      width: "60%",
                      margin: "auto",
                      borderCollapse: "collapse",
                      marginTop: "5px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantMonetizados ? item.cantMonetizados : "S/I"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant no monetizados:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantNoMonetizados
                            ? item.cantNoMonetizados
                            : "S/I"}
                        </td>
                      </tr>
                      {/* <tr>
                        <td colSpan={2}>
                          <b>-----------------------------------------</b>
                        </td>
                      </tr> */}
                      <tr>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "left",
                          }}
                        >
                          <b>Cant total colaboradores:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          <b>
                            {item.cantColaboradores
                              ? item.cantColaboradores
                              : "S/I"}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            ))}
        </div>
      );
    }
  }

  useEffect(() => {
    obtenerDatosMeses();
    obtenerDatosAcops();
    setIsActiveDetalleMes(false);
    setDatosMes([]);
  }, [datosProyecto.idEDDProyecto]);

  return (
    <>
      <section
        style={{
          backgroundColor: "white",
          width: "1000px",
          margin: "auto",
          textAlign: "center",
          borderRadius: "30px",
          padding: "20px",
        }}
      >
        <h3>Detalle del proyecto</h3>
        <h3>{datosProyecto.nomProyecto}</h3>
        <table
          style={{ width: "60%", margin: "auto", borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha inicio proy:</b>
                </td>
                <td>{datosProyecto.fechaIniProyecto}</td>
              </td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha fin proy:</b>
                </td>
                <td>{datosProyecto.fechaFinProyecto}</td>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Tipo impugnación:</b>
                </td>
                <td>{tipoImpugnacion}</td>
              </td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Estado proyecto:</b>{" "}
                </td>
                <td>{estadoProyecto}</td>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          <br></br>
          {cardResumen()}
          <br></br>
          <h4>Acops relacionados</h4>
          <br></br>
          {TablaAcops()}
          <h4>Resumen por mes</h4>
          <h5>{datosProyecto.nomProyecto}</h5>
          <br></br>
          {ResumenMes()}
        </div>
      </section>
      <br></br>
      {isActiveDetalleMes && (
        <div ref={componenteRef}>
          <EstadoDeMes
            idProyecto={datosProyecto.idEDDProyecto}
            datosMes={datosMes}
            tipoImpugnacion={tipoImpugnacion}
            estadoProyecto={estadoProyecto}
            colores={colores}
          />
        </div>
      )}
    </>
  );
}
