import React, {Component, useState,useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { firebase } from '../../Firebase/firebaseConfig';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPassword from '../screens/ForgotPassword';
import ConfirmEmail from '../screens/ConfirmEmail';
import MoodDetector from '../screens/MoodDetector';
import Profile from '../screens/Profile';
import PhotoAlbum from '../screens/PhotoAlbum';
import AddTask from '../screens/AddTask';
import AddPhoto from '../screens/AddPhoto';


const Stack = createNativeStackNavigator();


const Navigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
      <NavigationContainer >
        <Stack.Navigator screenOptions={{headerShown: false}} >
            
            {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddTask" component={AddTask}/>
              <Stack.Screen name="MoodDetector" component={MoodDetector} />
              <Stack.Screen name="PhotoAlbum" component={PhotoAlbum} />
              <Stack.Screen name="AddPhoto" component={AddPhoto}/>
              <Stack.Screen name="Profile" component={Profile} />
            </>
            ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
            </>
            )}
            
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default Navigation;