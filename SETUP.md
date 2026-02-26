# Instructions de Configuration

## 1. Créer le fichier .env.local

**IMPORTANT** : Créez un fichier `.env.local` à la racine du projet (au même niveau que `package.json`).

Vous pouvez :
- Copier le fichier `.env.local.example` et le renommer en `.env.local`
- Ou créer manuellement un fichier `.env.local` avec le contenu suivant :

```env
NEXT_PUBLIC_SUPABASE_URL=https://plkpppgzuxyoanvagzcs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ipjyRO2Ve5AFMIcLfyrVnA_JwCb7sTt
```

**Note** : Après avoir créé ou modifié `.env.local`, vous devez **redémarrer le serveur de développement** (`npm run dev`) pour que les changements soient pris en compte.

## 2. Installer les dépendances

```bash
npm install
```

## 3. Configurer Supabase

1. Allez sur votre projet Supabase
2. Ouvrez le **SQL Editor**
3. Copiez-collez le script SQL contenu dans `supabase/schema.sql`
4. Exécutez le script

## 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

