import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {updateAdmin} from "../AdminSlice"; 
const API_URL = process.env.REACT_APP_API_URL;

export default function Connexion() {
  const [option, setOption] = useState("connexion");
  const connexionForm = useRef();
  const inscriptionForm = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // if(localStorage.getItem("user_id")){
  //   console.log("CONNECTED");
  //   //Navigate("/profile");
  // }

  function verifInscriptionForm(form) {
    const verified = [];
    const mustBeVerified = [
      "firstname",
      "lastname",
      "email",
      "password",
      "passwordVerif",
    ];
    const firstname = document.querySelector("#firstname");
    const lastname = document.querySelector("#lastname");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const passwordVerif = document.querySelector("#confirm_password");
    const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    if (form.id === "inscription") {
      // firstname check
      if (
        firstname.value.length > 30 ||
        firstname.value.length < 1 ||
        firstname.value.match(/\d/) ||
        firstname.value.match(/\W/)
      ) {
        firstname.style.backgroundColor = "red";
        verified[0] = "";
      } else {
        firstname.style.backgroundColor = "green";
        verified[0] = "firstname";
      }
      // lastname check
      if (
        lastname.value.length > 30 ||
        lastname.value.length < 1 ||
        lastname.value.match(/\d/)
      ) {
        lastname.style.backgroundColor = "red";
        verified[1] = "";
      } else {
        lastname.style.backgroundColor = "green";
        verified[1] = "lastname";
      }
      // email check
      if (!email.value.match(regexEmail)) {
        email.style.backgroundColor = "red";
        verified[2] = "";
      } else {
        email.style.backgroundColor = "green";
        verified[2] = "email";
      }
      // password check
      if (password.value.length > 50 && password.value.length < 8) {
        password.style.backgroundColor = "red";
        verified[3] = "";
      } else {
        password.style.backgroundColor = "green";
        verified[3] = "password";
        // verif password check
        if (passwordVerif.value !== password.value) {
          passwordVerif.style.backgroundColor = "red";
          verified[4] = "";
        } else {
          passwordVerif.style.backgroundColor = "green";
          verified[4] = "passwordVerif";
        }
      }
    }
    if (JSON.stringify(verified) === JSON.stringify(mustBeVerified)) {
      return true;
    } else {
      return false;
    }
  }

  function levelPassword(password) {
    let level = 0;
    if (password.match(/[A-Z]/)) {
      level++;
    }
    if (password.match(/[a-z]/)) {
      level++;
    }
    if (password.match(/\W/)) {
      level++;
    }
    if (password.match(/\d/)) {
      level++;
    }
    return level;
  }

  function sendFormInscription(element, data) {
    if (verifInscriptionForm(element.target)) {
      fetch(`${API_URL}/user/inscription`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          if (res.status === "ok") {
            navigate("/");
          }
        })
        .catch((error) => console.error(error));
    }
  }

  function sendFormConnexion(data) {
    fetch(`${API_URL}/connexion`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status === "ok") {
          navigate("/");
        }
        if (res.status !== "fail") {
          localStorage.setItem("user_id", res.user_id);
          dispatch(updateAdmin(res.admin)); 
        }
      })
      .catch((error) => console.error(error));
  }

  function ConnexionForm() {
    return (
      <div className="connexion-form">
        <form
          id="connexion"
          encType="multipart/form-data"
          ref={connexionForm}
          onSubmit={async (e) => {
            e.preventDefault();
            let data = new FormData(connexionForm.current);
            sendFormConnexion(data);
          }}
        >
          <input name="email" type="email" id="email" placeholder="Email" />
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Mot de passe"
          />
          <button type="submit">Connexion</button>
        </form>
        <p>
          Vous n'avez pas de compte ?{" "}
          <button onClick={() => setOption("inscription")}>
            Inscrivez vous
          </button>
        </p>
      </div>
    );
  }

  function InscriptionForm() {
    return (
      <div className="inscription-form">
        <form
          encType="multipart/form-data"
          id="inscription"
          ref={inscriptionForm}
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(inscriptionForm.current);
            console.log(data.get("password"));
            sendFormInscription(e, data);
          }}
        >
          <input
            name="firstname"
            type="text"
            id="firstname"
            placeholder="Prenom"
            minLength={1}
            maxLength={30}
          />
          <input
            name="lastname"
            type="text"
            id="lastname"
            placeholder="Nom"
            minLength={1}
            maxLength={30}
          />
          <input name="email" type="text" id="email" placeholder="Email" />
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Mot de passe"
            onChange={(e) => {
              levelPassword(e.target.value);
            }}
          />
          <input
            name="confirm_password"
            type="password"
            id="confirm_password"
            placeholder="Confirmez le mot de passe"
          />
          <button type="submit">Inscrire</button>
        </form>
        <p>
          Vous avez déjà un compte ?{" "}
          <button onClick={() => setOption("connexion")}>Connectez vous</button>
        </p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <h1>{option[0].toUpperCase() + option.slice(1, option.length)}</h1>
      {option === "connexion" ? <ConnexionForm /> : <InscriptionForm />}
    </div>
  );
}
