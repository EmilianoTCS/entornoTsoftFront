import React, { useEffect, useState } from "react";
import "../TablasStyles.css";
import { Table } from "react-bootstrap";
import DashboardCompProy_detalle from "./DashboardCompProy_detalle";
import SendDataService from "../../../../services/SendDataService";
import "./DashboardEddResumenEval.css";
export default function DashboardEddResumenEval_detalle({
  idCliente,
  idServicio,
  idProyecto,
  cicloEvaluacion,
  fechaIni,
  fechaFin,
  tipoCargo,
  setActiveGraph,
  setShowScrollButton,
}) {

  //Resumen: este componente se despliega cuando en DashboardEddResumenEval se clickea una de las barras horizontales, muestra LA TABLA con los botones de comparación mensual y anual


  //Declaración de variables

  const [listEddResumenEval, setListEddResumenEval] = useState();
  const [loadedDataResumenEval, setLoadedDataResumenEval] = useState(false);
  const [loadedDataColor, setLoadedDataColor] = useState(false);
  const [listConfigCompColor, setListConfigCompColor] = useState("");
  const [tipoComparacion, setTipoComparacion] = useState("MES");


  //Obtención de los datos
  function getListEddResumenEval() {
    var url = "pages/listados/listadoEddResumenEval.php";
    var operationUrl = "listadoEddResumenEval";

    var data = {
      idCliente: idCliente,
      idServicio: idServicio,
      idProyecto: idProyecto,
      fechaIni: fechaIni,
      fechaFin: fechaFin,
      cicloEvaluacion: cicloEvaluacion,
      tipoCargo: tipoCargo,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setListEddResumenEval(response);
      setLoadedDataResumenEval(true);
    });
  }
  function GetConfigCompColorFlechas() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "competencia",
      subTipoConfDato: "RANGO_COLOR",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setListConfigCompColor(data);
      setLoadedDataColor(true);
    });
  }


  //UseEffect
  useEffect(() => {
    getListEddResumenEval();
    GetConfigCompColorFlechas();
  }, [
    loadedDataResumenEval,
    loadedDataColor,
    idProyecto,
    idServicio,
    idCliente,
  ]);

  //Funciones


  function toggleInfo() {
    setActiveGraph(false);
    setShowScrollButton(false);
  }

  const Grid = ({ data }) => {
    if (loadedDataResumenEval) {
      // Obtener la lista de proyectos y ciclos únicos
      const proyectos = [...new Set(data.map((item) => item.nomProyecto))];
      const ciclos = [...new Set(data.map((item) => item.cicloEvaluacion))];

      // Crear la estructura de datos para la grilla
      const gridData = ciclos.map((ciclo) => {
        const rowData = {
          ciclo: ciclo,
        };

        proyectos.forEach((proyecto) => {
          const proyectoData = data.find(
            (item) =>
              item.nomProyecto === proyecto && item.cicloEvaluacion === ciclo
          );

          if (proyectoData) {
            rowData[`${proyecto}_cantEmpleados`] = proyectoData.cantEmpleados;
            rowData[`${proyecto}_fechaIniVigencia`] =
              proyectoData.fechaIniVigenciaEvalRef ||
              proyectoData.fechaIniVigenciaEvalColab;
            rowData[`${proyecto}_cantEvalRespondidas`] =
              proyectoData.cantEvalRespondidas;
            rowData[`${proyecto}_fechaIniProyecto`] = proyectoData.proyFechaIni;
            rowData[`${proyecto}_fechaFinProyecto`] = proyectoData.proyFechaFin;
          }
        });

        return rowData;
      });

      return (
        <Table id="mainTable" hover responsive>
          <thead>
            <tr style={{ padding: "20px" }}>
              <th>Ciclo</th>
              <th>Fecha Ciclo</th>
              <th>Cant. Empleados</th>
              <th>Cant. Evaluaciones</th>
              <th>Cant. Eval Respondidas</th>
              <th>% Eval Respondidas</th>
              <th>Fecha Ini Proyecto</th>
              <th>Fecha Fin Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {gridData.map((row) => (
              <tr key={row.ciclo} style={{ padding: "20px" }}>
                <td>{row.ciclo}</td>
                {proyectos.map((proyecto) => (
                  <React.Fragment key={proyecto}>
                    <td>{row[`${proyecto}_fechaIniVigencia`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEmpleados`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEmpleados`] || "-"}</td>
                    <td>{row[`${proyecto}_cantEvalRespondidas`] || "-"}</td>
                    <td>
                      {(
                        (row[`${proyecto}_cantEvalRespondidas`] * 100) /
                        row[`${proyecto}_cantEmpleados`]
                      ).toFixed(2) || "-"}
                    </td>
                    <td>{row[`${proyecto}_fechaIniProyecto`] || "-"}</td>
                    <td>{row[`${proyecto}_fechaFinProyecto`] || "-"}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };
  
  //Main render
  return (
    <>
      <div className="containerChart" id="chartAutoScroll_detalleResEval">
        {loadedDataResumenEval ? (
          <h3>{listEddResumenEval[0].nomProyecto}</h3>
        ) : (
          <></>
        )}

        {tipoCargo === "COLABORADOR" ? (
          <h5>Detalle de colaboradores por ciclo</h5>
        ) : (
          <h5>Detalle de referentes por ciclo</h5>
        )}
        <Grid data={listEddResumenEval} />

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", flexDirection: "row", width: "800px" }}>
          <button
            data-title="Desplegar dashboard"
            type="button"
            className="btn-General-Pag"
            data-html2canvas-ignore="true"
            style={{marginLeft: "0"}}
            onClick={() => {
              setTipoComparacion("MES")
            }}
          >
            Desplegar Dashboard Competencias - MENSUAL
          </button>

          <button
            data-title="Desplegar dashboard"
            type="button"
            className="btn-General-Pag"
            data-html2canvas-ignore="true"
            style={{marginLeft: "0"}}
            onClick={() => {
              setTipoComparacion("AÑO")
            }}
          >
            Desplegar Dashboard Competencias - ANUAL
          </button>
        </div>
      </div>

      <div
        style={{
          width: "fit-content",
          marginTop: "5px",
        }}
      >
        <DashboardCompProy_detalle
          idCliente={idCliente}
          idServicio={idServicio}
          idProyecto={idProyecto}
          tipoComparacion={tipoComparacion}
          tipoCargo={tipoCargo}
          fechaIni={fechaIni}
          fechaFin={fechaFin}
          cicloEvaluacion={cicloEvaluacion}
        />
      </div>
      <div
        style={{
          margin: "auto",
          width: "900px",
          marginTop: "5px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => toggleInfo()}
          value="Ocultar"
          className="btnOcultarDetalle"
          data-html2canvas-ignore="true"
        >
          Ocultar detalle
        </button>
      </div>
    </>
  );
}
