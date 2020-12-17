import React, { useState } from "react"
import { ProductPageStatus, Stocked } from "./api/shared"

import Button from "@material-ui/core/Button"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"

interface GraphicsCardTableProps {
  statuses: ProductPageStatus[]
}

const headers = [
  {
    header: "Vendor",
    key: "vendorName",
  },
  {
    header: "Product Name",
    key: "Name",
  },
  {
    header: "Status",
    key: "status",
  },
  {
    header: "Purchase",
    key: "link",
  },
]

const GraphicsCardTable: React.FC<GraphicsCardTableProps> = ({
  statuses,
}: GraphicsCardTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.key}>{header.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {statuses
            .filter((s) => s !== null)
            .map((status: ProductPageStatus) => {
              return (
                <TableRow key={JSON.stringify(status)}>
                  <TableCell>{status.vendorName}</TableCell>
                  <TableCell>{status.name}</TableCell>
                  <TableCell>{status.status}</TableCell>
                  <TableCell>
                    <Button
                      color={
                        status.status === Stocked.IN_STOCK
                          ? "primary"
                          : "default"
                      }
                      variant="contained"
                      href={status.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {status.status === Stocked.IN_STOCK
                        ? "Buy"
                        : "Unavailable"}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GraphicsCardTable
