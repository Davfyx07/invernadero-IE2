import os
import sys
import pytest

# Añadimos la ruta actual para que pueda encontrar el script de validar_taiga.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# --- GANCHO GLOBAL PARA TAIGA ---
# Pytest prefiere que sus hooks globales para interceptar fallos vayan en su archivo conftest.py
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()

    # Si la prueba falla durante la ejecución
    if rep.when == "call" and rep.failed:
        try:
            import validar_taiga

            token = validar_taiga.obtener_token_taiga()
            if token:
                titulo = f"[Bug E2E Selenium] Falló el test: {item.name}"
                descripcion = f"### 🐛 Fallo automatizado de Interfaz UI\n\nEl test automatizado `{item.nodeid}` encontró un error visual, aserción incorrecta o elemento inaccesible.\n\n**Traza de Error:**\n```python\n{str(rep.longrepr)[:2000]}\n```"
                validar_taiga.crear_issue_taiga(token, titulo, descripcion)
        except Exception as e:
            # Si algo falla (y pytest captura el std.out), al menos registrarlo
            with open("taiga_error_fallback.log", "a") as err_log:
                err_log.write(f"Error subiendo a Taiga: {e}\n")