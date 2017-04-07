import React, { Component } from 'react';
import Axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

export default class ConsultaCepBox extends Component {

  constructor() {
    super();
    this.state = {
      inputCep: '',
      cepInvalido: false,
      googleMaps: {
        map: '',
        geocoder: '',
      },
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      lat: -23.5500806,
      lng: -46.63408270000002,
      showMap: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(e) {
    this.setState({ inputCep: e.target.value });
  }

  handleSearch(e) {
    e.preventDefault();

    Axios.get(`https://viacep.com.br/ws/${this.state.inputCep}/json`)
      .then(res => {
        console.log('axios', res);
        if (res.data.erro) {
          this.setState({ cepInvalido: true });
        }
        else {
          let rua = res.data.logradouro;
          let bairro = res.data.bairro;
          let cidade = res.data.localidade;
          let estado = res.data.uf;
          let cep = res.data.cep;

          let address = rua + ', ' + cidade;
          convertAddresToLatLng(this.state.googleMaps.map, this.state.googleMaps.geocoder, address);

          this.setState({
            rua: rua,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            cep: cep,
            showMap: true,
            cepInvalido: false
          });
        }
      })
  }

  handleClose(e) {
    this.setState({ showMap: false });
  }

  render() {
    return (
      <div>
        <ConsultaCep
          cep={this.state.inputCep}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch} />

        <GoogleMaps
          state={this.state}
          handleClose={this.handleClose} />
      </div>
    );
  }
}

class ConsultaCep extends Component {

  render() {

    return (
      <div className="row">
        <div className="col-lg-3">

          <form onSubmit={this.props.handleSearch}>

            <label>Consultar Cep:</label>

            <div className="input-group">
              <input type="text"
                className="form-control"
                placeholder="digite um cep..."
                value={this.props.cep}
                onChange={this.props.handleChange}
                minLength="8"
                maxLength="8"
                required />

              <span className="input-group-btn">
                <button type="submit" className="btn btn-outline-primary">Buscar</button>
              </span>
            </div>

            <br />
          </form>
        </div>


      </div>
    );

  }
}

class GoogleMaps extends Component {

  shouldComponentUpdated() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.props.state.googleMaps.map.panTo({ lat: nextProps.state.lat, lng: nextProps.state.lng });
  }

  componentDidMount() {

    this.props.state.googleMaps.map = new window.google.maps.Map(this.refs.map, {
      center: { lat: this.props.state.lat, lng: this.props.state.lng },
      zoom: 14
    });

    this.props.state.googleMaps.geocoder = new window.google.maps.Geocoder();
  }

  render() {
    const showAddress = {
      'display': this.props.state.showMap ? 'block' : 'none'
    };

    const showInvalidCep = {
      'display': this.props.state.cepInvalido ? 'block' : 'none'
    };

    return (
      <div>
        <div style={showInvalidCep}>
          <p className="alert alert-danger">Cep Inválido</p>
        </div>

        <div className="card">
          <div className="card-block" style={showAddress}>
            <h4 className="card-title">{this.props.state.rua}</h4>
            <p>
              {this.props.state.bairro} <br />
              {this.props.state.cidade} - {this.props.state.estado} <br />
              {this.props.state.cep}
            </p>

            <button type="button" className="close" onClick={this.props.handleClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="google-maps" ref="map" />
        </div>
      </div>
    );
  }
}

function convertAddresToLatLng(map, geocoder, address) {

  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === window.google.maps.GeocoderStatus.OK) {

      console.log(results[0].geometry.location.lat());
      console.log(results[0].geometry.location.lng());

      map.setCenter(results[0].geometry.location);

      this.marker = new window.google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}