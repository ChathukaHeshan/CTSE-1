import React, { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import ViewMoreText from 'react-native-view-more-text';
import { Ionicons } from "@expo/vector-icons";
import { set } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firebase } from "../config";



const AdminScreen = ({ route, navigation }) => {

    const [data, setData] = useState([]);
    const dataRef = firebase.firestore().collection("products");
    const dataRefTrend = firebase.firestore().collection("trending");
    const [show, setshow] = useState(false);
    const [showBox, setShowBox] = useState(true);

    useEffect(() => {
        read();
    }, []);

  
    const read = () => {
        setshow(true)
        setTimeout(() => {
            setshow(false)
        }, 1000)
        dataRef
            .orderBy("createdAt", "desc")
            .onSnapshot((querySnapshot) => {
                const data = [];
                querySnapshot.forEach((doc) => {
                    const { imgURL } = doc.data();
                    const { name } = doc.data();
                    const { desc } = doc.data();
                    const { price } = doc.data();
                    const { category_name } = doc.data();

                    data.push({
                        id: doc.id,
                        imgURL,
                        name,
                        desc,
                        price,
                        category_name,
                    });
                });
                setData(data);
            });
    };

    // delete data
    const showConfirmDialog = (data) => {
        return Alert.alert(
            "",
            "Are you sure you want to remove this product?",
            [
                
                {
                    text: "Yes",
                    onPress: () => {
                        //console.log("User pressed Later")
                        dataRef.doc(data.id).delete()
                        dataRefTrend.doc(data.id).delete()
                            .then(() => {
                                alert("Deleted Successfully!");
                                console.log(" Data Deleted");
                            })
                            .catch((error) => {
                                alert("error");
                            });
                        setShowBox(false);
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };



    useEffect(() => {

        navigation.addListener("focus", () => {
            const backAction = () => {
                Alert.alert("Hold on!", "Are you sure you want to exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            };


            BackHandler.addEventListener("hardwareBackPress", backAction);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", backAction);
        });

    }, [navigation]);

    // Show more or less Text
    const renderViewMore = (onPress) => {
        return (
            <TouchableOpacity onPress={onPress} style={{ paddingTop: 10 }}>
                <Text style={styles.text1}>View More</Text>
            </TouchableOpacity>
        )
    }

    const renderViewLess = (onPress) => {
        return (
            <TouchableOpacity onPress={onPress} style={{ paddingTop: 10 }}>
                <Text style={styles.text1}>View Less</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.adminView}>
                    <Text style={styles.title}>Omega</Text>
                    <Text style={styles.adminText}>All Products</Text>


                </View>

                <View style={{ flex: 2, padding: 10, paddingTop: 0 }}>
                    <ActivityIndicator size="small" color="#f7d081" animating={show}></ActivityIndicator>
                    <FlatList
                        data={data}
                        keyExtractor={(_, i) => String(i)}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View
                                style={styles.Box}
                            >
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity

                                        onPress={() => {
                                            Alert.alert(
                                                "",
                                                "Do you want to update this item?",
                                                [
                                                    // The "Yes" button
                                                    {
                                                        text: "Yes",
                                                        onPress: () => {
                                                            navigation.navigate("UpdateProduct", { item })
                                                            setShowBox(false);
                                                        },
                                                    },
                                                    // The "No" button
                                                    // Does nothing but dismiss the dialog when tapped
                                                    {
                                                        text: "No",
                                                    },
                                                ]
                                            );
                                        }}

                                    >
                                        <MaterialCommunityIcons
                                            name="lead-pencil"
                                            size={25}
                                            color="#f7d081"
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.padd}>
                                        {item.category_name}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate("TrendProduct", { item })} style={{ left: 10, }}>
                                        <Text style={{ color: "#000", padding: 5, backgroundColor: "#f7d081", fontWeight: '700', borderRadius: 8 }}> Add to List </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => showConfirmDialog(item)} style={{ left: 27, }}>
                                        <Ionicons name="trash" color={"#f7d081"} size={30} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 10, flexDirection: "row" }}>
                                    <View>
                                        <Image
                                            style={styles.iimage}
                                            source={{ uri: item.imgURL }}
                                        />
                                    </View>
                                    <View style={{ padding: 10, }}>
                                        <Text style={styles.text}>
                                            {/*Name:*/}
                                            {item.name}
                                        </Text>
                                        <Text style={styles.text}>
                                            Price: LKR {item.price}
                                        </Text>
                                        <View style={{ width: 140 }}>
                                            <ViewMoreText
                                                numberOfLines={2}
                                                renderViewMore={renderViewMore}
                                                renderViewLess={renderViewLess}
                                                
                                            >
                                                <Text style={[styles.text, styles.decText]}>{item.desc}</Text>
                                            </ViewMoreText>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        )}
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#f7d081", padding: 20, borderRadius: 40 }}
                        onPress={() => navigation.navigate("CreateProduct")}
                    >
                        <MaterialCommunityIcons name="plus" size={30} color={"black"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AdminScreen;

const styles = StyleSheet.create({
    adminView: {
        padding: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'space-between',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        right: 0,
        bottom: 30,
        borderRadius: 100,
    },
    adminText: {
        fontSize: 20,
        color: "white",
        fontWeight: "500",
        letterSpacing: 1,
    },
    title: {
        color: "#f7d081",
        marginBottom: 12,
        fontSize: 23,
        marginLeft: "2%",
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
        color: "#fff",
        paddingBottom: 5,
        fontWeight: "500",
        letterSpacing: 1,
        width: 150,
    },
    iimage: {
        width: 150,
        height: 150,
        borderRadius: 15,
    },
    padd: {
        width: 100,
        marginLeft: '10%',
        color: '#f7d081',
        fontWeight: "bold",
        fontSize: 18,
    },
    Box: {
        padding: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#000",
        borderRadius: 15,
    },
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        paddingTop: 18,
        padding: 10
    },
    decText: {
        fontSize: 12,
        letterSpacing: 1.5,
        color: '#f7d081',
        fontWeight: 'bold',
    },
    tinyLogo: {
        width: 55,
        height: 55,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#fff",
    },
    text1: {
        fontSize: 13,
        color: "#fff",
        paddingBottom: 10,
        fontWeight: "500",
        letterSpacing: 1,
        width: 150,
    },
});
