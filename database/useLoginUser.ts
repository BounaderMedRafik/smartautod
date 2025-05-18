import { supabase } from '@/lib/supabase';

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw new Error('User not found');

  if (data.password !== password) {
    throw new Error('Incorrect password');
  }

  return data;
}
