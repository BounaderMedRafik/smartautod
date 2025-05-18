// hooks/auth/signUpUser.ts
import { supabase } from '@/lib/supabase';

export async function signUpUser({
  name,
  age,
  email,
  password,
}: {
  name: string;
  age: string;
  email: string;
  password: string;
}) {
  const { error } = await supabase.from('user').insert([
    {
      name,
      age: parseInt(age),
      email,
      password,
    },
  ]);

  if (error) throw new Error(error.message);
}
