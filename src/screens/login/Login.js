import React, {useEffect, useState} from 'react';
import {Image, Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonWrap from '../../components/button-wrap/ButtonWrap';
import InputWrap from '../../components/input-wrap/InputWrap';
import TextButton from '../../components/text-button/TextButton';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {userCheckToken} from '../../redux/user/UserActions';
import {navigate, reset} from '../../services/navigation';
import {requestPost} from '../../services/network';
import {getItem, setItem} from '../../services/preference';
import {screenWidth, validationEmail} from '../../services/util';

export default function Login({}) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((username || password) && passwordError) {
      setPasswordError('');
    }
  }, [username, password]);

  useEffect(() => {
    getItem('email').then((x) => {
      if (x && validationEmail(x)) {
        setUsername(x);
      }
    });
  }, []);

  useEffect(() => {
    if (user.signed) {
      reset(routes.tab);
    }
  }, [user.signed]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (
        !validationEmail(username) ||
        password.length < 8 ||
        password.length > 20
      ) {
        throw '';
      }
      Keyboard.dismiss();
      const {token} = await requestPost({
        url: consts.apiUrl + '/users/signin',
        body: {
          email: username,
          password,
        },
      });
      await setItem('pushApp', 'true');
      await setItem('token', token);
      dispatch(userCheckToken);
      await setItem('email', username);
    } catch (error) {
      if (error.message === 'Network Error') {
        dispatch(dialogError(error));
      } else {
        setPasswordError(
          'The information does not match.\nPlease check your ID or password.',
        );
      }
    }
    setLoading(false);
  };

  return (
    <RootLayout style={styles.root}>
      <Image source={image.logo} style={styles.logo} />
      <InputWrap
        icon={image.idIcon}
        placeholder="Please enter your email."
        value={username}
        borderColor={Boolean(passwordError) && colors.red}
        onChange={setUsername}
        maxLength={50}
      />
      <InputWrap
        icon={image.pwIcon}
        style={styles.input2}
        placeholder="Please enter your password."
        secure
        value={password}
        onChange={setPassword}
        maxLength={20}
        borderColor={Boolean(passwordError) && colors.red}
        message={passwordError}
      />
      <ButtonWrap
        loading={loading}
        onPress={handleLogin}
        disabled={!password || !username || passwordError}
        style={styles.button}>
        Login
      </ButtonWrap>
      <View style={styles.row}>
        <TextButton
          onPress={() => {
            dispatch(
              dialogOpenMessage({
                onPress: () => {
                  navigate(routes.registerSearch);
                },
                message: 'Search for your name or\ndate of birth to sign up!',
              }),
            );
          }}
          style={[styles.t, styles.t1]}>
          Sign Up Free
        </TextButton>
        <TextButton
          onPress={() => {
            navigate(routes.findIdPassword);
          }}
          style={styles.t}>
          Find ID·Password
        </TextButton>
      </View>
    </RootLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  row: {flexDirection: 'row', marginTop: 14, alignItems: 'center'},
  t: {
    paddingHorizontal: 16,
  },
  t1: {
    borderRightWidth: 1,
    borderColor: '#777777',
  },
  input2: {
    marginTop: 16,
  },
  logo: {
    width: screenWidth / 1.5,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 40,
  },
});
