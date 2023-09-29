import React from "react";
import tsoftLogo from "../../sources/LOGO-Tsoft-Alpha-FullColor.png";
import logoCoe from "../../sources/logoCoe.png";
import "../Header/HeaderStyles.css";

export default function HeaderExterno() {
  return (
    <>
      <div>
        <header>
          <div id="HeaderContainer">
              <img
                src={tsoftLogo}
                alt="logo Tsoft"
                id="logoTsoft"
              ></img>
            <h3 id="tituloPaginaHeader">Entorno Tsoft</h3>
            <img src={logoCoe} alt="logoCoe" id="logoCoe"></img>
          </div>
        </header>
      </div>
    </>
  );
}
