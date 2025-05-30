import { navigate } from 'astro:transitions/client'
import { Input } from '@components/auth/input'
import { UserIcon } from '@components/icons/user-icon'
import { FilterDropdown } from '@components/search/filters/filter-dropdown'
import { toast } from '@pheralb/toast'
import { usePreferencesFormStore } from '@store/preferences-form-store'
import { useStepsStore } from '@store/steps-store'
import { parseResponse } from '@utils/parse-response'
import { useState } from 'react'
import { ToastType } from 'types'

export const Step3 = () => {
  const [subStep, setSubStep] = useState(1)
  const {
    values,
    validate,
    errors,
    setErrorMessage,
    setIsLoading,
    setSuccessMessage,
    clearMessages,
    setFieldValue,
  } = usePreferencesFormStore()

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
      toast[ToastType.Success]({ text: 'Perfil actualizado con éxito' })
      nextStep()
      navigate('/profile')
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Error en la solicitud'
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

  const handleCheckboxChange = (name: string, newValues: string[]) => {
    setFieldValue(name, newValues)
  }

  const handleSelectChange = (name: string, newValues: string[]) => {
    setFieldValue(name, newValues[0] || '')
  }

  const handleClearValues = (name: string) => {
    setFieldValue(name, [])
  }

  const handleClearSelectValue = (name: string) => {
    setFieldValue(name, '')
  }

  const renderField = (field: any) => {
    if (field.type === 'text' || field.type === 'date') {
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

    if (field.type === 'checkbox') {
      return (
        <FilterDropdown
          key={field.name}
          label={field.placeholder}
          values={(values[field.name] as string[]) || []}
          onChange={(newValues) => handleCheckboxChange(field.name, newValues)}
          onClear={() => handleClearValues(field.name)}
          options={field.options || []}
          styles="min-h-[44px]"
        />
      )
    }

    return null
  }

  if (!steps[2]) return null

  const categories = {
    preferences: {
      title: 'Watching Preferences',
      fields: steps[2].fields.filter((field: { name: string }) =>
        ['frequency', 'fanatic_level', 'preferred_format'].includes(field.name)
      ),
    },
    favorites: {
      title: 'Favorites',
      fields: steps[2].fields.filter((field: { name: string }) =>
        [
          'favorite_animes',
          'favorite_studios',
          'watched_animes',
          'favorite_genres',
        ].includes(field.name)
      ),
    },
  }

  const categoryEntries = Object.entries(categories)
  const currentCategory = categoryEntries[subStep - 1]

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        {categoryEntries.map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setSubStep(index + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                subStep === index + 1 ? 'bg-enfasisColor' : 'bg-Primary-50/10'
              }`}
            >
              {index + 1}
            </button>
            {index < categoryEntries.length - 1 && (
              <div className="w-12 h-0.5 bg-Primary-50/30 ml-2"></div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full">
        <div className="bg-Primary-50/5 rounded-lg p-6">
          <h3 className="text-Primary-50 text-xl mb-6 font-semibold">
            {currentCategory[1].title}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {currentCategory[1].fields.map(renderField)}
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full">
        <button
          type="button"
          onClick={() => setSubStep(subStep - 1)}
          className={`px-4 py-2 rounded-lg transition-all ${
            subStep === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-Primary-50/10'
          }`}
          disabled={subStep === 1}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setSubStep(subStep + 1)}
          className={`px-4 py-2 rounded-lg transition-all ${
            subStep === categoryEntries.length
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-Primary-50/10'
          }`}
          disabled={subStep === categoryEntries.length}
        >
          Next
        </button>
      </div>

      {subStep === 2 && (
        <button
          type="submit"
          className="button-primary w-full focus:ring-2 focus:outline-none disabled:opacity-50 mt-4"
        >
          Guardar y continuar
        </button>
      )}
    </form>
  )
}
