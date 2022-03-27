import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import ListItem from "../client/components/ListItem";
import { ListItemProps } from "../client/types";

describe("ListItem Component tests", () => {
    test("Clicking test", () => {
        var testVar = "";
        var component = ReactTestUtils.renderIntoDocument<ListItemProps, React.Component<any, {}, any>>(
            <ListItem
                itemType="file"
                itemName="test.txt"
                itemSize={1.01}
                itemInfo={JSON.stringify({})}
                onClick={() => {
                    testVar = "ok";
                }}/>
        );
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "button"));
        expect(testVar).toBe("ok");
    });
});
