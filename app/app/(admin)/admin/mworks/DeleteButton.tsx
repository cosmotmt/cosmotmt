"use client";

import { deleteMWork } from "./actions";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("本当にこの実績を削除してもよろしいですか？")) {
      startTransition(async () => {
        try {
          await deleteMWork(id);
        } catch (err: any) {
          alert(err.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
