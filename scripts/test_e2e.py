import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()

    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


def test_login_correcto(driver):
    """Login con credenciales validas redirige al dashboard."""
    driver.get("http://localhost:5173/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )

    driver.find_element(By.NAME, "email").send_keys("admin@cenit.app")
    driver.find_element(By.NAME, "password").send_keys("admin123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)
    assert "/login" not in driver.current_url


def test_login_credenciales_invalidas(driver):
    """Login con email inexistente muestra mensaje de error."""
    driver.get("http://localhost:5173/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )

    driver.find_element(By.NAME, "email").send_keys("nadie@cenit.app")
    driver.find_element(By.NAME, "password").send_keys("malapass")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    error = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".bg-red-50, .text-red-700"))
    )
    assert error.is_displayed()


def test_registro_redirige_verify(driver):
    """Registro exitoso redirige a pagina de verificacion."""
    driver.get("http://localhost:5173/register")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "nombre"))
    )

    driver.find_element(By.NAME, "nombre").send_keys("Test")
    driver.find_element(By.NAME, "apellido").send_keys("Selenium")
    driver.find_element(By.NAME, "email").send_keys("selenium@cenit.app")
    driver.find_element(By.NAME, "password").send_keys("secure123")

    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    WebDriverWait(driver, 10).until(lambda d: "/verify-email" in d.current_url)
    assert "/verify-email" in driver.current_url


def test_login_con_language_selector(driver):
    """El selector de idioma esta presente y se puede abrir."""
    driver.get("http://localhost:5173/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[aria-label='common.language']"))
    )

    lang_btn = driver.find_element(By.CSS_SELECTOR, "[aria-label='common.language']")
    lang_btn.click()

    buttons = driver.find_elements(By.CSS_SELECTOR, "button .uppercase")
    locales = [btn.text for btn in buttons if btn.text in ("es", "en", "fr", "it")]
    assert len(locales) >= 4
