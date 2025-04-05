import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Appbar } from 'react-native-paper';

export default function Header({title}) {
    const _goBack = () => router.back();
  return (
    <Appbar.Header mode='small'>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title={title} />

    </Appbar.Header>
  )
}

const styles = StyleSheet.create({})