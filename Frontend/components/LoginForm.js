import { StyleSheet, TextInput, View, Text} from 'react-native';
import {useState} from 'react';
import MonBouton from './MonBouton';

export default function LoginForm({ onConnect }) {
  const [username, setUsername] = useState('LuluLaQuiche');
  const [password, setPassword] = useState('123456');
  return (
    <View style={styles.container}>
      <TextInput
        nativeID='emailInput'
        style={styles.input} 
        onChangeText={setUsername} 
        value={username}
        placeholder="username"/>
      <TextInput
        nativeID='passwordInput'
        style={styles.input} 
        secureTextEntry={true} 
        onChangeText={setPassword} 
        value={password} 
        placeholder="Password"/>
      <MonBouton
        nativeID='connect'
        label='Se connecter' 
        onPress={() => onConnect(username, password)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1}, 
  input : {height: 40, margin: 12, borderWidth: 1}
})