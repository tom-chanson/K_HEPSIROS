import FormSettings from "./form";
import SidebarSettings from "./sidebar";

// import { useLocation } from "react-router-dom";
// import React from "react";

export default function SettingsPage() {
    
    return (
        <div className='setting-grid'>
            <SidebarSettings />
            <FormSettings />
        </div>
    )
}