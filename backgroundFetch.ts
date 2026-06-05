import {API_URL} from "./requests.js";
import type {World, DataCenter} from "./types.js";

export async function dcFetch() {
    let endpoint = "/worlds"
    let response = await fetch(API_URL + endpoint, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok){
        let parsed = await response.json();
        let datacenters: DataCenter[] = parsed.datacenters;
        return datacenters;
    }
    return;
}