import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './StackScreens/Register'
import Home from './StackScreens/Home';
import LoginScreen from './StackScreens/Login';
import { firebase } from './config'
import ProductDetail from './StackScreens/ProductDetail';
import AdminTab from './AdminScreens/AdminTabs';

export default function App() {

    const Stack = createStackNavigator();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
            setIsLoggedIn(true)

        } else {
            setIsLoggedIn(false);
        }
    })
    return (
        <NavigationContainer>
            {isLoggedIn ?
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminHome" component={AdminTab} options={{ headerShown: false }} />
                    <Stack.Screen name="ProductDetail" component={ProductDetail}
                    options={{
                        headerShown: true,
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: '#000' },
                        headerTitleStyle: { color: '#fff', },
                        headerTintColor: '#ffffff',
                      }}
                    />
                 
                </Stack.Navigator> :
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                </Stack.Navigator>}
        </NavigationContainer>

    );
}
