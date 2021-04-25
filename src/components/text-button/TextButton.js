import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import TextWrap from '../text-wrap/TextWrap';

export default function TextButton({
  children,
  onPress,
  style,
  disabled,
  styleTitle,
  font,
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.root, style]}>
      <TextWrap font={font} style={[styles.text, styleTitle]}>
        {children}
      </TextWrap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {color: '#777777', fontSize: 14, lineHeight: 14},
});
