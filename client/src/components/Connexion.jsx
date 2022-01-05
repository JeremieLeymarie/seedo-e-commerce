import React, { useState } from "react";

export default function Connexion() {
    const [option, setOption] = useState('connexion')

    function verifInscriptionForm(object){
        const firstname = document.querySelector('#firstname');
        const lastname = document.querySelector('#lastname');
        const email = document.querySelector('#email');
        const password = document.querySelector('#password');
        const passwordVerif = document.querySelector('#confirm-password');
        const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
        if(object.target.id === 'inscription'){
            // firstname check
            if (firstname.value.length > 30 || firstname.value.length < 1 || firstname.value.match(/\d/) || firstname.value.match(/\W/)){
                firstname.style.backgroundColor = 'red'
            } else {
                firstname.style.backgroundColor = 'green'
            }
            // lastname check
            if (lastname.value.length > 30 || lastname.value.length < 1 || lastname.value.match(/\d/) || lastname.value.match(/\W/)){
                lastname.style.backgroundColor = 'red'
            } else {
                lastname.style.backgroundColor = 'green'
            }
            // email check
            if(!email.value.match(regexEmail)){
                email.style.backgroundColor = 'red'
            } else {
                email.style.backgroundColor = 'green'
            }
            // password check
            if (password.value.length > 50 || password.value.length < 8){
                password.style.backgroundColor = 'red'
            } else {
                password.style.backgroundColor = 'green'
                // verif password check
                if(passwordVerif.value === password.value){
                    passwordVerif.style.backgroundColor = 'green'
                } else {
                    passwordVerif.style.backgroundColor = 'red'
                }
            }
        }
    }

    function levelPassword(password){
        let level = 0;
        if(password.match(/[A-Z]/)){
            level++
        }
        if(password.match(/[a-z]/)){
            level++
        }
        if(password.match(/\W/)){
            level++
        }
        if(password.match(/\d/)){
            level++
        }
        return level
    }

    function ConnexionForm(){
        return (
            <div className='connexion-form'>
                <form id="connexion" onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <label htmlFor="email">Email : <input type="email" id="email" placeholder="Email"/></label>
                    <label htmlFor="password">Password : <input type="password" id="password" placeholder="Mot de passe"/></label>
                    <button type="submit">Connexion</button>
                </form>
                <p>Vous n'avez pas de compte ? <button onClick={() => setOption('inscription')}>Inscrivez vous</button></p>
            </div>
                
        )
    }

    function InscriptionForm(){
        return (
            <div>
                <form id="inscription" onSubmit={(e) => {
                    e.preventDefault();
                    verifInscriptionForm(e);
                }}>
                    <label htmlFor="firstname">Prénom : <input type="text" id="firstname" placeholder="Prenom" minLength={1} maxLength={30}/></label>
                    <label htmlFor="lastname">Nom : <input type="text" id="lastname" placeholder="Nom" minLength={1} maxLength={30}/></label>
                    <label htmlFor="email">Email : <input type="text" id="email" placeholder="Email"/></label>
                    <label htmlFor="password">Mot de passe : <input type="password" id="password" placeholder="Mot de passe" onChange={(e)=>{levelPassword(e.target.value)}}/></label>
                    <label htmlFor="confirm-password">Confirmez le mot de passe : <input type="password" id="confirm-password" placeholder="Confirmez le mot de passe"/></label>
                    <button type="submit">Inscrire</button>
                </form>
                <p>Vous avez déjà un compte ? <button onClick={() => setOption('connexion')}>Connectez vous</button></p>
            </div>
        )
    }

    return (
        <>
            <h1>Lorem ipsum dolor sit amet.</h1>
            {option === 'connexion' ? <ConnexionForm /> : <InscriptionForm />}
        </>

    )
}