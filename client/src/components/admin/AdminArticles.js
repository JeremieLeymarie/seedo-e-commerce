import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../../CartSlice";
const API_URL = process.env.REACT_APP_API_URL;

export default function ArticleListing() {
    const [data, setData] = useState(null);
    const cart = useSelector((state) => state.cart.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const form = useRef();
    const admin = localStorage.getItem("admin");
    const [refresh, setRefresh] = useState(null);

    useEffect(() => {

        fetch(`${API_URL}/article/all`)
            .then(res => res.json())
            .then(res => {
                res.forEach((e) => {
                    let str = "";
                    e.data.categories.forEach((elt) => {
                        str += elt.name + ", ";
                    });
                    e.data.categoriesName = str.slice(0, str.length - 2);
                });
                setData(res);

            })
            .catch(err => console.error(err));
    }, [refresh]);

    const editArticle = (id) => {
        navigate("/article/edit/" + id);
    }

    const add = (e) => {
        e.preventDefault();
        const data = new FormData(form.current);
        fetch(`${API_URL}/article/new`, {
            method: "POST",
            body: data,
        })
            .then(res => res.json())
            .then(res => {
                res.forEach((e) => {
                    let str = "";
                    e.data.categories.forEach((elt) => {
                        str += elt.name + ", ";
                    });
                    e.data.categoriesName = str.slice(0, str.length - 2);
                });
                setData(res);
            })
            .catch(err => console.error(err));

    };

    const deleteArticle = (id) => {
        fetch(`${API_URL}/article/delete/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "ok") {
                    setRefresh(Math.random());
                }
            })
            .catch((err) => console.error(err));
    }
    const computePrice = (e) => {
        return Math.round(parseFloat(e.promo > 0 ? e.price - (e.price * e.promo / 100) : e.price), 2);
    }

    if (data) {
        return (
            <div>
                <div className="wrapper">
                    <form encType="multipart/form-data" className="vertical-form" style={{ width: "50%", marginTop: "5rem" }} ref={form} onSubmit={add}>
                        <label>Nom de l'article</label>
                        <input name="name" type="text"></input>
                        <label>Description</label>
                        <textarea name="description"></textarea>
                        <label>Poids</label>
                        <input name="weight" type="text" ></input>
                        <label>Couleur</label>
                        <input name="color" type="text"></input>
                        <label>Quantité</label>
                        <input name="quantity" type="number"></input>
                        <label>Price</label>
                        <input type="number" name="price" ></input>
                        <label>Promo</label>
                        <input name="promo" type="number" min={0} max={100}></input>
                        <label>Catégorie(s)</label>
                        <input name="categories" type="text" placeholder="Catégorie 1, catégorie 2" minLength={0} maxLength={100}></input>
                        <input name="photo" type="text" placeholder="http://url_de_votre_image" defaultValue={""}></input>
                        <input type="submit" value="Ajouter cet article"></input>
                    </form>
                </div>
                {
                    data.map((e) => {
                        return (
                            <div key={e.data.id}>
                                <h3>{e.data.name}</h3>
                                {e.data.new &&
                                    <span className="new">Nouveauté !</span>
                                }
                                {e.data.quantity > 0
                                    ? <p>Etat du stock : {e.data.quantity}.</p>
                                    : <p>En rupture de stock</p>
                                }
                                {e.data.promo > 0
                                    ? <div>
                                        <p><strike>{e.data.price} €</strike><span className="promo"> -{e.data.promo}%</span></p>
                                        <p>{computePrice(e.data)} €</p>
                                    </div>
                                    : <p>{e.data.price} €</p>
                                }
                                <p>{e.data.categoriesName}</p>
                                {
                                    e.data.photos[0] &&
                                    <img src={e.data.photos[0].imgLink}></img>
                                }
                                < div >
                                    <button onClick={() => editArticle(e.data.id)}>Edit</button>
                                    <button onClick={() => deleteArticle(e.data.id)}>Delete</button>
                                </div>
                            </div >
                        )
                    })
                }

            </div >
        );
    }
    else {
        return (
            <p>Chargement en cours...</p>
        );
    }
}