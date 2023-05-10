import React, { Component } from 'react';
import {View,Text,TextInput,StyleSheet,Button,Pressable} from 'react-native';

const CustomButton = ({onPress, text,type = "PRIMARY",bgColor,fgColor}) => {
    return(
        <Pressable 
            onPress={onPress} 
            style={[
                styles.container,
                styles[`container_${type}`],
                bgColor ? {backgroundColor :bgColor} : {},
            ]}
           
        > 
            <Text style= {[
                styles.text,
                styles[`text_${type}`],
                fgColor ? {Color :fgColor} : {},
            ]}>
                {text}
            </Text>
            
        </Pressable>
    );
};


const styles= StyleSheet.create({
    container_PRIMARY:{
        backgroundColor: '#35aa94',
        width: '70%',
        height: 40,
        padding:10,
        borderRadius:5,
        alignItems: 'center',
        marginVertical:10,
        marginHorizontal:60,
        
    },
    container_SECONDARY:{
        width: '70%',
        height: 50,
        padding:10,
        borderRadius:5,
        borderColor: '#35aa94',
        alignItems: 'center',
        marginVertical:5,
        marginHorizontal:60,
    },
    container_TERTIARY:{
        width: '70%',
        height: 20,
       
        borderRadius:5,
        borderColor: '#35aa94',
        alignItems: 'center',
       
    },
    text_PRIMARY:{
        alignSelf: 'center',
        color: 'white',
        fontSize:15,
        fontWeight: 700,
    },

    text_SECONDARY:{
        paddingTop:1,
        alignSelf: 'center',
        color: '#35aa94',
        fontSize:17,
        fontWeight: 700,
        
    },
    text_TERTIARY:{
        
        alignSelf: 'center',
        color: '#35aa94',
        fontSize:13,
        fontWeight: 700,
        
    },
});

export default CustomButton;