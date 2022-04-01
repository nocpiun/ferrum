import ReactTestUtils from "react-dom/test-utils";
import StarredItem from "../client/components/StarredItem";
import { StarredItemProps } from "../client/types";
import config from "../config";

const root = config.explorer.root;

describe("StarredItem Component tests", () => {
    test("Path test", () => {
        var component = ReactTestUtils.renderIntoDocument<StarredItemProps, React.Component<any, {}, any>>(<StarredItem itemPath="C://asdf" key={0}/>);
        expect(component.props.itemPath.replace(root +"/", "")).toBe("/asdf");
    });
});
