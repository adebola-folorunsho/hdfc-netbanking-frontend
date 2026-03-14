interface ButtonProps {
  label: string
  onClick: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
  loadingLabel?: string
  disabled?: boolean
  fullWidth?: boolean
}

/*
 * Pattern: Presentational Component (SRP — Single Responsibility Principle)
 * This component owns one responsibility — rendering a styled button.
 * It holds no state and knows nothing about what action it triggers.
 * All behaviour flows in via props.
 *
 * OCP — new variants are added by extending the variant map below,
 * never by modifying existing conditional logic.
 */

// Variant map — open for extension, closed for modification
const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: `
    bg-navy text-surface border border-navy
    hover:bg-navy-light
    active:scale-[0.98]
  `,
  secondary: `
    bg-transparent text-navy border border-navy
    hover:bg-navy hover:text-surface
    active:scale-[0.98]
  `,
}

const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  loadingLabel,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading
  const displayLabel = isLoading && loadingLabel ? loadingLabel : label

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        px-6 py-2.5 rounded-input text-sm font-medium font-body
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {displayLabel}
    </button>
  )
}

export default Button