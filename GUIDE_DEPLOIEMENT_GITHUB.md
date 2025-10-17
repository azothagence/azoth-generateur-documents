# Guide de Déploiement sur GitHub Pages

Ce guide vous explique comment déployer votre **Générateur de Documents Azoth Agence** sur GitHub Pages gratuitement.

---

## 📋 Prérequis

1. Un compte GitHub (gratuit) : [github.com](https://github.com)
2. Git installé sur votre ordinateur
3. Les fichiers du projet téléchargés

---

## 🚀 Étapes de Déploiement

### Étape 1 : Créer un dépôt GitHub

1. Connectez-vous sur [github.com](https://github.com)
2. Cliquez sur le bouton **"New"** (ou **"+"** en haut à droite → **"New repository"**)
3. Remplissez les informations :
   - **Repository name** : `azoth-document-generator` (ou le nom de votre choix)
   - **Description** : "Générateur de documents commerciaux pour Azoth Agence"
   - Cochez **"Public"** (obligatoire pour GitHub Pages gratuit)
   - **NE PAS** cocher "Add a README file"
4. Cliquez sur **"Create repository"**

### Étape 2 : Configurer le projet pour GitHub Pages

Le projet est déjà configuré pour GitHub Pages. Le fichier `vite.config.ts` contient la configuration nécessaire.

### Étape 3 : Pousser le code sur GitHub

Ouvrez un terminal dans le dossier du projet et exécutez ces commandes :

```bash
# Initialiser le dépôt git (si ce n'est pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Générateur de documents Azoth Agence"

# Ajouter le dépôt distant (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/azoth-document-generator.git

# Renommer la branche en main (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

### Étape 4 : Configurer GitHub Actions pour le déploiement automatique

Le fichier `.github/workflows/deploy.yml` est déjà configuré dans le projet. Il déploiera automatiquement votre site à chaque push.

### Étape 5 : Activer GitHub Pages

1. Allez sur votre dépôt GitHub
2. Cliquez sur **"Settings"** (Paramètres)
3. Dans le menu de gauche, cliquez sur **"Pages"**
4. Sous **"Source"**, sélectionnez :
   - **Branch** : `gh-pages`
   - **Folder** : `/ (root)`
5. Cliquez sur **"Save"**

### Étape 6 : Attendre le déploiement

1. Allez dans l'onglet **"Actions"** de votre dépôt
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours d'exécution
3. Attendez que le workflow soit terminé (icône verte ✓)
4. Votre site sera accessible à l'adresse :
   ```
   https://VOTRE_USERNAME.github.io/azoth-document-generator/
   ```

---

## 🔄 Mettre à jour le site

Pour mettre à jour votre site après des modifications :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

Le site sera automatiquement redéployé en quelques minutes.

---

## 🌐 Utiliser un nom de domaine personnalisé (Optionnel)

Si vous possédez un nom de domaine (ex: documents.azothagence.com) :

1. Dans les paramètres GitHub Pages, ajoutez votre domaine personnalisé
2. Configurez les DNS de votre domaine pour pointer vers GitHub Pages :
   ```
   Type: CNAME
   Name: documents (ou www)
   Value: VOTRE_USERNAME.github.io
   ```

---

## ⚠️ Points Importants

- **Le déploiement prend 2-5 minutes** après chaque push
- **Le dépôt doit être Public** pour utiliser GitHub Pages gratuitement
- **Les modifications sont automatiquement déployées** via GitHub Actions
- **Le site est accessible 24/7** sans mise en veille

---

## 🆘 Dépannage

### Le site ne s'affiche pas
- Vérifiez que le workflow dans "Actions" s'est terminé avec succès
- Attendez 5 minutes après le premier déploiement
- Videz le cache de votre navigateur (Ctrl+F5)

### Erreur 404
- Vérifiez que la branche `gh-pages` existe
- Vérifiez que GitHub Pages est configuré sur la branche `gh-pages`

### Les images ne s'affichent pas
- Vérifiez que le `base` dans `vite.config.ts` correspond au nom de votre dépôt

---

## 📞 Support

Si vous rencontrez des problèmes, vous pouvez :
- Consulter la documentation GitHub Pages : [docs.github.com/pages](https://docs.github.com/pages)
- Vérifier les logs dans l'onglet "Actions" de votre dépôt

---

**Votre générateur de documents sera accessible 24/7 gratuitement !** 🎉

