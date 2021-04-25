import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import TextWrap from '../text-wrap/TextWrap';

export default function NoResult({}) {
  const [height, setHeight] = useState(0);
  return (
    <View style={styles.root}>
      <Image
        source={image.nodata}
        style={[styles.image, height && {height}]}
        onLayout={(e) => {
          if (!height) {
            setHeight(e.nativeEvent.layout.width);
          }
        }}
      />
      <TextWrap font={fonts.robotoMedium} style={styles.title}>
        No results were found.
      </TextWrap>
      <TextWrap style={styles.message}>Please re-enter.</TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 21,
    color: '#222222',
  },
  message: {
    color: '#777777',
    fontSize: 14,
    lineHeight: 21,
  },
  image: {
    width: '10%',
    resizeMode: 'contain',
  },
});
