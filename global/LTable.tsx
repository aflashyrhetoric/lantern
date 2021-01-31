/*
 * This table uses Carbon's DataTable to make certain operations easier:
 *   batch select, edit/delete interactions w/ success notifications, column visibility, etc
 * Some features are still WIP.
 * If you're JUST trying to display data, look at the standard <DataTable> component
 */
import React, { useState, useEffect } from "react"
import {
  DataTable,
  TableContainer,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableCell,
  TableBody,
  Table,
  TableSelectRow,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from "carbon-components-react"
import { Edit32, TrashCan32 } from "@carbon/icons-react"
import LTableHeader from "./LTableHeader"
import { prepareTableCell } from "./utils"

interface Props {
  title?: string
  description?: string
  style?: object

  headerData: any[] // presentational header data
  rowData: any // presentational row data; should be a .map() on the array passed in for rawRowData

  rawRowData?: any[] // raw data
  rowHeight?: string // DataTable Row Height

  allowHeaderTextWrapping?: boolean // allows for table headers to wrap text, useful for very wide tables!

  collapseOverride?: boolean // LTable internally tracks collapsed state (on toggle), but this will override

  openModal?: Function // func for cond'ly rendering a <Modal> in the parent (based on parent's state)
  openDeleteModal?: Function // func for cond'ly rendering a deletion <Modal> in the parent (based on parent's state)
  openBatchEditModal?: Function
  updateFormState?: Function
  initializeFormState?: Function // for "add new", we may want to pre-fill some fields
  updateEditingMode?: Function
  onBatchDelete?: Function

  // A series of switches to disable key parts of UI
  //   NOTE: These should mostly be used as temporary measures / quick and dirty feature flags
  //   You may want to use Carbon's standard DataTable if you're just displaying data.
  disableAllControls?: boolean
  disableAddNew?: boolean
  disableBatch?: boolean // controls visibility of batch selection checkboxes
  disableBatchEdit?: boolean // controls visibility of batch edit icon button in the action bar
  disableBatchDelete?: boolean
  disableOverflow?: boolean
  disableOverflowEdit?: boolean
  disableOverflowDelete?: boolean
}

export enum EditingState {
  INACTIVE,
  CREATE,
  UPDATE,
  BATCHUPDATE,
}

export interface TableRowShape {
  id: string
  cells: any[]
}

export interface TableHeaderShape {
  id: string
  header: string
  key: string
  style?: any // style object
  visible?: boolean
}

export interface TableCellShape {
  id: string
  value: any
  info: {
    header: string
  }
}

export const validateInput = (
  value,
  invalidFields,
  updateInvalidFields,
  name: string,
) => {
  if (!value || value.length === 0) {
    updateInvalidFields([...invalidFields, name])
  } else {
    updateInvalidFields(invalidFields.filter(f => f !== name))
  }
}

export const getSelectedRawRowsData = (
  selectedRows: any[],
  rowData: any[],
  rawRowData: any[],
) => {
  // selectedRows and rowData match on id,
  // and rowData and rawRowData match on index position.

  const selectedRowIndexes = selectedRows.map(sr =>
    rowData.findIndex(rd => sr.id === rd.id),
  )

  return selectedRowIndexes.map(i => rawRowData[i])
}

export const LTable: React.FC<Props> = ({
  title,
  description,
  style,
  rowData,

  rawRowData,
  rowHeight = "tall",
  headerData,

  collapseOverride = false,

  allowHeaderTextWrapping = false,

  updateEditingMode,
  updateFormState,
  initializeFormState = null,

  openModal,
  openDeleteModal,
  openBatchEditModal,

  onBatchDelete,

  disableAllControls = false,
  disableBatch = false,
  disableBatchEdit = false,
  disableBatchDelete = false,
  disableAddNew = false,
  disableOverflow = false,
  disableOverflowEdit = false,
  disableOverflowDelete = false,
}) => {
  const [isCollapsed, updateIsCollapsed] = useState(collapseOverride)

  // LTable's collapsed state will always yield to the parent
  useEffect(() => {
    updateIsCollapsed(collapseOverride)
  }, [collapseOverride])

  const toggleCollapse = () => {
    updateIsCollapsed(!isCollapsed)
  }

  return (
    <div style={{ ...style, position: "relative" }}>
      <LTableHeader title={title} />
      <>
        <DataTable
          rows={rowData}
          rawRowData={rawRowData}
          headers={headerData}
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getBatchActionProps,
            selectedRows,
          }) => {
            return (
              <TableContainer
                description={description}
                style={{ marginBottom: "1rem", overflowX: "visible" }}
              >
                <TableToolbar>
                  {!disableAllControls && !disableBatch && (
                    <TableBatchActions
                      {...getBatchActionProps()}
                      style={{ zIndex: 1 }}
                    >
                      {!disableBatchDelete && (
                        <TableBatchAction
                          tabIndex={
                            getBatchActionProps().shouldShowBatchActions
                              ? 0
                              : -1
                          }
                          renderIcon={TrashCan32}
                          onClick={() => {
                            const selectedRawRowsData = getSelectedRawRowsData(
                              selectedRows,
                              rowData,
                              rawRowData,
                            )

                            onBatchDelete(selectedRawRowsData)
                          }}
                        >
                          Delete
                        </TableBatchAction>
                      )}

                      {!disableBatchEdit && (
                        <TableBatchAction
                          tabIndex={
                            getBatchActionProps().shouldShowBatchActions
                              ? 0
                              : -1
                          }
                          renderIcon={Edit32}
                          onClick={() => {
                            updateEditingMode(EditingState.BATCHUPDATE)

                            const selectedRawRowsData = getSelectedRawRowsData(
                              selectedRows,
                              rowData,
                              rawRowData,
                            )

                            updateFormState({
                              selectedRawRowsData,
                            })

                            openBatchEditModal()
                          }}
                        >
                          Edit
                        </TableBatchAction>
                      )}
                    </TableBatchActions>
                  )}
                  <TableToolbarContent>
                    {!disableAllControls && !disableAddNew && (
                      <Button
                        tabIndex={
                          getBatchActionProps().shouldShowBatchActions ? -1 : 0
                        }
                        onClick={() => {
                          updateEditingMode(EditingState.CREATE)

                          // Update the form with current row values.
                          //   If preset values are desired, call that function instead
                          if (
                            typeof initializeFormState !== "undefined" &&
                            initializeFormState !== null
                          ) {
                            initializeFormState()
                          }
                          openModal()
                        }}
                        size="small"
                        kind="primary"
                      >
                        Add new
                      </Button>
                    )}
                  </TableToolbarContent>
                </TableToolbar>
                <Table size={rowHeight}>
                  {rows.length !== 0 && (
                    <TableHead>
                      <TableRow>
                        {/* Batch Selection <th> */}
                        {!disableAllControls && !disableBatch && (
                          <TableSelectAll {...getSelectionProps()} />
                        )}
                        {headers.map((header: TableHeaderShape) => {
                          return (
                            <TableHeader
                              key={header.key}
                              style={
                                allowHeaderTextWrapping
                                  ? header.style
                                  : {
                                      ...{ whiteSpace: "nowrap" },
                                      ...header.style,
                                    } || null
                              }
                              {...getHeaderProps({ header })}
                            >
                              {header.header}
                            </TableHeader>
                          )
                        })}

                        {/* Empty TableHeader for the OverflowMenu */}
                        {!disableAllControls && !disableOverflow && (
                          <TableHeader style={{ width: "50px" }} />
                        )}
                      </TableRow>
                    </TableHead>
                  )}
                  <TableBody>
                    {rows.length === 0 && <TableRow>Empty</TableRow>}
                    {rows.map((row: TableRowShape, index) => (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        {!disableAllControls && !disableBatch && (
                          <TableSelectRow {...getSelectionProps({ row })} />
                        )}
                        {row.cells.map(cell => prepareTableCell(cell))}

                        {!disableAllControls && !disableOverflow && (
                          <TableCell key={`overflow-menu-${row.id}`}>
                            <OverflowMenu
                              flipped // the menu opens to the left
                              ariaLabel={`More options for ${row.id}`}
                            >
                              {!disableOverflowEdit && (
                                <OverflowMenuItem
                                  itemText="Edit"
                                  onClick={() => {
                                    const currentRecord = rawRowData[index]

                                    updateFormState({
                                      ...currentRecord,
                                      id: currentRecord.id,
                                    })

                                    updateEditingMode(EditingState.UPDATE)
                                    openModal()
                                  }}
                                />
                              )}
                              {!disableOverflowDelete && (
                                <OverflowMenuItem
                                  hasDivider
                                  isDelete
                                  itemText="Delete"
                                  onClick={() => {
                                    const currentRecord = rawRowData[index]

                                    updateFormState({
                                      ...currentRecord,
                                      id: currentRecord.id,
                                    })

                                    openDeleteModal()
                                  }}
                                />
                              )}
                            </OverflowMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          }}
        />
      </>
    </div>
  )
}

export default LTable
