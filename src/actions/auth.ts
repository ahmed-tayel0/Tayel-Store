'use server';

import { signup as apiSignup, signin as apiSignin, forgotPassword as apiForgotPassword, verifyResetCode as apiVerifyResetCode, resetPassword as apiResetPassword, changePassword as apiChangePassword } from '@/services/api';

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
  token?: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export async function signupAction(formData: FormData): Promise<ActionResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rePassword = formData.get('rePassword') as string;
  const phone = formData.get('phone') as string | null;

  // Basic validation
  if (!name || !email || !password || !rePassword) {
    return { success: false, error: 'All fields are required' };
  }

  if (password !== rePassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Validate Egyptian phone if provided
  const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
  if (phone && !egyptianPhoneRegex.test(phone)) {
    return { success: false, error: 'Invalid Egyptian phone number' };
  }

  let response: any = null;
  let error: string | null = null;

  try {
    response = await apiSignup({ name, email, password, rePassword, phone: phone || '' });

    if (response.token && response.user) {
      return { success: true, token: response.token, user: response.user };
    } else {
      error = response.message || 'Signup failed';
    }
  } catch (err: any) {
    if (err.response?.data?.message) {
      error = err.response.data.message;
    } else if (err.response?.data?.statusMsg) {
      error = err.response.data.message || 'Signup failed';
    } else if (err.response?.data?.errors) {
      const messages = Object.values(err.response.data.errors).flat();
      error = messages.join(', ');
    } else {
      error = 'An error occurred during signup';
    }
  }

  return { success: false, error: error || 'Signup failed', token: response?.token };
}

export async function signinAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/home';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  let response: any = null;
  let error: string | null = null;

  try {
    response = await apiSignin({ email, password });

    if (response.token && response.user) {
      return { success: true, token: response.token, user: response.user, message: redirectTo };
    } else {
      error = response.message || 'Sign in failed';
    }
  } catch (err: any) {
    if (err.response?.data?.message) {
      error = err.response.data.message;
    } else if (err.response?.data?.statusMsg) {
      error = err.response.data.message || 'Invalid email or password';
    } else if (err.response?.data?.errors) {
      const messages = Object.values(err.response.data.errors).flat();
      error = messages.join(', ');
    } else {
      error = 'Invalid email or password';
    }
  }

  return { success: false, error: error || 'Sign in failed', token: response?.token };
}

export async function forgotPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email is required' };
  }

  try {
    const response = await apiForgotPassword({ email });
    return { success: true, message: 'Reset code sent to your email' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    }
    return { success: false, error: 'Failed to send reset code' };
  }
}

export async function verifyResetCodeAction(formData: FormData): Promise<ActionResult> {
  const resetCode = formData.get('resetCode') as string;

  if (!resetCode) {
    return { success: false, error: 'Reset code is required' };
  }

  try {
    await apiVerifyResetCode({ resetCode });
    return { success: true, message: 'Code verified successfully' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    }
    return { success: false, error: 'Invalid or expired code' };
  }
}

export async function resetPasswordAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  if (!email || !newPassword || !confirmNewPassword) {
    return { success: false, error: 'All fields are required' };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  try {
    await apiResetPassword({ email, newPassword });
    return { success: true, message: 'Password reset successfully' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    }
    return { success: false, error: 'Failed to reset password' };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  // Clear token from localStorage on client side
  // Server action can't access localStorage, so we just return success
  // Client will handle clearing localStorage and redirecting
  return { success: true, message: '/login' };
}

export async function changePasswordAction(formData: FormData): Promise<ActionResult> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { success: false, error: 'All fields are required' };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' };
  }

  try {
    const response = await apiChangePassword({ currentPassword, newPassword, confirmNewPassword });
    return { success: true, message: response.message || 'Password updated successfully' };
  } catch (error: any) {
    if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    }
    return { success: false, error: 'Failed to update password' };
  }
}