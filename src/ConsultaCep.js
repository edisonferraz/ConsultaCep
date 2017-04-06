import React, { Component } from 'react';
import Axios from 'axios';

import styles from './App.css';

export default class ConsultaCepBox extends Component {

  constructor() {
    super();
    this.state = {
      map: '',
      geocoder: '',

      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      lat: -23.533773,
      lng: -46.625290
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ cep: e.target.value });
  }

  handleSearch(e) {
    e.preventDefault();

    //Axios.get('https://viacep.com.br/ws/' + this.state.cep + '/json/?callback=?')
    Axios.get(`https://viacep.com.br/ws/${this.state.cep}/json`)
      .then(res => {
        console.log('axios', res);

        let rua = res.data.logradouro;
        let bairro = res.data.bairro;
        let cidade = res.data.localidade;
        let estado = res.data.uf;
        let cep = res.data.cep;

        let address = rua + ', ' + cidade;
        let latLng = convertAddresToLatLng(this.state.map, this.state.geocoder, address);

        this.setState({
          rua: rua,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          cep: cep
        });
      })
  }

  render() {
    return (
      <div>
        <ConsultaCep cep={this.state.cep}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch} />

        <GoogleMaps state={this.state} />
      </div>
    );
  }
}

class ConsultaCep extends Component {

  render() {

    return (
      <div>
        <h1>Consultar</h1>

        <form onSubmit={this.props.handleSearch}>
          <label>CEP</label>
          <input type="number" value={this.props.cep} onChange={this.props.handleChange} />
          <button type="submit">Buscar</button>
        </form>
      </div>
    );

  }
}

class GoogleMaps extends Component {

  shouldComponentUpdated() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.props.state.map.panTo({ lat: nextProps.state.lat, lng: nextProps.state.lng });
  }

  componentDidMount() {

    this.props.state.map = new window.google.maps.Map(this.refs.map, {
      center: { lat: this.props.state.lat, lng: this.props.state.lng },
      zoom: 14
    });

    this.props.state.geocoder = new window.google.maps.Geocoder();
  }

  render() {
    return (
      <div>

        <h2>{this.props.state.rua}</h2>
        <p>{this.props.state.bairro}</p>
        <p>{this.props.state.bairro} - {this.props.state.estado}</p>
        <p>{this.props.state.cep}</p>

        <div className="google-maps" ref="map" />
      </div>
    );
  }
}

function convertAddresToLatLng(map, geocoder, address) {

  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == window.google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);

      var marker = new window.google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}