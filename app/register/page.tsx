'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Both passwords do not match with each other!');
      throw new Error('Both passwords do not match with each other!');
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = response.json();

      if (!response.ok) {
        setError('Registration Failed!');
        throw new Error('Registration Failed!');
      }

      router.push('/login');
    } catch (error) {
      console.log(error);
      throw new Error('An error occured during registration!');
    }
  };

  return <div>Register</div>;
};

export default Register;
