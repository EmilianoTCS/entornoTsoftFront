import React, { useEffect, useState } from "react";
import "./FormularioLiberacion.css";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import { useParams } from "react-router-dom";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
const OI_FormularioLiberacion = () => {
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [datos, setDatos] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const { idFormulario, idEDDProyEmp } = useParams();

  const obtenerDatos = () => {
    var url = "pages/listados/oi_listadoRespPregForm.php";
    var operationUrl = "oi_listadoRespPregForm";
    var data = {
      idFormulario: idFormulario,
      idEDDProyEmp: idEDDProyEmp,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      if (response) {
        setDatos(response);
      }
    });
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleInputChange = (pregunta, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [pregunta.id]: {
        idPregunta: pregunta.id,
        nomPregunta: pregunta.nomPregunta,
        idRespuesta: pregunta.respuestas[0]?.id || null,
        respuesta: valor,
        tipoResp: "text",
        idEDDProyEmp: idEDDProyEmp,
        usuarioCreacion: userData.usuario,
      },
    }));
  };

  const handleCheckboxChange = (pregunta, respuesta, checked) => {
    setRespuestas((prev) => ({
      ...prev,
      [pregunta.id]: {
        idPregunta: pregunta.id,
        nomPregunta: pregunta.nomPregunta,
        idRespuesta: respuesta.id,
        respuesta: checked ? respuesta.nomRespuesta : "",
        tipoResp: "checkbox",
        usuarioCreacion: userData.usuario,
        idEDDProyEmp: idEDDProyEmp,
      },
    }));
  };

  const handleRadioChange = (pregunta, respuesta) => {
    setRespuestas((prev) => ({
      ...prev,
      [pregunta.id]: {
        idPregunta: pregunta.id,
        nomPregunta: pregunta.nomPregunta,
        idRespuesta: respuesta.id,
        respuesta: respuesta.nomRespuesta,
        tipoResp: "radio",
        usuarioCreacion: userData.usuario,
        idEDDProyEmp: idEDDProyEmp,
      },
    }));
  };

  const handleMatrixChange = (pregunta, fila, columna) => {
    const idRespuestaFila = pregunta.filas.find(
      (f) => f.nomRespuesta === fila
    )?.id;

    setRespuestas((prev) => {
      // Obtener las respuestas existentes o inicializar un array vacío
      const existingResponses = prev[pregunta.id]?.respuestas || [];

      // Encontrar si ya existe una respuesta para esta fila
      const filaIndex = existingResponses.findIndex(
        (resp) => resp.idRespuesta === idRespuestaFila
      );

      // Crear la nueva respuesta
      const newResponse = {
        idPregunta: pregunta.id,
        idRespuesta: idRespuestaFila,
        respuesta: columna,
        usuarioCreacion: userData.usuario,
        idEDDProyEmp: idEDDProyEmp,
      };

      // Actualizar o agregar la respuesta
      let updatedResponses;
      if (filaIndex !== -1) {
        // Si ya existe una respuesta para esta fila, actualizarla
        updatedResponses = existingResponses.map((resp, index) =>
          index === filaIndex ? newResponse : resp
        );
      } else {
        // Si no existe, agregar la nueva respuesta
        updatedResponses = [...existingResponses, newResponse];
      }

      // Retornar el estado actualizado
      return {
        ...prev,
        [pregunta.id]: {
          tipoResp: "matriz",
          respuestas: updatedResponses,
        },
      };
    });
  };

  const procesarDatos = (data) => {
    const headerInfo = {
      nomEmpleado: data[0]?.nomEmpleado || "",
      nomProyecto: data[0]?.nomProyecto || "",
      nomFormulario: data[0]?.nomFormulario || "",
      descFormulario: data[0]?.descFormulario || "",
    };

    const preguntas = data.reduce((acc, item) => {
      if (!item.idPregunta) return acc;

      if (!acc[item.idPregunta]) {
        acc[item.idPregunta] = {
          id: item.idPregunta,
          nomPregunta: item.nomPregunta,
          ordenPregunta: item.ordenPregunta,
          tipoResp: item.tipoResp,
          preguntaObligatoria: item.preguntaObligatoria,
          respuestas: [],
          filas: [],
          columnas: [],
        };
      }

      if (item.tipoResp === "matriz") {
        if (item.tipoMatriz === "FILA") {
          acc[item.idPregunta].filas.push({
            id: item.idRespPreg,
            nomRespuesta: item.nomRespuesta,
          });
        } else if (item.tipoMatriz === "COLUMNA") {
          acc[item.idPregunta].columnas.push({
            id: item.idRespPreg,
            nomRespuesta: item.nomRespuesta,
          });
        }
      } else if (
        item.tipoResp === "checkbox" ||
        item.tipoResp === "radio" ||
        item.nomRespuesta === "<TEXTO>"
      ) {
        acc[item.idPregunta].respuestas.push({
          id: item.idRespPreg,
          nomRespuesta: item.nomRespuesta,
          ordenRespuesta: item.ordenRespuesta,
        });
      }

      return acc;
    }, {});

    return { headerInfo, preguntas };
  };

  const renderizarInput = (pregunta) => {
    switch (pregunta.tipoResp) {
      case "date":
        return (
          <input
            type="date"
            className="form-input"
            required={pregunta.preguntaObligatoria === 1}
            onChange={(e) => handleInputChange(pregunta, e.target.value)}
            value={respuestas[pregunta.id]?.respuesta || ""}
          />
        );

      case "text":
        return (
          <input
            type="text"
            className="form-input"
            required={pregunta.preguntaObligatoria === 1}
            onChange={(e) => handleInputChange(pregunta, e.target.value)}
            value={respuestas[pregunta.id]?.respuesta || ""}
          />
        );

      case "checkbox":
        return (
          <div className="checkbox-group">
            {pregunta.respuestas
              .sort((a, b) => a.ordenRespuesta - b.ordenRespuesta)
              .map((respuesta) => (
                <label key={respuesta.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={
                      respuestas[pregunta.id]?.respuesta ===
                      respuesta.nomRespuesta
                    }
                    onChange={(e) =>
                      handleCheckboxChange(
                        pregunta,
                        respuesta,
                        e.target.checked
                      )
                    }
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    {respuesta.nomRespuesta}
                  </span>
                </label>
              ))}
          </div>
        );

      case "radio":
        return (
          <div className="radio-group">
            {pregunta.respuestas
              .sort((a, b) => a.ordenRespuesta - b.ordenRespuesta)
              .map((respuesta) => (
                <label key={respuesta.id} className="radio-label">
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    checked={
                      respuestas[pregunta.id]?.respuesta ===
                      respuesta.nomRespuesta
                    }
                    onChange={() => handleRadioChange(pregunta, respuesta)}
                    className="radio-input"
                    required={pregunta.preguntaObligatoria === 1}
                  />
                  <span className="radio-text">{respuesta.nomRespuesta}</span>
                </label>
              ))}
          </div>
        );

      case "matriz":
        return (
          <table className="matrix-table">
            <thead>
              <tr>
                <th></th>
                {pregunta.columnas.map((columna) => (
                  <th key={columna.id}>{columna.nomRespuesta}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pregunta.filas.map((fila) => {
                // Encontrar la respuesta existente para esta fila
                const filaRespuesta = respuestas[pregunta.id]?.respuestas?.find(
                  (resp) => resp.idRespuesta === fila.id
                );

                return (
                  <tr key={fila.id}>
                    <td>{fila.nomRespuesta}</td>
                    {pregunta.columnas.map((columna) => (
                      <td key={columna.id}>
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}-${fila.id}`}
                          checked={
                            filaRespuesta?.respuesta === columna.nomRespuesta
                          }
                          onChange={() =>
                            handleMatrixChange(
                              pregunta,
                              fila.nomRespuesta,
                              columna.nomRespuesta
                            )
                          }
                          required={pregunta.preguntaObligatoria === 1}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );

      case "textarea":
        return (
          <textarea
            maxLength={500}
            rows={5}
            style={{ fontSize: "10pt" }}
            className="form-input"
            required={pregunta.preguntaObligatoria === 1}
            onChange={(e) => handleInputChange(pregunta, e.target.value)}
            value={respuestas[pregunta.id]?.respuesta || ""}
          />
        );

      default:
        return null;
    }
  };

  const { headerInfo, preguntas } = procesarDatos(datos);

  const simplifyServerResponse = (response) => {
    for (let i = 0; i < response.length; i++) {
      const result = response[i][0];
      if (result.OUT_CODRESULT !== "00") {
        return {
          ...result,
          index: i, // Agregamos el índice de la consulta que falló
        };
      }
    }
    // Si todas las consultas fueron exitosas, devolvemos un solo objeto de éxito
    return {
      OUT_CODRESULT: "00",
      OUT_MJERESULT: "Success",
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var url = "pages/insertar/oi_insertarRespPregForm.php";
    var operationUrl = "oi_insertarRespPregForm";
    var data = {
      respuestas: respuestas,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const simplifiedResponse = simplifyServerResponse(response);
      TopAlertsError(
        simplifiedResponse.OUT_CODRESULT,
        simplifiedResponse.OUT_MJERESULT
      );
    });
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <header className="card-header">
            <h1 className="form-title">{headerInfo.nomFormulario}</h1>
            <div className="form-info">
              <p>
                <strong>{headerInfo.descFormulario}</strong>
              </p>
              <p>
                <strong>Colaborador:</strong> {headerInfo.nomEmpleado}
              </p>
              <p>
                <strong>Proyecto:</strong> {headerInfo.nomProyecto}
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="form">
            {Object.values(preguntas)
              .sort((a, b) => a.ordenPregunta - b.ordenPregunta)
              .map((pregunta) => (
                <div key={pregunta.id} className="form-group">
                  <label className="form-label">
                    <span className="pregunta-numero">
                      {pregunta.ordenPregunta}.
                    </span>
                    <span className="pregunta-texto">
                      {pregunta.nomPregunta}
                    </span>
                    {pregunta.preguntaObligatoria === "1" && (
                      <span className="required">*</span>
                    )}
                  </label>
                  {renderizarInput(pregunta)}
                </div>
              ))}

            <div className="form-actions">
              <button type="submit" className="submit-button" id="btn_registrar">
                Enviar Formulario
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OI_FormularioLiberacion;
