import React, { ReactElement, useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import Axios from "axios";

import PluginLoader from "../../../plugin/PluginLoader";
import { pluginUrl, pluginListUrl } from "../../global";
import { PluginListResponse } from "../../types";
import Utils from "../../../Utils";

const PluginInstaller: React.FC = () => {
    const [pluginList, setPluginList] = useState<ReactElement>(<></>);

    const handleInstall = async (path: string) => {
        const res = await Axios.get<string>(pluginUrl + path);
        const script = res.data;
        
        await PluginLoader.get().loadExternalPlugin(script);
        window.location.reload();
    };

    /** @todo handleUpdate() */

    useEffect(() => {
        Axios.get<PluginListResponse>(pluginListUrl)
            .then((res) => {
                const fetched = res.data.pluginList;

                setPluginList(
                    <>
                        {fetched.map((plugin, i) => {
                            return (
                                <ListGroup.Item title={plugin.name} key={i}>
                                    <span className="plugin-name">{plugin.name}</span>

                                    <Button
                                        className="small-button"
                                        onClick={() => handleInstall(plugin.path)}
                                        variant="success">{Utils.$("settings.plugin.installer.install")}</Button>
                                    <span className="plugin-version">{plugin.version}</span>
                                </ListGroup.Item>
                            );
                        })}
                    </>
                );
            })
            .catch((err) => {throw err});
    }, []);

    return (
        <div className="plugin-installer">
            <ListGroup className="plugin-list">
                {pluginList}
            </ListGroup>
        </div>
    );
}

export default PluginInstaller;
