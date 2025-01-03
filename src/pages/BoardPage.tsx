import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ColumnBoard } from "../components/colunmBoard";
import { GoPlus, GoArrowLeft } from "react-icons/go";
import { Column } from "../@types/Column";
import { useEffect, useState } from "react";
import { NewColumnModal } from "../components/columnModals/newColumnModal";
import { ColumnService } from "../services/columnService";
import { EditColumnModal } from "../components/columnModals/editColumnModal";
import { ConfirmDeleteModal } from "../components/confirmDeleteModal";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BoardService } from "../services/boardService";

export function BoardPage() {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [boardName, setBoardName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [columns, setColumns] = useState<Column[]>([]);
    const [editingColumn, setEditingColumn] = useState<Column | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState<Column | null>(null);

    const handleSaveColumn = async (column: Omit<Column, 'id'>) => {
        try {
            const newColumn = await ColumnService.createColumn(Number(boardId), column);
            setColumns((prevColumns) => [...prevColumns, newColumn]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving column:", error);
        }
    };

    const handleEditColumn = (column: Column) => {
        setEditingColumn(column);
        setIsEditModalOpen(true);
    };

    const handleUpdateColumn = async (updatedColumn: Column) => {
        try {

            await ColumnService.updateColumn(Number(boardId), updatedColumn.id, updatedColumn);
            setColumns((prevColumns) => prevColumns.map((column) =>
                column.id === updatedColumn.id ? updatedColumn : column
            ));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating column:", error);
        }
    };

    const handleDeleteColumn = async (columnId: number) => {
        try {
            if (columnId && boardId) {
                await ColumnService.deleteColumn(Number(boardId), columnId);
                setColumns((prevColumns) => prevColumns.filter((column) => column.id !== columnId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Error deleting column:", error);
        }
    };

    const openDeleteModal = (column: Column) => {
        setColumnToDelete(column);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        const fetchBoardDetails = async () => {
            try {
                if (boardId) {
                    const board = await BoardService.getBoardById(Number(boardId));
                    setBoardName(board.title);
                }
            } catch (error) {
                console.error("Error fetching board details:", error);
            }
        };

        const fetchColumns = async () => {
            try {
                if (boardId) {
                    const data = await ColumnService.getAllColumns(Number(boardId));
                    setColumns(data);
                }
            } catch (error) {
                console.error("Error loading columns:", error);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchBoardDetails();
        fetchColumns();
    }, [boardId]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="px-4 pt-4">
                <Helmet>
                    <title>{boardName || "Carregando..."}</title>
                </Helmet>
                <header className="flex flex-row items-center space-x-2 ">
                    <button
                        className="p-2 bg-transparent border-none hover:text-slate-400"
                        onClick={() => navigate(-1)} // Navega para a página anterior
                    >
                        <GoArrowLeft className="inline-block" size={32} />
                    </button>
                    <h1 className="text-3xl font-bold">{boardName || "Carregando..."}</h1>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center mt-8">
                        <p className="text-slate-400 text-xl">Carregando colunas...</p>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col items-center justify-center space-y-4">
                        {columns.length > 0 ? (
                            <div className="flex space-x-4 w-full">
                                {columns.map((column) => (
                                    <div key={column.id} className="h-full flex-shrink-0 w-[25vw]">
                                        <ColumnBoard
                                            column={column}
                                            onEdit={() => handleEditColumn(column)}
                                            onDelete={() => openDeleteModal(column)}
                                        />
                                    </div>
                                ))}
                                <div className="ml-auto pr-4">
                                    <button
                                        className="bg-slate-800 hover:bg-slate-600 border border-slate-600 w-14 min-w-14 h-14 min-h-14 rounded-md text-slate-400"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <GoPlus className="inline-block" size={32} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <p className="text-slate-400 text-xl">Nenhuma coluna encontrada</p>
                                <button
                                    className="bg-slate-800 hover:bg-slate-600 border border-slate-600 px-6 py-3 rounded-md text-slate-400"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Adicionar Coluna
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <NewColumnModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveColumn}
                />

                <EditColumnModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    column={editingColumn}
                    onSave={handleUpdateColumn}
                />

                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={() => columnToDelete && handleDeleteColumn(columnToDelete.id)}
                />
            </div>
        </DndProvider>
    );
}