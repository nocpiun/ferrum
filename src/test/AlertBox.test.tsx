import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import AlertBox from "../client/components/AlertBox";
import { AlertBoxProps } from "../client/types";

describe("AlertBox Component tests", () => {
    test("Rendering test", () => {
        var component = ReactTestUtils.renderIntoDocument<AlertBoxProps, React.Component<any, {}, any>>(
            <AlertBox variant="primary" heading="Test" alertId={1}/>
        );
        var closeBtn = ReactTestUtils.findRenderedDOMComponentWithTag(component, "button");
        
        expect(closeBtn.innerHTML).toBe("关闭");
        expect(closeBtn.classList.contains("btn-outline-primary")).toBeTruthy();
    });
});
