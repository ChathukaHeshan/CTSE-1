import { StyleSheet, Text, View, ActivityIndicator, Alert, Image, ScrollView, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import { CommonActions } from '@react-navigation/native'
import * as ImagePicker from "expo-image-picker";
import SelectDropdown from 'react-native-select-dropdown';
import { BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const CreateProduct = ({ navigation }) => {

    const dataRef = firebase.firestore().collection('products')

    const [productName, setProductName] = useState('');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState({});

    const [data, setData] = useState([]);
    const catRef = firebase.firestore().collection('categories');
    const [name, setName] = useState('')
    const [selectedItem, setSelectedItem] = useState();

    const [show, setshow] = useState(false);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imgURL, setImageURL] = useState("");

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        const source = { uri: result.uri };
        console.log(source);
        setImage(source);
    };


    useEffect(() => {
        readCat();
    }, [])

    const readCat = () => {
        catRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const data = []
                    querySnapshot.forEach((doc) => {
                        const { name } = doc.data()

                        data.push({
                            id: doc.id,
                            name,
                        })
                    })
                    setData(data)
                }
            )
    }

    const add = async () => {
        setshow(true)
        setTimeout(() => {
            setshow(false)
        }, 4000)

        if (!image) {
            setError((prev) => {
                setshow(false)
                return {
                    ...prev,
                    image: 'Please select image',
                }
            })
        }

        if (!productName) {
            setError((prev) => {
                setshow(false)
                return {
                    ...prev,
                    productName: 'Please Enter Name',
                }
            })
        }

        if (!desc) {
            setError((prev) => {
                setshow(false)
                return {
                    ...prev,
                    desc: 'Please Enter Description',
                }
            })
        }

        if (!selectedItem) {
            setError((prev) => {
                setshow(false)
                return {
                    ...prev,
                    selectedItem: 'Please choose option',
                }
              
            })
        } else {
            if (
                (image !== null) ||
                (productName && productName.length > 0) ||
                (desc && desc.length > 0) ||
                (price && price.length > 0) ||
                (category && category.length > 0)
            ) {
                setUploading(true);
                const response = await fetch(image.uri);
                const blob = await response.blob();
                const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
                var ref = firebase.storage().ref("products_images/").child(filename).put(blob);
                try {
                    await ref;  
                } catch (e) {
                    console.log(e);
                }
                const setImageURL = await firebase.storage().ref(`products_images/${filename}`).getDownloadURL();
                console.log("print ref :", setImageURL);
    
                setUploading(false);
      
                const FireImage = { fireuri: filename };
                console.log(FireImage);  
    
                setImage(null);
    
                const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    
                console.log("Database Image ", imgURL);
    
                const data = {
                    imgURL: setImageURL,
                    name: productName,
                    desc: desc,
                    price: parseFloat(price),
                    category_id: selectedItem.id,
                    category_name: selectedItem.name,
                    createdAt: timestamp,
                };
                try {
                    await dataRef.add(data);
                    setProductName("");
                    setDesc("");
                    setPrice("");
                    Alert.alert("Successfully added!");
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Admin" }],
                      })
                    );
                  } catch (error) {
                    alert(error);
                  }
            }

        }
    };

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
            <KeyboardAwareScrollView>
                <View style={styles.imageContainer}>
                    {image && (
                        <Image
                            source={{ uri: image.uri }}
                            style={{ width: 150, height: 150 }}
                        />
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.selectButton, styles.ImgBot]}
                    onPress={pickImage}
                >
                    <Text> Pick an Image</Text>                    
                </TouchableOpacity>
                {!image && 
                        <Text style={{ color: 'red', fontSize: 18, fontWeight: '300', marginLeft: '30%' }}>{error.image}</Text>
                }


                <TextInput
                    style={styles.input}
                    placeholder='Name'
                    onChangeText={(text) => setProductName(text)}
                    value={productName}
                    placeholderTextColor="#c4c4c2"
                />
                {
                    !productName && 
                    <Text style={{ color: 'red', fontSize: 18, fontWeight: '300', marginLeft: 60 }}>{error.productName}</Text>
                }

                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    style={styles.inputDesc}
                    placeholder='Description'
                    onChangeText={(text) => setDesc(text)}
                    value={desc}
                    placeholderTextColor="#c4c4c2"
                />
                {
                    !desc && 
                    <Text style={{ color: 'red', fontSize: 18, fontWeight: '300', marginLeft: 60 }}>{error.desc}</Text>
                }

                <View style={styles.select}>
                    <SelectDropdown
                        data={data}
                        onSelect={(selectedItem, index) => {
                            setSelectedItem(selectedItem);
                            console.log(selectedItem, index)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.name
                        }}

                        rowTextForSelection={(item, index) => {
                            return item.name
                        }}
                        
                    />
                   {!selectedItem  &&
                                  <Text style={{ color: 'red', fontSize: 18, fontWeight: '300' }}>{error.selectedItem}</Text>
                                }
                </View>

                <View style={{ justifyContent: "center", alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff700" animating={show} style={{ marginTop: -15, paddingBottom: 10, }}></ActivityIndicator>
                    <TouchableOpacity style={styles.btn} onPress={() => add()}>
                        <Text> Create </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default CreateProduct

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },

    select: {
        borderWidth: 1,
        borderColor: 'black',
        marginHorizontal: 89,
        marginBottom: 20,
    },

    input: {
        marginLeft: 60,
        width: '70%',
        fontSize: 18,
        paddingLeft: 10,
        borderColor: '#f7d081',
        borderBottomWidth: 2,
        color: '#fff',
        borderRadius: 10,
        paddingTop: 5,
        marginBottom: 5,
    },
    inputDesc: {
        marginLeft: 60,
        width: '70%',
        fontSize: 18,
        paddingLeft: 10,
        borderColor: '#f7d081',
        borderBottomWidth: 2,
        color: '#fff',
        borderRadius: 10,
       
    },

    btn: {
        backgroundColor: "#f7d081",
        width: "30%",
        padding: 10,
        borderRadius: 5,
        color: "#000",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    imageContainer: {
        marginLeft: "30%",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "lightgray",
        width: 150,
        height: 150,
        borderRadius: 15,
    },
    selectButton: {
        backgroundColor: "#f7d081",
        marginTop: 10,
        marginLeft: "30%",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
})