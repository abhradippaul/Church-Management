"use client"

import { ReactNode, createContext, useContext } from "react";

const CreateDashboardContext = createContext({

})

const CreateDashboardProvider = CreateDashboardContext.Provider

export const useDashboardContext = () => {
  return useContext(CreateDashboardContext)
}

function DashboardProvider ({children} : {children:ReactNode}) {
    return(
        <CreateDashboardProvider value={{}}>
            {children}
        </CreateDashboardProvider>
    )
}

export default DashboardProvider