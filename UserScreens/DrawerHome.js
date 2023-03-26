import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Dimensions,
    Animated,
} from "react-native";
import { BackHandler } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import { firebase } from "../config";
import { SearchBar } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import UserTrendList from "./UserTrendList";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ImageHome = [
];

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ANCHO_CONTENEDOR = width * 0.7;
const ESPACIO_LATERAL = (width - ANCHO_CONTENEDOR) / 2;
const ESPACIO = 10;
const ALTURA_BACKDROP = height * 0.5;

function BackDrop({ scrollX }) {
    const firestore = firebase.firestore;
    const auth = firebase.auth;
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const dataRef = firebase.firestore().collection("products");
    const [search, setSearch] = useState("");
    const [filterProduct, setFilterProduct] = useState([]);
    const isFocused = useIsFocused();
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




    return (
        <View
            style={
                ([
                    {
                        height: ALTURA_BACKDROP,
                        width,
                        position: "absolute",
                        top: 0,
                    },
                ],
                    StyleSheet.absoluteFillObject)
            }
        >
            {ImageHome.map((imagen, index) => {
                const inputRange = [
                    (index - 1) * ANCHO_CONTENEDOR,
                    index * ANCHO_CONTENEDOR,
                    (index + 1) * ANCHO_CONTENEDOR,
                ];

                const outputRange = [0, 1, 0];
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange,
                });

                return (
                    <Animated.Image
                        source={{ uri: imagen }}
                        key={index}
                        blurRadius={3}
                        style={[
                            {
                                height: ALTURA_BACKDROP,
                                width,
                                position: "absolute",
                                top: 0,
                                opacity,
                            },
                        ]}
                    />
                );
            })}
            <LinearGradient
                colors={["transparent", "white"]}
                style={{ height: ALTURA_BACKDROP, width, position: "absolute", top: 0 }}
            />

            <Animatable.View animation="fadeInUp" duration={2000}>
                <Animatable.View
                    animation="pulse"
                    direction='alternate'
                    iterationCount='infinite'
                >
                    <Text style={styles.label1}>Welcome {user?.username}!</Text>
                </Animatable.View>
                <Text style={styles.label2}> Find the best products</Text>

            </Animatable.View>
        </View>
    );
}

export default function DrawerHome({ navigation }) {

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

    const scrollX = React.useRef(new Animated.Value(0)).current;

    const [data, setData] = useState([]);
    const dataRef = firebase.firestore().collection("products");
    const [search, setSearch] = useState("");
    const [filterProduct, setFilterProduct] = useState([]);
    useEffect(() => {
        read();
    }, []);

    // Search item
    useEffect(() => {
        setFilterProduct(
            data.filter(
                (res) =>
                    res.name.toLowerCase().includes(search.toLowerCase()) ||
                    res.desc.toLowerCase().includes(search.toLowerCase()) ||
                    res.category_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, data]);


    // read data
    const read = () => {

        dataRef.orderBy('name', 'desc').onSnapshot((querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                const { imgURL } = doc.data();
                const { name } = doc.data();
                const { desc } = doc.data();
                const { price } = doc.data();
                const { qty } = doc.data();
                const { category_name } = doc.data();

                data.push({
                    id: doc.id,
                    imgURL,
                    name,
                    desc,
                    price,
                    qty,
                    category_name,
                });
            });
            setData(data);
        });
    };






    return (
        <SafeAreaView style={styles.container}>
            <View>

                <SearchBar
                    placeholder="Search"
                    onChangeText={(search) => setSearch(search)}
                    value={search}
                />

                {search.length ? (

                    <KeyboardAwareScrollView>
                        <Text>

                            {filterProduct.map((item, index) => (

                                <View key={index} style={{ flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("ProductDetail", { item })}
                                    >

                                        <View>
                                            <Image
                                                style={styles.iimage1}
                                                source={{ uri: item.imgURL }}
                                            />
                                        </View>

                                        <Text style={{ color: "#000", fontSize: 18 }}>{item.name.substr(0, 10)}</Text>


                                    </TouchableOpacity>
                                </View>

                            ))}
                        </Text>
                    </KeyboardAwareScrollView>
                ) : null}
            </View>
            <ScrollView>
                <BackDrop scrollX={scrollX} />

                <View>
                    <Animated.FlatList
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: { contentOffset: { x: scrollX } },
                                },
                            ],
                            { useNativeDriver: true }
                        )}
                        data={ImageHome}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: 200,
                            marginHorizontal: ESPACIO_LATERAL,
                        }}
                        decelerationRate={0}
                        snapToInterval={ANCHO_CONTENEDOR}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => {
                            const inputRange = [
                                (index - 1) * ANCHO_CONTENEDOR,
                                index * ANCHO_CONTENEDOR,
                                (index + 1) * ANCHO_CONTENEDOR,
                            ];

                            const outputRange = [0, -50, 0];
                            const translateY = scrollX.interpolate({
                                inputRange,
                                outputRange,
                            });

                        }}
                    />
                </View>
                <ScrollView
                    style={{ flexDirection: "row" }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={[styles.bottom]}
                        onPress={() => navigation.navigate("Products")}
                    >

                    </TouchableOpacity>
                </ScrollView>

                <ScrollView nestedScrollEnabled={true} style={{ width: "100%" }} >
                    <Animatable.View
                        animation="fadeInUp"
                        duration={3000}
                        style={styles.row}>
                        <ScrollView horizontal={true} style={{ width: "100%" }}>
                            <UserTrendList />
                        </ScrollView>
                    </Animatable.View>
                </ScrollView>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",

    },
    posterImage: {
        width: "100%",
        height: ANCHO_CONTENEDOR * 1.2,
        resizeMode: "cover",
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
    label1: {
        fontSize: 16,
        color: "white",
        padding: 10,
        fontWeight: "300",
        marginBottom: 18,
    },
    label2: {
        fontSize: 21,
        color: "white",
        paddingLeft: 10,
        fontWeight: "700",
        marginBottom: 30,
        letterSpacing: 1,
    },

    label: {
        fontSize: 18,
        color: "gold",
        fontWeight: "bold",
        padding: 10,
    },
    row: {
        flexDirection: "row",
        shadowColor: "gray",
        shadowOffset: { width: 5, height: 7 },
        shadowOpacity: 0.8,
        elevation: 15,
    },
});


