import React from "react";

function BackgroundImage(props) {
    const backgroundStyle = {
        height: props.imageHeight + "px",
        backgroundImage: "url("+props.background+")",
        backgroundPosition: props.position,
    };

    return <div className="background__image" style={backgroundStyle}></div>;
}

export default BackgroundImage;