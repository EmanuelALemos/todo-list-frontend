import { useState } from "react";
import { Board } from "../../@types/Board";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateBoard: (board: Board) => void;
}

export function NewBoardModal ({ isOpen, onClose, onCreateBoard }: ModalProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateBoard({ title, description });
        setTitle(""); 
        setDescription("");
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 ${isOpen ? "block" : "hidden"}`}
            onClick={onClose}
        >
            <div
                className="bg-gray-800 border border-slate-600 p-8 rounded-md w-96"
                onClick={(e) => e.stopPropagation()} // Impede que o clique fora do modal feche-o
            >
                <h2 className="text-xl font-semibold mb-4">Criar novo Quadro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400">Título *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-900 border border-slate-600 text-white placeholder-gray-400 rounded-lg w-full pl-2 pr-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400">Descrição</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-900 border border-slate-600 text-white placeholder-gray-400 rounded-lg w-full pl-2 pr-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
                        >
                            Criar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};