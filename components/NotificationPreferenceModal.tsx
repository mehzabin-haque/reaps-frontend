// components/NotificationPreferenceModal.tsx
'use client';

import { useState } from 'react';

interface NotificationPreferenceModalProps {
  onSave: (prefersNotifications: boolean) => void;
}

export default function NotificationPreferenceModal({ onSave }: NotificationPreferenceModalProps) {
  const [choice, setChoice] = useState<boolean | null>(null);

  const handleSave = () => {
    if (choice !== null) {
      onSave(choice);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Enable Notifications</h2>
        <p className="mb-6">Would you like to receive notifications?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setChoice(false)}
            className={`px-4 py-2 rounded-md ${
              choice === false ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            No
          </button>
          <button
            onClick={() => setChoice(true)}
            className={`px-4 py-2 rounded-md ${
              choice === true ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Yes
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            disabled={choice === null}
          >
            Save Preference
          </button>
        </div>
      </div>
    </div>
  );
}
