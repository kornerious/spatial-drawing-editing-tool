/* global google */
import React from 'react'
import { connect } from 'react-redux'
import './SpatialObjectsMap.scss'
import Map from '../../components/Map'
import { Polygon } from 'react-google-maps'
import { updateSpatialField, fireRow } from '../../actions/spatialActions'

let editModeOn = false

class PolygonComponent extends React.Component {
  state = {
    editable: false,
    hovered: false,
  }

  render() {
    let { spatialObject, updateSpatialField, fireRow } = this.props
    let { editable, hovered } = this.state

    return (
      <Polygon
        editable={editable}
        options={{
          strokeWeight: 1,
          strokeColor: spatialObject.selected || hovered ? 'red' : spatialObject.color,
          fillColor: spatialObject.selected || hovered ? 'red' : spatialObject.color,
          fillOpacity: 0.35,
        }}
        paths={spatialObject.decoded}
        manual
        onMouseUp={() => {
          if (editModeOn) {
            this.setState({ editable: true })
            this.props.changeEditMode()
            editModeOn = false
          }
        }}
        onMouseOver={() => {
          this.setState({ hovered: true })
          fireRow(spatialObject.row)
          // updateSpatialField({ row: spatialObject.row, field: 'selected', value: true })
        }}
        onMouseOut={() => {
          this.setState({ hovered: false })
          // updateSpatialField({ row: spatialObject.row, field: 'selected', value: false })
        }}
      />
    )
  }
}

class PolygonMap extends React.PureComponent {
  state = {
    firstRender: true,
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.state.firstRender && this.setState({ firstRender: false })
  }

  renderPolygons = () => {
    const firstRender = this.state.firstRender
    const { updateSpatialField, fireRow } = this.props

    const polygonArray = []
    if (window?.google?.maps && this.props.spatials.length) {
      let bounds = new google.maps.LatLngBounds()

      this.props.spatials.forEach((spatialObject) => {
        firstRender &&
          spatialObject.decoded.map((latLng) =>
            bounds.extend({
              lat: latLng.lat,
              lng: latLng.lng,
            })
          )

        polygonArray.push(
          <PolygonComponent
            fireRow={fireRow}
            updateSpatialField={updateSpatialField}
            changeEditMode={this.props.changeEditMode}
            spatialObject={spatialObject}
            key={spatialObject.id}
          />
        )
      })

      firstRender && this.mapRef && this.mapRef.fitBounds(bounds)
      return polygonArray
    }
  }

  render() {
    const trackCenter = this.props.trackCenter

    return (
      <Map
        mapRef={(ref) => {
          this.mapRef = ref
        }}
        center={trackCenter}
        disableGeolocation={true}
      >
        {this.renderPolygons()}
      </Map>
    )
  }
}

class SpatialObjectsMap extends React.PureComponent {
  state = { editMode: false }

  handleChangeEditMode = () => {
    this.setState({ editMode: false })
  }

  render() {
    const { spatials, trackCenter, updateSpatialField, fireRow } = this.props
    const { editMode } = this.state

    return (
      <div
        className={`spatials-map ${editMode ? 'editable' : ''}`}
        style={{ position: 'relative' }}
      >
        <PolygonMap
          trackCenter={trackCenter}
          fireRow={fireRow}
          changeEditMode={this.handleChangeEditMode}
          spatials={spatials}
          updateSpatialField={updateSpatialField}
        />

        <div style={{ position: 'absolute', bottom: 30, right: 20, cursor: 'pointer' }}>
          <button
            style={{ backgroundColor: editMode ? 'red' : '' }}
            onClick={() => {
              editModeOn = !editModeOn
              this.setState((state) => {
                return { editMode: !state.editMode }
              })
            }}
          >
            Edit mode
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  spatials: state.spatials.items,
  trackCenter: state.spatials.trackCenter,
})

const mapDispatchToProps = (dispatch) => {
  return {
    updateSpatialField: (spatialField) => {
      dispatch(updateSpatialField(spatialField))
    },
    fireRow: (index) => {
      dispatch(fireRow(index))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialObjectsMap)
