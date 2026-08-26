export function mountThemeToggler(parent) {
  if (!(parent instanceof HTMLElement)) {
    console.error(
      "[ThemeToggler Error]: No se encontró un contenedor válido para montar el componente.",
    );
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button--ghost button--xl-icon";
  const icon = document.createElement("img");
  icon.alt = "";
  button.append(icon);

  const updateUI = () => {
    const isDark = document.documentElement.classList.contains("dark");

    icon.src = isDark ? "/images/icons/sun.svg" : "/images/icons/moon.svg";

    button.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
    );
  };

  button.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);

    updateUI();
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (event) => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
      const newSystemTheme = event.matches ? "dark" : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newSystemTheme);
      updateUI();
    }
  });

  updateUI();
  parent.prepend(button);
}