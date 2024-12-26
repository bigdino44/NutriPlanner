import { supabase } from '../../supabase';
import type { DietaryRestriction } from '../../../types';

export async function getDietaryRestrictions() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  return supabase
    .from('dietary_restrictions')
    .select('id, name, description')
    .eq('user_id', user.id);
}

export async function updateDietaryRestrictions(restrictions: DietaryRestriction[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // First delete existing restrictions
  await supabase
    .from('dietary_restrictions')
    .delete()
    .eq('user_id', user.id);

  if (restrictions.length === 0) {
    return { data: [], error: null };
  }

  // Then insert new ones
  return supabase
    .from('dietary_restrictions')
    .insert(
      restrictions.map(r => ({
        user_id: user.id,
        name: r.name,
        description: r.description || ''
      }))
    );
}