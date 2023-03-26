import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { firebase } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BackHandler } from "react-native";
import ViewMoreText from 'react-native-view-more-text';
import { ScrollViewBase } from "react-native";

const ProductDetail = ({ route, navigation }) => {
    const dataRef = firebase.firestore().collection("products");

    var [id] = useState(route.params.item.id);
    var [name, setName] = useState(route.params.item.name);
    var [imgURL, setImageURL] = useState(route.params.item.imgURL);
    var [desc, setDesc] = useState(route.params.item.desc);
    var [price, setPrice] = useState(route.params.item.price);
    var [qty, setQty] = useState(route.params.item.qty);


    const addToCart = () => {
        AsyncStorage.getItem("carts").then((data) => {
            if (data == null) {
                let cartItem = [{
                    id: id,
                    name: name,
                    imgURL: imgURL,
                    desc: desc,
                    price: price,
                    qty: count
                }]
                AsyncStorage.setItem("carts", JSON.stringify(cartItem))
                Alert.alert("Your Product have successfully added to cart.")
                navigation.navigate('MyCart')
            } else {
                let datas = JSON.parse(data);
                console.log(id, name)

                let cartItem;

                cartItem = {
                    id: id,
                    name: name,
                    imgURL: imgURL,
                    desc: desc,
                    price: price,
                    qty: count
                };


                const updatedArr = datas.findIndex((p) => p.id === id);

                console.log(updatedArr, "updatedArr")

                if (updatedArr != -1) {
                    datas[updatedArr].qty += count;
                }
                else {
                    datas.push(cartItem)
                    console.log(cartItem, ' = cartItem')
                }
                console.log("data = ", datas)
                AsyncStorage.setItem("carts", JSON.stringify(datas)).then(() => {
                    Alert.alert("updated add to cartItem")
                    navigation.navigate('MyCart')
                })
            }
        })
    }

    const [count, setCount] = useState(1);

    const increase = (item) => {
        setCount(count + 1)
    }

    const decrease = (item) => {
        if (count <= 1) {
            count === 0;
            navigation.navigate('ProductDetail', { item })
        } else {
            setCount(count - 1);
        }
    }

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

        <View style={styles.container}>
           
           
            <Image style={styles.iimage} source={{ uri: imgURL }} />
            <ScrollView>
                <View>
            <View>
               
                <Text style={styles.text}>Name : {name}</Text>
                <Text style={styles.text}>Price : LKR {price}</Text>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={styles.text}>Qty : </Text>
                    <View style={{ padding: 5, borderWidth: 1, borderColor: '#f7d081', paddingTop: 10, }}>
                        <MaterialCommunityIcons name="minus" size={20} color={'#f7d081'}
                            onPress={decrease} />
                    </View>
                    <Text style={styles.textcount}>{count}</Text>
                    <View style={{ padding: 5, borderWidth: 1, borderColor: '#f7d081', paddingTop: 10, }}>
                        <MaterialCommunityIcons name="plus" size={20} color={'#f7d081'}
                            onPress={increase} />
                    </View>
                </View>
            <View style={{padding:10}}>
                      <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                    >
                    
                            <Text style={styles.text}>Description : {desc}</Text>
                          
                      </ViewMoreText>
                  
                      </View> 
                </View>
                
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={addToCart}
                    >
                        <Text style={{ fontSize: 16, color: '#444', fontWeight: 'bold' }}>Add To Cart</Text>
                </TouchableOpacity>
                
                </View>
                </View>
                </ScrollView>
            </View>
      
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        //alignItems: "center",
        justifyContent: 'flex-start',
    },
    iimage: {
        width: '95%',
        height: '45%',
        borderRadius: 20,
        margin: 10
    },
    expoView: {
        fontSize: 24,
        color: "gold",
        fontWeight: "500",
        letterSpacing: 1,
        marginBottom: 5,
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "white",
        padding: 15,
        width: '90%',
        borderRadius: 15, marginTop: -20, margin: 15,
    },
    textcount: {
        //marginTop: 10,
        fontSize: 16,
        color: '#f7d081',
        fontWeight: "400",
        letterSpacing: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#f7d081'
    },
    text: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "400",
        letterSpacing: 1,
        padding: 10
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