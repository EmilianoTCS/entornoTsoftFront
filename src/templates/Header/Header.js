import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import tsoftLogo from "../../sources/LOGO-Tsoft-Alpha-FullColor.png";
import logoCoe from "../../sources/logoCoe.png";
import "../Header/HeaderStyles.css";
import SideBar from "../Sidebar/Sidebar";

export default function Header() {
  const [toggleSidebar, changeStatusSidebar] = useState(false);

  function handleSideBar() {
    changeStatusSidebar(true);
  }
  return (
    <>
      <div>
        <header>
          <div id="HeaderContainer">
            <Link to="/home">
              <img
                src={tsoftLogo}
                alt="logo Tsoft"
                id="logoTsoft"
                style={{ cursor: "pointer" }}
              ></img>
            </Link>
            <h3 id="tituloPaginaHeader">Entorno Tsoft</h3>
            <img src={logoCoe} alt="logoCoe" id="logoCoe"></img>
          </div>
        </header>
        <SideBar isToggled={toggleSidebar}></SideBar>
      </div>
    </>
  );
}
