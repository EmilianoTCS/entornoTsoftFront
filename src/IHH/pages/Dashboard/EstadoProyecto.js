import React, { useState, useEffect } from "react";
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

  function obtenerDatosMeses() {
    const url = "pages/listados/ihh_listadoDetalleProyecto.php";
    const operationUrl = "ihh_listadoDetalleProyecto";
    var data = {
      idProyecto: datosProyecto.idEDDProyecto,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const meses = obtenerMesesEntreFechas(paramsFechaIni, paramsFechaFin);
      const filtrados = response.filter(datos => meses.includes(datos.mes))
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
    let [diaIni, mesIni, anioIni] = fechaInicio.split('-').map(Number);
    let [diaFin, mesFin, anioFin] = fechaFin.split('-').map(Number);
    
    let fechaIni = new Date(anioIni, mesIni - 1, diaIni); // Crear la fecha de inicio
    let fechaFinProy = new Date(anioFin, mesFin - 1, diaFin); // Crear la fecha de fin
    let meses = [];

    // Iterar solo si la fecha de inicio es menor o igual a la de fin
    while (fechaIni <= fechaFinProy) {
        let year = fechaIni.getFullYear();
        let month = (fechaIni.getMonth() + 1).toString().padStart(2, '0'); // Obtener el mes con dos dígitos
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
                      : "N/D"}
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
                    {item.porcRentabilidad ? item.porcRentabilidad : "N/D"}
                  </td>
                </tr>
              ))}
          </tbody>
          <br></br>
          <p>N/D: No definido</p>
        </Table>
      </>
    );
  }

  function cardResumen() {
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
          <Card style={{ width: "300px" }}>
            <Card.Title style={{ marginTop: "10px" }}>
              Presupuesto proyecto
            </Card.Title>
            <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
              {parseFloat(datosProyecto.pptoOperativo).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Card.Body>
          </Card>
          <Card style={{ width: "300px" }}>
            <Card.Title style={{ marginTop: "10px" }}>
              Saldo proyecto
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
          <Card style={{ width: "300px" }}>
            <Card.Title style={{ marginTop: "10px" }}>
              Costo proyecto
            </Card.Title>
            <Card.Body style={{ fontSize: "20pt", fontWeight: "600" }}>
              {datosProyecto.costoTotal
                ? parseFloat(datosProyecto.costoTotal).toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : parseFloat(0).toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
            </Card.Body>
          </Card>

          <Card style={{ width: "300px" }}>
            <Card.Title style={{ marginTop: "10px" }}>Colaboradores</Card.Title>
            <Card.Body style={{ fontSize: "11pt", fontWeight: "600" }}>
              <table
                style={{
                  margin: "auto",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <td style={{ width: "140px" }}>Monetizados:</td>
                      <td>
                        {datosProyecto.cantMonetizados
                          ? datosProyecto.cantMonetizados
                          : 0}
                      </td>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <td style={{ width: "140px" }}>No monetizados:</td>
                      <td>
                        {datosProyecto.cantNoMonetizados
                          ? datosProyecto.cantNoMonetizados
                          : 0}
                      </td>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <td style={{ width: "140px" }}>
                        <b>Total:</b>
                      </td>
                      <td>
                        <b>
                          {datosProyecto.cantColaboradores
                            ? datosProyecto.cantColaboradores
                            : 0}
                        </b>
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* {datosProyecto.cantColaboradores
                ? datosProyecto.cantColaboradores
                : 0} */}
            </Card.Body>
          </Card>
        </div>
      </>
    );
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
                        Presupuesto -{" "}
                        {parseFloat(item.presupuestoMensual).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}{" "}
                        - (100%)
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
                    {/* costo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Costo -{" "}
                        {verificarValor(
                          parseFloat(item.costoMensual)
                        ).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}{" "}
                        - (
                        {verificarValor(
                          (item.costoMensual * 100) / item.presupuestoMensual
                        ).toFixed(2)}
                        %)
                      </p>
                      <ProgressBar
                        striped
                        now={verificarValor(
                          (item.costoMensual * 100) / item.presupuestoMensual
                        ).toFixed(2)}
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(
                              (item.costoMensual * 100) /
                                item.presupuestoMensual
                            ).toFixed(2)}%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>
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
                            Saldo -{" "}
                            {parseFloat(item.presupuestoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}{" "}
                            - (100%)
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
                            Saldo -{" "}
                            {parseFloat(
                              item.presupuestoMensual - item.costoMensual
                            ).toLocaleString("es-CL", {
                              style: "currency",
                              currency: "CLP",
                            })}{" "}
                            - (
                            {verificarValor(
                              ((item.presupuestoMensual - item.costoMensual) *
                                100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            %)
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
                                  (item.saldoMensual * 100) /
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

                    {/* cant colab */}
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
                        Presupuesto -{" "}
                        {parseFloat(item.presupuestoAcumulado).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}{" "}
                        - (100%)
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
                    {/* costo */}
                    <div
                      style={{
                        width: "100%",
                        marginBottom: "5px",
                        textAlign: "left",
                      }}
                    >
                      <p>
                        Costo -{" "}
                        {verificarValor(
                          parseFloat(item.costoMensual)
                        ).toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}{" "}
                        - (
                        {verificarValor(
                          (item.costoMensual * 100) / item.presupuestoAcumulado
                        ).toFixed(2)}
                        %)
                      </p>
                      <ProgressBar
                        striped
                        now={verificarValor(
                          (item.costoMensual * 100) / item.presupuestoMensual
                        ).toFixed(2)}
                        style={{ height: "15px" }}
                      >
                        <div
                          style={{
                            width: `${verificarValor(
                              (item.costoMensual * 100) /
                                item.presupuestoMensual
                            ).toFixed(2)}%`,
                            height: "100%",
                            backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                          }}
                        />
                      </ProgressBar>
                    </div>
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
                            Saldo -{" "}
                            {parseFloat(item.presupuestoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}{" "}
                            - (100%)
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
                          <p>
                            Saldo -{" "}
                            {parseFloat(item.saldoMensual).toLocaleString(
                              "es-CL",
                              {
                                style: "currency",
                                currency: "CLP",
                              }
                            )}{" "}
                            - (
                            {verificarValor(
                              (item.saldoMensual * 100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            %)
                          </p>
                          <ProgressBar
                            striped
                            now={verificarValor(
                              (item.saldoMensual * 100) /
                                item.presupuestoMensual
                            ).toFixed(2)}
                            style={{ height: "15px" }}
                          >
                            <div
                              style={{
                                width: `${verificarValor(
                                  (item.saldoMensual * 100) /
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
                  </div>
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
                          <b>Cant colab:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantColaboradores
                            ? item.cantColaboradores
                            : "N/A"}
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
                      Presupuesto -{" "}
                      {parseFloat(
                        item.presupuestoMensualMiscelaneo
                      ).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      - (100%)
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

                  {/* costo */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                      textAlign: "left",
                    }}
                  >
                    <p>
                      Costo -{" "}
                      {verificarValor(
                        parseFloat(item.costoMensualMiscelaneo)
                      ).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}{" "}
                      - (
                      {verificarValor(
                        (item.costoMensualMiscelaneo * 100) /
                          item.presupuestoMensualMiscelaneo
                      ).toFixed(2)}
                      %)
                    </p>
                    <ProgressBar
                      striped
                      now={verificarValor(
                        (item.costoMensualMiscelaneo * 100) /
                          item.presupuestoMensualMiscelaneo
                      ).toFixed(2)}
                      style={{ height: "15px" }}
                    >
                      <div
                        style={{
                          width: `${verificarValor(
                            (item.costoMensualMiscelaneo * 100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}%`,
                          height: "100%",
                          backgroundColor: colores.costo[0].datoVisible, // Color dinámico desde el objeto colores
                        }}
                      />
                    </ProgressBar>
                  </div>
                  {/* saldo */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "5px",
                      textAlign: "left",
                    }}
                  >
                    {isNaN(parseFloat(item.saldoMensualMiscelaneo)) &&
                    isNaN(parseFloat(item.costoMensualMiscelaneo)) ? (
                      <>
                        <p>
                          Saldo -{" "}
                          {parseFloat(
                            item.presupuestoMensualMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}{" "}
                          - (100%)
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
                        <p>
                          Saldo -{" "}
                          {parseFloat(
                            item.saldoMensualMiscelaneo
                          ).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}{" "}
                          - (
                          {verificarValor(
                            (item.saldoMensualMiscelaneo * 100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}
                          %)
                        </p>
                        <ProgressBar
                          striped
                          now={verificarValor(
                            (item.saldoMensualMiscelaneo * 100) /
                              item.presupuestoMensualMiscelaneo
                          ).toFixed(2)}
                          style={{ height: "15px" }}
                        >
                          <div
                            style={{
                              width: `${verificarValor(
                                (item.saldoMensualMiscelaneo * 100) /
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
                          <b>Cant colab:</b>
                        </td>
                        <td
                          style={{
                            padding: "5px", // Reducido padding
                            textAlign: "right",
                          }}
                        >
                          {item.cantColaboradores
                            ? item.cantColaboradores
                            : "N/A"}
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
                  <b>Fecha inicio:</b>
                </td>
                <td>{paramsFechaIni}</td>
              </td>
              <td style={{ padding: "10px", textAlign: "left" }}>
                <td style={{ width: "150px" }}>
                  <b>Fecha fin:</b>
                </td>
                <td>{paramsFechaFin}</td>
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
        <EstadoDeMes
          idProyecto={datosProyecto.idEDDProyecto}
          datosMes={datosMes}
          tipoImpugnacion={tipoImpugnacion}
          estadoProyecto={estadoProyecto}
          colores={colores}
        />
      )}
    </>
  );
}
