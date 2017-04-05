import React, { Component } from 'react';

export default class extends Component {

  shouldComponentUpdated() {
    return false;
  }

  componentDidMount() {
    this.map = new window.google.maps.Map(this.refs.map, {
      center: { lat: this.props.lat, lng: this.props.lng },
      zoom: 8
    });
  }

  render() {
    return (
      <div id="map" ref="map" style={{ height: '500px', width: '500px' }} />
    );
  }
}