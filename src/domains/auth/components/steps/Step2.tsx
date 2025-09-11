import { toast } from '@pheralb/toast'
import { useProfileFormStore } from '@store/profile-form-store'
import { useStepsStore } from '@store/steps-store'
import { parseResponse } from '@utils/parse-response'
import { Input } from 'domains/auth/components/input'
import { FilterDropdown } from 'domains/search/components/filters/filter-dropdown'
import { CalendarIcon } from 'domains/shared/components/icons/calendar-icon'
import { UserIcon } from 'domains/shared/components/icons/user-icon'
import { UserInfo } from 'domains/user/components/user-info'
import { ToastType } from 'types'

interface Props {
  isSignUp: boolean
}

/**
 * Step2 component handles the user profile information collection step.
 *
 * @description This component renders a comprehensive form for collecting user profile
 * information as part of the registration or profile update process. It supports
 * multiple field types including text inputs, date inputs, dropdowns, and image upload.
 *
 * Key features:
 * - Dynamic form field rendering based on field type
 * - Support for various input types:
 *   - Text inputs for name and last name
 *   - Date input for birthday
 *   - Select dropdown for gender
 *   - Image upload for avatar
 * - Form validation with immediate feedback
 * - Toast notifications for success/error states
 * - Organized layout with personal information section
 * - Responsive grid layout for form fields
 * - Integrated with profile management stores
 *
 * The component uses several stores and utilities:
 * - useProfileFormStore: Manages form state, validation, and submission
 * - useStepsStore: Handles multi-step form navigation
 * - FilterDropdown: For select-type inputs
 * - UserInfo: For avatar management
 *
 * Form submission process:
 * - Client-side validation
 * - FormData preparation with support for arrays and single values
 * - Error handling with user-friendly messages
 * - Success handling with navigation to next step
 * - Loading state management
 *
 * @param {Props} props - The component props
 * @param {boolean} props.isSignUp - Indicates if this is part of the signup flow
 * @returns {JSX.Element} A form for collecting user profile information
 *
 * @example
 * <Step2 isSignUp={true} />
 */

export const Step2 = ({ isSignUp }: Props) => {
  const {
    values,
    validate,
    errors,
    setErrorMessage,
    setIsLoading,
    setSuccessMessage,
    clearMessages,
    setFieldValue,
  } = useProfileFormStore()

  const { steps, nextStep } = useStepsStore()

  const action = '/api/userProfile'

  const prepareFormData = (): FormData => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v))
        } else {
          formData.append(key, value as string)
        }
      }
    })
    return formData
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = validate()
    if (!isValid) {
      const firstError = Object.values(errors).find((error) => error)
      if (firstError) {
        setErrorMessage(firstError)
        toast[ToastType.Error]({ text: firstError })
      }
      return
    }
    clearMessages()
    setIsLoading(true)
    try {
      const formData = prepareFormData()
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
      })
      const responseContent = await parseResponse(response)
      if (!response.ok) {
        let errorMessage: string
        if (typeof responseContent === 'object' && responseContent.message) {
          errorMessage = responseContent.message
        } else if (typeof responseContent === 'string') {
          errorMessage = responseContent
        } else {
          errorMessage = 'Error in the request'
        }
        throw new Error(errorMessage)
      }
      setSuccessMessage('Profile updated successfully')
      toast[ToastType.Success]({ text: 'Profile updated successfully' })
      nextStep()
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error in the request'
      setErrorMessage(errorMsg)
      toast[ToastType.Error]({ text: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFieldValue(name, value)
  }

  const handleSelectChange = (name: string, newValues: string[]) => {
    setFieldValue(name, newValues[0] || '')
  }

  const handleClearSelectValue = (name: string) => {
    setFieldValue(name, '')
  }

  const renderField = (field: any) => {
    if (field.type === 'image') {
      return <UserInfo isSignUp={isSignUp} />
    }

    if (field.type === 'text') {
      return (
        <Input
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required
          value={values[field.name] || ''}
          onChange={handleInputChange}
        >
          <UserIcon className="h-5 w-5" />
        </Input>
      )
    }

    if (field.type === 'date') {
      return (
        <Input
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required
          value={values[field.name] || ''}
          onChange={handleInputChange}
        >
          <CalendarIcon className="h-5 w-5" />
        </Input>
      )
    }

    if (field.type === 'select') {
      return (
        <FilterDropdown
          key={field.name}
          label={field.placeholder}
          values={values[field.name] ? [values[field.name] as string] : []}
          onChange={(newValues) => handleSelectChange(field.name, newValues)}
          onClear={() => handleClearSelectValue(field.name)}
          options={field.options || []}
          styles="min-h-[44px]"
          singleSelect={true}
        />
      )
    }

    return null
  }

  if (!steps[1]) return null

  const personalFields = steps[1].fields.filter((field: { name: string }) =>
    ['avatar', 'name', 'last_name', 'birthday', 'gender'].includes(field.name)
  )

  const avatarField = personalFields.find(
    (f: { name: string }) => f.name === 'avatar'
  )
  const otherFields = personalFields.filter(
    (f: { name: string }) => f.name !== 'avatar'
  )

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col h-full p-4">
      <div className="grid grid-cols-1 gap-4">
        {avatarField && renderField(avatarField)}

        <div className="grid grid-cols-1 gap-4 ">
          {otherFields.map(renderField)}
        </div>
      </div>

      <button
        type="submit"
        className="button-primary mt-4 w-full focus:ring-2 focus:outline-none disabled:opacity-50"
      >
        Save and continue
      </button>
    </form>
  )
}
