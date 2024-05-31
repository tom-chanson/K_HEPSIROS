import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { settings } from '../../assets/settings';
import '../../styles/components/setting.less';
import '../../styles/components/setting/sidebard.less';


export default function SidebarSettings() {
    const [collapsed, setCollapsed] = useState(true);
    const [littleScreen, setLittleScreen] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setLittleScreen(window.innerWidth < 768);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div className={'sidebar' + (collapsed ? ' collapsed' : '') + (littleScreen ? ' littleScreen' : '')}>
            <Sidebar
            rootStyles={{ height: '100vh', top: 0, zIndex: 1000, overflowY: 'auto'}}
            className={'sidebar-element'}
            collapsed={collapsed && littleScreen}
            collapsedWidth='0px'
            backgroundColor='black'
            >
            <Menu>
                {settings.map((category) => (
                    <SubMenu label={category.name} key={crypto.randomUUID()}>
                        {category.settings.map((setting) => (
                            <MenuItem component={<Link to={"/settings#" + setting.anchor} />} key={crypto.randomUUID()}>{setting.name}</MenuItem>
                        ))}
                    </SubMenu>
                ))}
            </Menu>            
            </Sidebar>
            <div className='sidebar-background'
            onClick={() => setCollapsed(true)}
            ></div>
            <div
            className={collapsed ? 'menuButtons collapsed' : 'menuButtons uncollapsed'}
            style={{ margin: '1rem', zIndex: 1001, position: 'fixed', top: 0, right: 0, backgroundColor: 'black', borderRadius: '2rem', color: 'white'}}          
        >
            <IconButton onClick={() => navigate('/calendar')} style={{padding: '0.5rem'}}>
                <ArrowBackIcon style={{color: 'white'}}/>
            </IconButton>
            {littleScreen && 
            <IconButton onClick={() => setCollapsed(!collapsed)} style={{padding: '0.5rem'}}>
                {collapsed ? <MenuIcon style={{color: 'white'}}/> : <CloseIcon style={{color: 'white'}}/>}
            </IconButton>}
        </div>
            </div>
    )
}
