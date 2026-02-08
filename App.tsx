/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider
} from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/root-navigator/root-navigator';
import { RealmProvider } from '@realm/react';
import "./src/services/local/realm"

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <RealmProvider >
      <NavigationContainer>
         <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootNavigator />
      </NavigationContainer>
      </RealmProvider>
    </SafeAreaProvider>
  );
}


export default App;
