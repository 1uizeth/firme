import { ChangeEventHandler, FC, useId } from 'react'
import { StringUtils } from '@/app/utils/string.utils'
import { withReveal } from '@/components/with-reveal'
import classes from './reveal-input.module.css'

interface RevealInputProps {
  required?: boolean
  label?: string
  error?: string
  className?: string
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

const BaseInput: FC<RevealInputProps> = ({ required, label, error, className, disabled, value, onChange }) => {
  const id = useId()

  return (
    <div className={className}>
      <div className={classes.input}>
        <input
          value={value}
          placeholder=" "
          id={id}
          required={required}
          onChange={
            (({ target: { value } }) => {
              onChange?.(value)
            }) as ChangeEventHandler<HTMLInputElement>
          }
          autoComplete="off"
          disabled={disabled}
          className={StringUtils.clsx(disabled ? classes.inputDisabled : undefined)}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <p className={StringUtils.clsx('error', classes.inputError)}>{error}</p>}
    </div>
  )
}

export const RevealInput = withReveal(BaseInput)
