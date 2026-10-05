import { Component } from 'react'
import { Text, View } from 'react-native'
import {Link} from "expo-router"

/**
 * Lets a user sign in and move to the account creation screen.
 */
export default class signIn extends Component {
  render() {
    return (
      <View>
        <Text>Signin</Text>
        <Link href="/(auth)/sign-up">Create Account</Link>
      </View>
    )
  }
}
