import React, { useState } from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

import NotificationImportantSharpIcon from "@material-ui/icons/NotificationImportantSharp"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"

interface GraphicsCardStatusProps {
  isAlert: boolean
  lastUpdatedText: string
}

const GraphicsCardStatus: React.FC<GraphicsCardStatusProps> = ({
  isAlert = false,
  lastUpdatedText = "",
}: GraphicsCardStatusProps) => {
  return (
    <Card style={{ width: "50%" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Graphics Card Availability
        </Typography>

        {!isAlert && (
          <Typography variant="h5" component="h2">
            <span color="white">No action required</span> &nbsp;
            <CheckCircleIcon fontSize="small" style={{ color: "green" }} />
          </Typography>
        )}

        {isAlert && (
          <Typography variant="h5" component="h2">
            <span color="white">CHECK STORES IMMEDIATELY</span>
            <NotificationImportantSharpIcon style={{ color: "red" }} />
          </Typography>
        )}
      </CardContent>
      <CardActions style={{ paddingTop: "40px" }}>
        <Button size="small">Last Updated: {lastUpdatedText}</Button>
      </CardActions>
    </Card>
  )
}

export default GraphicsCardStatus
