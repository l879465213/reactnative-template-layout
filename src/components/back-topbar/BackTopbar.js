import React, {useState} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import image from '../../libs/image';
import {goBack} from '../../services/navigation';

export default function BackTopbar({children, onGoBack}) {
  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={onGoBack || goBack}>
        <View style={[styles.back]}>
          <Image style={styles.backIcon} source={image.back} />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    borderBottomColor: '#e5e5e5',
  },
  center: {flex: 1},
  back: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
