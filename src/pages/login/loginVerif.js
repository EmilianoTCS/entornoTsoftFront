import React, { useState, useContext } from "react";
import "../login/login.css";
import { useNavigate, Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

export default function LoginVerif() {
    const navigate = useNavigate();
    var [idEvaluacion, setidEvaluacion] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
    var [idEDDProyEmpEvaluador, setidEDDProyEmpEvaluador] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
    var [idEDDProyEmpEvaluado, setidEDDProyEmpEvaluado] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar
    var [cicloEvaluacion, setcicloEvaluacion] = useState([""]); //Recibe la respuesta del backend y la almacena en raw, sin procesar

    const username = 'Externo';
    const password = 'Externo123';

    const { login, isLogged, nomRol } =
        useContext(AuthContext);
    useEffect(() => {
        login({ username, password });
        if (isLogged) {
            if (nomRol === "externo") {
                var urlCompleta = window.location.search;
                urlCompleta = urlCompleta.replace("?", '');
                // console.log(urlCompleta);
                // Desencriptar
                let decodificado = atob(urlCompleta);
                // console.log(decodificado);
                // var decodificado = '4,10,6';
                var valores = decodificado.split(',');
                
                if (valores.length === 4) {
                    idEvaluacion = parseInt(valores[0]); 
                    idEDDProyEmpEvaluado = parseInt(valores[1]);
                    idEDDProyEmpEvaluador = parseInt(valores[2]);
                    cicloEvaluacion = parseInt(valores[3])
                    
                    console.log(idEvaluacion);
                    console.log(idEDDProyEmpEvaluador);
                    console.log(idEDDProyEmpEvaluado);
                    console.log(cicloEvaluacion);

                } else {
                    console.error("La cadena no se puede dividir en cuatro valores.");
                }
                var url = `/listadoRespPregEvaluacionesExterno/${idEvaluacion}/${idEDDProyEmpEvaluador}/${cicloEvaluacion}`;
                navigate(url);       
                // var encode = `${idEvaluacion},${idEDDProyEmpEvaluador},${idEDDProyEmpEvaluado}`;
                // encode = btoa(encode);
                // var urlFinal = `/listadoRespPregEvaluacionesExterno/${encode}`;
                // navigate(urlFinal);
                // ------------
            } else {
                // navigate("/home");
            }
        }
    }, [isLogged, navigate, nomRol]);
    return (
        <div>
            <h1>Cargando</h1>
        </div>
    );
}
