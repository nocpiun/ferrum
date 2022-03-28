import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import ListItem from "../client/components/ListItem";
import { ListItemProps, ListItemState } from "../client/types";
import Utils from "../Utils";

describe("ListItem Component tests", () => {
    test("Clicking test", async () => {
        var component = ReactTestUtils.renderIntoDocument<ListItemProps, React.Component<ListItemProps, ListItemState, any>>(
            <ListItem
                itemType="file"
                itemName="test.txt"
                itemSize={1.01}
                itemInfo={JSON.stringify({})}
                itemPath="C:/a/b/c/d/test.txt"
                onClick={() => {}}/>
        );
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "button"));
        await Utils.sleep(250);
        expect(component.state.isSelected).toBeTruthy();
        
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "button"));
        await Utils.sleep(250);
        expect(component.state.isRenaming).toBeTruthy();
    });
});
