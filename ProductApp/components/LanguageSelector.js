import React, { useContext } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Importación correcta
import { LanguageContext } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, translate } = useContext(LanguageContext);

  return (
    <View>
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setLanguage(itemValue)}
        mode="dropdown"  // Opcional: estilo del selector
        dropdownIconColor="#ffffff"  // Opcional: color del ícono
      >
        <Picker.Item label={translate('english')} value="en" />
        <Picker.Item label={translate('spanish')} value="es" />
      </Picker>
    </View>
  );
};

export default LanguageSelector;