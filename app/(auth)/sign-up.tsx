import { Component } from 'react'
import { Text, View } from 'react-native'
import {Link} from "expo-router"

/**
 * Lets a user create an account and return to the sign in flow.
 */
export default class signUp extends Component {
  render() {
    return (
      <View>
        <Text>Signin</Text>
        <Link href="/(auth)/sign-in">Signup</Link>
      </View>
    )
  }
}
