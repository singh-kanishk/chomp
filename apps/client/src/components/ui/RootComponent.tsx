import React from "react"
import { Outlet } from "@tanstack/react-router"
export function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}