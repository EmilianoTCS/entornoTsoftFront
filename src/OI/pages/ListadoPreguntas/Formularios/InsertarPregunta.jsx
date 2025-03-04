import { useState, useEffect } from "react";
import "../ListadoPreguntas.css";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InsertarPregunta({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    nomPregunta: "",
    ordenPregunta: "",
    tipoResp: "",
    preguntaObligatoria: "",
    idFormulario: "",
    respuestaFila: "",
    respuestaColumna: "",
    isActive: 1,
    usuarioCreacion: userData?.usuario || "",
  });

  // Estados para los inputs de respuestas
  const [respuesta, setRespuesta] = useState("");
  const [ordenRespuesta, setOrdenRespuesta] = useState(""); // Solo para radios/checkboxes
  const [fila, setFila] = useState("");
  const [ordenFila, setOrdenFila] = useState(""); // Solo para filas de matriz
  const [columna, setColumna] = useState("");
  const [ordenColumna, setOrdenColumna] = useState(""); // Solo para columnas de matriz

  // Estados para las listas de respuestas
  const [listaRespuestas, setListaRespuestas] = useState([]);
  const [listaFilas, setListaFilas] = useState([]);
  const [listaColumnas, setListaColumnas] = useState([]);

  const [auxList, setAuxList] = useState({
    listadoTipoResp: [""],
    listadoFormularios: [""],
  });

  const obtenerConfDatos = () => {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "OI",
      subTipoConfDato: "TIPO_RESP",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setAuxList({
        listadoTipoResp: response,
      });
    });
  };

  const obtenerFormularios = () => {
    var url = "pages/listados/oi_listadoFormulario.php";
    var operationUrl = "oi_listadoFormulario";
    var data = {
      num_boton: 1,
      cantidadPorPagina: 999999999,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      const { paginador, ...datos } = data;
      setAuxList((prev) => ({
        ...prev,
        listadoFormularios: datos.datos,
      }));
    });
  };

  const Validaciones = () => {
    if (!datos.nomPregunta.trim()) {
      TopAlertsError("01", "La pregunta no puede estar vacía");
      return true;
    }
    if (!datos.ordenPregunta || datos.ordenPregunta < 1) {
      TopAlertsError("02", "El orden de la pregunta debe ser mayor a cero");
      return true;
    }
    if (!datos.tipoResp) {
      TopAlertsError("03", "Debe seleccionar un tipo de respuesta");
      return true;
    }
    if (!datos.idFormulario) {
      TopAlertsError("04", "Debe seleccionar un formulario");
      return true;
    }
    if (datos.preguntaObligatoria === "") {
      TopAlertsError("05", "Debe indicar si la pregunta es obligatoria");
      return true;
    }

    // Validación específica para tipos que requieren respuestas
    const tipoResp = datos.tipoResp.toLowerCase().trim();
    if (
      (tipoResp === "radio" || tipoResp === "checkbox") &&
      listaRespuestas.length === 0
    ) {
      TopAlertsError("06", "Debe ingresar al menos una opción de respuesta");
      return true;
    }
    if (
      tipoResp === "matriz" &&
      (listaFilas.length === 0 || listaColumnas.length === 0)
    ) {
      TopAlertsError("07", "Debe ingresar al menos una fila y una columna");
      return true;
    }

    return false;
  };

  function SendData(e) {
    e.preventDefault();
    if (Validaciones()) {
      return;
    }
    // Actualizar formatos de respuesta antes de enviar
    actualizarFormatoRespuestas();

    const url = "pages/insertar/oi_insertarPregunta.php";
    const operationUrl = "oi_insertarPregunta";
    var data = {
      nomPregunta: datos.nomPregunta,
      ordenPregunta: datos.ordenPregunta,
      tipoResp: datos.tipoResp,
      preguntaObligatoria: datos.preguntaObligatoria,
      idFormulario: datos.idFormulario,
      respuestaFila: datos.respuestaFila,
      respuestaColumna: datos.respuestaColumna,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      if (OUT_CODRESULT === "00") {
        handleClose();
      }
    });
  }

  useEffect(() => {
    obtenerFormularios();
    obtenerConfDatos();
  }, [isActive]);

  // Efecto para configurar respuestaFila para tipos texto, fecha y textarea
  useEffect(() => {
    const tipoResp = datos.tipoResp.toLowerCase().trim();
    if (tipoResp === "text" || tipoResp === "date" || tipoResp === "textarea") {
      setDatos((prev) => ({
        ...prev,
        respuestaFila: "<TEXTO>;'';1",
      }));
    }

    // Limpiar campos de respuesta al cambiar el tipo de respuesta
    setRespuesta("");
    setOrdenRespuesta("");
    setFila("");
    setOrdenFila("");
    setColumna("");
    setOrdenColumna("");
    setListaRespuestas([]);
    setListaFilas([]);
    setListaColumnas([]);
  }, [datos.tipoResp]);

  // Funciones para manejar respuestas, filas y columnas
  const agregarRespuesta = () => {
    if (!respuesta.trim() || !ordenRespuesta.trim()) {
      TopAlertsError("08", "Debe ingresar la respuesta y el orden");
      return;
    }

    const nuevaRespuesta = {
      texto: respuesta,
      orden: Number.parseInt(ordenRespuesta),
      id: Date.now(),
    };

    const nuevasRespuestas = [...listaRespuestas, nuevaRespuesta];
    setListaRespuestas(nuevasRespuestas);
    actualizarDatosRespuesta(nuevasRespuestas);

    // Limpiar campos
    setRespuesta("");
    setOrdenRespuesta("");
  };

  const agregarFila = () => {
    if (!fila.trim() || !ordenFila.trim()) {
      TopAlertsError("09", "Debe ingresar la fila y el orden");
      return;
    }

    const nuevaFila = {
      texto: fila,
      orden: Number.parseInt(ordenFila),
      id: Date.now(),
    };

    const nuevasFilas = [...listaFilas, nuevaFila];
    setListaFilas(nuevasFilas);
    actualizarDatosFilas(nuevasFilas);

    // Limpiar campos
    setFila("");
    setOrdenFila("");
  };

  const agregarColumna = () => {
    if (!columna.trim() || !ordenColumna.trim()) {
      TopAlertsError("10", "Debe ingresar la columna y el orden");
      return;
    }

    const nuevaColumna = {
      texto: columna,
      orden: Number.parseInt(ordenColumna),
      id: Date.now(),
    };

    const nuevasColumnas = [...listaColumnas, nuevaColumna];
    setListaColumnas(nuevasColumnas);
    actualizarDatosColumnas(nuevasColumnas);

    // Limpiar campos
    setColumna("");
    setOrdenColumna("");
  };

  const eliminarRespuesta = (id) => {
    const nuevasRespuestas = listaRespuestas.filter((resp) => resp.id !== id);
    setListaRespuestas(nuevasRespuestas);
    actualizarDatosRespuesta(nuevasRespuestas);
  };

  const eliminarFila = (id) => {
    const nuevasFilas = listaFilas.filter((f) => f.id !== id);
    setListaFilas(nuevasFilas);
    actualizarDatosFilas(nuevasFilas);
  };

  const eliminarColumna = (id) => {
    const nuevasColumnas = listaColumnas.filter((c) => c.id !== id);
    setListaColumnas(nuevasColumnas);
    actualizarDatosColumnas(nuevasColumnas);
  };

  // Funciones para actualizar los formatos de respuesta
  const actualizarDatosRespuesta = (lista) => {
    if (lista.length === 0) {
      setDatos((prev) => ({ ...prev, respuestaFila: "" }));
      return;
    }

    // Ordenar por el campo orden
    const listaOrdenada = [...lista].sort((a, b) => a.orden - b.orden);
    const respuestasFormateadas = listaOrdenada
      .map((item) => `${item.texto};'';${item.orden}`)
      .join("|");
    setDatos((prev) => ({ ...prev, respuestaFila: respuestasFormateadas }));
  };

  const actualizarDatosFilas = (lista) => {
    if (lista.length === 0) {
      setDatos((prev) => ({ ...prev, respuestaFila: "" }));
      return;
    }

    // Ordenar por el campo orden
    const listaOrdenada = [...lista].sort((a, b) => a.orden - b.orden);
    const filasFormateadas = listaOrdenada
      .map((item) => `${item.texto};''FILA'';${item.orden}`)
      .join("|");
    setDatos((prev) => ({ ...prev, respuestaFila: filasFormateadas }));
  };

  const actualizarDatosColumnas = (lista) => {
    if (lista.length === 0) {
      setDatos((prev) => ({ ...prev, respuestaColumna: "" }));
      return;
    }

    // Ordenar por el campo orden
    const listaOrdenada = [...lista].sort((a, b) => a.orden - b.orden);
    const columnasFormateadas = listaOrdenada
      .map((item) => `${item.texto};''COLUMNA'';${item.orden}`)
      .join("|");
    setDatos((prev) => ({ ...prev, respuestaColumna: columnasFormateadas }));
  };

  // Función para asegurar que los formatos de respuesta estén actualizados antes de enviar
  const actualizarFormatoRespuestas = () => {
    const tipoResp = datos.tipoResp.toLowerCase().trim();

    if (tipoResp === "radio" || tipoResp === "checkbox") {
      actualizarDatosRespuesta(listaRespuestas);
    } else if (tipoResp === "matriz") {
      actualizarDatosFilas(listaFilas);
      actualizarDatosColumnas(listaColumnas);
    } else if (
      tipoResp === "text" ||
      tipoResp === "date" ||
      tipoResp === "textarea"
    ) {
      setDatos((prev) => ({
        ...prev,
        respuestaFila: "<TEXTO>;'';1",
      }));
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size={
          datos.tipoResp.toLowerCase() === "matriz"
            ? "xl"
            : datos.tipoResp.toLowerCase() === "radio" ||
              datos.tipoResp.toLowerCase() === "checkbox"
            ? "lg"
            : "md"
        }
      >
        <Modal.Header closeButton style={{ borderBottom: "1px solid #dee2e6" }}>
          <Modal.Title>Crear pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="row">
              <div
                className={`col-md-${
                  datos.tipoResp === "" ||
                  datos.tipoResp === "date" ||
                  datos.tipoResp === "textarea" ||
                  datos.tipoResp === "text"
                    ? "12"
                    : datos.tipoResp.toLowerCase() === "matriz"
                    ? "4"
                    : "6"
                }`}
              >
                <div className="form-group">
                  <label htmlFor="input_Formulario">
                    Seleccione un formulario:{" "}
                  </label>
                  <select
                    required
                    className="form-control"
                    onChange={({ target }) =>
                      setDatos((prevDatos) => ({
                        ...prevDatos,
                        idFormulario: target.value,
                      }))
                    }
                    value={datos.idFormulario}
                  >
                    <option hidden value="">
                      Desplegar lista
                    </option>
                    {auxList.listadoFormularios?.map((valor, index) => (
                      <option key={index} value={valor.idFormulario}>
                        {valor.nomFormulario}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="input_Pregunta">Ingrese la pregunta</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={({ target }) =>
                      setDatos((prevDatos) => ({
                        ...prevDatos,
                        nomPregunta: target.value,
                      }))
                    }
                    value={datos.nomPregunta}
                    required
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                  className="form-group"
                >
                  <div style={{ width: "50%" }}>
                    <label>Orden:</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      onChange={({ target }) =>
                        setDatos((prevDatos) => ({
                          ...prevDatos,
                          ordenPregunta: target.value,
                        }))
                      }
                      value={datos.ordenPregunta}
                      max={100}
                      required
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <label>Obligatoria:</label>
                    <select
                      className="form-control"
                      onChange={({ target }) => {
                        setDatos((prevDatos) => ({
                          ...prevDatos,
                          preguntaObligatoria: target.value,
                        }));
                      }}
                      value={datos.preguntaObligatoria}
                      required
                    >
                      <option hidden value="">
                        Desplegar lista
                      </option>
                      <option value={1}>SÍ</option>
                      <option value={0}>NO</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="input_TipoResp">
                    Seleccione un tipo de respuesta:{" "}
                  </label>
                  <select
                    required
                    className="form-control"
                    onChange={({ target }) =>
                      setDatos((prevDatos) => ({
                        ...prevDatos,
                        tipoResp: target.value,
                        respuestaFila: "",
                        respuestaColumna: "",
                      }))
                    }
                    value={datos.tipoResp}
                  >
                    <option hidden value="">
                      Desplegar lista
                    </option>
                    {auxList.listadoTipoResp?.map((valor, index) => (
                      <option key={index} value={valor.datoNoVisible}>
                        {valor.datoVisible}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Columna para los campos de respuesta */}
              {datos.tipoResp && (
                <>
                  <div
                    className={`col-md-${
                      datos.tipoResp.toLowerCase() === "matriz" ? "4" : "6"
                    }`}
                    style={{
                      borderLeft: "1px solid #dee2e6",
                      paddingLeft: "20px",
                    }}
                  >
                    {datos.tipoResp.toLowerCase() === "matriz" ? (
                      <div className="form-group">
                        <h5>Filas</h5>
                        <div className="form-group">
                          <label htmlFor="input_Fila">Ingrese una fila</label>
                          <input
                            type="text"
                            className="form-control"
                            value={fila}
                            onChange={(e) => setFila(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="input_OrdenFila">
                            Ingrese el orden
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={ordenFila}
                            onChange={(e) => setOrdenFila(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="form-group">
                          <Button
                            variant="secondary"
                            onClick={agregarFila}
                            size="sm"
                          >
                            Agregar Fila
                          </Button>
                        </div>
                        <div className="form-group mt-3">
                          <div
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
                            <table className="table table-striped table-sm text-center">
                              <thead>
                                <tr>
                                  <th>Orden</th>
                                  <th>Fila</th>
                                  <th>Quitar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {listaFilas.length > 0 ? (
                                  listaFilas
                                    .sort((a, b) => a.orden - b.orden)
                                    .map((item) => (
                                      <tr key={item.id}>
                                        <td>{item.orden}</td>
                                        <td
                                          className="td_con_hover"
                                          title={item.texto}
                                        >
                                          {item.texto}
                                        </td>
                                        <td>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                              eliminarFila(item.id)
                                            }
                                          >
                                            Eliminar
                                          </Button>
                                        </td>
                                      </tr>
                                    ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="text-center">
                                      No hay filas agregadas
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : datos.tipoResp.toLowerCase() === "radio" ||
                      datos.tipoResp.toLowerCase() === "checkbox" ? (
                      <div className="form-group">
                        <div className="form-group">
                          <label htmlFor="input_Respuesta">
                            Ingrese la respuesta
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="input_OrdenResp">
                            Ingrese el orden
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={ordenRespuesta}
                            onChange={(e) => setOrdenRespuesta(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="form-group">
                          <Button
                            variant="secondary"
                            onClick={agregarRespuesta}
                            size="sm"
                          >
                            Agregar Respuesta
                          </Button>
                        </div>
                        <div className="form-group mt-3">
                          <div
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
                            <table className="table table-striped table-sm text-center">
                              <thead>
                                <tr>
                                  <th>Orden</th>
                                  <th>Respuesta</th>
                                  <th>Quitar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {listaRespuestas.length > 0 ? (
                                  listaRespuestas
                                    .sort((a, b) => a.orden - b.orden)
                                    .map((item) => (
                                      <tr key={item.id}>
                                        <td>{item.orden}</td>
                                        <td
                                          className="td_con_hover"
                                          title={item.texto}
                                        >
                                          {item.texto}
                                        </td>
                                        <td>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                              eliminarRespuesta(item.id)
                                            }
                                          >
                                            Eliminar
                                          </Button>
                                        </td>
                                      </tr>
                                    ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="text-center">
                                      No hay respuestas agregadas
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Si es matriz muestra la columna */}
                  {datos.tipoResp.toLowerCase() === "matriz" && (
                    <div
                      className="col-md-4"
                      style={{
                        borderLeft: "1px solid #dee2e6",
                        paddingLeft: "20px",
                      }}
                    >
                      <div className="form-group">
                        <h5>Columnas</h5>
                        <div className="form-group">
                          <label htmlFor="input_Columna">
                            Ingrese una columna
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={columna}
                            onChange={(e) => setColumna(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="input_OrdenColumna">
                            Ingrese el orden
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={ordenColumna}
                            onChange={(e) => setOrdenColumna(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div className="form-group">
                          <Button
                            variant="secondary"
                            onClick={agregarColumna}
                            size="sm"
                          >
                            Agregar Columna
                          </Button>
                        </div>
                        <div className="form-group mt-3">
                          <div
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
                            <table className="table table-striped table-sm text-center">
                              <thead>
                                <tr>
                                  <th>Orden</th>
                                  <th>Columna</th>
                                  <th>Quitar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {listaColumnas.length > 0 ? (
                                  listaColumnas
                                    .sort((a, b) => a.orden - b.orden)
                                    .map((item) => (
                                      <tr key={item.id}>
                                        <td>{item.orden}</td>
                                        <td
                                          className="td_con_hover"
                                          title={item.texto}
                                        >
                                          {item.texto}
                                        </td>
                                        <td>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                              eliminarColumna(item.id)
                                            }
                                          >
                                            Eliminar
                                          </Button>
                                        </td>
                                      </tr>
                                    ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="text-center">
                                      No hay columnas agregadas
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <hr style={{ margin: "20px 0" }} />
            <div className="text-center mt-4">
              <Button
                variant="primary"
                type="submit"
                id="btn_registrar"
                style={{ marginRight: "10px" }}
              >
                Registrar
              </Button>
              <Button
                variant="secondary"
                id="btn_registrar"
                onClick={handleClose}
                style={{ marginRight: "10px", backgroundColor: "gray" }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
