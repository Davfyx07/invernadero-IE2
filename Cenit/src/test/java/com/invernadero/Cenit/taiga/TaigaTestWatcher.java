package com.invernadero.cenit.taiga;

import com.invernadero.cenit.taiga.TaigaClient;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.io.PrintWriter;
import java.io.StringWriter;

public class TaigaTestWatcher implements TestWatcher {

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        // Obtenemos el ApplicationContext de Spring que JUnit está usando
        ApplicationContext applicationContext = SpringExtension.getApplicationContext(context);
        TaigaClient taigaClient = applicationContext.getBean(TaigaClient.class);

        String testName = context.getRequiredTestMethod().getName();
        String className = context.getRequiredTestClass().getSimpleName();
        String title = "[TEST FAILED] " + className + "." + testName;

        // Extraer el stacktrace para que el Issue en Taiga sea súper informativo
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        cause.printStackTrace(pw);

        String description = String.format(
                "### ❌ Test Fallido detectado automáticamente\n\n" +
                        "- **Clase de Test:** `%s`\n" +
                        "- **Método:** `%s`\n" +
                        "- **Mensaje de Error:** *%s*\n\n" +
                        "#### 📋 Stacktrace:\n```java\n%s\n```",
                className, testName, cause.getMessage(), sw.toString()
        );

        taigaClient.createIssue(title, description);
    }
}