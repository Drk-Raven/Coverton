import React, {useMemo, useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const DynamicDropdown = (props) => {
  const {
    dropdownData,
    labelField,
    valueField,
    isPatient = false,
    renderLabelTitle,
    placeholder,
    field,
    onSelect,
    onSelectOption,
    selectedOption,
    labelStyle,
    focusedDropdownStyle,
    containerStyle,
    propRenderItemContainerStyle,
    propContainerStyle,
    showLabel = true,
    propSelectedTextStyle,
    propPlaceholderStyle,
    propOptionTextStyle,
    disabled = false,
    isSearch = false
  } = props;

  const [isFocus, setIsFocus] = useState(false);

  const processedData = useMemo(() => {
    if (!dropdownData || dropdownData.length === 0) {
      return [];
    }

    return isPatient
      ? dropdownData.map(item => {
          const dynamicSelectedField = `${`${item?.Pt_Name} | ${item?.Pt_First_Age}`} | ${item?.RelationShip_Name}`;

          return {
            ...item,
            customDisplay: dynamicSelectedField,
            [`${labelField}_Display`]: (item?.[labelField]),
          };
        })
      : dropdownData.map(item => {
          return { ...item, [`${labelField}_Display`]: (item?.[labelField])};
        });
  }, [dropdownData, isPatient, labelField])

  const renderLabel = useCallback(() => {
    if (selectedOption || isFocus) {
      return <Text style={[styles.label, labelStyle]}>{renderLabelTitle}</Text>;
    }
    return null;
  }, [selectedOption, isFocus, renderLabelTitle, labelStyle]);

  const renderItem = useCallback((item) => {
    return (
      <View style={[styles.renderItemContainer, propRenderItemContainerStyle]}>
        <Text numberOfLines={1} style={[propOptionTextStyle]}>
          {item?.[`${labelField}_Display`]}
        </Text>
      </View>
    );
  }, [propRenderItemContainerStyle, propOptionTextStyle, labelField]);

  const handleChange = useCallback((item) => {
    if (field === 'testCode') {
      onSelect?.(item, field);
      // onSelectOption?.(item?.[labelField]);
    } else if (selectedOption !== item?.[valueField]) {
      onSelect?.(item, field);
      // onSelectOption?.(item?.[valueField]);
    }
    setIsFocus(false);
  }, [field, onSelect, onSelectOption, selectedOption, labelField, valueField]);

  const isDisabled = disabled || processedData?.length === 0;

  return (
    <View style={containerStyle}>
      {showLabel ? renderLabel() : null}
      <Dropdown
  disable={isDisabled}
  style={[
    styles.dropdown,
    propContainerStyle,
    isFocus && focusedDropdownStyle,
    isDisabled ? styles.disabledBackground : null,
  ]}
  placeholderStyle={[styles.placeholderStyle, propPlaceholderStyle]}
  selectedTextStyle={[styles.selectedTextStyle, propSelectedTextStyle]}
  inputSearchStyle={styles.inputSearchStyle}
  iconStyle={styles.iconStyle}
  containerStyle={[styles.dropdownListContainer, propContainerStyle]}
  activeColor="transparent" // ✅ Prevents background highlight/border
  itemContainerStyle={[styles.itemContainerStyle, { borderWidth: 0 }]} // ✅ Removes border
  itemTextStyle={styles.itemTextStyle}
  data={processedData}
  renderItem={renderItem}
  search={isSearch}
  maxHeight={300}
  labelField={isPatient ? 'customDisplay' : `${labelField}_Display`}
  valueField={field === 'testCode' ? labelField : valueField}
  placeholder={!isFocus ? placeholder : '...'}
  searchPlaceholder="Search..."
  showsVerticalScrollIndicator={false}
  value={selectedOption}
  onFocus={() => setIsFocus(true)}
  onBlur={() => setIsFocus(false)}
  onChange={handleChange}
/>
    </View>
  );
};

export default DynamicDropdown;

const styles = StyleSheet.create({
  dropdown: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    direction: 'ltr',
  },
  dropdownListContainer: {
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 11,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'lightgrey',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 12,
  },
  renderItemContainer: {
    padding: 15,
  },
  disabledBackground: {
    backgroundColor: '#F2F2F2',
  },
  itemContainerStyle: {
    borderWidth: 0,
  },
  itemTextStyle: {
    borderWidth: 0,
  },
});