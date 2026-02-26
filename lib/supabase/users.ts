import { supabase } from './client'
import type { Profile } from './types'

/**
 * Crée un nouveau profil avec un nom d'utilisateur
 */
export async function createProfile(username: string): Promise<Profile | null> {
  try {
    // Vérifier si le username existe déjà
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingProfile) {
      throw new Error('Ce nom d\'utilisateur est déjà pris')
    }

    // Créer le nouveau profil
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          username: username.toLowerCase(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error: any) {
    console.error('Erreur lors de la création du profil:', error)
    // Si c'est une erreur de contrainte unique, retourner un message plus clair
    if (error.code === '23505' || error.message?.includes('unique')) {
      throw new Error('Ce nom d\'utilisateur est déjà pris')
    }
    throw error
  }
}

/**
 * Récupère un profil par son nom d'utilisateur
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun profil trouvé
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    throw error
  }
}

/**
 * Récupère un profil par son ID
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    throw error
  }
}

