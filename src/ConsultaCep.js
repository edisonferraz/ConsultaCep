import React, { Component } from 'react';
import Axios from 'axios';

export default class ConsultaCepBox extends Component {

  constructor() {
    super();
    this.state = {
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      lat: -34.397,
      lng: 150.644
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
        //let lat = 40.7128;
        //let lng = -74.0059;

        //let latLng = convertAddresToLatLng(this.map, this.geocoder, rua);

        this.setState({
          rua: rua,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          cep: cep
          //lat: latLng.lat,
          //lng: latLng.lng
        });
      })
  }

  render() {
    return (
      <div>
        <ConsultaCep cep={this.state.cep}
          handleChange={this.handleChange}
          handleSearch={this.handleSearch} />

        <button onClick={() => this.setState({ lat: 40.7128, lng: -74.0059 })}>
          New York
        </button>

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
    this.map.panTo({ lat: nextProps.state.lat, lng: nextProps.state.lng });

    //let address = nextProps.state.rua;
    //this.latLng = convertAddresToLatLng(this.map, this.geocoder, address);
    //this.props.setState({ lat: this.latLng.lat, lng: this.latLng.lng });
  }

  componentDidMount() {

    this.map = new window.google.maps.Map(this.refs.map, {
      center: { lat: this.props.state.lat, lng: this.props.state.lng },
      zoom: 8
    });

    this.geocoder = new window.google.maps.Geocoder();
  }

  render() {
    return (
      <div>

        <h2>{this.props.state.rua}</h2>
        <p>{this.props.state.bairro}</p>
        <p>{this.props.state.bairro} - {this.props.state.estado}</p>
        <p>{this.props.state.cep}</p>

        <div id="map" ref="map" style={{ height: '200px', width: '500px' }} />
      </div>
    );
  }
}

function convertAddresToLatLng(map, geocoder, address) {
  var latLng = {};

  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == window.google.maps.GeocoderStatus.OK) {

      //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());

      latLng.lat = results[0].geometry.location.lat();
      latLng.lngt = results[0].geometry.location.lng();

      //map.setCenter(results[0].geometry.location);

      /*var marker = new window.google.maps.Marker({
        map: this.map,
        position: results[0].geometry.location
      });*/

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

  return latLng;
}