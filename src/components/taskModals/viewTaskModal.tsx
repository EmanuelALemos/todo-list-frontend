import { Task } from '../../@types/Task';
import { format } from 'date-fns';
import { GoX } from 'react-icons/go';

interface ViewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
}

export function ViewTaskModal({ isOpen, onClose, task }: ViewTaskModalProps) {
    if (!isOpen || !task) return null;

    const formattedDate = new Date(task.due_date);
    formattedDate.setHours(formattedDate.getHours() + formattedDate.getTimezoneOffset() / 60);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 border border-slate-600 p-8 rounded-md w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    <GoX size={24} />
                </button>
                <h2 className="text-xl font-bold text-white text-center mb-4">Detalhes da Tarefa</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-gray-400">Título:</h3>
                        <p className="text-white break-words">{task.title}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-400">Descrição:</h3>
                        <p className="text-white break-words">{task.description || 'Sem descrição.'}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-400">Prioridade:</h3>
                        <p className="text-white">
                            {task.priority === 1 ? 'Alta' : task.priority === 2 ? 'Média' : 'Baixa'}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-gray-400">Data de Término:</h3>
                        <p className="text-white">{format(formattedDate, 'dd/MM/yyyy')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
