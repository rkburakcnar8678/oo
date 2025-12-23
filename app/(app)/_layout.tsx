import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Grid, MessageSquare, Bell, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function AppLayout() {
  const { colors, theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontFamily: 'Lexend_500Medium',
          fontSize: 10,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Araçlar',
          tabBarIcon: ({ color, size }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: 'Sorular',
          tabBarIcon: ({ focused }) => (
            <View style={styles.middleButtonContainer}>
              <View style={styles.middleButton}>
                <MessageSquare size={24} color="#fff" />
              </View>
            </View>
          ),
          tabBarLabelStyle: {
            marginTop: 20,
            fontFamily: 'Lexend_500Medium',
            fontSize: 10,
            color: colors.subtext
          }
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Bildirimler',
          tabBarIcon: ({ color, size }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="exam-selection"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  middleButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4c8bf5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4c8bf5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
