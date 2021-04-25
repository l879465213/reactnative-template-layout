import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Avatar from '../../components/avatar/Avatar';
import ButtonImage from '../../components/button-image/ButtonImage';
import TabTopBar from '../../components/tab-topbar/TabTopbar';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {navigate} from '../../services/navigation';
import {parseName} from '../../services/util';
import MenuItem from './MenuItem';

export default function TabsMore({}) {
  const user = useSelector((s) => s.user, []);
  const toMyInfomation = () => {
    navigate(routes.myInfomation);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <TabTopBar title="More" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar size={50} onPress={toMyInfomation} path={user.profilePath} />
          <TouchableWithoutFeedback onPress={toMyInfomation}>
            <View style={styles.headerMain}>
              <TextWrap font={fonts.robotoMedium} style={styles.name}>
                {parseName(user.firstName, user.lastName)}
              </TextWrap>
              <TextWrap style={styles.email}>{user.email}</TextWrap>
            </View>
          </TouchableWithoutFeedback>
          <ButtonImage
            source={image.modify_box}
            size={42}
            onPress={() => {
              navigate(routes.profileSetting);
            }}
          />
        </View>
        <MenuItem
          label="Friend management"
          onPress={() => {
          }}
        />
        <MenuItem
          label="Push Setting"
          onPress={() => {
          }}
        />
        <MenuItem
          onPress={() => {
          }}
          label="Notice"
        />
        <MenuItem
          label="FAQ"
          onPress={() => {
          }}
        />
        <View style={styles.divider} />
        <MenuItem
          label="Terms of Service"
          onPress={() => {
          }}
        />
        <MenuItem
          label="Privacy Policy"
          last
          onPress={() => {
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 6,
    borderBottomColor: '#f2f2f2',
  },
  headerMain: {
    paddingHorizontal: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    lineHeight: 22,
    color: '#222222',
  },
  email: {
    fontSize: 12,
    lineHeight: 14,
    color: '#999999',
    marginTop: 4,
  },
  divider: {
    alignSelf: 'stretch',
    height: 5,
    backgroundColor: '#f2f2f2',
  },
});
