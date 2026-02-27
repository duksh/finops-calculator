(function (global) {
  'use strict';

  const MODE_STORAGE_KEY = 'ficecal.ui.mode';
  const FEATURE_OVERRIDE_STORAGE_KEY = 'ficecal.feature.overrides';

  const FALLBACK_CATALOG = {
    version: '1.0.0',
    generatedAt: '2026-02-23',
    runtime: {
      defaultMode: 'quick',
      modes: ['quick', 'operator', 'architect']
    },
    features: [
      {
        id: 'core-economics',
        manifestPath: 'src/features/core-economics/feature.json',
        enabled: true,
        required: true
      },
      {
        id: 'multi-tech-normalization',
        manifestPath: 'src/features/multi-tech-normalization/feature.json',
        enabled: true,
        required: false
      },
      {
        id: 'ai-token-economics',
        manifestPath: 'src/features/ai-token-economics/feature.json',
        enabled: true,
        required: false
      },
      {
        id: 'sla-slo-sli-economics',
        manifestPath: 'src/features/sla-slo-sli-economics/feature.json',
        enabled: true,
        required: false
      },
      {
        id: 'agent-orchestration',
        manifestPath: 'src/features/agent-orchestration/feature.json',
        enabled: true,
        required: false
      }
    ]
  };

  const FALLBACK_MANIFESTS = {
    'core-economics': { id: 'core-economics', status: 'active' },
    'multi-tech-normalization': { id: 'multi-tech-normalization', status: 'active' },
    'ai-token-economics': { id: 'ai-token-economics', status: 'experimental' },
    'sla-slo-sli-economics': { id: 'sla-slo-sli-economics', status: 'experimental' },
    'agent-orchestration': { id: 'agent-orchestration', status: 'experimental' }
  };

  function getStoredFeatureOverrides() {
    try {
      if (!global.localStorage) return {};
      const raw = global.localStorage.getItem(FEATURE_OVERRIDE_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};
      const normalized = {};
      Object.keys(parsed).forEach((featureId) => {
        if (typeof parsed[featureId] === 'boolean') normalized[featureId] = parsed[featureId];
      });
      return normalized;
    } catch (_) {
      return {};
    }
  }

  function storeFeatureOverrides(overrides) {
    try {
      if (!global.localStorage) return;
      global.localStorage.setItem(FEATURE_OVERRIDE_STORAGE_KEY, JSON.stringify(overrides || {}));
    } catch (_) {
      // Ignore storage failures (privacy mode / restricted context).
    }
  }

  const runtimeState = {
    catalog: FALLBACK_CATALOG,
    manifests: { ...FALLBACK_MANIFESTS },
    mode: (FALLBACK_CATALOG.runtime && FALLBACK_CATALOG.runtime.defaultMode) || 'quick',
    featureOverrides: getStoredFeatureOverrides()
  };

  function getRuntimeModes() {
    const modes = runtimeState.catalog && runtimeState.catalog.runtime && runtimeState.catalog.runtime.modes;
    if (!Array.isArray(modes) || !modes.length) return ['quick', 'operator', 'architect'];
    return modes;
  }

  function getDefaultMode() {
    const defaultMode = runtimeState.catalog && runtimeState.catalog.runtime && runtimeState.catalog.runtime.defaultMode;
    const modes = getRuntimeModes();
    return modes.includes(defaultMode) ? defaultMode : modes[0];
  }

  function normalizeMode(mode) {
    const modes = getRuntimeModes();
    return modes.includes(mode) ? mode : getDefaultMode();
  }

  function getStoredMode() {
    try {
      if (!global.localStorage) return null;
      return global.localStorage.getItem(MODE_STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function storeMode(mode) {
    try {
      if (!global.localStorage) return;
      global.localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (_) {
      // Ignore storage failures (privacy mode / restricted context).
    }
  }

  function getMode() {
    return runtimeState.mode || getDefaultMode();
  }

  function setMode(mode, options) {
    const opts = options || {};
    const persist = opts.persist !== false;
    const normalized = normalizeMode(mode);
    runtimeState.mode = normalized;
    if (persist) storeMode(normalized);
    return normalized;
  }

  function getCatalogFeatures() {
    const features = runtimeState.catalog && runtimeState.catalog.features;
    return Array.isArray(features) ? features : [];
  }

  function findCatalogEntry(featureId) {
    return getCatalogFeatures().find((entry) => entry && entry.id === featureId) || null;
  }

  function getDefaultFeatureEnabled(entry) {
    if (!entry) return false;
    if (entry.required) return true;
    return entry.enabled !== false;
  }

  function normalizeFeatureOverrides() {
    const overrides = runtimeState.featureOverrides || {};
    const normalized = {};
    getCatalogFeatures().forEach((entry) => {
      if (!entry || !entry.id || entry.required) return;
      const override = overrides[entry.id];
      if (typeof override !== 'boolean') return;
      const defaultEnabled = getDefaultFeatureEnabled(entry);
      if (override === defaultEnabled) return;
      normalized[entry.id] = override;
    });
    runtimeState.featureOverrides = normalized;
    storeFeatureOverrides(normalized);
  }

  function isManifestDisabled(featureId) {
    const manifest = runtimeState.manifests[featureId];
    if (!manifest || typeof manifest !== 'object') return false;
    const status = String(manifest.status || '').toLowerCase();
    return status === 'disabled';
  }

  function isFeatureModeEnabled(featureId, mode) {
    const manifest = runtimeState.manifests[featureId];
    if (!manifest || !Array.isArray(manifest.uiModes) || !manifest.uiModes.length) return true;
    return manifest.uiModes.includes(mode);
  }

  function isFeatureEnabled(featureId) {
    const entry = findCatalogEntry(featureId);
    if (!entry) return false;
    if (isManifestDisabled(featureId)) return false;
    if (entry.required) return true;
    const override = runtimeState.featureOverrides && runtimeState.featureOverrides[featureId];
    if (typeof override === 'boolean') return override;
    return getDefaultFeatureEnabled(entry);
  }

  function setFeatureEnabled(featureId, enabled, options) {
    const entry = findCatalogEntry(featureId);
    if (!entry || entry.required) return false;

    const opts = options || {};
    const persist = opts.persist !== false;
    const next = { ...(runtimeState.featureOverrides || {}) };
    const desired = Boolean(enabled);
    const defaultEnabled = getDefaultFeatureEnabled(entry);

    if (desired === defaultEnabled) delete next[featureId];
    else next[featureId] = desired;

    runtimeState.featureOverrides = next;
    if (persist) storeFeatureOverrides(next);
    return true;
  }

  function getFeatureOverrides() {
    return { ...(runtimeState.featureOverrides || {}) };
  }

  function resetFeatureOverrides(options) {
    const opts = options || {};
    const persist = opts.persist !== false;
    runtimeState.featureOverrides = {};
    if (persist) storeFeatureOverrides({});
    return true;
  }

  function getEnabledFeatureIds() {
    return getCatalogFeatures()
      .filter((entry) => entry && isFeatureEnabled(entry.id))
      .map((entry) => entry.id);
  }

  function isModeAllowedForNode(node, mode) {
    const attr = node.getAttribute('data-ui-mode');
    if (!attr) return true;
    const allowed = attr
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    if (!allowed.length) return true;
    return allowed.includes(mode);
  }

  function applyDomGates(root) {
    const scope = root || global.document;
    if (!scope || typeof scope.querySelectorAll !== 'function') return;

    const activeMode = getMode();
    const nodes = scope.querySelectorAll('[data-feature], [data-ui-mode]');
    nodes.forEach((node) => {
      let visible = true;

      const featureId = node.getAttribute('data-feature');
      if (featureId) {
        const enabled = isFeatureEnabled(featureId) && isFeatureModeEnabled(featureId, activeMode);
        node.setAttribute('data-feature-enabled', enabled ? '1' : '0');
        visible = visible && enabled;
      }

      const modeAllowed = isModeAllowedForNode(node, activeMode);
      node.setAttribute('data-mode-allowed', modeAllowed ? '1' : '0');
      visible = visible && modeAllowed;

      node.hidden = !visible;
    });
  }

  async function loadManifest(manifestPath) {
    if (typeof fetch !== 'function') return null;
    const res = await fetch(manifestPath, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  }

  async function loadCatalog() {
    if (typeof fetch !== 'function') return false;

    try {
      const res = await fetch('src/features/feature-catalog.json', { cache: 'no-store' });
      if (!res.ok) return false;
      const nextCatalog = await res.json();
      if (!nextCatalog || !Array.isArray(nextCatalog.features)) return false;

      runtimeState.catalog = nextCatalog;

      const manifests = {};
      await Promise.all(nextCatalog.features.map(async (entry) => {
        if (!entry || !entry.id || !entry.manifestPath) return;
        try {
          const manifest = await loadManifest(entry.manifestPath);
          if (manifest) manifests[entry.id] = manifest;
        } catch (_) {
          // Keep fallback behavior for missing/corrupt manifest fetch.
        }
      }));

      runtimeState.manifests = {
        ...FALLBACK_MANIFESTS,
        ...manifests
      };

      const preferredMode = getStoredMode() || runtimeState.mode || nextCatalog.runtime?.defaultMode;
      runtimeState.mode = normalizeMode(preferredMode);
      storeMode(runtimeState.mode);
      normalizeFeatureOverrides();

      return true;
    } catch (_) {
      return false;
    }
  }

  runtimeState.mode = normalizeMode(getStoredMode() || runtimeState.mode);
  normalizeFeatureOverrides();

  global.FiceCalFeatureRuntime = {
    getCatalog: function () {
      return runtimeState.catalog;
    },
    getManifests: function () {
      return runtimeState.manifests;
    },
    getModes: getRuntimeModes,
    getDefaultMode,
    getMode,
    setMode,
    getFeatureOverrides,
    setFeatureEnabled,
    resetFeatureOverrides,
    isFeatureEnabled,
    getEnabledFeatureIds,
    applyDomGates,
    loadCatalog
  };
})(typeof window !== 'undefined' ? window : globalThis);
