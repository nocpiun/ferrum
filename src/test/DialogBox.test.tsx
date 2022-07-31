import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import DialogBox from "../client/components/DialogBox";
import { DialogBoxProps, DialogBoxState } from "../client/types";

describe("DialogBox Component tests", () => {
    test("Rendering test", () => {
        var component = ReactTestUtils.renderIntoDocument<DialogBoxProps, React.Component<DialogBoxProps, DialogBoxState, any>>(
            <DialogBox title="Test" id="test">
                <p>HelloWorld</p>
            </DialogBox>
        );
        var closeBtn = ReactTestUtils.findRenderedDOMComponentWithTag(component, "button");

        expect(closeBtn.innerHTML).toBe("关闭");
        
        ReactTestUtils.Simulate.click(closeBtn);
        expect(component.state.isOpen).toBeFalsy();
    });
});
