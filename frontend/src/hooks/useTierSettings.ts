import { useEffect, useState, useMemo, useContext } from 'react';
import { tierSettings } from '@/helpers';
import { AuthContext } from '@/pages/_app';
import { useRouter } from 'next/router';

// Update interface to match API response
interface TierSettings {
  // Current usage counts
  csc: number;  // current search count
  cec: number;  // current export count
  cel: number;  // current export limit
  caa: string;  // current api access

  // Tier limits
  tsc: number;  // tier search limit
  tel: number;  // tier export limit
  tef: string[];  // tier export formats
  tdb: string[];  // tier database columns
  taa: boolean;  // tier allow copy
  tae: boolean;  // tier allow export
}

export function useTierSettings() {
  const [settings, setSettings] = useState<TierSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await tierSettings();
        if (isMounted) {
          setSettings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch tier settings'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Only fetch if user is logged in
    if (isLoggedIn) {
      fetchSettings();
    }
    if (location.search.includes("demo=true") || router.pathname === "/demo") {
      setSettings({
        csc: 1,
        cec: 0,
        cel: 0,
        caa: "community",
        tsc: 10,
        tel: 1,
        tef: ["csv"],
        tdb: ["*"],
        taa: false,
        tae: true
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Move transformed settings to useMemo
  const transformedSettings = useMemo(() => {
    if (!settings) return null;
    let allowExport = settings.tae;
    if (settings.tel !== 0) allowExport = allowExport && settings.cec < settings.tel;

    return {
      searchLimit: settings.tsc,
      currentSearchCount: settings.csc,
      exportLimit: settings.tel,
      currentExportCount: settings.cec,
      apiAccess: settings.caa as "none" | "limited" | "unlimited",
      allowedDataColumns: settings.tdb,
      allowCopy: settings.taa,
      allowExport: allowExport,
      allowedExportTypes: settings.tef,
      currentExportLimit: settings.cel,
    };
  }, [settings]);

  return {
    settings: transformedSettings,
    rawSettings: settings,
    isLoading,
    error
  };
}