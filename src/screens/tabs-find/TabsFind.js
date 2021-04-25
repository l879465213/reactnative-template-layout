import {useIsFocused, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ButtonImage from '../../components/button-image/ButtonImage';
import SearchBar from '../../components/search-bar/SearchBar';
import SpinnerButton from '../../components/spinner-button/SpinnerButton';
import TabTopBar from '../../components/tab-topbar/TabTopbar';
import consts from '../../libs/consts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {navigate, navigationRef, replace} from '../../services/navigation';
import {requestGet} from '../../services/network';
import FindList from './FindList';

export default function TabsFind({}) {
  const {params, key, name} = useRoute();
  const focused = useIsFocused();

  useEffect(() => {
    if (params?.tab) {
      setGraduation('');
    }
  }, [params]);

  if (
    !focused &&
    [routes.tabFriends, routes.tabMore, routes.tabChat].includes(
      navigationRef.current.getCurrentRoute().name,
    )
  ) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <TabTopBar title="Find" />
      <FindList
        keyword={params?.keyword || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 4,
    marginTop: 5,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  spinner: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});
