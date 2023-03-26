import React, { useEffect, useState } from 'react'
import { SafeAreaView, TextInput, Text, View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import { firebase } from '../config'
import { useIsFocused } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackHandler } from 'react-native';

const EditProfile = ({ route, navigation }) => {

    const [username, setUsername] = useState(route.params.user?.username)
    const [phone, setphone] = useState(route.params.user?.phone)
    const [address, setaddress] = useState(route.params.user?.address)
    const [newPassword, setnewPassword] = useState("");
    const [user, setUser] = useState(route.params.user)
    const isFocused = useIsFocused();
    const Cancel = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Account' }]
            })
        )
    }
    useEffect(() => {

    }, [isFocused])
    const UserInfoUpdate = async () => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const data = {
            id: user.id,
            username: username,
            phone: phone,
            address: address,
            updatedAt: timestamp,
        }

        const userRef = firebase.firestore().collection('users').doc(user.id)
        userRef.update(data)


        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Account' }]
            })
        )
        Alert.alert('Your Profile has been successfully changed!')
    }

    const UpdatePassword = () => {
        const user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(() => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                newPassword: newPassword,
                updatedAt: timestamp,
            }
            const userRef = firebase.firestore().collection('users').doc(user.id)
            userRef.set(data)
            alert('Password has successfully Changed!Please Login Again...')
        }).catch((error) => {
            alert(error.message)
        });

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
                <KeyboardAwareScrollView>
                    <View style={{ paddingTop: 10, paddingBottom: 10 }}>

                        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#f7d081" }}> Edit Profile</Text>
                    </View>

                    <View style={{ width: "100%" }}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommunityIcons name="account" color={'#f7d081'} size={30} style={{ paddingTop: 25 }} />
                            <TextInput
                                style={styles.textBoxes}
                                onChangeText={(text) => setUsername(text)}
                                value={username}
                                placeholderTextColor="#fff"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={{ flexDirection: 'row' }}>

                            <MaterialCommunityIcons name="home" color={'#f7d081'} size={30} style={{ paddingTop: 25 }} />

                            <TextInput
                                style={styles.textBoxes}
                                onChangeText={(text) => setaddress(text)}
                                value={address}
                                placeholderTextColor="#fff"
                            />

                        </View>

                        <View style={{ alignItems: 'center', justifyContent: "center", flexDirection: 'row', paddingTop: 10, marginBottom: 60 }}>
                            <TouchableOpacity
                                onPress={UserInfoUpdate}
                                style={styles.button}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={Cancel}
                                style={styles.button}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    Cancel</Text>
                            </TouchableOpacity>

                        </View>
                        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#f7d081" }}>Change Password</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                style={{
                                    width: '60%',
                                    marginLeft: 20,
                                    fontSize: 16,
                                    color: "#fff"
                                }}
                                onChangeText={(text) => setnewPassword(text)}
                                value={newPassword}
                                placeholderTextColor="#fff"
                                autoCapitalize="none"
                                secureTextEntry
                                placeholder='Enter new Password'
                            />

                            <TouchableOpacity
                                onPress={UpdatePassword}
                                style={{
                                    backgroundColor: '#f7d081',
                                    marginLeft: 30,
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                    Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </View>
    );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    color: "#fff",
  },
  acc: {
    height: 80,
    width: 80,
    alignSelf: "center",
    margin: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
  },
});
export default EditProfile;
