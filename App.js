import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {View , 
     
    StyleSheet,
    } from 'react-native'
   
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Navigation from './src/navigation';

const Stack = createNativeStackNavigator();

export default class App extends Component{

    componentDidMount(){ 
        setTimeout(() => {
            SplashScreen.hide() 
        }
        , 1000);  
    }
    

    render() {

        return(
            <View style = {styles.root}>
                
                <Navigation />
            </View>
        );
    }
        
}

const styles = StyleSheet.create({
    root: {
        flex:1,
        backgroundcolor: '#d8d9d7',
    },
});
  