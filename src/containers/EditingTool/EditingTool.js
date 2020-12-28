import React, { useEffect } from 'react'
import SpatialObjectsTable from '../../components/SpatialObjectsTable/SpatialObjectsTable'
import SpatialObjectsMap from '../../components/SpatialObjectsMap/SpatialObjectsMap'
import { fetchSpatial } from '../../actions/spatialActions'
import { useDispatch } from 'react-redux'

export default function EditingTool(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSpatial())
  }, [])

  return (
    <>
      <SpatialObjectsTable />
      <SpatialObjectsMap />
    </>
  )
}
