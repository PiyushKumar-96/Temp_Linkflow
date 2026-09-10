'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplatesHeader from './TemplatesHeader';
import TemplatesGrid from './TemplatesGrid';
import TemplateEditModal from './TemplateEditModal';

import { TEMPLATES } from '@/temp-backend/data/templates';

const mockTemplates = TEMPLATES;

const allCategories = ['All', ...Array.from(new Set(mockTemplates.map((t) => t.category)))];

export default function TemplatesShell() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(mockTemplates);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = templates.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSave = (tpl) => {
    // BACKEND: POST /api/templates or PATCH /api/templates/:id
    if (templates.find((t) => t.id === tpl.id)) {
      setTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)));
    } else {
      setTemplates((prev) => [...prev, tpl]);
    }
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    // BACKEND: DELETE /api/templates/:id
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDuplicate = (tpl) => {
    const dup = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      usageCount: 0,
      lastUsed: '—',
      isDefault: false,
    };
    setTemplates((prev) => [...prev, dup]);
  };

  return (
    <div className="flex flex-col gap-5">
      <TemplatesHeader
        categories={allCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
        totalCount={filtered.length}
        onCreateNew={() => setIsCreating(true)}
      />

      <TemplatesGrid
        templates={filtered}
        onEdit={setEditingTemplate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onUse={(tpl) => {
          // Navigate to composer with template pre-filled
          navigate('/post-creation-composer', { state: { template: tpl } });
        }}
      />

      {(editingTemplate || isCreating) && (
        <TemplateEditModal
          template={
            editingTemplate || {
              id: `tpl-${Date.now()}`,
              name: '',
              category: 'Thought Leadership',
              description: '',
              body: '',
              tone: 'professional',
              hashtags: [],
              usageCount: 0,
              lastUsed: '—',
              author: 'Sarah Reeves',
              authorInitials: 'SR',
              isDefault: false,
            }
          }
          onSave={handleSave}
          onClose={() => {
            setEditingTemplate(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
