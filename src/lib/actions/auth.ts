'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const origin = (await headers()).get('origin')

  if (!email || !password || !fullName) {
    return { error: 'Semua field harus diisi', success: false }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message, success: false }
  }

  if (data.user) {
    // Insert into public.users
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      full_name: fullName,
      email: email,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
    })

    if (dbError) {
      console.error('Error creating user profile:', dbError)
      // We don't fail the signup here, but we log it. 
      // Ideally we might want to rollback or retry, but for this scope logging is acceptable.
    }
  }

  return { error: null, success: true }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan Password harus diisi' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function verifyOtp(email: string, code: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'signup',
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function resendOtp(email: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true }
  } catch (err) {
    return { error: 'Terjadi kesalahan saat mengirim ulang OTP', success: false }
  }
}

export async function forgotPassword(email: string) {
  const origin = (await headers()).get('origin')
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateUserPassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Semua field harus diisi', success: false }
  }

  if (password !== confirmPassword) {
    return { error: 'Kata sandi tidak cocok', success: false }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message, success: false }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
