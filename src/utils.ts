function isNotNullAndSuperior(arg: any) : boolean {
    return arg != null && arg > 0;
};

function randomValue(min: number, max: number) : number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function getJsonData<T>(url: string) : Promise<T> {

    const res = await fetch(url);

    if (!res.ok) {
        console.error("An error occured for the request to the endpoint " + url + " " + " status error: " + res.status);
        throw new Error("Failed to load JSON from " + url);
    }

    return res.json() as T;
}

export default {
    isNotNullAndSuperior,
    randomValue,
    getJsonData,
};