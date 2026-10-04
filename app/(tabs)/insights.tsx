import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import {styled} from "nativewind"

const SafeAreaView = styled(RNSafeAreaView)


export default class insights extends Component {
  render() {
    return (
      <SafeAreaView>
        <Text> textInComponent </Text>
      </SafeAreaView>
    )
  }
}
