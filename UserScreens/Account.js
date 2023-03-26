import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { firebase } from '../config'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable';
import { BackHandler } from 'react-native';

export default function AccountScreen({ navigation }) {
    const auth = firebase.auth;
    const [user, setUser] = useState(null)

    function Edit() {
        navigation.navigate('EditProfile', { user })
    }

    useEffect(() => {
        firebase.firestore().collection("users")
            .doc(auth().currentUser.uid).get()
            .then(user => {
                setUser(user.data())
            })
    }, [])
   
    const signOut = () => {
        firebase.auth().signOut()
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
        )
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

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1, padding: 5 }}>
                <View style={{ justifyContent: "center", alignItems: 'center' }}>
                    {/* <Image
                        style={styles.acc}
                        source={require('../assets/logo.png')}
                    /> */}
                    <Text style={{ fontSize: 30, fontWeight: "500", color: "white" }}>{user?.username}</Text>
                    <Animatable.View
                        animation="fadeIn"
                        duration={2000}
                    >
                        <View style={{ paddingTop: 30, paddingBottom: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginLeft: 20, marginBottom: 10, padding: 10 }}>My Profile:</Text>

                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <MaterialCommunityIcons name="email" color={'white'} size={30} />
                                <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginLeft: 20 }}> {user?.email}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <MaterialCommunityIcons name="phone" color={'white'} size={30} />
                                <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginLeft: 20 }}> {user?.phone}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <MaterialCommunityIcons name="home" color={'white'} size={30} />
                                <Text style={{ fontSize: 20, fontWeight: "500", color: "white", marginLeft: 20 }}> {user?.address}</Text>
                            </View>
                        </View>
                        <View style={{ paddingTop: 50, flexDirection: "row" }}>
                            <TouchableOpacity
                                onPress={Edit}
                                style={styles.button}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={signOut}
                                style={styles.button}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000"
    },
    textBoxes: {
        width: '90%',
        fontSize: 16,
        padding: 10,
        borderColor: 'grey',
        borderBottomWidth: 2,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        color: "#fff"
    },
    button: {
        backgroundColor: 'white',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 5,
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        padding: 10,
        justifyContent: 'center'
    },
    acc: {
        height: 80,
        width: 80,
        alignSelf: "center",
        margin: 30,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 50
    },
})
