import {RateLimiter} from "limiter";
import {NextResponse} from "next/server";

const intervalIter = process.env.LIMITER_INTERVAL ? parseInt(process.env.LIMITER_INTERVAL) : 100;

const iterations: iterationSpecs = {
    "GET": process.env.LIMITER_GET_ITERATIONS ? parseInt(process.env.LIMITER_GET_ITERATIONS) : 1,
    "POST": process.env.LIMITER_POST_ITERATIONS ? parseInt(process.env.LIMITER_POST_ITERATIONS) : 1,
    "PUT": process.env.LIMITER_PUT_ITERATIONS ? parseInt(process.env.LIMITER_PUT_ITERATIONS) : 1,
    "DELETE": process.env.LIMITER_DELETE_ITERATIONS ? parseInt(process.env.LIMITER_DELETE_ITERATIONS) : 1,
    "PATCH": process.env.LIMITER_PATCH_ITERATIONS ? parseInt(process.env.LIMITER_PATCH_ITERATIONS) : 1,
}

type iterationSpecs = {
    "GET": number,
    "POST": number,
    "PUT": number,
    "DELETE": number,
    "PATCH": number,
}

export const limiter = new RateLimiter({
    tokensPerInterval: intervalIter,
    interval: "second",
    fireImmediately: true
})

export async function CheckLimiter(request: Request, method: keyof iterationSpecs) {
    const matchingIterations = iterations[method];
    const remaining = await limiter.removeTokens(matchingIterations);
    console.log(remaining)
    if (remaining < 1) {
        const origin = request.headers.get('origin');

        return new NextResponse(null, {
            status: 429,
            statusText: "Too Many Requests",
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'text/plain',
            }
        });
    }
}