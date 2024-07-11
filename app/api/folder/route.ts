import { NextRequest, NextResponse } from "next/server";

import { tokenStorageKey } from "@/lib/global";

export async function GET(req: NextRequest) {
    if(!req.cookies.get(tokenStorageKey)) return NextResponse.json({ status: 401 });

    // const { searchParams } = new URL(req.url);
    // const targetPath = searchParams.get("path");
    // // console.log(targetPath);

    // // return new NextResponse("ok");
    
    // //@ts-ignore
    // if(!targetPath || !fs.existsSync(targetPath)) return NextResponse.json({ status: 404 });
    
    // //@ts-ignore
    // const stat = fs.statSync(targetPath);

    // if(!stat.isDirectory()) return NextResponse.json({ status: 400 });

    // return NextResponse.json({
    //     status: 200,
    //     //@ts-ignore
    //     items: fs.readdirSync(targetPath).map((itemName) => {
    //         //@ts-ignore
    //         const item = fs.statSync(path.join(targetPath, itemName));

    //         return {
    //             name: itemName,
    //             type: item.isDirectory() ? "folder" : "file",
    //             size: item.size
    //         };
    //     })
    // });

    return NextResponse.json({
        status: 200,
        items: [
            {
                name: "test",
                type: "folder",
                size: 1024
            }
        ]
    });
}
