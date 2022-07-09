import React from "react";

import backToTopIcon from "../../../icons/back_to_top.svg";

const BackToTop: React.FC = () => {
    return (
        <button
            className="back-to-top-button"
            id="back-to-top-button"
            title="返回顶部"
            onClick={() => {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }}>
            <img src={backToTopIcon} alt="back to top"/>
        </button>
    );
}

export default BackToTop;
