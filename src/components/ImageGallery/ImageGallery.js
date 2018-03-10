import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import withInfiniteScroll from '../withInfinateScroll';

export class ImageGallery extends React.Component {
    constructor(props) {
        super(props);

        this.getPosition = this.getPosition.bind(this);
        this.getTotalHeight = this.getTotalHeight.bind(this);
    }

    render() {
        const { list, currentItemIndex } = this.props;
        const totalHeight = this.getTotalHeight();
        return (
            <ul style={{ height: totalHeight }}>
                {list.map((imageData, key) => {
                    const imageIndex = key + currentItemIndex;
                    return (
                        <li key={key} style={this.getPosition(imageIndex + 1)}>
                            <Image
                                height={imageData.low_resolution.height}
                                width={imageData.low_resolution.width}
                                url={imageData.low_resolution.url}
                                backgroundColor={
                                    imageData.standard_resolution.prominentColor
                                }
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }

    getPosition(imageIndex) {
        const row = Math.ceil(imageIndex / this.props.numberOfItemsInRow) - 1;
        const col =
            imageIndex % this.props.numberOfItemsInRow ||
            this.props.numberOfItemsInRow;

        const y = row * this.props.itemHeight;
        const x = (col-1) * this.props.itemWidth;

        return { top: y + 'px', right: x + 'px' };
    }

    getTotalHeight() {
        const { totalItems, numberOfItemsInRow, itemHeight } = this.props;

        const totalHeight = totalItems / numberOfItemsInRow * itemHeight;
        return totalHeight + 'px';
    }
}

ImageGallery.propTypes = {
    list: PropTypes.array,
    numberOfItemsInRow: PropTypes.number,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    currentItemIndex: PropTypes.number,
    totalItems: PropTypes.number
};

export default withInfiniteScroll(ImageGallery);
