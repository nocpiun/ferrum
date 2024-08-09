import type { ReadStream } from "node:fs";

/** @see https://github.com/MattMorgis/async-stream-generator */
async function* readStreamToIterator(stream: ReadStream) {
    for await (let chunk of stream) {
        yield chunk;
    }
}

/** @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming */
function iteratorToStream(iterator: AsyncGenerator<any>): ReadableStream {
    return new ReadableStream({
        pull: async (controller) => {
            const { value, done } = await iterator.next();

            if(done) {
                controller.close();

                return;
            }

            controller.enqueue(new Uint8Array(value));
        }
    });
}

export function streamFile(stream: ReadStream): ReadableStream {
    const iterator = readStreamToIterator(stream);

    return iteratorToStream(iterator);
}
