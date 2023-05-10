import React, {Component,useState, useEffect} from 'react';
import {View , 
        Text,
        Image, 
        TextInput,  
        StyleSheet,
        TouchableHighlight,
        TouchableOpacity,} from 'react-native';
import { Icon } from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import CustomButton from '../component/CustomButton';
import CustomInput from '../component/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../Firebase/firebaseConfig';
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const ConfirmEmail = () => {
    const [error, setError] = useState(null);

    const navigation = useNavigation();
    
    const onResendEmailPressed = async () => {
      try {
        const user = auth().currentUser;
        await user.sendEmailVerification();

        console.log('Verification email sent');
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    };

    useEffect(() => {
        
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user && user.emailVerified) {

            Alert.alert("Email had been verified")
            navigation.navigate('Home');
          }
        });
    
        return unsubscribe;
      }, [navigation]);

      useEffect(() => {
        const timeout = setTimeout(() => {
          navigation.navigate('Home');
        }, 15000);
        return () => clearTimeout(timeout);
      }, [navigation]);

    return (
        <View>
           
            <View style={styles.root}>
                <Text style = {styles.Logo}>Confirm Email</Text>
            </View>
                <Text>Please verified your account with the link sent to your email</Text>
            <View>
               
            </View>
            <View>
                <CustomButton text ="Resend Code" onPress = {onResendEmailPressed} type="SECONDARY"/>
  
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 5,
    },
    
    Logo:{
        padding:30,
        fontSize:28,
        fontWeight: 'bold',
        color:'#797a78',
        fontFamily: 'Roboto',
    },
    forgotPassButton:{
        alignItems:'flex-end',
        paddingRight:20,
        paddingTop:10,
        

    },
    forgotPass:{
        fontWeight:700,
        fontSize: 17,
        color: '#d61313'
    },
    createAccountButton:{
        marginVertical:90,
        alignItems: 'center',
    },
    createAccount:{
        textAlign:'right',
        color:'#35aa94', 
        fontWeight:'700',
        fontSize:17,
    },
    input:{
        backgroundColor: 'white',
        width: '90%',
        borderColor:'#e7e8e6',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,   
        alignSelf:'center',
        marginVertical: 5,

    },
    defaultText:{
        fontSize:17,
        textAlign:'left',
    },
    loginIconGroup:{
 
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'flex-start',

    }

})
export default ConfirmEmail;
