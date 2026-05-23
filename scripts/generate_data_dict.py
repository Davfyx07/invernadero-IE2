#!/usr/bin/env python3
"""
generate_data_dict.py

Reads Java JPA entity files and generates:
  1. docs/diccionario-de-datos.md   (Markdown tables)
  2. cenit-web/public/data-dictionary.json  (JSON structure)
"""

import glob
import json
import os
import re
import sys

# ── Configuration ────────────────────────────────────────────────────────────

ENTITY_DIR = r"C:\Users\davfy\OneDrive\Escritorio\Cenit\Cenit\src\main\java\com\invernadero\cenit\entity"
MARKDOWN_OUT = r"C:\Users\davfy\OneDrive\Escritorio\Cenit\docs\diccionario-de-datos.md"
JSON_OUT = r"C:\Users\davfy\OneDrive\Escritorio\Cenit\cenit-web\public\data-dictionary.json"

# ── Helpers ──────────────────────────────────────────────────────────────────

def parse_column_params(text: str) -> dict:
    """Extract length, nullable, name from @Column(...) text."""
    params = {"length": None, "nullable": None, "name": None}
    m_len = re.search(r'length\s*=\s*(\d+)', text)
    if m_len:
        params["length"] = int(m_len.group(1))
    m_null = re.search(r'nullable\s*=\s*(true|false)', text)
    if m_null:
        params["nullable"] = m_null.group(1).lower() == "true"
    m_name = re.search(r'name\s*=\s*"([^"]+)"', text)
    if m_name:
        params["name"] = m_name.group(1)
    return params

def infer_default(field_name: str, field_type: str, has_builder_default: bool,
                  raw_default: str | None, has_prepersist: bool,
                  prepersist_body: str | None) -> str:
    """Infer a human-readable default value string."""
    if raw_default is not None:
        # Strip possible inline comment
        val = raw_default.split("//")[0].strip()
        return val
    if has_prepersist and prepersist_body:
        # Check if prePersist assigns this field = LocalDateTime.now()
        if re.search(rf'this\.{re.escape(field_name)}\s*=\s*LocalDateTime\.now\(\)', prepersist_body):
            return "LocalDateTime.now()"
        # Check if prePersist assigns this field = LocalDateTime.now().plusMinutes(...)
        if re.search(rf'this\.{re.escape(field_name)}\s*=\s*LocalDateTime\.now\(\)\.plusMinutes\((\d+)\)', prepersist_body):
            m = re.search(rf'this\.{re.escape(field_name)}\s*=\s*LocalDateTime\.now\(\)\.plusMinutes\((\d+)\)', prepersist_body)
            return f"LocalDateTime.now().plusMinutes({m.group(1)})"
    # Primitive boolean without explicit default usually defaults to false in Java,
    # but for our entities @Builder.Default is used when true.
    if field_type == "boolean":
        return "false"
    return ""

def build_description(field: dict, entity_has_prepersist: bool) -> str:
    parts = []
    if field["isId"]:
        parts.append("Clave primaria")
    if field["isEnum"]:
        parts.append("Enumeración")
    default = field.get("default", "")
    if default == "LocalDateTime.now()" and entity_has_prepersist:
        parts.append("Se inicializa automáticamente en @PrePersist")
    if default.startswith("LocalDateTime.now().plusMinutes") and entity_has_prepersist:
        parts.append("Se inicializa automáticamente en @PrePersist")
    return ". ".join(parts)

# ── Main parser ──────────────────────────────────────────────────────────────

def parse_entity_file(path: str) -> dict | None:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract class name
    m_class = re.search(r'public\s+class\s+(\w+)', content)
    if not m_class:
        return None
    class_name = m_class.group(1)

    # Extract @Table(name = "...")
    m_table = re.search(r'@Table\s*\(\s*name\s*=\s*"([^"]+)"\s*\)', content)
    table_name = m_table.group(1) if m_table else class_name

    # Detect @PrePersist method
    m_prepersist = re.search(
        r'@PrePersist\s*\n\s*public\s+void\s+prePersist\s*\(\s*\)\s*\{([^}]*)\}',
        content, re.DOTALL
    )
    prepersist_body = m_prepersist.group(1) if m_prepersist else None
    has_prepersist = prepersist_body is not None

    # We need the class body (between first { after class declaration and its matching last })
    # A simple approach: from the opening brace of the class to the final closing brace of the file
    class_start = content.find('{', m_class.end())
    # Find the last } in the file as the class close (these are simple single-class files)
    class_body = content[class_start + 1:content.rfind('}')]

    fields = []

    # Regex for a field declaration block: optional annotations, then private Type name;
    # Captures:
    #   1 = all leading annotation lines
    #   2 = Java type
    #   3 = field name
    #   4 = optional default value after =
    field_pattern = re.compile(
        r'((?:\s*@\w+(?:\([^)]*\))?\s+)*)'  # group 1: annotations
        r'private\s+'                         # private
        r'(\w+(?:<[^>]+>)?)\s+'              # group 2: type
        r'(\w+)'                             # group 3: name
        r'(?:\s*=\s*([^;]+))?'               # group 4: optional default value
        r'\s*;',                             # semicolon
        re.MULTILINE
    )

    for m in field_pattern.finditer(class_body):
        annotations_block = m.group(1)
        java_type = m.group(2)
        field_name = m.group(3)
        raw_default = m.group(4)

        # Normalize annotations block
        ann_text = annotations_block.strip()

        is_id = bool(re.search(r'@Id\b', ann_text))
        is_enum = bool(re.search(r'@Enumerated\b', ann_text))
        has_builder_default = bool(re.search(r'@Builder\.Default\b', ann_text))

        # Parse @Column
        col_match = re.search(r'@Column\s*\(([^)]*)\)', ann_text)
        col_params = parse_column_params(col_match.group(1)) if col_match else {}

        # Effective DB column name
        db_name = col_params.get("name") or field_name

        # Nullable inference:
        # - If @Column(nullable=false) -> not nullable
        # - If no @Column or @Column without nullable, and primitive boolean/int/etc -> not nullable (implicit)
        # - Otherwise nullable
        nullable = col_params.get("nullable")
        if nullable is None:
            # Primitives are implicitly non-nullable
            if java_type in {"boolean", "int", "long", "double", "float", "short", "byte", "char"}:
                nullable = False
            else:
                nullable = True

        length = col_params.get("length")

        default_str = infer_default(
            field_name, java_type, has_builder_default,
            raw_default, has_prepersist, prepersist_body
        )

        fields.append({
            "name": field_name,
            "dbName": db_name,
            "type": java_type,
            "length": length,
            "nullable": nullable,
            "default": default_str,
            "isId": is_id,
            "isEnum": is_enum,
            "hasBuilderDefault": has_builder_default,
        })

    return {
        "name": class_name,
        "table": table_name,
        "hasPrePersist": has_prepersist,
        "fields": fields,
    }

# ── Generators ───────────────────────────────────────────────────────────────

def generate_markdown(entities: list) -> str:
    lines = []
    lines.append("# Diccionario de Datos\n")
    lines.append(f"_Generado automáticamente desde las entidades JPA. Total entidades: {len(entities)}_\n")

    for ent in entities:
        lines.append(f"## {ent['name']}")
        lines.append(f"**Tabla:** `{ent['table']}`")
        if ent["hasPrePersist"]:
            lines.append("Contiene método `@PrePersist`.")
        lines.append("")
        lines.append("| Campo | Tipo | Nullable | Default | Descripción |")
        lines.append("|-------|------|----------|---------|-------------|")
        for f in ent["fields"]:
            desc = build_description(f, ent["hasPrePersist"])
            lines.append(
                f"| {f['dbName']} | {f['type']} | {'No' if not f['nullable'] else 'Sí'} | "
                f"{f['default'] if f['default'] else '-'} | {desc} |"
            )
        lines.append("")

    return "\n".join(lines)

def generate_json(entities: list) -> dict:
    out = {"entities": []}
    for ent in entities:
        ent_out = {
            "name": ent["name"],
            "table": ent["table"],
            "fields": [],
        }
        for f in ent["fields"]:
            ent_out["fields"].append({
                "name": f["dbName"],
                "type": f["type"],
                "length": f["length"],
                "nullable": f["nullable"],
                "default": f["default"] if f["default"] else None,
                "isId": f["isId"],
                "isEnum": f["isEnum"],
            })
        out["entities"].append(ent_out)
    return out

# ── Entry point ──────────────────────────────────────────────────────────────

def main():
    files = sorted(glob.glob(os.path.join(ENTITY_DIR, "*.java")))
    if not files:
        print(f"No Java files found in {ENTITY_DIR}", file=sys.stderr)
        sys.exit(1)

    entities = []
    for path in files:
        ent = parse_entity_file(path)
        if ent:
            entities.append(ent)
        else:
            print(f"Warning: could not parse {path}", file=sys.stderr)

    # Sort by class name for stable output
    entities.sort(key=lambda e: e["name"])

    # Ensure output directories exist
    os.makedirs(os.path.dirname(MARKDOWN_OUT), exist_ok=True)
    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)

    # Write Markdown
    md = generate_markdown(entities)
    with open(MARKDOWN_OUT, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"Markdown written to {MARKDOWN_OUT}")

    # Write JSON
    data = generate_json(entities)
    with open(JSON_OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"JSON written to {JSON_OUT}")

if __name__ == "__main__":
    main()
