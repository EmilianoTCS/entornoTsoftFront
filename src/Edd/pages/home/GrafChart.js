import SendDataService from "../../../services/SendDataService";
import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export default function GrafChart({idEDDEvaluacion,idEDDProyecto}) {

    const [listCompetencias, setListCompetencias] = useState("");

    function GetDataCompetencias() {
        var url = "pages/listados/listadoCompetenciasEval.php";
        var operationUrl = "listadoCompetenciasEval";
        var data = {
            idEvaluacion: idEDDEvaluacion,
            idProyecto:idEDDProyecto,
        };
        console.log(data);
        SendDataService(url, operationUrl, data).then((data) => {
            setListCompetencias(data);
        });
        // console.log(data);
    }


    function Porcentajes() {
        var list_eval_comp_porc = {};
        var result_list = {};
        var totalPorcentajesPorCompetencia = {};
        let reversed = Object.values(listCompetencias).reverse()

        // console.log("listCompetencias",listCompetencias);
        // console.log("reversed",reversed);
    
        reversed.forEach(item => {
            if (item.nomEvaluador in list_eval_comp_porc) {
                if (item.nomCompetencia in list_eval_comp_porc[item.nomEvaluador]) {
                    list_eval_comp_porc[item.nomEvaluador][item.nomCompetencia].push(item.porcAprobComp);
                } else {
                    list_eval_comp_porc[item.nomEvaluador][item.nomCompetencia] = [item.porcAprobComp];
                }
            } else {
                list_eval_comp_porc[item.nomEvaluador] = {
                    [item.nomCompetencia]: [item.porcAprobComp]
                };
            }
    
            if (item.nomCompetencia in totalPorcentajesPorCompetencia) {
                totalPorcentajesPorCompetencia[item.nomCompetencia].push(item.porcAprobComp);
            } else {
                totalPorcentajesPorCompetencia[item.nomCompetencia] = [item.porcAprobComp];
            }
        });
    
        Object.keys(list_eval_comp_porc).forEach(evaluador => {
            result_list[evaluador] = {};
            Object.keys(list_eval_comp_porc[evaluador]).forEach(competencia => {
                var porcentajes = list_eval_comp_porc[evaluador][competencia];
                var suma = porcentajes.reduce((total, porcentaje) => total + parseFloat(porcentaje), 0);
                var promedio = suma / porcentajes.length;
                result_list[evaluador][competencia] = promedio;
            });
        });
    
        var totalPromediosPorCompetencia = {};
        Object.keys(totalPorcentajesPorCompetencia).forEach(competencia => {
            var porcentajes = totalPorcentajesPorCompetencia[competencia];
            var suma = porcentajes.reduce((total, porcentaje) => total + parseFloat(porcentaje), 0);
            var promedio = suma / porcentajes.length;
            totalPromediosPorCompetencia[competencia] = promedio;
        });
    
        // Agregar promedios generales por competencia a result_list
        result_list['General'] = totalPromediosPorCompetencia;
    
        // console.log(result_list);
    
        return result_list;
    }






    
    var fn = Porcentajes()
    // console.log(fn);z
    var predefinedColors = [
        "Red", // Orange
        "Blue", // Blue
        "Green", // Green
        "Pink", // Pink
        "Cyan", // Cyan
        "Magenta", // Magenta
        // Agrega más colores según sea necesario
    ];
    
    var evaluatorColorMap = {};
    
    var getColorForEvaluator = (evaluator) => {
        if (!evaluatorColorMap[evaluator]) {
            const currentIndex = Object.keys(evaluatorColorMap).length;
            evaluatorColorMap[evaluator] = predefinedColors[currentIndex % predefinedColors.length];
        }
       
        return evaluatorColorMap[evaluator];
    };
    // Create datasets with random colors
    const datasets = Object.keys(fn).map((key) => {
        const evaluatorColor = getColorForEvaluator(key);
        return {
            label: key.toUpperCase(),
            data: Object.values(fn[key]),
            fill: false,
            // tension:0.2,
            borderColor: evaluatorColor,
            backgroundColor: evaluatorColor,
            pointRadius: 3,
            pointBorderColor: evaluatorColor,
            pointBackgroundColor: evaluatorColor,
        };
    });

    const competenciasLabels = Object.values(listCompetencias).reduce((labels, item) => {
        if (!labels.includes(item.nomCompetencia)) {
            labels.push(item.nomCompetencia);
        }
        return labels;
    }, []);
    
    const midata = {
        labels: competenciasLabels.reverse(),
        datasets: datasets,
    };

    var misoptions = {
        scales: {
            y: {
                min: 0
            },
            x: {
                ticks: { color: 'black' }
            }
        }
    };

    useEffect(() => {
        GetDataCompetencias();

        evaluatorColorMap = {};
    }, []);

    return <Line data={midata} options={misoptions} >
        <Porcentajes></Porcentajes>
    </Line>
}