import * as React from 'react'
import { debounce } from 'lodash'
import { Textarea, TextareaProps } from '@app/_components/ui/textarea' // Import the original Textarea

export interface DebouncedTextareaProps extends TextareaProps {
  onDebounce?: (value: string) => void
  debounceTime?: number
}

const DebouncedTextarea = React.forwardRef<HTMLTextAreaElement, DebouncedTextareaProps>(
  ({ onDebounce, debounceTime = 300, onChange, ...props }, ref) => {
    const debouncedCallback = React.useMemo(
      () =>
        debounce((value: string) => {
          if (onDebounce) {
            onDebounce(value)
          }
        }, debounceTime),
      [onDebounce, debounceTime],
    )

    React.useEffect(() => {
      return () => {
        debouncedCallback.cancel()
      }
    }, [debouncedCallback])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(event)
      }
      debouncedCallback(event.target.value)
    }

    return <Textarea ref={ref} onChange={handleChange} {...props} />
  },
)

DebouncedTextarea.displayName = 'DebouncedTextarea'

export default DebouncedTextarea
