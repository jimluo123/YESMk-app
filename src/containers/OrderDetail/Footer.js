/** @format */

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { WooWorker } from "api-ecommerce";
import { connect } from "react-redux";

import { withTheme, Languages } from "@common";
import { Button } from "@components";
import styles from "./styles";

export const OrderStatus = {
  cancelled: "cancelled",
  refunded: "refunded",
};

class Footer extends React.PureComponent {
  state = { [OrderStatus.cancelled]: false, [OrderStatus.refunded]: false };

  _onPress = async (status) => {
    const {
      order,
      user: { user },
    } = this.props;
    this.setState({ [status]: true });
    const json = await WooWorker.updateOrder({ ...order, status }, order.id);
    // fetch my order when update success
    if (json.hasOwnProperty("id")) {
      if (typeof user === "undefined" || user === null) return;

      this.props.fetchMyOrder(user);
    }
    this.setState({ [status]: false });
  };

  render() {
    const { cancelled, refunded } = this.state;

    return (
      <View style={styles.footer}>
        <Button
          text={Languages.Cancel}
          style={[styles.button, { backgroundColor: "#ff1744" }]}
          textStyle={styles.buttonText}
          onPress={() => this._onPress(OrderStatus.cancelled)}
          isLoading={cancelled}
        />
        <Button
          text={Languages.Refund}
          style={[styles.button]}
          textStyle={styles.buttonText}
          onPress={() => this._onPress(OrderStatus.refunded)}
          isLoading={refunded}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/CartRedux");
  return {
    ...ownProps,
    ...stateProps,
    fetchMyOrder: (user) => {
      actions.fetchMyOrder(dispatch, user);
    },
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withTheme(Footer));
