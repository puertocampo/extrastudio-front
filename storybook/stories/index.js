import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { LikeButton } from '../components/atoms'

storiesOf('Button', module)
  .add('with text', () => (
    <LikeButton onPress={() => {}}/>
  ))