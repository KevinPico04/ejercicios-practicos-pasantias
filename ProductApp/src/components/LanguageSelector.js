import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LanguageContext } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, translate } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label={translate('english')} value="en" />
        <Picker.Item label={translate('spanish')} value="es" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default LanguageSelector;
