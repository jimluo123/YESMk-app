/** @format */

import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

import { Icons, Styles, Languages } from "@common";
import { Icon, IconIO, toast } from "@app/Omni";
import { PickerBox, SafeAreaView } from "@components";

import data from "../../utils/Countries";

import styles from "./styles";

// Default render of country flag
const defaultFlag = data.filter((obj) => obj.name === "Vietnam")[0].flag;

const defaultCode = data.filter((obj) => obj.name === "Vietnam")[0].dial_code;

const dataCountries = data.map((item) => {
  return {
    label: `${item.flag} - ${item.name}`,
    value: `${item.flag} - ${item.dial_code}`,
  };
});

export default class InputPhoneModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: defaultFlag,
      dialCode: defaultCode,
      numberPhone: "",
    };
  }

  setModalVisible = (key, value) => {
    if (typeof this.props.setModalVisible === "function") {
      this.props.setModalVisible(key, value);
    }
  };

  onSMSLoginPressHandle = (value) => {
    if (typeof this.props.onSMSLoginPressHandle === "function") {
      this.props.onSMSLoginPressHandle(value);
    }
  };

  render() {
    const { modalVisible, loadingVerify } = this.props;
    return (
      <Modal transparent={false} visible={modalVisible} animationTyped="slide">
        <SafeAreaView>
          <KeyboardAvoidingView
            style={styles.containerSMS}
            behavior="height"
            enabled>
            <TouchableWithoutFeedback
              style={styles.containerSMS}
              onPress={Keyboard.dismiss}>
              <View style={styles.containerSMS}>
                <TouchableOpacity
                  onPress={() => this.setModalVisible("modalVisible", false)}
                  style={{ padding: 10 }}>
                  <Icon
                    active
                    name={Icons.MaterialCommunityIcons.Back}
                    size={Styles.IconSize.TextInput}
                    color={"#5a52a5"}
                  />
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                  <View style={styles.formInputContainer}>
                    <View style={styles.formText}>
                      <IconIO
                        active
                        name={Icons.Ionicons.Phone}
                        size={Styles.IconSize.TextInput}
                        color={"#5a52a5"}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.myref.openPicker();
                        }}
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ paddingHorizontal: 5 }}>
                          <Text>{this.state.flag}</Text>
                        </View>
                        <IconIO
                          active
                          name={Icons.Ionicons.DownArrow}
                          size={Styles.IconSize.TextInput}
                          color={"#5a52a5"}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.formInput}>
                      <Text
                        style={
                          styles.dialCode
                        }>{`(${this.state.dialCode}) `}</Text>
                      <TextInput
                        ref={(ref) => {
                          this.textPhoneNumber = ref;
                        }}
                        placeholderTextColor="#adb4bc"
                        keyboardType={"phone-pad"}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoFocus={true}
                        autoCorrect={false}
                        value={this.state.numberPhone}
                        onChangeText={(val) =>
                          this.setState({ numberPhone: val })
                        }
                        secureTextEntry={false}
                        style={styles.textInput}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.btnSendSMS}
                    onPress={() => {
                      if (
                        this.state.numberPhone !== "" &&
                        this.state.numberPhone
                      ) {
                        this.onSMSLoginPressHandle(
                          this.state.dialCode + this.state.numberPhone
                        );
                      } else {
                        toast(Languages.InputPhone);
                      }
                    }}>
                    {loadingVerify ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.textBtn}>{"Get code"}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <PickerBox
              ref={(ref) => (this.myref = ref)}
              data={dataCountries}
              onValueChange={(value) => {
                this.setState({
                  flag: value.split(" - ")[0],
                  dialCode: value.split(" - ")[1],
                });
              }}
              selectedValue={this.state.flag}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }
}
