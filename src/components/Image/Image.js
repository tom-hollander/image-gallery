import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ url, height, width, backgroundColor }) => {
    const backgroundImage = `url("${url}")`;
    height = `${height}px`;
    width = `${width}px`;

    return (
        <div className="gallery-image"
            style={{
                backgroundImage,
                backgroundColor
            }}
        />
    );
};

Image.PropType = {
    height: PropTypes.number,
    width: PropTypes.number,
    backgroundColor: PropTypes.string
};
export default Image;
