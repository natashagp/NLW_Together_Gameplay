import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';

type Props = {
  isCentered?: boolean;
  isLarge?: boolean;
}

export function ListDivider({ isCentered, isLarge }: Props){
  return (
    <View 
      style={[
        styles.container,
        isCentered ? {
          marginVertical: 12,
        } : {
          marginTop: 2,
          marginBottom: 31,
        },
        isLarge ? {
          width: '80%'
        } : 
        {
          width: '76%'
        }
      ]}
    />
  );
}