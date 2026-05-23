import os
import sys
import requests

def load_env():
    """Carga variables desde el archivo .env en la raíz del proyecto."""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# Cargar variables de entorno al iniciar
load_env()

TAIGA_API_URL = os.environ.get("TAIGA_API_URL", "https://api.taiga.io/api/v1")
TAIGA_USERNAME = os.environ.get("TAIGA_USERNAME")
TAIGA_PASSWORD = os.environ.get("TAIGA_PASSWORD")
TAIGA_PROJECT_ID = os.environ.get("TAIGA_PROJECT_ID")

def obtener_token_taiga():
    """Se autentica usando el endpoint auth normal login y devuelve el token JWT"""
    url = f"{TAIGA_API_URL}/auth"
    payload = {
        "username": TAIGA_USERNAME,
        "password": TAIGA_PASSWORD,
        "type": "normal"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Lanza error si el HTTP status no es 200
        return response.json().get("auth_token")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error crítico al autenticar en Taiga: {e}")
        return None

def crear_issue_taiga(token, titulo, descripcion):
    """Crea un Issue en el proyecto especificado si la validación falla"""
    url = f"{TAIGA_API_URL}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "project": TAIGA_PROJECT_ID,
        "subject": titulo,
        "description": descripcion
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code != 201:
            print(f"Detalle del error Taiga: {response.text}")
        response.raise_for_status()
        print("➔ [Taiga] Issue creado exitosamente en la plataforma.")
    except requests.exceptions.RequestException as e:
        print(f"❌ No se pudo crear el issue en Taiga: {e}")

def validar_comentario(comentario):
    """
    Aquí colocas tus reglas de validación.
    Devuelve (True, "") si es válido.
    Devuelve (False, "Razón del fallo") si es inválido.
    """
    if not comentario or len(comentario.strip()) == 0:
        return False, "El comentario está completamente vacío."
        
    if len(comentario) < 15:
        return False, f"El comentario es muy corto ({len(comentario)} caracteres). Debe tener al menos 15 caracteres."
        
    # Ejemplo: Validar que el comentario empiece con un tag de Jira/Taiga como [REF-12] o [FIX]
    if not (comentario.startswith("[") and "]" in comentario):
        return False, "El comentario no cumple con el formato requerido. Debe iniciar con un tag entre corchetes, ej: '[FIX] Mensaje'."

    return True, ""

if __name__ == "__main__":
    # Supongamos que pasas el comentario como argumento al ejecutar el script:
    # python validar_taiga.py "Mensaje del commit o prueba"
    if len(sys.argv) < 2:
        print("❌ Uso: python validar_taiga.py '<comentario>'")
        sys.exit(1)
        
    comentario_a_evaluar = sys.argv[1]
    print(f"🔍 Evaluando comentario: '{comentario_a_evaluar}'")
    
    es_valido, motivo_fallo = validar_comentario(comentario_a_evaluar)
    
    if not es_valido:
        print(f"⚠️ Validación fallida: {motivo_fallo}")
        print("🔄 Conectando con Taiga para reportar el error...")
        
        token = obtener_token_taiga()
        if token:
            titulo_issue = f"[FALLO VALIDACIÓN] Comentario inválido detectado"
            descripcion_issue = (
                f"### ❌ Error en la regla de comentarios\n\n"
                f"- **Comentario evaluado:** `{comentario_a_evaluar}`\n"
                f"- **Razón del rechazo:** {motivo_fallo}\n\n"
                f"*Este issue fue generado automáticamente por el script de validación.*"
            )
            crear_issue_taiga(token, titulo_issue, descripcion_issue)
        
        # Salir con código de error 1 para avisarle al sistema (o a Git/CI) que el proceso falló
        sys.exit(1)
    else:
        print("✅ El comentario es válido. Todo bien.")
        sys.exit(0)