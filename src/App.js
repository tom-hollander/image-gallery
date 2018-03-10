import React, { Component } from 'react';

import GalleryApi from './api/galleryApi';
import ImageGallery from './components/ImageGallery';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: []
        };

        this.getImages = this.getImages.bind(this);
    }

    async getImages(currentPageCount) {
        const images = await GalleryApi.getImages(currentPageCount);
        return images;
    }

    async getTotal() {
        const total = await GalleryApi.getImageCount();
        return total;
    }

    render() {
        return (
            <div className="App">
                <ImageGallery
                    list={this.state.images}
                    onPaginatedSearch={this.getImages}
                    getTotalItems={this.getTotal}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}

export default App;
