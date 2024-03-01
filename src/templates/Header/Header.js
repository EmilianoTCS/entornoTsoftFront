import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import tsoftLogo from "../../sources/LOGO-Tsoft-Alpha-FullColor.png";
import logoCoe from "../../sources/logoCoe.png";
import "../Header/HeaderStyles.css";
import SideBar from "../Sidebar/Sidebar";
import userLogo from "../../sources/User_logo.png";

export default function Header() {
  const [toggleSidebar, changeStatusSidebar] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));


  function limitarString(texto, limite) {
    if (texto.length <= limite) {
      return texto;
    } else {
      return texto.substring(0, limite);
    }
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: "#ECECEC",
                padding: "5px 5px 5px 5px",
                borderRadius: "10px",
                width: "230px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  // backgroundColor: "red",
                  borderRadius: "50%",
                  padding: "5px 20px 5px 20px",
                  border: "1px solid #e10b1c",
                  width: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    // backgroundColor: "red",
                    width: "18px",
                  }}
                  src={userLogo}
                  alt="userLogo"
                ></img>
              </div>
              <div
                data-html2canvas-ignore="true"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h5 style={{ fontSize: "10pt" }}>
                  {limitarString(userData.nomEmpleado, 22)}
                </h5>
                <h5 style={{ fontSize: "8pt" }}>
                  {userData.nomRol.toUpperCase()}
                </h5>
              </div>
            </div>
          </div>
        </header>
        <SideBar isToggled={toggleSidebar}></SideBar>
      </div>
    </>
  );
}
