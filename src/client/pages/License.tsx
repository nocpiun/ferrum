import { Component, ReactElement } from "react";
import Utils from "../../Utils";

const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} NriotHrreion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default class License extends Component {
    public render(): ReactElement {
        return (
            <div className="license-page">
                <div className="main-container">
                    <div className="header-container">
                        <h1>许可</h1>
                        <p>https://choosealicense.com/licenses/mit/</p>
                    </div>
                    <div className="content-container">
                        <textarea id="license-content" disabled></textarea>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        Utils.getElem("license-content").innerHTML = licenseContent;
    }
}
