import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import image from '../../libs/image';
import TextWrap from '../text-wrap/TextWrap';

export default function Radio({label, value, onChange, style}) {
  return (
    <TouchableOpacity
      style={[styles.root, style]}
      onPress={() => {
        onChange(!value);
      }}>
      <Image
        style={styles.radio}
        source={value ? image.radioOn : image.radioOff}
      />
      <TextWrap style={[styles.label, !value && styles.ls]}>{label}</TextWrap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
  },
  ls: {color: '#ababab'},
  radio: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});
