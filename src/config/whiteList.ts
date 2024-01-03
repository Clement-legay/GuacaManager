import { getClientIp } from "@supercharge/request-ip";

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['http://localhost:3000', 'https://www.example.com', 'https://guacatables.alternancerouen.fr', "http://guacatables.alternancerouen.fr"]
    : ['http://localhost:3000', 'https://www.example.com'];

const allowedIpAddresses = process.env.NODE_ENV === 'production'
    ? ['0.0.0.0', 'x.x.x.x', 'x.x.x.x']
    : ['0.0.0.0', 'x.x.x.x', 'x.x.x.x'];

export function CheckWhiteList(request: Request): boolean {
    const origin = request.headers.get('origin');
    const ip = getClientIp(request);

    if (origin && allowedOrigins.includes(origin)) {
        return true;
    } else console.log("origin not allowed", origin)

    if (ip && allowedIpAddresses?.includes(ip)) {
        return true;
    } else console.log("ip not allowed", ip)

    return !!(ip && allowedIpAddresses?.includes(ip));
}