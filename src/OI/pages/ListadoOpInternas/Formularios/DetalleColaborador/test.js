const objeto = {
  idFormulario: 1,
  nombrePregunta: "pregunta 1",
  ordenPregunta: 1,
  obligatoria: true,
  tipoResp: "checkbox",
  respuestasFila:
    "respuesta 1;'';1;LAST_INSERT_ID()|respuesta 2;'';2;LAST_INSERT_ID()|respuesta 3;'';3;LAST_INSERT_ID()|respuesta 2;'';4;LAST_INSERT_ID()",
  respuestasColumna:
    "respuesta 1;'';1;LAST_INSERT_ID()|respuesta 2;'';2;LAST_INSERT_ID()|respuesta 3;'';3;LAST_INSERT_ID()|respuesta 2;'';4;LAST_INSERT_ID()",
};

if (objeto.tipoResp === "checkbox" || objeto.tipoResp === "radio") {
  const respuestas = objeto.respuestasFila.split("|");
  const respuestasArray = respuestas.map((respuesta) => {
    const respuestaArray = respuesta.split(";");
    return {
      respuesta: respuestaArray[0],
      valor: respuestaArray[1],
      orden: respuestaArray[2],
      idFormulario: respuestaArray[3],
    };
  });

  respuestasArray.map((resp) => {
    console.log("call SP insertar resp", resp);
  });
} else if (objeto.tipoResp === "matriz") {
  const respuestasFila = objeto.respuestasFila.split("|");
  const respuestasArrayFila = respuestasFila.map((respuesta) => {
    const respuestaArrayFila = respuesta.split(";");
    return {
      respuesta: respuestaArrayFila[0],
      valor: respuestaArrayFila[1],
      orden: respuestaArrayFila[2],
      idFormulario: respuestaArrayFila[3],
    };
  });

  respuestasArrayFila.map((resp) => {
    console.log("call SP insertar resp", resp);
  });

  const respuestasColumna = objeto.respuestasColumna.split("|");
  const respuestasArrayColumna = respuestasColumna.map((respuesta) => {
    const respuestaArrayColumna = respuesta.split(";");
    return {
      respuesta: respuestaArrayColumna[0],
      valor: respuestaArrayColumna[1],
      orden: respuestaArrayColumna[2],
      idFormulario: respuestaArrayColumna[3],
    };
  });

  respuestasArrayColumna.map((resp) => {
    console.log("call SP insertar resp", resp);
  });
}else{
    console.log("call SP insertar resp", objeto);
}
