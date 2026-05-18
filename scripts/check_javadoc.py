#!/usr/bin/env python3
"""
Script de verificación de documentación Javadoc en archivos Java.

Revisa:
- Header con @author, @version, @since
- Javadoc en clases públicas
- Javadoc en métodos públicos

Uso:
    python scripts/check_javadoc.py [ruta]

Salida: reporte HTML en target/javadoc-report.html
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime


def find_java_files(root_dir):
    """Recursively find all .java files."""
    return list(Path(root_dir).rglob("*.java"))


def check_file(filepath):
    """Check a single Java file for documentation compliance."""
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    issues = []

    # Check header block
    header_match = re.search(r'/\*\*(.*?)\*/', content, re.DOTALL)
    if not header_match:
        issues.append("No tiene bloque de documentación Javadoc inicial")
    else:
        header = header_match.group(1)
        if '@author' not in header:
            issues.append("Falta @author en header")
        if '@version' not in header:
            issues.append("Falta @version en header")
        if '@since' not in header:
            issues.append("Falta @since en header")

    # Check public class Javadoc
    public_classes = re.findall(r'\n(public\s+(?:abstract\s+)?class\s+(\w+))', content)
    for _, class_name in public_classes:
        # Look for Javadoc before this class
        idx = content.find(f'public class {class_name}')
        before = content[:idx].rstrip()
        if '*/' not in before[-200:]:
            issues.append(f"Clase pública '{class_name}' sin Javadoc")

    # Check public method Javadoc (simple regex)
    public_methods = re.findall(
        r'\n\s+public\s+(?!class|interface|enum|static\s+void\s+main)'
        r'([\w<>,\s\[\]]+\s+)(\w+)\s*\(',
        content
    )
    for _, method_name in public_methods:
        if method_name in ('get', 'set', 'is', 'toString', 'equals', 'hashCode'):
            continue  # Skip getters/setters/common methods
        idx = content.find(f'public {method_name}(')
        # Find the actual position more carefully
        for match in re.finditer(rf'public\s+[\w<>,\s\[\]]+\s+{re.escape(method_name)}\s*\(', content):
            start = match.start()
            before = content[:start].rstrip()
            if '*/' not in before[-300:]:
                issues.append(f"Método público '{method_name}' sin Javadoc")
                break

    return {
        "file": str(filepath),
        "lines": len(lines),
        "issues": issues,
        "ok": len(issues) == 0,
    }


def generate_report(results, output_path):
    """Generate HTML report."""
    total = len(results)
    ok = sum(1 for r in results if r["ok"])
    coverage = (ok / total * 100) if total > 0 else 0

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte Javadoc — Cenit</title>
<style>
  body {{ font-family: system-ui, sans-serif; margin: 2rem; background: #f8fafc; color: #1e293b; }}
  h1 {{ margin-bottom: 0.5rem; }}
  .summary {{ background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  .bar {{ height: 24px; background: #e2e8f0; border-radius: 12px; overflow: hidden; margin-top: 0.5rem; }}
  .bar-fill {{ height: 100%; background: {'#10b981' if coverage >= 80 else '#f59e0b' if coverage >= 50 else '#ef4444'}; transition: width 0.5s; }}
  table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  th, td {{ padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }}
  th {{ background: #0f172a; color: white; font-weight: 500; }}
  tr:hover {{ background: #f8fafc; }}
  .ok {{ color: #10b981; font-weight: 600; }}
  .fail {{ color: #ef4444; font-weight: 600; }}
  .issues {{ font-size: 0.85rem; color: #64748b; }}
  .issues li {{ margin-bottom: 4px; }}
</style>
</head>
<body>
<h1>Reporte de Cobertura Javadoc</h1>
<div class="summary">
  <p><strong>Generado:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
  <p><strong>Archivos revisados:</strong> {total}</p>
  <p><strong>Documentados correctamente:</strong> {ok} / {total}</p>
  <p><strong>Cobertura:</strong> {coverage:.1f}%</p>
  <div class="bar"><div class="bar-fill" style="width:{coverage:.1f}%"></div></div>
</div>
<table>
  <tr><th>Archivo</th><th>Líneas</th><th>Estado</th><th>Problemas</th></tr>
"""

    for r in results:
        status = '<span class="ok">OK</span>' if r["ok"] else '<span class="fail">FALLA</span>'
        issues_html = '<ul class="issues">' + ''.join(f'<li>• {i}</li>' for i in r["issues"]) + '</ul>' if r["issues"] else '—'
        file_name = r["file"].split("src\\main\\java\\")[-1] if "src\\main\\java\\" in r["file"] else r["file"]
        html += f"  <tr><td>{file_name}</td><td>{r['lines']}</td><td>{status}</td><td>{issues_html}</td></tr>\n"

    html += """</table>
</body>
</html>"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"Reporte generado: {output_path}")


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "src/main/java"
    java_files = find_java_files(root)

    if not java_files:
        print(f"No se encontraron archivos .java en: {root}")
        sys.exit(1)

    results = [check_file(f) for f in java_files]
    output = Path("target/javadoc-report.html")
    generate_report(results, output)

    failed = sum(1 for r in results if not r["ok"])
    if failed > 0:
        print(f"\n[!] {failed} archivos con problemas de documentacion")
        sys.exit(1)
    else:
        print("\n[OK] Todos los archivos estan documentados correctamente")


if __name__ == "__main__":
    main()
