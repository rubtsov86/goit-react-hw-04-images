import React from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';
import svg from './loupe_icon.svg';

class Searchbar extends React.Component {
  state = {
    image: '',
  };

  onChange = e => {
    this.setState({ image: e.currentTarget.value.toLowerCase() });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.image);
  };

  render() {
    return (
      <header className={s.Searchbar}>
        <form className={s.SearchForm} onSubmit={this.onSubmit}>
          <button
            style={{ backgroundImage: `url(${svg})` }}
            type="submit"
            className={s.SearchFormButton}
          >
            <span className={s.SearchFormButtonLabel}>Search</span>
          </button>

          <input
            className={s.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.image}
            onChange={this.onChange}
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
