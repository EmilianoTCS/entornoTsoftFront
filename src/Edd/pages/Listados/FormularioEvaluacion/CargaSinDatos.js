import React, { useState, useEffect,useContext } from "react";
import Header from "../../../../templates/Header/Header";
import "../TablasStyles.css";
import "../BtnInsertar.css";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

export default function CargaSinDatos() {
    const navigate = useNavigate();
    function handleLogout() {
        logout();
      }
      const { logout } = useContext(AuthContext);
    
    //PAGINADOR ---------------------
    function ListaVaciaAlerta() {

        Swal.fire({
            html: `<p>Ya completaste la lista asiganada de evaluados o la información requerida no existe.</p>`,
            icon: "success",
            background: 'white',
            showCancelButton: false,
            allowOutsideClick: false,
            allowEnterKey: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Continuar",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/login");
                handleLogout();
            }
        });

    }
    return (
        <>
            <Header></Header>
            <br></br>
            <br></br>
            <div>
                <ListaVaciaAlerta></ListaVaciaAlerta>

            </div>
        </>

    );
}
