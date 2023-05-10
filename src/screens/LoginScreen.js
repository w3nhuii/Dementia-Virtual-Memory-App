import React, {Component,useState} from 'react';
import {View , 
        Text,
        Image, 
        TextInput,  
        StyleSheet,
        TouchableHighlight,
        TouchableOpacity,} from 'react-native';
import { Icon } from '@rneui/themed';
import CustomButton from '../component/CustomButton';
import CustomInput from '../component/CustomInput';
import { useNavigation } from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import { firebase } from '../../Firebase/firebaseConfig';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@_])[0-9a-zA-Z@_]{6,}$/;
const LoginScreen = () => {
    console.disableYellowBox = true;
    const {control, handleSubmit } = useForm(
        {
            defaultValues: {
                email: "",
                password: "",

            }
        }
    );
    
    const [error, setError] = useState(null);
    
    const onSignInPressed = async(data) => {
        try {
            const { email, password } = data;
            await auth().signInWithEmailAndPassword(email, password);
            const currentUser = auth().currentUser;
            if (currentUser) {
              const token = await currentUser.getIdToken();
              await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
              await firebase.auth().signInWithCustomToken(token);
              navigation.navigate('Home');
            }
          } catch (error) {
            setError(error.message);
          }
          console.log(data);
          navigation.navigate('Home');
    };


    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword');
    };

    const onSignUpPressed = () => {
        navigation.navigate('SignUp');
    };

    const navigation = useNavigation();

    return (
        <View>
            <View style={styles.root}>
                <Image
                    source={require('D:/Dementia_Virtual_Memory_App/images/DVMA_logo.png')}
                    style={styles.logo}
                    resizeMode = "contain"
                    />
            </View>
            <View style={styles.root}>
                <Text style = {styles.signInLogo}>Sign In</Text>
            </View>

            
              
                    <CustomInput
                        rules = {{
                            required : 'Email is required',
                            pattern: {
                                value: EMAIL_REGEX,
                                message: 'Email is invalid',
                            },
                        
                        }}
                        name = "email"
                        style = {styles.input}
                        placeholder="Email" 
                        control={control}
                        iconName='envelope-o'
                    />
                
                    
                    <CustomInput
                    rules = {{
                        required : 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password need to be at least 8 characters long',
                        },

                        pattern: {
                            value: PASSWORD_REGEX,
                            message: 'Password must be contain at least one capital letter, one number, and one of the symbols @ or _',
                        },
                       
                    }}
                    iconName= 'lock'
                    name = "password"
                    style = {styles.input}
                    placeholder="Password" 
                    control={control}
                    secureTextEntry
                    
                />
                
                
                
               
           
            
            <View style={styles.forgotPassButton}>
                <Text 
                    style={styles.forgotPass}
                    onPress={onForgotPasswordPressed}>Forgot Password?</Text>
            </View>

            
            <View>
                <CustomButton text="Sign In" onPress={handleSubmit(onSignInPressed)}/>
            </View>
            
            

            <View style={styles.createAccountButton}>
                <Text style = {styles.defaultText}>
                    Don't have an account? 
                    <Text 
                    style={styles.createAccount}
                    onPress= {onSignUpPressed}> Create Account</Text>
                </Text>
                
                
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 5,
    },
    logo:{
        width: '60%',
        marginTop: 30,
        maxWidth: 300,
        height: 180,
    },
    signInLogo:{
        textAlign:'center',
        fontSize:28,
        fontWeight: 'bold',
        color:'black',
        padding:20,
        fontFamily: 'sans-serif-light',
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
    
    
    
      
    

})
export default LoginScreen;
