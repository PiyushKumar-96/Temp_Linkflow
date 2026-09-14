'use client';

import React, { useState } from 'react';

const PROVIDER_OPTIONS = [
  { id: 'openai', name: 'OpenAI', requiresBaseUrl: false },
  { id: 'anthropic', name: 'Anthropic', requiresBaseUrl: false },
  { id: 'google', name: 'Google Gemini', requiresBaseUrl: false },
  { id: 'other', name: 'Other (OpenAI-compatible endpoint)', requiresBaseUrl: true },
];

function maskApiKey(key) {
  if (!key) return '';
  const lastFour = key.slice(-4);
  return `••••-${lastFour}`;
}

export default function AIProvidersTab({
  providers = [],
  defaultProviderId,
  onSaveProvider,
  onRemoveProvider,
  onSetDefaultProvider,
}) {
  const [showForm, setShowForm] = useState(false);
  const [providerType, setProviderType] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [modelId, setModelId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [formError, setFormError] = useState('');

  const selectedOption = PROVIDER_OPTIONS.find((p) => p.id === providerType);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setFormError('API key is required.');
      return;
    }
    if (!modelId.trim()) {
      setFormError('Model identifier is required.');
      return;
    }
    if (selectedOption?.requiresBaseUrl && !baseUrl.trim()) {
      setFormError('Base URL is required for custom endpoints.');
      return;
    }

    const newProvider = {
      id: `prov-${Date.now()}`,
      providerType,
      providerName: selectedOption?.name || 'Custom provider',
      apiKey: apiKey.trim(),
      modelId: modelId.trim(),
      baseUrl: selectedOption?.requiresBaseUrl ? baseUrl.trim() : '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveProvider(newProvider);
    setApiKey('');
    setModelId('');
    setBaseUrl('');
    setFormError('');
    setShowForm(false);
  };

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* List Area / Empty State */}
      {providers.length === 0 ? (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p>Register an AI provider and API key to use custom models for post generation.</p>
          <p>Without a configured provider, the post generator uses built-in sample content.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {providers.map((p) => {
            const isDefault = p.id === defaultProviderId;
            return (
              <div
                key={p.id}
                className="py-3 flex items-center justify-between gap-4 flex-wrap text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-600 text-foreground">{p.providerName}</span>
                    <span className="font-mono text-muted-foreground">({p.modelId})</span>
                    {isDefault && (
                      <span className="text-[11px] text-muted-foreground font-500">(Default)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Key: {maskApiKey(p.apiKey)}</span>
                    {p.baseUrl && <span>Base URL: {p.baseUrl}</span>}
                    <span>Added: {p.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefaultProvider(p.id)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveProvider(p.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Provider Action / Collapsible Form */}
      {!showForm ? (
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-secondary text-xs"
          >
            + Add provider
          </button>
        </div>
      ) : (
        <div className="pt-4 border-t border-border flex flex-col gap-4">
          <h2 className="text-sm font-600 text-foreground">Add provider</h2>

          {formError && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
              {formError}
            </div>
          )}

          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-600 text-foreground block mb-1">Provider</label>
                <select
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value)}
                  className="input-base text-xs py-1.5 px-2.5 h-9 font-500 w-full"
                >
                  {PROVIDER_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-600 text-foreground block mb-1">Model identifier</label>
                <input
                  type="text"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  placeholder="e.g. gpt-4o, claude-3-5-sonnet-20241022, gemini-1.5-pro"
                  className="input-base text-xs py-1.5 px-2.5 h-9 w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-600 text-foreground block mb-1">API key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter provider API key"
                className={`input-base text-xs py-1.5 px-2.5 h-9 w-full ${apiKey ? 'font-mono' : ''}`}
              />
            </div>

            {selectedOption?.requiresBaseUrl && (
              <div>
                <label className="text-xs font-600 text-foreground block mb-1">Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.your-endpoint.com/v1"
                  className="input-base text-xs py-1.5 px-2.5 h-9 w-full"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button type="submit" className="btn-secondary text-xs px-3.5 py-1.5">
                Add provider
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 bg-transparent border-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

