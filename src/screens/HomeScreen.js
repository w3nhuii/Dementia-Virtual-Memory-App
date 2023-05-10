import React, { useEffect, useState, Component} from 'react';
import { Text, View, Image , StyleSheet, Dimensions,FlatList,ScrollView,TouchableOpacity,Alert,Modal,TextInput} from "react-native";
import  auth  from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import database from '@react-native-firebase/database';
import { firebase } from '../../Firebase/firebaseConfig';
import MoodDetector from '../screens/MoodDetector';
import Profile from '../screens/Profile';
import PhotoAlbum from '../screens/PhotoAlbum';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';
import CustomButton from '../component/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = () => {
    const [tasks ,setTasks] = useState([]);
    const [user, setUser] = useState(null); 
    const [username, setUsername] = useState(null);
    const navigation = useNavigation();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
  
    const handleEditModalClose = () => {
      setSelectedTask(null);
      setShowEditModal(false);
    };

    const IconWithText = ({ iconName, iconType, text, onPress }) => (
        <TouchableOpacity onPress={onPress}>
          <View style={{ alignItems: 'center' }}>
            <Icon name={iconName} type={iconType} color="white" style={{paddingHorizontal:50}}/>
            <Text style={{ textAlign:'center',marginVertical:5,color:'white',fontWeight:'600'}}>{text}</Text>
          </View>
        </TouchableOpacity>
    );

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const today = new Date().toLocaleDateString(undefined, options);
    
    const handleEditTaskSubmit = async (task) => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const taskRef = firestore().collection("users").doc(userId).collection("tasks").doc(task.id);
    
        await taskRef.update(task);
    
        console.log("Task updated successfully");
        fetchTasks();
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    };
    
    
    const handleDeleteTask = async (id) => {
      try {
        const userId = firebase.auth().currentUser.uid;
        await firestore().collection('users').doc(userId).collection('tasks').doc(id).delete();
        fetchTasks();
        console.log('Task deleted from Firestore');
        
      } catch (error) {
        console.log(error);
      }
    };
    const fetchTasks = async () => {
      const userId = firebase.auth().currentUser.uid;
      const userSnapshot = await firestore().collection('users').doc(userId).get();
      const username = userSnapshot.data().name
      setUsername(username);
      
      try {
        const snapshot = await firestore().collection('users').doc(userId).collection('tasks').where('date', '==', today).get();
        const tasksList = snapshot.docs.map(doc => ({
          id: doc.id,
          task: doc.data().task,
          date: doc.data().date,
        }));
        setTasks(tasksList);
      } catch (error) {
        console.log(error);
      }
    }
      useEffect(() => {

        const unsubscribe = auth().onAuthStateChanged(user => {
          setUser(user); 
          if (user) {
          
            fetchTasks();
          }
        }); 
        return unsubscribe; 
      }, []);
    
        
    

      const renderItem = ({ item }) => {
        const speak = (text) => {
          Tts.speak(text);
        };
        Tts.getInitStatus().then(() => {
          
        }, (err) => {
          if (err.code === 'no_engine') {
            Tts.requestInstallEngine();
          }
        });

        const handleEditTask = (task) => {
          setSelectedTask(task);
          setShowEditModal(true);
        };
        return (
        <TouchableOpacity onPress={() => speak(item.task)}>  
          <View style={styles.listContainer}>
            <Text style= {styles.listItem} >{item.task}</Text>
            <Icon
              type="font-awesome"
              name="pencil"
              style={{
                alignItems: "flex-end",
                paddingHorizontal: 15,
                right: 10,
                left: 1,
              }}
              onPress={() => handleEditTask(item)}
            />
            <Icon 
              type='font-awesome'
              name= 'trash-o'
              style={{
                  alignItems:'flex-end',
                  right:0,
                  left:1,
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
                      onPress: () => handleDeleteTask(item.id),
                    },
                  ],
                  { cancelable: true },
                );
              }}
              
            />
          </View>
        </TouchableOpacity>
          
        );
      };


    
    return(
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

        <View style={styles.bodyContainer}>
            <View>
            <Text style={styles.nameText}>Hello, {username}</Text>
            <Text style={styles.today}>TODAY</Text>
            <Text style={styles.date}>{today}</Text>
            </View>
            
            <View>
            
                <Image
                    source={require('../component/defaultImage/person_icon.png')}
                    style= {{width:90,height:90,flexDirection:"row",marginLeft:70,alignSelf:'center',alignItems:'center'}}
                />
            </View>
        </View>

        <View style={{paddingTop:80,paddingLeft:30,flexDirection:'row'}}>
            <Text style={{fontSize:20,fontWeight:'600',color:'#0d0900'}}>Task to do today:</Text>
            <Icon 
                name = "plus"
                type = 'font-awesome'
                color = 'black'
                style = {{paddingLeft:128,paddingTop:6}}
                onPress={() => {
                    navigation.navigate('AddTask')
                }}
            />
        </View>
        
        <View style={{paddingHorizontal:30,paddingTop:20,paddingBottom:55}}>
            
            <FlatList
                data={tasks}
                renderItem={renderItem}
                style={styles.list}
            />
        
        </View>
        <View style={styles.bottomTabContainer}>
        <View style ={styles.bottomTab}>
            <View>
                <IconWithText 
                    iconName = 'image'
                    iconType = 'font-awesome'
                    text = 'Photo Album'
                    onPress={() => {
                        navigation.navigate('PhotoAlbum')
                    }}
                />
            </View>
           
            <View>
                <IconWithText 
                    iconName = 'smile-o'
                    iconType = 'font-awesome'
                    text = 'Mood Detector'
                    onPress={() => {
                        navigation.navigate('MoodDetector')
                    }}
                />
            </View>

            <View>
                <IconWithText 
                    iconName = 'user'
                    iconType = 'font-awesome'
                    text = 'Profile'
                    onPress={() => {
                        navigation.navigate('Profile')
                    }}
                />
            </View>
            
        </View>
        </View>
        
        <Modal visible={showEditModal} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <View style={styles.inputContainer}>
              <Icon
                name = 'bookmark-o'
                type = 'font-awesome'
                style={styles.icon}
                color='#35aa94'
                size= {18}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Enter task name"
                value={selectedTask?.task}
                onChangeText={(text) =>
                  setSelectedTask({ ...selectedTask, task: text })
                }
              />
            </View>
           
            <CustomButton text="Submit" 
              onPress={() => {
                handleEditTaskSubmit(selectedTask);
                handleEditModalClose();
              }} 
            />
            <CustomButton text="Cancel" onPress={handleEditModalClose} type='SECONDARY'/>
            
          </View>
        </Modal>

    </View>



    );
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
    
    listItem: {
      fontSize:20,
      fontWeight:'900',
      paddingHorizontal:10,
      width:'73%',
    },
    image: {
      width: 400,
      height: 150,
      opacity: 0.6,
      marginBottom: 0,
    },
    bottomTab:{
      backgroundColor:'#35aa94',
      flexDirection: 'row',
      alignContent:'space-between',
      alignItems:'center',
      height:80,
    },
    bottomTabContainer:{
      paddingTop:70,
      flex: 1, 
      justifyContent: 'flex-end',
      
    },
    list:{
      borderWidth:1, 
      borderColor:"grey"
    },
    listContainer:{
      flexDirection:'row',
      paddingLeft:0,
    },
    bodyContainer:{
      flexDirection:'row',
      height:100,
      paddingTop:30
    },
    date:{
      flexDirection:'column',
      paddingLeft:30,
      fontSize:15,
      fontWeight:'700',
      color:'#0d0900'
    },
    today:{
      flexDirection:'column',
      paddingLeft:30,
      fontSize:23,
      fontWeight:'300'
    },
    nameText:{
      flexDirection:'column',
      paddingLeft:30, 
      fontSize:25,
      textAlignVertical:'center',
    },
    modalTitle:{
      textAlign:'center',
      fontSize:28,
      fontWeight: 'bold',
      color:'black',
      padding:20,
      fontFamily: 'sans-serif-light',
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
    modalInput:{
      backgroundColor: 'white',
      width: '86%',
      fontWeight:'700',
      color:'#616161',
      paddingHorizontal: 5,   
      alignSelf:'center',
      marginVertical: 5,
    },
    icon:{
      paddingHorizontal:10,
      
    },
  });
  export default HomeScreen;