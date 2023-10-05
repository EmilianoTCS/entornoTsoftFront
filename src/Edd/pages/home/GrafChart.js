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
            
        // FUERTE
        "#B71C1C", // Rojo              1
        "#303F9F", // Azul              2
        "#8BC34A", // Verde               3
        "#FDD835", // Amarillo              4
        "#F48FB1", // Rosa              5
        "#00796B", // Cyan                  6
        "#8E24AA", // Violeta              7
        "#EF6C00", // Naranja              8
        "#03A9F4", // Celeste              9
        "#795548", // Verde agua            10
            
        // CLAROS
        "#EF9A9A", // Rojo              1
        "#9FA8DA", // Azul              2
        "#558B2F", // Verde               3
        "#FFF59D", // Amarillo              4
        "#E91E63", // Rosa              5
        "#80CBC4", // Cyan                   6
        "#CE93D8", // Violeta              7
        "#FFB74D", // Naranja              8
        "#B3E5FC", // Celeste              9
        "#BCAAA4", // Verde agua            10

        // MEDIOS
        "#F44336", // Rojo              1
        "#3F51B5", // Azul              2
        "#C5E1A5", // Verde               3
        "#FFF176", // Amarillo              4
        "#F06292", // Rosa              5
        "#26A69A", // Cyan                  6
        "#AB47BC", // Violeta              7
        "#FF9800", // Naranja              8
        "#4FC3F7", // Celeste              9
        "#795548", // Verde agua            10

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