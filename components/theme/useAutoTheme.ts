"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Calcola l'ora di alba e tramonto usando la Solar Noon approximation.
 * Returns hours (0–24) in local time.
 */
function getSunTimes(lat: number, lon: number): { sunrise: number; sunset: number } {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Approssimazione solar noon (gradi)
  const B = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180;
  const eqOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const solarNoon = 720 - 4 * lon - eqOfTime; // minuti UTC

  const latRad = (lat * Math.PI) / 180;
  const decl =
    (23.45 * Math.PI) / 180 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const hourAngle =
    (Math.acos(
      (Math.cos((90.833 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decl)) /
        (Math.cos(latRad) * Math.cos(decl))
    ) *
      180) /
    Math.PI;

  const sunriseUTC = (solarNoon - 4 * hourAngle) / 60; // ore UTC
  const sunsetUTC = (solarNoon + 4 * hourAngle) / 60;  // ore UTC

  // Converti in ora locale
  const offsetHours = -now.getTimezoneOffset() / 60;
  return {
    sunrise: sunriseUTC + offsetHours,
    sunset: sunsetUTC + offsetHours,
  };
}

function isDaytime(lat: number, lon: number): boolean {
  const { sunrise, sunset } = getSunTimes(lat, lon);
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;
  return nowHour >= sunrise && nowHour < sunset;
}

export function useAutoTheme() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Solo se l'utente NON ha scelto esplicitamente un tema
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("portfolio-theme");
    if (stored && stored !== "system") return; // rispetta la preferenza esplicita

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const day = isDaytime(coords.latitude, coords.longitude);
        setTheme(day ? "light" : "dark");
      },
      () => {
        // Se la geolocalizzazione è negata, usa l'orario locale
        // Tramonto approssimato alle 20:00, alba alle 6:00
        const hour = new Date().getHours();
        setTheme(hour >= 6 && hour < 20 ? "light" : "dark");
      }
    );

    // Aggiorna ogni 10 minuti
    const interval = setInterval(() => {
      const stored2 = localStorage.getItem("portfolio-theme");
      if (stored2 && stored2 !== "system") return;
      const hour = new Date().getHours();
      setTheme(hour >= 6 && hour < 20 ? "light" : "dark");
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setTheme, theme]);
}
