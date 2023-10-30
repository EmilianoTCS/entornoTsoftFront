import React, { useEffect, useState } from "react";
import Header from "../../../templates/Header/Header";
import SendDataService from "../../../services/SendDataService";
import Card from "react-bootstrap/Card";
import { Navigate } from "react-router-dom";
import "./homeEDD.css";
import { useRoute } from "wouter";

export default function AlertOpoDes() {
  const [, params] = useRoute("/AlertasOporDes/:idEvaluacion/:nomEvaluacion/:tipoEvaluacion/:idEDDProyecto/:cicloEvaluacion");

  const idEDDEvaluacion = params.idEvaluacion;
  const nomEvaluacion = decodeURI(params.nomEvaluacion);
  const tipoEvaluacion = params.tipoEvaluacion;
  const idEDDProyecto = params.idEDDProyecto;
  const cicloEvaluacion = params.cicloEvaluacion;


  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [listResumenEval, setListResumenEval] = useState("");
  const [listCompetencias, setListCompetencias] = useState([""]);
  const [listConfigCompColorFlechas, setListConfigCompColorFlechas] =
    useState("");
  const [listConfigCompRangoFlechas, setListConfigCompRangoFlechas] =
    useState("");

  //CONFIGURACIONES PARA DESTACABLES
  const [ConfigDestColabTsoft, setConfigDestColabTsoft] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigDestColab, setConfigDestColab] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigDestRef, setConfigDestRef] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });

  //CONFIGURACIONES PARA OPORTUNIDADES
  const [ConfigOportColabTsoft, setConfigOportColabTsoft] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigOportColab, setConfigOportColab] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigOportRef, setConfigOportRef] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });

  //CONFIGURACIONES PARA ALERTAS
  const [ConfigAlertasColabTsoft, setConfigAlertasColabTsoft] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigAlertasColab, setConfigAlertasColab] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigAlertasRef, setConfigAlertasRef] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });
  const [ConfigAlertasDifRango, setConfigAlertasDifRango] = useState({
    datoVisible: "",
    datoNoVisible: "",
  });

  //BANDERAS PARA CONFIMAR EL RECIBIMIENTO DE DATOS
  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataCompetencias, setLoadedDataCompetencias] = useState(false);
  const [loadedDataConfigRef, setLoadedDataConfigRef] = useState(false);




  // ---------------------  DECLARACIÓN DE FUNCIONES  ---------------------

  //Obtiene los datos del SP RESUMEN EVAL
  function GetDataResumenEval() {
    var url = "pages/listados/listadoResumenEval.php";
    var operationUrl = "listadoResumenEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idProyecto:idEDDProyecto,
      cicloEvaluacion:cicloEvaluacion

    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListResumenEval(data);
      setLoadedDataResumenEval(true);
    });
  }
  //Obtiene los datos del SP COMPETENCIAS EVAL

  function GetDataCompetencias() {
    var url = "pages/listados/listadoCompetenciasEval.php";
    var operationUrl = "listadoCompetenciasEval";
    var data = {
      idEvaluacion: idEDDEvaluacion,
      idProyecto:idEDDProyecto,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListCompetencias(data);
      setLoadedDataCompetencias(true);
      // console.log(data);
    });
  }

  //Obtiene los datos de la configuración de estilos para las flechas

  function GetConfigCompColorFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_COLOR",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompColorFlechas(data);
      // console.log("configColor", data);
    });
  }

  function GetConfigCompRangoFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_FLECHA",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompRangoFlechas(data);
      // console.log("configRango", data);
    });
  }
  //-----------------------------------

  //OBTIENE LOS DATOS DE CONFIGURACIÓN PARA ESTADÍSTICAS DE DESTACABLES, OPORTUNIDADES Y ALERTAS
  function GetConfigDestacables() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "DESTACABLE",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      // console.log("configReferentesDest", data);
      data.map((item) => {
        switch (item.subTipoConfDato) {
          case "TSOFT":
            setConfigDestColabTsoft({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "REFERENTE":
            setConfigDestRef({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "COLABORADOR":
            setConfigDestColab({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          default:
            break;
        }
      });

      // console.log("ConfigDestColabTsoft", ConfigDestColabTsoft);
      // console.log("ConfigDestColab", ConfigDestColab);
      // console.log("ConfigDestRef", ConfigDestRef);
    });
  }
  function GetConfigOportunidades() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "OPORTUNIDAD",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      data.map((item) => {
        switch (item.subTipoConfDato) {
          case "TSOFT":
            setConfigOportColabTsoft({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "REFERENTE":
            setConfigOportRef({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "COLABORADOR":
            setConfigOportColab({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          default:
            break;
        }
      });

      // console.log("ConfigOportColabTsoft", ConfigOportColabTsoft);
      // console.log("ConfigOportColab", ConfigOportColab);
      // console.log("ConfigOportRef", ConfigOportRef);
    });
  }
  function GetConfigAlertas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "ALERTA",
      subTipoConfDato: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      // console.log("configReferentesDest", data);
      data.map((item) => {
        switch (item.subTipoConfDato) {
          case "TSOFT":
            setConfigAlertasColabTsoft({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "REFERENTE":
            setConfigAlertasRef({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          case "COLABORADOR":
            setConfigAlertasColab({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
          case "DIF_RANGO":
            setConfigAlertasDifRango({
              datoVisible: item.datoVisible,
              datoNoVisible: item.datoNoVisible,
            });
            break;
          default:
            break;
        }
      });

      // console.log("ConfigDestColabTsoft", ConfigDestColabTsoft);
      // console.log("ConfigDestColab", ConfigDestColab);
      // console.log("ConfigDestRef", ConfigDestRef);
    });
  }
  //-----------------------------------

  //FUNCIONES NUEVAS DASHBOARD

  //------------- DESTACABLES -------------

  // REFERENTE
  function DestacablesReferentesTemplate() {
    if (tipoEvaluacion === "REFERENTE") {
      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {

        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigDestRef.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card style={{ backgroundColor: ConfigDestRef.datoVisible }}>
                    <Card.Body>
                      <Card.Text className="letraAlertas">Referentes</Card.Text>
                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;
    }
  }
  // COLABORADOR
  function DestacablesColaboradoresTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {
      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {
        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigDestColab.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card style={{ backgroundColor: ConfigDestColab.datoVisible }}>
                    <Card.Body >
                      <Card.Text className="letraAlertas">Colaboradores</Card.Text>

                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;
    }
  }
  function DestacablesColaboradoresTsoftTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {
      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {
        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigDestColabTsoft.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card
                    style={{ backgroundColor: ConfigDestColabTsoft.datoVisible }}
                  >
                    <Card.Body >
                      <Card.Text className="letraAlertas">
                        Colaboradores Tsoft
                      </Card.Text>

                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;

    }
  }

  //------------- OPORTUNIDADES -------------

  // REFERENTE
  function OportunidadesReferentesTemplate() {
    if (tipoEvaluacion === "REFERENTE") {

      // Crear un array para almacenar los componentes renderizados
      const render = [];
      // Crear un array para almacenar las competencias
      var competencias = [];

      // Variable para rastrear el empleado actual
      let auxEvaluado = "";

      // Recorrer el array datosRef utilizando forEach
      listCompetencias.forEach((item, index) => {
        // Comprobar si es el primer elemento del array
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }

        // Comprobar si el empleado ha cambiado o es el último elemento
        if (auxEvaluado !== item.nomEmpleado || index === listCompetencias.length - 1) {
          // Comprobar si hay competencias en el array competencias
          if (competencias.length > 0) {
            // Agregar un componente Card al array render
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card style={{ backgroundColor: ConfigOportRef.datoVisible }}>
                    <Card.Body >
                      <Card.Text className="letra">
                        Referentes con oportunidad de mejora:
                      </Card.Text>
                      <Card.Text className="letraCompetencias">
                        {competencias.slice() // Crear una copia del arreglo original para no modificarlo directamente
                          .sort() // Ordenar alfabéticamente
                          .map((competencia, index) => (
                            <span key={index} style={{ textAlign: 'left' }}>
                              {competencia}
                              <br /> {/* Agregar un salto de línea */}
                            </span>
                          ))}
                      </Card.Text>
                      <Card.Text className="letra"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Actualizar la variable auxEvaluado
          auxEvaluado = item.nomEmpleado;
          // Reiniciar el array competencias
          competencias = [];

          // Comprobar si la competencia cumple con el criterio
          if (eval(item.porcAprobComp + ConfigOportRef.datoNoVisible)) {
            competencias.push("\n - " + item.nomCompetencia + "\n");
          }
        } else if (eval(item.porcAprobComp + ConfigOportRef.datoNoVisible)) {
          // Agregar la competencia al array competencias si cumple con el criterio
          competencias.push("\n - " + item.nomCompetencia + "\n");
        }

        // Actualizar la variable auxEvaluado para el próximo ciclo
        auxEvaluado = item.nomEmpleado;
      });

      // Devolver el array de componentes renderizados
      return render;
    }
  }
  // COLABORADOR
  function OportunidadesColaboradoresTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {

      // Crear un array para almacenar los componentes renderizados
      const render = [];
      // Crear un array para almacenar las competencias
      var competencias = [];

      // Variable para rastrear el colaborador actual
      let auxEvaluado = "";

      // Recorrer el array datosColaborador utilizando forEach
      listCompetencias.forEach((item, index) => {
        // Comprobar si es el primer elemento del array
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }

        // Comprobar si el colaborador ha cambiado o es el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Comprobar si hay competencias en el array competencias
          if (competencias.length > 0) {
            // Agregar un componente Card al array render
            render.push(
              <div key={index}>
                <div> <br />

                  <Card style={{ backgroundColor: ConfigOportColab.datoVisible }}>
                    <Card.Body>
                      <Card.Text className="letra">
                        Colaboradores con oportunidad de mejora:
                      </Card.Text>
                      <Card.Text className="letraCompetencias">
                        {competencias
                          .slice() // Crear una copia del arreglo original para no modificarlo directamente
                          .sort() // Ordenar alfabéticamente
                          .map((competencia, index) => (
                            <span key={index}>
                              {competencia}
                              <br /> {/* Agregar un salto de línea */}
                            </span>
                          ))}
                      </Card.Text>
                      <Card.Text className="letra"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Actualizar la variable auxEvaluado
          auxEvaluado = item.nomEmpleado;
          // Reiniciar el array competencias
          competencias = [];

          // Comprobar si la competencia cumple con el criterio
          if (eval(item.porcAprobComp + ConfigOportColab.datoNoVisible)) {
            competencias.push("\n - " + item.nomCompetencia + "\n");
          }
        } else if (eval(item.porcAprobComp + ConfigOportColab.datoNoVisible)) {
          // Agregar la competencia al array competencias si cumple con el criterio
          competencias.push("\n - " + item.nomCompetencia + "\n");
        }

        // Actualizar la variable auxEvaluado para el próximo ciclo
        auxEvaluado = item.nomEmpleado;
      });

      // Devolver el array de componentes renderizados
      return render;
    }
  }
  function OportunidadesColaboradoresTsoftTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {

      // Crear un array para almacenar los componentes renderizados
      const render = [];
      // Crear un array para almacenar las competencias
      var competencias = [];

      // Variables para rastrear el colaborador actual, el contador de registros y el total del porcentaje
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Recorrer el array datosColaboradorTsoft utilizando forEach
      listCompetencias.forEach((item, index) => {
        // Comprobar si es el primer elemento del array
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }

        // Comprobar si el colaborador ha cambiado o es el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Comprobar si hay competencias en el array competencias
          if (competencias.length > 0) {
            // Agregar un componente Card al array render
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card
                    style={{ backgroundColor: ConfigOportColabTsoft.datoVisible }}
                  >
                    <Card.Body >
                      <Card.Text className="letra">
                        Colaboradores Tsoft con oportunidad de mejora:
                      </Card.Text>
                      <Card.Text className="letraCompetencias">
                        {competencias
                          .slice() // Crear una copia del arreglo original para no modificarlo directamente
                          .sort() // Ordenar alfabéticamente
                          .map((competencia, index) => (
                            <span key={index}>
                              {competencia}
                              <br /> {/* Agregar un salto de línea */}
                            </span>
                          ))}
                      </Card.Text>
                      <Card.Text className="letra"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Actualizar la variable auxEvaluado
          auxEvaluado = item.nomEmpleado;
          // Reiniciar el array competencias
          competencias = [];

          // Comprobar si la competencia cumple con el criterio
          if (eval(item.porcAprobComp + ConfigOportColabTsoft.datoNoVisible)) {
            competencias.push("\n - " + item.nomCompetencia + "\n");
          }

          // Reiniciar el contador de registros y el total del porcentaje
          contReg = 0;
          totalPorc = 0;
        } else if (
          eval(item.porcAprobComp + ConfigOportColabTsoft.datoNoVisible)
        ) {
          // Agregar la competencia al array competencias si cumple con el criterio
          competencias.push("\n - " + item.nomCompetencia + "\n");
        }

        // Actualizar el total del porcentaje y el contador de registros
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;

        // Actualizar la variable auxEvaluado para el próximo ciclo
        auxEvaluado = item.nomEmpleado;
      });

      // Devolver el array de componentes renderizados
      return render;
    }
  }

  //------------- ALERTAS -------------

  // REFERENTE
  function AlertasReferentesTemplate() {
    if (tipoEvaluacion === "REFERENTE") {

      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {
        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (auxEvaluado !== item.nomEmpleado || index === listCompetencias.length - 1) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigAlertasRef.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card style={{ backgroundColor: ConfigAlertasRef.datoVisible }}>
                    <Card.Body style={{ color: 'white' }} >
                      <Card.Text className="letraAlertas">Referentes</Card.Text>
                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;
    }
  }
  // COLABORADOR
  function AlertasColaboradoresTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {

      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {
        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigAlertasColab.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card
                    style={{ backgroundColor: ConfigAlertasColab.datoVisible }}
                  >
                    <Card.Body >
                      <Card.Text className="letraAlertas">Colaboradores</Card.Text>

                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>      <br></br>

                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;
    }
  }
  function AlertasColaboradoresTsoftTemplate() {
    if (tipoEvaluacion === "COLABORADOR") {

      // Array donde almacenaremos los elementos a renderizar
      const render = [];

      // Variables para el seguimiento del empleado actual y el cálculo de promedios
      let auxEvaluado = "";
      let contReg = 0;
      let totalPorc = 0;

      // Iteramos a través de los datos
      listCompetencias.forEach((item, index) => {
        // Si es el primer elemento, asignamos el nombre del empleado actual
        if (index === 0) {
          auxEvaluado = item.nomEmpleado;
        }
        // Comprobamos si el empleado cambió o si estamos en el último elemento
        if (
          auxEvaluado !== item.nomEmpleado ||
          index === listCompetencias.length - 1
        ) {
          // Calculamos el promedio de porcentaje
          const promedioPorc = totalPorc / contReg;

          // Si el promedio es mayor o igual a 90, agregamos un elemento al array render
          if (eval(promedioPorc + ConfigAlertasColabTsoft.datoNoVisible)) {
            render.push(
              <div key={index} >
                <div >      <br></br>

                  <Card
                    style={{
                      backgroundColor: ConfigAlertasColabTsoft.datoVisible,
                    }}
                  >
                    <Card.Body >
                      <Card.Text className="letraAlertas">
                        Colaboradores Tsoft
                      </Card.Text>

                      <Card.Title className="letraAlertas">
                        {promedioPorc.toFixed(2)}%
                      </Card.Title>
                      <Card.Text className="letraAlertas"><strong>{auxEvaluado}</strong></Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          }

          // Reiniciamos variables para el siguiente empleado
          auxEvaluado = item.nomEmpleado;
          contReg = 0;
          totalPorc = 0;
        }

        // Sumamos el porcentaje actual y aumentamos el contador
        totalPorc += parseFloat(item.porcAprobComp);
        contReg++;
      });

      // Devolvemos el array con los elementos renderizados
      return render;
    }
  }

  //------------- COMPLEMENTARIAS -------------

  function PorcCompMenorTemplate() {
    // Array donde almacenaremos los elementos a renderizar
    const render = [];

    // Ordenar los datos de competencias alfabéticamente
    const datosOrdenados = listCompetencias.slice().sort((a, b) => {
      if (a.nomCompetencia < b.nomCompetencia) {
        return -1;
      }
      if (a.nomCompetencia > b.nomCompetencia) {
        return 1;
      }
      return 0;
    });

    // Variables para el seguimiento de la competencia actual y el cálculo de promedios
    let auxCompetencia = "";
    let contReg = 0;
    let totalPorc = 0;
    var porcMenor = 0;
    var compMenor = 0;

    // Iteramos a través de los datos ordenados por competencia
    datosOrdenados.forEach((item, index) => {
      // Si es el primer elemento, asignamos el nombre de la competencia actual
      if (index === 0) {
        auxCompetencia = item.nomCompetencia;
      }

      // Comprobamos si la competencia cambió o si estamos en el último elemento
      if (auxCompetencia !== item.nomCompetencia || index === datosOrdenados.length - 1) {
        // Calculamos el promedio de porcentaje
        const promedioPorc = totalPorc / contReg;

        // Comparamos si el promedio es menor o igual al porcentaje menor registrado o si es el primer cálculo
        if (promedioPorc <= porcMenor || porcMenor === 0) {
          porcMenor = promedioPorc;
          compMenor = auxCompetencia;
        }

        // Reiniciamos variables para la siguiente competencia
        auxCompetencia = item.nomCompetencia;
        contReg = 0;
        totalPorc = 0;
      }

      // Sumamos el porcentaje actual y aumentamos el contador
      totalPorc += parseFloat(item.porcAprobComp);
      contReg++;
    });

    // Agregamos los elementos al array render
    render.push(
      <div >
        <div>
          <br></br>

          <Card style={{ backgroundColor: ConfigOportColabTsoft.datoVisible }}>
            <Card.Body >
              <Card.Text className="letra">Menor competencia</Card.Text>
              <Card.Title className="letra">{porcMenor.toFixed(2)}%</Card.Title>
              <Card.Text className="letra">{compMenor}</Card.Text>
            </Card.Body>
          </Card>        <br></br>

        </div>
      </div>
    );

    // Devolvemos el array con los elementos renderizados
    return render;
  }

  function CompetenciasBajas() {
    // Crear un conjunto (set) para almacenar las competencias únicas que cumplen la condición
    const competenciasCumplidasSet = new Set();

    // Recorrer el array listCompetencias utilizando forEach
    listCompetencias.forEach((item) => {
      const { nomCompetencia, porcAprobComp } = item;

      // Comprobar si el porcentaje cumple con la condición
      if (eval(parseFloat(porcAprobComp) + ConfigAlertasColab.datoNoVisible)) {
        competenciasCumplidasSet.add(nomCompetencia);
      }
    });

    // Convertir el conjunto a un array para mapear y renderizar las competencias
    const competenciasCumplidasArray = Array.from(competenciasCumplidasSet);

    // Comprobar si hay competencias que cumplan la condición
    if (competenciasCumplidasArray.length > 0) {
      // Devolver el componente Card que muestra las competencias
      return (
        <div >
          <div >
            <br></br>

            <Card style={{ backgroundColor: ConfigOportRef.datoVisible }}>
              <Card.Body >
                <Card.Text className="letra">
                  Competencias bajo el 30%:
                </Card.Text>
                <Card.Text className="letraCompetencias">
                  {competenciasCumplidasArray.slice() // Crear una copia del arreglo original para no modificarlo directamente
                    .sort() // Ordenar alfabéticamente
                    .map((competencia, index) => (
                      <div key={index}> - {competencia}</div>
                    ))}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    } else {
      // Si no hay competencias que cumplan la condición, devolver null
      return null;
    }
  }

  function DiferenciaPorcentajeTemplate() {
    // Array donde almacenaremos los elementos a renderizar
    const render = [];

    // Objeto para almacenar los datos de cada empleado y su porcentaje
    const empleadosPorcentaje = {};
    const empleadosCantReg = {};
    var evaluado = "";

    // Iteramos a través de los datos
    listCompetencias.forEach((item) => {
      const empleado = item.nomEvaluador;
      evaluado = item.nomEmpleado;
      const porcentaje = parseFloat(item.porcAprobComp);

      // Si el empleado ya está en el objeto, sumamos el porcentaje al existente
      if (empleadosPorcentaje[empleado]) {
        empleadosPorcentaje[empleado] += porcentaje;
        empleadosCantReg[empleado] += 1;
      } else {
        empleadosPorcentaje[empleado] = porcentaje;
        empleadosCantReg[empleado] = 1;
      }
    });

    // Calculamos el promedio de porcentaje para cada empleado
    Object.keys(empleadosPorcentaje).forEach((item) => {
      empleadosPorcentaje[item] =
        Math.round((empleadosPorcentaje[item] / empleadosCantReg[item]) * 100) /
        100;
    });

    // Obtenemos las claves de los empleados con porcentajes calculados
    const empleadosPorcentajeKeys = Object.keys(empleadosPorcentaje);
    const numEmpleados = empleadosPorcentajeKeys.length;

    // Iteramos a través de las combinaciones de empleados
    for (let index1 = 0; index1 < numEmpleados; index1++) {
      const empleado1 = empleadosPorcentajeKeys[index1];

      for (let index2 = index1 + 1; index2 < numEmpleados; index2++) {
        const empleado2 = empleadosPorcentajeKeys[index2];

        // Calculamos la diferencia de porcentaje entre los empleados
        const diferenciaPorcentajes =
          Math.abs(
            empleadosPorcentaje[empleado1] - empleadosPorcentaje[empleado2]
          );

        // Obtenemos los porcentajes de los empleados
        const porcentajeEmpleado1 = empleadosPorcentaje[empleado1];
        const porcentajeEmpleado2 = empleadosPorcentaje[empleado2];

        // Agregamos elementos al array render si se cumple la condición
        if (eval(diferenciaPorcentajes + ConfigAlertasDifRango.datoNoVisible)) {
          render.push(
            <div key={index1} >
              <div >
                <br></br>

                <Card
                  style={{ backgroundColor: ConfigAlertasDifRango.datoVisible }}
                >
                  <Card.Body >
                    <Card.Text className="letra">
                      Diferencia de Porcentaje
                    </Card.Text>
                    <Card.Text className="letra">{evaluado}</Card.Text>
                    <Card.Title className="letra">
                      {diferenciaPorcentajes.toFixed(2)}%
                    </Card.Title>
                    <Card.Text className="letra">
                      {empleado1} ({porcentajeEmpleado1}%) vs {empleado2} (
                      {porcentajeEmpleado2}%)
                    </Card.Text>
                  </Card.Body>
                </Card>

              </div>
            </div>
          );
        }
      }
    }

    // Devolvemos el array con los elementos renderizados
    return render;
  }

  //--------------------------

  //RENDER GENERAL
  useEffect(
    function () {
      GetDataResumenEval();
      GetDataCompetencias();
      // GetConfigCompColorFlechas();
      // GetConfigCompRangoFlechas();
      GetConfigDestacables();
      GetConfigOportunidades();
      GetConfigAlertas();
    },
    [loadedDataCompetencias, loadedDataResumenEval, idEDDEvaluacion, nomEvaluacion, tipoEvaluacion,idEDDProyecto]
  );

  return userData.statusConected || userData !== null ? (
    <div>
      <Header></Header>
      <a
            type="submit"
            id="btnAtrasEvaluacion"
            value="Registrar"
            href="/listadoEddEvalProyEmp/0">Volver
          </a>
      <div id="columnGeneral">
        <div id="column">
          <h2 id="titleColor">Destacables</h2>
          <DestacablesReferentesTemplate></DestacablesReferentesTemplate>
          <DestacablesColaboradoresTemplate></DestacablesColaboradoresTemplate>
          <DestacablesColaboradoresTsoftTemplate></DestacablesColaboradoresTsoftTemplate>
        </div>
        <div id="column">
          <h2 id="titleColor">Oportunidades</h2>
          <OportunidadesReferentesTemplate></OportunidadesReferentesTemplate>
          <OportunidadesColaboradoresTemplate></OportunidadesColaboradoresTemplate>
          <OportunidadesColaboradoresTsoftTemplate></OportunidadesColaboradoresTsoftTemplate>
          <PorcCompMenorTemplate></PorcCompMenorTemplate>
        </div>
        <div id="column">
          <h2 id="titleColor">Alertas</h2>
          <DiferenciaPorcentajeTemplate></DiferenciaPorcentajeTemplate>
          <AlertasReferentesTemplate></AlertasReferentesTemplate>
          <AlertasColaboradoresTemplate></AlertasColaboradoresTemplate>
          <AlertasColaboradoresTsoftTemplate></AlertasColaboradoresTsoftTemplate>
          <CompetenciasBajas> </CompetenciasBajas>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
