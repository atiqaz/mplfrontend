import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export default function RefreshLayout({ children, refreshFunction }) {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onRefresh = () => {
    setRefreshing(true);
    if(refreshFunction){
        refreshFunction()
    }
    setTimeout(() => {
      router.replace(pathname);
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
