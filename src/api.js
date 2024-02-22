import { host } from "./constants";


function justTokenArgs(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      token: args.token,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    return requestOptions;
}

export function login(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: args.username,
      password: args.password,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export function register(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: args.username,
      email: args.email,
      password: args.password,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export function home_muscles(args){
    return justTokenArgs(args);
}
export function user(args){
    return justTokenArgs(args);
}
export function templates_exercises(args){
    return justTokenArgs(args);
}
export function templates_workouts(args){
    return justTokenArgs(args);
}
export function workouts_date(args){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      token: args.token,
      date: args.date,
      location: "web",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return requestOptions;
}
export async function CallApi(route, args) {
    const apiFunctions = 
    {   login,
        register,
        user,

        home_muscles,
        templates_exercises,
        templates_workouts,
        workouts_date
    }; 
    const apiFunc = apiFunctions[route.replace("/","_")]; // Get the corresponding API function based on the route
    if (!apiFunc) {
        throw new Error(`${route} is not a valid function`);
    }

    const requestOptions = apiFunc(args);

    try {
        const response = await fetch(`http://${host}:3001/api/${route}`, requestOptions);
        const data = await response.json();
        console.log(data)
        return data; // Return the data from the API call
    } catch (error) {
        throw error; // Throw any errors that occur during the API call
    }
}