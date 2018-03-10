import React from 'react';
import { PAGE_SIZE, IMAGE_HEIGHT, IMAGE_WIDTH } from '../../config';

const withInfiniteScroll = Component =>
    class WithInfiniteScroll extends React.Component {
        constructor() {
            super();

            this.pageHeight = 0;
            this.nextFetchPoint = 0;
            this.prevFetchPoint = 0;
            this.currentPageIndex = 1;
            this.currentItemIndex = 0; // the gallery will render form this index on...
            this.scrollPosition = 0;
            this.scrollTimeout = 0;

            this.state = {
                list: []
            };

            this.getData = this.getItems.bind(this);
            this.removeListElements = this.removeListElements.bind(this);
            this.getNumberOfItemsInRow = this.getNumberOfItemsInRow.bind(this);
        }

        async componentDidMount() {
            window.addEventListener('scroll', this.onScroll, false);
            window.addEventListener('resize', this.onResize, false);

            const numberOfItemsInRow = this.getNumberOfItemsInRow();
            const totalItems = await this.props.getTotalItems();
            const list = await this.getItems();

            this.setState({
                list,
                totalItems,
                numberOfItemsInRow
            });
        }

        componentWillUnmount() {
            window.removeEventListener('scroll', this.onScroll, false);
            window.removeEventListener('resize', this.onResize, false);
        }

        async getItems() {
            this.setState({ loading: true });

            // I would remove this in prod, just want to prove that
            // this is not flooding the api
            console.log('fetching with page index ' + this.currentPageIndex);
            const list = await this.props.onPaginatedSearch(
                this.currentPageIndex
            );

            this.setFetchPoints();
            this.setState({ loading: false });

            return list;
        }

        setFetchPoints() {
            this.nextFetchPoint = this.currentPageIndex * this.pageHeight;
            this.prevFetchPoint =
                this.currentPageIndex > 1
                    ? (this.currentPageIndex - 1) * this.pageHeight
                    : 0;
        }

        onResize = e => {
            const numberOfItemsInRow = this.getNumberOfItemsInRow();
            this.setState({ numberOfItemsInRow });
            window.scrollTo(0, 0);
        };

        onScroll = () => {
            clearTimeout(this.scrollTimeout);
            // this is to prevent api flooding by crazy scrolling
            this.scrollTimeout = setTimeout(async () => {
                const scrollTop = document.documentElement.scrollTop;
                const isScrollingDown = this.scrollPosition < scrollTop;
                this.scrollPosition = scrollTop;

                const getNextResults = scrollTop > this.nextFetchPoint;
                const getPrevResults = scrollTop < this.prevFetchPoint;

                this.currentPageIndex =
                    scrollTop > 0 ? Math.ceil(scrollTop / this.pageHeight) : 1;

                this.setFetchPoints();

                this.currentItemIndex =
                    this.currentPageIndex > 0
                        ? (this.currentPageIndex - 1) * PAGE_SIZE
                        : 0;

                if (isScrollingDown && getNextResults) {
                    if (
                        this.currentPageIndex * PAGE_SIZE <
                        this.state.totalItems
                    ) {
                        const newList = await this.getItems();
                        const list = this.state.list;

                        this.setState({
                            list: [
                                ...this.removeListElements(list, true),
                                ...newList
                            ]
                        });
                    }
                } else if (!isScrollingDown && getPrevResults) {
                    const newList = await this.getItems();
                    const list = this.state.list;

                    this.setState({
                        list: [
                            ...newList,
                            ...this.removeListElements(list, false)
                        ]
                    });
                }
            }, 100);
        };

        removeListElements(list, removeFromStart) {
            if (removeFromStart) {
                if (list.length >= PAGE_SIZE * 3) {
                    list.splice(0, PAGE_SIZE);
                }
            } else {
                if (list.length >= PAGE_SIZE * 3) {
                    list.splice(PAGE_SIZE * 2, PAGE_SIZE);
                }
            }
            return list;
        }

        getNumberOfItemsInRow() {
            const windowWidth = this.container.offsetWidth;
            const imageWidth = IMAGE_WIDTH;
            const numberOfItemsInRow = Math.floor(windowWidth / imageWidth);
            const numberOfRows = Math.floor(PAGE_SIZE / numberOfItemsInRow);
            this.pageHeight = numberOfRows * IMAGE_HEIGHT;

            return numberOfItemsInRow;
        }

        render() {
            return (
                <div
                    ref={c => (this.container = c)}
                    className="gallery-container">
                    <Component
                        list={this.state.list}
                        numberOfItemsInRow={this.state.numberOfItemsInRow}
                        itemHeight={IMAGE_HEIGHT}
                        itemWidth={IMAGE_WIDTH}
                        currentItemIndex={this.currentItemIndex}
                        totalItems={this.state.totalItems}
                    />
                </div>
            );
        }
    };

export default withInfiniteScroll;
