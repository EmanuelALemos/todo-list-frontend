import { GoCircle, GoKebabHorizontal, GoPlus } from "react-icons/go";
import { TaskCard } from "./taskCard";
import { Column } from "../@types/Column";
import { useEffect, useRef, useState } from "react";
import { Task } from "../@types/Task";
import { TaskService } from "../services/taskService";
import { NewTaskModal } from "./taskModals/newTaskModal";
import { ToggleMenu } from "./toggleMenu";

import { useParams } from "react-router-dom";
import { EditTaskModal } from "./taskModals/editTaskModal";
import { ConfirmDeleteModal } from "./confirmDeleteModal";

import { useDrop } from "react-dnd";

const ITEM_TYPE = 'TASK';

interface ColumnBoardProps {
    column: Column;
    onEdit: (column: Column) => void;
    onDelete: (column: Column) => void;
}

export function ColumnBoard({ column, onEdit, onDelete }: ColumnBoardProps) {

    const { boardId } = useParams<{ boardId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isTaskModalOpen, setTaskModalOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const columnColor: Record<string, string> = {
        "gray": "bg-gray-500/20 text-gray-500",
        "blue": "bg-blue-500/20 text-blue-500",
        "green": "bg-green-500/20 text-green-500",
        "yellow": "bg-yellow-500/20 text-yellow-500",
        "orange": "bg-orange-500/20 text-orange-500",
        "red": "bg-red-500/20 text-red-500",
        "purple": "bg-purple-500/20 text-purple-500",
    }

    const style = columnColor[column.color]

    const [{ isOver, item }, drop] = useDrop({
        accept: ITEM_TYPE,
        drop: (item: { taskId: number, columnId: number }) => {

            moveTask(item.taskId, item.columnId, column.id);

        },
        collect: (monitor) => {
            return {
                isOver: monitor.isOver(),
                item: monitor.getItem(),
            };
        },
    });

    const handleMenuToggle = (columnId: number) => {
        setIsMenuOpen(isMenuOpen === columnId ? null : columnId);
    };

    const loadTasks = async () => {
        if (!boardId) return;
        try {
            const tasksData = await TaskService.getAllTasks(Number(boardId), column.id);
            setTasks(tasksData || []);
        } catch (error) {
            console.error("Error loading tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async (newTaskData: Omit<Task, 'id'>) => {
        try {
            const newTask = await TaskService.createTask(Number(boardId), column.id, newTaskData);
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setTaskModalOpen(false);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setEditModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask: Task) => {
        if (!boardId) return;

        try {
            const savedTask = await TaskService.updateTask(Number(boardId), column.id, updatedTask.id, updatedTask);
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === savedTask.id ? savedTask : task))
            );
            setEditModalOpen(false);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const moveTask = async (taskId: number, sourceColumnId: number, destinationColumnId: number) => {
        try {

            const movedTask = await TaskService.moveTask(Number(boardId), sourceColumnId, taskId, destinationColumnId);

            if (destinationColumnId === column.id) {
                setTasks((prevTasks) => [...prevTasks, movedTask]);
            }
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!boardId || !taskToDelete) return;

        try {
            await TaskService.deleteTask(Number(boardId), column.id, taskToDelete.id);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
            setDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const openDeleteModal = (task: Task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const refreshTasks = (state: boolean) => {
        setRefresh(state);
    };

    useEffect(() => {
        if (item) {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== item.taskId));

        }
    }, [item]);

    useEffect(() => {
        if (refresh) {
            loadTasks();
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        loadTasks();
    }, [column.id]);

    return (
        <div
            ref={drop}
            className={`flex flex-col w-[25vw] h-[75vh] bg-slate-950 rounded-md border border-slate-600 ${isOver ? 'bg-gray-700' : ''}`}
        >

            <header className="px-4 pt-4">
                <div className="flex items-center justify-between">

                    <div className="flex flex-row items-center space-x-2">
                        <GoCircle className={`rounded-full ${style}`} size={24} />

                        <h2 className="text-xl font-semibold">{column.title}</h2>

                        <span className="text-gray-400 text-xs bg-slate-800 rounded-full h-4 px-2 flex items-center justify-center">
                            {tasks.length}
                        </span>
                    </div>

                    <button
                        ref={menuButtonRef}
                        onClick={() => handleMenuToggle(column.id)}
                        className="text-gray-400 hover:bg-gray-700 rounded-md px-2 py-1"
                    >
                        <GoKebabHorizontal className="inline-block" size={24} />
                    </button>

                </div>
                <p className="text-slate-700 truncate">{column.description}</p>
            </header>


            <div className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando tarefas...</p>
                ) : (
                    tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                {...task}
                                onEdit={handleEditTask}
                                onDelete={() => openDeleteModal(task)}
                                onRefresh={refreshTasks}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Essa coluna ainda não tem nenhuma tarefa.</p>
                    )
                )}
            </div>


            <footer className="bg-slate-950 rounded-md">
                <button
                    onClick={() => setTaskModalOpen(true)}
                    className="w-full hover:bg-slate-800 text-slate-400 text-start items-center py-2 px-4 max-h-10 text-nowrap rounded"
                >
                    <GoPlus className="inline-block mr-2" size={24} />
                    Adicionar tarefa
                </button>
            </footer>

            <NewTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onSave={handleSaveTask}
            />

            {isMenuOpen === column.id && (
                <ToggleMenu
                    data={column}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    setIsMenuOpen={setIsMenuOpen}
                    anchorRef={menuButtonRef}
                />
            )}

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleUpdateTask}
                task={taskToEdit}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleDeleteTask}
            />
        </div>

    );
}