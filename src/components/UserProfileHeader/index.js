/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { Languages, Tools, withTheme } from "@common";
import styles from "./styles";

class UserProfileHeader extends PureComponent {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  loginHandle = () => {
    if (this.props.user.name === Languages.Guest) {
      this.props.onLogin();
    } else {
      this.props.onLogout();
    }
  };

  render() {
    const { user } = this.props;
    const avatar = Tools.getAvatar(user);
    const {
      theme: {
        colors: { background, text },
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.header}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={[styles.fullName, { color: text }]}>{user.name}</Text>
            <Text style={[styles.address, { color: text }]}>
              {user ? user.address : ""}
            </Text>

            <TouchableOpacity onPress={this.loginHandle}>
              <Text style={styles.loginText}>
                {user.name === Languages.Guest
                  ? Languages.Login
                  : Languages.Logout}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default withTheme(UserProfileHeader);
