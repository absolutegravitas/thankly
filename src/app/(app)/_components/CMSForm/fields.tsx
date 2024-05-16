import { NumberInput } from '@app/_components/forms/fields/Number'

import { RichText } from '@app/_blocks/RichText'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { Checkbox } from './fields/Checkbox'
import { Select } from './fields/Select'
import { Text } from './fields/Text'
import { Textarea } from './fields/Textarea'

import classes from './fields.module.scss'

export const fields = {
  text: Text,
  textarea: Textarea,
  select: (props: any) => {
    return <Select components={{ DropdownIndicator: ChevronDownIcon }} {...props} />
  },
  checkbox: Checkbox,
  email: (props: any) => {
    return <Text {...props} />
  },
  country: (props: any) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="country" {...props} />
    )
  },
  state: (props: any) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="state" {...props} />
    )
  },
  message: (props: any) => {
    return <RichText className={classes.message} content={props.message} />
  },
  number: NumberInput,
}
