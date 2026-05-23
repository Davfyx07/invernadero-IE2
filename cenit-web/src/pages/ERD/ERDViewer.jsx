// src/pages/ERD/ERDViewer.jsx
// Lee modelo.json desde /public/modelo.json y renderiza el ERD interactivo
// Ahora incluye toggle para ver el Diccionario de Datos generado desde entidades JPA

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Stage, Layer, Rect, Text, Line, Group, Arrow, Circle } from "react-konva";

// ─── Constantes de diseño ─────────────────────────────────────────────────────
const ENTITY_WIDTH   = 240;
const HEADER_HEIGHT  = 38;
const ROW_HEIGHT     = 26;
const PADDING        = 12;

const COLORS = {
  bg:           "#0d1117",
  grid:         "#161b22",
  entityBg:     "#161b22",
  entityBorder: "#30363d",
  headerBg:     "#059669",
  headerAlt:    "#10b981",
  headerText:   "#ffffff",
  pkText:       "#ffa657",
  fkText:       "#79c0ff",
  fieldText:    "#c9d1d9",
  typeText:     "#8b949e",
  relation:     "#10b981",
  relationGlow: "#059669",
  selected:     "#f78166",
  shadow:       "rgba(31, 111, 235, 0.3)",
};

const TYPE_BADGE = {
  Long:     { bg: "#1b2a3b", text: "#79c0ff" },
  String:   { bg: "#1b3a2a", text: "#56d364" },
  Boolean:  { bg: "#2a1b3b", text: "#bc8cff" },
  Integer:  { bg: "#1b2a3b", text: "#79c0ff" },
  Double:   { bg: "#1b2a3b", text: "#79c0ff" },
  Date:     { bg: "#3b2a1b", text: "#ffa657" },
  DateTime: { bg: "#3b2a1b", text: "#ffa657" },
  Enum:     { bg: "#3b1b2a", text: "#ff7b72" },
  FK:       { bg: "#1b3b3b", text: "#39d353" },
  Text:     { bg: "#1b3a2a", text: "#56d364" },
};

// ─── Posiciones iniciales automáticas (cuadrícula) ────────────────────────────
function getInitialPositions(entities) {
  const cols = 3;
  const gapX = ENTITY_WIDTH + 80;
  const gapY = 60;
  const positions = {};
  entities.forEach((entity, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const entityHeight = HEADER_HEIGHT + entity.fields.length * ROW_HEIGHT;
    positions[entity.name] = {
      x: 60 + col * gapX,
      y: 80 + row * (entityHeight + gapY),
    };
  });
  return positions;
}

// ─── Detecta relaciones FK en las entidades ───────────────────────────────────
function extractRelations(entities) {
  const relations = [];
  for (const entity of entities) {
    for (const field of entity.fields) {
      if (field.type === "FK" && field.references) {
        const targetTable = field.references.split("(")[0].trim();
        const targetEntity = entities.find(e => e.table === targetTable);
        if (targetEntity) {
          relations.push({
            from: entity.name,
            to:   targetEntity.name,
            field: field.name,
            onDelete: field.onDelete || "RESTRICT",
          });
        }
      }
    }
  }
  return relations;
}

// ─── Componente entidad ───────────────────────────────────────────────────────
function EntityCard({ entity, position, isSelected, onDragMove, onSelect }) {
  const height = HEADER_HEIGHT + entity.fields.length * ROW_HEIGHT + 8;

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onClick={() => onSelect(entity.name)}
      onTap={() => onSelect(entity.name)}
      onDragMove={(e) => onDragMove(entity.name, { x: e.target.x(), y: e.target.y() })}
    >
      {/* Sombra */}
      <Rect
        x={4} y={4}
        width={ENTITY_WIDTH}
        height={height}
        fill={isSelected ? "rgba(247,129,102,0.15)" : "rgba(31,111,235,0.12)"}
        cornerRadius={8}
      />

      {/* Cuerpo */}
      <Rect
        width={ENTITY_WIDTH}
        height={height}
        fill={COLORS.entityBg}
        stroke={isSelected ? COLORS.selected : COLORS.entityBorder}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
      />

      {/* Header */}
      <Rect
        width={ENTITY_WIDTH}
        height={HEADER_HEIGHT}
        fill={isSelected ? COLORS.selected : COLORS.headerBg}
        cornerRadius={[8, 8, 0, 0]}
      />

      {/* Nombre entidad */}
      <Text
        text={entity.name}
        x={PADDING}
        y={0}
        width={ENTITY_WIDTH - PADDING * 2}
        height={HEADER_HEIGHT}
        fontSize={13}
        fontStyle="bold"
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fill={COLORS.headerText}
        verticalAlign="middle"
      />

      {/* Tabla */}
      <Text
        text={entity.table}
        x={PADDING}
        y={0}
        width={ENTITY_WIDTH - PADDING * 2}
        height={HEADER_HEIGHT}
        fontSize={9}
        fontFamily="monospace"
        fill="rgba(255,255,255,0.5)"
        verticalAlign="middle"
        align="right"
      />

      {/* Campos */}
      {entity.fields.map((field, i) => {
        const y     = HEADER_HEIGHT + i * ROW_HEIGHT + 4;
        const isPK  = field.pk;
        const isFK  = field.type === "FK";
        const badge = TYPE_BADGE[field.type] || TYPE_BADGE["String"];

        return (
          <Group key={field.name} y={y}>
            {/* Separador */}
            <Line
              points={[0, 0, ENTITY_WIDTH, 0]}
              stroke={COLORS.entityBorder}
              strokeWidth={0.5}
            />

            {/* Indicador PK/FK */}
            {(isPK || isFK) && (
              <Text
                text={isPK ? "PK" : "FK"}
                x={PADDING}
                y={4}
                fontSize={8}
                fontStyle="bold"
                fontFamily="monospace"
                fill={isPK ? COLORS.pkText : COLORS.fkText}
              />
            )}

            {/* Nombre campo */}
            <Text
              text={field.name}
              x={isPK || isFK ? PADDING + 24 : PADDING}
              y={5}
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              fill={isPK ? COLORS.pkText : isFK ? COLORS.fkText : COLORS.fieldText}
            />

            {/* Tipo */}
            <Rect
              x={ENTITY_WIDTH - 68}
              y={3}
              width={60}
              height={16}
              fill={badge.bg}
              cornerRadius={3}
            />
            <Text
              text={field.type === "Enum" ? field.enumName?.split("_")[0] || "Enum" : field.type}
              x={ENTITY_WIDTH - 68}
              y={5}
              width={60}
              fontSize={9}
              fontFamily="monospace"
              fill={badge.text}
              align="center"
            />
          </Group>
        );
      })}
    </Group>
  );
}

// ─── Línea de relación ────────────────────────────────────────────────────
function RelationLine({ from, to, positions, label }) {
  const posFrom = positions[from];
  const posTo   = positions[to];
  if (!posFrom || !posTo) return null;

  const x1 = posFrom.x + ENTITY_WIDTH;
  const y1 = posFrom.y + HEADER_HEIGHT / 2 + 20;
  const x2 = posTo.x;
  const y2 = posTo.y + HEADER_HEIGHT / 2 + 20;

  // Si están en el mismo lado, conecta arriba/abajo
  const dx = x2 - x1;
  const mx = x1 + dx / 2;

  return (
    <Group>
      <Arrow
        points={[x1, y1, mx, y1, mx, y2, x2, y2]}
        stroke={COLORS.relation}
        strokeWidth={1.5}
        fill={COLORS.relation}
        pointerLength={8}
        pointerWidth={6}
        tension={0}
        dash={[6, 3]}
      />
      {label && (
        <Text
          text={label}
          x={mx - 20}
          y={(y1 + y2) / 2 - 8}
          fontSize={10}
          fontFamily="monospace"
          fill={COLORS.fkText}
          padding={2}
        />
      )}
      {/* Cardinalidad N (origen de la FK) */}
      <Text
        text="N"
        x={x1 + 8}
        y={y1 - 14}
        fontSize={12}
        fontStyle="bold"
        fontFamily="monospace"
        fill={COLORS.selected}
      />
      {/* Cardinalidad 1 (destino de la FK) */}
      <Text
        text="1"
        x={x2 - 16}
        y={y2 - 14}
        fontSize={12}
        fontStyle="bold"
        fontFamily="monospace"
        fill={COLORS.selected}
      />
    </Group>
  );
}

// ─── Diccionario de Datos (tabla HTML) ────────────────────────────────────
function DataDictionaryView({ data, onSelectEntity, selected }) {
  const [filter, setFilter] = useState("");
  const entities = data?.entities || [];
  const filtered = filter
    ? entities.filter(e => e.name.toLowerCase().includes(filter.toLowerCase()))
    : entities;

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Buscar entidad..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#c9d1d9",
            fontSize: "13px",
            fontFamily: "monospace",
            width: "280px",
            outline: "none",
          }}
        />
        <span style={{ color: "#8b949e", fontSize: "12px" }}>
          {filtered.length} / {entities.length} entidades
        </span>
      </div>

      {filtered.map((entity) => (
        <div
          key={entity.name}
          style={{
            marginBottom: "24px",
            border: "1px solid #30363d",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#161b22",
          }}
        >
          {/* Header de entidad */}
          <div
            style={{
              background: selected === entity.name ? "#f78166" : "#059669",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => onSelectEntity(entity.name === selected ? null : entity.name)}
          >
            <div>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
                {entity.name}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginLeft: "10px", fontFamily: "monospace" }}>
                tabla: {entity.table}
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
              {entity.fields.length} campos
            </span>
          </div>

          {/* Tabla de campos */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ background: "#0d1117" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8b949e", fontWeight: 500, borderBottom: "1px solid #30363d" }}>Campo</th>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8b949e", fontWeight: 500, borderBottom: "1px solid #30363d" }}>Tipo</th>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8b949e", fontWeight: 500, borderBottom: "1px solid #30363d" }}>Nullable</th>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8b949e", fontWeight: 500, borderBottom: "1px solid #30363d" }}>Default</th>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "#8b949e", fontWeight: 500, borderBottom: "1px solid #30363d" }}>Notas</th>
              </tr>
            </thead>
            <tbody>
              {entity.fields.map((field, i) => (
                <tr key={field.name} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: "7px 12px", color: field.isId ? "#ffa657" : field.name.endsWith("_id") ? "#79c0ff" : "#c9d1d9", borderBottom: "1px solid #21262d" }}>
                    {field.name}
                    {field.isId && <span style={{ fontSize: "9px", color: "#ffa657", marginLeft: "6px" }}>PK</span>}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#8b949e", borderBottom: "1px solid #21262d" }}>
                    {field.type}{field.length ? `(${field.length})` : ""}
                  </td>
                  <td style={{ padding: "7px 12px", color: field.nullable ? "#8b949e" : "#ff7b72", borderBottom: "1px solid #21262d" }}>
                    {field.nullable ? "Sí" : "No"}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#8b949e", borderBottom: "1px solid #21262d" }}>
                    {field.default || "—"}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#8b949e", borderBottom: "1px solid #21262d", fontSize: "11px" }}>
                    {field.isEnum ? "Enum" : ""}
                    {field.isPrePersist ? " @PrePersist" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────
export default function ERDViewer() {
  const [model,     setModel]     = useState(null);
  const [ddData,    setDdData]    = useState(null);
  const [viewMode,  setViewMode]  = useState("diagram"); // "diagram" | "dictionary"
  const [positions, setPositions] = useState({});
  const [selected,  setSelected]  = useState(null);
  const [relations, setRelations] = useState([]);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth - 260, height: window.innerHeight });
  const containerRef = useRef(null);

  // Resize adaptativo usando ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setStageSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cargar modelo (ERD)
  const loadModel = useCallback(async () => {
    try {
      const res  = await fetch("/modelo.json?t=" + Date.now());
      const data = await res.json();
      setModel(data);
      setRelations(extractRelations(data.entities));
      setPositions(prev => {
        if (Object.keys(prev).length === 0) {
          return getInitialPositions(data.entities);
        }
        return prev;
      });
    } catch (e) {
      console.error("Error cargando modelo.json:", e);
    }
  }, []);

  // Cargar diccionario de datos
  const loadDictionary = useCallback(async () => {
    try {
      const res = await fetch("/data-dictionary.json?t=" + Date.now());
      const data = await res.json();
      setDdData(data);
    } catch (e) {
      console.error("Error cargando data-dictionary.json:", e);
    }
  }, []);

  useEffect(() => {
    loadModel();
    loadDictionary();
    const interval = setInterval(() => {
      loadModel();
      loadDictionary();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadModel, loadDictionary]);

  const handleDragMove = (name, pos) => {
    setPositions(prev => ({ ...prev, [name]: pos }));
  };

  const handleReset = () => {
    if (model) setPositions(getInitialPositions(model.entities));
  };

  if (!model) return (
    <div style={styles.loading}>
      <div style={styles.loadingDot} />
      <span>Cargando modelo...</span>
    </div>
  );

  const selectedEntity = selected ? model.entities.find(e => e.name === selected) : null;

  return (
    <div style={styles.root}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>🌿 ERD Viewer</span>
          <span style={styles.sidebarSub}>{model.project} v{model.version}</span>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "8px",
              padding: "6px 10px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "#8b949e",
              fontSize: "11px",
              textDecoration: "none",
            }}
          >
            ← Volver al Dashboard
          </a>
        </div>

        {/* Toggle de vista */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #21262d", display: "flex", gap: "8px" }}>
          <button
            onClick={() => setViewMode("diagram")}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid " + (viewMode === "diagram" ? "#1f6feb" : "#30363d"),
              background: viewMode === "diagram" ? "rgba(31,111,235,0.15)" : "transparent",
              color: viewMode === "diagram" ? "#79c0ff" : "#8b949e",
              fontSize: "11px",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            Diagrama
          </button>
          <button
            onClick={() => setViewMode("dictionary")}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid " + (viewMode === "dictionary" ? "#1f6feb" : "#30363d"),
              background: viewMode === "dictionary" ? "rgba(31,111,235,0.15)" : "transparent",
              color: viewMode === "dictionary" ? "#79c0ff" : "#8b949e",
              fontSize: "11px",
              fontFamily: "monospace",
              cursor: "pointer",
            }}
          >
            Diccionario
          </button>
        </div>

        <div style={styles.sidebarSection}>
          <p style={styles.sectionLabel}>ENTIDADES ({model.entities.length})</p>
          {model.entities.map(e => (
            <button
              key={e.name}
              style={{ ...styles.entityBtn, ...(selected === e.name ? styles.entityBtnActive : {}) }}
              onClick={() => setSelected(e.name === selected ? null : e.name)}
            >
              <span>{e.name}</span>
              <span style={styles.entityBtnCount}>{e.fields.length} campos</span>
            </button>
          ))}
        </div>

        <div style={styles.sidebarSection}>
          <p style={styles.sectionLabel}>RELACIONES ({relations.length})</p>
          {relations.map((r, i) => (
            <div key={i} style={styles.relationItem}>
              <span style={styles.relFrom}>{r.from}</span>
              <span style={styles.relArrow}>→</span>
              <span style={styles.relTo}>{r.to}</span>
            </div>
          ))}
        </div>

        {selectedEntity && (
          <div style={styles.sidebarSection}>
            <p style={styles.sectionLabel}>DETALLE: {selectedEntity.name}</p>
            <p style={styles.tableTag}>tabla: {selectedEntity.table}</p>
            {selectedEntity.fields.map(f => (
              <div key={f.name} style={styles.fieldRow}>
                <span style={styles.fieldName}>{f.name}</span>
                <span style={{ ...styles.fieldType, color: (TYPE_BADGE[f.type] || TYPE_BADGE["String"]).text }}>
                  {f.type}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={styles.sidebarFooter}>
          <button style={styles.resetBtn} onClick={handleReset}>↺ Reset posiciones</button>
          <button style={styles.resetBtn} onClick={loadModel}>⟳ Recargar modelo</button>
        </div>
      </aside>

      {/* ── Canvas / Diccionario ── */}
      <div ref={containerRef} style={styles.canvas} onClick={() => setSelected(null)}>
        {viewMode === "diagram" ? (
          <Stage width={stageSize.width} height={stageSize.height} draggable>
            <Layer>
              {/* Grid de fondo infinito */}
              {Array.from({ length: 150 }).map((_, i) => (
                <Line key={`h${i}`} points={[-4000, (i - 75) * 40, 4000, (i - 75) * 40]}
                  stroke={COLORS.grid} strokeWidth={0.5} />
              ))}
              {Array.from({ length: 150 }).map((_, i) => (
                <Line key={`v${i}`} points={[(i - 75) * 40, -4000, (i - 75) * 40, 4000]}
                  stroke={COLORS.grid} strokeWidth={0.5} />
              ))}

              {/* Relaciones */}
              {relations.map((r, i) => (
                <RelationLine
                  key={i}
                  from={r.from}
                  to={r.to}
                  positions={positions}
                  label={r.onDelete}
                />
              ))}

              {/* Entidades */}
              {model.entities.map(entity => (
                <EntityCard
                  key={entity.name}
                  entity={entity}
                  position={positions[entity.name] || { x: 100, y: 100 }}
                  isSelected={selected === entity.name}
                  onDragMove={handleDragMove}
                  onSelect={setSelected}
                />
              ))}
            </Layer>
          </Stage>
        ) : (
          <DataDictionaryView
            data={ddData}
            selected={selected}
            onSelectEntity={setSelected}
          />
        )}
      </div>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────
const styles = {
  root: {    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,    display: "flex",
    height: "100vh",
    width: "100vw",
    background: COLORS.bg,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: COLORS.fieldText,
    overflow: "hidden",
  },
  sidebar: {
    width: "260px",
    minWidth: "260px",
    background: "#0d1117",
    borderRight: "1px solid #21262d",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid #21262d",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  sidebarTitle: { fontSize: "14px", fontWeight: "bold", color: "#fff" },
  sidebarSub:   { fontSize: "10px", color: "#8b949e" },
  sidebarSection: {
    padding: "12px 16px",
    borderBottom: "1px solid #21262d",
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: "9px",
    color: "#8b949e",
    letterSpacing: "0.1em",
    marginBottom: "8px",
    marginTop: 0,
  },
  entityBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "6px 8px",
    marginBottom: "4px",
    background: "transparent",
    border: "1px solid #21262d",
    borderRadius: "4px",
    color: COLORS.fieldText,
    fontSize: "11px",
    cursor: "pointer",
    fontFamily: "monospace",
    textAlign: "left",
  },
  entityBtnActive: {
    background: "rgba(31,111,235,0.15)",
    border: "1px solid #1f6feb",
    color: "#79c0ff",
  },
  entityBtnCount: { fontSize: "9px", color: "#8b949e" },
  relationItem: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    fontSize: "10px",
    marginBottom: "6px",
  },
  relFrom:  { color: "#ffa657" },
  relArrow: { color: "#8b949e" },
  relTo:    { color: "#79c0ff" },
  tableTag: { fontSize: "9px", color: "#8b949e", marginBottom: "8px", marginTop: 0 },
  fieldRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "10px",
    padding: "3px 0",
    borderBottom: "1px solid #21262d",
  },
  fieldName: { color: COLORS.fieldText },
  fieldType: { fontSize: "9px" },
  sidebarFooter: {
    marginTop: "auto",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    borderTop: "1px solid #21262d",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid #30363d",
    color: "#8b949e",
    padding: "6px",
    borderRadius: "4px",
    fontSize: "10px",
    cursor: "pointer",
    fontFamily: "monospace",
  },
  canvas: {
    flex: 1,
    background: COLORS.bg,
    overflow: "hidden",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
    height: "100vh",
    background: COLORS.bg,
    color: COLORS.fieldText,
    fontFamily: "monospace",
    fontSize: "14px",
  },
  loadingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: COLORS.headerBg,
    animation: "pulse 1s infinite",
  },
};
