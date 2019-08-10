import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

import "./Main.css";

import api from "../services/api";

import logo from "../assets/logo.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ match }){
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);
    
    useEffect(() => {
        async function loadUsers(){
            const response = await api.get("/devs", {
                headers: {
                    user: match.params.id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io("http://localhost:3333", {
            query: {user: match.params.id}
        });

        socket.on("match", dev => {
            setMatchDev(dev);
        });

    }, [match.params.id]);

    async function handleLike(id){
        api.post(`/devs/${id}/likes`, null, {
            headers: {user: match.params.id},
        });

        setUsers(users.filter(user => user._id !== id));
    }
    async function handleDisLike(id){
        api.post(`/devs/${id}/dislikes`, null, {
            headers: {user: match.params.id},
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            <ul>
                {users.map(user => (
                    <li key={user._id}> 
                        <img src={user.avatar} alt={user.name}></img>
                        
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>

                        <div className="buttons">
                            <button type="button" onClick={() => handleDisLike(user._id)}> 
                                <img src={dislike} alt="Dislike"></img>
                            </button>
                            <button type="button" onClick={() => handleLike(user._id)}>
                                <img  src={like} alt="Like"></img>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            { matchDev && (
                <div className="match-Container">
                    <img src={itsamatch} alt="It's a match"/>
                    <img className="avatar" src={matchDev.avatar} alt=""/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>
                    <button onClick={() => setMatchDev(null)} type="button">Fechar</button>
                </div>
            ) }
        </div>    
    )
}