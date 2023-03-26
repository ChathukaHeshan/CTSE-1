import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { FlatList, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native';
import { BackHandler } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const MyCart = ({ route, navigation }) => {
    //const [data, setData] = useState([]);
    const dataRef = firebase.firestore().collection("products");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [total, setTotal] = useState("");
    const isFocused = useIsFocused();


    //Getting user id
    const firestore = firebase.firestore;
    const auth = firebase.auth;
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(auth().currentUser.uid)
            .get()
            .then((user) => {
                setUser(user.data());
            });
    }, [isFocused]);
    const uid = user?.id;
    const urname = user?.username;
    console.log(uid);
    console.log('username', urname);

    const uaddress = user?.address;
    console.log('address', uaddress);

    var [id] = useState("");
    var [name, setName] = useState("");
    var [imgURL, setImageURL] = useState("");
    var [desc, setDesc] = useState("");
    var [price, setPrice] = useState("");
    var [qty, setQty] = useState("");

    const [cartList, setCartList] = useState([]);
    const [note, setNote] = useState("");

    useEffect(() => {
        navigation.addListener("focus", () => {
            //AsyncStorage.removeItem('carts');
            AsyncStorage.getItem("carts").then((data) => {
                if (data !== null) {
                    setCartList(JSON.parse(data));
                    console.log(JSON.parse(data));
                    let sum = 10;
                    JSON.parse(data).map((item) => {
                        sum += item.price * item.qty;
                    });
                    console.log(sum);
                    setTotal(sum);
                }
            });
        });
    }, []);

    console.log(cartList);

    const itemDelete = async (i) => {
        if (cartList.length > 0) {
            let cart = [...cartList];
            cart.splice(i, 1);
            setCartList(cart);
            console.log(cart);

            await AsyncStorage.setItem('carts', JSON.stringify(cart))

            AsyncStorage.getItem('carts').then((data) => {
                setCartList(JSON.parse(data));
                console.log(JSON.parse(data));

                let sum = 10;
                JSON.parse(data).map((item) => {
                    sum += item.price * item.qty;
                })

                console.log(sum);
                setTotal(sum)
            })
        }
    };

    useEffect(() => {
        itemDelete();
    }, [])

    useEffect(() => {
        navigation.addListener("focus", () => {
            function handleBackButtonClick() {
                navigation.navigate('Products');
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        })
    }, [navigation]);


    // Add pending Order to firebase database
    const order = async () => {
        // if (uid !== null) {
        await AsyncStorage.removeItem("carts");
        const cartOrder = {
            cartList,
            // "status" : "pending",
            "status": { pending: false },
            "total": total,
            "userid": user?.id,
            "username": user?.username,
            "phone": user?.phone,
            "address": user?.address,
            "note": note,
            'createdAt': timestamp,
            // "orderId" : 
        };
        firebase
            .firestore()
            .collection("orders")

            .doc(cartOrder.id)
            .set(cartOrder)
            .then(() => {
                console.log("Successfully order pending !!!");
                Alert.alert("Your Orders are pending. Plz wait for confirmation...")
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Products' }]
                    })
                )
            });
        // }
    };




    return (
        <View style={styles.container}>
            {
                cartList.length !== 0 ? (
                    <ScrollView>
                        <Text
                            style={{
                                fontSize: 20,
                                textAlign: "center",
                                fontWeight: "600",
                                color: "#fff",
                            }}
                        >
                            Order Details
                        </Text>

                        {
                            cartList.map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            padding: 10,
                                        }}
                                    >
                                        <Text style={styles.qtyText}>{item.qty} x</Text>
                                        <Image style={styles.iimage} source={{ uri: item.imgURL }} />
                                        <Text style={styles.text}> {item.name} </Text>
                                        <Text style={styles.priceText}> LKR {item.price} </Text>
                                        <TouchableOpacity onPress={() => itemDelete(index)} style={styles.icon}>
                                            <Ionicons name="trash" color={"#fc842d"} size={30} />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                            )
                        }

                        <View style={{ flex: 1.1 }}>

                            <View>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: "#f7d081",
                                        margin: 5,
                                    }}
                                >
                                    Delivery Information
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        padding: 5,
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>User ID</Text>
                                    <Text style={{ color: "#fff" }}>{user?.id}</Text>
                                </View>                     
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    padding: 5,
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Total</Text>
                                <Text style={{ color: "#fff" }}>LKR {total}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    padding: 5,
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Note</Text>
                                <TextInput
                                    style={styles.textBoxes}
                                    placeholder="Message..."
                                    onChangeText={(note) => setNote(note)}
                                    placeholderTextColor="#c4c4c2"
                                />
                            </View>
                            <TouchableOpacity onPress={order} style={styles.btn}>
                                <Text>Order</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                )
                    : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.noItem}>There is no item in your cart!</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <Text style={{ color: "#f7d081", fontSize: 18, marginTop: 14 }}>Let's Start Shopping </Text>
                                    <MaterialCommunityIcons
                                        name='shopping'
                                        style={{
                                            fontSize: 30,
                                            color: '#f7d081',
                                            margin: 10,
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
            }

        </View>
    );
};

export default MyCart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "black",
    },
    text: {
        paddingTop: 30,
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
        width: 130,
    },
    qtyText: {
        paddingTop: 30,
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
        width: 35,
    },
    priceText: {
        paddingTop: 30,
        
        color: "#fff",
        fontWeight: "500",
        width: 60,
    },
    icon: {
        paddingTop: 20,
    },

    noItem: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    }
});
