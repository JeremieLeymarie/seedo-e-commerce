import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from "../CartSlice";
import Payment from "./Payment";
const API_URL = process.env.REACT_APP_API_URL;

export default function OrderConfirm() {
    const [userData, setUserData] = useState(null);
    const [user_id, setUserId] = useState(localStorage.getItem("user_id"));
    const navigate = useNavigate();
    const [selectedAdress, setSelectedAdress] = useState(null);
    const newAdressForm = useRef();
    const guestAdressForm = useRef();
    const CBForm = useRef();
    const cart = useSelector((state) => state.cart.value);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user_id !== null) {
            fetch(`${API_URL}/user/${user_id}`)
                .then((res) => res.json())
                .then((res) => setUserData(res.data))
                .catch((err) => console.error(err));
        }
        if (selectedAdress) {
            for (let elt of document.getElementsByClassName("order-adress")) {
                elt.classList.remove("selected-adress");
            }
            document
                .getElementById(selectedAdress.id)
                .classList.add("selected-adress");
        }
        /* eslint-disable */
    }, [selectedAdress, user_id]);

    const addAdress = (e) => {
        e.preventDefault();
        const data = new FormData(newAdressForm.current);
        fetch(`${API_URL}/user/${user_id}/adress`, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "ok") {
                    setUserData(res.data);
                }
            })
            .catch((error) => console.error(error));
        for (const elt of document.getElementsByClassName("input-profile")) {
            elt.value = "";
        }
    };

    const reduce = () => {
        let total = cart[0].price * cart[0].selectedQuantity;
        for (let i = 1; i < cart.length; i++) {
            total += cart[i].price * cart[i].selectedQuantity;
        }
        return total;
    };

    const addGuest = (e) => {
        e.preventDefault();
        const data = new FormData(guestAdressForm.current);
        fetch(`${API_URL}/user/inscription`,
            {
                method: "POST",
                body: data,
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.status !== "ok") {
                    setError(res.status);
                }
                if (res.user_id) {
                    setUserId(res.user_id);
                }
            })
            .catch(err => console.error(err));
    }

    if (userData) {
        return (
            <div>
                {error && <p className="error">{error}</p>}
                <p>Choisissez une adresse de livraison</p>
                <div className="order-confirm-adresses">
                    {userData.adresses.length > 0 ? (
                        <div>
                            {
                                userData.adresses.map((e) => {
                                    return (
                                        <div
                                            id={e.id}
                                            key={e.id}
                                            onClick={() => setSelectedAdress(e)}
                                            className="order-adress"
                                        >
                                            <p>
                                                {e.number} {e.street}{" "}
                                            </p>
                                            <p>
                                                {e.city} {e.postal_code}, {e.country}
                                            </p>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    ) : (
                        <div>
                            <form
                                className="vertical-form"
                                ref={newAdressForm}
                                onSubmit={addAdress}
                                encType="multipart/form-data"
                            >
                                <input
                                    required
                                    type="text"
                                    className="input-profile"
                                    name="number"
                                    placeholder="Numéro"
                                ></input>
                                <input
                                    required
                                    type="text"
                                    className="input-profile"
                                    name="street"
                                    placeholder="Rue"
                                ></input>
                                <input
                                    required
                                    type="text"
                                    className="input-profile"
                                    name="city"
                                    placeholder="Ville"
                                ></input>
                                <input
                                    required
                                    type="text"
                                    className="input-profile"
                                    name="postal_code"
                                    placeholder="Code Postal"
                                ></input>
                                <input
                                    required
                                    type="text"
                                    className="input-profile"
                                    name="country"
                                    placeholder="Pays"
                                ></input>
                                <input
                                    required
                                    type="submit"
                                    value="Utiliser cette adresse"
                                ></input>
                            </form>
                        </div>
                    )}
                </div>
                {selectedAdress

                    ? <Payment total={reduce()} selectedAddress={selectedAdress} />
                    : <p>Choisissez une adresse pour passer au paiement</p>
                }
            </div>
        );
    } else {
        if (user_id) {
            return <p>Chargement en cours...</p>;
        }
        else {
            return (
                <div>
                    <p>Rentrez vos informations ou <span style={{ cursor: "pointer" }} onClick={() => navigate("/auth")}><strong>connectez-vous</strong></span></p>
                    {error && <p className="error">{error}</p>}
                    <form
                        className="vertical-form"
                        ref={guestAdressForm}
                        onSubmit={addGuest}
                        encType="multipart/form-data"
                    >
                        <label>Prénom</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="firstname"
                            placeholder="John"
                        ></input>
                        <label>Nom</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="lastname"
                            placeholder="Doe"
                        ></input>
                        <label>Email</label>
                        <input
                            required
                            type="email"
                            className="input-profile"
                            name="email"
                            placeholder="john.doe@mail.com"
                        ></input>
                        <label>Numéro de rue</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="number"
                            placeholder="56"
                        ></input>
                        <label>Voie</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="street"
                            placeholder="Rue de la Mare"
                        ></input>
                        <label>Ville</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="city"
                            placeholder="Paris"
                        ></input>
                        <label>Code postal</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="postal_code"
                            placeholder="75001"
                        ></input>
                        <label>Pays</label>
                        <input
                            required
                            type="text"
                            className="input-profile"
                            name="country"
                            placeholder="France"
                        ></input>
                        <input
                            required
                            type="submit"
                            value="Utiliser cette adresse"
                        ></input>
                    </form>
                </div>
            );
        }
    }
}
