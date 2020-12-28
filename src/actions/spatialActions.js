import { FETCH_SPATIAL, UPDATE_SPATIAL_FIELD, FIRE_ROW } from './types'

function fetchSpatial() {
  return (dispatch) => {
    fetch(
      'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_Election_Districts_Water_Included/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=pgeojson'
    )
      .then((res) => res.json())
      .then((spatials) =>
        dispatch({
          type: FETCH_SPATIAL,
          payload: spatials.features,
          // payload: spatials.features.slice(0, 20),
        })
      )
  }
}

function updateSpatialField(spatialField) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SPATIAL_FIELD,
      payload: spatialField,
    })
  }
}

function fireRow(index) {
  return (dispatch) => {
    dispatch({
      type: FIRE_ROW,
      payload: index,
    })
  }
}

export { fetchSpatial, updateSpatialField, fireRow }
