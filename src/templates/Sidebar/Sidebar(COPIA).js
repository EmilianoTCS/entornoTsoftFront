import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Sidebar/SidebarStyles.css";
import Logout from "../../services/Logout";
import userLogo from "../../sources/User_logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Offcanvas } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import FlechaTsoft from "../../templates/img/FlechaTsoft/FlechaTsoft";

import { BsCalendarDayFill } from "react-icons/bs";
import { MdSwitchAccount } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { FaBook } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { IoIosPeople } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoMdListBox } from "react-icons/io";
import { GoTasklist } from "react-icons/go";
import { GiArchiveRegister, GiStarFormation, GiPadlock } from "react-icons/gi";
import { BsFillPersonLinesFill, BsFillPeopleFill } from "react-icons/bs";
import { IoBookmarks } from "react-icons/io5";
import { ImAddressBook } from "react-icons/im";
import { MdEmojiPeople } from "react-icons/md";
import { GiBookCover, GiNetworkBars } from "react-icons/gi";
import { FaPeopleCarry } from "react-icons/fa";
import { SiGitbook, SiBookstack } from "react-icons/si";
import { TiThList } from "react-icons/ti";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";

export default function SideBar(props) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isToggledAdmin, setToggleAdmin] = useState(false);
  const [isToggledEvaluaciones, setToggleEvaluaciones] = useState(false);
  const [isToggledAcademia, setToggleAcademia] = useState(false);
  const [isToggledAsistencias, setToggleAsistencias] = useState(false);
  const [isToggledColaboradores, setToggleColaboradores] = useState(false);
  const [isToggledTsoft, setToggleTsoft] = useState(false);
  const [show, setShow] = useState(props.isToggled);
  const closeSidebar = () => setShow(false);
  const showSidebar = () => setShow(true);

  function handleChangeAdmin() {
    setToggleAdmin(!isToggledAdmin);
  }

  function handleChangeEvaluaciones() {
    setToggleEvaluaciones(!isToggledEvaluaciones);
  }
  function handleChangeTsoft() {
    setToggleTsoft(!isToggledTsoft);
  }

  function handleChangeAcademia() {
    setToggleAcademia(!isToggledAcademia);
  }
  function handleChangeAsistencias() {
    setToggleAsistencias(!isToggledAsistencias);
  }
  function handleChangeColaboradores() {
    setToggleColaboradores(!isToggledColaboradores);
  }

  return (
    <>
      <section>
        <button
          className="buttonStyleOpen"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
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
              <div>
                <Container id="textLeft">
                  <li>
                    <Link
                      id="li_home"
                      to={
                        userData.nomRol === "administrador" ||
                        userData.nomRol === "capital_humano"
                          ? "/home"
                          : "/homeColaboradores"
                      }
                    >
                      <button id="buttonSidebar">
                        <IoHome id="icons" />
                        HOME
                      </button>
                    </Link>
                  </li>
                  {/* <li
                    className={
                      userData.nomRol !== "colaborador" ? "private" : ""
                    }
                  >
                    <Link to="/MisCursos">
                      <button id="submenuSidebar">
                        <GiBookCover id="icons" />
                        Mis Cursos
                      </button>
                    </Link>
                  </li>
                  <li
                    className={
                      userData.nomRol !== "colaborador" ? "private" : ""
                    }
                  >
                    <Link to="/InscripcionCurso">
                      <button id="submenuSidebar">
                        <GiArchiveRegister id="icons" />
                        Inscribirse a un curso
                      </button>
                    </Link>
                  </li>
                  <li
                    id="li_Academia"
                    onClick={handleChangeAdmin}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "capital_humano"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <GiPadlock id={"icons"}></GiPadlock>ADMINISTRADOR
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledAdmin ? "active" : ""}
                    >
                      <li id="textLeftSelect">
                        <Link to="/Administrador/clientes/0">
                          <button id="submenuSidebar">
                            <BsFillPeopleFill id="icons" />
                            Clientes
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/colaborador/1">
                          <button id="submenuSidebar">
                            <BsFillPersonLinesFill id="icons" />
                            Colaborador
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/cursos/2">
                          <button id="submenuSidebar">
                            <GiBookCover id="icons" />
                            Cursos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/EDDAnalistas/3">
                          <button id="submenuSidebar">
                            <SiGitbook id="icons" />
                            EDD Analistas
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/EDDReferentes/4">
                          <button id="submenuSidebar">
                            <SiBookstack id="icons" />
                            EDD Referentes
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/empleados/5">
                          <button id="submenuSidebar">
                            <MdEmojiPeople id="icons" />
                            Empleados
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/equipos/6">
                          <button id="submenuSidebar">
                            <FaPeopleCarry id="icons" />
                            Equipos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/proyectos/7">
                          <button id="submenuSidebar">
                            <GiNetworkBars id="icons" />
                            Proyectos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/ramos/8">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Ramos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/Administrador/relator/9">
                          <button id="submenuSidebar">
                            <ImAddressBook id="icons" />
                            Relator
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li
                    id="li_Academia"
                    onClick={handleChangeTsoft}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "capital_humano"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <FlechaTsoft id={"icons"}></FlechaTsoft>ENTORNO TSOFT
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledTsoft ? "active" : ""}
                    ></ul>
                  </li>*/}

                  <li
                    id="li_Academia"
                    onClick={handleChangeAcademia}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "capital_humano"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <FaBook id="icons" />
                      FACTORY DEVOPS
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledAcademia ? "active" : ""}
                    >
                      {/* <li id="textLeftSelect">
                        <Link to="/listadoAlumnos">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Alumnos
                          </button>
                        </Link>
                      </li> */}
                      <li id="textLeftSelect">
                        <Link to="/listadoClientes/0">
                          <button id="submenuSidebar">
                            <IoIosPeople id="icons" />
                            Clientes
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoContacto/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Contacto
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoCursos/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Cursos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoCursoAlumnos/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Curso Alumnos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoCursoAlumnoSesion/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Curso Alumnos Sesion
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEmpleados">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Colaboradores
                          </button>
                        </Link>
                      </li>

                      {/* <li id="textLeftSelect">
                        <Link to="/listadoEquipos">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Equipos
                          </button>
                        </Link>
                      </li> */}
                      {/* <li id="textLeftSelect">
                        <Link to="/ListadoAsistencias">
                          <button id="submenuSidebar">
                            <TiThList id="icons" />
                            Listado de Asistencias
                          </button>
                        </Link>
                      </li>

                      <li id="textLeftSelect">
                        <Link to="/listadoColaboradores">
                          <button id="submenuSidebar">
                            <IoMdListBox id="icons" />
                            Listado de Colaboradores
                          </button>
                        </Link>
                      </li> */}
                      {/* <li id="textLeftSelect">
                        <Link to="/Prerequisitos">
                          <button id="submenuSidebar">
                            <GoTasklist id="icons" />
                            Prerequisitos
                          </button>
                        </Link>
                      </li> */}

                      {/* <li id="textLeftSelect">
                        <Link to="/listadoProyectos">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Proyectos
                          </button>
                        </Link>
                      </li> */}
                      <li id="textLeftSelect">
                        <Link to="/listadoNotaExamen/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Nota Examen
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoRamos/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Ramos
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoRamoExamen/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Ramo Examen
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoRelatorRamo/0">
                          <button id="submenuSidebar">
                            <IoBookmarks id="icons" />
                            Relator Ramo
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoReqCurso/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Requerimiento Curso
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoServicios/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Servicios
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoSesiones/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Sesiones
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li
                    id="li_Academia"
                    onClick={handleChangeEvaluaciones}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "capital_humano"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <FaBook id="icons" />
                      EDD
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledEvaluaciones ? "active" : ""}
                    >
                    
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalCompetencia">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Edd Eval Competencia
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalPregunta/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Eval pregunta
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalProyEmp/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Eval Proy Emp
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalProyResp/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Eval Proy Resp
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvalRespPreg/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Eval resp pregunta
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvaluacion/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Evaluación
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddProyecto/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            EddProyecto
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEddProyEmp/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            EddProyEmp
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEmpSubsist/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            EmpSubsist
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/listadoEmpTipoPerfil/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            EmpTipoPerfil
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* <li
                    id="li_Academia"
                    onClick={handleChangeEvaluaciones}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "capital_humano"
                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <GiStarFormation id="icons" />
                      EVAL. DE DESEMPEÑO
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledEvaluaciones ? "active" : ""}
                    >
                      <li id="textLeftSelect">
                        <Link to="/FormularioAnEDD">
                          <button id="submenuSidebar">
                            <GiStarFormation id="icons" />
                            Form. An./Automat.
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/FormularioRefEDD">
                          <button id="submenuSidebar">
                            <GiStarFormation id="icons" />
                            Form. Ref.
                          </button>
                        </Link>
                      </li>
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "capital_humano"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/EDD/ListadoAnalistas">
                          <button id="submenuSidebar">
                            <GiStarFormation id="icons" />
                            List. An./Automat.
                          </button>
                        </Link>
                      </li>
                      <li
                        id="textLeftSelect"
                        className={
                          userData.nomRol === "administrador" ||
                          userData.nomRol === "capital_humano"
                            ? ""
                            : "private"
                        }
                      >
                        <Link to="/EDD/ListadoReferentes">
                          <button id="submenuSidebar">
                            <GiStarFormation id="icons" />
                            List. Ref.
                          </button>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link id="li_calendario" to="/Calendario">
                      <button id="buttonSidebar">
                        <BsCalendarDayFill id="icons" />
                        CALENDARIO
                      </button>
                    </Link>
                  </li>

                  <li
                    id="li_Colaboradores"
                    onClick={handleChangeColaboradores}
                    className={
                      userData.nomRol !== "colaborador" ? "private" : ""
                    }
                  >
                    <button id="buttonSidebar">
                      <MdSwitchAccount id="icons" />
                      MI PERFIL
                    </button>
                    <ul
                      id="Colaboradores"
                      className={isToggledColaboradores ? "active" : ""}
                    ></ul>
                  </li> */}
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
