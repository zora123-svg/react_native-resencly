import { useLocalSearchParams, Link } from 'expo-router'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

/**
 * Displays the details for one selected subscription item.
 */
export default class SubscriptionDetails extends Component {
  render() {
    const {id} = useLocalSearchParams<{id: string}>();
    return (
      <View>
        <Text>SubscriptionDetails: {id}</Text>
        <Link href="/">Go Back</Link>
      </View>
    )
  }
}
