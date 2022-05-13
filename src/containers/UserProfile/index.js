/** @format */

import React, { PureComponent } from "react";
import { View, ScrollView, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import _ from "lodash";

import {
  UserProfileHeader,
  UserProfileItem,
  ModalBox,
  CurrencyPicker,
} from "@components";
import { Languages, Color, Tools, Config, withTheme } from "@common";
import { getNotification } from "@app/Omni";

import styles from "./styles";

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pushNotification: false,
    };
  }

  componentDidMount() {
    this._getNotificationStatus();
    this._handleSwitchNotification(true);
  }

  _getNotificationStatus = async () => {
    const notification = await getNotification();

    this.setState({ pushNotification: notification || false });
  };

  /**
   * TODO: refactor to config.js file
   */
  _getListItem = () => {
    const { currency, wishListTotal, userProfile, isDarkTheme } = this.props;
    const listItem = [...Config.ProfileSettings];
    const items = [];
    let index = 0;

    for (let i = 0; i < listItem.length; i++) {
      const item = listItem[i];
      if (item.label === "PushNotification") {
        item.icon = () => (
          <Switch
            onValueChange={this._handleSwitchNotification}
            value={this.state.pushNotification}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === "DarkTheme") {
        item.icon = () => (
          <Switch
            onValueChange={this._onToggleDarkTheme}
            value={isDarkTheme}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === "Currency") {
        item.value = currency.code;
      }

      if (item.label === "WishList") {
        items.push({
          ...item,
          label: `${Languages.WishList} (${wishListTotal})`,
        });
      } else {
        items.push({ ...item, label: Languages[item.label] });
      }
    }

    if (!userProfile.user) {
      index = _.findIndex(items, (item) => item.label === Languages.Address);
      if (index > -1) {
        items.splice(index, 1);
      }
    }

    if (!userProfile.user || Config.Affiliate.enable) {
      index = _.findIndex(items, (item) => item.label === Languages.MyOrder);
      if (index > -1) {
        items.splice(index, 1);
      }
    }
    return items;
  };

  _onToggleDarkTheme = () => {
    this.props.toggleDarkTheme();
  };

  _handleSwitchNotification = (value) => {
    AsyncStorage.setItem("@notification", JSON.stringify(value), () => {
      this.setState({
        pushNotification: value,
      });
    });
  };

  _handlePress = (item) => {
    const { navigation } = this.props;
    const { routeName, isActionSheet } = item;

    if (routeName && !isActionSheet) {
      navigation.navigate(routeName, item.params);
    }

    if (isActionSheet) {
      this.currencyPicker.openModal();
    }
  };

  render() {
    const { userProfile, navigation, currency, changeCurrency } = this.props;
    const user = userProfile.user || {};
    const name = Tools.getName(user);
    const listItem = this._getListItem();
    const {
      theme: {
        colors: { background },
        dark,
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <ScrollView ref="scrollView">
          <UserProfileHeader
            onLogin={() => navigation.navigate("LoginScreen")}
            onLogout={() =>
              navigation.navigate("LoginScreen", { isLogout: true })
            }
            user={{
              ...user,
              name,
            }}
          />

          {userProfile.user && (
            <View style={[styles.profileSection(dark)]}>
              <Text style={styles.headerSection}>
                {Languages.AccountInformations.toUpperCase()}
              </Text>
              <UserProfileItem
                label={Languages.Name}
                onPress={this._handlePress}
                value={name}
              />
              <UserProfileItem label={Languages.Email} value={user.email} />
              {/* <UserProfileItem label={Languages.Address} value={user.address} /> */}
            </View>
          )}

          <View style={[styles.profileSection(dark)]}>
            {listItem.map((item, index) => {
              return (
                item && (
                  <UserProfileItem
                    icon
                    key={index.toString()}
                    onPress={() => this._handlePress(item)}
                    {...item}
                  />
                )
              );
            })}
          </View>
        </ScrollView>

        <ModalBox ref={(c) => (this.currencyPicker = c)}>
          <CurrencyPicker currency={currency} changeCurrency={changeCurrency} />
        </ModalBox>
      </View>
    );
  }
}

const mapStateToProps = ({ user, language, currency, wishList, app }) => ({
  userProfile: user,
  language,
  currency,
  wishListTotal: wishList.wishListItems.length,
  isDarkTheme: app.isDarkTheme,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions: CurrencyActions } = require("@redux/CurrencyRedux");
  const { toggleDarkTheme } = require("@redux/AppRedux");
  return {
    ...ownProps,
    ...stateProps,
    changeCurrency: (currency) =>
      CurrencyActions.changeCurrency(dispatch, currency),
    toggleDarkTheme: () => {
      dispatch(toggleDarkTheme());
    },
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withTheme(UserProfile));
