import React, { useState, useEffect,Component } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet,ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '../../Firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../component/CustomButton';
import { Icon } from '@rneui/themed';

const AddPhoto = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [croppedImageUri, setCroppedImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');

  const selectImage = async() => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((response) => {
        setCroppedImageUri(response.path);
        console.log(response.path);
        setImageUri(response.path);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadImage = async () => {
    const user = auth().currentUser;
    if (!user) {
      console.log('User not authenticated');
      return;
    }
    const createdAt = new Date().toISOString()
    const storageRef = storage().ref(`images/${createdAt}`);
    const task = storageRef.putFile(croppedImageUri);
    const photoRef = firestore().collection('users').doc(user.uid).collection('photos').doc();
    const photoId = photoRef.id;
    
    try {
      await task;
      const downloadUrl = await storageRef.getDownloadURL();
     await firestore().collection('users').doc(user.uid).collection('photos').add({
        photoId,
        imageUrl: downloadUrl,
        description,
        comments,
        createdAt,
      });
      navigation.navigate('PhotoAlbum');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (croppedImageUri) {
      setImageUri(croppedImageUri);
    }
  }, [croppedImageUri]);

  return (

    <ScrollView style = {{marginVertical: 100}}>
      <Text style={styles.headerText}>Add Photo</Text>

      <View>
        {croppedImageUri ? (
          <Image source={{ uri: croppedImageUri }} style={styles.image} />
        ) : (
          <CustomButton text="Select Image" onPress={selectImage} type='SECONDARY'/>
        )}
      </View>
      

      <View style = {styles.inputContainer}>
        <Icon 
          type='font-awesome'
          name='tags'
          color='#35aa94'
          size= {18}
          style={styles.icon}
        />
        <TextInput
          placeholder="Add Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          textAlignVertical="top"
        />
      </View>
      
      <View style = {styles.inputContainer}>
        <Icon 
          type='font-awesome'
          name='comment'
          color='#35aa94'
          size= {18}
          style={styles.icon}
        />
        <TextInput
          placeholder="Add Comments"
          value={comments}
          onChangeText={setComments}
          style={styles.input}
          textAlignVertical="top"
        />
      </View>
      
      <CustomButton text="Upload" onPress={uploadImage}/>
      <CustomButton 
        text="Back to Home"
        type = 'SECONDARY'
        onPress = {()=> {
            navigation.navigate('Home')
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: '90%',
    fontWeight:'700',
    color:'#616161',
    paddingHorizontal: 5,   
    alignSelf:'center',
    marginVertical: 5,


  },
  date: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 5,
    paddingHorizontal: 5,   
    marginVertical: 5,
    
  },
  dateContainer:{
      backgroundColor: 'white',
      width: '90%',
      borderRadius: 5,
      paddingHorizontal: 5,   
      alignSelf:'center',
      marginVertical: 5,
      height: 40,
        
  },
  headerText:{
    textAlign:'center',
    fontSize:28,
    fontWeight: 'bold',
    color:'black',
    padding:20,
    fontFamily: 'sans-serif-light',
  },
  icon:{
    paddingHorizontal:10,
    
  },
  image:{
    paddingVertical:20,
    alignSelf:'center',
    width:300,
    height:250,
  }
})

export default AddPhoto;
