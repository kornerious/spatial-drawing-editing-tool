import React from 'react'
import { withGoogleMap, withScriptjs, GoogleMap } from 'react-google-maps'
import { compose, withProps, lifecycle, withStateHandlers } from 'recompose'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

const DEFAULT_CENTER = { lat: 0, lng: 0 }

const initialState = {
  zoomLevel: 14,
  defaultCenter: DEFAULT_CENTER,
  mapCenter: (props) => props.center,
}

const setZoomLevel = (props) => (zoomLevel) => ({ zoomLevel })
const setDefaultCenter = (props) => (defaultCenter) => ({ defaultCenter })
const setCenter = (props) => (mapCenter) => ({ mapCenter })

const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=directions&key=AIzaSyAvbyv2_MDv2NGQXRg9OHfUDWsTHtUYeFY&libraries=drawing&`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%', width: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withStateHandlers(initialState, {
    setZoomLevel,
    setDefaultCenter,
    setCenter,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      if (!!navigator.geolocation && !this.props.disableGeolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.props.setDefaultCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (err) => console.log(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
      } else {
        console.log("Navigator doesn't support web")
      }
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (this.props.zoom && prevProps.zoomLevel !== this.props.zoom) {
        this.props.setZoomLevel(this.props.zoom)
      }
      if (
        this.props.center &&
        !isEmpty(this.props.center) &&
        !isEqual(this.props.center, prevProps.mapCenter)
      ) {
        this.props.setCenter(this.props.center)
      }
    },
  })
)(({ mapRef, defaultCenter, zoomLevel, onMapClick, mapOptions, children, mapCenter }) => {
  const mapOwnCenter = !isEmpty(mapCenter) ? mapCenter : defaultCenter
  const mapZoom = isEqual(mapOwnCenter, DEFAULT_CENTER) ? 3 : zoomLevel

  return (
    <GoogleMap
      ref={mapRef}
      zoom={mapZoom}
      center={mapOwnCenter}
      defaultCenter={defaultCenter}
      defaultZoom={zoomLevel}
      onClick={onMapClick}
      options={{
        disableDefaultUI: true,
        ...mapOptions,
      }}
    >
      {children}
    </GoogleMap>
  )
})

export default Map
