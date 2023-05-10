import React, { useState, useEffect,Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { firebase } from '../../Firebase/firebaseConfig';
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import CustomButton from '../component/CustomButton';

const ForgotPassword = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(false);

  const handlePasswordReset = () => {
    setEmptyMessage(!email);
    if(!email) {
      Alert(
        "Empty field"
      )
      return;
    }
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccessMessage('Password reset email sent');
        navigation.navigate('Login')
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setSuccessMessage(null);
      });
    
      
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <View style={styles.form}>
        <View style = {[styles.inputContainer, emptyMessage && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='envelope-o'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {emptyMessage && <Text style={styles.errorMessage}>Email is required</Text>}
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}
      </View>
      <CustomButton text="Back To Login" type='SECONDARY' onPress={()=> {
        navigation.navigate('Login')
      }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign:'center',
    fontSize:28,
    fontWeight: 'bold',
    color:'black',
    padding:20,
    fontFamily: 'sans-serif-light',
  },
  form: {
    width:'100%',
    
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 30,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginLeft: 20,
    marginVertical:5,
    width:'90%',
  },
  input: {
    backgroundColor: 'white',
    width: '80%',
    fontWeight:'700',
    color:'#616161',
    paddingHorizontal: 5,   
    alignSelf:'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#35aa94',
    width: '70%',
    height: 40,
    padding:10,
    borderRadius:5,
    alignItems: 'center',
    marginVertical:10,
    marginHorizontal:60,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize:15,
    fontWeight: 700,
  },
  errorText: {
    color: 'red',
    marginTop: 16,
  },
  successText: {
    color: 'green',
    marginTop: 16,
  },
  icon:{
    paddingHorizontal:10, 
  },
  errorBorder:{
    borderColor: 'red',
    borderWidth: 2,
  },
  errorMessage:{
    paddingHorizontal:20,
    paddingVertical:5,
    color:'red',
  },
});

export default ForgotPassword;
