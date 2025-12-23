import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f1020' }}>
      <ActivityIndicator size="large" color="#4c8bf5" />
    </View>
  );
}
