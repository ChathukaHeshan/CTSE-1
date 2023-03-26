import {
    SafeAreaView,
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { BackHandler } from "react-native";
import { firebase } from "../config";
import React, { useState, useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setName] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phone, setphone] = useState("");
    const [address, setaddress] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [phoneError, setphoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmpasswordError, setconfirmPasswordError] = useState("");
    
    const onFooterLinkPress = () => {
        navigation.navigate("Login");
    };
    const onRegisterPress = () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        var nameValid = false;
        if (username.length == 0) {
            setusernameError("Enter Full Name");
        } else {
            setusernameError("");
            nameValid = true;
        }
        var emailValid = false;
        if (email.length == 0) {
            setEmailError("Email is required");
        } else if (email.length < 6) {
            setEmailError("Email should be minimum 6 characters");
            setEmailError("Enter a valid email!");
        } else {
            setEmailError("");
            emailValid = true;
        }
        var phoneValid = false;
        if (phone.length == 0) {
            setphoneError("Enter a phone number.");
        } else {
            setphoneError("");
            phoneValid = true;
        }
        var addressValid = false;
        if (address.length == 0) {
            setaddressError("Enter an Address. ");
        } else {
            setaddressError("");
            addressValid = true;
        }
        var passwordValid = false;
        if (password.length == 0) {
            setPasswordError("Password is required");
        
        } else {
            setPasswordError("");
            passwordValid = true;
        }
        if (confirmPassword.length == 0) {
            setconfirmPasswordError("Enter Password Confirmation.");
        } else if (confirmPassword !== password) {
            setconfirmPasswordError(
                "Password and Confrim password must be the same!"
            );
        } else {
            setconfirmPasswordError("");
            confirmpasswordValid = true;
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    const uid = response.user.uid;
                    const data = {
                        id: uid,
                        email,
                        role: "Client",
                        username,
                        phone,
                        address,
                        createdAt: timestamp,
                    };
                    const usersRef = firebase.firestore().collection("users");
                    usersRef
                        .doc(uid)
                        .set(data)
                        .then(() => {
                            navigation.navigate("Home");
                        })
                        .catch((error) => {
                            alert(error);
                        });
                })
                .catch((error) => {
                    alert("Email is already used");
                });
        }
    };
    useEffect(() => {
        navigation.addListener("focus", () => {
            function handleBackButtonClick() {
                navigation.navigate('Login');
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
                <KeyboardAwareScrollView>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    marginTop: 50,
                                    marginBottom: 10,
                                    fontWeight: "900",
                                    color: "#fff",
                                }}
                            >
                                Omega
                            </Text>

                            <Text
                                style={{
                                    fontSize: 25,
                                    fontWeight: "bold",
                                    color: "#fff",
                                    marginBottom: 15,
                                    marginTop: 10,
                                }}
                            >
                                Sign Up
                            </Text>
                        </View>

                        <Animatable.View
                            animation="fadeInUp"
                            duration={1000}
                            style={{ alignItems: "center", justifyContent: "center" }}
                        >
                            <TextInput
                                placeholderTextColor="#fff"
                                value={username}
                                onChangeText={(text) => setName(text)}
                                placeholder="Enter Your Name"
                                style={styles.textBoxes}
                            ></TextInput>
                            {usernameError.length > 0 && (
                                <Text style={{ color: "red" }}>{usernameError}</Text>
                            )}

                            <TextInput
                                value={email}
                                placeholderTextColor="#fff"
                                onChangeText={(text) => setEmail(text)}
                                placeholder="Email Address"
                                autoCapitalize="none"
                                keyboardType={"email-address"}
                                style={styles.textBoxes}
                            ></TextInput>
                            {emailError.length > 0 && (
                                <Text style={{ color: "red" }}>{emailError}</Text>
                            )}
                            <TextInput
                                value={phone}
                                placeholderTextColor="#fff"
                                onChangeText={(text) => setphone(text)}
                                placeholder="Enter Phone Number"
                                style={styles.textBoxes}
                                keyboardType={"phone-pad"}
                            ></TextInput>
                            {phoneError.length > 0 && (
                                <Text style={{ color: "red" }}>{phoneError}</Text>
                            )}
                            {passwordError.length > 0 && (
                                <Text style={{ color: "red" }}>{passwordError}</Text>
                            )}

                            <TextInput
                                placeholderTextColor="#fff"
                                secureTextEntry
                                placeholder="Confirm Password"
                                onChangeText={(text) => setConfirmPassword(text)}
                                value={confirmPassword}
                                style={styles.textBoxes}
                            />
                            {confirmpasswordError.length > 0 && (
                                <Text style={{ color: "red" }}>{confirmpasswordError}</Text>
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => onRegisterPress()}
                            >
                                <Text style={styles.buttonTitle}>Sign Up</Text>
                            </TouchableOpacity>
                            <View style={{ marginTop: 30, marginBottom: 20 }}>
                                <Text style={{ fontSize: 18, color: "#fff" }}>
                                    Already have an account?{" "}
                                    <Text
                                        onPress={onFooterLinkPress}
                                        style={{
                                            color: "#f7d081",
                                            fontSize: 20,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Log in
                                    </Text>
                                </Text>
                            </View>
                        </Animatable.View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );
}