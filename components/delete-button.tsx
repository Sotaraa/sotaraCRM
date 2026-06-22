"use client";

export function DeleteButton({ confirmText = "Delete this? This can't be undone." }: { confirmText?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="text-xs text-stone-400 transition-colors hover:text-red-600"
    >
      Delete
    </button>
  );
}
