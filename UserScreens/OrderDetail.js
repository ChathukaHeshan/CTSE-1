import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { firebase } from "../config";
import { BackHandler } from "react-native";

export default function OrderDetail({ navigation }) {

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
                console.log("user id ==", user.data().id);
                read(user.data().id);
            });
    }, []);
    const uid = user?.id;
    const urname = user?.username;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const [data, setData] = useState([]);
    const [cartList, setCartList] = useState([]);
    const dataRef = firebase.firestore().collection("orders");


    const read = (userId) => {

        console.log("inside read function", userId);

        dataRef.where("userid", "==", userId)
            .onSnapshot((querySnapshot) => {
                const data = [];

                querySnapshot.forEach((doc) => {

                    const { userid } = doc.data();
                    const { address } = doc.data();
                    const { cartList } = doc.data();
                    const { phone } = doc.data();
                    const { total } = doc.data();
                    const { username } = doc.data();
                    const { status } = doc.data();
                    const { note } = doc.data();

                    setCartList(doc.data().cartList);

                    data.push({
                        id: doc.id,
                        address,
                        cartList,
                        phone,
                        total,
                        userid,
                        username,
                        status,
                        note,

                    });
                });
                setData(data);
            });

    };
    useEffect(() => {
        // read();
    }, []);

    useEffect(() => {
        navigation.addListener("focus", () => {
            function handleBackButtonClick() {
                navigation.goBack();
                return true;
            }

            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        })
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={{ flex: 1, padding: 10 }}>
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={true}
                    style={{ flex: 1, marginTop: 16 }}
                    keyExtractor={(_, i) => String(i)}
                    renderItem={({ item }) => (
                        <View>
                            <View style={{
                                borderWidth: 1, borderColor: 'gold', backgroundColor: "#000", padding: 10, borderRadius: 10,
                                marginBottom: 10
                            }}>
                                <ScrollView>

                                    <View>
                                        {
                                            item.status.pending === true ?
                                                (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <MaterialCommunityIcons name="marker-check" size={35} color={'green'} />
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'gold', textAlign: 'center', paddingLeft: 30, paddingRight: 30 }}>Your Order is{item.status.pending} Confirmed</Text>
                                                    </View>
                                                )
                                                :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <MaterialCommunityIcons name="alert" size={35} color={'orange'} />
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'gold', textAlign: 'center', paddingLeft: 30, paddingRight: 30 }}>Your Order is{item.status.pending} Pending</Text>


                                                </View>
                                        }


                                        <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>OrderList</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <MaterialCommunityIcons name="cash-100" color={'#f7d081'} size={25} />
                                            <Text style={styles.textInfo}>LKR {item.total}</Text>
                                        </View>

                                        <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Your Info</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <MaterialCommunityIcons name="account" color={'white'} size={25} />
                                            <Text style={styles.textInfo}>{item.username}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={styles.textInfo}>{item.phone}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={styles.textInfo}>{item.address}</Text>
                                        </View>
                                        
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    adminText: {
        fontSize: 20,
        color: "white",
        fontWeight: "500",
        letterSpacing: 1,
        padding: 20,
        textAlign: 'center',
    },
    textBoxes: {
        width: '60%',
        marginLeft: 20,
        fontSize: 16,
        padding: 10,
        borderColor: 'black',
        borderBottomWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        color: "black"
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        letterSpacing: 1,

    },
    textInfo: {
        fontSize: 16,
        color: "#f7d081",
        fontWeight: "500",
        letterSpacing: 1,
        padding: 5,
        paddingTop: 8
    },
    padd: {
        color: 'gold',
        fontWeight: "bold",
        fontSize: 18,
        textAlign: 'center',
    },
    Box: {
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "gray",
        borderRadius: 15,
        padding: 10
    },
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        justifyContent: "flex-start",
    },
    decText: {
        fontSize: 10,
        color: 'gold',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#f7d081',
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: "center",
        padding: 10,
        justifyContent: 'center'
    },
    noItem: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    }
})
