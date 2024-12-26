import { useState, useEffect } from 'react';
import {
  getNutritionalGuidelines,
  updateNutritionalGuidelines,
  getDietaryRestrictions,
  updateDietaryRestrictions,
  DEFAULT_GUIDELINES
} from '../lib/api/settings/index';
import type { NutritionalGuidelines, DietaryRestriction } from '../types';

export function useSettings() {
  const [guidelines, setGuidelines] = useState<NutritionalGuidelines>(DEFAULT_GUIDELINES);
  const [restrictions, setRestrictions] = useState<DietaryRestriction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSettings() {
      try {
        const [guidelinesRes, restrictionsRes] = await Promise.all([
          getNutritionalGuidelines(),
          getDietaryRestrictions()
        ]);

        if (!mounted) return;

        if (guidelinesRes.error) throw guidelinesRes.error;
        if (restrictionsRes.error) throw restrictionsRes.error;

        setGuidelines(guidelinesRes.data || DEFAULT_GUIDELINES);
        setRestrictions(restrictionsRes.data || []);
      } catch (err) {
        console.error('Failed to load settings:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load settings');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const saveSettings = async (
    newGuidelines: NutritionalGuidelines,
    newRestrictions: DietaryRestriction[]
  ) => {
    try {
      setError(null);

      const [guidelinesRes, restrictionsRes] = await Promise.all([
        updateNutritionalGuidelines(newGuidelines),
        updateDietaryRestrictions(newRestrictions)
      ]);

      if (guidelinesRes.error) throw guidelinesRes.error;
      if (restrictionsRes.error) throw restrictionsRes.error;

      setGuidelines(newGuidelines);
      setRestrictions(newRestrictions);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      return false;
    }
  };

  return {
    guidelines,
    restrictions,
    loading,
    error,
    saveSettings
  };
}