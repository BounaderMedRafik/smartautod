import { supabase } from '@/lib/supabase';

export async function checkForUserInDB(email: string) {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('uuid')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return !!data;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
