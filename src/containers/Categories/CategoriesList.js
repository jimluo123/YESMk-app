/** @format */

import * as React from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";

import { AdMob } from "@components";

import CategoriesItem from "./CategoriesItem";
import styles from "./styles";

const CategoriesList = React.memo(() => {
  const categoryList = useSelector((state) =>
    state.categories.list?.filter((category) => category.parent === 0)
  );

  // remove duplicate item
  const mainCategories = React.useMemo(
    () => [...new Map(categoryList.map((item) => [item.id, item])).values()],
    [categoryList]
  );

  return (
    <ScrollView
      scrollEventThrottle={1}
      contentContainerStyle={styles.scrollView}>
      {mainCategories?.map((category, index) => {
        return (
          <CategoriesItem
            key={index.toString()}
            index={index}
            category={category}
          />
        );
      })}
      <AdMob />
    </ScrollView>
  );
});

export default CategoriesList;
