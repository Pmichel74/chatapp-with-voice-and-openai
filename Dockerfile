# Image de base pour notre application - Python 3.10
FROM python:3.10

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie de tous les fichiers de l'application dans le conteneur
COPY . .

# Installation des dépendances Python définies dans requirements.txt
RUN pip install -r requirements.txt

# -----------------------------------------------------------------
# CONFIGURATION DES CERTIFICATS (OPTIONNEL)
# Cette section est commentée car le certificat n'est pas disponible
# Décommentez et assurez-vous que le certificat existe si vous avez besoin
# de cette configuration pour l'API OpenAI

# # Copie du certificat racine auto-signé dans le conteneur (si présent)
# COPY certs/rootCA.crt /usr/local/share/ca-certificates/rootCA.crt || true
# 
# # Mise à jour du magasin de confiance CA (seulement si le certificat existe)
# RUN if [ -f /usr/local/share/ca-certificates/rootCA.crt ]; then \
#     chmod 644 /usr/local/share/ca-certificates/rootCA.crt && \
#     update-ca-certificates; \
#   fi

# Configuration des variables d'environnement nécessaires pour l'API OpenAI
ENV OPENAI_API_KEY=skills-network
# Ces variables sont nécessaires seulement si vous utilisez des certificats personnalisés
# ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
# ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
# -----------------------------------------------------------------

# Commande exécutée au démarrage du conteneur
CMD ["python", "-u", "server.py"]