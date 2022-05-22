import React from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import axios from 'axios';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';

class App extends React.Component {
  state = {
    images: [],
    page: 1,
    inputValue: '',
    loading: false,
    showLoadMore: false,
    showModal: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.inputValue !== this.state.inputValue &&
      this.state.inputValue !== ''
    ) {
      this.setState({ loading: true });
      this.fetchImages();
    }

    if (prevState.page !== this.state.page && this.state.page !== 1) {
      this.setState({ loading: true });
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    if (this.state.inputValue === '') {
      return alert('nothing to show, fill input');
    }
    axios.defaults.baseURL = `https://pixabay.com/api/?q=${this.state.inputValue}&page=${this.state.page}&per_page=12&key=26229759-3aa7093be117df00e52b30f1f&image_type=photo&orientation=horizontal`;
    const response = await axios.get('/search?query=react');

    if (response.data.hits.length === 0) {
      this.alert('no images found, try something else');
      this.setState({ loading: false, inputValue: '' });
      return;
    }

    const newArrayOfImages = response.data.hits.map(
      ({ id, webformatURL, largeImageURL }) => {
        return { id, webformatURL, largeImageURL };
      }
    );

    const totalImages = this.state.images.length + newArrayOfImages.length;

    this.setState({
      images: [...this.state.images, ...newArrayOfImages],
      loading: false,
    });

    if (!this.state.showLoadMore && totalImages !== response.data.totalHits) {
      this.setState({ showLoadMore: true });
    }

    if (totalImages === response.data.totalHits) {
      this.setState({ showLoadMore: false });
    }
  };

  alert = message => {
    return alert(message);
  };

  onSubmit = inputValue => {
    if (inputValue === '') {
      alert('nothing to show, fill input');
    }
    if (this.state.showLoadMore) {
      this.setState({ showLoadMore: false });
    }
    this.setState({ inputValue, images: [], page: 1 });
  };

  onClickImage = e => {
    this.setState({
      showModal: this.state.images.find(
        image => image.webformatURL === e.target.src
      ).largeImageURL,
    });
  };

  onClickModal = e => {
    this.setState({ showModal: '' });
  };

  onClickLoadMore = e => {
    this.setState(state => ({ page: state.page + 1 }));
  };

  render() {
    return (
      <div className="App">
        <Searchbar onSubmit={this.onSubmit} />

        <ImageGallery images={this.state.images} onClick={this.onClickImage} />
        {this.state.loading && <Loader />}
        {this.state.showLoadMore && <Button onClick={this.onClickLoadMore} />}
        {this.state.showModal && (
          <Modal image={this.state.showModal} onClick={this.onClickModal} />
        )}
      </div>
    );
  }
}

export { App };
