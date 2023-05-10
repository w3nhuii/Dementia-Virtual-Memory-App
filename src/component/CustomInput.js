import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import { Icon } from '@rneui/themed';

const CustomInput = ({
  control, 
  name, 
  rules ={}, 
  placeholder,
  secureTextEntry,
  iconName,
}) => {
  return (
    <Controller
      control={control}
      name = {name}
      rules = {rules}
      render = {({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <View>
          <View style={[styles.container, {borderColor: error ? 'red' : '#e8e8e8' }]}>
            {iconName && <Icon name={iconName} type= 'font-awesome' color='#35aa94' size= {18} style={styles.icon} />}
            <TextInput
              value = {value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={[styles.input, {}]}
              secureTextEntry = {secureTextEntry}
            />
          </View> 
          {error && (
            <Text style={{color:'red', alignSelf: 'flex-start', paddingLeft:20,}}>{error.message}</Text>
          )}
          
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container:{
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
    width: '70%',
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

export default CustomInput;