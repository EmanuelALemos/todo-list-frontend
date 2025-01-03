
interface LabelPriorityProps {
    priority: number;
}


export function LabelPriority({priority}: LabelPriorityProps) {
    const priorityStyles: Record<number, string> = {
        1: "bg-red-700/15 border-red-700 text-red-700",
        2: "bg-yellow-700/15 border-yellow-700 text-yellow-700",
        3: "bg-green-700/15 border-green-700 text-green-700",
    };

    const priorityText: Record<number, string> = {
        1: "Alta",
        2: "Média",
        3: "Baixa",
    };

    const styles = priorityStyles[priority];
    const text = priorityText[priority];

    return (
        <span className={`rounded-full text-xs px-2 py-1 text-center border ${styles}`}>
            {text}
        </span>
    );
}