import React from "react";

function Loading() {
    return (
        <div className="loader">
            <div className="loader__spinner">
                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
                <div className="spinner-grow" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        </div>
    );
}

export default Loading;