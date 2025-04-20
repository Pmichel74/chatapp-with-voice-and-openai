import base64
import json
from flask import Flask, render_template, request
from worker import speech_to_text, text_to_speech, openai_process_message
from flask_cors import CORS
import os

# Initialisation de l'application Flask
app = Flask(__name__)
# Configuration de CORS pour permettre les requêtes cross-origin
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', methods=['GET'])
def index():
    """
    Route principale - Affiche la page d'accueil
    """
    return render_template('index.html')


@app.route('/speech-to-text', methods=['POST'])
def speech_to_text_route():
    """
    Endpoint pour convertir la parole en texte
    La fonction doit recevoir un fichier audio et retourner le texte
    """
    print("traitement de parole en texte")
    audio_binary = request.data # Récupère le discours de l'utilisateur depuis sa requête
    text = speech_to_text(audio_binary) # Appel de la fonction speech_to_text pour transcrire la parole
    # Renvoie la réponse à l'utilisateur au format JSON
    response = app.response_class(
        response=json.dumps({'text': text}),
        status=200,
        mimetype='application/json'
    )
    print(response)
    print(response.data)
    return response


@app.route('/process-message', methods=['POST'])
def process_message_route():
    user_message = request.json['userMessage'] # Récupère le message de l'utilisateur depuis sa requête
    print('message utilisateur', user_message)
    voice = request.json['voice'] # Récupère la voix préférée de l'utilisateur depuis sa requête
    print('voix', voice)
    # Appel de la fonction openai_process_message pour traiter le message de l'utilisateur et obtenir une réponse
    openai_response_text = openai_process_message(user_message)
    # Nettoie la réponse pour supprimer les lignes vides
    openai_response_text = os.linesep.join([s for s in openai_response_text.splitlines() if s])
    # Appel de notre fonction text_to_speech pour convertir la réponse de l'API OpenAI en parole
    openai_response_speech = text_to_speech(openai_response_text, voice)
    # Conversion de openai_response_speech en chaîne base64 pour pouvoir l'envoyer dans la réponse JSON
    openai_response_speech = base64.b64encode(openai_response_speech).decode('utf-8')
    # Envoie une réponse JSON à l'utilisateur contenant la réponse à son message au format texte et parole
    response = app.response_class(
        response=json.dumps({"openaiResponseText": openai_response_text, "openaiResponseSpeech": openai_response_speech}),
        status=200,
        mimetype='application/json'
    )
    print(response)
    return response


# Point d'entrée pour l'exécution du serveur
if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0')
