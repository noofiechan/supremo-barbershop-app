'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HAIRCUT_OPTIONS, CUSTOM_HAIRCUT } from '@/lib/constants';

interface HaircutSelectorProps {
  onSelect: (haircut: any) => void;
  selectedId?: string;
}

export function HaircutSelector({ onSelect, selectedId }: HaircutSelectorProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customData, setCustomData] = useState({
    name: '',
    description: '',
    picture: null as File | null,
  });

  const handleCustomSubmit = () => {
    if (!customData.name) {
      alert('Please enter a custom haircut name');
      return;
    }
    onSelect({
      id: 'custom',
      name: customData.name,
      description: customData.description,
      picture: customData.picture,
    });
    setShowCustom(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select Haircut Style</h3>
      
      {/* Preset Options */}
      <div className="grid gap-3">
        {HAIRCUT_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all ${
              selectedId === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-400'
            }`}
            onClick={() => onSelect(option)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{option.name}</CardTitle>
              <CardDescription className="text-sm">
                {option.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Custom Option */}
      <Card className={`cursor-pointer transition-all ${
        selectedId === 'custom' ? 'border-blue-500 bg-blue-50' : ''
      }`}>
        <CardHeader
          className="pb-2"
          onClick={() => {
            setShowCustom(!showCustom);
            if (!showCustom) {
              onSelect(CUSTOM_HAIRCUT);
            }
          }}
        >
          <CardTitle className="text-base">{CUSTOM_HAIRCUT.name}</CardTitle>
          <CardDescription className="text-sm">
            {CUSTOM_HAIRCUT.description}
          </CardDescription>
        </CardHeader>

        {showCustom && selectedId === 'custom' && (
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Haircut Name</label>
              <Input
                placeholder="e.g., Fade with Design"
                value={customData.name}
                onChange={(e) =>
                  setCustomData({ ...customData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                placeholder="Describe the haircut or style you want"
                value={customData.description}
                onChange={(e) =>
                  setCustomData({ ...customData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reference Picture (Optional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCustomData({
                    ...customData,
                    picture: e.target.files?.[0] || null,
                  })
                }
              />
              {customData.picture && (
                <p className="mt-1 text-xs text-gray-600">
                  ✓ {customData.picture.name}
                </p>
              )}
            </div>

            <Button
              onClick={handleCustomSubmit}
              className="w-full"
              size="sm"
            >
              Confirm Custom Style
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
