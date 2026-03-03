import type { Meta, StoryObj } from '@storybook/react-vite'
import { useAppForm, SubmitButton } from '@template/ui'

const BasicForm = () => {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className='flex flex-col gap-4 w-80'>
        <form.AppField
          name='name'
          validators={{
            onChange: ({ value }) =>
              !value ? 'Name is required' : undefined,
          }}>
          {(field) => <field.TextField label='Name' />}
        </form.AppField>

        <form.AppField
          name='email'
          validators={{
            onChange: ({ value }) =>
              !value ? 'Email is required' : undefined,
          }}>
          {(field) => <field.EmailField label='Email' />}
        </form.AppField>

        <form.AppField
          name='password'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Password is required'
              if (value.length < 8) return 'Password must be at least 8 characters'
              return undefined
            },
          }}>
          {(field) => <field.PasswordField label='Password' />}
        </form.AppField>

        <SubmitButton>Submit</SubmitButton>
      </form>
    </form.AppForm>
  )
}

const meta: Meta<typeof BasicForm> = {
  title: 'Forms/Examples/BasicForm',
  component: BasicForm,
  parameters: {
    controls: { disable: true },
  },
}

export default meta
type Story = StoryObj<typeof BasicForm>

export const Default: Story = {}
