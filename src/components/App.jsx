import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import axios from 'axios';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showModal, setShowModal] = useState('');

  useEffect(() => {
    if (!inputValue) {
      console.log('пустой инпут, выходим');
      return;
    }
    setLoading(true);
    console.log('делаем фетч');
    fetchImages();
  }, [inputValue, page]);

  //   componentDidUpdate(prevProps, prevState) {
  //     if (
  //       prevState.inputValue !== this.state.inputValue &&
  //       this.state.inputValue !== ''
  //     ) {
  //       this.setState({ loading: true });
  //       this.fetchImages();
  //     }

  //     if (prevState.page !== this.state.page && this.state.page !== 1) {
  //       this.setState({ loading: true });
  //       this.fetchImages();
  //     }
  //   }

  const fetchImages = async () => {
    if (inputValue === '') {
      return alert('nothing to show, fill input');
    }
    axios.defaults.baseURL = `https://pixabay.com/api/?q=${inputValue}&page=${page}&per_page=12&key=26229759-3aa7093be117df00e52b30f1f&image_type=photo&orientation=horizontal`;
    const response = await axios.get('/search?query=react');
    if (response.data.hits.length === 0) {
      alert('no images found, try something else');
      setInputValue('');
      setLoading(false);
      return;
    }

    const newArrayOfImages = response.data.hits.map(
      ({ id, webformatURL, largeImageURL }) => {
        return { id, webformatURL, largeImageURL };
      }
    );

    const totalImages = images.length + newArrayOfImages.length;
    setImages(prevState => [...prevState, ...newArrayOfImages]);
    setLoading(false);

    if (!showLoadMore && totalImages !== response.data.totalHits) {
      setShowLoadMore(true);
    }

    if (totalImages === response.data.totalHits) {
      setShowLoadMore(false);
    }
  };

  const onSubmit = inputValueData => {
    if (inputValueData === '') {
      alert('nothing to show, fill input');
    }
    if (showLoadMore) {
      setShowLoadMore(false);
    }
    FormReset(inputValueData);
  };

  const FormReset = value => {
    setImages([]);
    setPage(1);
    setInputValue(value);
  };

  const onClickImage = e => {
    setShowModal(
      images.find(image => image.webformatURL === e.target.src).largeImageURL
    );
  };

  const onClickModal = e => {
    setShowModal('');
  };

  const onClickLoadMore = e => {
    setPage(prevState => prevState + 1);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={onSubmit} />

      <ImageGallery images={images} onClick={onClickImage} />
      {loading && <Loader />}
      {showLoadMore && <Button onClick={onClickLoadMore} />}
      {showModal && <Modal image={showModal} onClick={onClickModal} />}
    </div>
  );
}

// class App extends React.Component {
//   state = {
//     images: [],
//     page: 1,
//     inputValue: '',
//     loading: false,
//     showLoadMore: false,
//     showModal: '',
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       prevState.inputValue !== this.state.inputValue &&
//       this.state.inputValue !== ''
//     ) {
//       this.setState({ loading: true });
//       this.fetchImages();
//     }

//     if (prevState.page !== this.state.page && this.state.page !== 1) {
//       this.setState({ loading: true });
//       this.fetchImages();
//     }
//   }

//   fetchImages = async () => {
//     if (this.state.inputValue === '') {
//       return alert('nothing to show, fill input');
//     }
//     axios.defaults.baseURL = `https://pixabay.com/api/?q=${this.state.inputValue}&page=${this.state.page}&per_page=12&key=26229759-3aa7093be117df00e52b30f1f&image_type=photo&orientation=horizontal`;
//     const response = await axios.get('/search?query=react');

//     if (response.data.hits.length === 0) {
//       this.alert('no images found, try something else');
//       this.setState({ loading: false, inputValue: '' });
//       return;
//     }

//     const newArrayOfImages = response.data.hits.map(
//       ({ id, webformatURL, largeImageURL }) => {
//         return { id, webformatURL, largeImageURL };
//       }
//     );

//     const totalImages = this.state.images.length + newArrayOfImages.length;

//     this.setState({
//       images: [...this.state.images, ...newArrayOfImages],
//       loading: false,
//     });

//     if (!this.state.showLoadMore && totalImages !== response.data.totalHits) {
//       this.setState({ showLoadMore: true });
//     }

//     if (totalImages === response.data.totalHits) {
//       this.setState({ showLoadMore: false });
//     }
//   };

//   alert = message => {
//     return alert(message);
//   };

//   onSubmit = inputValue => {
//     if (inputValue === '') {
//       alert('nothing to show, fill input');
//     }
//     if (this.state.showLoadMore) {
//       this.setState({ showLoadMore: false });
//     }
//     this.setState({ inputValue, images: [], page: 1 });
//   };

//   onClickImage = e => {
//     this.setState({
//       showModal: this.state.images.find(
//         image => image.webformatURL === e.target.src
//       ).largeImageURL,
//     });
//   };

//   onClickModal = e => {
//     this.setState({ showModal: '' });
//   };

//   onClickLoadMore = e => {
//     this.setState(state => ({ page: state.page + 1 }));
//   };

//   render() {
//     return (
//       <div className="App">
//         <Searchbar onSubmit={this.onSubmit} />

//         <ImageGallery images={this.state.images} onClick={this.onClickImage} />
//         {this.state.loading && <Loader />}
//         {this.state.showLoadMore && <Button onClick={this.onClickLoadMore} />}
//         {this.state.showModal && (
//           <Modal image={this.state.showModal} onClick={this.onClickModal} />
//         )}
//       </div>
//     );
//   }
// }

export { App };
