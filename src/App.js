import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthState from "./context/AuthContext";
import { PrivateRoute } from "../src/hooks/PrivateRoute";

import HomePage from "./pages/home/Homepage";
import Login from "./pages/login/login";

/*LISTADOS*/
// ACADEMIA
import ListadoEmpleados from "./pages/Listados/ListadoEmpleados/ListadoEmpleados";
import ListadoRamos from "./pages/Listados/ListadoRamos/ListadoRamos";
import ListadoClientes from "./pages/Listados/ListadoClientes/ListadoClientes";
import ListadoSesiones from "./pages/Listados/ListadoSesiones/ListadoSesiones.js";
import ListadoServicios from "./pages/Listados/ListadoServicios/ListadoServicios";
import ListadoAlumnos from "./pages/Listados/ListadoAlumnos/ListadoAlumnos";
import ListadoCursos from "./pages/Listados/ListadoCursos/ListadoCursos";
import ListadoContacto from "./pages/Listados/ListadoContacto/ListadoContacto";
import ListadoCursoAlumnos from "./pages/Listados/ListadoCursoAlumno/ListadoCursoAlumno";
import ListadoCursoAlumnoSesion from "./pages/Listados/ListadoCursoAlumnoSesion/ListadoCursoAlumnoSesion";
import ListadoNotaExamen from "./pages/Listados/ListadoNotaExamen/ListadoNotaExamen";
import ListadoRamoExamen from "./pages/Listados/ListadoRamoExamen/ListadoRamoExamen";
import ListadoRelatorRamo from "./pages/Listados/ListadoRelatorRamo/ListadoRelatorRamo";
import ListadoReqCurso from "./pages/Listados/ListadoReqCurso/ListadoReqCurso";
// EDD
import ListadoEddProyecto from "./Edd/pages/Listados/ListadoEddProyecto/ListadoEddProyecto";
import ListadoEddEvalCompetencia from "./Edd/pages/Listados/ListadoEddEvalCompetencia/ListadoEddEvalCompetencia";
import ListadoEDDProyEmp from "./Edd/pages/Listados/ListadoEddProyEmp/ListadoEddProyEmp";
import ListadoEmpSubsist from "./Edd/pages/Listados/ListadoEmpSubsist/ListadoEmpSubsist";
import ListadoEmpTipoPerfil from "./Edd/pages/Listados/ListadoEmpTipoPerfil/ListadoEmpTipoPerfil";
import ListadoEDDEvalPregunta from "./Edd/pages/Listados/ListadoEddEvalPregunta/ListadoEddEvalPregunta";
import ListadoEDDEvalRespPreg from "./Edd/pages/Listados/ListadoEddEvalRespPreg/ListadoEddEvalRespPreg";
import ListadoEddEvalProyEmp from "./Edd/pages/Listados/ListadoEddEvalProyEmp/ListadoEddEvalProyEmp";
import ListadoEddEvalProyResp from "./Edd/pages/Listados/ListadoEddEvalProyResp/ListadoEddEvalProyResp";
import ListadoEDDEvaluacion from "./Edd/pages/Listados/ListadoEddEvaluacion/ListadoEddEvaluacion";


function App() {
  return (
    <AuthState>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/"></Route>
          <Route element={<Login />} path="/Login"></Route>

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />}></Route>
            {/* ACADEMIA */}
            <Route
              element={<ListadoEmpleados />}
              path="/listadoEmpleados"
            ></Route>
            <Route
              element={<ListadoRamos />}
              path="/listadoRamos/:params"
            ></Route>
            <Route
              element={<ListadoCursos />}
              path="/listadoCursos/:params"
            ></Route>
            <Route
              element={<ListadoClientes />}
              path="/listadoClientes/:params"
            ></Route>
            <Route
              element={<ListadoSesiones />}
              path="/listadoSesiones/:params"
            ></Route>
            <Route
              element={<ListadoServicios />}
              path="/listadoServicios/:params"
            ></Route>
            <Route element={<ListadoAlumnos />} path="/listadoAlumnos"></Route>
            <Route
              element={<ListadoContacto />}
              path="/listadoContacto/:params"
            ></Route>
            <Route
              element={<ListadoCursoAlumnos />}
              path="/listadoCursoAlumnos/:params"
            ></Route>
            <Route
              element={<ListadoCursoAlumnoSesion />}
              path="/listadoCursoAlumnoSesion/:params"
            ></Route>
            <Route
              element={<ListadoNotaExamen />}
              path="/listadoNotaExamen/:params"
            ></Route>
            <Route
              element={<ListadoRamoExamen />}
              path="/listadoRamoExamen/:params"
            ></Route>
            <Route
              element={<ListadoRelatorRamo />}
              path="/listadoRelatorRamo/:params"
            ></Route>
            <Route
              element={<ListadoReqCurso />}
              path="/listadoReqCurso/:params"
            ></Route>
            {/* ------------------------------------------------------------------------------------------ */}

            {/* EDD */}
            <Route element={<ListadoEddProyecto />} path="/listadoEddProyecto/:params"></Route>
            <Route element={<ListadoEddEvalCompetencia />} path="/listadoEddEvalCompetencia"></Route>
            <Route element={<ListadoEDDProyEmp />} path="/listadoEddProyEmp/:params"></Route>
            <Route element={<ListadoEmpSubsist />} path="/listadoEmpSubsist/:params"></Route>
            <Route element={<ListadoEmpTipoPerfil />} path="/listadoEmpTipoPerfil/:params"></Route>
            <Route element={<ListadoEDDEvalPregunta />} path="/listadoEddEvalPregunta/:params"></Route>
            <Route element={<ListadoEDDEvalRespPreg />} path="/listadoEddEvalRespPreg/:params"></Route>
            <Route element={<ListadoEddEvalProyEmp />} path="/listadoEddEvalProyEmp/:params"></Route>
            <Route element={<ListadoEddEvalProyResp />} path="/listadoEddEvalProyResp/:params"></Route>
            <Route element={<ListadoEDDEvaluacion />} path="/listadoEddEvaluacion/:params"></Route>





            {/* ------------------------------------------------------------------------------------------ */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthState>
  );
}

export default App;
