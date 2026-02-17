"use client";

import DeleteButton from "./DeleteButton";

interface ContactListProps {
  initialContacts: any[];
}

export default function ContactList({ initialContacts }: ContactListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {initialContacts.map((contact: any) => (
          <li key={contact.id} className="p-4 hover:bg-sky-50/30 transition-colors">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-bold text-gray-900 truncate">{contact.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(contact.created_at).toLocaleString('ja-JP')}
                  </span>
                </div>
                <div className="text-xs text-sky-600 mb-2">{contact.email}</div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {contact.message}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 pt-1">
                <DeleteButton id={contact.id} />
              </div>
            </div>
          </li>
        ))}
        {initialContacts.length === 0 && (
          <li className="p-12 text-center text-gray-400 text-sm">
            メッセージはまだありません。
          </li>
        )}
      </ul>
    </div>
  );
}
