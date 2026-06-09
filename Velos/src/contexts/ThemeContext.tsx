/**
 * Theme access hook.
 *
 * The theme now lives in the Redux store (`state.theme.theme`) and is persisted
 * to localStorage so it survives a refresh — see `store/themeSlice.ts`.
 * This file keeps the original `useTheme()` API so existing call sites work
 * unchanged; there is no React Context / Provider anymore.
 */
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme as toggleThemeAction, setTheme as setThemeAction } from '../store/themeSlice';
import type { Theme } from '../store/themeSlice';

export const useTheme = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const dispatch = useAppDispatch();

  return {
    theme,
    toggleTheme: () => dispatch(toggleThemeAction()),
    setTheme: (next: Theme) => dispatch(setThemeAction(next)),
  };
};
