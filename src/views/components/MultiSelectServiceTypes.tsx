import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ServiceType } from '@/models/shared/serviceTypes';

type MultiSelectDropdownProps = {
  selectedTypes: ServiceType[];
  onChange: (types: ServiceType[]) => void;
};

export function MultiSelectDropdown({ selectedTypes, onChange }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ServiceType[]>(selectedTypes);

  const items = Object.values(ServiceType).map((type) => ({
    label: type,
    value: type,
  }));

  // Verifica igualdade entre arrays, independentemente da ordem
  const arraysAreEqual = (a: ServiceType[], b: ServiceType[]) =>
    a.length === b.length && [...a].sort().every((val, index) => val === [...b].sort()[index]);

  useEffect(() => {
    if (!arraysAreEqual(value, selectedTypes)) {
      setValue(selectedTypes);
    }
  }, [selectedTypes]);

  const handleSetValue = useCallback(
    (val: ServiceType[] | ((prev: ServiceType[]) => ServiceType[])) => {
      if (typeof val === 'function') {
        setValue((currentValue) => {
          const newValue = val(currentValue);
          onChange(newValue);
          return newValue;
        });
      } else {
        setValue(val);
        onChange(val);
      }
    },
    [onChange],
  );

  return (
    <DropDownPicker
      multiple
      min={0}
      max={items.length}
      open={open}
      setOpen={setOpen}
      value={value}
      items={items}
      setValue={handleSetValue}
      placeholder="Selecione um ou mais tipos de serviço"
      mode="BADGE"
      dropDownDirection="AUTO"
      listMode="SCROLLVIEW"
      maxHeight={150}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderColor: '#0D47A1',
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#0D47A1',
    zIndex: 999,
  },
});
