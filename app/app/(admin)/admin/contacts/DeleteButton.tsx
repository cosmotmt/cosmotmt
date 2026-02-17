"use client";

import { deleteContact } from "./actions";
import { useTransition } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("このメッセージを削除しますか？")) {
      startTransition(async () => {
        try {
          await deleteContact(id);
        } catch (err: any) {
          alert("削除に失敗しました。");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors cursor-pointer"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
