import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {navigate, navigationRef} from './services/navigation';
import SimpleToast from 'react-native-simple-toast';
import PushNotification from 'react-native-push-notification';

import routes from './libs/routes';
import consts from './libs/consts';

import Login from './screens/login/Login';
import Splash from './screens/splash/Splash';
import Tabs from './screens/tabs/Tabs';

import {userUpdate} from './redux/user/UserActions';
import {requestPut} from './services/network';
import {isIos} from './services/util';
import {getItem} from './services/preference';

const Stack = createStackNavigator();

export default function Router({}) {
  const dispatch = useDispatch();
  const {userId} = useSelector((s) => s.user, []);

  useEffect(() => {
    PushNotification.channelExists('', (e) => {
      if (!e) {
        PushNotification.createChannel({
          channelId: '', // (required)
          channelName: '', // (required)
          channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        });
      }
    });
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
    if (isIos) {
      PushNotification.clearAllNotifications();
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    PushNotification.configure({
      onNotification: (x) => {
        handleNotifciationData(x.data || x);
      },
    });
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
    if (isIos) {
      PushNotification.clearAllNotifications();
    }
    const handleNotifciationData = (data) => {
      PushNotification.cancelAllLocalNotifications();
      PushNotification.removeAllDeliveredNotifications();
      if (isIos) {
        PushNotification.clearAllNotifications();
      }
    };

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) {
          return;
        }
        const {data} = remoteMessage;
        handleNotifciationData(data);
      });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (!remoteMessage) {
        return;
      }
      if (navigationRef.current.getCurrentRoute().name !== routes.message) {
        getItem('pushApp').then((d) => {
          if (d === 'true') {
            const {
              data,
              notification: {title, body},
            } = remoteMessage;
            PushNotification.localNotification({
              channelId: '',
              playSound: true,
              soundName: 'default',
              priority: 'high',
              title: title || 'K',
              message: body || '',
              userInfo: data,
              ...data,
            });
          }
        });
      }
    });

    const unsubscribeOpend = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        if (!remoteMessage) {
          return;
        }
        const {data} = remoteMessage;
        handleNotifciationData(data);
      },
    );

    const unsubscribeToken = messaging().onTokenRefresh((token) => {
      requestPut({
        url: consts.apiUrl + `/users/${userId}`,
        body: {
          columns: ['Token'],
          values: [token],
        },
      })
        .then(() => {
          dispatch(userUpdate({user: {token}}));
        })
        .catch((e) => {
          SimpleToast.show('Push token registration error');
        });
    });

    return () => {
      unsubscribe();
      unsubscribeOpend();
      unsubscribeToken();
    };
  }, [userId]);

  useEffect(() => {
    messaging()
      .requestPermission()
      .then((a) => {
        if (
          a === messaging.AuthorizationStatus.AUTHORIZED ||
          a === messaging.AuthorizationStatus.PROVISIONAL
        ) {
        } else {
          SimpleToast.show(
            'Please allow permission in settings to receive push notifications.',
          );
        }
      });
    return () => {
      dispatch({type: 'clear'});
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator headerMode="none" initialRouteName={routes.splash}>
          <Stack.Screen name={routes.splash} component={Splash} />
          <Stack.Screen name={routes.tab} component={Tabs} />
          <Stack.Screen name={routes.login} component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
