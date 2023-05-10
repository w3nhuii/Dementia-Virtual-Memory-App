import React, { Component } from 'react';
import {Text, View,Button, StyleSheet, Image,TouchableOpacity} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import SmsAndroid from 'react-native-sms';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { firebase } from '../../Firebase/firebaseConfig';
import CustomButton from '../component/CustomButton';

const MoodDetector = () =>{
    const IconWithText = ({ iconName, iconType, text, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <View style={{ alignItems: 'center' }}>
            <Icon name={iconName} type={iconType} color="black" size = {60} style={{paddingHorizontal:40}}/>
            <Text style={{ textAlign:'center',marginVertical:5,color:'black',fontWeight:'600'}}>{text}</Text>
          </View>
        </TouchableOpacity>
      );
    const navigation = useNavigation();
    const onHomePress = () => {
        navigation.navigate('Home')
    }
    const sendWarningMessage = async () => {
        try {
          const user = firebase.auth().currentUser;
          if (!user) {
            console.log('Error: User is not signed in.');
            return;
          }
      
          const userId = user.uid;
          const userSnapshot = await firestore().collection('users').doc(userId).get();
          const contactNo = userSnapshot.data().contactNo;
          console.log(contactNo);
          const message = 'The patient is feeling anxious. Please check on them.';
      
          SmsAndroid.send({
            body: message,
            recipients: [contactNo,'+60166166507'],
            successTypes: ['sent', 'queued'],
		        allowAndroidSendWithoutReadPermission: true,
          },
        
            
            (err, message) => {
              if (err) {
                console.log('Error sending SMS message: ', err);
              } else {
                console.log('SMS message sent: ', message);
              }
            }
          );
        } catch (error) {
          console.log('Error retrieving contact number from Firebase: ', error);
        }
        navigation.navigate('Home')
      };
      
    return (
        <View>
            <View style={styles.headerContainer} >
                <Image
                    source={require('D:/Dementia_Virtual_Memory_App/images/DVMA_logo.png')}
                    style={styles.headerLogo}

                    />
                <Text style={styles.headerText}>Dementia Virtual Memory App</Text>

            </View>

            <View>
            <Image style={styles.image} source={require('D:/Dementia_Virtual_Memory_App/android/app/src/assets/defaultImage/inazuma.jpeg')} />
            </View>

            <View style={{marginTop:60,marginBottom:40}}>
                <Text style={{fontSize:30,paddingLeft:30,color:'#0d0900',fontWeight:'900'}}>Mood Detector</Text>
                <Text style={{fontSize:20,paddingLeft:30,color:'#35aa94'}}>Choose Your Mood</Text>
            </View>

            <View style={{flexDirection:'row',alignSelf:'center'}}>
                <View>
                <IconWithText 
                    iconName = 'smile-o'
                    iconType = 'font-awesome'
                    text = 'Happy'
                    onPress={() => {
                        console.warn('Smile is selected, user mood is stable')
                        navigation.navigate('Home')
                    }}
                />
            </View>
           
            <View>
                <IconWithText 
                    iconName = 'meh-o'
                    iconType = 'font-awesome'
                    text = 'Meh'
                    onPress={() => {
                        console.warn('Meh is selected')
                        navigation.navigate('Home')
                    }}
                />
            </View>

            <View>
                <IconWithText 
                    iconName = 'frown-o'
                    iconType = 'font-awesome'
                    text = 'Anxious'
                    onPress={sendWarningMessage}
                />
            </View>
            </View>


            <View>
                <CustomButton text="Back To Home" onPress={onHomePress} type='SECONDARY'/>
            </View>
        </View>



    )
}
const styles = StyleSheet.create({
  headerContainer:{
    width:'100%',
    backgroundColor: '#35aa94',
    flexDirection: 'row',
    height:90,
    alignSelf:'center',
  },
  headerLogo:{
    backgroundColor: '#35aa94',
    width:'15%',
    height:60,
    alignSelf:'center',
    marginLeft:20,  
    flexDirection: 'row',
      
      
  },
  headerText:{
    backgroundColor: '#35aa94',
    textAlign:'auto',
    marginLeft:20,
    fontSize: 16,
    textAlignVertical:'center',
    alignSelf:'center',
    fontWeight:'800',
    flexDirection: 'row',
  },
    
  image: {
    width: 400,
    height: 150,
    opacity: 0.6,
    marginBottom: 0,
  },
  backToHome:{
    textAlign:'center',
    fontSize: 25,
    color: '#35aa94',
    fontWeight: '900',
    paddingVertical: 20,
  }
});
export default MoodDetector;