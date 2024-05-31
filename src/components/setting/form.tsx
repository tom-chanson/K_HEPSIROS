import { settings } from "../../assets/settings";


// import { Switch } from '@mui/base/Switch';

//color
import { TwitterPicker } from 'react-color'

import { Button } from '@mui/material';
//number from mui
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Anchor from "../anchor";
import ModalSettings from "./modal";

export default function FormSettings() {
        return (
            <div className='setting-form'>
                {settings.map((category) => (
                    <div key={crypto.randomUUID()} className="category-setting">
                        <h2>{category.name}</h2>
                        {category.settings.map((setting) => (
                            <div key={crypto.randomUUID()}>
                                <Anchor id={setting.anchor} />
                                <h3>{setting.name}</h3>
                                <p>{setting.description}</p>
                                {setting.type === "choice" ? (
                                    <Select defaultValue={setting.default}>
                                        {setting.choices.map((choice) => (
                                            <MenuItem value={choice.value} key={crypto.randomUUID()}>{choice.label}</MenuItem>
                                        ))}
                                    </Select>
                                ) : setting.type === "number" ? (
                                    <Input type="number" defaultValue={setting.default} inputProps={{ min: setting.min, max: setting.max }} />
                                ) : setting.type === "boolean" ? (
                                    // <Switch defaultChecked={setting.default} />
                                    <div></div>
                                ) : setting.type === "color" ? (
                                    <TwitterPicker color={setting.default} />
                                ) : setting.type === "popin" ? (
                                    //bouton pour ouvrir la popin
                                    <ModalSettings
                                        label={setting.label}
                                        popinTitle={setting.popinTitle}
                                        popinText={setting.popinText}
                                        buttonText={setting.buttonText}
                                        popinButtons={setting.popinButtons}
                                    />
                                ) : setting.type === "list-button" ? (
                                    <div>
                                        <Button>{setting.label}</Button>
                                        <div>
                                            <h3>{setting.name}</h3>
                                            <p>{setting.description}</p>
                                            {setting.buttons.map((button) =>
                                                <Button key={crypto.randomUUID()}>{button.text}</Button>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
    )
}