import React, { useState,Component } from 'react';
import { View, TextInput, Button, Platform, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../../Firebase/firebaseConfig';
import firestore from "@react-native-firebase/firestore";
import {Picker} from '@react-native-picker/picker'
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../component/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon } from '@rneui/themed';

const SignUpScreen = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [cName, setCName] = useState('');
  const [contactNo,setContactNo] = useState('');
  const [userContactNo,setUserContactNo] = useState('');

  const [cNameError, setCNameError] = useState(false);
  const [contactNoError,setContactNoError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [dobError, setDobError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [userContactNoError,setUserContactNoError] = useState(false);

  const navigation = useNavigation();
  const today = dob.toISOString().slice(0, 10);
  const onSignInPressed = () => {
    navigation.navigate('Login');
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleSignUp = async() => {
    setGenderError(!gender);
    setEmailError(!email);
    setNameError(!name);
    setDobError(!dob);
    setPasswordError(!password);
    setConfirmPasswordError(!confirmPassword);
    setCNameError(!cName);
    setContactNoError(!contactNo);
    setUserContactNoError(!userContactNo);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@_])[0-9a-zA-Z@_]{6,}$/;

    if (!email || !name || !dob || !password || !confirmPassword || !cName || !contactNo || !gender ||!userContactNo) {

      alert(
        "Empty field(s)"
      );
      return;
    }

    

    if (gender === "") {
      alert("Empty fields");
      return;
    }

    if (dob === today) {
      alert("Empty fields");
      return;
    }


    if (!password || !confirmPassword) {
    alert("Please enter a password and confirm it.");
    return;
  } else if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  } else if (!passwordRegex.test(password)) {
    alert("Password must be contain at least one capital letter, one number, and one of the symbols @ or _'");
    return;
  }

    const formattedDob = dob.toISOString().slice(0, 10);

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const { uid } = userCredential.user;
        const userData = {
          name,
          dob: formattedDob,
          gender: gender,
          cName: cName,
          contactNo:contactNo,
          userContactNo:userContactNo,
        };
        firebase.firestore().collection('users').doc(uid).set(userData)
          .then(() => {
            console.log('User data saved successfully');
            navigation.navigate('Login')
          })
          .catch((error) => {
            console.error('Error saving user data: ', error);
            // console.log('Email link not sent')
          });
      })
      .catch((error) => {
        const { code, message } = error;
        console.error('Error signing up: ', code, message);
        alert(message);
      });
  };

  return (
    <View >
      <ScrollView>
        <View style = {styles.root}>
          <Text style = {styles.signUpLogo}>Sign Up</Text>
        </View>
        <View style = {[styles.inputContainer, emailError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='envelope-o'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={styles.input}
            required
          />
          
        </View>
        {emailError && <Text style={styles.errorMessage}>Email is required</Text>}
        
        <View style = {[styles.inputContainer, nameError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='user'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Name"
            onChangeText={(text) => setName(text)}
            value={name}
            style={styles.input}
            required
          />
        
        </View>
       
        {nameError && <Text style={styles.errorMessage}>Name is required</Text>}

        <View style = {[styles.inputContainer, userContactNoError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='address-book'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Contact Number"
            onChangeText={(text) => setUserContactNo(text)}
            value={cName}
            style={styles.input}
            required
          />
        </View>

        {userContactNoError && <Text style={styles.errorMessage}>Contact number is required</Text>}

        <View style = {[styles.inputContainer,genderError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='mars'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            style={styles.input}
            required
          >
            <Picker.Item style={styles.input} label="Select Gender" value="" />
            <Picker.Item style={styles.input} label="Male" value="male" />
            <Picker.Item style={styles.input} label="Female" value="female" />
            <Picker.Item style={styles.input} label="Other" value="other" />
          </Picker>
        </View>

        {genderError && <Text style={styles.errorMessage}>Gender is required</Text>}

        <View style = {[styles.inputContainer, dobError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='calendar-o'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Date of Birth"
            value={`Date of Birth: ${today}`}
            onFocus={() => setShowDatePicker(true)}
            style={styles.input}
            required
          />
          
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {dobError && <Text style={styles.errorMessage}>Date of Birth is required</Text>}
        
        <View style = {[styles.inputContainer, cNameError && styles.errorBorder]}>
        <Icon 
            type= 'font-awesome'
            name='user-o'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Caregiver Name"
            onChangeText={(text) => setCName(text)}
            value={cName}
            style={styles.input}
            required
          />
        </View>
        
        {cNameError && <Text style={styles.errorMessage}>Caregiver name is required</Text>}

        <View style = {[styles.inputContainer, contactNoError && styles.errorBorder]}>
        <Icon 
            type= 'font-awesome'
            name='address-book-o'
            color='#35aa94'
            size= {18}
            style={styles.icon}
          />
          <TextInput
            placeholder="Caregiver Contact Number"
            onChangeText={(text) => setContactNo(text)}
            value={cName}
            style={styles.input}
            required
          />
        </View>
        
        {contactNoError && <Text style={styles.errorMessage}>Caregiver contact number is required</Text>}

        <View style = {[styles.inputContainer, passwordError && styles.errorBorder]}>
          <Icon 
            type= 'font-awesome'
            name='lock'
            color='#35aa94'
            size= {18}
            style={styles.icon}
            
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
            style={styles.input}
            required
          />
        </View>
        
        {passwordError && <Text style={styles.errorMessage}>Password is required and must be contain at least one capital letter, one number, and one of the symbols @ or _</Text>}
        
        <View style = {[styles.inputContainer, confirmPasswordError && styles.errorBorder]}>
          <Icon 
            type= 'ionicons'
            name='lock'
            color='#35aa94'
            size= {18}
            style={styles.icon}
            
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            style={styles.input}
            required
          />
        </View>
        
        {confirmPasswordError && <Text style={styles.errorMessage}>Confirm Password is required</Text>}
          
        <CustomButton
          text = 'Sign Up'
          onPress={handleSignUp} />

        <View style={styles.createAccountButton}>
          <Text style = {styles.defaultText}>
              Existing user? 
              <Text 
              style={styles.createAccount}
              onPress= {onSignInPressed}> Login</Text>
          </Text>

        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  root: {
      alignItems: 'center',
      padding: 20,
  },
  
  signUpLogo:{
    textAlign:'center',
    fontSize:28,
    fontWeight: 'bold',
    color:'black',
    padding:15,
    fontFamily: 'sans-serif-light',
  },
  forgotPassButton:{
      alignItems:'flex-end',
      paddingRight:20,
  },
  genderContainer:{
      paddingHorizontal:20,
      width: '90%',
      paddingVertical:5,
      backgroundColor: 'white',
      alignSelf: 'center',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,

  },
  gender:{
      padding: '20%',
      color: 'gray',
      fontSize:15,
  },
  forgotPass:{
      fontWeight:700,
      fontSize: 17,
      color: '#d61313'
  },
  createAccountButton:{
      marginVertical:20,
      alignItems: 'center',
  },
  createAccount:{
      textAlign:'right',
      color:'#35aa94', 
      fontWeight:'700',
      fontSize:17,
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

  },
  inputContainer:{
    width:'90%',
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
  },
  input:{
    backgroundColor: 'white',
    width: '86%',
    fontWeight:'700',
    color:'#616161',
    paddingHorizontal: 5,   
    alignSelf:'center',
    marginVertical: 5,
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
  icon:{
    paddingHorizontal:10,
    
  },
})
export default SignUpScreen;

