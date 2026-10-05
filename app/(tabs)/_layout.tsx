import { tabs } from "@/constants/data"
import {Tabs} from "expo-router"
import { View } from "react-native"
import {Image} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import clsx from "clsx"
import { components , colors} from "@/constants/theme"

const tabBar = components.tabBar

/**
 * Builds the main bottom tab layout and configures each tab icon.
 */
const TabLayout = () =>{
    const insets = useSafeAreaInsets() // How much space a device takes up

    /**
     * Renders one tab icon and highlights it when the tab is active.
     */
    const TabIcon = ({focused, icon}: TabIconProps) => {
        return (
        <View className="tabs-icon">
            <View className={clsx('tabs-pill', focused && 'tabs-active')}
                  style={{position:"absolute"}}/> 
               <Image source={icon} className="tabs-glyph"/>
        </View>
        );
};

    return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle:{
            position: 'absolute',
            bottom: Math.max(insets.bottom, tabBar.horizontalInset),
            marginHorizontal: tabBar.horizontalInset,
            borderRadius: tabBar.radius,
            backgroundColor: colors.primary,
            borderTopWidth: 0,
            elevation: 0,
        },
        tabBarItemStyle: {
            paddingVertical: tabBar.height / 2 - tabBar
            .iconFrame / 1.6
        },
        tabBarIconStyle:{
            width: tabBar.iconFrame,
            height: tabBar.iconFrame,
            alignItems: "center"

        }

    }}
    >
       {tabs.map((tab) =>(
        <Tabs.Screen key={tab.name} name={tab.name} 
        options={{
            title: tab.title,
            tabBarIcon: ({focused}) => (
                <TabIcon focused={focused} icon={tab.icon}/>
                
            )
        
        }} />
       ))}
       

    </Tabs>
    )
}



export default TabLayout