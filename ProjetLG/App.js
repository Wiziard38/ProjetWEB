//App.js
import {StatusBar} from 'expo-status-bar';
import {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Implémenter le LG :)</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
