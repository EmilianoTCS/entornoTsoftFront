import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Sidebar/SidebarStyles.css";
import Logout from "../../services/Logout";
import userLogo from "../../sources/User_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IoTime } from "react-icons/io5";
import { BsHourglassBottom } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { FaBook, FaUpload } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { IoIosPeople } from "react-icons/io";
import { IoBookmarks } from "react-icons/io5";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { PiExamFill } from "react-icons/pi";
import { FaPeopleCarry } from "react-icons/fa";
import FormularioImportarRegistros from "./FormularioImportarRegistros";
import FormularioImportarRegistros_IHH from "./FormularioImportarRegistros_IHH";

export default function SideBar() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isToggledEvaluaciones, setToggleEvaluaciones] = useState(false);
  const [isToggledAcademia, setToggleAcademia] = useState(false);
  const [isToggledImportarArchivos, setToggleImportarArchivos] =
    useState(false);
  const [isActiveImportarArchivos, setIsActiveImportarArchivos] =
    useState(false);
  const [isActiveImportarArchivos_IHH, setIsActiveImportarArchivos_IHH] =
    useState(false);
  const [isToggledIHH, setToggleIHH] = useState(false);

  function handleChangeEvaluaciones() {
    setToggleEvaluaciones(!isToggledEvaluaciones);
  }
  function handleChangeIHH() {
    setToggleIHH(!isToggledIHH);
  }

  function handleChangeAcademia() {
    setToggleAcademia(!isToggledAcademia);
  }

  function handleImportarArchivos() {
    setToggleImportarArchivos(!isToggledImportarArchivos);
  }

  return (
    <>
      <FormularioImportarRegistros
        isActive={isActiveImportarArchivos}
        cambiarEstado={setIsActiveImportarArchivos}
      ></FormularioImportarRegistros>

      <FormularioImportarRegistros_IHH
        isActive={isActiveImportarArchivos_IHH}
        cambiarEstado={setIsActiveImportarArchivos_IHH}
      ></FormularioImportarRegistros_IHH>
      <section>
        <button
          className="buttonStyleOpen"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
          data-html2canvas-ignore="true"
        >
          <BsArrowRightCircle id="iconSidebar" />
        </button>

        <div
          style={{ width: 300 }}
          className="offcanvas offcanvas-start"
          data-bs-scroll="true"
          data-bs-backdrop="false"
          id="offcanvasScrolling"
          aria-labelledby="offcanvasScrollingLabel"
        >
          <div>
            <button
              type="button"
              className="buttonStyleClose"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <BsArrowLeftCircle id="iconSidebar" />
            </button>
            <h4>ACADEMIA</h4>
            <img src={userLogo} id="User_logo" alt="userLogo"></img>
            <h4>{userData.username}</h4>
          </div>
          <div class="offcanvas-body">
            <ul>
              <h5>SUBSISTEMAS</h5>
              <div>
                <Container id="textLeft">
                  <li>
                    <Link
                      id="li_home"
                      to={
                        userData.nomRol === "administrador" ||
                        userData.nomRol === "people" ||
                        userData.nomRol === "alumno"
                          ? "/home"
                          : "/homeColaborador"
                      }
                    >
                      <button id="buttonSidebar">
                        <IoHome id="icons" />
                        HOME
                      </button>
                    </Link>
                  </li>

                  {/* --------------------------------------------------- */}
                  <li
                    id="li_Academia"
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia"
                        ? ""
                        : "private"
                    }
                  >
                    <Link to="/listadoClientes/0">
                      <button id="submenuSidebar">
                        <IoIosPeople id="icons" />
                        Clientes
                      </button>
                    </Link>
                  </li>
                  {/* --------------------------------------------------- */}

                  <li id="li_Academia">
                    <Link to="/listadoEmpleados/0">
                      <button id="submenuSidebar">
                        <FaPeopleCarry id="icons" />
                        Colaboradores
                      </button>
                    </Link>
                  </li>
                  {/* --------------------------------------------------- */}

                  <li
                    id="li_Academia"
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia"
                        ? ""
                        : "private"
                    }
                  >
                    <Link to="/listadoEddProyecto/0">
                      <button id="submenuSidebar">
                        <ImBook id="icons" />
                        Proyectos
                      </button>
                    </Link>
                  </li>
                  {/* -----------------Academia de formación-------------------- */}

                  <li
                    id="li_Academia"
                    onClick={handleChangeAcademia}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "relator" ||
                      userData.nomRol === "alumno"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <FaBook id="icons" />
                      Academia formación
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledAcademia ? "active" : ""}
                    >
                      <li id="textLeftSelect">
                        <Link to="/listadoCursos/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Cursos
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}

                      <li id="textLeftSelect">
                        <Link to="/listadoRamoExamen/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Exámenes ramos
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/listadoCursoAlumnos/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Cursos - alumnos
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/listadoNotaExamen/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Nota examen
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* -----------------Evaluaciones de desempeño------------------------- */}
                  <li
                    id="li_Academia"
                    onClick={handleChangeEvaluaciones}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "referente" ||
                      userData.nomRol === "colaborador"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <PiExamFill id="icons" />
                      Eval. desempeño
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledEvaluaciones ? "active" : ""}
                    >
                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/listadoEddEvaluacion/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Evaluaciones
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/listadoEddEvalCompetencia">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Competencia
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}

                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/listadoServicios/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Servicios
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalProyEmp/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Evaluaciones a colaboradores
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/listadoCompProy">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Comparación Proyectos
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      {/* <li id="textLeftSelect">
                        <Link to="/homePageEDD">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Dashboard
                          </button>
                        </Link>
                      </li> */}
                    </ul>
                  </li>
                  {/* -----------------Impugnacion de horas ------------------------- */}
                  <li
                    id="li_Academia"
                    onClick={handleChangeIHH}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia" ||
                      userData.nomRol === "referente" ||
                      userData.nomRol === "colaborador"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <BsHourglassBottom id="icons" />
                      Impugnación de horas
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledIHH ? "active" : ""}
                    >
                      {/* --------------------------------------------------- */}

                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/listadoAcop">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            ACOPS
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/listadoElementoImp/0">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            Elementos
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/listadoPeriodo/0">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            Períodos
                          </button>
                        </Link>
                      </li>

                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/listadoImpugnacionEmp">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            Impugnación
                          </button>
                        </Link>
                      </li>

                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/ListadoImpEmpProy">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            Impugnar horas
                          </button>
                        </Link>
                      </li>

                      {/* --------------------------------------------------- */}
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "people" ||
                          userData.nomRol === "gerencia"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/ihh/Resumen_ihh_colab">
                          <button id="submenuSidebar">
                            <IoTime id="icons" />
                            Resúmenes
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* -----------------Importar registros ------------------------- */}
                  <li
                    id="li_Academia"
                    onClick={handleImportarArchivos}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "gerencia"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="submenuSidebar">
                      <FaUpload id="icons" />
                      Importar datos
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledImportarArchivos ? "active" : ""}
                    >
                      <li id="textLeftSelect">
                        <button
                          id="submenuSidebar"
                          onClick={() => setIsActiveImportarArchivos(true)}
                        >
                          <IoBookmarks id="icons" />
                          Datos proyectos - colaborador
                        </button>
                      </li>
                      <li id="textLeftSelect">
                        <button
                          id="submenuSidebar"
                          onClick={() => setIsActiveImportarArchivos_IHH(true)}
                        >
                          <IoBookmarks id="icons" />
                          Impugnación de horas
                        </button>
                      </li>
                    </ul>
                  </li>
                  {/* -----------------Cambia password ------------------------- */}

                  <li id="li_Academia">
                    {/* <Link to="/listadoEmpleados"> */}
                    <button id="submenuSidebar">
                      <ImBook id="icons" />
                      Perfil (CambiarPass)
                    </button>
                    {/* </Link> */}
                  </li>
                </Container>
              </div>
              <Logout></Logout>
            </ul>
          </div>
        </div>
      </section>
    </>
  );

  {
    /* <button
          
          variant="primary"
          onClick={showSidebar}
        >
          
        </button>

        
          <button
            style={{ zIndex: 100, position: "fixed" }}
            className="buttonStyleClose"
            variant="primary"
            onClick={closeSidebar}
          >
            
          </button>
          */
  }
}
