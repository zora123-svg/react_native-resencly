import { Component } from 'react'
import { Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { styled } from 'nativewind'

const SafeAreaView = styled(RNSafeAreaView)

/**
 * Shows the settings screen for the app.
 */
export default class settings extends Component {
  render() {
    return (
      <SafeAreaView>
      <SafeAreaView>
        <Text> textInComponent </Text>
      </SafeAreaView>
      </SafeAreaView>
    )
  }
}
