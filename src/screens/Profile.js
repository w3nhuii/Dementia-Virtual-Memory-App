import React, { useState, useEffect,Component } from 'react';
import { Text, View, Button, StyleSheet, Image, TouchableOpacity,TextInput } from 'react-native';
import { Icon } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../component/CustomButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userEmail,setUserEmail] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    const currentUserEmail = auth().currentUser.email;
    

    if (currentUser) {
      setUserEmail(currentUserEmail);
      const userRef = firestore().collection('users').doc(currentUser.uid);
      userRef.get().then((document) => {
        if (document.exists) {
          setUser(document.data());
        } else {
          console.log('User does not exist in database');
        }
      });
    }
  }, []);

  const onHomePress = () => {
    navigation.navigate('Home');
  };

  const onLogoutPress = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');
        console.log('User signed out!');
      });
  };
  const updateUser = () => {
    const currentUser = auth().currentUser;
    const userRef = firestore().collection('users').doc(currentUser.uid);
    userRef
      .update({
        name: user.name,
        cName: user.cName,
        contactNo: user.contactNo,
      })
      .then(() => {
        console.log('User updated successfully!');
        setEditing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const renderEditableField = (title, value, key) => {
    if (editing) {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => setUser({ ...user, [key]: text })}
          />
          <CustomButton text="Save" onPress={updateUser} type='TERTIARY'/>
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => setEditing(true)}>
          <Text style={styles.defaultText}>{value}</Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View>
      <ScrollView>
        <View style={{ backgroundColor: '#35aa94', width: 400, height: 150 }}>
          <Icon
            name="chevron-left"
            type="font-awesome"
            style={{
              alignSelf: 'flex-start',
              margin: 20,
            }}
            color="white"
            onPress={onHomePress}
          />
        </View>
        <View
          style={{
            marginLeft: 130,
            marginTop: -45,
            backgroundColor: 'white',
            width: 100,
            height: 100,
            borderRadius: 45,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}>
          {user && user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={{
                width: 90,
                height: 90,
                position: 'relative',
                zIndex: 1,
              }}
            />
          ) : (
            <Image
              source={require('../component/defaultImage/person_icon.png')}
              style={{
                width: 90,
                height: 90,
                position: 'relative',
                zIndex: 1,
              }}
            />
          )}
        </View>
        {user && (
          <View>
            <Text style={styles.headerName}>{user.name}</Text>

            <Text style={styles.title}>Email</Text>
            <Text style={styles.defaultText}>{userEmail}</Text>
            <Text style={styles.title}>Name</Text>
            {renderEditableField('Name', user.name, 'name')}

            <Text style={styles.title}>Gender</Text>
            <Text style={styles.defaultText}>{user.gender}</Text>
            <Text style={styles.title}>Date of Birth</Text>
            <Text style={styles.defaultText}>{user.dob}</Text>
            <Text style={styles.title}>Caregiver</Text>
            {renderEditableField('Caregiver', user.cName, 'cName')}
            <Text style={styles.title}>Caregiver Contact Number</Text>
            {renderEditableField('Caregiver Contact Number', user.contactNo, 'contactNo')}
          </View>
        )}

        <View>
          <CustomButton text="Logout" onPress={onLogoutPress} />
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
    headerName:{
        textAlign:'center',
        fontSize:25,
        fontWeight:'800'
    },
    title:{
        fontSize:18,
        fontWeight:'700',
        marginLeft:30,
        marginVertical:10,
    },
    defaultText:{
        fontSize:18,
        fontWeight:'400',
        marginLeft:30,
        marginVertical:10,
    },
    input:{
      fontSize:16,
      width: '86%',
      fontWeight:'700',
      color:'#616161',
      marginLeft:130,
      alignSelf:'center',
      marginVertical: 5,
    },
    inputContainer:{
      width:'60%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft:20,
    
    },
    
  });
export default Profile;