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
                  <li id="li_Academia">
                    <Link to="/listadoClientes/0">
                      <button id="submenuSidebar">
                        <IoIosPeople id="icons" />
                        Clientes
                      </button>
                    </Link>
                  </li>
                  {/* --------------------------------------------------- */}

                  <li id="li_Academia">
                    <Link to="/listadoEmpleados">
                      <button id="submenuSidebar">
                        <ImBook id="icons" />
                        Colaboradores
                      </button>
                    </Link>
                  </li>
                  {/* --------------------------------------------------- */}

                  <li
                    id="li_Academia"
                    onClick={handleChangeAcademia}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people"||
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
                    </ul>
                  </li>

                  {/* --------------------------------------------------- */}

                  <li
                    id="li_Academia"
                    onClick={handleChangeEvaluaciones}
                    className={
                      userData.nomRol === "administrador" ||
                      userData.nomRol === "people" ||
                      userData.nomRol === "alumno"

                        ? ""
                        : "private"
                    }
                  >
                    <button id="buttonSidebar">
                      <FaBook id="icons" />
                      Eval desempeño
                    </button>
                    <ul
                      id="COE_Academia"
                      className={isToggledEvaluaciones ? "active" : ""}
                    >
                      {/* ----------------------FORMS QUE NO SE USAN----------------------------- */}

                      {/* <li id="textLeftSelect">
                        <Link to="/FormularioAnEDD">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Analista
                          </button>
                        </Link>
                      </li>
                      <li id="textLeftSelect">
                        <Link to="/FormularioRefEDD">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Referente
                          </button>
                        </Link>
                      </li> */}
                      {/* --------------------------------------------------- */}

                      <li id="textLeftSelect">
                        <Link to="/listadoEddProyecto/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Proyecto
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/listadoEddEvaluacion/0">
                          <button id="submenuSidebar">
                            <ImBook id="icons" />
                            Evaluaciones
                          </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/listadoEvaluacionesPendientes">
                        <button id="submenuSidebar">
                          <ImBook id="icons" />
                          Formulario evaluaciones (Solo Usuario)
                        </button>
                        </Link>
                      </li>
                      {/* --------------------------------------------------- */}
                      <li id="textLeftSelect">
                        <Link to="/homePageEDD">
                        <button id="submenuSidebar">
                          <ImBook id="icons" />
                          Dashboard
                        </button>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* --------------------------------------------------- */}
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
