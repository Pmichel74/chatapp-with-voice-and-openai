from openai import OpenAI
import requests

# Initialisation du client OpenAI pour accéder à l'API
openai_client = OpenAI()


def speech_to_text(audio_binary):
    """
    Convertit un fichier audio en texte en utilisant l'API Watson Speech-to-Text
    
    Args:
        audio_binary: Données binaires du fichier audio à transcrire
        
    Returns:
        str: Texte transcrit depuis l'audio ou None en cas d'échec
    """
    # Configuration de l'URL de l'API HTTP Watson Speech-to-Text
    base_url = 'https://sn-watson-stt.labs.skills.network'
    api_url = base_url+'/speech-to-text/api/v1/recognize'
    
    # Configuration des paramètres pour notre requête HTTP
    params = {
        'model': 'en-US_Multimedia',
    }
    
    # Envoi d'une requête HTTP Post
    response = requests.post(api_url, params=params, data=audio_binary).json()
    
    # Analyse de la réponse pour obtenir notre texte transcrit
    print('réponse de parole à texte:', response)
    
    # Vérifier si la réponse contient des résultats selon la structure fournie
    if 'response' in response and 'results' in response['response']:
        if 'alternatives' in response['response']['results']:
            transcript = response['response']['results']['alternatives']['transcript']
            print('texte reconnu: ', transcript)
            return transcript
    
    # Vérification alternative si la structure est différente
    if 'results' in response and response['results']:
        for result in response['results']:
            if 'alternatives' in result and result['alternatives']:
                transcript = result['alternatives'][0]['transcript']
                print('texte reconnu: ', transcript)
                return transcript
    
    return None


def text_to_speech(text, voice=""):
    """
    Convertit du texte en parole en utilisant le service Watson Text-to-Speech
    
    Args:
        text (str): Texte à convertir en parole
        voice (str): Type de voix à utiliser (paramètre optionnel)
        
    Returns:
        bytes: Données audio générées ou None en cas d'échec
    """
    # Configuration de l'URL de l'API HTTP de Watson Text-to-Speech
    base_url = 'https://sn-watson-tts.labs.skills.network'
    api_url = base_url + '/text-to-speech/api/v1/synthesize?output=output_text.wav'
    # Ajout du paramètre voix dans api_url si l'utilisateur a sélectionné une voix préférée
    if voice != "" and voice != "default":
        api_url += "&voice=" + voice
    # Définir les en-têtes pour notre requête HTTP
    headers = {
        'Accept': 'audio/wav',
        'Content-Type': 'application/json',
    }
    # Définir le corps de notre requête HTTP
    json_data = {
        'text': text,
    }
    # Envoyer une requête HTTP Post au service Watson Text-to-Speech
    response = requests.post(api_url, headers=headers, json=json_data)
    print('réponse de text to speech :', response)
    return response.content


def openai_process_message(user_message):
    """
    Traite un message utilisateur via l'API OpenAI pour générer une réponse
    
    Args:
        user_message (str): Message de l'utilisateur à traiter
        
    Returns:
        str: Réponse générée par le modèle OpenAI ou None en cas d'échec
    """
    # Définir le prompt pour l'API OpenAI
    prompt = "Agissez comme un assistant personnel. Vous pouvez répondre aux questions, traduire des phrases, résumer des nouvelles et donner des recommandations."
    # Appeler l'API OpenAI pour traiter notre prompt
    openai_response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo", 
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_message}
        ],
        max_tokens=4000
    )
    print("réponse openai :", openai_response)
    # Analyser la réponse pour obtenir le message de réponse pour notre prompt
    response_text = openai_response.choices[0].message.content
    return response_text
