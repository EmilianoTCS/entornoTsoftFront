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
import ListadoClientes_test_agGrid from "./pages/Listados/ListadoClientes/ListadoClientes_test_agGrid.js";
import ListadoSesiones from "./pages/Listados/ListadoSesiones/ListadoSesiones.js";
import ListadoServicios from "./pages/Listados/ListadoServicios/ListadoServicios";
// import ListadoAlumnos from "./pages/Listados/ListadoAlumnos/ListadoAlumnos";
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
import FormAnalistas from "./Edd/pages/Formularios/FormAnalistas";
import FormReferentes from "./Edd/pages/Formularios/FormReferentes";
import FormularioEvaluacion from "./Edd/pages/Listados/FormularioEvaluacion/FormularioEvaluacion";
import FormularioEvaluacionRespondida from "./Edd/pages/Listados/FormularioEvaluacion/FormularioEvaluacionRespondido";
import HomePageEDD from "../src/Edd/pages/home/HomepageEDD";
import GraficosDashboard from "./Edd/pages/home/GraficosDashboard";
import AlertOpoDes from "./Edd/pages/home/AlertasOporDes";
import ComentariosDashboard from "./Edd/pages/home/ComentariosDashboard";
// import DiseñoDashboardTablaConLineasPorc from "./Edd/pages/DiseñoDashboard/DiseñoDashboardTablaConLineaPorc";
// import DiseñoDashboardGrafico from "./Edd/pages/DiseñoDashboard/DiseñoDashboardGrafico";
// import DiseñoDashboardTabla from "./Edd/pages/DiseñoDashboard/DiseñoDashboardTabla";
// import DiseñoTablaLineaReferente from "./Edd/pages/DiseñoDashboard/DiseñoTablaLineaReferente";
// import UnReferenteDiseño from "./Edd/pages/DiseñoDashboard/1Ref";
import RedirectErrorMail from "./Edd/pages/Listados/ListadoEddEvalProyEmp/RedirectErrorMail";
import LoginVerif from "./pages/login/loginVerif";
import FormularioEvaluacionExterno from "./Edd/pages/Listados/FormularioEvaluacion/FormularioEvaluacionExterno";
import CargaSinDatos from "./Edd/pages/Listados/FormularioEvaluacion/CargaSinDatos";
import ListadoCompProy from "./Edd/pages/Listados/ListadoCompProy/ListadoCompProy";
import DashboardCompProy from "./Edd/pages/Listados/ListadoCompProy/DashboardCompProy";
// import ListadoEddResumenEval from "./Edd/pages/Listados/ListadoEddResumenEval/ListadoEddResumenEval.js";
import DashboardEddResumenEval from "./Edd/pages/Listados/ListadoEddResumenEval/DashboardEddResumenEval.js";

//IHH
import IHH_ListadoAcop from "./IHH/pages/ListadoAcop/ihh_ListadoAcop.js";
import IHH_ListadoElementoImp from "./IHH/pages/ListadoElementoImp/ihh_ListadoElementoImp.js";
import IHH_ListadoImpugnacionEmp from "./IHH/pages/ListadoImpugnacionEmp/ihh_ListadoImpugnacionEmp.js";
import IHH_ListadoNotaImpugnacion from "./IHH/pages/ListadoNotaImpugnacion/ihh_ListadoNotaImpugnacion.js";
import IHH_ListadoPeriodo from "./IHH/pages/ListadoPeriodo/ListadoPeriodo.js";
import IHH_ListadoTipoElemento from "./IHH/pages/ListadoTipoElemento/ListadoTipoElemento.js";
import IHH_ListadoTipoPeriodo from "./IHH/pages/ListadoTipoPeriodo/ListadoTipoPeriodo.js";
import ListadoClientes_test_dataGrid from "./pages/Listados/ListadoClientes/ListadoClientes_test_dataGrid.js";
import ListadoClientes_test_mui_datagrid from "./pages/Listados/ListadoClientes/ListadoClientes_test_mui_datagrid.js";
import SimuladorCostos from "./IHH/pages/SimuladorCostos/SimuladorCostos.js";
import DetalleProyectos from "./IHH/pages/DetalleProyectos/ihh_detalleProyectos.js";
import ListadoImpEmpProy from "./IHH/pages/ListadoImpEmpProy/ihh_ListadoImpEmpProy.js";
import Resumen_ihh_colab from "./IHH/pages/Resumen_ihh_colab/Resumen_ihh_colab.js";
import Resumen_ihh_colab_mes from "./IHH/pages/Resumen_ihh_colab_mes/Resumen_ihh_colab_mes.js";
import Resumen_ihh_colab_proy from "./IHH/pages/Resumen_ihh_colab_proy/Resumen_ihh_colab_proy.js";
function App() {
  return (
    <AuthState>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/"></Route>
          <Route element={<Login />} path="/Login"></Route>
          <Route element={<LoginVerif />} path="/LoginVerif"></Route>

          <Route
            element={<RedirectErrorMail />}
            path="/RedirectErrorMail"
          ></Route>
          <Route element={<CargaSinDatos />} path="/CargaSinDatos"></Route>
          <Route
            element={<FormularioEvaluacionExterno />}
            path="/listadoRespPregEvaluacionesExterno/:idEvaluacion/:idEDDProyEmpEvaluador/:cicloEvaluacion"
          ></Route>

          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />}></Route>
            {/* ACADEMIA */}
            <Route
              element={<ListadoEmpleados />}
              path="/listadoEmpleados/:idEmpleado"
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
              element={<ListadoClientes_test_agGrid />}
              path="/listadoClientes_test_agGrid/:params"
            ></Route>
            <Route
              element={<ListadoClientes_test_dataGrid />}
              path="/listadoClientes_test_dataGrid/:params"
            ></Route>
            <Route
              element={<ListadoClientes_test_mui_datagrid />}
              path="/listadoClientes_test_mui_datagrid/:params"
            ></Route>
            <Route
              element={<ListadoSesiones />}
              path="/listadoSesiones/:params"
            ></Route>
            <Route
              element={<ListadoServicios />}
              path="/listadoServicios/:params"
            ></Route>
            {/* <Route element={<ListadoAlumnos />} path="/listadoAlumnos"></Route> */}
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
              path="/listadoRelatorRamo/:idEmpleado/:idRamo"
            ></Route>

            <Route
              element={<ListadoReqCurso />}
              path="/listadoReqCurso/:params"
            ></Route>
            {/* ------------------------------------------------------------------------------------------ */}

            {/* DASHBOARD */}
            <Route
              element={<HomePageEDD />}
              path="/homePageEDD/:idEvaluacion/:nomEvaluacion/:idEDDProyecto/:cicloEvaluacion"
            ></Route>
            <Route
              element={<GraficosDashboard />}
              path="/GraficosDashboard/:idEvaluacion/:nomEvaluacion/:idEDDProyecto/:cicloEvaluacion"
            ></Route>
            <Route
              element={<ComentariosDashboard />}
              path="/ComentariosDashboard/:idEvaluacion/:nomEvaluacion/:idEDDProyecto/:cicloEvaluacion"
            ></Route>
            {/* ------------------- */}

            <Route
              element={<ListadoCompProy />}
              path="/listadoCompProy"
            ></Route>
            <Route
              element={<DashboardCompProy />}
              path="/DashboardCompProy/:selectedClients/:selectedServicio/:selectedProyecto/:tipoComparacion/:tipoCargo/:fechaIni/:fechaFin/:cicloEvaluacion"
            ></Route>
            <Route
              element={<DashboardEddResumenEval />}
              path="/DashboardEddResumenEval/:idCliente/:idServicio/:idProyecto/:tipoCargo/:fechaIni/:fechaFin/:cicloEvaluacion"
            ></Route>

            <Route
              element={<AlertOpoDes />}
              path="/AlertasOporDes/:idEvaluacion/:nomEvaluacion/:tipoEvaluacion/:idEDDProyecto/:cicloEvaluacion"
            ></Route>
            {/* EDD */}
            <Route
              element={<FormularioEvaluacion />}
              path="/listadoRespPregEvaluaciones/:idEvaluacion/:idEDDProyEmpEvaluado/:idEDDProyEmpEvaluador/:cicloEvaluacion"
            ></Route>

            <Route
              element={<ListadoEddProyecto />}
              path="/listadoEddProyecto/:params"
            ></Route>
            <Route
              element={<ListadoEddEvalCompetencia />}
              path="/listadoEddEvalCompetencia"
            ></Route>
            <Route
              element={<ListadoEDDProyEmp />}
              path="/listadoEddProyEmp/:idProyecto/:idEmpleado"
            ></Route>
            <Route
              element={<ListadoEmpSubsist />}
              path="/listadoEmpSubsist/:params"
            ></Route>
            <Route
              element={<ListadoEmpTipoPerfil />}
              path="/listadoEmpTipoPerfil/:params"
            ></Route>
            <Route
              element={<ListadoEDDEvalPregunta />}
              path="/listadoEddEvalPregunta/:params"
            ></Route>
            <Route
              element={<ListadoEDDEvalRespPreg />}
              path="/listadoEddEvalRespPreg/:params"
            ></Route>
            <Route
              element={<ListadoEddEvalProyEmp />}
              path="/listadoEddEvalProyEmp/:idProyecto"
            ></Route>
            <Route
              element={<ListadoEddEvalProyResp />}
              path="/listadoEddEvalProyResp/:params"
            ></Route>
            <Route
              element={<ListadoEDDEvaluacion />}
              path="/listadoEddEvaluacion/:params"
            ></Route>
            <Route element={<FormAnalistas />} path="/FormularioAnEDD"></Route>
            <Route
              element={<FormReferentes />}
              path="/FormularioRefEDD"
            ></Route>
            {/* ------------------------------------- IHH */}
            <Route
              element={<IHH_ListadoAcop />}
              path="/ihh/listadoAcop"
            ></Route>
            <Route
              element={<IHH_ListadoElementoImp />}
              path="/ihh/listadoElementoImp/:idElementoImp"
            ></Route>
            <Route
              element={<IHH_ListadoImpugnacionEmp />}
              path="/ihh/listadoImpugnacionEmp"
            ></Route>
            <Route
              element={<IHH_ListadoNotaImpugnacion />}
              path="/ihh/listadoNotaImpugnacion/:idImpugnacionEmp"
            ></Route>
            <Route
              element={<IHH_ListadoPeriodo />}
              path="/ihh/listadoPeriodo/:idPeriodo"
            ></Route>
            <Route
              element={<IHH_ListadoTipoElemento />}
              path="/ihh/listadoTipoElemento/:idTipoElemento"
            ></Route>
            <Route
              element={<IHH_ListadoTipoPeriodo />}
              path="/ihh/listadoTipoPeriodo/:idTipoPeriodo"
            ></Route>
            <Route
              element={<DetalleProyectos />}
              path="/ihh/detalleProyectos/:idProyecto"
            ></Route>
            <Route
              element={<SimuladorCostos />}
              path="/ihh/simuladorCostos/:idProyecto/:mes/:idAcop"
            ></Route>
            <Route
              element={<ListadoImpEmpProy />}
              path="/ihh/ListadoImpEmpProy"
            ></Route>
            <Route
              element={<Resumen_ihh_colab />}
              path="/ihh/Resumen_ihh_colab"
            ></Route>
            <Route
              element={<Resumen_ihh_colab_mes />}
              path="/ihh/Resumen_ihh_colab_mes/:idColaborador/:idProyecto/:fechaInicio/:fechaFin"
            ></Route>
            <Route
              element={<Resumen_ihh_colab_proy />}
              path="/ihh/Resumen_ihh_colab_proy/:idColaborador/:idProyecto/:fechaInicio/:fechaFin"
            ></Route>

            {/* ------------------------------------------------------------------------------------------ */}

            <Route
              element={<FormularioEvaluacionRespondida />}
              path="/listadoEvalResp/:idEvaluacion/:idEDDProyEmpEvaluado/:idEDDProyEmpEvaluador/:cicloEvaluacion"
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthState>
  );
}

export default App;
