import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';

const renderModalInput = (title, value, onChangeText, onSubmit) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(false);
    onSubmit();
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{title}: {value}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={`Enter ${title}`}
              style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 20 }}
            />
            <TouchableOpacity onPress={handleSave} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default renderModalInput;
