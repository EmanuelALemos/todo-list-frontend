import { Helmet } from "react-helmet-async";

import { InputSearch } from "../components/inputSerach";
import { ButtonNew } from "../components/buttonNew";
import { TableBoards } from "../components/tableBoards";
import { useEffect, useState } from "react";
import { Board } from "../@types/Board";
import { NewBoardModal } from "../components/boardModals/newBoardModal";
import { BoardService } from "../services/boardService";
import { ConfirmDeleteModal } from "../components/confirmDeleteModal";
import { EditBoardModal } from "../components/boardModals/editBoardModal";


export function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [boards, setBoards] = useState<Board[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteBoardId, setDeleteBoardId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [searchQuery, setSearchQuery] = useState("");


    const fetchBoards = async () => {
        setIsLoading(true);
        try {
            const fetchedBoards = await BoardService.getAllBoards();
            setBoards(fetchedBoards);
        } catch (error) {
            console.error("Error fetching boards:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleCreateBoard = async (newBoard: Board) => {
        try {
            const createdBoard = await BoardService.createBoard(newBoard);

            setBoards([...boards, createdBoard]);

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };

    const handleEditBoard = (board: Board) => {
        setEditingBoard(board);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleUpdateBoard = async (updatedBoard: Board) => {
        try {
            if (updatedBoard.id !== undefined) {
                const result = await BoardService.updateBoard(updatedBoard.id, updatedBoard);
                setBoards(boards.map((board) => (board.id === updatedBoard.id ? result : board)));
            } else {
                console.error("Error updating board: Board ID is undefined");
            }
            setIsModalOpen(false);
            setIsEditing(false);
            setEditingBoard(null);
        } catch (error) {
            console.error("Error updating board:", error);
        }
    };

    const handleDeleteBoard = (id: number) => {
        setDeleteBoardId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteBoardId === null) return;

        try {
            await BoardService.deleteBoard(deleteBoardId);
            setBoards(boards.filter((board) => board.id !== deleteBoardId));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting board:", error);
        }
    };

    const filteredBoards = boards.filter((board) =>
        board.title.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    useEffect(() => {
        fetchBoards();
    }, []);


    return (
        <div>
            <Helmet title="Home" />

            <div className="fixed top-20 left-0 w-full flex justify-between items-center px-40 py-8 bg-gray-900 z-10">
                <InputSearch value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <ButtonNew onClick={() => setIsModalOpen(true)} />
            </div>


            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Carregando boards...</p>
                </div>
            ) : (
                <div className="pt-32">
                    <div className="flex justify-center items-center px-40 py-8">
                        <TableBoards boards={filteredBoards} onEdit={handleEditBoard} onDelete={handleDeleteBoard} />
                    </div>
                </div>
            )}

            <NewBoardModal
                isOpen={isModalOpen && !isEditing}
                onClose={() => setIsModalOpen(false)}
                onCreateBoard={handleCreateBoard}
            />

            {editingBoard && (
                <EditBoardModal
                    isOpen={isModalOpen && isEditing}
                    onClose={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                        setEditingBoard(null);
                    }}
                    onUpdateBoard={handleUpdateBoard}
                    board={editingBoard}
                />
            )}

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleConfirmDelete}
            />
        </div>
    );
}