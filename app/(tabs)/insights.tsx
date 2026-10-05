import { Component } from 'react'
import { Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import {styled} from "nativewind"

const SafeAreaView = styled(RNSafeAreaView)

/**
 * Shows the insights screen for the user.
 */
export default class insights extends Component {
  render() {
    return (
     
      <SafeAreaView>
        <Text> textInComponent </Text>
      </SafeAreaView>
      
    )
  }
}
