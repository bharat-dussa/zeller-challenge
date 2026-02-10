/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RealmProvider, RealmServiceProvider } from './src/app/providers/realm-service.context';
import { createEncryptedRealmConfig } from './src/shared/db/realConfig';
import { RootNavigator } from './src/app/navigation/root-navigator';

function App() {
  const [config, setConfig] = useState<any>(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    (async () => {
      const cfg = await createEncryptedRealmConfig();
      setConfig(cfg);
    })();
  }, []);

  if (!config) return null;

  return (
    <SafeAreaProvider>
      <RealmProvider {...config}>
        <RealmServiceProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <RootNavigator />
          </NavigationContainer>
        </RealmServiceProvider>
      </RealmProvider>
    </SafeAreaProvider>
  );
}

export default App;
