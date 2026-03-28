"use client";

import { useState, useEffect, useRef } from 'react';

interface RateData {
  rate: number;
  effective: number;
  updatedAt: number;
  source: 'awesome' | 'host' | 'cached';
}

const CACHE_KEY = 'fx-rate-cache';
const RATE_REFRESH_INTERVAL = 30000;

export const useFXRate = () => {
  const [rateData, setRateData] = useState<RateData>({
    rate: 5.50,
    effective: 5.55,
    updatedAt: Date.now(),
    source: 'cached',
  });

  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const isTabVisible = useRef(true);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        setRateData((prev) => ({
          ...prev,
          rate: parsedCache.rate,
          effective: parsedCache.rate * 1.0,
          updatedAt: parsedCache.updatedAt,
          source: 'cached',
        }));
      }
    } catch {}
  }, []);

  const fetchRate = async (): Promise<number | null> => {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      if (res.ok) {
        const data = await res.json();
        const rate = parseFloat(data.USDBRL.bid);
        if (rate && rate > 0) return rate;
      }
    } catch {}

    try {
      const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL');
      if (res.ok) {
        const data = await res.json();
        const rate = parseFloat(data.rates.BRL);
        if (rate && rate > 0) return rate;
      }
    } catch {}

    return null;
  };

  const updateRate = async () => {
    setIsLoading(true);
    const newRate = await fetchRate();

    if (newRate) {
      const effective = newRate * 1.0;
      const updatedData = {
        rate: newRate,
        effective,
        updatedAt: Date.now(),
        source: 'awesome' as const,
      };
      setRateData((prev) => ({ ...prev, ...updatedData }));
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(updatedData));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
      if (isTabVisible.current) updateRate();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateRate();
    intervalRef.current = setInterval(() => {
      if (isTabVisible.current) updateRate();
    }, RATE_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secondsSince = Math.floor((Date.now() - rateData.updatedAt) / 1000);

  return { rateData, isLoading, secondsSince };
};
