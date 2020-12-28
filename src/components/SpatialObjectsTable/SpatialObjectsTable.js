import React, { useRef, useEffect } from 'react'
import { useBlockLayout, useTable } from 'react-table'
import { FixedSizeList } from 'react-window'
import { connect } from 'react-redux'
import moment from 'moment'
import { updateSpatialField } from '../../actions/spatialActions'
import uuid from 'react-uuid'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function Table({ columns, data, currentTableIndex }) {
  const defaultColumn = React.useMemo(
    () => ({
      width: 100,
    }),
    []
  )
  const listRef = useRef(null)
  const scrollToRow = (itemRow) => {
    listRef.current.scrollToItem(itemRow)
  }
  const prevIndex = usePrevious({ currentTableIndex })

  useEffect(() => {
    if (prevIndex !== currentTableIndex) {
      scrollToRow(currentTableIndex)
    }
  }, [currentTableIndex])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
      manualSortBy: true,
      disableSortBy: true,
      sortable: false,
    },
    useBlockLayout
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]

      prepareRow(row)
      return (
        <div
          style={{ backgroundColor: row.original.selected ? 'red' : '' }}
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )

  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={window.innerHeight - 40}
          itemCount={rows.length}
          itemSize={35}
          ref={listRef}
          width={410}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  )
}

function SpatialObjectsTable({ spatials, updateSpatialField, currentTableIndex }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        id: 'date',
        accessor: (d) => {
          return (
            <input
              onMouseEnter={() =>
                updateSpatialField({
                  trackCenter: { lat: d.decoded[0].lat, lng: d.decoded[0].lng },
                  row: d.row,
                  field: 'selected',
                  value: true,
                })
              }
              onMouseLeave={() => {
                updateSpatialField({ row: d.row, field: 'selected', value: false })
              }}
              key={uuid()}
              onChange={(e) =>
                updateSpatialField({ row: d.row, field: 'date', value: e.currentTarget.value })
              }
              style={{ width: 90 }}
              value={d.date ? d.date : moment().format('DD-MM-YYYY HH:MM')}
            />
          )
        },
      },
      {
        Header: 'Name',
        id: 'name',
        accessor: (d) => (
          <input
            key={uuid()}
            onMouseEnter={() =>
              updateSpatialField({
                trackCenter: { lat: d.decoded[0].lat, lng: d.decoded[0].lng },
                row: d.row,
                field: 'selected',
                value: true,
              })
            }
            onMouseLeave={() => {
              updateSpatialField({ row: d.row, field: 'selected', value: false })
            }}
            onChange={(e) =>
              updateSpatialField({ row: d.row, field: 'name', value: e.currentTarget.value })
            }
            style={{ width: 90 }}
            value={d.name}
          />
        ),
      },
      {
        Header: 'Color',
        id: 'color',
        accessor: (d) => (
          <input
            key={uuid()}
            onMouseEnter={() =>
              updateSpatialField({
                trackCenter: { lat: d.decoded[0].lat, lng: d.decoded[0].lng },
                row: d.row,
                field: 'selected',
                value: true,
              })
            }
            onMouseLeave={() => {
              updateSpatialField({ row: d.row, field: 'selected', value: false })
            }}
            onChange={(e) =>
              updateSpatialField({ row: d.row, field: 'color', value: e.currentTarget.value })
            }
            style={{ width: 90 }}
            value={d.color}
          />
        ),
      },
      {
        Header: 'Comment',
        id: 'comment',
        accessor: (d) => (
          <input
            key={uuid()}
            onMouseEnter={() =>
              updateSpatialField({
                trackCenter: { lat: d.decoded[0].lat, lng: d.decoded[0].lng },
                row: d.row,
                field: 'selected',
                value: true,
              })
            }
            onMouseLeave={() => {
              updateSpatialField({ row: d.row, field: 'selected', value: false })
            }}
            onChange={(e) =>
              updateSpatialField({ row: d.row, field: 'comment', value: e.currentTarget.value })
            }
            style={{ width: 90 }}
            value={d.comment}
          />
        ),
      },
    ],
    []
  )

  const data = React.useMemo(() => spatials, [])

  return (
    <div>
      <Table currentTableIndex={currentTableIndex} columns={columns} data={spatials} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  spatials: state.spatials.items,
  currentTableIndex: state.spatials.currentTableIndex,
})

const mapDispatchToProps = (dispatch) => {
  return {
    updateSpatialField: (spatialField) => {
      dispatch(updateSpatialField(spatialField))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpatialObjectsTable)
