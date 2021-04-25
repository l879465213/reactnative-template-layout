import React, {useEffect} from 'react';
import {
  AppState,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {reset} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {isIos} from '../../services/util';

export default function Splash({}) {
  const user = useSelector((s) => s.user, []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.signed) {
      reset(routes.tab);
    } else if (user.inited) {
      reset(routes.login);
    }
  }, [user.inited, user.signed]);

  const process = () => {
    requestPost({
      url: consts.apiUrl + '/version',
      body: {
        isIos: isIos,
      },
    })
      .then((x) => {
        if (x.version === consts.version || x.skip) {
          dispatch(userCheckToken);
        } else {
          dispatch(
            dialogOpenMessage({
              label: 'New Version Available',
              title: 'Update',
              message:
                'To use the application, please update it to the latest version' +
                `(${x.version}).`,
              onPress: () => {
                Linking.openURL(
                  isIos
                    ? 'https://itunes.apple.com/app/'
                    : '',
                );
              },
            }),
          );
        }
      })
      .catch((e) => {
        dispatch(
          dialogOpenMessage({
            message: e.message || e,
            title: 'Try again',
            onPress: () => {
              process();
            },
          }),
        );
      });
  };

  useEffect(() => {
    const listener = (e, a) => {
      if (e === 'active') {
        process();
      }
    };
    AppState.addEventListener('change', listener);
    let tm = setTimeout(() => {
      process();
    }, 1000);

    return () => {
      AppState.removeEventListener('change', listener);
      clearTimeout(tm);
      if (!isIos) {
        StatusBar.setBackgroundColor(colors.white);
      }
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  return (
    <RootLayout style={styles.root} safeBackgroundColor={colors.primary}>
      <View style={styles.view}>
        <Image source={image.splashLogo} style={styles.logo} />
      </View>
      <TextWrap font={fonts.barlowRegular} style={styles.info}>
        ©PUBLIC POLICY AND MANAGEMENT.
      </TextWrap>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
    </RootLayout>
  );
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
  },
  logo: {
    marginLeft: 30,
    width: '50%',
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  info: {
    fontSize: 12,
    lineHeight: 30,
    color: '#a0e5be',
    marginBottom: 30,
    alignSelf: 'center',
  },
});
