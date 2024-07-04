const datos = [
  {
    idEDDProyecto: "70",
    nomProyecto: "TEST REDONDEO PPTO11",
    fechaIni: "01-01-2024",
    fechaFin: "01-05-2024",
    nomServicio: "A - ARG",
    tipoProyecto: "LLAVE EN MANO",
    mes: "202401",
    idresumenperproy: "381",
    presupuestoMensualUSD: "2913.8",
    presupuestoMensualpesos: "2750131.900085449",
    valorUSDPesos: "943.83",
    presupuestoTotal: "14569",
  },
  {
    idEDDProyecto: "70",
    nomProyecto: "TEST REDONDEO PPTO11",
    fechaIni: "01-01-2024",
    fechaFin: "01-05-2024",
    nomServicio: "A - ARG",
    tipoProyecto: "LLAVE EN MANO",
    mes: "202402",
    idresumenperproy: "382",
    presupuestoMensualUSD: "2913.8",
    presupuestoMensualpesos: "2750131.900085449",
    valorUSDPesos: "943.83",
    presupuestoTotal: "14569",
  },
  {
    idEDDProyecto: "70",
    nomProyecto: "TEST REDONDEO PPTO11",
    fechaIni: "01-01-2024",
    fechaFin: "01-05-2024",
    nomServicio: "A - ARG",
    tipoProyecto: "LLAVE EN MANO",
    mes: "202403",
    idresumenperproy: "383",
    presupuestoMensualUSD: "2913.8",
    presupuestoMensualpesos: "2750131.900085449",
    valorUSDPesos: "943.83",
    presupuestoTotal: "14569",
  },
  {
    idEDDProyecto: "70",
    nomProyecto: "TEST REDONDEO PPTO11",
    fechaIni: "01-01-2024",
    fechaFin: "01-05-2024",
    nomServicio: "A - ARG",
    tipoProyecto: "LLAVE EN MANO",
    mes: "202404",
    idresumenperproy: "384",
    presupuestoMensualUSD: "2913.8",
    presupuestoMensualpesos: "2750131.900085449",
    valorUSDPesos: "943.83",
    presupuestoTotal: "14569",
  },
  {
    idEDDProyecto: "70",
    nomProyecto: "TEST REDONDEO PPTO11",
    fechaIni: "01-01-2024",
    fechaFin: "01-05-2024",
    nomServicio: "A - ARG",
    tipoProyecto: "LLAVE EN MANO",
    mes: "202405",
    idresumenperproy: "385",
    presupuestoMensualUSD: "2913.8",
    presupuestoMensualpesos: "2750131.900085449",
    valorUSDPesos: "943.83",
    presupuestoTotal: "14569",
  },
];

// Calcula el total de presupuestos mensuales sin haberse formateado ni redondeado
function sumtotal() {
  console.log("datosOr", datos);
  let total = 0;
  datos.map((item) => {
    total += parseFloat(item.presupuestoMensualUSD);
  });

  return total;
}
// Calcula el total de presupuestos mensuales redondeados
function sumtotalRedondeado() {
  let total = 0;
  datos.map((item) => {
    total += Math.round(item.presupuestoMensualUSD);
  });
  console.log("datos red", datos);
  return total;
}

let diferencia = sumtotalRedondeado() - sumtotal()

datos.map((item, index) => {
    if (index === datos.length - 1) {
      item.presupuestoMensualUSD =
        Math.round(item.presupuestoMensualUSD) - diferencia;
    } else {
      item.presupuestoMensualUSD = Math.round(item.presupuestoMensualUSD);
    }
  });

  console.log("datosred y reemplazados", datos);