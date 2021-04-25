import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import FriendListItem from '../../components/friend-listitem/FriendListItem';
import ListHeader from '../../components/list-header/ListHeader';
import consts from '../../libs/consts';
import {dialogError, dialogOpenAction} from '../../redux/dialog/DialogActions';
import {requestGet} from '../../services/network';
import Share from 'react-native-share';
import {friendRequest} from '../../redux/friend/FriendActions';
import {useIsFocused} from '@react-navigation/native';
import {navigate, navigationRef} from '../../services/navigation';
import routes from '../../libs/routes';
import {getItem, setItem} from '../../services/preference';
import FriendListItemLocal from '../../components/friend-listitem-local/FriendListItemLocal';

export default function FindList({keyword, graduation, program, year}) {
  const dispatch = useDispatch();
  const {userId} = useSelector((s) => s.user, []);
  const [mode, setMode] = useState('local');
  const [searchData, setSearchData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (
      keyword ||
    ) {
      setMode('search');
      setData([]);
      fetchUsers();
    } else {
      setMode('local');
      getItem('find-local').then((d) => {
        if (d) {
          const list = JSON.parse(d);
          setData([...list.reverse()]);
        }
      });
    }
  }, [keyword]);

  const fetchUsers = async () => {
    requestGet({
      url: consts.apiUrl + '/users',
      query: {
        userId,
        keyword: keyword || '',
        search: 'find',
      },
    })
      .then((data) => {
        // console.log(JSON.stringify(data, null, 2));
      })
      .catch((e) => {
        dispatch(dialogError(e));
      });
  };

  const handlePress = (user) => (type) => {
    getItem('find-local').then((d) => {
      let list;
      if (d) {
        list = JSON.parse(d);
      } else {
        list = [];
      }
      list.push(user);
      setItem('find-local', JSON.stringify(list));
    });

    if (user.isSigned) {
      if (!user.isFriend && !user.friendRequest) {
        dispatch(
          dialogOpenAction({
            cancelTitle: 'Close',
            message: '',
            onPress: (x) => {
              if (x) {
                dispatch(
                  friendRequest({
                    userId: userId,
                    userIdTo: user.userId,
                    onSuccess: () => {
                      fetchUsers();
                    },
                  }),
                );
              }
            },
          }),
        );
      }
    } else {
      dispatch(
        dialogOpenAction({
          title: 'Invite',
          cancelTitle: '',
          message: '',
          onPress: (a) => {
            if (a) {
              Share.open({
                // url: 'data:image/gif;base64,' + x.base64(),
                // type: 'image/png',
                title: '',
                subject: '',
                message: ``,
                email: user.email,
              })
                .then((res) => {})
                .catch((err) => {
                  if (err.message !== 'User did not share') {
                    dispatch(dialogError(err));
                  }
                });

              return;
            }
          },
        }),
      );
    }
    switch (type) {
      case 'add':
        break;
      case 'guest':
    }
  };

  return (
    <>
      <ListHeader
        label={mode === 'search'}
        buttonLabel="Delete all"
        button={mode === 'local' && data.length > 0}
        onPress={() => {
          setItem('find-local', JSON.stringify([]));
          setData([]);
        }}
      />
      <FlatList
        initialNumToRender={10}
        data={mode === 'local' ? data : searchData}
        extraData={mode === 'local' ? data : searchData}
        keyExtractor={(item, index) =>
          ' ' + item.isFriend + item.friendRequest + item.userId + String(index)
        }
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          if (mode === 'search') {
            searchData[index].mask = !item.isSigned || item.isSigned === 0;
            return (
              <FriendListItem
                search={{
                  keyword,
                }}
                {...item}
                index={index}
                onPress={handlePress(item)}
                onItemPress={
                  Boolean(item.isFriend) &&
                  (() => {
                    getItem('find-local').then((d) => {
                      let list;
                      if (d) {
                        list = JSON.parse(d);
                      } else {
                        list = [];
                      }
                      list.push(item);
                      setItem('find-local', JSON.stringify(list));
                    });
                    // navigate(routes.profile, {userId: item.userId});
                  })
                }
              />
            );
          } else {
            return (
              <FriendListItemLocal
                {...item}
                index={index}
                onDelete={() => {
                  const d = [...data.filter((x) => x.userId !== item.userId)];
                  setData(d);
                  setItem('find-local', JSON.stringify(d));
                }}
              />
            );
          }
        }}
      />
    </>
  );
}
