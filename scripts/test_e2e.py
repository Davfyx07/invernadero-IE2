import pytest
import os
import sys
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
        EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[1]/input'))
    )

    email_input = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[1]/input')
    email_input.clear()
    email_input.send_keys("admin@cenit.app")
    
    password_input = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[2]/div/input')
    password_input.clear()
    password_input.send_keys("admin123")
    
    driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/button').click()

    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)
    assert "/login" not in driver.current_url


def test_login_credenciales_invalidas(driver):
    """Login con email inexistente muestra mensaje de error."""
    driver.get("http://localhost:5173/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[1]/input'))
    )

    email_input = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[1]/input')
    email_input.clear()
    email_input.send_keys("nadie@cenit.app")
    
    password_input = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[2]/div/input')
    password_input.clear()
    password_input.send_keys("malapass")
    
    driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/button').click()

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

    # Limpiamos y rellenamos los campos
    nombre_input = driver.find_element(By.NAME, "nombre")
    nombre_input.clear()
    nombre_input.send_keys("Test")

    apellido_input = driver.find_element(By.NAME, "apellido")
    apellido_input.clear()
    apellido_input.send_keys("Selenium")

    email_input = driver.find_element(By.NAME, "email")
    email_input.clear()
    email_input.send_keys("selenium@cenit.app")

    password_input = driver.find_element(By.NAME, "password")
    password_input.clear()
    password_input.send_keys("secure123")

    confirm_input = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/div[3]/div[2]/div/input')
    confirm_input.clear()
    confirm_input.send_keys("secure123")

    terminos_checkbox = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/label/input')
    driver.execute_script("arguments[0].click();", terminos_checkbox)

    driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[3]/form/button').click()

    WebDriverWait(driver, 10).until(lambda d: "/verify-email" in d.current_url)
    assert "/verify-email" in driver.current_url


def test_login_con_language_selector(driver):
    """El selector de idioma esta presente y se puede abrir."""
    driver.get("http://localhost:5173/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="root"]/div[1]/div/div[1]/div/div'))
    )

    lang_btn = driver.find_element(By.XPATH, '//*[@id="root"]/div[1]/div/div[1]/div/div')
    lang_btn.click()

    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.absolute.right-0 button"))
    )

    buttons = driver.find_elements(By.CSS_SELECTOR, "div.absolute.right-0 button span.uppercase")
    locales = [span.text.lower() for span in buttons if span.text.lower() in ("es", "en", "fr", "it")]
    assert len(locales) >= 4
