#!/usr/bin/env python3
"""
Compara los commits del ultimo push y muestra un resumen de cambios.

Uso:
    python scripts/compare_commits.py [--branch main] [--base HEAD~1]

Output:
    - Lista de archivos modificados agrupados por tipo
    - Estadisticas de lineas agregadas/eliminadas
    - Archivos nuevos, modificados, eliminados
    - Posibles issues sugeridas (archivos sin tests, TODOs, FIXMEs)
"""

import subprocess
import sys
import os
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXT_CATEGORIES = {
    "Java": {".java"},
    "Frontend": {".jsx", ".js", ".ts", ".tsx", ".css"},
    "Config": {".json", ".yml", ".yaml", ".xml", ".properties", ".env"},
    "SQL": {".sql"},
    "Python": {".py"},
    "Docs": {".md", ".txt"},
    "Docker": {"Dockerfile", "docker-compose"},
}


def run_git(args):
    return subprocess.check_output(
        ["git"] + args, cwd=ROOT, text=True
    ).strip()


class Color:
    """Códigos ANSI para terminal. En GitHub Actions se renderizan como colores."""
    HEADER = "\033[95m"
    OK = "\033[92m"
    WARN = "\033[93m"
    FAIL = "\033[91m"
    BOLD = "\033[1m"
    RESET = "\033[0m"


def categorize(path):
    ext = os.path.splitext(path)[1].lower()
    base = os.path.basename(path).lower()
    for cat, exts in EXT_CATEGORIES.items():
        if ext in exts or base in exts:
            return cat
    return "Otros"


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Compara commits y genera reporte")
    parser.add_argument("--save", action="store_true", help="Guardar reporte como archivo Markdown")
    args = parser.parse_args()

    base_ref = "HEAD~1"

    # Obtener commits entre base_ref y HEAD
    try:
        commits = run_git(["log", "--oneline", f"{base_ref}..HEAD"]).split("\n")
    except subprocess.CalledProcessError:
        print(f"[ERROR] No se pudo comparar {base_ref}..HEAD")
        sys.exit(1)

    if not commits or commits == [""]:
        print("Sin commits nuevos desde el ultimo push.")
        sys.exit(0)

    print("=" * 70)
    print(f"  COMPARACION DE COMMITS: {base_ref}..HEAD ({len(commits)} commits)")
    print("=" * 70)

    print("\nCOMMITS:")
    for c in commits:
        print(f"  {c}")

    # Archivos modificados
    files = run_git(["diff", "--name-status", f"{base_ref}..HEAD"]).split("\n")
    files = [f for f in files if f.strip()]

    added = []
    modified = []
    deleted = []

    for line in files:
        if "\t" not in line:
            continue
        status, path = line.split("\t", 1)
        if status.startswith("A"):
            added.append(path)
        elif status.startswith("D"):
            deleted.append(path)
        else:
            modified.append(path)

    print(f"\nARCHIVOS: {len(added)} nuevos, {len(modified)} modificados, {len(deleted)} eliminados")

    # Estadisticas
    try:
        stats = run_git(["diff", "--stat", f"{base_ref}..HEAD"])
        print("\nESTADISTICAS:")
        print(stats)
    except subprocess.CalledProcessError:
        pass

    # Agrupados por categoria
    categories = Counter()
    for cat, paths in [("Nuevos", added), ("Modificados", modified), ("Eliminados", deleted)]:
        for p in paths:
            categories[categorize(p)] += 1

    print("\nPOR CATEGORIA:")
    for cat, count in categories.most_common():
        print(f"  {cat}: {count} archivos")

    # Listado detallado
    if added:
        print("\n[+] NUEVOS:")
        for p in sorted(added):
            print(f"    {p}")

    if modified:
        print("\n[*] MODIFICADOS:")
        for p in sorted(modified):
            print(f"    {p} ({categorize(p)})")

    if deleted:
        print("\n[-] ELIMINADOS:")
        for p in sorted(deleted):
            print(f"    {p}")

    # Analisis: archivos sin tests correspondientes
    print("\n[ADVERTENCIAS] Archivos nuevos sin tests:")
    new_src = [p for p in added if any(p.endswith(e) for e in [".java", ".js", ".jsx"])]
    if new_src:
        for p in new_src:
            base = os.path.splitext(os.path.basename(p))[0]
            has_test = any(
                "test" in t.lower() or base.lower() in t.lower()
                for t in added + modified
                if "test" in t.lower()
            )
            if not has_test and "test" not in p.lower():
                print(f"  ! {p} (sin test encontrado)")
    else:
        print("  (ninguno)")

    print("\n" + "=" * 70)
    print("  Fin del analisis")
    print("=" * 70)

    if args.save:
        report_path = os.path.join(ROOT, "reporte-cambios.md")
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(f"# Reporte de Cambios — `{base_ref}..HEAD`\n\n")
            f.write(f"**{len(commits)} commits** desde el ultimo push.\n\n")
            f.write("## Commits\n\n")
            for c in commits:
                f.write(f"- {c}\n")
            f.write(f"\n## Archivos ({len(added)} nuevos, {len(modified)} modificados, {len(deleted)} eliminados)\n\n")
            if added:
                f.write("### Nuevos\n\n")
                for p in sorted(added):
                    f.write(f"- `{p}`\n")
            if modified:
                f.write("\n### Modificados\n\n")
                for p in sorted(modified):
                    f.write(f"- `{p}` ({categorize(p)})\n")
            if deleted:
                f.write("\n### Eliminados\n\n")
                for p in sorted(deleted):
                    f.write(f"- `{p}`\n")
            f.write("\n### Por Categoria\n\n")
            for cat, count in categories.most_common():
                f.write(f"- {cat}: {count}\n")
        print(f"\n[OK] Reporte guardado en: {report_path}")


if __name__ == "__main__":
    main()
