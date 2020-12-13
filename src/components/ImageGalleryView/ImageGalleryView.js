import { Component } from 'react';
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
    images: null,
    error: null,
    status: Status.IDLE,
    page: 1,
  };
  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.searchQuery;
    const nextQuery = this.props.searchQuery;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevQuery !== nextQuery) {
      this.setState({ page: 1 });
    }

    if (prevQuery !== nextQuery || prevPage !== nextPage) {
      this.setState({ status: Status.PENDING });

      imageAPI
        .fetchImages(nextQuery, nextPage)
        .then(images => {
          if (images.total !== 0) {
            this.setState({ images, status: Status.RESOLVED });
            return;
          }
          return Promise.reject(
            new Error('Sorry, nothing was found. Try again!'),
          );
        })

        .catch(error => this.setState({ error, status: Status.REJECTED }));
    }
  }

  onClickLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { status } = this.state;

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
          <ImageGallery images={this.state.images.hits} />
          <Button onClick={this.onClickLoadMore} page={this.state.page} />
        </>
      );
    }
  }
}

ImageGalleryView.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};
