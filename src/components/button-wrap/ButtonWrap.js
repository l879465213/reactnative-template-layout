import React from 'react';
import {StyleSheet} from 'react-native';

import Ripple from 'react-native-material-ripple';
import colors from '../../libs/colors';
import fonts from '../../libs/fonts';
import TextWrap from '../text-wrap/TextWrap';

export default function ButtonWrap({
  onPress,
  disabled,
  loading,
  children,
  font,
  styleTitle = {},
  style = {},
}) {
  return (
    <Ripple
      style={[styles.root, !disabled && styles.rootEnabled, style]}
      disabled={loading || Boolean(disabled)}
      onPress={onPress}>
      <TextWrap
        style={[styles.button, !disabled && styles.buttonEnabled, styleTitle]}
        font={font || fonts.robotoMedium}>
        {children}
      </TextWrap>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
  },
  button: {
    fontSize: 16,
    color: '#777777',
    lineHeight: 19,
  },
  rootEnabled: {
    backgroundColor: colors.primary,
  },
  buttonEnabled: {
    color: colors.white,
  },
});
