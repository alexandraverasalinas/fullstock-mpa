import { z } from "zod";

function showError(container, message) {
  container.classList.add("input-field--error");
  const span = document.createElement("span");
  span.className = "input-field__error";
  span.textContent = message;
  container.append(span);
}

function clearError(container) {
  container.classList.remove("input-field--error");
  const span = container.querySelector(".input-field__error");
  if (span) span.remove();
}

export function setupValidation(form, schema) {
  if (!form) return;

  form.setAttribute("novalidate", "");

  const touchedFields = new Set();

  function validate() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const result = schema.safeParse(data);

    const allInputs = form.querySelectorAll("input, select, textarea");
    allInputs.forEach((input) => {
      if (touchedFields.has(input.name)) {
        const container = input.closest(".input-field");
        if (container) clearError(container);
      }
    });

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;

      Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
        if (touchedFields.has(fieldName)) {
          const input = form.querySelector(`[name="${fieldName}"]`);
          if (input) {
            const container = input.closest(".input-field");
            if (container) showError(container, messages[0]);
          }
        }
      });
    }

    return result;
  }

  form.addEventListener("focusout", (e) => {
    if (!e.target.name) return;
    touchedFields.add(e.target.name);
    validate();
  });

  form.addEventListener("input", (e) => {
    if (!e.target.name) return;
    if (touchedFields.has(e.target.name)) {
      validate();
    }
  });

  form.addEventListener("submit", (e) => {
    const allInputs = form.querySelectorAll("input, select, textarea");
    allInputs.forEach((input) => {
      if (input.name) touchedFields.add(input.name);
    });

    const result = validate();

    if (!result.success) {
      e.preventDefault();

      const firstError = form.querySelector(".input-field--error input, .input-field--error select");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}
