import React, { useState,Component,useEffect } from 'react';
import { View, TextInput, Button, Platform, StyleSheet, Text, PermissionsAndroid,ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../../Firebase/firebaseConfig';
import firestore from "@react-native-firebase/firestore";
import {Picker} from '@react-native-picker/picker'
import { Icon } from '@rneui/themed';
import CustomButton from '../component/CustomButton';
import { useNavigation } from '@react-navigation/native';


const AddTask = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation();
    const [task,setTask] = useState('');
    const today = new Date().toLocaleDateString(undefined, options);
    const [taskError,setTaskError] = useState(false);
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
          setDate(selectedDate);
        }
      };

    const onSubmitPressed = async() => {
      setTaskError(!task);
    

    if (!task) {

      alert(
        "Empty field(s)"
      );
      return;
    }
        await addTaskToFirestore();
        navigation.navigate('Home')
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const addTaskToFirestore = async () => {
      const userId = firebase.auth().currentUser.uid;
      try {
          await firestore().collection('users').doc(userId).collection('tasks').add({
            task: task,
            date: date.toLocaleDateString(undefined, options),
          });
          console.log('Task added to Firestore');
        } catch (error) {
          console.log(error);
        }
    }
  
      
    return (
        <View style = {{marginVertical: 100}}>
            <ScrollView>

            <View>
                <Text style ={styles.headerText}>Add Task</Text>
            </View>

            <View style = {[styles.inputContainer, taskError && styles.errorBorder]}>
                <Icon 
                  type='font-awesome'
                  name='book'
                  color='#35aa94'
                  size= {18}
                  style={styles.icon}
                />
                <TextInput 
                    placeholder="Task"
                    style = {styles.input}
                    value = {task}
                    onChangeText={(text) => setTask(text)}
                    
                />
            </View>
            {taskError && <Text style={styles.errorMessage}>Task is required</Text>}
            <View style ={styles.inputContainer}>
                <Icon 
                  type='font-awesome'
                  name='calendar'
                  color='#35aa94'
                  size= {18}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Date of Birth"
                  value={`Date: ${date.toLocaleDateString(undefined, options)}`}
                  onFocus={() => setShowDatePicker(true)}
                  style={styles.input}
                  required
                />
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
        </View>

            <CustomButton 
                text="Submit"
                onPress = {onSubmitPressed}
            />
            <CustomButton 
                text="Back to Home"
                type = 'SECONDARY'
                onPress = {()=> {
                    navigation.navigate('Home')
                }}
            />
            </ScrollView>
            


        </View>
    )
    
}
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
  errorBorder:{
    borderColor: 'red',
    borderWidth: 2,
  },
  errorMessage:{
    paddingHorizontal:20,
    paddingVertical:5,
    color:'red',
  },
})
export default AddTask;