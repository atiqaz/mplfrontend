import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";

export default function PullToRefreshLayout({ children, refreshFunction }) {
  const translateY = useSharedValue(0);
  const isRefreshing = useSharedValue(false);

  // Gesture Handler for Pull-to-Refresh
  const onGestureEvent = (event) => {
    if (!isRefreshing.value && event.nativeEvent.translationY > 0) {
      translateY.value = event.nativeEvent.translationY;
    }
  };

  const onGestureEnd = (event) => {
    if (event.nativeEvent.translationY > 100 && !isRefreshing.value) {
      isRefreshing.value = true; // Show loader
      runOnJS(triggerRefresh)();
    } else {
      translateY.value = withSpring(0); // Reset animation if not refreshing
    }
  };

  // Function to trigger refresh and reset animation
  const triggerRefresh = async () => {
    console.log('refreshing')
    await refreshFunction(); // Call refresh function
    isRefreshing.value = false; // Hide loader
    translateY.value = withSpring(0); // Reset animation after refresh
  };

  // Animated styles for pulling
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Animated styles for loader visibility
  const loaderStyle = useAnimatedStyle(() => ({
    opacity: isRefreshing.value ? 1 : 0,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {/* Screen Content */}
          {children}

          {/* Refresh Indicator */}
          <Animated.View style={[styles.loader, loaderStyle]}>
            <ActivityIndicator size="large" color="blue" />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {height:"auto"},
  loader: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    zIndex: 1, // Ensure it's above the content
  },
});
