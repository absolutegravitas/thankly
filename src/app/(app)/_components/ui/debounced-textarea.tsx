import * as React from 'react'
import { debounce } from 'lodash'
import { Textarea, TextareaProps } from '@app/_components/ui/textarea'

export interface DebouncedTextareaProps extends Omit<TextareaProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
  debounceTime?: number
}

const DebouncedTextarea = React.forwardRef<HTMLTextAreaElement, DebouncedTextareaProps>(
  ({ value, onChange, debounceTime = 300, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value)

    React.useEffect(() => {
      setInternalValue(value)
    }, [value])

    const debouncedCallback = React.useMemo(
      () => debounce(onChange, debounceTime),
      [onChange, debounceTime],
    )

    React.useEffect(() => {
      return () => {
        debouncedCallback.cancel()
      }
    }, [debouncedCallback])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value
      setInternalValue(newValue)
      debouncedCallback(newValue)
    }

    return <Textarea ref={ref} value={internalValue} onChange={handleChange} {...props} />
  },
)

DebouncedTextarea.displayName = 'DebouncedTextarea'

export default DebouncedTextarea
