import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const PlayerStatusSeal = ({ status, soldToName }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Colors and config
  const config = {
    sold: {
      primaryColor: '#4CAF50', // Green
      secondaryColor: '#2E7D32', // Darker green
      ribbonColor: 'rgba(255, 235, 59, 0.7)', // Gold ribbon
    },
    unsold: {
      primaryColor: '#F44336', // Red
      secondaryColor: '#C62828', // Darker red
      ribbonColor: 'rgba(189, 189, 189, 0.7)', // Silver ribbon
    }
  };

  const currentConfig = config[status] || {};

  useEffect(() => {
    if (status === 'sold' || status === 'unsold') {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.spring(opacityAnim, {
          toValue: 1,
          speed: 10,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 0.3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -0.3,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0.15,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -0.15,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [status]);

  if (status !== 'sold' && status !== 'unsold') return null;

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-20deg', '20deg'],
  });

  return (
    <View style={styles.sealContainer}>
      <Animated.View style={{ opacity: opacityAnim }}>
        <Animated.View
          style={[
            styles.seal,
            {
              borderColor: currentConfig.primaryColor,
              transform: [
                { scale: scaleAnim },
                { rotate },
              ],
            },
          ]}
        >
          {/* Stamp texture background */}
          <View style={[
            styles.stampTexture, 
            { backgroundColor: currentConfig.secondaryColor }
          ]} />
          
          {/* Main content */}
          <View style={styles.sealContent}>
            <Text style={[
              styles.sealMainText,
              { color: currentConfig.primaryColor }
            ]}>
              {status.toUpperCase()}
            </Text>
            {soldToName && status === 'sold' && (
              <Text style={[
                styles.sealSubText,
                { color: currentConfig.primaryColor }
              ]}>
                TO {soldToName.toUpperCase()}
              </Text>
            )}
          </View>
          
          {/* Ribbon effect */}
          <View style={[
            styles.sealRibbon, 
            { backgroundColor: currentConfig.ribbonColor }
          ]} />
          
          {/* Stamp shine effect */}
          <View style={styles.stampShine} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sealContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  seal: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sealContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: '80%',
    height: '80%',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    zIndex: 2,
  },
  sealMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sealSubText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  sealRibbon: {
    position: 'absolute',
    bottom: -15,
    width: '90%',
    height: 40,
    transform: [{ rotate: '-5deg' }],
    zIndex: 1,
  },
  stampTexture: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  stampShine: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '45deg' }],
  },
});

export default PlayerStatusSeal;