import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, Image, FlatList,ScrollView,TouchableOpacity,Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '../../Firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import Tts from 'react-native-tts';
import CustomButton from '../component/CustomButton';

const PhotoAlbum = () => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const onHomePress = () => {
      navigation.navigate('Home')
  }
  
  const handleDelete = async (photoKey) => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firestore().collection('users').doc(userId).collection('photos').doc(photoKey).delete();
      console.log('Photo deleted from Firestore');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    
    const userId = firebase.auth().currentUser.uid;
    const subscriber = firestore()
      .collection('users')
      .doc(userId)
      .collection('photos')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const newPhotos = [];

        querySnapshot.forEach(documentSnapshot => {
          newPhotos.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setPhotos(newPhotos);
      });
    return () => subscriber();
  }, []);

  const renderPhoto = ({ item }) => {
    const speak = (text) => {
      Tts.speak(text);
    };
    Tts.getInitStatus().then(() => {
    }, (err) => {
      if (err.code === 'no_engine') {
        Tts.requestInstallEngine();
      }
    });
    return (
      
      <TouchableOpacity>
        <View style={styles.albumcontainer}>
          {item.imageUrl && (
              <Image style={styles.albumimage} source={{ uri: item.imageUrl }} />
          )}
          <Text style={styles.textTitle}>Description</Text>
          <Text style={styles.defaultText} onPress={() => speak(item.description)}>{item.description}</Text>
          <Text style={styles.textTitle}>Comment</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.commentText} onPress={() => speak(item.comments)}>{item.comments}</Text>
            <Icon 
              type='font-awesome'
              name= 'trash-o'
              style={{
                  alignItems:'flex-end',
                  paddingLeft:100,
              }}
              onPress={()=> {
                Alert.alert(
                  'Delete Photo',
                  'Are you sure you want to delete this photo?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => handleDelete(item.key),
                    },
                  ],
                  { cancelable: true },
                );
              }} 
            />
          </View>
        </View>
      </TouchableOpacity>
      
    );
  };

  return (
  
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <Image style={styles.image} source={require('D:/Dementia_Virtual_Memory_App/android/app/src/assets/defaultImage/inazuma.jpeg')} />
        <Text style = {styles.text}>Memories of User</Text>
      </View>
      <View>
        <CustomButton 
            text="Back to Home"
            type = 'SECONDARY'
            onPress = {()=> {
                navigation.navigate('Home')
            }}
        />
      </View>
      <View style ={{flexDirection:'row',alignContent:'center',width:'100%'}}>
        <Icon 
          type='font-awesome'
          name= 'plus'
          style={{
              alignSelf:'flex-start',
              marginHorizontal:20,
              marginVertical:10,
          }}  
          onPress={()=> {
              navigation.navigate('AddPhoto')
          }}
        />
        <Text style={{
          alignSelf:'flex-start',
          fontSize:18,
          marginVertical:10,
        }}>
          Add Memories
        </Text>
      </View>
      <View>
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={item => item.key}
        />
      </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
    imagecontainer:{
        position: 'relative',
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover',
        zIndex: 1,
        width: 400,
        height: 150,
        opacity: 0.6,
        marginBottom: 0,
    },

    text:{
        position: 'absolute',
        top: 100,
        left: 20,
        zIndex: 2,
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        justifyContent:'center',
        textAlign:'center'
    },
    albumimage:{
        marginLeft:20,
        padding:20,
        width:320,
        height: 180,
    },
    defaultText:{
        paddingHorizontal:5,
        marginHorizontal:20,
        textAlign:'justify',
        fontSize:16,
        
    },
    textTitle:{
        fontSize:20,
        color:'#0d0900',
        textAlign:'justify',
        marginHorizontal:20,
        fontWeight:'700'
    },
    albumcontainer:{
        paddingVertical:10,
        borderColor:'lightgrey',
        borderWidth: 1,
        marginVertical:10,
    },
    backToHome:{
        textAlign:'center',
        fontSize: 25,
        color: '#35aa94',
        fontWeight: '900'
    },
    commentText:{
      paddingLeft:25,
      
      fontSize:16,
      width:'61%',
    }

  });

export default PhotoAlbum;
