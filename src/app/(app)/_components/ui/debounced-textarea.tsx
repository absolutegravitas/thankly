import * as React from 'react'
import { debounce } from 'lodash'
import { Textarea, TextareaProps } from '@app/_components/ui/textarea'

export interface DebouncedTextareaProps extends TextareaProps {
  value?: string
  onValueChange?: (value: string) => void
  debounceTime?: number
  maxLength?: number
}

const DebouncedTextarea = React.forwardRef<HTMLTextAreaElement, DebouncedTextareaProps>(
  ({ value, onChange, onValueChange, debounceTime = 300, maxLength, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '')

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
      }
    }, [value])

    const debouncedCallback = React.useMemo(
      () =>
        debounce((newValue: string) => {
          onValueChange && onValueChange(newValue)
        }, debounceTime),
      [onValueChange, debounceTime],
    )

    React.useEffect(() => {
      return () => {
        debouncedCallback.cancel()
      }
    }, [debouncedCallback])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value
      setInternalValue(newValue)
      onChange && onChange(event)
      debouncedCallback(newValue)
    }

    return (
      <div className="relative">
        <Textarea
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        <div
          className={`absolute bottom-2 right-8 text-xs italic ${
            value.length > maxLength ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {value.length} / {maxLength} chars
        </div>
      </div>
    )
  },
)

DebouncedTextarea.displayName = 'DebouncedTextarea'

export default DebouncedTextarea
