import { Component } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import ImageGallery from '../ImageGallery';
import Spinner from '../Loader';
import Button from '../Button';
import imageAPI from '../../services/apiService';
import idleImage from '../../images/the-future-of-search.jpg';
import errorImage from '../../images/search_error.png';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default class ImageGalleryView extends Component {
  state = {
    images: [],
    error: null,
    status: Status.IDLE,
    page: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.searchQuery;
    const nextQuery = this.props.searchQuery;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevState.searchQuery !== this.state.searchQuery) {
      this.setState({ images: [], page: 1, error: null });
    }

    if (prevQuery !== nextQuery) {
      this.setState({ images: [], error: null });
      this.handleImageSearch(nextQuery, nextPage);
    }

    if (prevPage !== nextPage && prevPage < nextPage) {
      this.handleLoadMore(nextQuery, nextPage);
    }
  }
  handleImageSearch = nextQuery => {
    this.setState({ status: Status.PENDING });

    let nextPage = 1;

    imageAPI
      .fetchImages(nextQuery, nextPage)
      .then(images => {
        if (images.totalHits === 0) {
          toast.error(`No images found on ${nextQuery}.`);
          this.setState({
            status: Status.REJECTED,
          });
          return;
        }

        this.setState({
          images: images.hits,
          status: Status.RESOLVED,
        });
      })
      .catch(error => this.setState({ error, status: Status.REJECTED }));
  };

  handleLoadMore = (nextQuery, nextPage) => {
    this.setState({ status: Status.PENDING });

    imageAPI
      .fetchImages(nextQuery, nextPage)
      .then(response =>
        this.setState(prevState => ({
          images: [...prevState.images, ...response.hits],
        })),
      )
      .catch(error => this.setState({ error, status: Status.REJECTED }))
      .finally(() => this.setState({ status: Status.RESOLVED }));
  };

  onClickLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { status, images, page } = this.state;

    if (status === Status.IDLE) {
      return <img src={idleImage} alt="lets-give-it-a-try"></img>;
    }

    if (status === Status.PENDING) {
      return <Spinner />;
    }

    if (status === Status.REJECTED) {
      return (
        <img
          src={errorImage}
          width="250"
          alt="nothing-found"
          style={{ marginTop: 150 }}
        ></img>
      );
    }

    if (status === Status.RESOLVED) {
      return (
        <>
          <ImageGallery images={images} />
          {images.length > 0 && (
            <Button onClick={this.onClickLoadMore} page={page} />
          )}
        </>
      );
    }
  }
}

ImageGalleryView.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};
