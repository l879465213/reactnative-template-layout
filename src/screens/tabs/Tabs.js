import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import routes from '../../libs/routes';
import TabsFriend from '../tabs-friend/TabsFriend';
import TabsChat from '../tabs-chat/TabsChat';
import TabsFind from '../tabs-find/TabsFind';
import TabsMore from '../tabs-more/TabsMore';
import image from '../../libs/image';
import {Image, SafeAreaView} from 'react-native';
import TabIcon from './TabIcon';
import TabBar from './TabBar';
import colors from '../../libs/colors';

const BottomTab = createBottomTabNavigator();
export default function Tabs({}) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <BottomTab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        initialRouteName={routes.tabFriends}
        tabBarOptions={{
          keyboardHidesTabBar: true,
          activeTintColor: colors.primary,
          inactiveBackgroundColor: '#222',
        }}>
        <BottomTab.Screen
          options={{
            tabBarLabel: 'Friends',
            tabBarIcon: (props) => (
              <TabIcon
                {...props}
                icon={image.tabFriendOff}
                focusedIcon={image.tabFriendOn}
              />
            ),
          }}
          name={routes.tabFriends}
          component={TabsFriend}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'Chats',
            tabBarIcon: (props) => (
              <TabIcon
                {...props}
                icon={image.tabChatOff}
                focusedIcon={image.tabChatOn}
              />
            ),
          }}
          name={routes.tabChat}
          component={TabsChat}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'Find',
            tabBarIcon: (props) => (
              <TabIcon
                {...props}
                icon={image.tabFindOff}
                focusedIcon={image.tabFindOn}
              />
            ),
          }}
          name={routes.tabFind}
          component={TabsFind}
        />
        <BottomTab.Screen
          options={{
            tabBarLabel: 'More',
            tabBarIcon: (props) => (
              <TabIcon
                {...props}
                icon={image.tabMoreOff}
                focusedIcon={image.tabMoreOn}
              />
            ),
          }}
          name={routes.tabMore}
          component={TabsMore}
        />
      </BottomTab.Navigator>
    </SafeAreaView>
  );
}
