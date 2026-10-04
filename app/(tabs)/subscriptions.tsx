import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled( RNSafeAreaView ) // Allows us to apply styling rules 

export default class subscriptions extends Component {
  render() {
    return (
      <SafeAreaView>
        <Text>Subscriptions</Text>
      </SafeAreaView>
    )
  }
}
