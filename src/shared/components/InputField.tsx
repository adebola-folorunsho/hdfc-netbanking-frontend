interface InputFieldProps {
  id: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'number'
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  autoComplete?: string
}

/*
 * Pattern: Presentational Component (SRP — Single Responsibility Principle)
 * This component owns one responsibility — rendering a labelled input field.
 * It holds no state, makes no API calls, and knows nothing about the form
 * it belongs to. All data flows in via props.
 */
const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  autoComplete,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label is explicitly linked to input via htmlFor/id — required for accessibility */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-navy"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-2.5 rounded-input border text-sm font-body
          bg-surface text-navy placeholder:text-text-muted
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? 'border-error focus:ring-error'
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      />

      {/* Error message — only rendered when error prop is provided */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-error mt-0.5"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default InputField