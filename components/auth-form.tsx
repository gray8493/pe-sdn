'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'
import { validateLogin, validateRegister, type AuthErrors } from '@/lib/validation'

type Mode = 'login' | 'register'
type Values = { email: string; password: string; confirmPassword: string }

const EMPTY: Values = { email: '', password: '', confirmPassword: '' }

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const { setUser } = useAuth()
  const isRegister = mode === 'register'
  const p = mode // data-testid prefix

  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const validate = (v: Values) => (isRegister ? validateRegister(v) : validateLogin(v))

  function onChange(field: keyof Values, value: string) {
    const next = { ...values, [field]: value }
    setValues(next)
    // Nothing is shown before the first submit; afterwards errors update live.
    if (submitted) setErrors(validate(next))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setAuthError(null)
    setSuccess(null)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPending(true)
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegister ? values : { email: values.email, password: values.password }
        ),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAuthError(typeof body.error === 'string' ? body.error : 'Something went wrong')
        return
      }
      if (isRegister) {
        setSuccess('Registration successful')
        setValues(EMPTY)
        setSubmitted(false)
        setErrors({})
      } else {
        setUser({ id: body.id, email: body.email })
        router.push('/reading-logs')
      }
    } catch {
      setAuthError('Something went wrong')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <Card className="w-full max-w-sm shadow-none">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">{isRegister ? 'Create an account' : 'Login'}</CardTitle>
          <CardDescription>
            {isRegister ? 'Create an account to start your reading log.' : 'Sign in to continue to your reading log.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid={`${p}-form`}
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            {authError && (
              <p
                data-testid="error-auth"
                role="alert"
                className="rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive"
              >
                {authError}
              </p>
            )}
            {success && (
              <p
                data-testid="form-success"
                role="status"
                className="rounded-md border px-3 py-2 text-sm text-foreground"
              >
                {success}
              </p>
            )}

            <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${p}-email`}>Email</Label>
              <Input
                id={`${p}-email`}
                data-testid={`${p}-email`}
                type="email"
                autoComplete="email"
                value={values.email}
                aria-invalid={!!errors.email}
                onChange={(e) => onChange('email', e.target.value)}
              />
              {errors.email && (
                <p data-testid="error-email" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${p}-password`}>Password</Label>
              <Input
                id={`${p}-password`}
                data-testid={`${p}-password`}
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={values.password}
                aria-invalid={!!errors.password}
                onChange={(e) => onChange('password', e.target.value)}
              />
              {errors.password && (
                <p data-testid="error-password" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            {isRegister && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="register-confirm-password">Confirm password</Label>
                <Input
                  id="register-confirm-password"
                  data-testid="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  aria-invalid={!!errors.confirmPassword}
                  onChange={(e) => onChange('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && (
                  <p data-testid="error-confirm-password" className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
            </fieldset>

            <Button type="submit" data-testid={`${p}-submit`} disabled={pending} className="mt-1 w-full">
              {pending && <Loader2 className="animate-spin" />}
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                  Login
                </Link>
              </>
            ) : (
              <>
                No account yet?{' '}
                <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
                  Register
                </Link>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
