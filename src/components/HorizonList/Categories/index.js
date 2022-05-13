/** @format */

import React, { PureComponent } from "react";
import { FlatList } from "react-native";

import { withTheme } from "@common";

import Item from "./Item";

class Categories extends PureComponent {
  static defaultProps = {
    items: [],
  };

  render() {
    const { items, type, onPress, config } = this.props;

    const column = typeof config.column !== "undefined" ? config.column : 1;

    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        contentContainerStyle={styles.flatlist}
        showsHorizontalScrollIndicator={false}
        horizontal={column === 1}
        numColumns={column}
        data={items}
        renderItem={({ item, index }) => (
          <Item
            key={index}
            item={item}
            type={type}
            label={item.label}
            onPress={onPress}
          />
        )}
      />
    );
  }
}

const styles = {
  flatlist: {
    marginBottom: 10,
  },
};

export default withTheme(Categories);
