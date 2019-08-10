import React, {useEffect, useState} from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import io from "socket.io-client";

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from "../assets/itsamatch.png"

import api from "../services/api";

export default function Main({ navigation }){
    const [users, setUsers] = useState([]);
    const id = navigation.getParam("user");
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get("/devs", {
                headers: {
                    user: id,
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id])

    useEffect(() => {
        const socket = io("http://192.168.1.55:3333", {
            query: {user: id}
        });

        socket.on("match", dev => {
            setMatchDev(dev);
        });

    }, [id]);
    
    async function handleLike(){
        const [user, ... rest] = users;

        api.post(`/devs/${user._id}/likes`, null, {
            headers: {user: id},
        });

        setUsers(rest);
    }
    async function handleDisLike(){
        const [user, ... rest] = users;

        api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {user: id},
        });

        setUsers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate("Login");
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            
            <View style={styles.cardContainer}>
                { users.length == 0
                  ? <Text style={styles.vazio}>Acabou :(</Text>
                  : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                        <Image style={styles.avatar} source={{ uri: user.avatar }} />
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                        </View>
                    </View>
                    ))
                  )}
                
            </View>
            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleDisLike} style={styles.button}>
                        <Image source={dislike} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLike} style={styles.button}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            )}
            
            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image style={styles.matchImage} source={itsamatch}/>
                    <Image source={{ uri: matchDev.avatar}} style={styles.matchAvatar} />

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.matchClose}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 30
    },
    vazio:{
        alignSelf: "center",
        color: "#999", 
        fontSize: 24,
        fontWeight: "bold"
    },

    cardContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        margin: 30,
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,        
    },

    footer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 15,

    },

    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    
    bio: {
        fontSize: 14,
        color: "#999",
        marginTop: 5,
        lineHeight: 18
    },

    logo: {
        marginTop: 30
    },

    buttonsContainer: {
        flexDirection: "row",
        marginBottom: 30, 
    },
    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        elevation: 2
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    matchImage:{
        height:60,
        resizeMode: "contain",
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: "#fff",
        marginVertical: 30, 
    },
    matchName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        lineHeight: 24,
        textAlign: "center",
        paddingHorizontal: 30,
    },
    matchClose: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        textAlign: "center",
        marginTop: 30, 
        fontWeight: "bold"
    }
});
