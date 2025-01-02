
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function ConfirmDeleteModal({ isOpen, onClose, onDelete }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
      <div className="bg-gray-800 border border-slate-600 p-8 rounded-md w-96">
        <h3 className="text-xl mb-4">Tem certeza que deseja fazer essa ação ?</h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
