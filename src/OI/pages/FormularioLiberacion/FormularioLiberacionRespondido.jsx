import React, { useEffect, useState } from "react";
import "./FormularioLiberacion.css";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import { useParams } from "react-router-dom";

const OI_FormularioLiberacionRespondido = () => {
  const [datos, setDatos] = useState([]);
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

  const procesarDatos = (data) => {
    const headerInfo = {
      nomEmpleado: data[0]?.nomEmpleado || "",
      nomProyecto: data[0]?.nomProyecto || "",
      nomFormulario: data[0]?.nomFormulario || "",
      descFormulario: data[0]?.descFormulario || "",
    };
  
    const preguntas = data.reduce((acc, item) => {
      if (!item.idPregunta) return acc;
  
      // Inicializar la pregunta si no existe
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
          respuestaPrecargada: ""
        };
      }
  
      // Actualizar la respuesta precargada si existe en el item actual
      if (item.respuesta) {
        acc[item.idPregunta].respuestaPrecargada = item.respuesta;
      }
  
      // Procesar según el tipo de respuesta
      if (item.tipoResp === "matriz") {
        if (item.tipoMatriz === "FILA") {
          // Para matrices, guardamos la respuesta por cada fila
          acc[item.idPregunta].filas.push({
            id: item.idRespPreg,
            nomRespuesta: item.nomRespuesta,
            respuestaPrecargada: item.respuesta || ""
          });
        } else if (item.tipoMatriz === "COLUMNA") {
          acc[item.idPregunta].columnas.push({
            id: item.idRespPreg,
            nomRespuesta: item.nomRespuesta
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
          ordenRespuesta: item.ordenRespuesta
        });
      }
  
      return acc;
    }, {});
  
    // Después de procesar todos los items, marcamos las respuestas seleccionadas
    Object.values(preguntas).forEach(pregunta => {
      if (pregunta.tipoResp === "checkbox" || pregunta.tipoResp === "radio") {
        pregunta.respuestas = pregunta.respuestas.map(respuesta => ({
          ...respuesta,
          isSelected: respuesta.nomRespuesta === pregunta.respuestaPrecargada
        }));
      }
    });
  
    return { headerInfo, preguntas };
  };

  const renderizarInput = (pregunta) => {
    switch (pregunta.tipoResp) {
      case "date":
      case "text":
        return (
          <input
            type={pregunta.tipoResp}
            className="form-input"
            value={pregunta.respuestaPrecargada || ""}
            disabled
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
                    checked={respuesta.isSelected}
                    disabled
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">{respuesta.nomRespuesta}</span>
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
                    checked={respuesta.isSelected}
                    disabled
                    className="radio-input"
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
              {pregunta.filas.map((fila) => (
                <tr key={fila.id}>
                  <td>{fila.nomRespuesta}</td>
                  {pregunta.columnas.map((columna) => (
                    <td key={columna.id}>
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}-${fila.id}`}
                        checked={fila.respuestaPrecargada === columna.nomRespuesta}
                        disabled
                      />
                    </td>
                  ))}
                </tr>
              ))}
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
            value={pregunta.respuestaPrecargada || ""}
            disabled
          />
        );
  
      default:
        return null;
    }
  };

  const { headerInfo, preguntas } = procesarDatos(datos);

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

          <div className="form">
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
                  </label>
                  {renderizarInput(pregunta)}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OI_FormularioLiberacionRespondido;