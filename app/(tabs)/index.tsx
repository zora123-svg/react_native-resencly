import "@/global.css"
import { Text, View, Image } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useUser } from "@clerk/expo";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs"
import ListHeading from "@/componets/ListHeading";
import UpcomingSubscriptionCard from "@/componets/UpcomingSubscriptionCard";
import { FlatList } from "react-native";
import SubscriptionCard from "@/componets/SubscriptionCard";
import { useState } from "react";
 const SafeAreaView = styled(RNSafeAreaView) // We use SafeAreaVeiw to fit our content within smartphone screen
// Home UI



export default function App() {
 
  const [expandedSubscriptionID, setexpandedSubscriptionID] = useState<string |null>(null)
  const { user } = useUser()

  // The part of the email before the @ acts as the user's display name
  const displayName = user?.primaryEmailAddress?.emailAddress.split("@")[0] ?? ""

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          {/* Clerk serves the uploaded photo, or a generated default when there isn't one */}
          {user?.imageUrl
            ? <Image source={{ uri: user.imageUrl }} className="home-avatar" accessibilityLabel="Your profile photo" />
            : <View className="home-avatar bg-muted" />}
          <Text className="home-user-name" numberOfLines={1}>{displayName}</Text>
        </View>
        <Image source={icons.add} className="home-add-icon" />

      </View>


      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>

          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />

        <FlatList data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => (
            // Spreading all properties of 'item' directly into UpcomingSubscriptionCard component
            <UpcomingSubscriptionCard {...item} />)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empty-state">No upcoming
            renewals yet.</Text>} />
      </View>

      <View className="flex-1" >
        <ListHeading title="All Subscriptions" />

        <FlatList 
          data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionID === item.id}
            onPress={() => setexpandedSubscriptionID((currentID)=> 
              (currentID === item.id ? null : item.id))}
        />
      )}
    
        extraData={expandedSubscriptionID}
        ItemSeparatorComponent={() => <View className="h-4" />} // Seperate Items within the view
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
        contentContainerClassName="pb-30"
         />



      </View>


    </SafeAreaView>
  );
}