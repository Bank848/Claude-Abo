// Code-unit order: the same on every machine. localeCompare follows the OS locale, so generated files drifted in CI.
export const byText = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
