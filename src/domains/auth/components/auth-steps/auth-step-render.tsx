import { GoogleBtnContainer } from '@auth/components/auth-button/auth-button-google-container'
import { AuthInput } from '@auth/components/auth-form/auth-form-input'
import { useFieldRendering } from '@auth/hooks/use-field-rendering'
import type { Field } from '@auth/types'
import { FilterDropdown } from '@search/components/search-filters/filter-dropdown'
import { EmailIcon } from '@shared/components/icons/auth/email-icon'
import { PasswordIcon } from '@shared/components/icons/auth/password-icon'
import { CalendarIcon } from '@shared/components/icons/schedule/calendar-icon'
import { UserIcon } from '@shared/components/icons/user/user-icon'
import type { InputType } from '@shared/types'
import { UserInfo } from '@user/components/user-dashboard/user-info'

interface RenderFieldParams {
  field: Field
}

export const RenderField = ({ field }: RenderFieldParams) => {
  const {
    shouldRenderField,
    getFieldValue,
    handleFieldChange,
    isSingleSelectField,
    mode,
  } = useFieldRendering()

  if (!shouldRenderField(field)) {
    return null
  }

  const icons = {
    email: <EmailIcon className="h-5 w-5" />,
    password: <PasswordIcon className="h-5 w-5" />,
    text: <UserIcon className="h-5 w-5" />,
    date: <CalendarIcon className="h-5 w-5" />,
    select: null,
    checkbox: null,
  }

  if (['text', 'email', 'password', 'date'].includes(field.type)) {
    return (
      <AuthInput
        key={field.name}
        name={field.name}
        type={field.type as InputType}
        placeholder={field.placeholder}
        required
        value={getFieldValue(field.name) || ''}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
      >
        {icons[field.type as keyof typeof icons] ?? null}
      </AuthInput>
    )
  }

  if (field.type === 'select' && field.options) {
    const currentValues = getFieldValue(field.name)
    const isSingleSelect = isSingleSelectField(field.name)

    return (
      <FilterDropdown
        key={field.name}
        label={field.placeholder}
        values={Array.isArray(currentValues) ? currentValues : [currentValues]}
        options={field.options}
        onChange={(newValues) =>
          handleFieldChange(
            field.name,
            isSingleSelect ? newValues[0] : newValues
          )
        }
        onClear={() => handleFieldChange(field.name, isSingleSelect ? '' : [])}
        styles="w-full"
        singleSelect={isSingleSelect}
        InputText={true}
      />
    )
  }

  if (field.type === 'checkbox' && field.options) {
    const currentValues = getFieldValue(field.name)

    return (
      <FilterDropdown
        key={field.name}
        label={field.placeholder}
        values={Array.isArray(currentValues) ? currentValues : [currentValues]}
        options={field.options}
        onChange={(newValues) => handleFieldChange(field.name, newValues)}
        onClear={() => handleFieldChange(field.name, [])}
        styles="w-full"
        singleSelect={false}
        InputText={true}
      />
    )
  }

  if (field.type === 'image') {
    return <UserInfo isSignUp={true} />
  }

  if (field.type === 'button') {
    return (
      <button className="button-primary w-full" type="submit">
        {field.placeholder}
      </button>
    )
  }

  if (field.type === 'google') {
    return (
      <>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-200">or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <GoogleBtnContainer isSignUp={mode === 'signUp'} />
      </>
    )
  }

  return null
}
