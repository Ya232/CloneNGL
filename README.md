# Clone NGL - Messages Anonymes

Une application web moderne pour recevoir des messages anonymes, construite avec Next.js, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

- **Page d'accueil** : Landing page attractive expliquant le concept
- **Création de profil** : Création rapide d'un lien personnalisé
- **Page publique** : Interface pour envoyer des messages anonymes
- **Dashboard** : Boîte de réception privée pour voir et gérer les messages
- **Design moderne** : Interface responsive avec Tailwind CSS
- **100% Anonyme** : Les messages sont totalement anonymes

## 🛠️ Stack Technique

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (icônes)
- **Supabase** (base de données et authentification)

## 📦 Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd cloneNGL
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` à la racine du projet :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🗄️ Configuration Supabase

### Schéma de base de données

Créez les tables suivantes dans votre projet Supabase :

#### Table `users`
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table `messages`
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

## 📁 Structure du Projet

```
cloneNGL/
├── app/
│   ├── [username]/        # Page publique pour envoyer des messages
│   ├── create/            # Page de création de profil
│   ├── dashboard/         # Boîte de réception
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/
│   ├── messages/          # Composants liés aux messages
│   └── ui/                # Composants UI réutilisables
├── lib/
│   └── supabase/          # Utilitaires Supabase
└── public/                # Fichiers statiques
```

## 🎨 Pages

- **/** : Page d'accueil avec présentation du service
- **/create** : Création d'un nouveau profil
- **/[username]** : Page publique pour envoyer des messages
- **/dashboard** : Dashboard privé pour voir les messages reçus

## 📝 Notes

- L'application utilise actuellement des données fictives (mock data) pour la démonstration
- Les fonctions Supabase sont préparées mais nécessitent la configuration de la base de données
- Une fois Supabase configuré, remplacez les données fictives par les appels API réels

## 🔒 Sécurité

- Les messages sont stockés de manière anonyme
- Aucune information sur l'expéditeur n'est enregistrée
- Validation côté client et serveur pour tous les inputs

## 📄 Licence

MIT

