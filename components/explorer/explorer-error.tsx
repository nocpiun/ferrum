import React from "react";

interface ExplorerErrorProps {
    error: string
}

const ExplorerError: React.FC<ExplorerErrorProps> = ({ error }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
            <span className="text-default-400">{error}</span>
        </div>
    );
}

export default ExplorerError;
