export const API_URL = "http://127.0.0.1:8000";

export async function newEndeavor(items: {name: string, amount: number}[], world: string) {
    let endpoint = "/newendeavor"
    let body = JSON.stringify({
        world_name: world,
        items: items
    })
    console.log(body);
    let response = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            world_name: world,
            items: items
        })
    })
    if (response.ok){
        return await response.json();
    }
}