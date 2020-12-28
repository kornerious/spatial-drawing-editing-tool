import { FETCH_SPATIAL, UPDATE_SPATIAL_FIELD, FIRE_ROW } from '../actions/types'
import uuid from 'react-uuid'
import simplify from 'simplify-geojson'
import { colors, names } from '../utils/constants'

const initialState = {
  items: [],
  trackCenter: null,
  currentTableIndex: 0,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_SPATIAL: {
      let decodedFeatures = []

      action.payload.map((f, index) => {
        const id = uuid()
        const feature = simplify(f, 0.0005)
        if (feature.geometry.type === 'Polygon') {
          let decoded = feature.geometry.coordinates[0].map((latLng) => {
            let lat = latLng[1]
            let lng = latLng[0]
            return {
              lat,
              lng,
            }
          })
          decodedFeatures.push({
            color: colors[Math.floor(Math.random() * colors.length)],
            name: names[Math.floor(Math.random() * names.length)],
            comment: '',
            date: '',
            id: id,
            key: id,
            row: index,
            selected: false,
            decoded,
          })
        }
      })

      return {
        ...state,
        items: decodedFeatures,
      }
    }
    case UPDATE_SPATIAL_FIELD: {
      const index = action.payload.row

      const trackCenter = action.payload.trackCenter
        ? action.payload.trackCenter
        : state.trackCenter

      let newItems = [...state.items]
      newItems[index][action.payload.field] = action.payload.value

      return {
        ...state,
        trackCenter,
        items: newItems,
      }
    }
    case FIRE_ROW: {
      return {
        ...state,
        currentTableIndex: action.payload,
      }
    }
    default:
      return state
  }
}
